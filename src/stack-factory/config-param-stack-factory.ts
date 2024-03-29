import {ConfigParamStackFactoryProps, StackFactory} from "./stack-factory-definitions";
import {App} from "aws-cdk-lib";
import {ConfigStack} from "../config/config-stack";
import {HelperRunProps} from "../config/config-definitions";
import {ConfigStackHelper} from "../utils/config-stack-helper";
import {ConfigParamStack} from "../stack/config-param-stack";
import {SecretConfigKeys} from "../secret/secret-config-keys";
import {ConfigLoader} from "../config/config-loader";

export class ConfigParamStackFactory implements StackFactory {

    readonly app: App;
    readonly props: ConfigParamStackFactoryProps;
    initialized = false;
    stack!: ConfigStack;
    config!: Record<string, any>;

    constructor(props: ConfigParamStackFactoryProps) {
        this.app = new App();
        this.props = props;
    }

    buildStack(props?: HelperRunProps): ConfigStack {
        if (!this.initialized) {
            throw Error('Not initialized.');
        }
        this.stack = ConfigStackHelper.executeStack(this.app, ConfigParamStack, this.config, props);
        return this.stack;
    }

    initialize() {
        this.config = this.loadConfig();
        ConfigStackHelper.validateMinConfig(this.config);
        this.addSecretKeysToConfig();
        this.initialized = true;
    }

    protected addSecretKeysToConfig() {
        const secretConfigKeys = new SecretConfigKeys(this.props.configDir);
        secretConfigKeys.addSecretKeys(this.config);
    }

    protected loadConfig(): Record<string, any> {
        const configLoader = new ConfigLoader(this.props.configDir);
        return configLoader.load(this.props.env);
    }
}