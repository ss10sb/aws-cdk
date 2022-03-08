import {
    CodePipelineEcsStackFactory,
    CodePipelineEcsStackFactoryProps,
    ConfigParamStackFactory,
    ConfigParamStackFactoryProps,
    SecretStackFactory,
    SecretStackFactoryProps
} from "./stack-factory";
import {CodePipelineEcsStack, ConfigParamStack, SecretStack} from "./stack";
import {HelperRunProps} from "./config";

export async function buildCodePipelineEcsStack(props: CodePipelineEcsStackFactoryProps, helperRunProps?: HelperRunProps): Promise<CodePipelineEcsStack> {
    const factory = new CodePipelineEcsStackFactory(props);
    await factory.initialize();
    return factory.buildStack(helperRunProps);
}

export function buildConfigParamStack(props: ConfigParamStackFactoryProps, helperRunProps?: HelperRunProps): ConfigParamStack {
    const factory = new ConfigParamStackFactory(props);
    factory.initialize();
    return factory.buildStack(helperRunProps);
}

export function buildSecretStacks(props: SecretStackFactoryProps, helperRunProps?: HelperRunProps): SecretStack[] {
    const factory = new SecretStackFactory(props);
    factory.initialize();
    return factory.buildStacks(helperRunProps);
}