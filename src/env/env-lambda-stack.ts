import {EnvEndpointType, EnvProps, EnvStackServicesProps} from "./env-definitions";
import {Construct} from "constructs";
import {StackProps} from "aws-cdk-lib";
import {EnvBaseStack, EnvConfig, EnvParameters} from "./env-base-stack";
import {Queue} from "aws-cdk-lib/aws-sqs";
import {SqsEventSource} from "aws-cdk-lib/aws-lambda-event-sources";
import {ApplicationTargetGroup, HealthCheck, TargetType} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import {ISecret} from "aws-cdk-lib/aws-secretsmanager";
import {Functions, FunctionType, FunctionWrapper, LambdaQueueConfigProps} from "../lambda/lambda-definitions";
import {AlbListenerRuleProps} from "../alb/alb-listener-rule";
import {AlbTargetGroupProps} from "../alb/alb-target-group";
import {PhpBrefFunction, PhpBrefFunctionProps} from "../lambda/php-bref-function";
import {DistributionConfigProps} from "../cloudfront/cloudfront-definitions";
import {ConfigStackProps} from "../config/config-stack";
import {PermissionsEnvLambdaStack} from "../permissions/permissions-env-lamdba-stack";
import {BrefDistribution, BrefDistributionProps, BrefDistributionResult} from "../lambda/bref-distribution";
import {CoreFunctionFactoryProps} from "../lambda/core-function";
import {FunctionFactory} from "../lambda/function-factory";
import {AsAlbTarget, AsAlbTargetProps, AsAlbTargetResult} from "../lambda/as-alb-target";

export interface EnvLambdaStackServicesProps extends EnvStackServicesProps {
    readonly functions: Functions;
    readonly secret?: ISecret;
    readonly sharedSecret?: ISecret;
}

export interface EnvLambdaParameters extends EnvParameters {
    readonly healthCheck?: HealthCheck;
    readonly listenerRule?: AlbListenerRuleProps;
    readonly targetGroup?: AlbTargetGroupProps;
    readonly functions?: PhpBrefFunctionProps[];
    readonly queue?: LambdaQueueConfigProps;
    readonly secretArn?: string;
    readonly distribution?: DistributionConfigProps;
    readonly asAlbTarget?: AsAlbTargetProps;
}

export interface EnvLambdaProps extends EnvProps {
}

export class EnvLambdaStack<T extends EnvConfig> extends EnvBaseStack<T> {

    envProps: EnvLambdaProps;
    functionFactoryProps!: CoreFunctionFactoryProps;

    constructor(scope: Construct, id: string, config: T, configStackProps: ConfigStackProps, stackProps: StackProps, envProps: EnvLambdaProps) {
        super(scope, id, config, configStackProps, stackProps);
        this.envProps = envProps;
    }

    exec() {
        let targetGroup = null;
        let listenerRule = null;
        const wrappers: FunctionWrapper[] = [];
        const certificates = this.createCertificates();
        this.createListenerCertificates(certificates);
        const table = this.createDynamoDbTable();
        const queue = this.createQueues();
        const s3 = this.createS3Bucket();
        this.functionFactoryProps = {
            vpc: this.lookups.vpc,
            secret: this.lookups.secret,
            sharedSecret: this.lookups.sharedSecret,
            environment: this.getEnvironment({
                table: table,
                queue: queue,
                s3: s3
            }),
            secretKeys: this.config.Parameters?.secretKeys ?? [],
        };
        const functionWrappers = this.createFunctions();
        wrappers.push(...functionWrappers);
        const queueFunctionWrapper = this.createQueueFunction(queue);
        if (queueFunctionWrapper) {
            wrappers.push(queueFunctionWrapper);
        }
        if (this.endpointType === EnvEndpointType.CLOUDFRONT) {

            const result = this.brefDistributionFactory();
            this.lookups.distribution = result.distribution;
            wrappers.push({lambdaFunction: result.lambdaFunction, type: FunctionType.WEB});
            if (result.apiResult.authorizer?.lambdaFunction) {
                wrappers.push({lambdaFunction: result.apiResult.authorizer.lambdaFunction, type: FunctionType.EVENT});
            }
        }

        if (this.endpointType === EnvEndpointType.LOADBALANCER) {
            targetGroup = this.createTargetGroup();
            listenerRule = this.createListenerRule(targetGroup);
            this.configureTargetGroupHealthCheck(targetGroup);
            const result = this.asAlbTarget(targetGroup);
            wrappers.push({lambdaFunction: result.lambdaFunction, type: FunctionType.WEB});
        }
        const aRecord = this.createARecord();
        const sesVerify = this.createSesVerifyDomain();
        new PermissionsEnvLambdaStack(this, this.node.id, {
            functions: {
                functions: wrappers,
                queue: queueFunctionWrapper
            },
            aRecord: aRecord,
            queue: queue,
            s3: s3,
            sesVerify: sesVerify,
            table: table,
            secret: this.lookups.secret,
            sharedSecret: this.lookups.sharedSecret
        });
    }

    protected getTargetGroupParams(): AlbTargetGroupProps {
        return {
            targetType: TargetType.LAMBDA,
        }
    }

    private createFunctions(): FunctionWrapper[] {
        const functions: FunctionWrapper[] = [];
        for (const funcConfig of this.config.Parameters.functions ?? []) {
            functions.push(this.createFunction(funcConfig));
        }
        return functions;
    }

    private createFunction(config: Record<string, any>): FunctionWrapper {
        config.type = config.type ?? FunctionType.EVENT;
        const func = FunctionFactory.createFromProps(this, this.node.id, this.functionFactoryProps, config);
        return {
            lambdaFunction: func,
            type: config.type
        }
    }

    private createQueueFunction(queue?: Queue): FunctionWrapper | undefined {
        if (queue && this.config.Parameters.queue?.functionProps) {
            this.config.Parameters.queue.functionProps.type = FunctionType.QUEUE;
            const funcWrap = this.createFunction(this.config.Parameters.queue.functionProps);
            funcWrap.lambdaFunction.addEventSource(new SqsEventSource(queue));
            return funcWrap;
        }
    }

    private asAlbTarget(targetGroup: ApplicationTargetGroup): AsAlbTargetResult {
        const asAlbTarget = new AsAlbTarget(this, this.node.id, {
            targetGroup: targetGroup,
            functionFactoryProps: this.functionFactoryProps
        });
        const props = this.config.Parameters.asAlbTarget ?? {};
        const domainName = this.getDefaultDomainName();
        if (domainName) {
            props.certificateProps = {
                domainName: domainName,
                hostedZone: this.config.Parameters.hostedZoneDomain
            }
        }
        return asAlbTarget.create(props);
    }

    private brefDistributionFactory(): BrefDistributionResult {
        const brefFactory = new BrefDistribution(this, this.node.id, {
            functionFactory: FunctionFactory.createBref(this, this.node.id, this.functionFactoryProps),
            secret: this.lookups.secret
        });
        const distConfigProps = <BrefDistributionProps>this.config.Parameters.distribution;
        distConfigProps.apiProps = distConfigProps.apiProps ?? {};
        distConfigProps.apiProps.alarmEmails = this.config.Parameters.alarmEmails ?? [];
        const domainName = this.getDefaultDomainName();
        if (domainName) {
            distConfigProps.certificateProps = {
                domainName: domainName,
                hostedZone: this.config.Parameters.hostedZoneDomain
            }
        }
        return brefFactory.create(distConfigProps);
    }
}