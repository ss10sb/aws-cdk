const {Match} = require("aws-cdk-lib/assertions");
module.exports = {
    Resources: {
        stacksynthsteproleE441D089: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: {Service: 'codebuild.amazonaws.com'}
                        }
                    ],
                    Version: '2012-10-17'
                }
            }
        },
        stacksynthsteproleDefaultPolicy3376ECB6: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: [
                                'logs:CreateLogGroup',
                                'logs:CreateLogStream',
                                'logs:PutLogEvents'
                            ],
                            Effect: 'Allow',
                            Resource: [
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':logs:us-pipeline:123pipeline:log-group:/aws/codebuild/',
                                            {
                                                Ref: 'stackcodepipelinePipelineBuildstacksynthstepCdkBuildProject4A3E0A4E'
                                            }
                                        ]
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':logs:us-pipeline:123pipeline:log-group:/aws/codebuild/',
                                            {
                                                Ref: 'stackcodepipelinePipelineBuildstacksynthstepCdkBuildProject4A3E0A4E'
                                            },
                                            ':*'
                                        ]
                                    ]
                                }
                            ]
                        },
                        {
                            Action: [
                                'codebuild:CreateReportGroup',
                                'codebuild:CreateReport',
                                'codebuild:UpdateReport',
                                'codebuild:BatchPutTestCases',
                                'codebuild:BatchPutCodeCoverages'
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {Ref: 'AWS::Partition'},
                                        ':codebuild:us-pipeline:123pipeline:report-group/',
                                        {
                                            Ref: 'stackcodepipelinePipelineBuildstacksynthstepCdkBuildProject4A3E0A4E'
                                        },
                                        '-*'
                                    ]
                                ]
                            }
                        },
                        {
                            Action: [
                                's3:GetObject*',
                                's3:GetBucket*',
                                's3:List*',
                                's3:DeleteObject*',
                                's3:PutObject',
                                's3:PutObjectLegalHold',
                                's3:PutObjectRetention',
                                's3:PutObjectTagging',
                                's3:PutObjectVersionTagging',
                                's3:Abort*'
                            ],
                            Effect: 'Allow',
                            Resource: [
                                {
                                    'Fn::GetAtt': [
                                        'stackcodepipelinePipelineArtifactsBucket38CD8833',
                                        'Arn'
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [
                                                    'stackcodepipelinePipelineArtifactsBucket38CD8833',
                                                    'Arn'
                                                ]
                                            },
                                            '/*'
                                        ]
                                    ]
                                }
                            ]
                        },
                        {
                            Action: [
                                'kms:Decrypt',
                                'kms:DescribeKey',
                                'kms:Encrypt',
                                'kms:ReEncrypt*',
                                'kms:GenerateDataKey*'
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'stackcodepipelinePipelineArtifactsBucketEncryptionKeyEE92E262',
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: [
                                'kms:Decrypt',
                                'kms:Encrypt',
                                'kms:ReEncrypt*',
                                'kms:GenerateDataKey*'
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'stackcodepipelinePipelineArtifactsBucketEncryptionKeyEE92E262',
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: [
                                'ecr:BatchCheckLayerAvailability',
                                'ecr:GetDownloadUrlForLayer',
                                'ecr:BatchGetImage'
                            ],
                            Effect: 'Allow',
                            Resource: {'Fn::GetAtt': ['nginxecrC430EE7B', 'Arn']}
                        },
                        {
                            Action: 'ecr:GetAuthorizationToken',
                            Effect: 'Allow',
                            Resource: '*'
                        },
                        {
                            Action: [
                                'ecr:BatchCheckLayerAvailability',
                                'ecr:GetDownloadUrlForLayer',
                                'ecr:BatchGetImage'
                            ],
                            Effect: 'Allow',
                            Resource: {'Fn::GetAtt': ['phpfpmecr3C5F411B', 'Arn']}
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'stacksynthsteproleDefaultPolicy3376ECB6',
                Roles: [{Ref: 'stacksynthsteproleE441D089'}]
            }
        },
        nginxecrC430EE7B: {
            Type: 'AWS::ECR::Repository',
            Properties: {
                ImageScanningConfiguration: {ScanOnPush: true},
                LifecyclePolicy: {
                    LifecyclePolicyText: '{"rules":[{"rulePriority":1,"selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":3},"action":{"type":"expire"}}]}'
                },
                RepositoryName: 'stack/nginx'
            },
            UpdateReplacePolicy: 'Retain',
            DeletionPolicy: 'Retain'
        },
        phpfpmecr3C5F411B: {
            Type: 'AWS::ECR::Repository',
            Properties: {
                ImageScanningConfiguration: {ScanOnPush: true},
                LifecyclePolicy: {
                    LifecyclePolicyText: '{"rules":[{"rulePriority":1,"selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":3},"action":{"type":"expire"}}]}'
                },
                RepositoryName: 'stack/phpfpm'
            },
            UpdateReplacePolicy: 'Retain',
            DeletionPolicy: 'Retain'
        },
        stackcodepipelinePipelineArtifactsBucketEncryptionKeyEE92E262: {
            Type: 'AWS::KMS::Key',
            Properties: {
                KeyPolicy: {
                    Statement: [
                        {
                            Action: 'kms:*',
                            Effect: 'Allow',
                            Principal: {
                                AWS: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':iam::123pipeline:root'
                                        ]
                                    ]
                                }
                            },
                            Resource: '*'
                        }
                    ],
                    Version: '2012-10-17'
                }
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        stackcodepipelinePipelineArtifactsBucketEncryptionKeyAlias70A86EFC: {
            Type: 'AWS::KMS::Alias',
            Properties: {
                AliasName: 'alias/codepipeline-stackstackcodepipelinepipelineb00707c5',
                TargetKeyId: {
                    'Fn::GetAtt': [
                        'stackcodepipelinePipelineArtifactsBucketEncryptionKeyEE92E262',
                        'Arn'
                    ]
                }
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        stackcodepipelinePipelineArtifactsBucket38CD8833: {
            Type: 'AWS::S3::Bucket',
            Properties: {
                BucketEncryption: {
                    ServerSideEncryptionConfiguration: [
                        {
                            ServerSideEncryptionByDefault: {
                                KMSMasterKeyID: {
                                    'Fn::GetAtt': [
                                        'stackcodepipelinePipelineArtifactsBucketEncryptionKeyEE92E262',
                                        'Arn'
                                    ]
                                },
                                SSEAlgorithm: 'aws:kms'
                            }
                        }
                    ]
                },
                PublicAccessBlockConfiguration: {
                    BlockPublicAcls: true,
                    BlockPublicPolicy: true,
                    IgnorePublicAcls: true,
                    RestrictPublicBuckets: true
                }
            },
            UpdateReplacePolicy: 'Retain',
            DeletionPolicy: 'Retain'
        },
        stackcodepipelinePipelineArtifactsBucketPolicy7CFA0C8C: {
            Type: 'AWS::S3::BucketPolicy',
            Properties: {
                Bucket: {Ref: 'stackcodepipelinePipelineArtifactsBucket38CD8833'},
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 's3:*',
                            Condition: {Bool: {'aws:SecureTransport': 'false'}},
                            Effect: 'Deny',
                            Principal: {AWS: '*'},
                            Resource: [
                                {
                                    'Fn::GetAtt': [
                                        'stackcodepipelinePipelineArtifactsBucket38CD8833',
                                        'Arn'
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [
                                                    'stackcodepipelinePipelineArtifactsBucket38CD8833',
                                                    'Arn'
                                                ]
                                            },
                                            '/*'
                                        ]
                                    ]
                                }
                            ]
                        }
                    ],
                    Version: '2012-10-17'
                }
            }
        },
        stackcodepipelinePipelineRoleABF819A4: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: {Service: 'codepipeline.amazonaws.com'}
                        }
                    ],
                    Version: '2012-10-17'
                }
            }
        },
        stackcodepipelinePipelineRoleDefaultPolicy71C0C6F5: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: [
                                's3:GetObject*',
                                's3:GetBucket*',
                                's3:List*',
                                's3:DeleteObject*',
                                's3:PutObject',
                                's3:PutObjectLegalHold',
                                's3:PutObjectRetention',
                                's3:PutObjectTagging',
                                's3:PutObjectVersionTagging',
                                's3:Abort*'
                            ],
                            Effect: 'Allow',
                            Resource: [
                                {
                                    'Fn::GetAtt': [
                                        'stackcodepipelinePipelineArtifactsBucket38CD8833',
                                        'Arn'
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [
                                                    'stackcodepipelinePipelineArtifactsBucket38CD8833',
                                                    'Arn'
                                                ]
                                            },
                                            '/*'
                                        ]
                                    ]
                                }
                            ]
                        },
                        {
                            Action: [
                                'kms:Decrypt',
                                'kms:DescribeKey',
                                'kms:Encrypt',
                                'kms:ReEncrypt*',
                                'kms:GenerateDataKey*'
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'stackcodepipelinePipelineArtifactsBucketEncryptionKeyEE92E262',
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'stackcodepipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRoleF6B61542',
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'stackcodepipelineCodeBuildActionRole59833F96',
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: [
                                's3:GetObject*',
                                's3:GetBucket*',
                                's3:List*',
                                's3:DeleteObject*',
                                's3:PutObject',
                                's3:PutObjectLegalHold',
                                's3:PutObjectRetention',
                                's3:PutObjectTagging',
                                's3:PutObjectVersionTagging',
                                's3:Abort*'
                            ],
                            Effect: 'Allow',
                            Resource: [
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':s3:::stack-support-us-west-2eplicationbucketaa28122cdebd900ecf2a'
                                        ]
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':s3:::stack-support-us-west-2eplicationbucketaa28122cdebd900ecf2a/*'
                                        ]
                                    ]
                                }
                            ]
                        },
                        {
                            Action: [
                                'kms:Decrypt',
                                'kms:DescribeKey',
                                'kms:Encrypt',
                                'kms:ReEncrypt*',
                                'kms:GenerateDataKey*'
                            ],
                            Effect: 'Allow',
                            Resource: '*'
                        },
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {Ref: 'AWS::Partition'},
                                        ':iam::2222:role/cdk-hnb659fds-deploy-role-2222-us-west-2'
                                    ]
                                ]
                            }
                        },
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'stackcodepipelinePipelinepccprodmyappstagemanualApprovalstepCodePipelineActionRoleE9F6D5A2',
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {Ref: 'AWS::Partition'},
                                        ':iam::3333:role/cdk-hnb659fds-deploy-role-3333-us-west-2'
                                    ]
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'stackcodepipelinePipelineRoleDefaultPolicy71C0C6F5',
                Roles: [{Ref: 'stackcodepipelinePipelineRoleABF819A4'}]
            }
        },
        stackcodepipelinePipelineEA58A55A: {
            Type: 'AWS::CodePipeline::Pipeline',
            Properties: {
                RoleArn: {
                    'Fn::GetAtt': ['stackcodepipelinePipelineRoleABF819A4', 'Arn']
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
                                    BranchName: 'main',
                                    DetectChanges: true
                                },
                                Name: 'repoOwner_repoName',
                                OutputArtifacts: [{Name: 'repoOwner_repoName_Source'}],
                                RoleArn: {
                                    'Fn::GetAtt': [
                                        'stackcodepipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRoleF6B61542',
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
                                        Ref: 'stackcodepipelinePipelineBuildstacksynthstepCdkBuildProject4A3E0A4E'
                                    },
                                    EnvironmentVariables: Match.stringLikeRegexp('\[\{"name":"_PROJECT_CONFIG_HASH","type":"PLAINTEXT","value":"[^"]*"\}\]')
                                },
                                InputArtifacts: [{Name: 'repoOwner_repoName_Source'}],
                                Name: 'stack-synth-step',
                                OutputArtifacts: [{Name: 'stack_synth_step_Output'}],
                                RoleArn: {
                                    'Fn::GetAtt': [
                                        'stackcodepipelineCodeBuildActionRole59833F96',
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
                                        Ref: 'stackcodepipelineUpdatePipelineSelfMutation739BDEE5'
                                    },
                                    EnvironmentVariables: Match.stringLikeRegexp('\[\{"name":"_PROJECT_CONFIG_HASH","type":"PLAINTEXT","value":"[^"]*"\}\]')
                                },
                                InputArtifacts: [{Name: 'stack_synth_step_Output'}],
                                Name: 'SelfMutate',
                                RoleArn: {
                                    'Fn::GetAtt': [
                                        'stackcodepipelineCodeBuildActionRole59833F96',
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
                                    StackName: 'pcc-sdlc-myapp',
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
                                    TemplateConfiguration: 'stack_synth_step_Output::assembly-stack-pcc-sdlc-myapp-stage/stackpccsdlcmyappstagepccsdlcmyappFE329F20.template.json.config.json',
                                    ActionMode: 'CHANGE_SET_REPLACE',
                                    ChangeSetName: 'PipelineChange',
                                    TemplatePath: 'stack_synth_step_Output::assembly-stack-pcc-sdlc-myapp-stage/stackpccsdlcmyappstagepccsdlcmyappFE329F20.template.json'
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
                                    StackName: 'pcc-sdlc-myapp',
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
                        Name: 'pcc-sdlc-myapp-stage'
                    },
                    {
                        Actions: [
                            {
                                ActionTypeId: {
                                    Category: 'Approval',
                                    Owner: 'AWS',
                                    Provider: 'Manual',
                                    Version: '1'
                                },
                                Name: 'manualApproval-step',
                                RoleArn: {
                                    'Fn::GetAtt': [
                                        'stackcodepipelinePipelinepccprodmyappstagemanualApprovalstepCodePipelineActionRoleE9F6D5A2',
                                        'Arn'
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
                                    StackName: 'pcc-prod-myapp',
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
                                    TemplateConfiguration: 'stack_synth_step_Output::assembly-stack-pcc-prod-myapp-stage/stackpccprodmyappstagepccprodmyapp83D0E40C.template.json.config.json',
                                    ActionMode: 'CHANGE_SET_REPLACE',
                                    ChangeSetName: 'PipelineChange',
                                    TemplatePath: 'stack_synth_step_Output::assembly-stack-pcc-prod-myapp-stage/stackpccprodmyappstagepccprodmyapp83D0E40C.template.json'
                                },
                                InputArtifacts: [{Name: 'stack_synth_step_Output'}],
                                Name: 'pcc-prod-myapp.Prepare',
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
                            },
                            {
                                ActionTypeId: {
                                    Category: 'Deploy',
                                    Owner: 'AWS',
                                    Provider: 'CloudFormation',
                                    Version: '1'
                                },
                                Configuration: {
                                    StackName: 'pcc-prod-myapp',
                                    ActionMode: 'CHANGE_SET_EXECUTE',
                                    ChangeSetName: 'PipelineChange'
                                },
                                Name: 'pcc-prod-myapp.Deploy',
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
                                RunOrder: 3
                            }
                        ],
                        Name: 'pcc-prod-myapp-stage'
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
                                            ':kms:us-west-2:123pipeline:alias/s-west-2tencryptionaliasf83493dbd32c8c9316d6'
                                        ]
                                    ]
                                },
                                Type: 'KMS'
                            },
                            Location: 'stack-support-us-west-2eplicationbucketaa28122cdebd900ecf2a',
                            Type: 'S3'
                        },
                        Region: 'us-west-2'
                    },
                    {
                        ArtifactStore: {
                            EncryptionKey: {
                                Id: {
                                    'Fn::GetAtt': [
                                        'stackcodepipelinePipelineArtifactsBucketEncryptionKeyEE92E262',
                                        'Arn'
                                    ]
                                },
                                Type: 'KMS'
                            },
                            Location: {
                                Ref: 'stackcodepipelinePipelineArtifactsBucket38CD8833'
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
                'stackcodepipelinePipelineRoleDefaultPolicy71C0C6F5',
                'stackcodepipelinePipelineRoleABF819A4'
            ]
        },
        stackcodepipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRoleF6B61542: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: {
                                AWS: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':iam::123pipeline:root'
                                        ]
                                    ]
                                }
                            }
                        }
                    ],
                    Version: '2012-10-17'
                }
            }
        },
        stackcodepipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRoleDefaultPolicy9FFA0505: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 'codestar-connections:UseConnection',
                            Effect: 'Allow',
                            Resource: 'arn:...'
                        },
                        {
                            Action: [
                                's3:GetObject*',
                                's3:GetBucket*',
                                's3:List*',
                                's3:DeleteObject*',
                                's3:PutObject',
                                's3:PutObjectLegalHold',
                                's3:PutObjectRetention',
                                's3:PutObjectTagging',
                                's3:PutObjectVersionTagging',
                                's3:Abort*'
                            ],
                            Effect: 'Allow',
                            Resource: [
                                {
                                    'Fn::GetAtt': [
                                        'stackcodepipelinePipelineArtifactsBucket38CD8833',
                                        'Arn'
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [
                                                    'stackcodepipelinePipelineArtifactsBucket38CD8833',
                                                    'Arn'
                                                ]
                                            },
                                            '/*'
                                        ]
                                    ]
                                }
                            ]
                        },
                        {
                            Action: [
                                'kms:Decrypt',
                                'kms:DescribeKey',
                                'kms:Encrypt',
                                'kms:ReEncrypt*',
                                'kms:GenerateDataKey*'
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'stackcodepipelinePipelineArtifactsBucketEncryptionKeyEE92E262',
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: ['s3:PutObjectAcl', 's3:PutObjectVersionAcl'],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        {
                                            'Fn::GetAtt': [
                                                'stackcodepipelinePipelineArtifactsBucket38CD8833',
                                                'Arn'
                                            ]
                                        },
                                        '/*'
                                    ]
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'stackcodepipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRoleDefaultPolicy9FFA0505',
                Roles: [
                    {
                        Ref: 'stackcodepipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRoleF6B61542'
                    }
                ]
            }
        },
        stackcodepipelinePipelineBuildstacksynthstepCdkBuildProject4A3E0A4E: {
            Type: 'AWS::CodeBuild::Project',
            Properties: {
                Artifacts: {Type: 'CODEPIPELINE'},
                Environment: {
                    ComputeType: 'BUILD_GENERAL1_SMALL',
                    Image: 'aws/codebuild/standard:6.0',
                    ImagePullCredentialsType: 'CODEBUILD',
                    PrivilegedMode: false,
                    Type: 'LINUX_CONTAINER'
                },
                ServiceRole: {'Fn::GetAtt': ['stacksynthsteproleE441D089', 'Arn']},
                Source: {
                    BuildSpec: {
                        'Fn::Join': [
                            '',
                            [
                                '{\n' +
                                '  "version": "0.2",\n' +
                                '  "phases": {\n' +
                                '    "pre_build": {\n' +
                                '      "commands": [\n' +
                                '        "mkdir $HOME/.cdk",\n' +
                                `        "echo '{\\"version\\":\\"1.0\\",\\"domainCredentials\\":{\\"`,
                                {
                                    'Fn::Select': [
                                        0,
                                        {
                                            'Fn::Split': [
                                                '/',
                                                {
                                                    'Fn::Join': [
                                                        '',
                                                        [
                                                            {
                                                                'Fn::Select': [
                                                                    4,
                                                                    {
                                                                        'Fn::Split': [
                                                                            ':',
                                                                            {
                                                                                'Fn::GetAtt': ['nginxecrC430EE7B', 'Arn']
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            },
                                                            '.dkr.ecr.',
                                                            {
                                                                'Fn::Select': [
                                                                    3,
                                                                    {
                                                                        'Fn::Split': [
                                                                            ':',
                                                                            {
                                                                                'Fn::GetAtt': ['nginxecrC430EE7B', 'Arn']
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            },
                                                            '.',
                                                            {Ref: 'AWS::URLSuffix'},
                                                            '/',
                                                            {Ref: 'nginxecrC430EE7B'}
                                                        ]
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                `\\":{\\"ecrRepository\\":true}}}' > $HOME/.cdk/cdk-docker-creds.json"\n` +
                                '      ]\n' +
                                '    },\n' +
                                '    "build": {\n' +
                                '      "commands": [\n' +
                                '        "cp config/_common.js.copy config/_common.js && cp config/defaults.js.copy config/defaults.js",\n' +
                                '        "npm ci",\n' +
                                '        "npm run build",\n' +
                                '        "npx cdk synth"\n' +
                                '      ]\n' +
                                '    }\n' +
                                '  },\n' +
                                '  "artifacts": {\n' +
                                '    "base-directory": "cdk.out",\n' +
                                '    "files": [\n' +
                                '      "**/*"\n' +
                                '    ]\n' +
                                '  }\n' +
                                '}'
                            ]
                        ]
                    },
                    Type: 'CODEPIPELINE'
                },
                Cache: {Type: 'NO_CACHE'},
                Description: 'Pipeline step stack/Pipeline/Build/stack-synth-step',
                EncryptionKey: {
                    'Fn::GetAtt': [
                        'stackcodepipelinePipelineArtifactsBucketEncryptionKeyEE92E262',
                        'Arn'
                    ]
                }
            }
        },
        stackcodepipelinePipelinepccprodmyappstagemanualApprovalstepCodePipelineActionRoleE9F6D5A2: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: {
                                AWS: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':iam::123pipeline:root'
                                        ]
                                    ]
                                }
                            }
                        }
                    ],
                    Version: '2012-10-17'
                }
            }
        },
        stackcodepipelineCodeBuildActionRole59833F96: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: {
                                AWS: {
                                    'Fn::GetAtt': [
                                        'stackcodepipelinePipelineRoleABF819A4',
                                        'Arn'
                                    ]
                                }
                            }
                        }
                    ],
                    Version: '2012-10-17'
                }
            }
        },
        stackcodepipelineCodeBuildActionRoleDefaultPolicy79374964: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: [
                                'codebuild:BatchGetBuilds',
                                'codebuild:StartBuild',
                                'codebuild:StopBuild'
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'stackcodepipelinePipelineBuildstacksynthstepCdkBuildProject4A3E0A4E',
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: [
                                'codebuild:BatchGetBuilds',
                                'codebuild:StartBuild',
                                'codebuild:StopBuild'
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'stackcodepipelineUpdatePipelineSelfMutation739BDEE5',
                                    'Arn'
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'stackcodepipelineCodeBuildActionRoleDefaultPolicy79374964',
                Roles: [{Ref: 'stackcodepipelineCodeBuildActionRole59833F96'}]
            }
        },
        stackcodepipelineUpdatePipelineSelfMutationRoleA17E13D7: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: {Service: 'codebuild.amazonaws.com'}
                        }
                    ],
                    Version: '2012-10-17'
                }
            }
        },
        stackcodepipelineUpdatePipelineSelfMutationRoleDefaultPolicyAAFEF469: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: [
                                'logs:CreateLogGroup',
                                'logs:CreateLogStream',
                                'logs:PutLogEvents'
                            ],
                            Effect: 'Allow',
                            Resource: [
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':logs:us-pipeline:123pipeline:log-group:/aws/codebuild/',
                                            {
                                                Ref: 'stackcodepipelineUpdatePipelineSelfMutation739BDEE5'
                                            }
                                        ]
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':logs:us-pipeline:123pipeline:log-group:/aws/codebuild/',
                                            {
                                                Ref: 'stackcodepipelineUpdatePipelineSelfMutation739BDEE5'
                                            },
                                            ':*'
                                        ]
                                    ]
                                }
                            ]
                        },
                        {
                            Action: [
                                'codebuild:CreateReportGroup',
                                'codebuild:CreateReport',
                                'codebuild:UpdateReport',
                                'codebuild:BatchPutTestCases',
                                'codebuild:BatchPutCodeCoverages'
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {Ref: 'AWS::Partition'},
                                        ':codebuild:us-pipeline:123pipeline:report-group/',
                                        {
                                            Ref: 'stackcodepipelineUpdatePipelineSelfMutation739BDEE5'
                                        },
                                        '-*'
                                    ]
                                ]
                            }
                        },
                        {
                            Action: 'sts:AssumeRole',
                            Condition: {
                                'ForAnyValue:StringEquals': {
                                    'iam:ResourceTag/aws-cdk:bootstrap-role': ['image-publishing', 'file-publishing', 'deploy']
                                }
                            },
                            Effect: 'Allow',
                            Resource: 'arn:*:iam::123pipeline:role/*'
                        },
                        {
                            Action: 'cloudformation:DescribeStacks',
                            Effect: 'Allow',
                            Resource: '*'
                        },
                        {
                            Action: 's3:ListBucket',
                            Effect: 'Allow',
                            Resource: '*'
                        },
                        {
                            Action: ['s3:GetObject*', 's3:GetBucket*', 's3:List*'],
                            Effect: 'Allow',
                            Resource: [
                                {
                                    'Fn::GetAtt': [
                                        'stackcodepipelinePipelineArtifactsBucket38CD8833',
                                        'Arn'
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [
                                                    'stackcodepipelinePipelineArtifactsBucket38CD8833',
                                                    'Arn'
                                                ]
                                            },
                                            '/*'
                                        ]
                                    ]
                                }
                            ]
                        },
                        {
                            Action: ['kms:Decrypt', 'kms:DescribeKey'],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'stackcodepipelinePipelineArtifactsBucketEncryptionKeyEE92E262',
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: [
                                'kms:Decrypt',
                                'kms:Encrypt',
                                'kms:ReEncrypt*',
                                'kms:GenerateDataKey*'
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'stackcodepipelinePipelineArtifactsBucketEncryptionKeyEE92E262',
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: [
                                'ecr:BatchCheckLayerAvailability',
                                'ecr:GetDownloadUrlForLayer',
                                'ecr:BatchGetImage'
                            ],
                            Effect: 'Allow',
                            Resource: {'Fn::GetAtt': ['nginxecrC430EE7B', 'Arn']}
                        },
                        {
                            Action: 'ecr:GetAuthorizationToken',
                            Effect: 'Allow',
                            Resource: '*'
                        },
                        {
                            Action: [
                                'ecr:BatchCheckLayerAvailability',
                                'ecr:GetDownloadUrlForLayer',
                                'ecr:BatchGetImage'
                            ],
                            Effect: 'Allow',
                            Resource: {'Fn::GetAtt': ['phpfpmecr3C5F411B', 'Arn']}
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'stackcodepipelineUpdatePipelineSelfMutationRoleDefaultPolicyAAFEF469',
                Roles: [
                    {
                        Ref: 'stackcodepipelineUpdatePipelineSelfMutationRoleA17E13D7'
                    }
                ]
            }
        },
        stackcodepipelineUpdatePipelineSelfMutation739BDEE5: {
            Type: 'AWS::CodeBuild::Project',
            Properties: {
                Artifacts: {Type: 'CODEPIPELINE'},
                Environment: {
                    ComputeType: 'BUILD_GENERAL1_SMALL',
                    Image: 'aws/codebuild/standard:7.0',
                    ImagePullCredentialsType: 'CODEBUILD',
                    PrivilegedMode: false,
                    Type: 'LINUX_CONTAINER'
                },
                ServiceRole: {
                    'Fn::GetAtt': [
                        'stackcodepipelineUpdatePipelineSelfMutationRoleA17E13D7',
                        'Arn'
                    ]
                },
                Source: {
                    BuildSpec: {
                        'Fn::Join': [
                            '',
                            [
                                '{\n' +
                                '  "version": "0.2",\n' +
                                '  "phases": {\n' +
                                '    "pre_build": {\n' +
                                '      "commands": [\n' +
                                '        "mkdir $HOME/.cdk",\n' +
                                `        "echo '{\\"version\\":\\"1.0\\",\\"domainCredentials\\":{\\"`,
                                {
                                    'Fn::Select': [
                                        0,
                                        {
                                            'Fn::Split': [
                                                '/',
                                                {
                                                    'Fn::Join': [
                                                        '',
                                                        [
                                                            {
                                                                'Fn::Select': [
                                                                    4,
                                                                    {
                                                                        'Fn::Split': [
                                                                            ':',
                                                                            {
                                                                                'Fn::GetAtt': ['nginxecrC430EE7B', 'Arn']
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            },
                                                            '.dkr.ecr.',
                                                            {
                                                                'Fn::Select': [
                                                                    3,
                                                                    {
                                                                        'Fn::Split': [
                                                                            ':',
                                                                            {
                                                                                'Fn::GetAtt': ['nginxecrC430EE7B', 'Arn']
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            },
                                                            '.',
                                                            {Ref: 'AWS::URLSuffix'},
                                                            '/',
                                                            {Ref: 'nginxecrC430EE7B'}
                                                        ]
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                `\\":{\\"ecrRepository\\":true}}}' > $HOME/.cdk/cdk-docker-creds.json"\n` +
                                '      ]\n' +
                                '    },\n' +
                                '    "install": {\n' +
                                '      "commands": [\n' +
                                '        "npm install -g aws-cdk@2"\n' +
                                '      ]\n' +
                                '    },\n' +
                                '    "build": {\n' +
                                '      "commands": [\n' +
                                '        "cdk -a . deploy stack --require-approval=never --verbose"\n' +
                                '      ]\n' +
                                '    }\n' +
                                '  }\n' +
                                '}'
                            ]
                        ]
                    },
                    Type: 'CODEPIPELINE'
                },
                Cache: {Type: 'NO_CACHE'},
                Description: 'Pipeline step stack/Pipeline/UpdatePipeline/SelfMutate',
                EncryptionKey: {
                    'Fn::GetAtt': [
                        'stackcodepipelinePipelineArtifactsBucketEncryptionKeyEE92E262',
                        'Arn'
                    ]
                },
                Name: 'stack-code-pipeline-selfupdate'
            }
        }
    }
}