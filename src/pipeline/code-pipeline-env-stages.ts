import {StageDeployment} from "aws-cdk-lib/pipelines";
import {Construct} from "constructs";
import {CodePipelineStageSteps} from "./code-pipeline-stage-steps";
import {CodePipelinePipeline} from "./code-pipeline-pipeline";
import {EnvConfig} from "../env/env-base-stack";
import {EcrRepositoryFactory} from "../ecr/ecr-repository-factory";
import {EnvStage} from "../env/env-stage";
import {NonConstruct} from "../core/non-construct";
import {ConfigStackHelper} from "../utils/config-stack-helper";
import {NamingHelper} from "../utils/naming-helper";

export interface CodePipelineEnvStageProps {
    pipeline: CodePipelinePipeline;
    repositoryFactory?: EcrRepositoryFactory;
    environments: EnvConfig[];
}

export interface CodePipelineStageDeployment {
    deployment: StageDeployment;
    envStage: EnvStage;
}

export class CodePipelineEnvStages extends NonConstruct {

    readonly props: CodePipelineEnvStageProps;
    readonly stages: CodePipelineStageDeployment[];

    constructor(scope: Construct, id: string, props: CodePipelineEnvStageProps) {
        super(scope, id);
        this.props = props;
        this.stages = this.createEnvironmentStages();
    }

    protected getStageName(envConfig: EnvConfig): string {
        return NamingHelper.fromParts([ConfigStackHelper.getMainStackName(envConfig), 'stage']);
    }

    public createEnvStageFromEnvironment(envConfig: EnvConfig, envProps: Record<string, any>): EnvStage {
        const name = this.getStageName(envConfig);
        const env = {
            account: envConfig.AWSAccountId ?? process.env.CDK_DEFAULT_ACCOUNT,
            region: envConfig.AWSRegion ?? process.env.CDK_DEFAULT_REGION
        }
        const stage = new EnvStage(this.scope, name, {
            env: env
        });
        stage.build(envConfig, envProps);
        return stage;
    }

    protected createEnvironmentStages(): CodePipelineStageDeployment[] {
        const stages: CodePipelineStageDeployment[] = [];
        for (const envConfig of this.props.environments) {
            const deploy: boolean = envConfig.Parameters.deploy ?? true;
            if (deploy) {
                const envStage = this.createEnvStageFromEnvironment(envConfig, {
                    repositoryFactory: this.props.repositoryFactory
                });
                const stage = this.props.pipeline.pipeline.addStage(envStage);
                this.stepsFromEnvironment(stage, envConfig);
                stages.push({
                    envStage: envStage,
                    deployment: stage
                });
            }
        }
        return stages;
    }

    protected stepsFromEnvironment(stage: StageDeployment, envConfig: EnvConfig): void {
        const stageSteps = new CodePipelineStageSteps(stage);
        stageSteps.fromEnvConfig(envConfig);
    }
}