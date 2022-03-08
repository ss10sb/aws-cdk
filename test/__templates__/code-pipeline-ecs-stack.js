const {Match} = require("aws-cdk-lib/assertions");
module.exports = {
    Resources: {
        pccsharedtestsynthsteprole88CEA341: {
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
                },
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            }
        },
        pccsharedtestsynthsteproleDefaultPolicyCA85F73E: {
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
                                            ':logs:us-west-2:12344:log-group:/aws/codebuild/',
                                            {
                                                Ref: 'pccsharedtestcodepipelinePipelineBuildpccsharedtestsynthstepCdkBuildProjectC0F0B7F3'
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
                                            ':logs:us-west-2:12344:log-group:/aws/codebuild/',
                                            {
                                                Ref: 'pccsharedtestcodepipelinePipelineBuildpccsharedtestsynthstepCdkBuildProjectC0F0B7F3'
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
                                        ':codebuild:us-west-2:12344:report-group/',
                                        {
                                            Ref: 'pccsharedtestcodepipelinePipelineBuildpccsharedtestsynthstepCdkBuildProjectC0F0B7F3'
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
                                        'pccsharedtestcodepipelinePipelineArtifactsBucket1DB2956C',
                                        'Arn'
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [
                                                    'pccsharedtestcodepipelinePipelineArtifactsBucket1DB2956C',
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
                                    'pccsharedtestcodepipelinePipelineArtifactsBucketEncryptionKey3CA0A728',
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
                                    'pccsharedtestcodepipelinePipelineArtifactsBucketEncryptionKey3CA0A728',
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: [
                                'ssm:DescribeParameters',
                                'ssm:GetParameters',
                                'ssm:GetParameter',
                                'ssm:GetParameterHistory'
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {Ref: 'AWS::Partition'},
                                        ':ssm:us-west-2:12344:parameter/pcc-shared-test/config'
                                    ]
                                ]
                            }
                        },
                        {
                            Action: 'ecr:DescribeImages',
                            Effect: 'Allow',
                            Resource: {'Fn::GetAtt': ['nginxecrC430EE7B', 'Arn']}
                        },
                        {
                            Action: 'ecr:DescribeImages',
                            Effect: 'Allow',
                            Resource: {'Fn::GetAtt': ['phpfpmecr3C5F411B', 'Arn']}
                        },
                        {
                            Action: 'sts:AssumeRole',
                            Condition: {
                                StringEquals: {
                                    'iam:ResourceTag/aws-cdk:bootstrap-role': 'lookup'
                                }
                            },
                            Effect: 'Allow',
                            Resource: '*'
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsharedtestsynthsteproleDefaultPolicyCA85F73E',
                Roles: [{Ref: 'pccsharedtestsynthsteprole88CEA341'}]
            }
        },
        pccsharedtestcodepipelinePipelineArtifactsBucketEncryptionKey3CA0A728: {
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
                                            ':iam::12344:root'
                                        ]
                                    ]
                                }
                            },
                            Resource: '*'
                        },
                        {
                            Action: ['kms:Decrypt', 'kms:DescribeKey'],
                            Effect: 'Allow',
                            Principal: {
                                AWS: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':iam::11111:role/cdk-hnb659fds-deploy-role-11111-us-west-2'
                                        ]
                                    ]
                                }
                            },
                            Resource: '*'
                        },
                        {
                            Action: ['kms:Decrypt', 'kms:DescribeKey'],
                            Effect: 'Allow',
                            Principal: {
                                AWS: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':iam::22222:role/cdk-hnb659fds-deploy-role-22222-us-west-2'
                                        ]
                                    ]
                                }
                            },
                            Resource: '*'
                        }
                    ],
                    Version: '2012-10-17'
                },
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsharedtestcodepipelinePipelineArtifactsBucketEncryptionKeyAlias4E4BE546: {
            Type: 'AWS::KMS::Alias',
            Properties: {
                AliasName: 'alias/codepipeline-pccsharedtestpccsharedtestcodepipelinepipelinefb3d5606',
                TargetKeyId: {
                    'Fn::GetAtt': [
                        'pccsharedtestcodepipelinePipelineArtifactsBucketEncryptionKey3CA0A728',
                        'Arn'
                    ]
                }
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsharedtestcodepipelinePipelineArtifactsBucket1DB2956C: {
            Type: 'AWS::S3::Bucket',
            Properties: {
                BucketEncryption: {
                    ServerSideEncryptionConfiguration: [
                        {
                            ServerSideEncryptionByDefault: {
                                KMSMasterKeyID: {
                                    'Fn::GetAtt': [
                                        'pccsharedtestcodepipelinePipelineArtifactsBucketEncryptionKey3CA0A728',
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
                },
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            },
            UpdateReplacePolicy: 'Retain',
            DeletionPolicy: 'Retain'
        },
        pccsharedtestcodepipelinePipelineArtifactsBucketPolicy4D6EA8A8: {
            Type: 'AWS::S3::BucketPolicy',
            Properties: {
                Bucket: {
                    Ref: 'pccsharedtestcodepipelinePipelineArtifactsBucket1DB2956C'
                },
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
                                        'pccsharedtestcodepipelinePipelineArtifactsBucket1DB2956C',
                                        'Arn'
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [
                                                    'pccsharedtestcodepipelinePipelineArtifactsBucket1DB2956C',
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
                            Action: ['s3:GetObject*', 's3:GetBucket*', 's3:List*'],
                            Effect: 'Allow',
                            Principal: {
                                AWS: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':iam::11111:role/cdk-hnb659fds-deploy-role-11111-us-west-2'
                                        ]
                                    ]
                                }
                            },
                            Resource: [
                                {
                                    'Fn::GetAtt': [
                                        'pccsharedtestcodepipelinePipelineArtifactsBucket1DB2956C',
                                        'Arn'
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [
                                                    'pccsharedtestcodepipelinePipelineArtifactsBucket1DB2956C',
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
                            Action: ['s3:GetObject*', 's3:GetBucket*', 's3:List*'],
                            Effect: 'Allow',
                            Principal: {
                                AWS: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':iam::22222:role/cdk-hnb659fds-deploy-role-22222-us-west-2'
                                        ]
                                    ]
                                }
                            },
                            Resource: [
                                {
                                    'Fn::GetAtt': [
                                        'pccsharedtestcodepipelinePipelineArtifactsBucket1DB2956C',
                                        'Arn'
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [
                                                    'pccsharedtestcodepipelinePipelineArtifactsBucket1DB2956C',
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
        pccsharedtestcodepipelinePipelineRole7DA95E27: {
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
                },
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            }
        },
        pccsharedtestcodepipelinePipelineRoleDefaultPolicy44AD6A4A: {
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
                                        'pccsharedtestcodepipelinePipelineArtifactsBucket1DB2956C',
                                        'Arn'
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [
                                                    'pccsharedtestcodepipelinePipelineArtifactsBucket1DB2956C',
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
                                    'pccsharedtestcodepipelinePipelineArtifactsBucketEncryptionKey3CA0A728',
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'pccsharedtestcodepipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRole8F4DC317',
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'pccsharedtestcodepipelinePipelineBuildpccsharedtestsynthstepCodePipelineActionRoleD6C9AD9C',
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'pccsharedtestcodepipelinePipelineUpdatePipelineSelfMutateCodePipelineActionRole43E65CE8',
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'pccsharedtestcodepipelinePipelineAssetsFileAsset1CodePipelineActionRoleBD598FC4',
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'pccsharedtestcodepipelinePipelineAssetsFileAsset2CodePipelineActionRoleA42AF81D',
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'pccsharedtestcodepipelinePipelineAssetsFileAsset3CodePipelineActionRole1715D82C',
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
                                        ':iam::11111:role/cdk-hnb659fds-deploy-role-11111-us-west-2'
                                    ]
                                ]
                            }
                        },
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'pccsharedtestcodepipelinePipelinepccprodtestmanualApprovalstepCodePipelineActionRoleE6079BF9',
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
                                        ':iam::22222:role/cdk-hnb659fds-deploy-role-22222-us-west-2'
                                    ]
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsharedtestcodepipelinePipelineRoleDefaultPolicy44AD6A4A',
                Roles: [{Ref: 'pccsharedtestcodepipelinePipelineRole7DA95E27'}]
            }
        },
        pccsharedtestcodepipelinePipeline63991321: {
            Type: 'AWS::CodePipeline::Pipeline',
            Properties: {
                RoleArn: {
                    'Fn::GetAtt': ['pccsharedtestcodepipelinePipelineRole7DA95E27', 'Arn']
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
                                    ConnectionArn: 'arn:aws:codestar-connections:us-west-2:accountId:connection/randomUUID',
                                    FullRepositoryId: 'repoOwner/repoName',
                                    BranchName: 'main'
                                },
                                Name: 'repoOwner_repoName',
                                OutputArtifacts: [{Name: 'repoOwner_repoName_Source'}],
                                RoleArn: {
                                    'Fn::GetAtt': [
                                        'pccsharedtestcodepipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRole8F4DC317',
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
                                        Ref: 'pccsharedtestcodepipelinePipelineBuildpccsharedtestsynthstepCdkBuildProjectC0F0B7F3'
                                    },
                                    EnvironmentVariables: '[{"name":"_PROJECT_CONFIG_HASH","type":"PLAINTEXT","value":"3b6a035bb04bf76cf2c0f21ec4bf82e37ec46d46f87dd4f6ae4957c2a9e2f549"}]'
                                },
                                InputArtifacts: [{Name: 'repoOwner_repoName_Source'}],
                                Name: 'pcc-shared-test-synth-step',
                                OutputArtifacts: [{Name: 'pcc_shared_test_synth_step_Output'}],
                                RoleArn: {
                                    'Fn::GetAtt': [
                                        'pccsharedtestcodepipelinePipelineBuildpccsharedtestsynthstepCodePipelineActionRoleD6C9AD9C',
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
                                        Ref: 'pccsharedtestcodepipelineUpdatePipelineSelfMutation7DDFA823'
                                    },
                                    EnvironmentVariables: '[{"name":"_PROJECT_CONFIG_HASH","type":"PLAINTEXT","value":"e1765eb88567e2a43e3b39a74a030917b784e3a19c1ec4bd66be7bc3884f9f34"}]'
                                },
                                InputArtifacts: [{Name: 'pcc_shared_test_synth_step_Output'}],
                                Name: 'SelfMutate',
                                RoleArn: {
                                    'Fn::GetAtt': [
                                        'pccsharedtestcodepipelinePipelineUpdatePipelineSelfMutateCodePipelineActionRole43E65CE8',
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
                                    Category: 'Build',
                                    Owner: 'AWS',
                                    Provider: 'CodeBuild',
                                    Version: '1'
                                },
                                Configuration: {
                                    ProjectName: {
                                        Ref: 'pccsharedtestcodepipelineAssetsFileAsset148AEC34D'
                                    }
                                },
                                InputArtifacts: [{Name: 'pcc_shared_test_synth_step_Output'}],
                                Name: 'FileAsset1',
                                RoleArn: {
                                    'Fn::GetAtt': [
                                        'pccsharedtestcodepipelinePipelineAssetsFileAsset1CodePipelineActionRoleBD598FC4',
                                        'Arn'
                                    ]
                                },
                                RunOrder: 1
                            },
                            {
                                ActionTypeId: {
                                    Category: 'Build',
                                    Owner: 'AWS',
                                    Provider: 'CodeBuild',
                                    Version: '1'
                                },
                                Configuration: {
                                    ProjectName: {
                                        Ref: 'pccsharedtestcodepipelineAssetsFileAsset25BAD1BD7'
                                    }
                                },
                                InputArtifacts: [{Name: 'pcc_shared_test_synth_step_Output'}],
                                Name: 'FileAsset2',
                                RoleArn: {
                                    'Fn::GetAtt': [
                                        'pccsharedtestcodepipelinePipelineAssetsFileAsset2CodePipelineActionRoleA42AF81D',
                                        'Arn'
                                    ]
                                },
                                RunOrder: 1
                            },
                            {
                                ActionTypeId: {
                                    Category: 'Build',
                                    Owner: 'AWS',
                                    Provider: 'CodeBuild',
                                    Version: '1'
                                },
                                Configuration: {
                                    ProjectName: {
                                        Ref: 'pccsharedtestcodepipelineAssetsFileAsset37A91F8F0'
                                    }
                                },
                                InputArtifacts: [{Name: 'pcc_shared_test_synth_step_Output'}],
                                Name: 'FileAsset3',
                                RoleArn: {
                                    'Fn::GetAtt': [
                                        'pccsharedtestcodepipelinePipelineAssetsFileAsset3CodePipelineActionRole1715D82C',
                                        'Arn'
                                    ]
                                },
                                RunOrder: 1
                            }
                        ],
                        Name: 'Assets'
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
                                    StackName: 'pcc-sdlc-test-stack',
                                    Capabilities: 'CAPABILITY_NAMED_IAM,CAPABILITY_AUTO_EXPAND',
                                    RoleArn: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                {Ref: 'AWS::Partition'},
                                                ':iam::11111:role/cdk-hnb659fds-cfn-exec-role-11111-us-west-2'
                                            ]
                                        ]
                                    },
                                    TemplateConfiguration: 'pcc_shared_test_synth_step_Output::assembly-pcc-shared-test-pcc-sdlc-test/pccsharedtestpccsdlcteststack9B4E7CA4.template.json.config.json',
                                    ActionMode: 'CHANGE_SET_REPLACE',
                                    ChangeSetName: 'PipelineChange',
                                    TemplatePath: 'pcc_shared_test_synth_step_Output::assembly-pcc-shared-test-pcc-sdlc-test/pccsharedtestpccsdlcteststack9B4E7CA4.template.json'
                                },
                                InputArtifacts: [{Name: 'pcc_shared_test_synth_step_Output'}],
                                Name: 'Prepare',
                                RoleArn: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':iam::11111:role/cdk-hnb659fds-deploy-role-11111-us-west-2'
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
                                    StackName: 'pcc-sdlc-test-stack',
                                    ActionMode: 'CHANGE_SET_EXECUTE',
                                    ChangeSetName: 'PipelineChange'
                                },
                                Name: 'Deploy',
                                RoleArn: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':iam::11111:role/cdk-hnb659fds-deploy-role-11111-us-west-2'
                                        ]
                                    ]
                                },
                                RunOrder: 2
                            }
                        ],
                        Name: 'pcc-sdlc-test'
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
                                        'pccsharedtestcodepipelinePipelinepccprodtestmanualApprovalstepCodePipelineActionRoleE6079BF9',
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
                                    StackName: 'pcc-prod-test-stack',
                                    Capabilities: 'CAPABILITY_NAMED_IAM,CAPABILITY_AUTO_EXPAND',
                                    RoleArn: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                {Ref: 'AWS::Partition'},
                                                ':iam::22222:role/cdk-hnb659fds-cfn-exec-role-22222-us-west-2'
                                            ]
                                        ]
                                    },
                                    TemplateConfiguration: 'pcc_shared_test_synth_step_Output::assembly-pcc-shared-test-pcc-prod-test/pccsharedtestpccprodteststack17242A53.template.json.config.json',
                                    ActionMode: 'CHANGE_SET_REPLACE',
                                    ChangeSetName: 'PipelineChange',
                                    TemplatePath: 'pcc_shared_test_synth_step_Output::assembly-pcc-shared-test-pcc-prod-test/pccsharedtestpccprodteststack17242A53.template.json'
                                },
                                InputArtifacts: [{Name: 'pcc_shared_test_synth_step_Output'}],
                                Name: 'stack.Prepare',
                                RoleArn: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':iam::22222:role/cdk-hnb659fds-deploy-role-22222-us-west-2'
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
                                    StackName: 'pcc-prod-test-stack',
                                    ActionMode: 'CHANGE_SET_EXECUTE',
                                    ChangeSetName: 'PipelineChange'
                                },
                                Name: 'stack.Deploy',
                                RoleArn: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':iam::22222:role/cdk-hnb659fds-deploy-role-22222-us-west-2'
                                        ]
                                    ]
                                },
                                RunOrder: 3
                            }
                        ],
                        Name: 'pcc-prod-test'
                    }
                ],
                ArtifactStore: {
                    EncryptionKey: {
                        Id: {
                            'Fn::GetAtt': [
                                'pccsharedtestcodepipelinePipelineArtifactsBucketEncryptionKey3CA0A728',
                                'Arn'
                            ]
                        },
                        Type: 'KMS'
                    },
                    Location: {
                        Ref: 'pccsharedtestcodepipelinePipelineArtifactsBucket1DB2956C'
                    },
                    Type: 'S3'
                },
                Name: 'pcc-shared-test-code-pipeline',
                RestartExecutionOnUpdate: true,
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            },
            DependsOn: [
                'pccsharedtestcodepipelinePipelineRoleDefaultPolicy44AD6A4A',
                'pccsharedtestcodepipelinePipelineRole7DA95E27'
            ]
        },
        pccsharedtestcodepipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRole8F4DC317: {
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
                                            ':iam::12344:root'
                                        ]
                                    ]
                                }
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            }
        },
        pccsharedtestcodepipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRoleDefaultPolicyEB25EB7D: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 'codestar-connections:UseConnection',
                            Effect: 'Allow',
                            Resource: 'arn:aws:codestar-connections:us-west-2:accountId:connection/randomUUID'
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
                                        'pccsharedtestcodepipelinePipelineArtifactsBucket1DB2956C',
                                        'Arn'
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [
                                                    'pccsharedtestcodepipelinePipelineArtifactsBucket1DB2956C',
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
                                    'pccsharedtestcodepipelinePipelineArtifactsBucketEncryptionKey3CA0A728',
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
                                                'pccsharedtestcodepipelinePipelineArtifactsBucket1DB2956C',
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
                PolicyName: 'pccsharedtestcodepipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRoleDefaultPolicyEB25EB7D',
                Roles: [
                    {
                        Ref: 'pccsharedtestcodepipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRole8F4DC317'
                    }
                ]
            }
        },
        pccsharedtestcodepipelinePipelineBuildpccsharedtestsynthstepCdkBuildProjectC0F0B7F3: {
            Type: 'AWS::CodeBuild::Project',
            Properties: {
                Artifacts: {Type: 'CODEPIPELINE'},
                Environment: {
                    ComputeType: 'BUILD_GENERAL1_SMALL',
                    Image: 'aws/codebuild/standard:5.0',
                    ImagePullCredentialsType: 'CODEBUILD',
                    PrivilegedMode: false,
                    Type: 'LINUX_CONTAINER'
                },
                ServiceRole: {
                    'Fn::GetAtt': ['pccsharedtestsynthsteprole88CEA341', 'Arn']
                },
                Source: {
                    BuildSpec: '{\n' +
                        '  "version": "0.2",\n' +
                        '  "phases": {\n' +
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
                        '    "files": "**/*"\n' +
                        '  }\n' +
                        '}',
                    Type: 'CODEPIPELINE'
                },
                Cache: {Type: 'NO_CACHE'},
                Description: 'Pipeline step pcc-shared-test/Pipeline/Build/pcc-shared-test-synth-step',
                EncryptionKey: {
                    'Fn::GetAtt': [
                        'pccsharedtestcodepipelinePipelineArtifactsBucketEncryptionKey3CA0A728',
                        'Arn'
                    ]
                },
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            }
        },
        pccsharedtestcodepipelinePipelineBuildpccsharedtestsynthstepCodePipelineActionRoleD6C9AD9C: {
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
                                            ':iam::12344:root'
                                        ]
                                    ]
                                }
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            }
        },
        pccsharedtestcodepipelinePipelineBuildpccsharedtestsynthstepCodePipelineActionRoleDefaultPolicy5F0D9D54: {
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
                                    'pccsharedtestcodepipelinePipelineBuildpccsharedtestsynthstepCdkBuildProjectC0F0B7F3',
                                    'Arn'
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsharedtestcodepipelinePipelineBuildpccsharedtestsynthstepCodePipelineActionRoleDefaultPolicy5F0D9D54',
                Roles: [
                    {
                        Ref: 'pccsharedtestcodepipelinePipelineBuildpccsharedtestsynthstepCodePipelineActionRoleD6C9AD9C'
                    }
                ]
            }
        },
        pccsharedtestcodepipelinePipelineUpdatePipelineSelfMutateCodePipelineActionRole43E65CE8: {
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
                                            ':iam::12344:root'
                                        ]
                                    ]
                                }
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            }
        },
        pccsharedtestcodepipelinePipelineUpdatePipelineSelfMutateCodePipelineActionRoleDefaultPolicyFB633819: {
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
                                    'pccsharedtestcodepipelineUpdatePipelineSelfMutation7DDFA823',
                                    'Arn'
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsharedtestcodepipelinePipelineUpdatePipelineSelfMutateCodePipelineActionRoleDefaultPolicyFB633819',
                Roles: [
                    {
                        Ref: 'pccsharedtestcodepipelinePipelineUpdatePipelineSelfMutateCodePipelineActionRole43E65CE8'
                    }
                ]
            }
        },
        pccsharedtestcodepipelinePipelineAssetsFileAsset1CodePipelineActionRoleBD598FC4: {
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
                                            ':iam::12344:root'
                                        ]
                                    ]
                                }
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            }
        },
        pccsharedtestcodepipelinePipelineAssetsFileAsset1CodePipelineActionRoleDefaultPolicyBFED234F: {
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
                                    'pccsharedtestcodepipelineAssetsFileAsset148AEC34D',
                                    'Arn'
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsharedtestcodepipelinePipelineAssetsFileAsset1CodePipelineActionRoleDefaultPolicyBFED234F',
                Roles: [
                    {
                        Ref: 'pccsharedtestcodepipelinePipelineAssetsFileAsset1CodePipelineActionRoleBD598FC4'
                    }
                ]
            }
        },
        pccsharedtestcodepipelinePipelineAssetsFileAsset2CodePipelineActionRoleA42AF81D: {
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
                                            ':iam::12344:root'
                                        ]
                                    ]
                                }
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            }
        },
        pccsharedtestcodepipelinePipelineAssetsFileAsset2CodePipelineActionRoleDefaultPolicyBCBC689A: {
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
                                    'pccsharedtestcodepipelineAssetsFileAsset25BAD1BD7',
                                    'Arn'
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsharedtestcodepipelinePipelineAssetsFileAsset2CodePipelineActionRoleDefaultPolicyBCBC689A',
                Roles: [
                    {
                        Ref: 'pccsharedtestcodepipelinePipelineAssetsFileAsset2CodePipelineActionRoleA42AF81D'
                    }
                ]
            }
        },
        pccsharedtestcodepipelinePipelineAssetsFileAsset3CodePipelineActionRole1715D82C: {
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
                                            ':iam::12344:root'
                                        ]
                                    ]
                                }
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            }
        },
        pccsharedtestcodepipelinePipelineAssetsFileAsset3CodePipelineActionRoleDefaultPolicyC896FBC6: {
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
                                    'pccsharedtestcodepipelineAssetsFileAsset37A91F8F0',
                                    'Arn'
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsharedtestcodepipelinePipelineAssetsFileAsset3CodePipelineActionRoleDefaultPolicyC896FBC6',
                Roles: [
                    {
                        Ref: 'pccsharedtestcodepipelinePipelineAssetsFileAsset3CodePipelineActionRole1715D82C'
                    }
                ]
            }
        },
        pccsharedtestcodepipelinePipelinepccprodtestmanualApprovalstepCodePipelineActionRoleE6079BF9: {
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
                                            ':iam::12344:root'
                                        ]
                                    ]
                                }
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            }
        },
        pccsharedtestcodepipelineUpdatePipelineSelfMutationRole2CFEB79A: {
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
                },
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            }
        },
        pccsharedtestcodepipelineUpdatePipelineSelfMutationRoleDefaultPolicyB7B41B80: {
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
                                            ':logs:us-west-2:12344:log-group:/aws/codebuild/',
                                            {
                                                Ref: 'pccsharedtestcodepipelineUpdatePipelineSelfMutation7DDFA823'
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
                                            ':logs:us-west-2:12344:log-group:/aws/codebuild/',
                                            {
                                                Ref: 'pccsharedtestcodepipelineUpdatePipelineSelfMutation7DDFA823'
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
                                        ':codebuild:us-west-2:12344:report-group/',
                                        {
                                            Ref: 'pccsharedtestcodepipelineUpdatePipelineSelfMutation7DDFA823'
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
                            Resource: 'arn:*:iam::12344:role/*'
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
                                        'pccsharedtestcodepipelinePipelineArtifactsBucket1DB2956C',
                                        'Arn'
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [
                                                    'pccsharedtestcodepipelinePipelineArtifactsBucket1DB2956C',
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
                                    'pccsharedtestcodepipelinePipelineArtifactsBucketEncryptionKey3CA0A728',
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
                                    'pccsharedtestcodepipelinePipelineArtifactsBucketEncryptionKey3CA0A728',
                                    'Arn'
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsharedtestcodepipelineUpdatePipelineSelfMutationRoleDefaultPolicyB7B41B80',
                Roles: [
                    {
                        Ref: 'pccsharedtestcodepipelineUpdatePipelineSelfMutationRole2CFEB79A'
                    }
                ]
            }
        },
        pccsharedtestcodepipelineUpdatePipelineSelfMutation7DDFA823: {
            Type: 'AWS::CodeBuild::Project',
            Properties: {
                Artifacts: {Type: 'CODEPIPELINE'},
                Environment: {
                    ComputeType: 'BUILD_GENERAL1_SMALL',
                    Image: 'aws/codebuild/standard:5.0',
                    ImagePullCredentialsType: 'CODEBUILD',
                    PrivilegedMode: false,
                    Type: 'LINUX_CONTAINER'
                },
                ServiceRole: {
                    'Fn::GetAtt': [
                        'pccsharedtestcodepipelineUpdatePipelineSelfMutationRole2CFEB79A',
                        'Arn'
                    ]
                },
                Source: {
                    BuildSpec: '{\n' +
                        '  "version": "0.2",\n' +
                        '  "phases": {\n' +
                        '    "install": {\n' +
                        '      "commands": [\n' +
                        '        "npm install -g aws-cdk@2"\n' +
                        '      ]\n' +
                        '    },\n' +
                        '    "build": {\n' +
                        '      "commands": [\n' +
                        '        "cdk -a . deploy pcc-shared-test --require-approval=never --verbose"\n' +
                        '      ]\n' +
                        '    }\n' +
                        '  }\n' +
                        '}',
                    Type: 'CODEPIPELINE'
                },
                Cache: {Type: 'NO_CACHE'},
                Description: 'Pipeline step pcc-shared-test/Pipeline/UpdatePipeline/SelfMutate',
                EncryptionKey: {
                    'Fn::GetAtt': [
                        'pccsharedtestcodepipelinePipelineArtifactsBucketEncryptionKey3CA0A728',
                        'Arn'
                    ]
                },
                Name: 'pcc-shared-test-code-pipeline-selfupdate',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            }
        },
        pccsharedtestcodepipelineAssetsFileRole8E4F3120: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: {Service: 'codebuild.amazonaws.com'}
                        },
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
                                            ':iam::12344:root'
                                        ]
                                    ]
                                }
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            }
        },
        pccsharedtestcodepipelineAssetsFileRoleDefaultPolicy628F3D15: {
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
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {Ref: 'AWS::Partition'},
                                        ':logs:us-west-2:12344:log-group:/aws/codebuild/*'
                                    ]
                                ]
                            }
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
                                        ':codebuild:us-west-2:12344:report-group/*'
                                    ]
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
                            Resource: '*'
                        },
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Resource: [
                                {
                                    'Fn::Sub': 'arn:${AWS::Partition}:iam::11111:role/cdk-hnb659fds-file-publishing-role-11111-us-west-2'
                                },
                                {
                                    'Fn::Sub': 'arn:${AWS::Partition}:iam::22222:role/cdk-hnb659fds-file-publishing-role-22222-us-west-2'
                                }
                            ]
                        },
                        {
                            Action: ['s3:GetObject*', 's3:GetBucket*', 's3:List*'],
                            Effect: 'Allow',
                            Resource: [
                                {
                                    'Fn::GetAtt': [
                                        'pccsharedtestcodepipelinePipelineArtifactsBucket1DB2956C',
                                        'Arn'
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [
                                                    'pccsharedtestcodepipelinePipelineArtifactsBucket1DB2956C',
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
                                    'pccsharedtestcodepipelinePipelineArtifactsBucketEncryptionKey3CA0A728',
                                    'Arn'
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsharedtestcodepipelineAssetsFileRoleDefaultPolicy628F3D15',
                Roles: [
                    {Ref: 'pccsharedtestcodepipelineAssetsFileRole8E4F3120'}
                ]
            }
        },
        pccsharedtestcodepipelineAssetsFileAsset148AEC34D: {
            Type: 'AWS::CodeBuild::Project',
            Properties: {
                Artifacts: {Type: 'CODEPIPELINE'},
                Environment: {
                    ComputeType: 'BUILD_GENERAL1_SMALL',
                    Image: 'aws/codebuild/standard:5.0',
                    ImagePullCredentialsType: 'CODEBUILD',
                    PrivilegedMode: false,
                    Type: 'LINUX_CONTAINER'
                },
                ServiceRole: {
                    'Fn::GetAtt': [
                        'pccsharedtestcodepipelineAssetsFileRole8E4F3120',
                        'Arn'
                    ]
                },
                Source: {
                    BuildSpec: Match.stringLikeRegexp('[\\s\\S]*assembly-pcc-shared-test-pcc-sdlc-test\/pccsharedtestpccsdlcteststack[\\s\\S]*\.assets\.json[\\s\\S]*11111-us-west-2[\\s\\S]*assembly-pcc-shared-test-pcc-prod-test\/pccsharedtestpccprodteststack[\\s\\S]*\.assets\.json[\\s\\S]*22222-us-west-2'),
                    Type: 'CODEPIPELINE'
                },
                Cache: {Type: 'NO_CACHE'},
                Description: 'Pipeline step pcc-shared-test/Pipeline/Assets/FileAsset1',
                EncryptionKey: {
                    'Fn::GetAtt': [
                        'pccsharedtestcodepipelinePipelineArtifactsBucketEncryptionKey3CA0A728',
                        'Arn'
                    ]
                },
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            }
        },
        pccsharedtestcodepipelineAssetsFileAsset25BAD1BD7: {
            Type: 'AWS::CodeBuild::Project',
            Properties: {
                Artifacts: {Type: 'CODEPIPELINE'},
                Environment: {
                    ComputeType: 'BUILD_GENERAL1_SMALL',
                    Image: 'aws/codebuild/standard:5.0',
                    ImagePullCredentialsType: 'CODEBUILD',
                    PrivilegedMode: false,
                    Type: 'LINUX_CONTAINER'
                },
                ServiceRole: {
                    'Fn::GetAtt': [
                        'pccsharedtestcodepipelineAssetsFileRole8E4F3120',
                        'Arn'
                    ]
                },
                Source: {
                    BuildSpec: Match.stringLikeRegexp('[\\s\\S]*assembly-pcc-shared-test-pcc-sdlc-test\/pccsharedtestpccsdlcteststack[\\s\\S]*\.assets\.json[\\s\\S]*11111-us-west-2'),
                    Type: 'CODEPIPELINE'
                },
                Cache: {Type: 'NO_CACHE'},
                Description: 'Pipeline step pcc-shared-test/Pipeline/Assets/FileAsset2',
                EncryptionKey: {
                    'Fn::GetAtt': [
                        'pccsharedtestcodepipelinePipelineArtifactsBucketEncryptionKey3CA0A728',
                        'Arn'
                    ]
                },
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            }
        },
        pccsharedtestcodepipelineAssetsFileAsset37A91F8F0: {
            Type: 'AWS::CodeBuild::Project',
            Properties: {
                Artifacts: {Type: 'CODEPIPELINE'},
                Environment: {
                    ComputeType: 'BUILD_GENERAL1_SMALL',
                    Image: 'aws/codebuild/standard:5.0',
                    ImagePullCredentialsType: 'CODEBUILD',
                    PrivilegedMode: false,
                    Type: 'LINUX_CONTAINER'
                },
                ServiceRole: {
                    'Fn::GetAtt': [
                        'pccsharedtestcodepipelineAssetsFileRole8E4F3120',
                        'Arn'
                    ]
                },
                Source: {
                    BuildSpec: Match.stringLikeRegexp('[\\s\\S]*assembly-pcc-shared-test-pcc-sdlc-test\/pccsharedtestpccsdlcteststack[\\s\\S]*\.assets\.json[\\s\\S]*11111-us-west-2'),
                    Type: 'CODEPIPELINE'
                },
                Cache: {Type: 'NO_CACHE'},
                Description: 'Pipeline step pcc-shared-test/Pipeline/Assets/FileAsset3',
                EncryptionKey: {
                    'Fn::GetAtt': [
                        'pccsharedtestcodepipelinePipelineArtifactsBucketEncryptionKey3CA0A728',
                        'Arn'
                    ]
                },
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            }
        },
        pccsharedtestecrsteproleF733193B: {
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
                },
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            }
        },
        pccsharedtestecrsteproleDefaultPolicy2494C479: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
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
                                'ecr:PutImage',
                                'ecr:InitiateLayerUpload',
                                'ecr:UploadLayerPart',
                                'ecr:CompleteLayerUpload'
                            ],
                            Effect: 'Allow',
                            Resource: {'Fn::GetAtt': ['nginxecrC430EE7B', 'Arn']}
                        },
                        {
                            Action: [
                                'ecr:BatchCheckLayerAvailability',
                                'ecr:GetDownloadUrlForLayer',
                                'ecr:BatchGetImage'
                            ],
                            Effect: 'Allow',
                            Resource: {'Fn::GetAtt': ['phpfpmecr3C5F411B', 'Arn']}
                        },
                        {
                            Action: [
                                'ecr:PutImage',
                                'ecr:InitiateLayerUpload',
                                'ecr:UploadLayerPart',
                                'ecr:CompleteLayerUpload'
                            ],
                            Effect: 'Allow',
                            Resource: {'Fn::GetAtt': ['phpfpmecr3C5F411B', 'Arn']}
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsharedtestecrsteproleDefaultPolicy2494C479',
                Roles: [{Ref: 'pccsharedtestecrsteproleF733193B'}]
            }
        },
        nginxecrC430EE7B: {
            Type: 'AWS::ECR::Repository',
            Properties: {
                ImageScanningConfiguration: {ScanOnPush: true},
                LifecyclePolicy: {
                    LifecyclePolicyText: '{"rules":[{"rulePriority":1,"selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":3},"action":{"type":"expire"}}]}'
                },
                RepositoryName: 'pcc-test/nginx',
                RepositoryPolicyText: {
                    Version: '2012-10-17',
                    Statement: [
                        {
                            Effect: 'Allow',
                            Principal: {
                                AWS: [
                                    'arn:aws:iam::11111:root',
                                    'arn:aws:iam::22222:root'
                                ]
                            },
                            Action: [
                                'ecr:BatchCheckLayerAvailability',
                                'ecr:BatchGetImage',
                                'ecr:GetDownloadUrlForLayer',
                                'ecr:DescribeImages'
                            ]
                        }
                    ]
                },
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
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
                RepositoryName: 'pcc-test/phpfpm',
                RepositoryPolicyText: {
                    Version: '2012-10-17',
                    Statement: [
                        {
                            Effect: 'Allow',
                            Principal: {
                                AWS: [
                                    'arn:aws:iam::11111:root',
                                    'arn:aws:iam::22222:root'
                                ]
                            },
                            Action: [
                                'ecr:BatchCheckLayerAvailability',
                                'ecr:BatchGetImage',
                                'ecr:GetDownloadUrlForLayer',
                                'ecr:DescribeImages'
                            ]
                        }
                    ]
                },
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            },
            UpdateReplacePolicy: 'Retain',
            DeletionPolicy: 'Retain'
        }
    },
    Parameters: {
        pccsharedtestconfiglookupParameter: {
            Type: 'AWS::SSM::Parameter::Value<String>',
            Default: '/pcc-shared-test/config'
        },
        BootstrapVersion: {
            Type: 'AWS::SSM::Parameter::Value<String>',
            Default: '/cdk-bootstrap/hnb659fds/version',
            Description: 'Version of the CDK Bootstrap resources in this environment, automatically retrieved from SSM Parameter Store. [cdk:skip]'
        }
    },
    Rules: {
        CheckBootstrapVersion: {
            Assertions: [
                {
                    Assert: {
                        'Fn::Not': [
                            {
                                'Fn::Contains': [
                                    ['1', '2', '3', '4', '5'],
                                    {Ref: 'BootstrapVersion'}
                                ]
                            }
                        ]
                    },
                    AssertDescription: "CDK bootstrap stack version 6 required. Please run 'cdk bootstrap' with a recent version of the CDK CLI."
                }
            ]
        }
    }
}