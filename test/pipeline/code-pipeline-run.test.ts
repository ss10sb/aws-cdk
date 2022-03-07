import {ConfigEnvironments} from "../../src/config";
import {EcrRepositories, EcrRepositoryFactory, EcrRepositoryType} from "../../src/ecr";
import {App, Stack} from "aws-cdk-lib";
import {CodePipelineCodestarSource, CodePipelinePipeline, CodePipelineSynthStep} from "../../src/pipeline";
import {CodePipelineRun} from "../../src/pipeline/code-pipeline-run";
import {TemplateHelper} from "../../src/utils/testing";
import {Template} from "aws-cdk-lib/assertions";

describe('code pipeline run', () => {

    it('should create run schedule', () => {
        const baseBuildConfig = {
            Name: 'test',
            College: 'PCC',
            Environment: ConfigEnvironments.PROD,
            Parameters: {
                repositories: {
                    repositories: [EcrRepositoryType.NGINX, EcrRepositoryType.PHPFPM],
                },
                runPipelineSchedule: 'cron(0 8 ? * 2#1 *)' //first monday of the month
            }
        }
        const app = new App();
        const stackProps = {env: {region: 'us-pipeline', account: '123pipeline'}};
        const stack = new Stack(app, 'stack', stackProps);
        const codeStarSource = new CodePipelineCodestarSource(stack, 'source', {
            connectionArn: "arn:...",
            owner: "repoOwner",
            repo: "repoName"
        });
        const synthStep = new CodePipelineSynthStep(stack, stack.node.id, {
            source: codeStarSource.source
        });
        const repositories = new EcrRepositories(stack.node.id, baseBuildConfig.Parameters.repositories);
        const pipeline = new CodePipelinePipeline(stack, stack.node.id, {
            source: codeStarSource,
            synth: synthStep,
            repositoryFactory: new EcrRepositoryFactory(stack, stack.node.id, repositories)
        });
        new CodePipelineRun(stack, stack.node.id, {
            pipeline: pipeline,
            schedule: baseBuildConfig.Parameters.runPipelineSchedule
        });
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        const expected = require('../__templates__/code-pipeline-run');
        templateHelper.template.templateMatches(expected);
    });
});