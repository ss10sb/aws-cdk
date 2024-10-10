import {ScheduledEvent, ScheduledEventProps} from "./scheduled-event";
import {ProvisionedConcurrency, ProvisionedConcurrencyProps} from "./provisioned-concurrency";
import {FunctionType} from "./lambda-definitions";
import {Code, Function, FunctionProps, IFunction, ILayerVersion, Runtime} from "aws-cdk-lib/aws-lambda";
import {IVpc} from "aws-cdk-lib/aws-ec2";
import {ISecret} from "aws-cdk-lib/aws-secretsmanager";
import {NonConstruct} from "../core/non-construct";
import {NameIncrementer} from "../utils/name-incrementer";
import {Construct} from "constructs";
import {AssetOptions, Duration, RemovalPolicy} from "aws-cdk-lib";
import {LaravelHandler} from "./bref-definitions";
import {ILogGroup, LogGroup, RetentionDays} from "aws-cdk-lib/aws-logs";
import fs from "fs";
import path from "path";
import {LambdaTimeout} from "./lamda-timeout";

export interface CoreFunctionProps {
    readonly appPath: string;
    readonly lambdaMemorySize?: number;
    readonly reservedConcurrentExecutions?: number;
    readonly scheduledEvents?: ScheduledEventProps[];
    readonly provisionedConcurrency?: ProvisionedConcurrencyProps;
    lambdaHandler?: string;
    lambdaRuntime?: Runtime;
    prependSecretId?: string;
    wantsVpc?: boolean;
    environment?: { [key: string]: string };
    lambdaTimeout?: number;
    type?: FunctionType;
    useBref?: boolean;
}

export interface CoreFunctionFactoryProps {
    vpc?: IVpc;
    secret?: ISecret;
    sharedSecret?: ISecret;
    environment: { [key: string]: string };
    secretKeys: string[];
}

export class CoreFunction<PropsType extends CoreFunctionProps> extends NonConstruct {
    readonly defaults: Record<string, any> = {
        memorySize: 512,
        version: 'latest',
        lambdaRuntime: Runtime.PROVIDED_AL2023
    };
    readonly nameIncrementer: NameIncrementer;
    readonly factoryProps: CoreFunctionFactoryProps;

    constructor(scope: Construct, id: string, factoryProps: CoreFunctionFactoryProps) {
        super(scope, id);
        this.factoryProps = factoryProps;
        this.nameIncrementer = new NameIncrementer();
    }

    public create(props: PropsType): IFunction {
        const funcName = this.getFunctionName(props);
        const func = new Function(this.scope, funcName, this.getFunctionProps(funcName, props));
        if (props.scheduledEvents && props.scheduledEvents.length > 0) {
            this.scheduleFunction(func, props.scheduledEvents);
        }
        if (props.provisionedConcurrency) {
            this.addProvisionedConcurrency(func, props.provisionedConcurrency);
        }
        return func;
    }

    public getDefaultTimeout(type: FunctionType, apiGateway = true): number {
        return LambdaTimeout.timeout(type, apiGateway);
    }

    protected addProvisionedConcurrency(func: IFunction, props: ProvisionedConcurrencyProps): void {
        const provConc = new ProvisionedConcurrency(this.scope, this.id);
        provConc.create(func, props);
    }

    protected addSecrets(env: Record<string, string>, props: PropsType): Record<string, string> {
        if (this.factoryProps.sharedSecret) {
            env['BREF_LOAD_SECRETS'] = 'bref-ssm:loadOnly'; // trigger secret loader
            this.addSecretsAsLookup(
                'SHARED_SECRETS_LOOKUP',
                this.factoryProps.secretKeys ?? [],
                this.factoryProps.sharedSecret,
                env,
                props);
        }
        if (this.factoryProps.secret) {
            env['BREF_LOAD_SECRETS'] = 'bref-ssm:loadOnly'; // trigger secret loader
            this.addSecretsAsLookup(
                'SECRETS_LOOKUP',
                this.factoryProps.secretKeys ?? [],
                this.factoryProps.secret,
                env,
                props
            );
        }
        return env;
    }

    protected addSecretsAsLookup(name: string, keys: string[], secret: ISecret, env: Record<string, string>, props: PropsType): Record<string, string> {
        const prepend = props.prependSecretId ?? 'bref-secretsmanager:';
        env[name] = `${prepend}${secret.secretArn}`;
        return env;
    }

    protected createLogGroup(funcName: string): ILogGroup {
        return new LogGroup(this.scope, `${funcName}-lg`, {
            removalPolicy: RemovalPolicy.DESTROY,
            retention: RetentionDays.ONE_MONTH
        });
    }

    protected getAppPath(appPath: string): string {
        if (fs.existsSync(appPath)) {
            return appPath;
        }
        return path.join(process.cwd(), appPath);
    }

    protected getCodeFromPath(path: string, props: PropsType): Code {
        return Code.fromAsset(this.getAppPath(path), this.getCodeAssetOptions(path, props));
    }

    protected getCodeAssetOptions(path: string, props: PropsType): AssetOptions {
        return {};
    }

    protected getEnvironment(props: PropsType): Record<string, string> {
        let env = this.initEnvironment(props);
        env = this.addSecrets(env, props);
        return env;
    }

    protected getFunctionProps(funcName: string, props: PropsType): FunctionProps {
        return {
            functionName: funcName,
            runtime: this.getFunctionRuntime(props),
            handler: this.getHandler(props),
            layers: this.getLayers(funcName, props),
            code: this.getCodeFromPath(this.getAppPath(props.appPath), props),
            timeout: Duration.seconds(this.getTimeout(props)),
            vpc: this.getVpc(props),
            environment: this.getEnvironment(props),
            logGroup: this.createLogGroup(funcName),
            memorySize: props.lambdaMemorySize ?? this.defaults.memorySize,
            reservedConcurrentExecutions: props.reservedConcurrentExecutions
        };
    }

    protected getHandler(props: PropsType): string {
        if (props.lambdaHandler) {
            return props.lambdaHandler;
        }
        if (this.getType(props) === FunctionType.WEB) {
            return LaravelHandler.WEB;
        }
        if (this.getType(props) === FunctionType.QUEUE) {
            return LaravelHandler.QUEUE;
        }
        return LaravelHandler.ARTISAN;
    }

    protected getFunctionRuntime(props: PropsType): Runtime {
        return props.lambdaRuntime ?? this.defaults.lambdaRuntime;
    }

    protected getFunctionName(props: PropsType): string {
        return this.nameIncrementer.next(this.mixNameWithId(`${this.getType(props)}-fn`));
    }

    protected getLayers(funcName: string, props: PropsType): ILayerVersion[] {
        return [];
    }

    protected getTimeout(props: PropsType): number {
        if (props.lambdaTimeout) {
            return props.lambdaTimeout;
        }
        const type = props.type ?? FunctionType.EVENT;
        return this.getDefaultTimeout(type);
    }

    protected getType(props: PropsType): FunctionType {
        if (props.type) {
            return props.type;
        }
        return FunctionType.EVENT;
    }

    protected getVpc(props: PropsType): IVpc | undefined {
        if (props.wantsVpc ?? true) {
            if (this.factoryProps.vpc) {
                return this.factoryProps.vpc;
            }
            console.log('Function requested VPC, but no VPC found.');
        }
    }

    protected initEnvironment(props: PropsType): Record<string, string> {
        return {...this.factoryProps.environment ?? {}, ...props.environment ?? {}};
    }

    protected scheduleFunction(func: IFunction, eventsProps: ScheduledEventProps[]): void {
        const scheduledEvent = new ScheduledEvent(this.scope, this.id);
        for (const props of eventsProps) {
            scheduledEvent.create(func, props);
        }
    }
}