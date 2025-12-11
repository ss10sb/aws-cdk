import {NonConstruct} from "../../../core/non-construct";
import {Construct} from "constructs";
import {CodePipelineCodestarSource, CodeStarSourceProps} from "../../../pipeline/code-pipeline-codestar-source";
import {CodePipelinePipeline, CodePipelinePipelineProps} from "../../../pipeline/code-pipeline-pipeline";
import {CodePipelineSynthStep} from "../../../pipeline/code-pipeline-synth-step";
import {EnvBuildType} from "../../../env/env-definitions";
import {EcrRepositories} from "../../../ecr/ecr-repositories";
import {EcrRepositoryFactory} from "../../../ecr/ecr-repository-factory";
import {EnvBuildTypeHelper} from "../../utils/env-build-type-helper";
import {ConfigStackHelper} from "../../../utils/config-stack-helper";
import {MakeSynthStep} from "./make-synth-step";

export interface CoreCodePipelineResources {
    source: CodePipelineCodestarSource;
    pipeline: CodePipelinePipeline;
    synthStep: CodePipelineSynthStep;
    repositoryFactory?: EcrRepositoryFactory;
}

export interface MakeCodePipelineCoreResourcesProps {
    buildType: EnvBuildType;
    ecrRepositories?: EcrRepositories;
}

export class MakeCoreResources extends NonConstruct {

    config: Record<string, any>;
    props: MakeCodePipelineCoreResourcesProps;

    constructor(scope: Construct, id: string, config: Record<string, any>, props: MakeCodePipelineCoreResourcesProps) {
        super(scope, id);
        this.config = config;
        this.props = props;
    }

    make(): CoreCodePipelineResources {
        const ecrRepositoryFactory = this.createEcrRepositoryFactory();
        const source = this.createCodestarSource(<CodeStarSourceProps>this.config.Parameters?.sourceProps);
        const synthStep = this.createSynthStep(source);
        const pipeline = this.createPipeline({
            source: source,
            repositoryFactory: ecrRepositoryFactory,
            synth: synthStep,
            buildStepImage: this.config.Parameters?.buildStepImage,
            phpVersion: this.config.Parameters?.phpVersion
        });
        return {
            source: source,
            pipeline: pipeline,
            synthStep: synthStep,
            repositoryFactory: ecrRepositoryFactory
        }
    }

    private isLambdaBuild(): boolean {
        return EnvBuildTypeHelper.isLambda(this.props.buildType);
    }

    private isEcsBuild(): boolean {
        return EnvBuildTypeHelper.isEcs(this.props.buildType);
    }

    private createCodestarSource(codeStarSourceProps: CodeStarSourceProps): CodePipelineCodestarSource {
        return new CodePipelineCodestarSource(this.scope, this.scope.node.id, codeStarSourceProps);
    }

    private createEcrRepositoryFactory(): EcrRepositoryFactory | undefined {
        if (!this.isEcsBuild()) {
            return;
        }
        if (!this.props.ecrRepositories) {
            this.props.ecrRepositories = new EcrRepositories(ConfigStackHelper.getAppName(this.config), this.config.Parameters?.repositories ?? {repositories: []});
        }
        const factory = new EcrRepositoryFactory(this.scope, this.scope.node.id, this.props.ecrRepositories);
        factory.create();
        return factory;
    }

    protected createPipeline(codePipelineProps: CodePipelinePipelineProps): CodePipelinePipeline {
        return new CodePipelinePipeline(this.scope, this.scope.node.id, codePipelineProps);
    }

    protected createSynthStep(source: CodePipelineCodestarSource): CodePipelineSynthStep {
        const maker = new MakeSynthStep(this.scope, this.scope.node.id);
        return maker.make({
            source: source,
            buildType: this.props.buildType,
            phpVersion: this.config.Parameters?.phpVersion,
            buildStep: this.config.Parameters?.buildStep
        });
    }
}