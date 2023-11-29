import {Construct} from "constructs";
import {Duration, StackProps, Stage, Tags} from "aws-cdk-lib";
import {
    ApplicationListenerCertificate,
    ApplicationListenerRule,
    ApplicationTargetGroup, IApplicationListener,
    IApplicationLoadBalancer,
    IApplicationTargetGroup
} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import {IDistribution} from "aws-cdk-lib/aws-cloudfront";
import {ARecord} from "aws-cdk-lib/aws-route53";
import {Table} from "aws-cdk-lib/aws-dynamodb";
import {Queue} from "aws-cdk-lib/aws-sqs";
import {Bucket} from "aws-cdk-lib/aws-s3";
import {PreBuildLookups} from "./pre-build-lookups";
import {BaseParameters, StackConfig} from "../config/config-definitions";
import {EnvEcsParameters} from "./env-ecs-stack";
import {EnvLambdaParameters} from "./env-lambda-stack";
import {Dynamodb, DynamoDbProps} from "../dynamodb/dynamodb";
import {S3Bucket, S3Props} from "../s3/s3-bucket";
import {EnvBuildType, EnvEndpointType, EnvEnvironmentProps} from "./env-definitions";
import {ConfigStack, ConfigStackProps} from "../config/config-stack";
import {AlbTargetGroupHealthCheck} from "../alb/alb-target-group-health-check";
import {EnvBuildTypeHelper} from "../utils/env-build-type-helper";
import {Route53ARecord} from "../route53/route53-a-record";
import {AlbListenerRule} from "../alb/alb-listener-rule";
import {Sqs} from "../sqs/sqs";
import {VerifySesDomain} from "../ses/verify-ses-domain";
import {AlbTargetGroup, AlbTargetGroupProps} from "../alb/alb-target-group";
import {NamingHelper} from "../utils/naming-helper";
import {SesVerifyDomain} from "../ses/ses-verify-domain";
import {Route53Helper} from "../utils/route53-helper";
import {AcmCertificate, DnsValidatedCertificateProps} from "../acm/acm-certificate";
import {Certificate} from "aws-cdk-lib/aws-certificatemanager";
import {EmailIdentity} from "aws-cdk-lib/aws-ses";
import {DkimIdentity} from "../ses/dkim-identity";

export interface EnvConfig extends StackConfig {
    readonly Parameters: EnvEcsParameters | EnvLambdaParameters;
}

export interface EnvParameters extends BaseParameters {
    readonly deploy?: boolean;
    readonly hostedZoneDomain?: string;
    readonly dynamoDb?: DynamoDbProps;
    readonly subdomain?: string;
    readonly alarmEmails?: string[];
    readonly s3?: S3Props;
    readonly secretKeys?: string[];
    readonly steps?: Record<string, object>;
    readonly buildType?: EnvBuildType;
    readonly endpointType?: EnvEndpointType;
    readonly certificates?: DnsValidatedCertificateProps[];
}

export abstract class EnvBaseStack<T extends EnvConfig> extends ConfigStack {

    lookups!: PreBuildLookups;
    readonly buildType: EnvBuildType;
    readonly endpointType: EnvEndpointType;

    constructor(scope: Construct, id: string, config: T, configStackProps: ConfigStackProps, stackProps: StackProps) {
        super(scope, id, config, configStackProps, stackProps);
        Tags.of(scope).add('College', config.College);
        Tags.of(scope).add('Environment', config.Environment);
        Tags.of(scope).add('App', config.Name);
        this.buildType = EnvBuildTypeHelper.getType(config);
        this.endpointType = config.Parameters.endpointType ?? EnvEndpointType.LOADBALANCER;
    }

    preBuild() {
        this.lookups = new PreBuildLookups(this, this.node.id, <EnvConfig>this.config, this.buildType);
    }

    protected getAliasTarget(): IApplicationLoadBalancer | IDistribution {
        return this.lookups.getAliasTarget();
    }

    protected configureTargetGroupHealthCheck(targetGroup: ApplicationTargetGroup): AlbTargetGroupHealthCheck {
        const healthCheck = new AlbTargetGroupHealthCheck(this, this.getName('tg'), {
            healthCheck: this.config.Parameters.healthCheck,
            alarmEmails: this.config.Parameters.alarmEmails ?? []
        });
        healthCheck.addHealthCheck(targetGroup);
        return healthCheck;
    }

    protected createARecord(): ARecord | undefined {
        const aRecord = new Route53ARecord(this, this.node.id, this.getAliasTarget(), this.config.Parameters?.hostedZoneDomain);
        return aRecord.createARecord(this.config.Parameters?.subdomain);
    }

    protected createARecordsForCertificates(): ARecord[] {
        const aRecords: ARecord[] = [];
        const aRecordFactory = new Route53ARecord(this, this.node.id, this.getAliasTarget(), this.config.Parameters?.hostedZoneDomain);
        for (const certProps of this.config.Parameters.certificates ?? []) {
            if (certProps.domainName !== this.getDefaultDomainName()) {
                const r = aRecordFactory.createARecordForDomain(certProps.domainName);
                if (r) {
                    aRecords.push(r);
                }
            }
        }
        return aRecords;
    }

    protected getDefaultDomainName(): string | undefined {
        if (this.config.Parameters.subdomain && this.config.Parameters.hostedZoneDomain) {
            return `${this.config.Parameters.subdomain}.${this.config.Parameters.hostedZoneDomain}`;
        }
    }

    protected createDkimDomainIdentity(): EmailIdentity | undefined {
        const domain = this.getDefaultDomainName();
        if (domain) {
            const ses = new DkimIdentity(this, this.node.id, this.config.Parameters.hostedZoneDomain);
            return ses.createForDomain(domain);
        }
    }

    protected createListenerCertificates(certificates: Certificate[]): ApplicationListenerCertificate | undefined {
        if (this.lookups.albListener && certificates.length > 0) {
            return new ApplicationListenerCertificate(this, this.mixNameWithId('listener-certificates'), {
                listener: this.lookups.albListener,
                certificates: certificates
            });
        }
    }

    protected createCertificates(): Certificate[] {
        const certificates: Certificate[] = [];
        for (const certProps of this.config.Parameters.certificates ?? []) {
            certificates.push(this.createCertificate(certProps));
        }
        return certificates;
    }

    protected createCertificate(props: DnsValidatedCertificateProps): Certificate {
        const certFactory = new AcmCertificate(this, this.node.id);
        return certFactory.create(props);
    }

    protected createDynamoDbTable(name = 'cache'): Table | undefined {
        if (this.config.Parameters?.dynamoDb) {
            const dynamoDb = new Dynamodb(this, this.node.id);
            return dynamoDb.create(name, this.config.Parameters.dynamoDb);
        }
    }

    protected createListenerRule(targetGroup: IApplicationTargetGroup): ApplicationListenerRule {
        const albListenerRule = new AlbListenerRule(this, this.getName('listener-rule'), this.lookups.albListener);
        return albListenerRule.create(targetGroup, this.config.Parameters.listenerRule);
    }

    protected createQueues(): Queue | undefined {
        if (this.config.Parameters?.queue) {
            let deadLetter: Queue | undefined = undefined;
            if (this.config.Parameters.queue.hasDeadLetterQueue ?? false) {
                deadLetter = this.createQueueDeadLetter();
            }
            return this.createQueueDefault(deadLetter);
        }
    }

    protected createQueueDefault(deadLetterQueue?: Queue): Queue {
        const sqs = new Sqs(this, this.node.id);
        const props: Record<string, any> = {};
        if (deadLetterQueue) {
            props['deadLetterQueue'] = {
                queue: deadLetterQueue,
                maxReceiveCount: this.config.Parameters?.queue?.maxReceiveCount ?? 3
            }
        }
        return sqs.create(props);
    }

    protected createQueueDeadLetter(): Queue {
        const sqs = new Sqs(this, this.node.id);
        const duration = Duration.days(this.config.Parameters?.queue?.retentionPeriodInDays ?? 3);
        return sqs.create({
            queueName: 'dlq',
            retentionPeriod: duration
        });
    }

    protected createS3Bucket(name = 's3'): Bucket | undefined {
        if (this.config.Parameters?.s3) {
            const s3 = new S3Bucket(this, this.node.id);
            return s3.create(name, this.config.Parameters.s3);
        }
    }

    protected createSesVerifyDomain(): VerifySesDomain | undefined {
        if (this.config.Parameters?.hostedZoneDomain && this.config.Parameters?.subdomain) {
            const ses = new SesVerifyDomain(this, this.node.id);
            return ses.verifyDomain({
                subdomain: this.config.Parameters.subdomain,
                hostedZone: this.config.Parameters.hostedZoneDomain
            });
        }
    }

    protected createTargetGroup(): ApplicationTargetGroup {
        const albTargetGroup = new AlbTargetGroup(this, this.getName('tg'), this.lookups.vpc);
        return albTargetGroup.create(this.getTargetGroupParams());
    }

    protected getTargetGroupParams(): AlbTargetGroupProps
    {
        return this.config.Parameters?.targetGroup ?? {}
    }

    protected getEnvironment(envProps: EnvEnvironmentProps): Record<string, string> {
        const props: Record<string, string> = {};
        const domain = Route53Helper.getDomainFromConfig(this.config);
        if (domain) {
            props['MAIL_FROM_ADDRESS'] = `no-reply@${domain}`;
            props['IMPORTER_FROM'] = `importer-no-reply@${domain}`;
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
        if (this.lookups.secret) {
            props['AWS_SECRET_ARN'] = this.lookups.secret.secretFullArn ?? '';
        }
        props['AWS_APP_NAME'] = this.node.id;
        props['CAN_RUN_CREATE'] = this.config.Parameters?.canCreateTask === false ? '0' : '1';
        return props;
    }

    protected getName(suffix: string): string {
        return NamingHelper.fromParts([this.node.id, suffix]);
    }
}