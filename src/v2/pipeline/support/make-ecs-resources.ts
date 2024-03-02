import {NonConstruct} from "../../../core/non-construct";
import {CoreCodePipelineResources} from "./make-core-resources";
import {Construct} from "constructs";
import {CodePipelineEcrSteps, CodePipelineEcrStepsProps} from "../../../pipeline/code-pipeline-ecr-steps";
import {EcrRepositories} from "../../../ecr/ecr-repositories";
import {CodePipelinePipeline} from "../../../pipeline/code-pipeline-pipeline";
import {Wave} from "aws-cdk-lib/pipelines";

export interface EcsResources {
    ecrSteps: CodePipelineEcrSteps;
}

export class MakeEcsResources extends NonConstruct {
    config: Record<string, any>;

    constructor(scope: Construct, id: string, config: Record<string, any>) {
        super(scope, id);
        this.config = config;
    }

    make(coreResources: CoreCodePipelineResources): EcsResources {
        const ecrSteps = this.createEcrSteps({
            repositories: <EcrRepositories>coreResources.repositoryFactory?.ecrRepositories,
            source: coreResources.source
        });
        this.createEcrWave(coreResources.pipeline, ecrSteps);
        return {
            ecrSteps: ecrSteps
        }
    }

    private createEcrSteps(props: CodePipelineEcrStepsProps): CodePipelineEcrSteps {
        return new CodePipelineEcrSteps(this.scope, this.scope.node.id, props);
    }

    private createEcrWave(pipeline: CodePipelinePipeline, ecrSteps: CodePipelineEcrSteps): Wave {
        return pipeline.pipeline.addWave('ecr-build', {
            post: ecrSteps.steps
        });
    }
}