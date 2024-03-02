import {App} from "aws-cdk-lib";
import {ConfigStack} from "../config/config-stack";
import {HelperRunProps} from "../config/config-definitions";
import {PreSynthHelper} from "../utils/pre-synth-helper";

export interface StackFactory {
    readonly app: App;
    initialized: boolean;
    stack: ConfigStack;

    initialize(): void;

    buildStack(props?: HelperRunProps): ConfigStack;
}

export interface CodePipelineStackFactoryProps {
    preSynthHelper: PreSynthHelper;
}

export interface CodePipelineEcsStackFactoryProps extends CodePipelineStackFactoryProps {

}

export interface CodePipelineLambdaStackFactoryProps extends CodePipelineStackFactoryProps {

}

export interface CodePipelineMixedStackFactoryProps extends CodePipelineStackFactoryProps {

}

export interface ConfigParamStackFactoryProps {
    configDir?: string;
    env?: string;
}

export interface SecretStackFactoryProps {
    configDir?: string;
}