import {MakeBase} from "./make-base";
import {ApplicationTargetGroup, HealthCheck, TargetType} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import {AlbListenerRuleProps} from "../../../alb/alb-listener-rule";
import {AlbTargetGroupProps} from "../../../alb/alb-target-group";
import {PhpBrefFunction, PhpBrefFunctionProps} from "../../../lambda/php-bref-function";
import {FunctionType, FunctionWrapper, LambdaQueueConfigProps} from "../../../lambda/lambda-definitions";
import {DistributionConfigProps} from "../../../cloudfront/cloudfront-definitions";
import {BrefAsAlbTarget, BrefAsAlbTargetProps, BrefAsAlbTargetResult} from "../../../lambda/bref-as-alb-target";
import {AlbResources, MakeAlbResources} from "./make-alb-resources";
import {Queue} from "aws-cdk-lib/aws-sqs";
import {SqsEventSource} from "aws-cdk-lib/aws-lambda-event-sources";
import {EnvEndpointType, EnvEnvironmentProps} from "../../../env/env-definitions";
import {BrefDistribution, BrefDistributionProps, BrefDistributionResult} from "../../../lambda/bref-distribution";
import {PermissionsEnvLambdaStack} from "../../../permissions/permissions-env-lamdba-stack";
import {MakeParameters} from "../make-definitions";
import {LaravelHandler} from "../../../lambda/bref-definitions";
import {CoreMakeResources} from "./make-core-resources";

export interface MakeLambdaParameters extends MakeParameters {
    lambda: LambdaParameters;
}

export interface LambdaParameters {
    readonly healthCheck?: HealthCheck;
    readonly listenerRule?: AlbListenerRuleProps;
    readonly targetGroup?: AlbTargetGroupProps;
    readonly functions?: PhpBrefFunctionProps[];
    readonly queue?: LambdaQueueConfigProps;
    readonly distribution?: DistributionConfigProps;
    readonly asAlbTarget?: BrefAsAlbTargetProps;
}

export class MakeLambda<T extends MakeLambdaParameters> extends MakeBase<T> {

    functionFactory!: PhpBrefFunction;

    make(services: CoreMakeResources) {
        const wrappers: FunctionWrapper[] = [];
        let albServices: AlbResources | Record<string, any> = {};
        if (this.parameters.lambda.targetGroup) {
            const makeAlbServices = new MakeAlbResources(this.scope, this.scope.node.id, this.lookups, {
                targetGroup: this.getTargetGroupProps(),
                listenerRule: <AlbListenerRuleProps>this.parameters.lambda.listenerRule,
                healthCheck: this.parameters.lambda.healthCheck,
                alarmEmails: this.parameters.alarmEmails ?? [],
            });
            albServices = makeAlbServices.make(true);
        }
        this.functionFactory = new PhpBrefFunction(this.scope, this.scope.node.id, {
            vpc: this.lookups.vpc,
            secret: this.lookups.secret,
            sharedSecret: this.lookups.sharedSecret,
            environment: this.getBaseEnvironmentFromCoreServices(services),
            secretKeys: this.parameters?.secretKeys ?? [],
        });
        const functionWrappers = this.createFunctions();
        wrappers.push(...functionWrappers);
        const queueFunctionWrapper = this.createQueueFunction(services.queue);
        if (queueFunctionWrapper) {
            wrappers.push(queueFunctionWrapper);
        }
        if (this.parameters.lambda.asAlbTarget) {
            const result = this.brefAsAlbTarget(albServices.targetGroup, this.parameters.lambda.asAlbTarget);
            wrappers.push({lambdaFunction: result.lambdaFunction, type: FunctionType.WEB});
        }
        if (this.parameters.lambda.distribution) {
            const result = this.brefDistributionFactory(<BrefDistributionProps>this.parameters.lambda.distribution);
            this.lookups.distribution = result.distribution;
            wrappers.push({lambdaFunction: result.lambdaFunction, type: FunctionType.WEB});
            if (result.apiResult.authorizer?.lambdaFunction) {
                wrappers.push({lambdaFunction: result.apiResult.authorizer.lambdaFunction, type: FunctionType.EVENT});
            }
        }
        new PermissionsEnvLambdaStack(this.scope, this.scope.node.id, {
            functions: {
                functions: wrappers,
                queue: queueFunctionWrapper
            },
            aRecord: services.aRecord,
            queue: services.queue,
            s3: services.s3,
            sesVerify: services.sesVerify,
            table: services.table,
            secret: this.lookups.secret,
            sharedSecret: this.lookups.sharedSecret
        });
    }

    protected addEnvironmentForThis(envProps: EnvEnvironmentProps, environment: Record<string, string>) {
        environment['APP_BASE_PATH'] = '/var/task';
    }

    private brefAsAlbTarget(targetGroup: ApplicationTargetGroup, props: BrefAsAlbTargetProps): BrefAsAlbTargetResult {
        const brefAsAlbTarget = new BrefAsAlbTarget(this.scope, this.scope.node.id, {
            functionFactory: this.functionFactory,
            targetGroup: targetGroup
        });
        const domainName = this.getDefaultDomainName();
        if (domainName && this.parameters.hostedZoneDomain) {
            props.certificateProps = {
                domainName: domainName,
                hostedZone: this.parameters.hostedZoneDomain
            }
        }
        return brefAsAlbTarget.create(props);
    }

    private brefDistributionFactory(props: BrefDistributionProps): BrefDistributionResult {
        const brefFactory = new BrefDistribution(this.scope, this.scope.node.id, {
            functionFactory: this.functionFactory,
            secret: this.lookups.secret
        });
        props.apiProps = props.apiProps ?? {};
        props.apiProps.alarmEmails = this.parameters.alarmEmails ?? [];
        const domainName = this.getDefaultDomainName();
        if (domainName && this.parameters.hostedZoneDomain) {
            props.certificateProps = {
                domainName: domainName,
                hostedZone: this.parameters.hostedZoneDomain
            }
        }
        return brefFactory.create(props);
    }

    private createFunctions(): FunctionWrapper[] {
        const functions: FunctionWrapper[] = [];
        for (const funcConfig of this.parameters.lambda.functions ?? []) {
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
        if (queue && this.parameters.lambda.queue?.functionProps) {
            this.parameters.lambda.queue.functionProps.type = FunctionType.QUEUE;
            if (!this.parameters.lambda.queue.functionProps.lambdaHandler) {
                this.parameters.lambda.queue.functionProps.lambdaHandler = LaravelHandler.QUEUE;
            }
            const funcWrap = this.createFunction(this.parameters.lambda.queue.functionProps);
            funcWrap.lambdaFunction.addEventSource(new SqsEventSource(queue));
            return funcWrap;
        }
    }

    private getTargetGroupProps(): AlbTargetGroupProps {
        const props = <AlbTargetGroupProps>this.parameters.ecs?.targetGroup ?? {};
        if (!props.targetType) {
            props.targetType = TargetType.LAMBDA;
        }
        return props;
    }
}