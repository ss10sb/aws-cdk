import {Construct} from "constructs";
import {StringParameter} from "aws-cdk-lib/aws-ssm";
import {Arn, Stack} from "aws-cdk-lib";
import {ConfigEnvironments} from "./config-definitions";
import { NonConstruct } from "../core/non-construct";
import {SsmHelper} from "../utils/ssm-helper";
import {NamingHelper} from "../utils/naming-helper";

export class ConfigParamStore extends NonConstruct {

    public storable: Record<string, any> = {
        Name: '',
        College: 'PCC',
        Environment: ConfigEnvironments.SDLC,
        Parameters: {},
        Environments: [],
    };

    public advancedSize: number;

    constructor(scope: Construct, id: string) {
        super(scope, id);
        this.advancedSize = SsmHelper.advancedSize;
    }

    store(name: string, config: Record<string, any>, useBase = true): StringParameter {
        const stored = useBase ? this.fromBase(config) : this.fromConfig(config);
        const stringed: string = JSON.stringify(stored);
        return SsmHelper.createParam(this.scope, this.getParamName(name), stringed);
    }

    getParamName(name: string): string {
        return NamingHelper.configParamName(this.id, name);
    }

    getArn(name: string): string {
        return Arn.format({
            service: 'ssm',
            resource: 'parameter',
            resourceName: this.getParamName(name)
        }, Stack.of(this.scope));
    }

    private fromBase(config: Record<string, any>): Record<string, any> {
        const stored: Record<string, any> = {};
        for (const [key, defaultValue] of Object.entries(this.storable)) {
            stored[key] = config[key] ?? defaultValue;
        }
        return stored;
    }

    private fromConfig(config: Record<string, any>): Record<string, any> {
        return config;
    }
}