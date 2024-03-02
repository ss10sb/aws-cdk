import {CodePipelineSynthStep} from "./code-pipeline-synth-step";
import {CodePipelineCodestarSource} from "./code-pipeline-codestar-source";
import {CodePipelinePipeline} from "./code-pipeline-pipeline";
import {CodePipelineEcrSteps} from "./code-pipeline-ecr-steps";
import {CodePipelineEnvStages} from "./code-pipeline-env-stages";
import {PipelineNotificationRule} from "./pipeline-notification-rule";
import {CodePipelineRun} from "./code-pipeline-run";
import {PipelineNotifyOn} from "./pipeline-notify-on";
import {EcrRepositoryFactory} from "../ecr/ecr-repository-factory";
import {MakeCodePipelineStages} from "../v2/pipeline/make-code-pipeline-stages";

export interface CodePipelineStackServicesProps {
    envStages: CodePipelineEnvStages | MakeCodePipelineStages;
    pipeline: CodePipelinePipeline;
    pipelineSource: CodePipelineCodestarSource;
    synthStep: CodePipelineSynthStep;
    notificationRule?: PipelineNotificationRule;
    notificationRules?: PipelineNotifyOn;
    runSchedule?: CodePipelineRun;
    needsSharedSynthStepPermissions?: boolean;
}

export interface CodePipelineEcsStackServicesProps extends CodePipelineStackServicesProps {
    ecrSteps: CodePipelineEcrSteps;
    repositoryFactory: EcrRepositoryFactory;
}

export interface CodePipelineLambdaStackServicesProps extends CodePipelineStackServicesProps {

}