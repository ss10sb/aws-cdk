import {NonConstruct} from "../../core/non-construct";
import {CodePipelinePipeline} from "../../pipeline/code-pipeline-pipeline";
import {EcrRepositoryFactory} from "../../ecr/ecr-repository-factory";
import {MakeConfig} from "../stage/make-definitions";
import {StageDeployment} from "aws-cdk-lib/pipelines";
import {MakeStage} from "../stage/make-stage";
import {Construct} from "constructs";
import {MakeStepsResources} from "./support/make-steps-resources";
import {EnvConfig} from "../../env/env-base-stack";
import {NamingHelper} from "../../utils/naming-helper";
import {ConfigStackHelper} from "../../utils/config-stack-helper";

export interface MakeCodePipelineStagesProps {
    pipeline: CodePipelinePipeline;
    repositoryFactory?: EcrRepositoryFactory;
    environments: MakeConfig[];
}

export interface MakeCodePipelineStageDeployment {
    deployment: StageDeployment;
    makeStage: MakeStage;
}

export class MakeCodePipelineStages extends NonConstruct {

    readonly props: MakeCodePipelineStagesProps;
    readonly stages: MakeCodePipelineStageDeployment[];

    constructor(scope: Construct, id: string, props: MakeCodePipelineStagesProps) {
        super(scope, id);
        this.props = props;
        this.stages = this.make();
    }

    private make(): MakeCodePipelineStageDeployment[] {
        const stages: MakeCodePipelineStageDeployment[] = [];
        for (const config of this.props.environments) {
            const deploy: boolean = config.Parameters.deploy ?? true;
            if (!deploy) {
                continue;
            }
            const makeStage = this.createStageFromEnvironmentConfig(config, {
                repositoryFactory: this.props.repositoryFactory
            });
            const stage = this.props.pipeline.pipeline.addStage(makeStage);
            this.stepsFromEnvironmentConfig(stage, config);
            stages.push({
                makeStage: makeStage,
                deployment: stage
            });
        }
        return stages;
    }

    private createStageFromEnvironmentConfig(config: MakeConfig, envProps: Record<string, any>): MakeStage {
        const name = this.getStageName(config);
        const env = {
            account: config.AWSAccountId ?? process.env.CDK_DEFAULT_ACCOUNT,
            region: config.AWSRegion ?? process.env.CDK_DEFAULT_REGION
        }
        const stage = new MakeStage(this.scope, name, {
            env: env
        });
        stage.build(config, envProps);
        return stage;
    }

    private getStageName(config: MakeConfig): string {
        return NamingHelper.fromParts([ConfigStackHelper.getMainStackName(config), 'stage']);
    }

    private stepsFromEnvironmentConfig(stage: StageDeployment, config: MakeConfig): void {
        const makeSteps = new MakeStepsResources(stage);
        makeSteps.fromConfig(config);
    }
}