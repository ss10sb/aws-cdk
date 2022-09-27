import {EnvEndpointType, EnvProps, EnvStackServicesProps} from "./env-definitions";
import {Construct} from "constructs";
import {StackProps} from "aws-cdk-lib";
import {EnvBaseStack, EnvConfig, EnvParameters} from "./env-base-stack";
import {Queue} from "aws-cdk-lib/aws-sqs";
import {SqsEventSource} from "aws-cdk-lib/aws-lambda-event-sources";
import {HealthCheck} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import {ISecret} from "aws-cdk-lib/aws-secretsmanager";
import {Functions, FunctionType, FunctionWrapper, LambdaQueueConfigProps} from "../lambda/lambda-definitions";
import {AlbListenerRuleProps} from "../alb/alb-listener-rule";
import {AlbTargetGroupProps} from "../alb/alb-target-group";
import {PhpBrefFunction, PhpBrefFunctionProps} from "../lambda/php-bref-function";
import {DistributionConfigProps} from "../cloudfront/cloudfront-definitions";
import {ConfigStackProps} from "../config/config-stack";
import {PermissionsEnvLambdaStack} from "../permissions/permissions-env-lamdba-stack";
import {BrefDistribution, BrefDistributionProps, BrefDistributionResult} from "../lambda/bref-distribution";

export interface EnvLambdaStackServicesProps extends EnvStackServicesProps {
    readonly functions: Functions;
    readonly secret?: ISecret;
}

export interface EnvLambdaParameters extends EnvParameters {
    readonly healthCheck?: HealthCheck;
    readonly listenerRule?: AlbListenerRuleProps;
    readonly targetGroup?: AlbTargetGroupProps;
    readonly functions?: PhpBrefFunctionProps[];
    readonly queue?: LambdaQueueConfigProps;
    readonly secretArn?: string;
    readonly distribution?: DistributionConfigProps;
}

export interface EnvLambdaProps extends EnvProps {
}

export class EnvLambdaStack<T extends EnvConfig> extends EnvBaseStack<T> {

    envProps: EnvLambdaProps;
    functionFactory!: PhpBrefFunction;

    constructor(scope: Construct, id: string, config: T, configStackProps: ConfigStackProps, stackProps: StackProps, envProps: EnvLambdaProps) {
        super(scope, id, config, configStackProps, stackProps);
        this.envProps = envProps;
    }

    exec() {
        const wrappers: FunctionWrapper[] = [];
        const table = this.createDynamoDbTable();
        const queue = this.createQueues();
        const s3 = this.createS3Bucket();
        this.functionFactory = new PhpBrefFunction(this, this.node.id, {
            vpc: this.lookups.vpc,
            secret: this.lookups.secret,
            environment: this.getEnvironment({
                table: table,
                queue: queue,
                s3: s3
            }),
            secretKeys: this.config.Parameters?.secretKeys ?? [],
        })
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
        } else {
            throw new Error('ALB endpoint has not been implemented.');
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
            secret: this.lookups.secret
        });
    }

    private createFunctions(): FunctionWrapper[] {
        const functions: FunctionWrapper[] = [];
        for (const funcConfig of this.config.Parameters.functions ?? []) {
            functions.push(this.createFunction(funcConfig));
        }
        return functions;
    }

    private createFunction(config: PhpBrefFunctionProps): FunctionWrapper {
        config.type = config.type ?? FunctionType.EVENT;
        const func = this.functionFactory.create(config);
        return {
            lambdaFunction: func,
            type: config.type
        }
    }

    private createQueueFunction(queue?: Queue): FunctionWrapper | undefined {
        if (queue && this.config.Parameters.queue?.queueFunction) {
            this.config.Parameters.queue.queueFunction.type = FunctionType.QUEUE;
            const funcWrap = this.createFunction(this.config.Parameters.queue.queueFunction);
            funcWrap.lambdaFunction.addEventSource(new SqsEventSource(queue));
            return funcWrap;
        }
    }

    private brefDistributionFactory(): BrefDistributionResult {
        const brefFactory = new BrefDistribution(this, this.node.id, {
            functionFactory: this.functionFactory,
            secret: this.lookups.secret
        });
        const distConfigProps = <BrefDistributionProps>this.config.Parameters.distribution;
        distConfigProps.apiProps = distConfigProps.apiProps ?? {};
        distConfigProps.apiProps.alarmEmails = this.config.Parameters.alarmEmails ?? [];
        distConfigProps.certificateProps = {
            domainName: `${this.config.Parameters.subdomain}.${this.config.Parameters.hostedZoneDomain}`,
            hostedZone: this.config.Parameters.hostedZoneDomain,
            region: this.config.Parameters.certificateRegion ?? 'us-east-1'
        }
        return brefFactory.create(distConfigProps);
    }
}