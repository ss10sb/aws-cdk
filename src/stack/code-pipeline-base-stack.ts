import { ConfigStack } from "../config/config-stack";
import {CodePipelineCodestarSource, CodeStarSourceProps} from "../pipeline/code-pipeline-codestar-source";
import {CodePipelineEnvStageProps, CodePipelineEnvStages} from "../pipeline/code-pipeline-env-stages";
import {CodePipelinePipeline, CodePipelinePipelineProps} from "../pipeline/code-pipeline-pipeline";
import {PipelineNotificationRule, PipelineNotificationRuleProps} from "../pipeline/pipeline-notification-rule";
import {PipelineNotifyOn} from "../pipeline/pipeline-notify-on";
import {CodePipelineRun} from "../pipeline/code-pipeline-run";
import {EnvBuildType} from "../env/env-definitions";
import {CodePipelineSynthStep} from "../pipeline/code-pipeline-synth-step";

export abstract class CodePipelineBaseStack extends ConfigStack {

    protected createCodestarSource(codeStarSourceProps: CodeStarSourceProps): CodePipelineCodestarSource {
        return new CodePipelineCodestarSource(this, this.node.id, codeStarSourceProps);
    }

    protected createEnvironmentStages(props: CodePipelineEnvStageProps): CodePipelineEnvStages {
        return new CodePipelineEnvStages(this, this.node.id, props);
    }

    protected createPipeline(codePipelineProps: CodePipelinePipelineProps): CodePipelinePipeline {
        return new CodePipelinePipeline(this, this.node.id, codePipelineProps);
    }

    protected createPipelineNotifications(pipeline: CodePipelinePipeline): PipelineNotificationRule | undefined {
        if (this.config.Parameters?.pipelineNotification) {
            const props: PipelineNotificationRuleProps = {
                source: pipeline.getBuiltPipeline(),
                detailType: this.config.Parameters.pipelineNotification?.detailType,
                events: this.config.Parameters.pipelineNotification?.events ?? [],
                emails: this.config.Parameters.pipelineNotification?.emails ?? []
            };
            return new PipelineNotificationRule(this, this.node.id, props);
        }
    }

    /**
     * Not currently in use (createPipelineNotifications instead)
     * @param pipeline
     * @protected
     */
    protected createPipelineNotifyOnRules(pipeline: CodePipelinePipeline): PipelineNotifyOn | undefined {
        if (this.config.Parameters?.pipelineNotification) {
            const props: PipelineNotificationRuleProps = {
                source: pipeline.getBuiltPipeline(),
                detailType: this.config.Parameters.pipelineNotification?.detailType,
                events: this.config.Parameters.pipelineNotification?.events ?? [],
                emails: this.config.Parameters.pipelineNotification?.emails ?? []
            };
            return new PipelineNotifyOn(this, this.node.id, props);
        }
    }

    protected createPipelineRunSchedule(pipeline: CodePipelinePipeline): CodePipelineRun | undefined {
        if (this.config.Parameters?.runPipelineSchedule) {
            return new CodePipelineRun(this, this.node.id, {
                pipeline: pipeline,
                schedule: this.config.Parameters.runPipelineSchedule
            });
        }
    }

    protected createSynthStep(pipelineSource: CodePipelineCodestarSource, type: EnvBuildType): CodePipelineSynthStep {
        return new CodePipelineSynthStep(this, this.node.id, {
            input: pipelineSource.source,
            type: type,
            phpVersion: this.config.Parameters?.phpVersion,
            buildStepImage: this.config.Parameters?.buildStepImage
        });
    }
}