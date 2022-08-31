import {CodePipelineLambdaStackFactoryProps, StackFactory} from "./stack-factory-definitions";
import {App} from "aws-cdk-lib";
import {CodePipelineLambdaStack} from "../stack/code-pipeline-lambda-stack";
import {HelperRunProps, StackConfig} from "../config/config-definitions";
import {ConfigStackHelper} from "../utils/config-stack-helper";

export class CodePipelineLambdaStackFactory implements StackFactory {

    readonly app: App;
    readonly props: CodePipelineLambdaStackFactoryProps;
    initialized = false;
    paramConfig!: Record<string, any>;
    stack!: CodePipelineLambdaStack;

    constructor(props: CodePipelineLambdaStackFactoryProps) {
        this.app = new App();
        this.props = props;
    }

    async initialize() {
        const preSynthHelperResponse = await this.props.preSynthHelper.run({loadEcr: false});
        this.paramConfig = preSynthHelperResponse.config;
        this.initialized = true;
    }

    buildStack<T extends Record<string, any> = StackConfig>(props?: HelperRunProps): CodePipelineLambdaStack {
        if (!this.initialized) {
            throw Error('Not initialized.');
        }
        this.stack = ConfigStackHelper.createStack<CodePipelineLambdaStack, T>(this.app, CodePipelineLambdaStack, <T>this.paramConfig, props);
        this.stack.build();
        return this.stack;
    }
}