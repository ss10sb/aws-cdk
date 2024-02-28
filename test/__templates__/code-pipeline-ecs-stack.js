const {Match} = require("aws-cdk-lib/assertions");
module.exports = {
    Resources: {
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
                }
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
                }
            },
            UpdateReplacePolicy: 'Retain',
            DeletionPolicy: 'Retain'
        },
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
                }
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
                }
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
                }
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
                }
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
                                    'pccsharedtestcodepipelineCodeBuildActionRole574D2B54',
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
                                    'pccsharedtestcodepipelinePipelinepccprodteststagemanualApprovalstepCodePipelineActionRole24035FD1',
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
                PipelineType: 'V1',
                RestartExecutionOnUpdate: true,
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
                                    BranchName: 'main',
                                    DetectChanges: true
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
                                    EnvironmentVariables: '[{"name":"_PROJECT_CONFIG_HASH","type":"PLAINTEXT","value":"520ba5c4fb85f7bf6340862ca7acf42069a21cb84c419f97f0cd6b0c9d09cb2f"}]'
                                },
                                InputArtifacts: [{Name: 'repoOwner_repoName_Source'}],
                                Name: 'pcc-shared-test-synth-step',
                                OutputArtifacts: [{Name: 'pcc_shared_test_synth_step_Output'}],
                                RoleArn: {
                                    'Fn::GetAtt': [
                                        'pccsharedtestcodepipelineCodeBuildActionRole574D2B54',
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
                                    EnvironmentVariables: '[{"name":"_PROJECT_CONFIG_HASH","type":"PLAINTEXT","value":"f38f9b096508bc85b44176027e022945d3afd948c9228333b832203d8060de70"}]'
                                },
                                InputArtifacts: [{Name: 'pcc_shared_test_synth_step_Output'}],
                                Name: 'SelfMutate',
                                RoleArn: {
                                    'Fn::GetAtt': [
                                        'pccsharedtestcodepipelineCodeBuildActionRole574D2B54',
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
                                        'pccsharedtestcodepipelineCodeBuildActionRole574D2B54',
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
                                        'pccsharedtestcodepipelineCodeBuildActionRole574D2B54',
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
                                        'pccsharedtestcodepipelineCodeBuildActionRole574D2B54',
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
                                    Category: 'Build',
                                    Owner: 'AWS',
                                    Provider: 'CodeBuild',
                                    Version: '1'
                                },
                                Configuration: {
                                    ProjectName: {
                                        Ref: 'pccsharedtestcodepipelinePipelineecrbuildnginxecrstep105D30FA'
                                    }
                                },
                                InputArtifacts: [{Name: 'repoOwner_repoName_Source'}],
                                Name: 'nginx-ecr-step',
                                RoleArn: {
                                    'Fn::GetAtt': [
                                        'pccsharedtestcodepipelineCodeBuildActionRole574D2B54',
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
                                        Ref: 'pccsharedtestcodepipelinePipelineecrbuildphpfpmecrstepC4ABCF85'
                                    }
                                },
                                InputArtifacts: [{Name: 'repoOwner_repoName_Source'}],
                                Name: 'phpfpm-ecr-step',
                                RoleArn: {
                                    'Fn::GetAtt': [
                                        'pccsharedtestcodepipelineCodeBuildActionRole574D2B54',
                                        'Arn'
                                    ]
                                },
                                RunOrder: 1
                            }
                        ],
                        Name: 'ecr-build'
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
                                    StackName: 'pcc-sdlc-test',
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
                                    TemplateConfiguration: 'pcc_shared_test_synth_step_Output::assembly-pcc-shared-test-pcc-sdlc-test-stage/pccsharedtestpccsdlcteststagepccsdlctest0A9A7A91.template.json.config.json',
                                    ActionMode: 'CHANGE_SET_REPLACE',
                                    ChangeSetName: 'PipelineChange',
                                    TemplatePath: 'pcc_shared_test_synth_step_Output::assembly-pcc-shared-test-pcc-sdlc-test-stage/pccsharedtestpccsdlcteststagepccsdlctest0A9A7A91.template.json'
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
                                    StackName: 'pcc-sdlc-test',
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
                        Name: 'pcc-sdlc-test-stage'
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
                                        'pccsharedtestcodepipelinePipelinepccprodteststagemanualApprovalstepCodePipelineActionRole24035FD1',
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
                                    StackName: 'pcc-prod-test',
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
                                    TemplateConfiguration: 'pcc_shared_test_synth_step_Output::assembly-pcc-shared-test-pcc-prod-test-stage/pccsharedtestpccprodteststagepccprodtest180889E6.template.json.config.json',
                                    ActionMode: 'CHANGE_SET_REPLACE',
                                    ChangeSetName: 'PipelineChange',
                                    TemplatePath: 'pcc_shared_test_synth_step_Output::assembly-pcc-shared-test-pcc-prod-test-stage/pccsharedtestpccprodteststagepccprodtest180889E6.template.json'
                                },
                                InputArtifacts: [{Name: 'pcc_shared_test_synth_step_Output'}],
                                Name: 'pcc-prod-test.Prepare',
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
                                    StackName: 'pcc-prod-test',
                                    ActionMode: 'CHANGE_SET_EXECUTE',
                                    ChangeSetName: 'PipelineChange'
                                },
                                Name: 'pcc-prod-test.Deploy',
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
                        Name: 'pcc-prod-test-stage'
                    }
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
                }
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
                Cache: {Type: 'NO_CACHE'},
                Description: 'Pipeline step pcc-shared-test/Pipeline/Build/pcc-shared-test-synth-step',
                EncryptionKey: {
                    'Fn::GetAtt': [
                        'pccsharedtestcodepipelinePipelineArtifactsBucketEncryptionKey3CA0A728',
                        'Arn'
                    ]
                },
                Environment: {
                    ComputeType: 'BUILD_GENERAL1_SMALL',
                    Image: 'aws/codebuild/standard:6.0',
                    ImagePullCredentialsType: 'CODEBUILD',
                    PrivilegedMode: false,
                    Type: 'LINUX_CONTAINER'
                },
                ServiceRole: {
                    'Fn::GetAtt': ['pccsharedtestsynthsteprole88CEA341', 'Arn']
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
                }
            }
        },
        pccsharedtestcodepipelinePipelineecrbuildnginxecrstep105D30FA: {
            Type: 'AWS::CodeBuild::Project',
            Properties: {
                Artifacts: {Type: 'CODEPIPELINE'},
                Cache: {Type: 'NO_CACHE'},
                Description: 'Pipeline step pcc-shared-test/Pipeline/ecr-build/nginx-ecr-step',
                EncryptionKey: {
                    'Fn::GetAtt': [
                        'pccsharedtestcodepipelinePipelineArtifactsBucketEncryptionKey3CA0A728',
                        'Arn'
                    ]
                },
                Environment: {
                    ComputeType: 'BUILD_GENERAL1_SMALL',
                    EnvironmentVariables: [
                        {
                            Name: 'ECR_URI',
                            Type: 'PLAINTEXT',
                            Value: {
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
                        },
                        {
                            Name: 'DOCKER_NAME',
                            Type: 'PLAINTEXT',
                            Value: 'nginx'
                        },
                        {Name: 'IMAGE_TAG', Type: 'PLAINTEXT', Value: '1'},
                        {
                            Name: 'ECR_REGION',
                            Type: 'PLAINTEXT',
                            Value: 'us-west-2'
                        }
                    ],
                    Image: 'aws/codebuild/standard:7.0',
                    ImagePullCredentialsType: 'CODEBUILD',
                    PrivilegedMode: true,
                    Type: 'LINUX_CONTAINER'
                },
                ServiceRole: {
                    'Fn::GetAtt': ['pccsharedtestecrsteproleF733193B', 'Arn']
                },
                Source: {
                    BuildSpec: '{\n' +
                        '  "version": "0.2",\n' +
                        '  "phases": {\n' +
                        '    "build": {\n' +
                        '      "commands": [\n' +
                        '        "echo Login to AWS ECR",\n' +
                        '        "aws ecr get-login-password --region $ECR_REGION | docker login --username AWS --password-stdin $ECR_URI",\n' +
                        '        "echo Build started on `date`",\n' +
                        '        "echo \\"Building the Docker image: $ECR_URI:$IMAGE_TAG\\"",\n' +
                        '        "docker build -t $ECR_URI:latest -t $ECR_URI:$IMAGE_TAG -f docker/Dockerfile.$DOCKER_NAME .",\n' +
                        '        "echo Pushing the Docker image...",\n' +
                        '        "docker push $ECR_URI:$IMAGE_TAG",\n' +
                        '        "docker push $ECR_URI:latest",\n' +
                        '        "echo Build completed on `date`"\n' +
                        '      ]\n' +
                        '    }\n' +
                        '  }\n' +
                        '}',
                    Type: 'CODEPIPELINE'
                }
            }
        },
        pccsharedtestcodepipelinePipelineecrbuildphpfpmecrstepC4ABCF85: {
            Type: 'AWS::CodeBuild::Project',
            Properties: {
                Artifacts: {Type: 'CODEPIPELINE'},
                Cache: {Type: 'NO_CACHE'},
                Description: 'Pipeline step pcc-shared-test/Pipeline/ecr-build/phpfpm-ecr-step',
                EncryptionKey: {
                    'Fn::GetAtt': [
                        'pccsharedtestcodepipelinePipelineArtifactsBucketEncryptionKey3CA0A728',
                        'Arn'
                    ]
                },
                Environment: {
                    ComputeType: 'BUILD_GENERAL1_SMALL',
                    EnvironmentVariables: [
                        {
                            Name: 'ECR_URI',
                            Type: 'PLAINTEXT',
                            Value: {
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
                                                            'Fn::GetAtt': ['phpfpmecr3C5F411B', 'Arn']
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
                                                            'Fn::GetAtt': ['phpfpmecr3C5F411B', 'Arn']
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        '.',
                                        {Ref: 'AWS::URLSuffix'},
                                        '/',
                                        {Ref: 'phpfpmecr3C5F411B'}
                                    ]
                                ]
                            }
                        },
                        {
                            Name: 'DOCKER_NAME',
                            Type: 'PLAINTEXT',
                            Value: 'phpfpm'
                        },
                        {Name: 'IMAGE_TAG', Type: 'PLAINTEXT', Value: '1'},
                        {
                            Name: 'ECR_REGION',
                            Type: 'PLAINTEXT',
                            Value: 'us-west-2'
                        }
                    ],
                    Image: 'aws/codebuild/standard:7.0',
                    ImagePullCredentialsType: 'CODEBUILD',
                    PrivilegedMode: true,
                    Type: 'LINUX_CONTAINER'
                },
                ServiceRole: {
                    'Fn::GetAtt': ['pccsharedtestecrsteproleF733193B', 'Arn']
                },
                Source: {
                    BuildSpec: '{\n' +
                        '  "version": "0.2",\n' +
                        '  "phases": {\n' +
                        '    "build": {\n' +
                        '      "commands": [\n' +
                        '        "echo Login to AWS ECR",\n' +
                        '        "aws ecr get-login-password --region $ECR_REGION | docker login --username AWS --password-stdin $ECR_URI",\n' +
                        '        "echo Build started on `date`",\n' +
                        '        "echo \\"Building the Docker image: $ECR_URI:$IMAGE_TAG\\"",\n' +
                        '        "docker build -t $ECR_URI:latest -t $ECR_URI:$IMAGE_TAG -f docker/Dockerfile.$DOCKER_NAME .",\n' +
                        '        "echo Pushing the Docker image...",\n' +
                        '        "docker push $ECR_URI:$IMAGE_TAG",\n' +
                        '        "docker push $ECR_URI:latest",\n' +
                        '        "echo Build completed on `date`"\n' +
                        '      ]\n' +
                        '    }\n' +
                        '  }\n' +
                        '}',
                    Type: 'CODEPIPELINE'
                }
            }
        },
        pccsharedtestcodepipelinePipelinepccprodteststagemanualApprovalstepCodePipelineActionRole24035FD1: {
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
                }
            }
        },
        pccsharedtestcodepipelinePipelineEventsRoleD1B4EBBF: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: {Service: 'events.amazonaws.com'}
                        }
                    ],
                    Version: '2012-10-17'
                }
            }
        },
        pccsharedtestcodepipelinePipelineEventsRoleDefaultPolicyB7DAF9BB: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 'codepipeline:StartPipelineExecution',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {Ref: 'AWS::Partition'},
                                        ':codepipeline:us-west-2:12344:',
                                        {
                                            Ref: 'pccsharedtestcodepipelinePipeline63991321'
                                        }
                                    ]
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsharedtestcodepipelinePipelineEventsRoleDefaultPolicyB7DAF9BB',
                Roles: [
                    {
                        Ref: 'pccsharedtestcodepipelinePipelineEventsRoleD1B4EBBF'
                    }
                ]
            }
        },
        pccsharedtestcodepipelineCodeBuildActionRole574D2B54: {
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
                                        'pccsharedtestcodepipelinePipelineRole7DA95E27',
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
        pccsharedtestcodepipelineCodeBuildActionRoleDefaultPolicy1CB8FCEC: {
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
                                    'pccsharedtestcodepipelineUpdatePipelineSelfMutation7DDFA823',
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
                                    'pccsharedtestcodepipelineAssetsFileAsset148AEC34D',
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
                                    'pccsharedtestcodepipelineAssetsFileAsset25BAD1BD7',
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
                                    'pccsharedtestcodepipelineAssetsFileAsset37A91F8F0',
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
                                    'pccsharedtestcodepipelinePipelineecrbuildnginxecrstep105D30FA',
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
                                    'pccsharedtestcodepipelinePipelineecrbuildphpfpmecrstepC4ABCF85',
                                    'Arn'
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsharedtestcodepipelineCodeBuildActionRoleDefaultPolicy1CB8FCEC',
                Roles: [
                    {
                        Ref: 'pccsharedtestcodepipelineCodeBuildActionRole574D2B54'
                    }
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
                }
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
                Cache: {Type: 'NO_CACHE'},
                Description: 'Pipeline step pcc-shared-test/Pipeline/UpdatePipeline/SelfMutate',
                EncryptionKey: {
                    'Fn::GetAtt': [
                        'pccsharedtestcodepipelinePipelineArtifactsBucketEncryptionKey3CA0A728',
                        'Arn'
                    ]
                },
                Environment: {
                    ComputeType: 'BUILD_GENERAL1_SMALL',
                    Image: 'aws/codebuild/standard:7.0',
                    ImagePullCredentialsType: 'CODEBUILD',
                    PrivilegedMode: false,
                    Type: 'LINUX_CONTAINER'
                },
                Name: 'pcc-shared-test-code-pipeline-selfupdate',
                ServiceRole: {
                    'Fn::GetAtt': [
                        'pccsharedtestcodepipelineUpdatePipelineSelfMutationRole2CFEB79A',
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
                                '        "cdk -a . deploy pcc-shared-test --require-approval=never --verbose"\n' +
                                '      ]\n' +
                                '    }\n' +
                                '  }\n' +
                                '}'
                            ]
                        ]
                    },
                    Type: 'CODEPIPELINE'
                }
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
                }
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
                Cache: {Type: 'NO_CACHE'},
                Description: 'Pipeline step pcc-shared-test/Pipeline/Assets/FileAsset1',
                EncryptionKey: {
                    'Fn::GetAtt': [
                        'pccsharedtestcodepipelinePipelineArtifactsBucketEncryptionKey3CA0A728',
                        'Arn'
                    ]
                },
                Environment: {
                    ComputeType: 'BUILD_GENERAL1_SMALL',
                    Image: 'aws/codebuild/standard:6.0',
                    ImagePullCredentialsType: 'CODEBUILD',
                    PrivilegedMode: true,
                    Type: 'LINUX_CONTAINER'
                },
                ServiceRole: {
                    'Fn::GetAtt': [
                        'pccsharedtestcodepipelineAssetsFileRole8E4F3120',
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
                                '        "npm install -g cdk-assets@2"\n' +
                                '      ]\n' +
                                '    },\n' +
                                '    "build": {\n' +
                                '      "commands": [\n' +
                                '        "cdk-assets --path \\"assembly-pcc-shared-test-pcc-sdlc-test-stage/pccsharedtestpccsdlcteststagepccsdlctest0A9A7A91.assets.json\\" --verbose publish \\"ed6cd104ff5f101d06dae8cb2b87cc6e6d69b9a22055b467ea6cae10ff023023:11111-us-west-2\\"",\n' +
                                '        "cdk-assets --path \\"assembly-pcc-shared-test-pcc-prod-test-stage/pccsharedtestpccprodteststagepccprodtest180889E6.assets.json\\" --verbose publish \\"ed6cd104ff5f101d06dae8cb2b87cc6e6d69b9a22055b467ea6cae10ff023023:22222-us-west-2\\""\n' +
                                '      ]\n' +
                                '    }\n' +
                                '  }\n' +
                                '}'
                            ]
                        ]
                    },
                    Type: 'CODEPIPELINE'
                }
            }
        },
        pccsharedtestcodepipelineAssetsFileAsset25BAD1BD7: {
            Type: 'AWS::CodeBuild::Project',
            Properties: {
                Artifacts: {Type: 'CODEPIPELINE'},
                Cache: {Type: 'NO_CACHE'},
                Description: 'Pipeline step pcc-shared-test/Pipeline/Assets/FileAsset2',
                EncryptionKey: {
                    'Fn::GetAtt': [
                        'pccsharedtestcodepipelinePipelineArtifactsBucketEncryptionKey3CA0A728',
                        'Arn'
                    ]
                },
                Environment: {
                    ComputeType: 'BUILD_GENERAL1_SMALL',
                    Image: 'aws/codebuild/standard:6.0',
                    ImagePullCredentialsType: 'CODEBUILD',
                    PrivilegedMode: true,
                    Type: 'LINUX_CONTAINER'
                },
                ServiceRole: {
                    'Fn::GetAtt': [
                        'pccsharedtestcodepipelineAssetsFileRole8E4F3120',
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
                                '        "npm install -g cdk-assets@2"\n' +
                                '      ]\n' +
                                '    },\n' +
                                '    "build": {\n' +
                                '      "commands": [\n' +
                                '        "cdk-assets --path \\"assembly-pcc-shared-test-pcc-sdlc-test-stage/pccsharedtestpccsdlcteststagepccsdlctest0A9A7A91.assets.json\\" --verbose publish \\"52c9314b13b741507475c767efe12405a840f6378675be91df8d62589aa0f401:11111-us-west-2\\""\n' +
                                '      ]\n' +
                                '    }\n' +
                                '  }\n' +
                                '}'
                            ]
                        ]
                    },
                    Type: 'CODEPIPELINE'
                }
            }
        },
        pccsharedtestcodepipelineAssetsFileAsset37A91F8F0: {
            Type: 'AWS::CodeBuild::Project',
            Properties: {
                Artifacts: {Type: 'CODEPIPELINE'},
                Cache: {Type: 'NO_CACHE'},
                Description: 'Pipeline step pcc-shared-test/Pipeline/Assets/FileAsset3',
                EncryptionKey: {
                    'Fn::GetAtt': [
                        'pccsharedtestcodepipelinePipelineArtifactsBucketEncryptionKey3CA0A728',
                        'Arn'
                    ]
                },
                Environment: {
                    ComputeType: 'BUILD_GENERAL1_SMALL',
                    Image: 'aws/codebuild/standard:6.0',
                    ImagePullCredentialsType: 'CODEBUILD',
                    PrivilegedMode: true,
                    Type: 'LINUX_CONTAINER'
                },
                ServiceRole: {
                    'Fn::GetAtt': [
                        'pccsharedtestcodepipelineAssetsFileRole8E4F3120',
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
                                '        "npm install -g cdk-assets@2"\n' +
                                '      ]\n' +
                                '    },\n' +
                                '    "build": {\n' +
                                '      "commands": [\n' +
                                '        "cdk-assets --path \\"assembly-pcc-shared-test-pcc-sdlc-test-stage/pccsharedtestpccsdlcteststagepccsdlctest0A9A7A91.assets.json\\" --verbose publish \\"4e26bf2d0a26f2097fb2b261f22bb51e3f6b4b52635777b1e54edbd8e2d58c35:11111-us-west-2\\""\n' +
                                '      ]\n' +
                                '    }\n' +
                                '  }\n' +
                                '}'
                            ]
                        ]
                    },
                    Type: 'CODEPIPELINE'
                }
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
                }
            }
        },
        pccsharedtestecrsteproleDefaultPolicy2494C479: {
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
                                                Ref: 'pccsharedtestcodepipelinePipelineecrbuildnginxecrstep105D30FA'
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
                                                Ref: 'pccsharedtestcodepipelinePipelineecrbuildnginxecrstep105D30FA'
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
                                            Ref: 'pccsharedtestcodepipelinePipelineecrbuildnginxecrstep105D30FA'
                                        },
                                        '-*'
                                    ]
                                ]
                            }
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
                        },
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
                                                Ref: 'pccsharedtestcodepipelinePipelineecrbuildphpfpmecrstepC4ABCF85'
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
                                                Ref: 'pccsharedtestcodepipelinePipelineecrbuildphpfpmecrstepC4ABCF85'
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
                                            Ref: 'pccsharedtestcodepipelinePipelineecrbuildphpfpmecrstepC4ABCF85'
                                        },
                                        '-*'
                                    ]
                                ]
                            }
                        },
                        {
                            Action: [
                                'ecr:BatchCheckLayerAvailability',
                                'ecr:GetDownloadUrlForLayer',
                                'ecr:BatchGetImage',
                                'ecr:CompleteLayerUpload',
                                'ecr:UploadLayerPart',
                                'ecr:InitiateLayerUpload',
                                'ecr:PutImage'
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
                                'ecr:BatchGetImage',
                                'ecr:CompleteLayerUpload',
                                'ecr:UploadLayerPart',
                                'ecr:InitiateLayerUpload',
                                'ecr:PutImage'
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
        pccsharedtestnotificationruletopic0AF49361: {Type: 'AWS::SNS::Topic'},
        pccsharedtestnotificationruletopicadminexampleeduBB0C5B11: {
            Type: 'AWS::SNS::Subscription',
            Properties: {
                Endpoint: 'admin@example.edu',
                Protocol: 'email',
                TopicArn: {Ref: 'pccsharedtestnotificationruletopic0AF49361'}
            }
        },
        pccsharedtestnotificationruletopicPolicyFF9F5D25: {
            Type: 'AWS::SNS::TopicPolicy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 'sns:Publish',
                            Effect: 'Allow',
                            Principal: {Service: 'codestar-notifications.amazonaws.com'},
                            Resource: {Ref: 'pccsharedtestnotificationruletopic0AF49361'},
                            Sid: '0'
                        }
                    ],
                    Version: '2012-10-17'
                },
                Topics: [{Ref: 'pccsharedtestnotificationruletopic0AF49361'}]
            }
        },
        pccsharedtestnotificationrule7C099986: {
            Type: 'AWS::CodeStarNotifications::NotificationRule',
            Properties: {
                DetailType: 'FULL',
                EventTypeIds: [
                    'codepipeline-pipeline-pipeline-execution-failed',
                    'codepipeline-pipeline-pipeline-execution-succeeded',
                    'codepipeline-pipeline-manual-approval-needed'
                ],
                Name: 'pccsharedtestpccsharedtestnotificationrule0F58CF4E',
                Resource: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {Ref: 'AWS::Partition'},
                            ':codepipeline:us-west-2:12344:',
                            {Ref: 'pccsharedtestcodepipelinePipeline63991321'}
                        ]
                    ]
                },
                Targets: [
                    {
                        TargetAddress: {Ref: 'pccsharedtestnotificationruletopic0AF49361'},
                        TargetType: 'SNS'
                    }
                ]
            }
        },
        pccsharedtestrunschedule083A89E8: {
            Type: 'AWS::Events::Rule',
            Properties: {
                ScheduleExpression: 'cron(0 8 ? * 2#1 *)',
                State: 'ENABLED',
                Targets: [
                    {
                        Arn: {
                            'Fn::Join': [
                                '',
                                [
                                    'arn:',
                                    {Ref: 'AWS::Partition'},
                                    ':codepipeline:us-west-2:12344:',
                                    {
                                        Ref: 'pccsharedtestcodepipelinePipeline63991321'
                                    }
                                ]
                            ]
                        },
                        Id: 'Target0',
                        RoleArn: {
                            'Fn::GetAtt': [
                                'pccsharedtestcodepipelinePipelineEventsRoleD1B4EBBF',
                                'Arn'
                            ]
                        }
                    }
                ]
            }
        }
    }
}