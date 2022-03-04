import {EnvConfig, EnvEnvironmentProps, EnvProps, EnvTasksAndServicesProps} from "./env-definitions";
import {ConfigStack, ConfigStackProps} from "../config";
import {Construct} from "constructs";
import {Duration, StackProps, Tags} from "aws-cdk-lib";
import {
    ApplicationListenerRule,
    IApplicationListener,
    IApplicationLoadBalancer,
    IApplicationTargetGroup
} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import {IVpc} from "aws-cdk-lib/aws-ec2";
import {AlbHelper, NamingHelper, VpcHelper} from "../utils";
import {Route53ARecord} from "../route53";
import {ARecord} from "aws-cdk-lib/aws-route53";
import {SesVerifyDomain, VerifySesDomain} from "../ses";
import {AlbListenerRule, AlbTargetGroup} from "../alb";
import {Table} from "aws-cdk-lib/aws-dynamodb";
import {Dynamodb} from "../dynamodb";
import {Queue} from "aws-cdk-lib/aws-sqs";
import {Sqs} from "../sqs";
import {Bucket} from "aws-cdk-lib/aws-s3";
import {S3Bucket} from "../s3";
import {Cluster, ICluster} from "aws-cdk-lib/aws-ecs";
import {ClusterFactory, FargateFactory, FargateTasksAndServices} from "../ecs";
import {Secrets} from "../secret";
import {StartStopFactory} from "../start-stop";
import {PermissionsEnvStack} from "../permissions";

export class EnvStack<T extends EnvConfig> extends ConfigStack {

    alb!: IApplicationLoadBalancer;
    envProps: EnvProps;
    listener!: IApplicationListener;
    vpc!: IVpc;

    constructor(scope: Construct, id: string, config: T, envProps: EnvProps, configStackProps?: ConfigStackProps, stackProps?: StackProps) {
        super(scope, id, config, configStackProps, stackProps);
        this.envProps = envProps;
        Tags.of(scope).add('College', config.College);
        Tags.of(scope).add('Environment', config.Environment);
        Tags.of(scope).add('App', config.Name);
    }

    preBuild() {
        const albArn = AlbHelper.getAlbArnFromConfigOrParam(this, this.config);
        this.listener = AlbHelper.getApplicationListener(this, this.config, albArn);
        this.alb = AlbHelper.getAlbByArn(this, albArn);
        this.vpc = this.alb.vpc ?? VpcHelper.getVpcFromConfig(this, this.config);
    }

    exec() {
        const aRecord = this.createARecord();
        const sesVerify = this.createSesVerifyDomain();
        const targetGroup = this.createTargetGroup();
        const listenerRule = this.createListenerRule(targetGroup);
        const table = this.createDynamoDbTable();
        const queue = this.createQueues();
        const s3 = this.createS3Bucket();
        const cluster = this.createCluster();
        const tasksAndServices = this.createTasksAndServices({
            cluster: cluster,
            targetGroup: targetGroup,
            repositoryFactory: this.envProps.repositoryFactory,
            environment: this.getEnvironmentForContainers({
                table: table,
                queue: queue,
                s3: s3
            })
        });
        const startStopFactory = this.createStartStopFactory(cluster);
        new PermissionsEnvStack(this, this.node.id, {
            cluster: cluster,
            listenerRule: listenerRule,
            repositoryFactory: this.envProps.repositoryFactory,
            targetGroup: targetGroup,
            tasksAndServices: tasksAndServices,
            aRecord: aRecord,
            queue: queue,
            s3: s3,
            sesVerify: sesVerify,
            startStop: startStopFactory,
            table: table
        });
    }

    private createARecord(): ARecord | undefined {
        const aRecord = new Route53ARecord(this, this.getName('arecord'), this.alb, this.config.Parameters?.hostedZoneDomain);
        return aRecord.createARecord(this.config.Parameters?.subdomain);
    }

    private createCluster(): Cluster {
        const clusterFactory = new ClusterFactory(this, this.node.id, {
            vpc: this.vpc,
            alarmEmails: this.config.Parameters?.alarmEmails ?? [],
            containerInsights: this.config.Parameters?.containerInsights ?? false,
        });
        return clusterFactory.create();
    }

    private createDynamoDbTable(name = 'cache'): Table | undefined {
        if (this.config.Parameters?.dynamoDb) {
            const dynamoDb = new Dynamodb(this, this.node.id);
            return dynamoDb.create(name, this.config.Parameters.dynamoDb);
        }
    }

    private createListenerRule(targetGroup: IApplicationTargetGroup): ApplicationListenerRule {
        const config = <EnvConfig>this.config;
        const albListenerRule = new AlbListenerRule(this, this.getName('listener-rule'), this.listener, config.Parameters.listenerRule);
        return albListenerRule.createListenerRule(targetGroup);
    }

    private createQueues(): Queue | undefined {
        if (this.config.Parameters?.queue) {
            let deadLetter: Queue | undefined = undefined;
            if (this.config.Parameters.queue.hasDeadLetterQueue ?? false) {
                deadLetter = this.createQueueDeadLetter();
            }
            return this.createQueueDefault(deadLetter);
        }
    }

    private createQueueDefault(deadLetterQueue?: Queue): Queue {
        const sqs = new Sqs(this, this.node.id);
        const props: Record<string, any> = {};
        if (deadLetterQueue) {
            props['deadLetterQueue'] = {
                queue: deadLetterQueue,
                maxReceiveCount: this.config.Parameters?.queue?.maxReceiveCount ?? 3
            }
        }
        const queue = sqs.create(props);
        if (this.config.Parameters?.queue) {
            this.config.Parameters.queue.queue = queue;
        }
        return queue;
    }

    private createQueueDeadLetter(): Queue {
        const sqs = new Sqs(this, this.node.id);
        const duration = Duration.days(this.config.Parameters?.queue?.retentionPeriodInDays ?? 3);
        return sqs.create({
            queueName: 'dlq',
            retentionPeriod: duration
        });
    }

    private createS3Bucket(name = 's3'): Bucket | undefined {
        if (this.config.Parameters?.s3) {
            const s3 = new S3Bucket(this, this.node.id);
            return s3.create(name, this.config.Parameters.s3);
        }
    }

    private createSesVerifyDomain(): VerifySesDomain | undefined {
        if (this.config.Parameters?.hostedZoneDomain && this.config.Parameters?.subdomain) {
            const ses = new SesVerifyDomain(this, this.node.id);
            return ses.verifyDomain({
                subdomain: this.config.Parameters.subdomain,
                hostedZone: this.config.Parameters.hostedZoneDomain
            });
        }
    }

    private createStartStopFactory(cluster: ICluster): StartStopFactory | undefined {
        if (this.config.Parameters?.startStop) {
            const startStopProps = this.config.Parameters?.startStop ?? {};
            const startStopFunctionProps = startStopProps.stopStartFunctionProps ?? {};
            startStopFunctionProps.cluster = cluster;
            startStopProps.stopStartFunctionProps = startStopFunctionProps;
            const factory = new StartStopFactory(this, this.node.id, startStopProps);
            factory.createRules(cluster);
            return factory;
        }
    }

    private createTargetGroup(): IApplicationTargetGroup {
        const albTargetGroup = new AlbTargetGroup(this, this.getName('tg'), this.vpc, <EnvConfig>this.config);
        return albTargetGroup.createApplicationTargetGroup();
    }

    private createTasksAndServices(props: EnvTasksAndServicesProps): FargateTasksAndServices {
        const secrets = new Secrets(this, this.node.id);
        const factory = new FargateFactory(this, this.node.id, {
            commandFactoryProps: {},
            containerFactoryProps: {
                repositoryFactory: this.envProps.repositoryFactory,
                secretKeys: this.config.Parameters?.secretKeys,
                environment: props.environment,
                secrets: secrets
            },
            queueFactoryProps: {
                cluster: props.cluster,
                repositoryFactory: this.envProps.repositoryFactory,
                secretKeys: this.config.Parameters?.secretKeys,
                environment: props.environment,
                secrets: secrets,
                queue: props.queue
            },
            standardServiceFactoryProps: {
                cluster: props.cluster,
                targetGroup: props.targetGroup
            },
            taskDefinitionFactoryProps: {},
            taskFactoryProps: {
                cluster: props.cluster,
                skipCreateTask: this.config.Parameters?.canCreateTask ?? true
            }
        });
        return factory.create(this.config.Parameters?.tasks ?? [], this.config.Parameters?.services ?? [], this.config.Parameters?.queue);
    }

    private getEnvironmentForContainers(envProps: EnvEnvironmentProps): Record<string, string> {
        const props: Record<string, string> = {};
        if (this.config.Parameters?.subdomain && this.config.Parameters?.hostedZoneDomain) {
            const mailFromDomain = `${this.config.Parameters.subdomain}.${this.config.Parameters.hostedZoneDomain}`;
            props['MAIL_FROM_ADDRESS'] = `no-reply@${mailFromDomain}`;
            props['IMPORTER_FROM'] = `importer-no-reply@${mailFromDomain}`;
        }
        if (envProps.table) {
            props['DYNAMODB_CACHE_TABLE'] = envProps.table.tableName
        }
        if (envProps.queue) {
            props['SQS_QUEUE'] = envProps.queue.queueUrl;
        }
        if (envProps.s3) {
            props['AWS_BUCKET'] = envProps.s3.bucketName;
        }
        props['CAN_RUN_CREATE'] = this.config.Parameters?.canCreateTask === false ? '0' : '1';
        return props;
    }

    private getName(suffix: string): string {
        return NamingHelper.fromParts([this.node.id, suffix]);
    }
}