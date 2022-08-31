import {ConfigStackHelper} from "./config-stack-helper";
import {SecretItem, SecretsConfig} from "../secret/secret-definitions";

export class SecretConfigHelper {

    public static getSecretsConfig(env: string, suffix?: string, configDir?: string): SecretsConfig {
        return this.ensureLimited(
            ConfigStackHelper.getConfig<SecretsConfig>(
                configDir,
                'secrets',
                env,
                suffix
            )
        );
    }

    public static ensureLimited(secretsConfig: SecretsConfig): SecretsConfig {
        const limited: SecretsConfig = {Parameters: {secrets: []}};
        for (const [key, value] of Object.entries(this.convertFromSecretItemsToRecords(secretsConfig?.Parameters.secrets ?? []))) {
            limited.Parameters.secrets.push({
                key: key,
                value: value,
            });
        }
        return limited;
    }

    public static convertFromSecretItemsToRecords(secretItems: SecretItem[]): Record<string, any> {
        const records: Record<string, any> = {};
        for (const secretItem of secretItems) {
            records[secretItem.key] = secretItem.value;
        }
        return records;
    }
}