import {ISecret, Secret} from "aws-cdk-lib/aws-secretsmanager";
import {SecretItem} from "./secret-definitions";
import {aws_ecs, SecretValue} from "aws-cdk-lib";
import {NonConstruct} from "../core/non-construct";
import {SecretConfigHelper} from "../utils/secret-config-helper";
import {NameIncrementer} from "../utils/name-incrementer";

export class Secrets extends NonConstruct {

    static secret?: ISecret;

    static sharedSecret?: ISecret;

    static cachedSecrets: Record<string, ISecret> = {}

    nameIncrementer?: NameIncrementer;

    fetch(): ISecret {
        if (!Secrets.secret) {
            Secrets.secret = Secret.fromSecretNameV2(this.scope, this.getIncrementedName(`${this.id}-secret-lookup`), this.getSecretName());
            Secrets.cachedSecrets[Secrets.secret.secretFullArn ?? Secrets.secret.secretArn] = Secrets.secret;
        }
        return Secrets.secret;
    }

    fetchShared(arn: string): ISecret {
        if (!Secrets.sharedSecret) {
            Secrets.sharedSecret = this.fetchByArn(arn);
        }
        return Secrets.sharedSecret;
    }

    fetchByArn(arn: string): ISecret {
        if (!Secrets.cachedSecrets[arn]) {
            Secrets.cachedSecrets[arn] = Secret.fromSecretCompleteArn(this.scope, this.getIncrementedName(`${this.id}-secret-lookup-arn`), arn);
        }
        return Secrets.cachedSecrets[arn];
    }

    getEcsSecretsFromSecret(keys: string[], secret: ISecret): Record<string, aws_ecs.Secret> {
        const secrets: Record<string, aws_ecs.Secret> = {};
        for (const key of keys) {
            secrets[key] = aws_ecs.Secret.fromSecretsManager(secret, key);
        }
        return secrets;
    }

    getEcsSecrets(keys: string[], shared = false): Record<string, aws_ecs.Secret> {
        let secret = Secrets.secret;
        if (shared) {
            secret = Secrets.sharedSecret;
        }
        if (secret) {
            return this.getEcsSecretsFromSecret(keys, secret);
        }
        return {};
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

    getIncrementedName(name: string): string {
        return this.getNameIncrementer().next(name);
    }

    private getNameIncrementer(): NameIncrementer {
        if (!this.nameIncrementer) {
            this.nameIncrementer = new NameIncrementer();
        }
        return this.nameIncrementer;
    }
}