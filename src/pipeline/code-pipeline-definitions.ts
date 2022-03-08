import {CodePipelineSource} from "aws-cdk-lib/pipelines";
import {CodePipelineSynthStep} from "./code-pipeline-synth-step";
import {CodePipelineCodestarSource} from "./code-pipeline-codestar-source";
import {EcrRepositories, EcrRepositoryFactory} from "../ecr";
import {IRepository} from "aws-cdk-lib/aws-ecr";
import {IRole} from "aws-cdk-lib/aws-iam";
import {CodePipelinePipeline} from "./code-pipeline-pipeline";
import {EnvConfig} from "../env";
import {CodePipelineEcrSteps} from "./code-pipeline-ecr-steps";
import {CodePipelineEnvStages} from "./code-pipeline-env-stages";
import {PipelineNotificationRule} from "./pipeline-notification-rule";
import {CodePipelineRun} from "./code-pipeline-run";
import {PipelineNotifyOn} from "./pipeline-notify-on";

export interface SourceProps {
    owner: string;
    repo: string;
    branch?: string;
    triggerOnPush?: boolean;
}

export interface CodeStarSourceProps extends SourceProps {
    connectionArn: string;
}

export interface CodePipelineSynthStepProps {
    source: CodePipelineSource;
}

export interface CodePipelinePipelineProps {
    source: CodePipelineCodestarSource;
    synth: CodePipelineSynthStep;
    repositoryFactory: EcrRepositoryFactory;
    crossAccountKeys?: boolean;
}

export interface CodePipelineEcrStepProps {
    readonly name: string;
    readonly repository: IRepository;
    readonly imageTag: string;
    readonly source: CodePipelineCodestarSource;
    readonly role: IRole;
}

export interface CodePipelineEcrStepsProps {
    repositories: EcrRepositories;
    source: CodePipelineCodestarSource;
}

export interface CodePipelineEnvStageProps {
    pipeline: CodePipelinePipeline;
    repositoryFactory: EcrRepositoryFactory;
    environments: EnvConfig[];
}

export interface CodePipelineEcsStackServicesProps {
    ecrSteps: CodePipelineEcrSteps;
    envStages: CodePipelineEnvStages;
    pipeline: CodePipelinePipeline;
    pipelineSource: CodePipelineCodestarSource;
    repositoryFactory: EcrRepositoryFactory;
    synthStep: CodePipelineSynthStep;
    notificationRule?: PipelineNotificationRule;
    notificationRules?: PipelineNotifyOn;
    runSchedule?: CodePipelineRun;
}

export interface CodePipelineRunProps {
    pipeline: CodePipelinePipeline;
    schedule: string;
}