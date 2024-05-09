import {NonConstruct} from "../../../core/non-construct";
import {MakeConfig} from "../make-definitions";
import {Construct} from "constructs";
import {PreBuildLookups} from "../../../env/pre-build-lookups";
import {ApplicationListenerCertificate, IApplicationLoadBalancer} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import {IDistribution} from "aws-cdk-lib/aws-cloudfront";
import {ARecord} from "aws-cdk-lib/aws-route53";
import {Route53ARecord} from "../../../route53/route53-a-record";
import {AcmCertificate, DnsValidatedCertificateProps} from "../../../acm/acm-certificate";
import {Certificate} from "aws-cdk-lib/aws-certificatemanager";
import {Table} from "aws-cdk-lib/aws-dynamodb";
import {Dynamodb} from "../../../dynamodb/dynamodb";
import {Queue} from "aws-cdk-lib/aws-sqs";
import {Sqs, SqsProps} from "../../../sqs/sqs";
import {Duration} from "aws-cdk-lib";
import {Bucket} from "aws-cdk-lib/aws-s3";
import {S3Bucket} from "../../../s3/s3-bucket";
import {ISecret} from "aws-cdk-lib/aws-secretsmanager";
import {VerifySesDomain} from "@seeebiii/ses-verify-identities";
import {Route53Helper} from "../../../utils/route53-helper";
import {VerifyDomainWrapper} from "../../../ses/verify-domain-wrapper";

export interface CoreMakeResources {
    aRecord?: ARecord;
    sesVerify?: VerifySesDomain;
    certificates: Certificate[];
    table?: Table;
    queue?: Queue;
    s3?: Bucket;
    secret?: ISecret;
    sharedSecret?: ISecret;
}

export class MakeCoreResources extends NonConstruct {

    config: MakeConfig;
    lookups: PreBuildLookups;

    constructor(scope: Construct, id: string, config: MakeConfig, lookups: PreBuildLookups) {
        super(scope, id);
        this.config = config;
        this.lookups = lookups;
    }

    create(): CoreMakeResources {
        const aRecord = this.createARecord();
        const sesVerify = this.createSesVerifyDomain();
        const certificates = this.createCertificates();
        this.createListenerCertificates(certificates);
        const table = this.createDynamoDbTable();
        const queue = this.createQueues();
        const s3 = this.createS3Bucket();
        return {
            aRecord: aRecord,
            sesVerify: sesVerify,
            certificates: certificates,
            table: table,
            queue: queue,
            s3: s3,
            secret: this.lookups.secret,
            sharedSecret: this.lookups.sharedSecret
        }
    }

    protected getAliasTarget(): IApplicationLoadBalancer | IDistribution {
        return this.lookups.getAliasTarget();
    }

    protected createARecord(): ARecord | undefined {
        const aRecord = new Route53ARecord(this.scope, this.scope.node.id, this.getAliasTarget(), this.config.Parameters?.hostedZoneDomain);
        return aRecord.createARecord(this.config.Parameters?.subdomain);
    }

    protected createCertificate(props: DnsValidatedCertificateProps): Certificate {
        const certFactory = new AcmCertificate(this.scope, this.scope.node.id);
        return certFactory.create(props);
    }

    protected createCertificates(): Certificate[] {
        const certificates: Certificate[] = [];
        for (const certProps of this.config.Parameters?.certificates ?? []) {
            certificates.push(this.createCertificate(certProps));
        }
        return certificates;
    }

    protected createDynamoDbTable(name = 'cache'): Table | undefined {
        if (this.config.Parameters?.dynamoDb) {
            const dynamoDb = new Dynamodb(this.scope, this.scope.node.id);
            return dynamoDb.create(name, this.config.Parameters.dynamoDb);
        }
    }

    protected createListenerCertificates(certificates: Certificate[]): ApplicationListenerCertificate | undefined {
        if (this.lookups.albListener && certificates.length > 0) {
            return new ApplicationListenerCertificate(this.scope, this.mixNameWithId('listener-certificates'), {
                listener: this.lookups.albListener,
                certificates: certificates
            });
        }
    }

    protected createQueues(): Queue | undefined {
        if (this.config.Parameters?.queue) {
            let deadLetter: Queue | undefined = undefined;
            if (this.config.Parameters?.queue?.hasDeadLetterQueue ?? false) {
                deadLetter = this.createQueueDeadLetter();
            }
            return this.createQueueDefault(deadLetter);
        }
    }

    protected createQueueDefault(deadLetterQueue?: Queue): Queue {
        const sqs = new Sqs(this.scope, this.scope.node.id);
        const props: SqsProps = {
            encryption: this.config.Parameters?.queue?.encryption ?? undefined
        };
        if (deadLetterQueue) {
            props.deadLetterQueue = {
                queue: deadLetterQueue,
                maxReceiveCount: this.config.Parameters?.queue?.maxReceiveCount ?? 3
            }
        }
        return sqs.create(props);
    }

    protected createQueueDeadLetter(): Queue {
        const sqs = new Sqs(this.scope, this.scope.node.id);
        const duration = Duration.days(this.config.Parameters?.queue?.retentionPeriodInDays ?? 3);
        return sqs.create({
            queueName: 'dlq',
            retentionPeriod: duration
        });
    }

    protected createS3Bucket(name = 's3'): Bucket | undefined {
        if (this.config.Parameters?.s3) {
            const s3 = new S3Bucket(this.scope, this.scope.node.id);
            return s3.create(name, this.config.Parameters.s3);
        }
    }

    protected createSesVerifyDomain(): VerifySesDomain | undefined {
        if (!(this.config.Parameters?.createDkim ?? true)) {
            return;
        }
        if (this.config.Parameters?.hostedZoneDomain && this.config.Parameters?.subdomain) {
            const wrapper = new VerifyDomainWrapper(this.scope, this.scope.node.id);
            return wrapper.verifyDomain({
                subdomain: this.config.Parameters.subdomain,
                hostedZone: this.config.Parameters.hostedZoneDomain
            });
        }
    }
}