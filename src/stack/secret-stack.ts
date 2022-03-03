import {ConfigStack} from "../config";
import {Secrets} from "../secret";
import {ConfigStackHelper} from "../utils";

export class SecretStack extends ConfigStack {

    build() {
        const name = ConfigStackHelper.getMainStackName(this.config);
        const secrets = new Secrets(this, name);
        secrets.create(this.config.Parameters?.secrets ?? []);
    }
}