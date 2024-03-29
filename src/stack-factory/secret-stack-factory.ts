import {SecretStackFactoryProps} from "./stack-factory-definitions";
import {App} from "aws-cdk-lib";
import {EnvConfig} from "../env/env-base-stack";
import {SecretStack} from "../stack/secret-stack";
import {HelperRunProps} from "../config/config-definitions";
import {ConfigStackHelper} from "../utils/config-stack-helper";
import {SecretsConfig} from "../secret/secret-definitions";
import {SecretConfigHelper} from "../utils/secret-config-helper";

export class SecretStackFactory {

    readonly app: App;
    readonly props: SecretStackFactoryProps;
    initialized = false;
    config!: Record<string, any>;
    stacks: SecretStack[] = [];

    constructor(props: SecretStackFactoryProps) {
        this.app = new App();
        this.props = props;
    }

    buildStacks(props?: HelperRunProps): SecretStack[] {
        if (!this.initialized) {
            throw Error('Not initialized.');
        }
        for (const environment of this.config?.Environments ?? []) {
            this.stacks.push(this.buildStack(environment, props));
        }
        return this.stacks;
    }

    private buildStack(environment: EnvConfig, props?: HelperRunProps): SecretStack {
        const secretsConfig = this.getSecretConfig(environment.Environment, environment?.NameSuffix);
        this.addBaseConfigItems(environment, secretsConfig);
        return ConfigStackHelper.executeStack<SecretStack, SecretsConfig>(this.app, SecretStack, secretsConfig, props);
    }

    initialize(): void {
        this.config = ConfigStackHelper.getConfig(this.props.configDir);
        ConfigStackHelper.validateMinConfig(this.config);
        this.initialized = true;
    }

    private getSecretConfig(env: string, suffix?: string): SecretsConfig {
        return SecretConfigHelper.getSecretsConfig(env, suffix, this.props.configDir);
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
}