import {SecretItem, SecretsConfig} from "./secret-definitions";
import {SecretsDeployHelper} from "./secrets-deploy-helper";
import {ClientDefaults, PutSecretValueCommandOutput} from "@aws-sdk/client-secrets-manager";
import util from "util";
import {EnvConfig} from "../env/env-base-stack";
import {ConfigStackHelper} from "../utils/config-stack-helper";
import {HelperRunProps} from "../config/config-definitions";
import {SecretConfigHelper} from "../utils/secret-config-helper";
import {NamingHelper} from "../utils/naming-helper";
import {randomString} from "../utils/random-string";
import {AUTHORIZER_TOKEN} from "../lambda/authorizer-base";

export interface SecretsDeployProps {
    outputFile: string;
    clientConfig?: ClientDefaults;
    configDir?: string;
    debug?: boolean;
}

export interface SecretsDeployResult {
    stackName: string;
    keys: string[];
    result: PutSecretValueCommandOutput | null;
}

export class SecretsDeployFactory {

    readonly props: SecretsDeployProps;
    readonly config: Record<string, any>;

    constructor(props: SecretsDeployProps) {
        this.props = props;
        this.config = ConfigStackHelper.getConfig(this.props.configDir);
        ConfigStackHelper.validateMinConfig(this.config);
        this.updateClientConfig();
    }

    async deploy(props?: HelperRunProps): Promise<SecretsDeployResult[]> {
        const responses = [];
        for (const envConfig of this.config?.Environments ?? []) {
            responses.push(await this.deployEnvironment(envConfig, props));
        }
        return responses;
    }

    async deployEnvironment(envConfig: EnvConfig, props?: HelperRunProps): Promise<SecretsDeployResult> {
        const secretsConfig = SecretConfigHelper.getSecretsConfig(envConfig.Environment, envConfig?.NameSuffix, this.props.configDir);
        this.updateNameSuffix(envConfig, secretsConfig, props?.idSuffix);
        this.addBaseConfigItems(envConfig, secretsConfig);
        this.addAuthorizerToken(secretsConfig);
        const stackName = ConfigStackHelper.getMainStackName(secretsConfig);
        this.debug(stackName)
        this.debug(secretsConfig);
        const helper = new SecretsDeployHelper(this.props.outputFile, this.getClientConfig(envConfig, this.props.clientConfig ?? {}));
        const response = await helper.deploy(stackName, secretsConfig.Parameters?.secrets ?? []);
        this.debug(response);
        return {
            stackName: stackName,
            keys: this.collectSecretKeys(secretsConfig),
            result: response
        };
    }

    private debug(msg: any): void {
        if (this.props.debug ?? false) {
            console.log(util.inspect(msg, {depth: null, colors: true}));
        }
    }

    private addAuthorizerToken(config: Record<string, any>): void {
        if (config.Parameters.secrets === undefined) {
            config.Parameters.secrets = [];
        }
        if (!this.secretsHasKey(AUTHORIZER_TOKEN, config.Parameters.secrets)) {
            config.Parameters.secrets.push({key: AUTHORIZER_TOKEN, value: randomString()});
        }
    }

    private secretsHasKey(key: string, secrets: SecretItem[]): boolean {
        for (const secret of secrets) {
            if (secret.key === key) {
                return true;
            }
        }
        return false;
    }

    private addBaseConfigItems(envConfig: EnvConfig, config: Record<string, any>) {
        const addKeys = ['Name', 'College', 'Environment', 'NameSuffix'];
        for (const key of addKeys) {
            const val = envConfig[key];
            if (val && !config[key]) {
                config[key] = val;
            }
        }
    }

    private collectSecretKeys(config: SecretsConfig): string[] {
        const keys: string[] = [];
        for (const secretItem of config.Parameters?.secrets ?? []) {
            keys.push(secretItem.key);
        }
        return keys;
    }

    private getClientConfig(envConfig: EnvConfig, clientConfig: ClientDefaults): ClientDefaults {
        if (clientConfig.region) {
            return clientConfig;
        }
        if (envConfig.AWSRegion) {
            clientConfig.region = envConfig.AWSRegion;
        }
        if (this.config.AWSRegion) {
            clientConfig.region = this.config.AWSRegion;
        }
        return clientConfig;
    }

    private updateClientConfig(): void {
        if (this.props.clientConfig === undefined && this.config.AWSRegion) {
            this.props.clientConfig = {
                region: this.config.AWSRegion
            }
        }
    }

    private updateNameSuffix(envConfig: EnvConfig, config: SecretsConfig, suffix?: string): void {
        if (suffix) {
            config.NameSuffix = NamingHelper.fromParts([envConfig?.NameSuffix ?? '', suffix]);
        }
    }
}