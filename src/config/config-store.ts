import {ConfigParamStore} from "./config-param-store";
import {Construct} from "constructs";
import {IStringParameter} from "aws-cdk-lib/aws-ssm";

export class ConfigStore {

    readonly scope: Construct;
    readonly configParamStore: ConfigParamStore;
    public paramName = 'config';

    constructor(scope: Construct) {
        this.scope = scope;
        this.configParamStore = new ConfigParamStore(scope, this.scope.node.id);
    }

    store(config: Record<string, any>): IStringParameter {
        return this.configParamStore.store(this.paramName, config);
    }

    getArn(): string {
        return this.configParamStore.getArn(this.paramName);
    }

    getName(): string {
        return this.configParamStore.getParamName(this.paramName);
    }

    protected storeConfigToParamStore(config: Record<string, any>): IStringParameter | null {
        return this.configParamStore.store(this.paramName, config);
    }
}