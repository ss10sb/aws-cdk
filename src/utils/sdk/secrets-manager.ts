import {
    ClientDefaults,
    PutSecretValueCommand, PutSecretValueCommandOutput,
    SecretsManagerClient
} from "@aws-sdk/client-secrets-manager";
import {SecretConfigHelper} from "../secret-config-helper";
import {SecretItem} from "../../secret/secret-definitions";

export class SecretsManager {

    readonly client: SecretsManagerClient;
    readonly secretArn: string;

    constructor(secretArn: string, clientConfig: ClientDefaults) {
        this.client = this.createClient(clientConfig);
        this.secretArn = secretArn;
    }

    async put(secrets: SecretItem[]): Promise<PutSecretValueCommandOutput> {
        const converted = JSON.stringify(SecretConfigHelper.convertFromSecretItemsToRecords(secrets));
        const command = new PutSecretValueCommand({SecretId: this.secretArn, SecretString: converted});
        return this.client.send(command);
    }

    private createClient(config: ClientDefaults): SecretsManagerClient {
        return new SecretsManagerClient(config);
    }
}