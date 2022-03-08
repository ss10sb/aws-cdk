import {ConfigStack} from "../config";
import {EcrRepositories, EcrRepositoryFactory} from "../ecr";
import {
    CodePipelineCodestarSource,
    CodePipelineEcrSteps,
    CodePipelineEcrStepsProps,
    CodePipelineEnvStageProps,
    CodePipelineEnvStages,
    CodePipelinePipeline,
    CodePipelinePipelineProps,
    CodePipelineRun,
    CodePipelineSynthStep,
    CodeStarSourceProps,
    PipelineNotificationRule,
    PipelineNotificationRuleProps
} from "../pipeline";
import {Wave} from "aws-cdk-lib/pipelines";
import {ConfigStackHelper} from "../utils";
import {PermissionsCodePipelineEcsStack} from "../permissions";

export class CodePipelineEcsStack extends ConfigStack {

    ecrRepositories!: EcrRepositories;

    setEcrRepositories(ecrRepositories: EcrRepositories) {
        this.ecrRepositories = ecrRepositories;
    }

    exec() {
        const ecrRepositoryFactory = this.createEcrRepositoryFactory();
        const pipelineSource = this.createCodestarSource(<CodeStarSourceProps>this.config.Parameters?.sourceProps);
        const synthStep = this.createSynthStep(pipelineSource);
        const codePipelineProps: CodePipelinePipelineProps = {
            source: pipelineSource,
            repositoryFactory: ecrRepositoryFactory,
            synth: synthStep
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
        const notificationRule = this.createPipelineNotifications(pipeline);
        const runSchedule = this.createPipelineRunSchedule(pipeline);
        const servicesProps = {
            repositoryFactory: ecrRepositoryFactory,
            pipelineSource: pipelineSource,
            synthStep: synthStep,
            pipeline: pipeline,
            ecrSteps: ecrSteps,
            envStages: envStages,
            notificationRule: notificationRule,
            runSchedule: runSchedule
        };
        new PermissionsCodePipelineEcsStack(this, this.node.id, servicesProps, this.config.Environments ?? []);
    }

    private createCodestarSource(codeStarSourceProps: CodeStarSourceProps): CodePipelineCodestarSource {
        return new CodePipelineCodestarSource(this, this.node.id, codeStarSourceProps);
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

    private createEnvironmentStages(props: CodePipelineEnvStageProps): CodePipelineEnvStages {
        return new CodePipelineEnvStages(this, this.node.id, props);
    }

    private createPipeline(codePipelineProps: CodePipelinePipelineProps): CodePipelinePipeline {
        return new CodePipelinePipeline(this, this.node.id, codePipelineProps);
    }

    private createPipelineNotifications(pipeline: CodePipelinePipeline): PipelineNotificationRule | undefined {
        if (this.config.Parameters?.pipelineNotifications) {
            const props: PipelineNotificationRuleProps = {
                source: pipeline.getBuiltPipeline(),
                detailType: this.config.Parameters.pipelineNotifications?.detailType,
                events: this.config.Parameters.pipelineNotifications?.events ?? [],
                emails: this.config.Parameters.pipelineNotifications?.emails ?? []
            };
            return new PipelineNotificationRule(this, this.node.id, props);
        }
    }

    private createPipelineRunSchedule(pipeline: CodePipelinePipeline): CodePipelineRun | undefined {
        if (this.config.Parameters?.runPipelineSchedule) {
            return new CodePipelineRun(this, this.node.id, {
                pipeline: pipeline,
                schedule: this.config.Parameters.runPipelineSchedule
            });
        }
    }

    private createSynthStep(pipelineSource: CodePipelineCodestarSource): CodePipelineSynthStep {
        return new CodePipelineSynthStep(this, this.node.id, {
            source: pipelineSource.source
        });
    }
}