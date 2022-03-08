import {App, Stack} from "aws-cdk-lib";
import {CodePipelineCodestarSource, CodePipelineEcrSteps} from "../../src/pipeline";
import {CodePipeline, ShellStep} from "aws-cdk-lib/pipelines";
import {ConfigEnvironments} from "../../src/config";
import {EcrRepositories, EcrRepositoryFactory, EcrRepositoryType} from "../../src/ecr";
import {TemplateHelper} from "../../src/utils/testing";
import {Template} from "aws-cdk-lib/assertions";
import {ConfigStackHelper} from "../../src/utils";

describe('code pipeline ecr steps', () => {

    it('should create a step for each repository', () => {
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
        const name = ConfigStackHelper.getMainStackName(baseBuildConfig);
        const stack = new Stack(app, name, stackProps);
        const codeStarSource = new CodePipelineCodestarSource(stack, 'source', {
            connectionArn: "arn:...",
            owner: "repoOwner",
            repo: "repoName"
        });
        const pipeline = new CodePipeline(stack, 'pipeline', {
            synth: new ShellStep('synth', {
                input: codeStarSource.source,
                commands: ['npm']
            })
        });
        const ecrRepositories = new EcrRepositories(stack.node.id, baseBuildConfig.Parameters.repositories);
        const factory = new EcrRepositoryFactory(stack, stack.node.id, ecrRepositories);
        factory.create();
        const ecrSteps = new CodePipelineEcrSteps(stack, stack.node.id, {
            source: codeStarSource,
            repositories: ecrRepositories
        });
        pipeline.addWave('ecr', {
            post: ecrSteps.steps
        });
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        const expected = require('../__templates__/code-pipeline-ecr-steps');
        templateHelper.template.templateMatches(expected);
    });
});