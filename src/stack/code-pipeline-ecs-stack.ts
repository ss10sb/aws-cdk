import {Wave} from "aws-cdk-lib/pipelines";
import {CodePipelineBaseStack} from "./code-pipeline-base-stack";
import {EcrRepositories} from "../ecr/ecr-repositories";
import {CodeStarSourceProps} from "../pipeline/code-pipeline-codestar-source";
import {EnvBuildType} from "../env/env-definitions";
import {CodePipelinePipeline, CodePipelinePipelineProps} from "../pipeline/code-pipeline-pipeline";
import {PermissionsCodePipelineEcsStack} from "../permissions/permissions-code-pipeline-ecs-stack";
import {EcrRepositoryFactory} from "../ecr/ecr-repository-factory";
import {ConfigStackHelper} from "../utils/config-stack-helper";
import {CodePipelineEcrSteps, CodePipelineEcrStepsProps} from "../pipeline/code-pipeline-ecr-steps";
import {CodePipelineEnvStages} from "../pipeline/code-pipeline-env-stages";

export class CodePipelineEcsStack extends CodePipelineBaseStack {

    ecrRepositories!: EcrRepositories;
    envStages?: CodePipelineEnvStages;

    setEcrRepositories(ecrRepositories: EcrRepositories) {
        this.ecrRepositories = ecrRepositories;
    }

    exec() {
        const ecrRepositoryFactory = this.createEcrRepositoryFactory();
        const pipelineSource = this.createCodestarSource(<CodeStarSourceProps>this.config.Parameters?.sourceProps);
        const synthStep = this.createSynthStep(pipelineSource, EnvBuildType.ECS);
        const codePipelineProps: CodePipelinePipelineProps = {
            source: pipelineSource,
            repositoryFactory: ecrRepositoryFactory,
            synth: synthStep,
            buildStepImage: this.config.Parameters?.buildStepImage,
            phpVersion: this.config.Parameters?.phpVersion
        };
        const pipeline = this.createPipeline(codePipelineProps);
        const ecrSteps = this.createEcrSteps({
            repositories: ecrRepositoryFactory.ecrRepositories,
            source: pipelineSource
        });
        this.createEcrWave(pipeline, ecrSteps);
        const envStages = this.createEnvironmentStages({
            pipeline: pipeline,
            repositoryFactory: ecrRepositoryFactory,
            environments: this.config.Environments ?? []
        });
        this.envStages = envStages;
        const notificationRule = this.createPipelineNotifications(pipeline);
        //const notificationRules = this.createPipelineNotifyOnRules(pipeline);
        const runSchedule = this.createPipelineRunSchedule(pipeline);
        const servicesProps = {
            repositoryFactory: ecrRepositoryFactory,
            pipelineSource: pipelineSource,
            synthStep: synthStep,
            pipeline: pipeline,
            ecrSteps: ecrSteps,
            envStages: envStages,
            notificationRule: notificationRule,
            runSchedule: runSchedule,
            needsSharedSynthStepPermissions: true
        };
        new PermissionsCodePipelineEcsStack(this, this.node.id, servicesProps, this.config.Environments ?? []);
    }

    private createEcrRepositoryFactory(): EcrRepositoryFactory {
        if (!this.ecrRepositories) {
            this.ecrRepositories = new EcrRepositories(ConfigStackHelper.getAppName(this.config), this.config.Parameters?.repositories ?? {repositories: []});
        }
        const factory = new EcrRepositoryFactory(this, this.node.id, this.ecrRepositories);
        factory.create();
        return factory;
    }

    private createEcrSteps(props: CodePipelineEcrStepsProps): CodePipelineEcrSteps {
        return new CodePipelineEcrSteps(this, this.node.id, props);
    }

    private createEcrWave(pipeline: CodePipelinePipeline, ecrSteps: CodePipelineEcrSteps): Wave {
        return pipeline.pipeline.addWave('ecr-build', {
            post: ecrSteps.steps
        });
    }
}