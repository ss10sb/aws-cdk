import {App} from "aws-cdk-lib";
import {CodePipelineEcsStackFactoryProps, StackFactory} from "./stack-factory-definitions";
import {EcrRepositories} from "../ecr/ecr-repositories";
import {CodePipelineEcsStack} from "../stack/code-pipeline-ecs-stack";
import {HelperRunProps, StackConfig} from "../config/config-definitions";
import {ConfigStackHelper} from "../utils/config-stack-helper";

export class CodePipelineEcsStackFactory implements StackFactory {

    readonly app: App;
    readonly props: CodePipelineEcsStackFactoryProps;
    initialized = false;
    paramConfig!: Record<string, any>;
    ecrRepositories!: EcrRepositories;
    stack!: CodePipelineEcsStack;

    constructor(props: CodePipelineEcsStackFactoryProps) {
        this.app = new App();
        this.props = props;
    }

    async initialize() {
        const preSynthHelperResponse = await this.props.preSynthHelper.run();
        this.paramConfig = preSynthHelperResponse.config;
        this.ecrRepositories = <EcrRepositories>preSynthHelperResponse.ecrRepositories;
        this.initialized = true;
    }

    buildStack<T extends Record<string, any> = StackConfig>(props?: HelperRunProps): CodePipelineEcsStack {
        if (!this.initialized) {
            throw Error('Not initialized.');
        }
        this.stack = ConfigStackHelper.createStack<CodePipelineEcsStack, T>(this.app, CodePipelineEcsStack, <T>this.paramConfig, props);
        this.stack.setEcrRepositories(this.ecrRepositories);
        this.stack.build();
        return this.stack;
    }
}