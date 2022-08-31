import {BrefRuntime} from "./bref-definitions";
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

export interface PhpBrefFunctionProps {
    readonly type?: FunctionType;
    readonly brefRuntime: BrefRuntime | BrefRuntime[];
    readonly version?: string;
    readonly appPath: string;
    readonly lambdaHandler?: string;
    readonly lambdaMemorySize?: number;
    readonly hasSecrets?: boolean;
    readonly hasEnvironment?: boolean;
    lambdaTimeout?: number;
    vpc?: IVpc;
}

export interface PhpBrefFunctionFactoryProps {
    secret?: ISecret;
    environment: { [key: string]: string };
    secretKeys: string[];
}

export class PhpBrefFunction extends NonConstruct {

    readonly defaults: Record<string, any> = {
        handler: 'public/index.php',
        memorySize: 1024,
        disableExecuteApiEndpoint: true,
        version: 'latest'
    };
    readonly nameIncrementer: NameIncrementer;
    readonly factoryProps: PhpBrefFunctionFactoryProps;

    constructor(scope: Construct, id: string, factoryProps: PhpBrefFunctionFactoryProps) {
        super(scope, id);
        this.factoryProps = factoryProps;
        this.nameIncrementer = new NameIncrementer();
    }


    create(name: string, props: PhpBrefFunctionProps): IFunction {
        const funcName = this.nameIncrementer.next(this.mixNameWithId(`${name}-fn`));
        return new Function(this.scope, funcName, {
            functionName: funcName,
            runtime: Runtime.PROVIDED_AL2,
            handler: props.lambdaHandler ?? this.defaults.handler,
            layers: this.getLayers(funcName, props),
            code: Code.fromAsset(this.getAppPath(props.appPath)),
            timeout: Duration.seconds(this.getTimeout(props)),
            vpc: props.vpc,
            environment: this.getEnvironment(props),
            logRetention: RetentionDays.ONE_MONTH,
        });
    }

    getDefaultTimeout(type: FunctionType): number {
        if (type === FunctionType.WEB) {
            return 28;
        }
        return 120;
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
            return this.factoryProps.environment ?? {};
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