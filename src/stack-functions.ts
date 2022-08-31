import {
    CodePipelineEcsStackFactoryProps,
    CodePipelineLambdaStackFactoryProps, ConfigParamStackFactoryProps, SecretStackFactoryProps
} from "./stack-factory/stack-factory-definitions";
import {HelperRunProps} from "./config/config-definitions";
import {CodePipelineEcsStack} from "./stack/code-pipeline-ecs-stack";
import {CodePipelineEcsStackFactory} from "./stack-factory/code-pipeline-ecs-stack-factory";
import {CodePipelineLambdaStack} from "./stack/code-pipeline-lambda-stack";
import {CodePipelineLambdaStackFactory} from "./stack-factory/code-pipeline-lambda-stack-factory";
import {ConfigParamStack} from "./stack/config-param-stack";
import {ConfigParamStackFactory} from "./stack-factory/config-param-stack-factory";
import {SecretStack} from "./stack/secret-stack";
import {SecretStackFactory} from "./stack-factory/secret-stack-factory";
import {SecretsDeployFactory, SecretsDeployProps, SecretsDeployResult} from "./secret/secrets-deploy-factory";

export async function buildCodePipelineEcsStack(props: CodePipelineEcsStackFactoryProps, helperRunProps?: HelperRunProps): Promise<CodePipelineEcsStack> {
    const factory = new CodePipelineEcsStackFactory(props);
    await factory.initialize();
    return factory.buildStack(helperRunProps);
}

export async function buildCodePipelineLambdaStack(props: CodePipelineLambdaStackFactoryProps, helperRunProps?: HelperRunProps): Promise<CodePipelineLambdaStack> {
    const factory = new CodePipelineLambdaStackFactory(props);
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

export async function deploySecrets(props: SecretsDeployProps, helperRunProps?: HelperRunProps): Promise<SecretsDeployResult[]> {
    const factory = new SecretsDeployFactory(props);
    return factory.deploy(helperRunProps);
}