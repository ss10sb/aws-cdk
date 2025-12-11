import {NonConstruct} from "../../../core/non-construct";
import {CodePipelineCodestarSource} from "../../../pipeline/code-pipeline-codestar-source";
import {CodePipelineSynthStep} from "../../../pipeline/code-pipeline-synth-step";
import {EnvBuildType} from "../../../env/env-definitions";
import {EnvBuildTypeHelper} from "../../utils/env-build-type-helper";
import {CodePipelineLambdaBuildStep} from "../../../pipeline/code-pipeline-lambda-build-step";
import {PhpVersion} from "../../../config/config-definitions";
import {BuildStep, BuildStepProps} from "../../build/build-step";

export interface MakeCodePipelineSynthStepProps {
    buildType: EnvBuildType;
    source: CodePipelineCodestarSource;
    phpVersion?: PhpVersion;
    buildStep?: BuildStepProps;
}

export class MakeSynthStep extends NonConstruct {

    public make(props: MakeCodePipelineSynthStepProps): CodePipelineSynthStep {
        return this.createSynthStep(props);
    }

    private createSynthStep(props: MakeCodePipelineSynthStepProps): CodePipelineSynthStep {
        if (EnvBuildTypeHelper.isLambda(props.buildType) && this.wantsBuildStep(props)) {
            const buildStep = this.createBuildStep(props);
            return new CodePipelineSynthStep(this.scope, this.scope.node.id, {
                input: buildStep.step,
                type: props.buildType
            });
        }
        return new CodePipelineSynthStep(this.scope, this.scope.node.id, {
            input: props.source.source,
            type: props.buildType
        });
    }

    private createBuildStep(props: MakeCodePipelineSynthStepProps): CodePipelineLambdaBuildStep {
        return new CodePipelineLambdaBuildStep(this.scope, this.scope.node.id, {
            input: props.source.source,
            buildStep: BuildStep.makeProps(props),
        });
    }

    private wantsBuildStep(props: MakeCodePipelineSynthStepProps): boolean {
        return (props.phpVersion !== undefined || props.buildStep !== undefined);
    }
}