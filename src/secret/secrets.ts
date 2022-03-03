import {NonConstruct} from "../core";
import {ISecret, Secret} from "aws-cdk-lib/aws-secretsmanager";
import {SecretItem} from "./secret-definitions";
import {SecretConfigHelper} from "../utils";
import {aws_ecs} from "aws-cdk-lib";

export class Secrets extends NonConstruct {

    secret?: ISecret;

    fetch(): ISecret {
        if (!this.secret) {
            this.secret = Secret.fromSecretNameV2(this.scope, `${this.id}-secret-lookup`, this.getSecretName());
        }
        return this.secret;
    }

    getEcsSecretsFromSecret(keys: string[], secret: ISecret): Record<string, aws_ecs.Secret> {
        const secrets: Record<string, aws_ecs.Secret> = {};
        for (const key of keys) {
            secrets[key] = aws_ecs.Secret.fromSecretsManager(secret, key);
        }
        return secrets;
    }

    getEcsSecrets(keys: string[]): Record<string, aws_ecs.Secret> {
        const secret = this.fetch();
        return this.getEcsSecretsFromSecret(keys, secret);
    }

    create(secretItems: SecretItem[]): Secret {
        return new Secret(this.scope, `${this.id}-secret`, {
            secretName: this.getSecretName(),
            generateSecretString: {
                secretStringTemplate: this.convertSecretItemsToJsonString(secretItems),
                generateStringKey: 'salt'
            }
        });
    }

    private getSecretName(suffix = '/environment'): string {
        let name = this.id;
        if (!name.endsWith('-secrets')) {
            name += '-secrets';
        }
        return name + suffix;
    }

    private convertSecretItemsToJsonString(secretItems: SecretItem[]): string {
        return JSON.stringify(SecretConfigHelper.convertFromSecretItemsToRecords(secretItems));
    }
}