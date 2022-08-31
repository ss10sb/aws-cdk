import {CodePipelineSynthStep} from "./code-pipeline-synth-step";
import {CodePipelineCodestarSource} from "./code-pipeline-codestar-source";
import {CodePipelinePipeline} from "./code-pipeline-pipeline";
import {CodePipelineEcrSteps} from "./code-pipeline-ecr-steps";
import {CodePipelineEnvStages} from "./code-pipeline-env-stages";
import {PipelineNotificationRule} from "./pipeline-notification-rule";
import {CodePipelineRun} from "./code-pipeline-run";
import {PipelineNotifyOn} from "./pipeline-notify-on";
import {EcrRepositoryFactory} from "../ecr/ecr-repository-factory";

export interface CodePipelineStackServicesProps {
    envStages: CodePipelineEnvStages;
    pipeline: CodePipelinePipeline;
    pipelineSource: CodePipelineCodestarSource;
    synthStep: CodePipelineSynthStep;
    notificationRule?: PipelineNotificationRule;
    notificationRules?: PipelineNotifyOn;
    runSchedule?: CodePipelineRun;
}

export interface CodePipelineEcsStackServicesProps extends CodePipelineStackServicesProps {
    ecrSteps: CodePipelineEcrSteps;
    repositoryFactory: EcrRepositoryFactory;
}

export interface CodePipelineLambdaStackServicesProps extends CodePipelineStackServicesProps {

}