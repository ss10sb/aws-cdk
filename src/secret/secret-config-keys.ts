import {SecretsConfig} from "./secret-definitions";
import {StackConfig} from "../config/config-definitions";
import {SecretConfigHelper} from "../utils/secret-config-helper";

export class SecretConfigKeys {

    readonly configDir?: string;

    constructor(configDir?: string) {
        this.configDir = configDir;
    }

    addSecretKeys<T extends Record<string, any> = StackConfig>(config: T): T {
        for (const environment of config.Environments ?? []) {
            environment.Parameters.secretKeys = this.getSecretKeys(environment);
        }
        return config;
    }

    private getSecretKeys(config: Record<string, any>): string[] {
        const secretsConfig = SecretConfigHelper.getSecretsConfig(config.Environment, config.NameSuffix, this.configDir);
        return this.convertSecretsToKeys(secretsConfig);
    }

    private convertSecretsToKeys(secretsConfig: SecretsConfig): string[] {
        const keys: string[] = [];
        for (const secretItem of secretsConfig?.Parameters?.secrets ?? []) {
            keys.push(secretItem.key);
        }
        return keys;
    }
}