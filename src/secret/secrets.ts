import {ISecret, Secret} from "aws-cdk-lib/aws-secretsmanager";
import {SecretItem} from "./secret-definitions";
import {aws_ecs, SecretValue} from "aws-cdk-lib";
import {NonConstruct} from "../core/non-construct";
import {SecretConfigHelper} from "../utils/secret-config-helper";

export class Secrets extends NonConstruct {

    static secret?: ISecret;

    fetch(): ISecret {
        if (!Secrets.secret) {
            Secrets.secret = Secret.fromSecretNameV2(this.scope, `${this.id}-secret-lookup`, this.getSecretName());
        }
        return Secrets.secret;
    }

    fetchByArn(arn: string): ISecret {
        if (!Secrets.secret) {
            Secrets.secret = Secret.fromSecretCompleteArn(this.scope, `${this.id}-secret-lookup-arn`, arn);
        }
        return Secrets.secret;
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

    static getReferencesFromSecret(keys: string[], secret: ISecret): Record<string, string> {
        const secrets: Record<string, string> = {};
        for (const key of keys) {
            secrets[key] = Secrets.getReferenceFromSecret(key, secret);
        }
        return secrets;
    }

    static getReferenceFromSecret(key: string, secret: ISecret): string {
        const s = SecretValue.secretsManager(secret.secretArn, {
            jsonField: key
        });
        return s.toString();
    }

    createEmptySecret(): Secret {
        return this.create([]);
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