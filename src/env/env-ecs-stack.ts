import {EnvProps, EnvStackServicesProps} from "./env-definitions";
import {Construct} from "constructs";
import {StackProps} from "aws-cdk-lib";
import {Cluster, ICluster} from "aws-cdk-lib/aws-ecs";
import {EnvBaseStack, EnvConfig, EnvParameters} from "./env-base-stack";
import {ApplicationListenerRule, HealthCheck, IApplicationTargetGroup} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import {Queue} from "aws-cdk-lib/aws-sqs";
import {EcrRepositoryFactory} from "../ecr/ecr-repository-factory";
import {AlbListenerRuleProps} from "../alb/alb-listener-rule";
import {AlbTargetGroupProps} from "../alb/alb-target-group";
import {EcsStandardServiceConfigProps} from "../ecs/ecs-standard-service-factory";
import {EcsTaskConfigProps} from "../ecs/ecs-task-factory";
import {StartStopFactory, StartStopFactoryProps} from "../start-stop/start-stop-factory";
import {EcsQueueConfigProps} from "../ecs/ecs-queue-factory";
import {FargateFactory, FargateTasksAndServices} from "../ecs/fargate-factory";
import {PermissionsEnvEcsStack} from "../permissions/permissions-env-ecs-stack";
import {ConfigStackProps} from "../config/config-stack";
import {ClusterFactory} from "../ecs/cluster-factory";
import {Secrets} from "../secret/secrets";

export interface EnvTasksAndServicesProps {
    readonly cluster: Cluster;
    readonly targetGroup: IApplicationTargetGroup;
    readonly repositoryFactory: EcrRepositoryFactory;
    readonly environment?: Record<string, any>;
    readonly queue?: Queue;
}

export interface EnvEcsParameters extends EnvParameters {
    readonly canCreateTask?: boolean;
    readonly healthCheck?: HealthCheck;
    readonly listenerRule: AlbListenerRuleProps;
    readonly targetGroup: AlbTargetGroupProps;
    readonly services: EcsStandardServiceConfigProps[];
    readonly tasks: EcsTaskConfigProps[];
    readonly startStop?: StartStopFactoryProps;
    readonly queue?: EcsQueueConfigProps;
    readonly containerInsights?: boolean;
}

export interface EnvEcsProps extends EnvProps {
    readonly repositoryFactory: EcrRepositoryFactory;
}

export interface EnvEcsStackServicesProps extends EnvStackServicesProps {
    readonly cluster: Cluster;
    readonly listenerRule: ApplicationListenerRule;
    readonly repositoryFactory: EcrRepositoryFactory;
    readonly targetGroup: IApplicationTargetGroup;
    readonly tasksAndServices: FargateTasksAndServices;
    readonly startStop?: StartStopFactory;
}

export class EnvEcsStack<T extends EnvConfig> extends EnvBaseStack<T> {

    envProps: EnvEcsProps;

    constructor(scope: Construct, id: string, config: T, configStackProps: ConfigStackProps, stackProps: StackProps, envProps: EnvEcsProps) {
        super(scope, id, config, configStackProps, stackProps);
        this.envProps = envProps;
    }

    exec() {
        const aRecord = this.createARecord();
        const sesVerify = this.createSesVerifyDomain();
        this.createARecordsForCertificates();
        const certificates = this.createCertificates();
        this.createListenerCertificates(certificates);
        const targetGroup = this.createTargetGroup();
        const listenerRule = this.createListenerRule(targetGroup);
        const healthCheck = this.configureTargetGroupHealthCheck(targetGroup);
        const table = this.createDynamoDbTable();
        const queue = this.createQueues();
        const s3 = this.createS3Bucket();
        const cluster = this.createCluster();
        const secrets = this.lookups.secrets;
        const tasksAndServices = this.createTasksAndServices({
            cluster: cluster,
            targetGroup: targetGroup,
            queue: queue,
            repositoryFactory: this.envProps.repositoryFactory,
            environment: this.getEnvironment({
                table: table,
                queue: queue,
                s3: s3
            })
        }, secrets);
        const startStopFactory = this.createStartStopFactory(cluster);
        new PermissionsEnvEcsStack(this, this.node.id, {
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
            table: table,
            secrets: this.lookups.secret,
            sharedSecrets: this.lookups.sharedSecret
        });
    }

    private createCluster(): Cluster {
        const clusterFactory = new ClusterFactory(this, this.node.id, {
            vpc: this.lookups.vpc,
            alarmEmails: this.config.Parameters?.alarmEmails ?? [],
            containerInsights: this.config.Parameters?.containerInsights ?? false,
        });
        return clusterFactory.create();
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

    private createTasksAndServices(props: EnvTasksAndServicesProps, secrets: Secrets): FargateTasksAndServices {
        const factory = new FargateFactory(this, this.node.id, {
            commandFactoryProps: {},
            containerFactoryProps: {
                repositoryFactory: this.envProps.repositoryFactory,
                secretKeys: this.config.Parameters?.secretKeys,
                sharedSecretKeys: this.config.Parameters?.sharedSecretKeys,
                environment: props.environment,
                secrets: secrets
            },
            queueFactoryProps: {
                cluster: props.cluster,
                repositoryFactory: this.envProps.repositoryFactory,
                secretKeys: this.config.Parameters?.secretKeys,
                sharedSecretKeys: this.config.Parameters?.sharedSecretKeys,
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
}