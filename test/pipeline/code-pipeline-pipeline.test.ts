import {App, Stack} from "aws-cdk-lib";
import {CodePipelineCodestarSource, CodePipelinePipeline, CodePipelineSynthStep} from "../../src/pipeline";
import {ConfigEnvironments} from "../../src/config";
import {EcrRepositories, EcrRepositoryFactory, EcrRepositoryType} from "../../src/ecr";
import {TemplateHelper} from "../../src/utils/testing";
import {Template} from "aws-cdk-lib/assertions";

describe('code pipeline pipeline', () => {

    it('should create a code pipeline', () => {
        const baseBuildConfig = {
            Name: 'test',
            College: 'PCC',
            Environment: ConfigEnvironments.PROD,
            Parameters: {
                repositories: {
                    repositories: [EcrRepositoryType.NGINX, EcrRepositoryType.PHPFPM]
                },
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
        new CodePipelinePipeline(stack, stack.node.id, {
            source: codeStarSource,
            synth: synthStep,
            repositoryFactory: new EcrRepositoryFactory(stack, stack.node.id, repositories)
        });
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        const expected = require('../__templates__/code-pipeline-pipeline');
        templateHelper.template.templateMatches(expected);
    });
});