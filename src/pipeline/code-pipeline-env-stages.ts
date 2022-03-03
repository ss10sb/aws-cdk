import {NonConstruct} from "../core";
import {CodePipelineEnvStageProps} from "./code-pipeline-definitions";
import {StageDeployment} from "aws-cdk-lib/pipelines";
import {Construct} from "constructs";
import {EnvConfig, EnvProps, EnvStage} from "../env";
import {ConfigStackHelper} from "../utils";
import {CodePipelineStageSteps} from "./code-pipeline-stage-steps";

export class CodePipelineEnvStages extends NonConstruct {

    readonly props: CodePipelineEnvStageProps;
    readonly stages: StageDeployment[];

    constructor(scope: Construct, id: string, props: CodePipelineEnvStageProps) {
        super(scope, id);
        this.props = props;
        this.stages = this.createEnvironmentStages();
    }

    protected getStageName(envConfig: EnvConfig): string {
        return ConfigStackHelper.getMainStackName(envConfig);
    }

    public createEnvStageFromEnvironment(envConfig: EnvConfig, envProps: EnvProps): EnvStage {
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

    protected createEnvironmentStages(): StageDeployment[] {
        const stages: StageDeployment[] = [];
        for (const envConfig of this.props.environments) {
            const deploy: boolean = envConfig.Parameters.deploy ?? true;
            if (deploy) {
                const envStage = this.createEnvStageFromEnvironment(envConfig, {
                    repositoryFactory: this.props.repositoryFactory
                });
                const stage = this.props.pipeline.pipeline.addStage(envStage);
                this.stepsFromEnvironment(stage, envConfig);
                stages.push(stage);
            }
        }
        return stages;
    }

    protected stepsFromEnvironment(stage: StageDeployment, envConfig: EnvConfig): void {
        const stageSteps = new CodePipelineStageSteps(stage);
        stageSteps.fromEnvConfig(envConfig);
    }
}