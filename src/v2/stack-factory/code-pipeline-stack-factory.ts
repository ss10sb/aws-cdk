import {
    CodePipelineMixedStackFactoryProps,
    StackFactory
} from "../../stack-factory/stack-factory-definitions";
import {App} from "aws-cdk-lib";
import {EcrRepositories} from "../../ecr/ecr-repositories";
import {CodePipelineStack} from "../pipeline/code-pipeline-stack";
import {EnvBuildTypeHelper} from "../utils/env-build-type-helper";
import {HelperRunProps, StackConfig} from "../../config/config-definitions";
import {ConfigStackHelper} from "../../utils/config-stack-helper";

export class CodePipelineStackFactory implements StackFactory {

    readonly app: App;
    readonly props: CodePipelineMixedStackFactoryProps;
    initialized = false;
    paramConfig!: Record<string, any>;
    ecrRepositories?: EcrRepositories;
    stack!: CodePipelineStack;

    constructor(props: CodePipelineMixedStackFactoryProps) {
        this.app = new App();
        this.props = props;
    }

    async initialize() {
        const preSynthHelperResponse = await this.props.preSynthHelper.run();
        this.paramConfig = preSynthHelperResponse.config;
        const buildType = EnvBuildTypeHelper.get(this.paramConfig);
        if (EnvBuildTypeHelper.isEcs(buildType)) {
            this.ecrRepositories = <EcrRepositories>preSynthHelperResponse.ecrRepositories;
        }
        this.initialized = true;
    }

    buildStack<T extends Record<string, any> = StackConfig>(props?: HelperRunProps): CodePipelineStack {
        if (!this.initialized) {
            throw Error('Not initialized.');
        }
        this.stack = ConfigStackHelper.createStack<CodePipelineStack, T>(this.app, CodePipelineStack, <T>this.paramConfig, props);
        this.stack.setEcrRepositories(this.ecrRepositories);
        this.stack.build();
        return this.stack;
    }
}