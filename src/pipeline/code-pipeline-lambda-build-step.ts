import {NonConstruct} from "../core/non-construct";
import {CodeBuildStep, CodePipelineSource} from "aws-cdk-lib/pipelines";
import {Construct} from "constructs";
import {Role, ServicePrincipal} from "aws-cdk-lib/aws-iam";
import {BuildStep, BuildStepProps} from "../v2/build/build-step";

export interface CodePipelineLambdaBuildStepProps {
    input: CodeBuildStep | CodePipelineSource;
    buildStep: BuildStepProps;
}

export class CodePipelineLambdaBuildStep extends NonConstruct {

    readonly step: CodeBuildStep;
    readonly props: CodePipelineLambdaBuildStepProps;
    readonly role: Role;

    constructor(scope: Construct, id: string, props: CodePipelineLambdaBuildStepProps) {
        super(scope, id);
        this.props = props;
        this.role = new Role(this.scope, this.mixNameWithId('lambda-build-step-role'), {
            assumedBy: new ServicePrincipal('codebuild.amazonaws.com')
        });
        this.step = this.create();
    }

    protected create(): CodeBuildStep {
        const buildStepHelper = new BuildStep(this.scope, this.id, this.props.buildStep);
        const props = {
            input: this.props.input,
            role: this.role,
            ...buildStepHelper.makeCodeBuildStepProps(),
        }
        return new CodeBuildStep(this.mixNameWithId('build-step'), props);
    }
}