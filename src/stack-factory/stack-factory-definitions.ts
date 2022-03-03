import {PreSynthHelper} from "../utils";
import {ConfigStack, HelperRunProps} from "../config";
import {App} from "aws-cdk-lib";

export interface StackFactory {
    readonly app: App;
    initialized: boolean;
    stack: ConfigStack;

    initialize(): void;

    buildStack(props?: HelperRunProps): ConfigStack;
}

export interface CodePipelineEcsStackFactoryProps {
    preSynthHelper: PreSynthHelper;
}

export interface ConfigParamStackFactoryProps {
    configDir?: string;
    env?: string;
}

export interface SecretStackFactoryProps {
    configDir?: string;
}