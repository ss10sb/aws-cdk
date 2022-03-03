import {App} from "aws-cdk-lib";
import {HelperRunProps, StackConfig} from "../config";
import {ConfigStackHelper} from "../utils";
import {EcrRepositories} from "../ecr";
import {CodePipelineEcsStack} from "../stack";
import {CodePipelineEcsStackFactoryProps, StackFactory} from "./stack-factory-definitions";

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
        this.ecrRepositories = preSynthHelperResponse.ecrRepositories;
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