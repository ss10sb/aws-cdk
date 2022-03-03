import {ConfigParamStore, ConfigStack} from "../config";
import {ConfigStackHelper} from "../utils";

export class ConfigParamStack extends ConfigStack {

    build() {
        const name = ConfigStackHelper.getMainStackName(this.config);
        const configParamStore = new ConfigParamStore(this, name);
        configParamStore.store('config', this.config);
    }
}