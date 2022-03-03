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
        templateHelper.expected('AWS::CodePipeline::Pipeline', [
            {
                key: 'stackcodepipelinePipeline',
                properties: Match.objectEquals({
                    Type: 'AWS::CodePipeline::Pipeline',
                    Properties: {
                        RoleArn: {
                            'Fn::GetAtt': [templateHelper.startsWithMatch('stackcodepipelinePipelineRole'), 'Arn']
                        },
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
                                                templateHelper.startsWithMatch('stackcodepipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRole'),
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
                                                Ref: templateHelper.startsWithMatch('stackcodepipelinePipelineBuildstacksynthstepCdkBuildProject')
                                            },
                                            EnvironmentVariables: Match.anyValue()
                                        },
                                        InputArtifacts: [{Name: 'repoOwner_repoName_Source'}],
                                        Name: 'stack-synth-step',
                                        OutputArtifacts: [{Name: 'stack_synth_step_Output'}],
                                        RoleArn: {
                                            'Fn::GetAtt': [
                                                templateHelper.startsWithMatch('stackcodepipelinePipelineBuildstacksynthstepCodePipelineActionRole'),
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
                                                Ref: templateHelper.startsWithMatch('stackcodepipelineUpdatePipelineSelfMutation')
                                            },
                                            EnvironmentVariables: Match.anyValue()
                                        },
                                        InputArtifacts: [{Name: 'stack_synth_step_Output'}],
                                        Name: 'SelfMutate',
                                        RoleArn: {
                                            'Fn::GetAtt': [
                                                templateHelper.startsWithMatch('stackcodepipelinePipelineUpdatePipelineSelfMutateCodePipelineActionRole'),
                                                'Arn'
                                            ]
                                        },
                                        RunOrder: 1
                                    }
                                ],
                                Name: 'UpdatePipeline'
                            },
                            {
                                Actions: [
                                    {
                                        ActionTypeId: {
                                            Category: 'Deploy',
                                            Owner: 'AWS',
                                            Provider: 'CloudFormation',
                                            Version: '1'
                                        },
                                        Configuration: {
                                            StackName: 'pcc-sdlc-myapp-stack',
                                            Capabilities: 'CAPABILITY_NAMED_IAM,CAPABILITY_AUTO_EXPAND',
                                            RoleArn: {
                                                'Fn::Join': [
                                                    '',
                                                    [
                                                        'arn:',
                                                        {Ref: 'AWS::Partition'},
                                                        ':iam::2222:role/cdk-hnb659fds-cfn-exec-role-2222-us-west-2'
                                                    ]
                                                ]
                                            },
                                            TemplateConfiguration: Match.stringLikeRegexp('^stack_synth_step_Output::assembly-stack-pcc-sdlc-myapp/stackpccsdlcmyappstack.*\.template\.json\.config\.json'),
                                            ActionMode: 'CHANGE_SET_REPLACE',
                                            ChangeSetName: 'PipelineChange',
                                            TemplatePath: Match.stringLikeRegexp('^stack_synth_step_Output::assembly-stack-pcc-sdlc-myapp/stackpccsdlcmyappstack.*\.template\.json')
                                        },
                                        InputArtifacts: [{Name: 'stack_synth_step_Output'}],
                                        Name: 'Prepare',
                                        Region: 'us-west-2',
                                        RoleArn: {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    'arn:',
                                                    {Ref: 'AWS::Partition'},
                                                    ':iam::2222:role/cdk-hnb659fds-deploy-role-2222-us-west-2'
                                                ]
                                            ]
                                        },
                                        RunOrder: 1
                                    },
                                    {
                                        ActionTypeId: {
                                            Category: 'Deploy',
                                            Owner: 'AWS',
                                            Provider: 'CloudFormation',
                                            Version: '1'
                                        },
                                        Configuration: {
                                            StackName: 'pcc-sdlc-myapp-stack',
                                            ActionMode: 'CHANGE_SET_EXECUTE',
                                            ChangeSetName: 'PipelineChange'
                                        },
                                        Name: 'Deploy',
                                        Region: 'us-west-2',
                                        RoleArn: {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    'arn:',
                                                    {Ref: 'AWS::Partition'},
                                                    ':iam::2222:role/cdk-hnb659fds-deploy-role-2222-us-west-2'
                                                ]
                                            ]
                                        },
                                        RunOrder: 2
                                    }
                                ],
                                Name: 'pcc-sdlc-myapp'
                            },
                            {
                                Actions: [
                                    {
                                        ActionTypeId: {
                                            Category: 'Deploy',
                                            Owner: 'AWS',
                                            Provider: 'CloudFormation',
                                            Version: '1'
                                        },
                                        Configuration: {
                                            StackName: 'pcc-prod-myapp-stack',
                                            Capabilities: 'CAPABILITY_NAMED_IAM,CAPABILITY_AUTO_EXPAND',
                                            RoleArn: {
                                                'Fn::Join': [
                                                    '',
                                                    [
                                                        'arn:',
                                                        {Ref: 'AWS::Partition'},
                                                        ':iam::3333:role/cdk-hnb659fds-cfn-exec-role-3333-us-west-2'
                                                    ]
                                                ]
                                            },
                                            TemplateConfiguration: Match.stringLikeRegexp('^stack_synth_step_Output::assembly-stack-pcc-prod-myapp/stackpccprodmyappstack.*\.template\.json\.config\.json'),
                                            ActionMode: 'CHANGE_SET_REPLACE',
                                            ChangeSetName: 'PipelineChange',
                                            TemplatePath: Match.stringLikeRegexp('^stack_synth_step_Output::assembly-stack-pcc-prod-myapp/stackpccprodmyappstack.*\.template\.json')
                                        },
                                        InputArtifacts: [{Name: 'stack_synth_step_Output'}],
                                        Name: 'Prepare',
                                        Region: 'us-west-2',
                                        RoleArn: {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    'arn:',
                                                    {Ref: 'AWS::Partition'},
                                                    ':iam::3333:role/cdk-hnb659fds-deploy-role-3333-us-west-2'
                                                ]
                                            ]
                                        },
                                        RunOrder: 1
                                    },
                                    {
                                        ActionTypeId: {
                                            Category: 'Deploy',
                                            Owner: 'AWS',
                                            Provider: 'CloudFormation',
                                            Version: '1'
                                        },
                                        Configuration: {
                                            StackName: 'pcc-prod-myapp-stack',
                                            ActionMode: 'CHANGE_SET_EXECUTE',
                                            ChangeSetName: 'PipelineChange'
                                        },
                                        Name: 'Deploy',
                                        Region: 'us-west-2',
                                        RoleArn: {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    'arn:',
                                                    {Ref: 'AWS::Partition'},
                                                    ':iam::3333:role/cdk-hnb659fds-deploy-role-3333-us-west-2'
                                                ]
                                            ]
                                        },
                                        RunOrder: 2
                                    }
                                ],
                                Name: 'pcc-prod-myapp'
                            }
                        ],
                        ArtifactStores: [
                            {
                                ArtifactStore: {
                                    EncryptionKey: {
                                        Id: {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    'arn:',
                                                    {Ref: 'AWS::Partition'},
                                                    templateHelper.startsWithMatch(':kms:us-west-2:123pipeline:alias/s-west-2tencryptionalias')
                                                ]
                                            ]
                                        },
                                        Type: 'KMS'
                                    },
                                    Location: templateHelper.startsWithMatch('stack-support-us-west-2eplicationbucket'),
                                    Type: 'S3'
                                },
                                Region: 'us-west-2'
                            },
                            {
                                ArtifactStore: {
                                    EncryptionKey: {
                                        Id: {
                                            'Fn::GetAtt': [
                                                templateHelper.startsWithMatch('stackcodepipelinePipelineArtifactsBucketEncryptionKey'),
                                                'Arn'
                                            ]
                                        },
                                        Type: 'KMS'
                                    },
                                    Location: {
                                        Ref: templateHelper.startsWithMatch('stackcodepipelinePipelineArtifactsBucket')
                                    },
                                    Type: 'S3'
                                },
                                Region: 'us-pipeline'
                            }
                        ],
                        Name: 'stack-code-pipeline',
                        RestartExecutionOnUpdate: true
                    },
                    DependsOn: [
                        templateHelper.startsWithMatch('stackcodepipelinePipelineRoleDefaultPolicy'),
                        templateHelper.startsWithMatch('stackcodepipelinePipelineRole')
                    ]
                })
            }
        ]);
    });
});