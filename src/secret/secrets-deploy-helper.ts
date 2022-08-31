import {ClientDefaults, PutSecretValueCommandOutput} from "@aws-sdk/client-secrets-manager";
import * as fs from "fs";
import {SecretItem} from "./secret-definitions";
import {SecretsManager} from "../utils/sdk/secrets-manager";

export class SecretsDeployHelper {

    readonly pathToArn: string;
    readonly outputJson: Record<string, any>;
    readonly clientConfig: ClientDefaults;

    constructor(pathToArn: string, clientConfig: ClientDefaults) {
        this.pathToArn = pathToArn;
        this.clientConfig = clientConfig;
        this.outputJson = this.getOutputJson();
    }

    async deploy(stackName: string, secrets: SecretItem[]): Promise<PutSecretValueCommandOutput | null> {
        const arn = this.getArn(stackName);
        if (arn) {
            const secretsManager = new SecretsManager(arn, this.clientConfig);
            return secretsManager.put(secrets);
        }
        console.log(`ARN [${arn}] not found for stack name [${stackName}].`);
        return null;
    }

    getArn(stackName: string): string | undefined {
        return this.outputJson[stackName]?.secretArn;
    }

    getOutputJson(): Record<string, any> {
        if (fs.existsSync(this.pathToArn)) {
            return JSON.parse(fs.readFileSync(this.pathToArn, 'utf-8'));
        } else {
            console.log(`${this.pathToArn} does not exist.`);
        }
        return {};
    }
}