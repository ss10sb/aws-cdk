import {App, Stack} from "aws-cdk-lib";
import {CodePipeline, ShellStep} from "aws-cdk-lib/pipelines";
import {Template} from "aws-cdk-lib/assertions";
import {EcrRepositoryType} from "../../src/ecr/ecr-definitions";
import {CodePipelineCodestarSource} from "../../src/pipeline/code-pipeline-codestar-source";
import {CodePipelineEcrSteps} from "../../src/pipeline/code-pipeline-ecr-steps";
import {EcrRepositories} from "../../src/ecr/ecr-repositories";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {EcrRepositoryFactory} from "../../src/ecr/ecr-repository-factory";
import {ConfigEnvironments} from "../../src/config/config-definitions";
import {ConfigStackHelper} from "../../src/utils/config-stack-helper";

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
        // templateHelper.inspect();
        const expected = require('../__templates__/code-pipeline-ecr-steps');
        templateHelper.template.templateMatches(expected);
    });
});