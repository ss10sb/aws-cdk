import {App, Stack} from "aws-cdk-lib";
import {Template} from "aws-cdk-lib/assertions";
import {CodePipelineSynthStep} from "../../src/pipeline/code-pipeline-synth-step";
import {EcrRepositoryType} from "../../src/ecr/ecr-definitions";
import {CodePipelineCodestarSource} from "../../src/pipeline/code-pipeline-codestar-source";
import {EcrRepositories} from "../../src/ecr/ecr-repositories";
import {CodePipelinePipeline} from "../../src/pipeline/code-pipeline-pipeline";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {EcrRepositoryFactory} from "../../src/ecr/ecr-repository-factory";
import {ConfigEnvironments} from "../../src/config/config-definitions";

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