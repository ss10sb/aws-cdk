import {NonConstruct} from "../../../core/non-construct";
import {
    ApplicationListenerRule,
    ApplicationTargetGroup,
    IApplicationLoadBalancer,
    IApplicationTargetGroup
} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import {IDistribution} from "aws-cdk-lib/aws-cloudfront";
import {PreBuildLookups} from "../../../env/pre-build-lookups";
import {Construct} from "constructs";
import {AlbTargetGroupHealthCheck} from "../../../alb/alb-target-group-health-check";
import {NamingHelper} from "../../../utils/naming-helper";
import {EnvEnvironmentProps} from "../../../env/env-definitions";
import {Table} from "aws-cdk-lib/aws-dynamodb";
import {Queue} from "aws-cdk-lib/aws-sqs";
import {Bucket} from "aws-cdk-lib/aws-s3";
import {ISecret} from "aws-cdk-lib/aws-secretsmanager";
import {MakeConfig, MakeParameters} from "../make-definitions";
import {Route53Helper} from "../../../utils/route53-helper";
import {CoreMakeResources} from "./make-core-resources";

export interface MakeEnvironmentProps {
    name: string;
    domain?: string;
    table?: Table;
    queue?: Queue;
    s3?: Bucket;
    secret?: ISecret;
    sharedSecret?: ISecret;
}

export abstract class MakeBase<T extends MakeParameters> extends NonConstruct {

    readonly lookups: PreBuildLookups;
    readonly config: MakeConfig;
    readonly parameters: T;

    constructor(scope: Construct, id: string, lookups: PreBuildLookups, config: MakeConfig, props: Record<string, any>) {
        super(scope, id);
        this.config = config;
        this.lookups = lookups;
        this.parameters = <T>this.createParameters(config, props);
    }

    public abstract make(services: CoreMakeResources): void;

    protected createParameters<T>(config: MakeConfig, props: Record<string, any>): T {
        return <T>this.createParametersFromConfigAndProps(config, props);
    }

    protected createParametersFromConfigAndProps(config: MakeConfig, props: Record<string, any>): Record<string, any> {
        return config.Parameters ?? {};
    }

    protected getDefaultDomainName(): string | undefined {
        return Route53Helper.getDomainFromParameters(this.parameters);
    }

    protected getBaseEnvironmentFromCoreServices(services: CoreMakeResources): Record<string, string> {
        const envProps = {
            name: this.scope.node.id,
            domain: this.getDefaultDomainName(),
            table: services.table,
            queue: services.queue,
            s3: services.s3,
            secret: services.secret,
            sharedSecret: services.sharedSecret
        }
        return this.getBaseEnvironment(envProps);
    }

    protected getBaseEnvironment(envProps: MakeEnvironmentProps): Record<string, string> {
        const props: Record<string, string> = {};
        props['AWS_APP_NAME'] = envProps.name;
        if (envProps.domain) {
            props['MAIL_FROM_ADDRESS'] = `no-reply@${envProps.domain}`;
            props['IMPORTER_FROM'] = `importer-no-reply@${envProps.domain}`;
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
        if (envProps.secret) {
            props['AWS_SECRET_ARN'] = envProps.secret?.secretFullArn ?? envProps.secret?.secretArn;
        }
        if (envProps.sharedSecret) {
            props['AWS_SHARED_SECRET_ARN'] = envProps.sharedSecret?.secretFullArn ?? envProps.sharedSecret?.secretArn;
        }
        this.addEnvironmentForThis(envProps, props);
        return props;
    }

    protected addEnvironmentForThis(envProps: EnvEnvironmentProps, environment: Record<string, string>): void {
        // override if needed
    }

    protected getName(suffix: string): string {
        return NamingHelper.fromParts([this.scope.node.id, suffix]);
    }
}