import {BrefRuntime} from "./bref-definitions";
import {ILayerVersion, LayerVersion, Runtime} from "aws-cdk-lib/aws-lambda";
import {BrefLayerArn} from "./bref-layer-arn";
import {Construct} from "constructs";
import {NamingHelper} from "../utils/naming-helper";
import {BrefRuntimeCompatibility} from "./bref-runtime-compatibility";
import {CoreFunction, CoreFunctionFactoryProps, CoreFunctionProps} from "./core-function";

export interface PhpBrefFunctionProps extends CoreFunctionProps {
    readonly brefRuntime: BrefRuntime | BrefRuntime[];
    readonly version?: string;
}

export class PhpBrefFunction extends CoreFunction<PhpBrefFunctionProps> {

    readonly defaults: Record<string, any> = {
        memorySize: 512,
        version: 'latest',
        lambdaRuntime: Runtime.PROVIDED_AL2023
    };

    readonly brefRuntimeCompatibility: BrefRuntimeCompatibility;

    constructor(scope: Construct, id: string, factoryProps: CoreFunctionFactoryProps) {
        super(scope, id, factoryProps);
        this.brefRuntimeCompatibility = new BrefRuntimeCompatibility();
    }

    protected getLayers(funcName: string, props: PhpBrefFunctionProps): ILayerVersion[] {
        this.ensureBrefRuntimeEnvSet(props);
        const runtimes = this.getRuntimes(props);
        const layers: ILayerVersion[] = [];
        const type = this.getType(props);
        for (const runtime of runtimes) {
            const baseName = NamingHelper.fromParts([funcName, runtime]);
            const name = this.nameIncrementer.next(baseName);
            layers.push(LayerVersion.fromLayerVersionArn(
                this.scope,
                name,
                this.getBrefLayerArn(runtime, props.version ?? this.defaults.version, props)
            ));
        }
        return layers;
    }

    ensureBrefRuntimeEnvSet(props: PhpBrefFunctionProps): void {
        if (!(props?.environment) || !props.environment['BREF_RUNTIME']) {
            props.environment = props.environment ?? {};
            props.environment['BREF_RUNTIME'] = 'fpm';
        }
    }

    protected getRuntimes(props: PhpBrefFunctionProps): BrefRuntime[] {
        return Array.isArray(props.brefRuntime) ? props.brefRuntime : [props.brefRuntime];
    }

    protected getBrefLayerArn(id: BrefRuntime, version: string, props: PhpBrefFunctionProps): string {
        const brefLayerArn = new BrefLayerArn(this.scope, 'layer-arn', props.appPath);
        return brefLayerArn.layerArn(id, version).toString();
    }
}