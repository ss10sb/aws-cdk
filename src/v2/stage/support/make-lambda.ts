import {MakeBase} from "./make-base";
import {ApplicationTargetGroup, HealthCheck, TargetType} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import {AlbListenerRuleProps} from "../../../alb/alb-listener-rule";
import {AlbTargetGroupProps} from "../../../alb/alb-target-group";
import {PhpBrefFunction, PhpBrefFunctionProps} from "../../../lambda/php-bref-function";
import {FunctionType, FunctionWrapper, LambdaQueueConfigProps} from "../../../lambda/lambda-definitions";
import {AlbResources, MakeAlbResources} from "./make-alb-resources";
import {Queue} from "aws-cdk-lib/aws-sqs";
import {SqsEventSource} from "aws-cdk-lib/aws-lambda-event-sources";
import {EnvEndpointType, EnvEnvironmentProps} from "../../../env/env-definitions";
import {PermissionsEnvLambdaStack} from "../../../permissions/permissions-env-lamdba-stack";
import {MakeParameters} from "../make-definitions";
import {LaravelHandler} from "../../../lambda/bref-definitions";
import {CoreMakeResources} from "./make-core-resources";
import {AsAlbTarget, AsAlbTargetProps, AsAlbTargetResult} from "../../../lambda/as-alb-target";
import {CoreFunctionFactoryProps, CoreFunctionProps} from "../../../lambda/core-function";
import {FunctionFactory} from "../../../lambda/function-factory";

export interface MakeLambdaParameters extends MakeParameters {
    lambda: LambdaParameters;
}

export interface LambdaParameters {
    readonly healthCheck?: HealthCheck;
    readonly listenerRule?: AlbListenerRuleProps;
    readonly targetGroup?: AlbTargetGroupProps;
    readonly functions?: PhpBrefFunctionProps[]|CoreFunctionProps[];
    readonly queue?: LambdaQueueConfigProps;
    readonly asAlbTarget?: AsAlbTargetProps;
}

export class MakeLambda<T extends MakeLambdaParameters> extends MakeBase<T> {

    functionFactoryProps!: CoreFunctionFactoryProps;

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
        this.functionFactoryProps = {
            vpc: this.lookups.vpc,
            secret: this.lookups.secret,
            sharedSecret: this.lookups.sharedSecret,
            environment: this.getBaseEnvironmentFromCoreServices(services),
            secretKeys: this.parameters?.secretKeys ?? [],
        }
        const functionWrappers = this.createFunctions();
        wrappers.push(...functionWrappers);
        const queueFunctionWrapper = this.createQueueFunction(services.queue);
        if (queueFunctionWrapper) {
            wrappers.push(queueFunctionWrapper);
        }
        if (this.parameters.lambda.asAlbTarget) {
            const result = this.asAlbTarget(albServices.targetGroup, this.parameters.lambda.asAlbTarget);
            wrappers.push({lambdaFunction: result.lambdaFunction, type: FunctionType.WEB});
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

    private asAlbTarget(targetGroup: ApplicationTargetGroup, props: AsAlbTargetProps): AsAlbTargetResult {
        const asAlbTarget = new AsAlbTarget(this.scope, this.scope.node.id, {
            targetGroup: targetGroup,
            functionFactoryProps: this.functionFactoryProps,
        });
        const domainName = this.getDefaultDomainName();
        if (domainName && this.parameters.hostedZoneDomain) {
            props.certificateProps = {
                domainName: domainName,
                hostedZone: this.parameters.hostedZoneDomain
            }
        }
        return asAlbTarget.create(props);
    }

    private createFunctions(): FunctionWrapper[] {
        const functions: FunctionWrapper[] = [];
        for (const funcConfig of this.parameters.lambda.functions ?? []) {
            functions.push(this.createFunction(funcConfig));
        }
        return functions;
    }

    private createFunction(config: Record<string, any>): FunctionWrapper {
        config.type = config.type ?? FunctionType.EVENT;
        const func = FunctionFactory.createFromProps(this.scope, this.scope.node.id, this.functionFactoryProps, config);
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