import {App, Stack} from "aws-cdk-lib";
import {CodePipelineCodestarSource} from "../../src/pipeline";
import {CodePipeline, ShellStep} from "aws-cdk-lib/pipelines";
import {TemplateHelper} from "../../src/utils/testing";
import {Match, Template} from "aws-cdk-lib/assertions";

describe('code pipeline codestar source', () => {

    it('should create source', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-pipeline', account: '123pipeline'}};
        const stack = new Stack(app, 'stack', stackProps);
        const codeStarSource = new CodePipelineCodestarSource(stack, 'source', {
            connectionArn: "arn:...",
            owner: "repoOwner",
            repo: "repoName"
        });
        new CodePipeline(stack, 'pipeline', {
            synth: new ShellStep('synth', {
                input: codeStarSource.source,
                commands: ['npm']
            })
        });
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        templateHelper.expected('AWS::CodePipeline::Pipeline',  [
            {
                key: 'pipelinePipeline',
                properties: Match.objectEquals({
                    Type: 'AWS::CodePipeline::Pipeline',
                    Properties: {
                        RoleArn: {'Fn::GetAtt': [templateHelper.startsWithMatch('pipelinePipelineRole'), 'Arn']},
                        Stages: [
                            {
                                Actions: [
                                    {
                                        ActionTypeId: {
                                            Category: 'Source',
                                            Owner: 'AWS',
                                            Provider: 'CodeStarSourceConnection',
                                            Version: '1'
                                        },
                                        Configuration: {
                                            ConnectionArn: 'arn:...',
                                            FullRepositoryId: 'repoOwner/repoName',
                                            BranchName: 'main'
                                        },
                                        Name: 'repoOwner_repoName',
                                        OutputArtifacts: [{Name: 'repoOwner_repoName_Source'}],
                                        RoleArn: {
                                            'Fn::GetAtt': [
                                                templateHelper.startsWithMatch('pipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRole'),
                                                'Arn'
                                            ]
                                        },
                                        RunOrder: 1
                                    }
                                ],
                                Name: 'Source'
                            },
                            {
                                Actions: [
                                    {
                                        ActionTypeId: {
                                            Category: 'Build',
                                            Owner: 'AWS',
                                            Provider: 'CodeBuild',
                                            Version: '1'
                                        },
                                        Configuration: {
                                            ProjectName: {
                                                Ref: templateHelper.startsWithMatch('pipelinePipelineBuildsynthCdkBuildProject')
                                            },
                                            EnvironmentVariables: Match.anyValue()
                                        },
                                        InputArtifacts: [{Name: 'repoOwner_repoName_Source'}],
                                        Name: 'synth',
                                        OutputArtifacts: [{Name: 'synth_Output'}],
                                        RoleArn: {
                                            'Fn::GetAtt': [
                                                templateHelper.startsWithMatch('pipelineCodeBuildActionRole'),
                                                'Arn'
                                            ]
                                        },
                                        RunOrder: 1
                                    }
                                ],
                                Name: 'Build'
                            },
                            {
                                Actions: [
                                    {
                                        ActionTypeId: {
                                            Category: 'Build',
                                            Owner: 'AWS',
                                            Provider: 'CodeBuild',
                                            Version: '1'
                                        },
                                        Configuration: {
                                            ProjectName: {
                                                Ref: templateHelper.startsWithMatch('pipelineUpdatePipelineSelfMutation')
                                            },
                                            EnvironmentVariables: Match.anyValue()
                                        },
                                        InputArtifacts: [{Name: 'synth_Output'}],
                                        Name: 'SelfMutate',
                                        RoleArn: {
                                            'Fn::GetAtt': [
                                                templateHelper.startsWithMatch('pipelineCodeBuildActionRole'),
                                                'Arn'
                                            ]
                                        },
                                        RunOrder: 1
                                    }
                                ],
                                Name: 'UpdatePipeline'
                            }
                        ],
                        ArtifactStore: {
                            Location: {Ref: templateHelper.startsWithMatch('pipelinePipelineArtifactsBucket')},
                            Type: 'S3'
                        },
                        RestartExecutionOnUpdate: true
                    },
                    DependsOn: [
                        templateHelper.startsWithMatch('pipelinePipelineRoleDefaultPolicy'),
                        templateHelper.startsWithMatch('pipelinePipelineRole')
                    ]
                })
            }
        ]);
    });

    it('should create source with branch name', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-pipeline', account: '123pipeline'}};
        const stack = new Stack(app, 'stack', stackProps);
        const codeStarSource = new CodePipelineCodestarSource(stack, 'source', {
            connectionArn: "arn:...",
            owner: "repoOwner",
            repo: "repoName",
            branch: 'foo'
        });
        new CodePipeline(stack, 'pipeline', {
            synth: new ShellStep('synth', {
                input: codeStarSource.source,
                commands: ['npm']
            })
        });
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        templateHelper.expected('AWS::CodePipeline::Pipeline',  [
            {
                key: 'pipelinePipeline',
                properties: Match.objectEquals({
                    Type: 'AWS::CodePipeline::Pipeline',
                    Properties: {
                        RoleArn: {'Fn::GetAtt': [templateHelper.startsWithMatch('pipelinePipelineRole'), 'Arn']},
                        Stages: [
                            {
                                Actions: [
                                    {
                                        ActionTypeId: {
                                            Category: 'Source',
                                            Owner: 'AWS',
                                            Provider: 'CodeStarSourceConnection',
                                            Version: '1'
                                        },
                                        Configuration: {
                                            ConnectionArn: 'arn:...',
                                            FullRepositoryId: 'repoOwner/repoName',
                                            BranchName: 'foo'
                                        },
                                        Name: 'repoOwner_repoName',
                                        OutputArtifacts: [{Name: 'repoOwner_repoName_Source'}],
                                        RoleArn: {
                                            'Fn::GetAtt': [
                                                templateHelper.startsWithMatch('pipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRole'),
                                                'Arn'
                                            ]
                                        },
                                        RunOrder: 1
                                    }
                                ],
                                Name: 'Source'
                            },
                            {
                                Actions: [
                                    {
                                        ActionTypeId: {
                                            Category: 'Build',
                                            Owner: 'AWS',
                                            Provider: 'CodeBuild',
                                            Version: '1'
                                        },
                                        Configuration: {
                                            ProjectName: {
                                                Ref: templateHelper.startsWithMatch('pipelinePipelineBuildsynthCdkBuildProject')
                                            },
                                            EnvironmentVariables: Match.anyValue()
                                        },
                                        InputArtifacts: [{Name: 'repoOwner_repoName_Source'}],
                                        Name: 'synth',
                                        OutputArtifacts: [{Name: 'synth_Output'}],
                                        RoleArn: {
                                            'Fn::GetAtt': [
                                                templateHelper.startsWithMatch('pipelineCodeBuildActionRole'),
                                                'Arn'
                                            ]
                                        },
                                        RunOrder: 1
                                    }
                                ],
                                Name: 'Build'
                            },
                            {
                                Actions: [
                                    {
                                        ActionTypeId: {
                                            Category: 'Build',
                                            Owner: 'AWS',
                                            Provider: 'CodeBuild',
                                            Version: '1'
                                        },
                                        Configuration: {
                                            ProjectName: {
                                                Ref: templateHelper.startsWithMatch('pipelineUpdatePipelineSelfMutation')
                                            },
                                            EnvironmentVariables: Match.anyValue()
                                        },
                                        InputArtifacts: [{Name: 'synth_Output'}],
                                        Name: 'SelfMutate',
                                        RoleArn: {
                                            'Fn::GetAtt': [
                                                templateHelper.startsWithMatch('pipelineCodeBuildActionRole'),
                                                'Arn'
                                            ]
                                        },
                                        RunOrder: 1
                                    }
                                ],
                                Name: 'UpdatePipeline'
                            }
                        ],
                        ArtifactStore: {
                            Location: {Ref: templateHelper.startsWithMatch('pipelinePipelineArtifactsBucket')},
                            Type: 'S3'
                        },
                        RestartExecutionOnUpdate: true
                    },
                    DependsOn: [
                        templateHelper.startsWithMatch('pipelinePipelineRoleDefaultPolicy'),
                        templateHelper.startsWithMatch('pipelinePipelineRole')
                    ]
                })
            }
        ]);
    });
});