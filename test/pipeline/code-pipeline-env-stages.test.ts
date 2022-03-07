import {ConfigEnvironments} from "../../src/config";
import {EcrRepositories, EcrRepositoryFactory, EcrRepositoryType} from "../../src/ecr";
import {App, Stack} from "aws-cdk-lib";
import {
    CodePipelineCodestarSource,
    CodePipelineEnvStages,
    CodePipelinePipeline,
    CodePipelineSynthStep
} from "../../src/pipeline";
import {TemplateHelper} from "../../src/utils/testing";
import {Match, Template} from "aws-cdk-lib/assertions";

describe('code pipeline env stages', () => {
    it('should create stages for pipeline', () => {
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
        const ecrRepositories = new EcrRepositories(stack.node.id, baseBuildConfig.Parameters.repositories);
        const factory = new EcrRepositoryFactory(stack, stack.node.id, ecrRepositories);
        factory.create();
        const codePipeline = new CodePipelinePipeline(stack, stack.node.id, {
            source: codeStarSource,
            synth: synthStep,
            repositoryFactory: factory
        });
        new CodePipelineEnvStages(stack, stack.node.id, {
            environments: [
                {
                    AWSAccountId: '2222',
                    AWSRegion: 'us-west-2',
                    Name: 'myapp',
                    College: 'PCC',
                    Environment: ConfigEnvironments.SDLC,
                    Version: "0.0.0",
                    Parameters: {
                        listenerRule: {
                            priority: 100,
                            conditions: {
                                hostHeaders: ['test.dev.example.edu']
                            }
                        },
                        targetGroup: {},
                        services: [],
                        tasks: []
                    }
                },
                {
                    AWSAccountId: '3333',
                    AWSRegion: 'us-west-2',
                    Name: 'myapp',
                    College: 'PCC',
                    Environment: ConfigEnvironments.PROD,
                    Version: "0.0.0",
                    Parameters: {
                        listenerRule: {
                            priority: 100,
                            conditions: {
                                hostHeaders: ['test.example.edu']
                            }
                        },
                        steps: {
                            manualApproval: {}
                        },
                        targetGroup: {},
                        services: [],
                        tasks: []
                    }
                }
            ],
            pipeline: codePipeline,
            repositoryFactory: factory
        });
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        const expected = require('../__templates__/code-pipeline-env-stages');
        templateHelper.template.templateMatches(expected);
    });
});