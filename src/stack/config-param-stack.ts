import {ConfigStack} from "../config/config-stack";
import {ConfigStackHelper} from "../utils/config-stack-helper";
import {ConfigParamStore} from "../config/config-param-store";

export class ConfigParamStack extends ConfigStack {

    build() {
        const name = ConfigStackHelper.getMainStackName(this.config);
        const configParamStore = new ConfigParamStore(this, name);
        configParamStore.store('config', this.config);
    }
}