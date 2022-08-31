import {CfnOutput} from "aws-cdk-lib";
import {ConfigStack} from "../config/config-stack";
import {ConfigStackHelper} from "../utils/config-stack-helper";
import {Secrets} from "../secret/secrets";

export class SecretStack extends ConfigStack {

    build() {
        const name = ConfigStackHelper.getMainStackName(this.config);
        const secrets = new Secrets(this, name);
        //const secret = secrets.create(this.config.Parameters?.secrets ?? []);
        const secret = secrets.createEmptySecret();
        const outputName = `${secret.node.id}-arn`;
        new CfnOutput(this, 'secretArn', {value: secret.secretArn, exportName: outputName});
    }
}