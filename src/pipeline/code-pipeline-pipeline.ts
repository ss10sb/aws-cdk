import {NonConstruct} from "../core";
import {CodePipelinePipelineProps} from "./code-pipeline-definitions";
import {CodePipeline, CodePipelineProps, DockerCredential} from "aws-cdk-lib/pipelines";
import {Construct} from "constructs";
import {LinuxBuildImage} from "aws-cdk-lib/aws-codebuild";
import {IRepository} from "aws-cdk-lib/aws-ecr";
import {Pipeline} from "aws-cdk-lib/aws-codepipeline";

export class CodePipelinePipeline extends NonConstruct {

    readonly props: CodePipelinePipelineProps;
    readonly pipeline: CodePipeline;
    readonly defaults: Record<string, any> = {
        crossAccountKeys: true
    }
    built = false;

    constructor(scope: Construct, id: string, props: CodePipelinePipelineProps) {
        super(scope, id);
        this.props = props;
        this.pipeline = this.createCodePipeline();
    }

    buildPipeline(): void {
        if (!this.built) {
            this.pipeline.buildPipeline();
            this.built = true;
        }
    }

    getBuiltPipeline(): Pipeline {
        this.buildPipeline();
        return this.pipeline.pipeline;
    }

    protected createCodePipeline(): CodePipeline {
        const name = this.mixNameWithId('code-pipeline');
        return new CodePipeline(this.scope, name, this.getCodePipelineProps(name));
    }

    protected getCodePipelineProps(name: string): CodePipelineProps {
        const props: Record<string, any> = {
            pipelineName: name,
            synth: this.props.synth.synth,
            crossAccountKeys: this.props.crossAccountKeys ?? this.defaults.crossAccountKeys,
            assetPublishingCodeBuildDefaults: {
                buildEnvironment: {
                    buildImage: LinuxBuildImage.STANDARD_5_0,
                    privileged: true,
                    environmentVariables: {}
                }
            }
        };
        const repos = this.getRepositoryArray();
        if (repos.length) {
            props.dockerCredentials = [DockerCredential.ecr(repos)];
        }
        return <CodePipelineProps>props;
    }

    protected getRepositoryArray(): IRepository[] {
        const repos: IRepository[] = [];
        for (const ecrRepo of this.props.repositoryFactory.getEcrRepositories()) {
            if (ecrRepo.repository) {
                repos.push(ecrRepo.repository);
            }
        }
        return repos;
    }
}