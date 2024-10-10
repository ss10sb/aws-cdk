import {BrefRuntime} from "./bref-definitions";
import {ILayerVersion, LayerVersion} from "aws-cdk-lib/aws-lambda";
import {BrefLayerArn} from "./bref-layer-arn";
import {FunctionType} from "./lambda-definitions";
import {Construct} from "constructs";
import {NamingHelper} from "../utils/naming-helper";
import {BrefRuntimeCompatibility} from "./bref-runtime-compatibility";
import {CoreFunction, CoreFunctionFactoryProps, CoreFunctionProps} from "./core-function";

export interface PhpBrefFunctionProps extends CoreFunctionProps {
    readonly brefRuntime: BrefRuntime | BrefRuntime[];
    readonly version?: string;
}

export class PhpBrefFunction extends CoreFunction<PhpBrefFunctionProps> {

    readonly brefRuntimeCompatibility: BrefRuntimeCompatibility;

    constructor(scope: Construct, id: string, factoryProps: CoreFunctionFactoryProps) {
        super(scope, id, factoryProps);
        this.brefRuntimeCompatibility = new BrefRuntimeCompatibility();
    }

    protected getLayers(funcName: string, props: PhpBrefFunctionProps): ILayerVersion[] {
        const runtimes = this.getRuntimes(props);
        const layers: ILayerVersion[] = [];
        const baseName = NamingHelper.fromParts([funcName, 'layer']);
        const type = this.getType(props);
        this.checkRuntimesForCompatibility(runtimes, type);
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

    protected checkRuntimesForCompatibility(runtimes: BrefRuntime[], type: FunctionType): void {
        const result = this.brefRuntimeCompatibility.checkRuntimes(runtimes, type);
        if (!result.pass) {
            console.error('Runtime compatibility issues', result.messages);
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