import {ConfigLoader, ConfigStack, ConfigStackProps, HelperRunProps, StackConfig} from "../config";
import {App, Tags} from "aws-cdk-lib/core";
import {NamingHelper, Newable} from "../utils";
import {StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";

interface RunProps<T extends Record<string, any> = StackConfig> {
    configEnv?: string;
    config: T;
}

export class ConfigStackHelper {

    public static getEnv(app: App, props?: HelperRunProps): string | undefined {
        return props?.configEnv ?? app.node.tryGetContext('env');
    }

    public static getConfig<T extends Record<string, any> = StackConfig>(
        configDir?: string,
        configBase?: string,
        configEnv?: string,
        configSuffix?: string
    ): T {
        const loader = new ConfigLoader(configDir, configBase);
        return <T>loader.load(configEnv, configSuffix);
    }

    public static run<S extends ConfigStack = ConfigStack, T extends Record<string, any> = StackConfig>(
        app: App,
        configDir: string,
        stack: Newable<S>,
        props?: HelperRunProps
    ): S {
        const runProps = this.getRunProps<T>(app, configDir, props);
        return this.executeStack(app, stack, runProps.config, props);
    }

    public static executeStack<S extends ConfigStack = ConfigStack, T extends Record<string, any> = StackConfig>(
        app: App,
        stack: Newable<S>,
        config: T,
        props?: HelperRunProps
    ): S {
        const s: S = this.createStack<S, T>(app, stack, config, props);
        s.build();
        return s;
    }

    public static createStack<S extends ConfigStack = ConfigStack, T extends Record<string, any> = StackConfig>(
        app: App,
        stack: Newable<S>,
        config: T,
        props?: HelperRunProps
    ): S {
        this.addTags(app, config);
        const mainStackName = this.getMainStackName(config);
        return new stack(app, mainStackName, config, this.getConfigStackProps(props), this.getStackProps(config, props));
    }

    public static addTags(construct: Construct, config: Record<string, any>) {
        if (config.College) {
            Tags.of(construct).add('College', config.College);
        }
        if (config.Environment) {
            Tags.of(construct).add('Environment', config.Environment);
        }
        if (config.Name) {
            Tags.of(construct).add('App', config.Name);
        }
    }

    public static getAccount(config?: Record<string, any>): string {
        return config?.AWSAccountId ?? process.env.CDK_DEFAULT_ACCOUNT;
    }

    public static getRegion(config?: Record<string, any>): string {
        return config?.AWSRegions ?? process.env.CDK_DEFAULT_REGION;
    }

    public static fromEnvironments<S extends ConfigStack = ConfigStack, T extends Record<string, any> = StackConfig>(
        app: App,
        config: T,
        stack: Newable<S>,
        props?: HelperRunProps
    ): S[] {
        const stacks: S[] = [];
        const environments = config.Environments ?? [];
        for (const envConfig of environments) {
            stacks.push(this.executeStack<S, T>(app, stack, envConfig, props));
        }
        return stacks;
    }

    public static getMainStackName(config: Record<string, any>): string {
        const parts: string[] = [
            this.getBaseName(config),
            config.Name.toLowerCase()
        ];
        if (config.NameSuffix) {
            parts.push(config.NameSuffix.toLowerCase());
        }
        return NamingHelper.fromParts(parts);
    }

    public static getAppName(config: Record<string, any>): string {
        return NamingHelper.fromParts([config.College?.toLowerCase(), config.Name.toLowerCase()]);
    }

    public static getBaseName(config: Record<string, any>): string {
        return NamingHelper.fromParts([config.College?.toLowerCase(), config.Environment?.toLowerCase()]);
    }

    public static validateMinConfig(config: Record<string, any>, throws = true): boolean {
        const errors: string[] = [];
        const checkKeys: string[] = ['College', 'Name'];
        for (const key of checkKeys) {
            if (!config[key]) {
                errors.push(key);
            }
        }
        if (errors.length === 0) {
            return true;
        }
        if (throws) {
            throw Error('Missing config keys: ' + errors.join(' '));
        }
        return false;
    }

    protected static getRunProps<T extends Record<string, any> = StackConfig>(
        app: App,
        configDir: string,
        props?: HelperRunProps
    ): RunProps<T> {
        const configEnv = this.getEnv(app, props);
        const config: T = this.getConfig<T>(configDir, props?.configBase, configEnv, props?.configSuffix);
        return {
            configEnv: configEnv,
            config: config
        }
    }

    protected static getConfigStackProps(props?: HelperRunProps): ConfigStackProps {
        const csProps: ConfigStackProps = {};
        if (props?.idSuffix) {
            csProps.suffix = props.idSuffix
        }
        return csProps;
    }

    protected static getStackProps(config?: Record<string, any>, props?: HelperRunProps): StackProps {
        if (props?.stackProps) {
            return props.stackProps;
        }
        return {
            env: {
                account: this.getAccount(config),
                region: this.getRegion(config)
            }
        }
    }
}