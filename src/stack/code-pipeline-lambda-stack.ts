import {CodePipelineEnvStages} from "../pipeline/code-pipeline-env-stages";
import {CodePipelineBaseStack} from "./code-pipeline-base-stack";
import {CodePipelineCodestarSource, CodeStarSourceProps} from "../pipeline/code-pipeline-codestar-source";
import {EnvBuildType} from "../env/env-definitions";
import {CodePipelinePipelineProps} from "../pipeline/code-pipeline-pipeline";
import {CodePipelineLambdaStackServicesProps} from "../pipeline/code-pipeline-definitions";
import {PermissionsCodePipelineLambdaStack} from "../permissions/permissions-code-pipeline-lambda-stack";
import {CodePipelineSynthStep} from "../pipeline/code-pipeline-synth-step";
import {CodePipelineLambdaBuildStep} from "../pipeline/code-pipeline-lambda-build-step";

export class CodePipelineLambdaStack extends CodePipelineBaseStack {

    envStages?: CodePipelineEnvStages;

    exec() {
        const pipelineSource = this.createCodestarSource(<CodeStarSourceProps>this.config.Parameters?.sourceProps);
        const buildStep = this.createBuildStep(pipelineSource);
        const synthStep = this.createSynthStepForLambdaBuild(buildStep);
        const codePipelineProps: CodePipelinePipelineProps = {
            source: pipelineSource,
            synth: synthStep
        };
        const pipeline = this.createPipeline(codePipelineProps);
        const envStages = this.createEnvironmentStages({
            pipeline: pipeline,
            environments: this.config.Environments ?? []
        });
        this.envStages = envStages;
        const notificationRule = this.createPipelineNotifications(pipeline);
        //const notificationRules = this.createPipelineNotifyOnRules(pipeline);
        const runSchedule = this.createPipelineRunSchedule(pipeline);
        const servicesProps: CodePipelineLambdaStackServicesProps = {
            pipeline: pipeline,
            envStages: envStages,
            pipelineSource: pipelineSource,
            notificationRule: notificationRule,
            synthStep: synthStep,
            runSchedule: runSchedule
        }
        new PermissionsCodePipelineLambdaStack(this, this.node.id, servicesProps, this.config.Environments ?? []);
    }

    private createBuildStep(pipelineSource: CodePipelineCodestarSource): CodePipelineLambdaBuildStep {
        return new CodePipelineLambdaBuildStep(this, this.node.id, {
            input: pipelineSource.source
        });
    }

    private createSynthStepForLambdaBuild(buildStep: CodePipelineLambdaBuildStep): CodePipelineSynthStep {
        return new CodePipelineSynthStep(this, this.node.id, {
            input: buildStep.step,
            type: EnvBuildType.LAMBDA
        });
    }
}