import {BrefRuntime, LaravelHandler} from "./bref-definitions";
import {Code, Function, IFunction, ILayerVersion, LayerVersion, Runtime} from "aws-cdk-lib/aws-lambda";
import {Duration} from "aws-cdk-lib";
import {BrefLayerArn} from "./bref-layer-arn";
import {FunctionType} from "./lambda-definitions";
import {Construct} from "constructs";
import {IVpc} from "aws-cdk-lib/aws-ec2";
import {ISecret} from "aws-cdk-lib/aws-secretsmanager";
import {NonConstruct} from "../core/non-construct";
import {NameIncrementer} from "../utils/name-incrementer";
import {Secrets} from "../secret/secrets";
import {NamingHelper} from "../utils/naming-helper";
import fs from "fs";
import path from "path";
import {RetentionDays} from "aws-cdk-lib/aws-logs";
import {ScheduledEvent, ScheduledEventProps} from "./scheduled-event";

export interface PhpBrefFunctionProps {
    readonly appPath: string;
    readonly brefRuntime: BrefRuntime | BrefRuntime[];
    readonly lambdaHandler?: string;
    readonly lambdaMemorySize?: number;
    readonly hasSecrets?: boolean;
    readonly hasEnvironment?: boolean;
    readonly reservedConcurrentExecutions?: number;
    readonly scheduledEvents?: ScheduledEventProps[];
    readonly version?: string;
    readonly wantsVpc?: boolean;
    environment?: { [key: string]: string };
    lambdaTimeout?: number;
    type?: FunctionType;
}

export interface PhpBrefFunctionFactoryProps {
    vpc?: IVpc;
    secret?: ISecret;
    environment: { [key: string]: string };
    secretKeys: string[];
}

export class PhpBrefFunction extends NonConstruct {

    readonly defaults: Record<string, any> = {
        memorySize: 1024,
        version: 'latest'
    };
    readonly nameIncrementer: NameIncrementer;
    readonly factoryProps: PhpBrefFunctionFactoryProps;

    constructor(scope: Construct, id: string, factoryProps: PhpBrefFunctionFactoryProps) {
        super(scope, id);
        this.factoryProps = factoryProps;
        this.nameIncrementer = new NameIncrementer();
    }


    create(props: PhpBrefFunctionProps): IFunction {
        const funcName = this.nameIncrementer.next(this.mixNameWithId(`${this.getType(props)}-fn`));
        const func = new Function(this.scope, funcName, {
            functionName: funcName,
            runtime: Runtime.PROVIDED_AL2,
            handler: this.getHandler(props),
            layers: this.getLayers(funcName, props),
            code: Code.fromAsset(this.getAppPath(props.appPath), {
                exclude: ['node_modules', 'tests']
            }),
            timeout: Duration.seconds(this.getTimeout(props)),
            vpc: this.getVpc(props),
            environment: this.getEnvironment(props),
            logRetention: RetentionDays.ONE_MONTH,
            memorySize: props.lambdaMemorySize ?? this.defaults.memorySize,
            reservedConcurrentExecutions: props.reservedConcurrentExecutions
        });
        if (props.scheduledEvents && props.scheduledEvents.length > 0) {
            this.scheduleFunction(func, props.scheduledEvents);
        }
        return func;
    }

    getDefaultTimeout(type: FunctionType): number {
        if (type === FunctionType.WEB) {
            return 28; //gateway timeout 29 s
        }
        if (type === FunctionType.QUEUE) {
            return 29; //queue visibility timeout 30 s
        }
        return 120;
    }

    protected getVpc(props: PhpBrefFunctionProps): IVpc | undefined {
        if (props.wantsVpc ?? true) {
            if (this.factoryProps.vpc) {
                return this.factoryProps.vpc;
            }
            console.log('Function requested VPC, but no VPC found.');
        }
    }

    protected getHandler(props: PhpBrefFunctionProps): string {
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

    protected scheduleFunction(func: IFunction, eventsProps: ScheduledEventProps[]): void {
        const scheduledEvent = new ScheduledEvent(this.scope, this.id);
        for (const props of eventsProps) {
            scheduledEvent.create(func, props);
        }
    }

    protected getAppPath(appPath: string): string {
        if (fs.existsSync(appPath)) {
            return appPath;
        }
        return path.join(process.cwd(), appPath);
    }

    protected getEnvironment(props: PhpBrefFunctionProps): Record<string, string> {
        let env = this.initEnvironment(props);
        env = this.addSecrets(env, props);
        return env;
    }

    protected initEnvironment(props: PhpBrefFunctionProps): Record<string, string> {
        if (props.hasEnvironment) {
            return {...this.factoryProps.environment ?? {}, ...props.environment ?? {}};
        }
        return {};
    }

    protected addSecrets(env: Record<string, string>, props: PhpBrefFunctionProps): Record<string, string> {
        const secrets = new Secrets(this.scope, this.id);
        if (props.hasSecrets && this.factoryProps.secret) {
            for (const [key, val] of Object.entries(secrets.getReferencesFromSecret(this.factoryProps.secretKeys ?? [], this.factoryProps.secret))) {
                env[key] = val.toString();
            }
        }
        return env;
    }

    protected getLayers(funcName: string, props: PhpBrefFunctionProps): ILayerVersion[] {
        const runtimes = this.getRuntimes(props);
        const layers: ILayerVersion[] = [];
        const baseName = NamingHelper.fromParts([funcName, 'layer']);
        for (const runtime of runtimes) {
            const name = this.nameIncrementer.next(baseName);
            layers.push(LayerVersion.fromLayerVersionArn(
                this.scope,
                name,
                this.getBrefLayerArn(runtime, props.version ?? this.defaults.version, props)
            ));
        }
        return layers;
    }

    protected getRuntimes(props: PhpBrefFunctionProps): BrefRuntime[] {
        return Array.isArray(props.brefRuntime) ? props.brefRuntime : [props.brefRuntime];
    }

    protected getBrefLayerArn(id: BrefRuntime, version: string, props: PhpBrefFunctionProps): string {
        const brefLayerArn = new BrefLayerArn(this.scope, 'layer-arn', props.appPath);
        return brefLayerArn.layerArn(id, version).toString();
    }

    protected getTimeout(props: PhpBrefFunctionProps): number {
        if (props.lambdaTimeout) {
            return props.lambdaTimeout;
        }
        const type = props.type ?? FunctionType.EVENT;
        return this.getDefaultTimeout(type);
    }

    protected getType(props: PhpBrefFunctionProps): FunctionType {
        if (props.type) {
            return props.type;
        }
        return FunctionType.EVENT;
    }
}