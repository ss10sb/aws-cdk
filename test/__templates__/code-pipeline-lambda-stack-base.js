module.exports = {
    Resources: {
        pccsharedtestlambdabuildsteprole7A9F1DFC: {
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
        pccsharedtestlambdabuildsteproleDefaultPolicyFE9A5EAB: {
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
                                                Ref: 'pccsharedtestcodepipelinePipelineBuildpccsharedtestbuildstep7E390D28'
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
                                                Ref: 'pccsharedtestcodepipelinePipelineBuildpccsharedtestbuildstep7E390D28'
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
                                            Ref: 'pccsharedtestcodepipelinePipelineBuildpccsharedtestbuildstep7E390D28'
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
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsharedtestlambdabuildsteproleDefaultPolicyFE9A5EAB',
                Roles: [{Ref: 'pccsharedtestlambdabuildsteprole7A9F1DFC'}]
            }
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
                                        Ref: 'pccsharedtestcodepipelinePipelineBuildpccsharedtestbuildstep7E390D28'
                                    },
                                    EnvironmentVariables: '[{"name":"_PROJECT_CONFIG_HASH","type":"PLAINTEXT","value":"cce96ff96d9f4044a3f0c5bc8cd36ec09f3a4b329a5dbfb2f412089f7fa187ab"}]'
                                },
                                InputArtifacts: [{Name: 'repoOwner_repoName_Source'}],
                                Name: 'pcc-shared-test-build-step',
                                OutputArtifacts: [{Name: 'pcc_shared_test_build_step_Output'}],
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
                                        Ref: 'pccsharedtestcodepipelinePipelineBuildpccsharedtestsynthstepCdkBuildProjectC0F0B7F3'
                                    },
                                    EnvironmentVariables: '[{"name":"_PROJECT_CONFIG_HASH","type":"PLAINTEXT","value":"14f62d18e7087aa1b802000a4bf1e8619c492ebfac7fe3f75beeb4a89df56c67"}]'
                                },
                                InputArtifacts: [{Name: 'pcc_shared_test_build_step_Output'}],
                                Name: 'pcc-shared-test-synth-step',
                                OutputArtifacts: [{Name: 'pcc_shared_test_synth_step_Output'}],
                                RoleArn: {
                                    'Fn::GetAtt': [
                                        'pccsharedtestcodepipelineCodeBuildActionRole574D2B54',
                                        'Arn'
                                    ]
                                },
                                RunOrder: 2
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
                                        Ref: 'pccsharedtestcodepipelineAssetsFileAsset4BE2D5F70'
                                    }
                                },
                                InputArtifacts: [{Name: 'pcc_shared_test_synth_step_Output'}],
                                Name: 'FileAsset4',
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
                                        Ref: 'pccsharedtestcodepipelineAssetsFileAsset50FE53496'
                                    }
                                },
                                InputArtifacts: [{Name: 'pcc_shared_test_synth_step_Output'}],
                                Name: 'FileAsset5',
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
                                        Ref: 'pccsharedtestcodepipelineAssetsFileAsset6F5FBAD21'
                                    }
                                },
                                InputArtifacts: [{Name: 'pcc_shared_test_synth_step_Output'}],
                                Name: 'FileAsset6',
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
                                        Ref: 'pccsharedtestcodepipelineAssetsFileAsset733D38662'
                                    }
                                },
                                InputArtifacts: [{Name: 'pcc_shared_test_synth_step_Output'}],
                                Name: 'FileAsset7',
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
                                        Ref: 'pccsharedtestcodepipelineAssetsFileAsset80E0C40E0'
                                    }
                                },
                                InputArtifacts: [{Name: 'pcc_shared_test_synth_step_Output'}],
                                Name: 'FileAsset8',
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
                RestartExecutionOnUpdate: true
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
        pccsharedtestcodepipelinePipelineBuildpccsharedtestbuildstep7E390D28: {
            Type: 'AWS::CodeBuild::Project',
            Properties: {
                Artifacts: {Type: 'CODEPIPELINE'},
                Environment: {
                    ComputeType: 'BUILD_GENERAL1_SMALL',
                    Image: 'aws/codebuild/standard:6.0',
                    ImagePullCredentialsType: 'CODEBUILD',
                    PrivilegedMode: true,
                    Type: 'LINUX_CONTAINER'
                },
                ServiceRole: {
                    'Fn::GetAtt': ['pccsharedtestlambdabuildsteprole7A9F1DFC', 'Arn']
                },
                Source: {
                    BuildSpec: '{\n' +
                        '  "version": "0.2",\n' +
                        '  "phases": {\n' +
                        '    "install": {\n' +
                        '      "commands": [\n' +
                        '        "php -v",\n' +
                        `        "php -r \\"copy('https://getcomposer.org/installer', 'composer-setup.php');\\"",\n` +
                        '        "php composer-setup.php",\n' +
                        `        "php -r \\"unlink('composer-setup.php');\\"",\n` +
                        '        "mv composer.phar /usr/local/bin/composer"\n' +
                        '      ]\n' +
                        '    },\n' +
                        '    "build": {\n' +
                        '      "commands": [\n' +
                        '        "cd codebase",\n' +
                        '        "mv resources.copy resources && mv config.copy config && mv public.copy public",\n' +
                        '        "npm ci",\n' +
                        '        "npm run prod",\n' +
                        '        "rm -rf node_modules tests",\n' +
                        '        "composer install --ignore-platform-reqs --no-ansi --no-autoloader --no-dev --no-interaction --no-scripts --no-progress",\n' +
                        '        "composer dump-autoload --optimize --classmap-authoritative",\n' +
                        '        "php artisan route:cache",\n' +
                        '        "cp vendor/bref/laravel-bridge/worker.php .",\n' +
                        '        "rm -rf vendor/bin",\n' +
                        '        "cd .."\n' +
                        '      ]\n' +
                        '    }\n' +
                        '  },\n' +
                        '  "artifacts": {\n' +
                        '    "base-directory": "./",\n' +
                        '    "files": "**/*"\n' +
                        '  }\n' +
                        '}',
                    Type: 'CODEPIPELINE'
                },
                Cache: {Type: 'NO_CACHE'},
                Description: 'Pipeline step pcc-shared-test/Pipeline/Build/pcc-shared-test-build-step',
                EncryptionKey: {
                    'Fn::GetAtt': [
                        'pccsharedtestcodepipelinePipelineArtifactsBucketEncryptionKey3CA0A728',
                        'Arn'
                    ]
                }
            }
        },
        pccsharedtestcodepipelinePipelineBuildpccsharedtestsynthstepCdkBuildProjectC0F0B7F3: {
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
                            Condition: {
                                Bool: {'aws:ViaAWSService': 'codepipeline.amazonaws.com'}
                            },
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
                                    'pccsharedtestcodepipelinePipelineBuildpccsharedtestbuildstep7E390D28',
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
                                    'pccsharedtestcodepipelineAssetsFileAsset4BE2D5F70',
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
                                    'pccsharedtestcodepipelineAssetsFileAsset50FE53496',
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
                                    'pccsharedtestcodepipelineAssetsFileAsset6F5FBAD21',
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
                                    'pccsharedtestcodepipelineAssetsFileAsset733D38662',
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
                                    'pccsharedtestcodepipelineAssetsFileAsset80E0C40E0',
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
                Name: 'pcc-shared-test-code-pipeline-selfupdate'
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
                    Image: 'aws/codebuild/standard:6.0',
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
                    BuildSpec: '{\n' +
                        '  "version": "0.2",\n' +
                        '  "phases": {\n' +
                        '    "install": {\n' +
                        '      "commands": [\n' +
                        '        "npm install -g cdk-assets@2"\n' +
                        '      ]\n' +
                        '    },\n' +
                        '    "build": {\n' +
                        '      "commands": [\n' +
                        '        "cdk-assets --path \\"assembly-pcc-shared-test-pcc-sdlc-test-stage/pccsharedtestpccsdlcteststagepccsdlctest0A9A7A91.assets.json\\" --verbose publish \\"e85f10a8bf0e7f4f7931fce24b29d4faf6874948090a2b568b2da33a7116cf84:11111-us-west-2\\"",\n' +
                        '        "cdk-assets --path \\"assembly-pcc-shared-test-pcc-prod-test-stage/pccsharedtestpccprodteststagepccprodtest180889E6.assets.json\\" --verbose publish \\"e85f10a8bf0e7f4f7931fce24b29d4faf6874948090a2b568b2da33a7116cf84:22222-us-west-2\\""\n' +
                        '      ]\n' +
                        '    }\n' +
                        '  }\n' +
                        '}',
                    Type: 'CODEPIPELINE'
                },
                Cache: {Type: 'NO_CACHE'},
                Description: 'Pipeline step pcc-shared-test/Pipeline/Assets/FileAsset1',
                EncryptionKey: {
                    'Fn::GetAtt': [
                        'pccsharedtestcodepipelinePipelineArtifactsBucketEncryptionKey3CA0A728',
                        'Arn'
                    ]
                }
            }
        },
        pccsharedtestcodepipelineAssetsFileAsset25BAD1BD7: {
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
                ServiceRole: {
                    'Fn::GetAtt': [
                        'pccsharedtestcodepipelineAssetsFileRole8E4F3120',
                        'Arn'
                    ]
                },
                Source: {
                    BuildSpec: '{\n' +
                        '  "version": "0.2",\n' +
                        '  "phases": {\n' +
                        '    "install": {\n' +
                        '      "commands": [\n' +
                        '        "npm install -g cdk-assets@2"\n' +
                        '      ]\n' +
                        '    },\n' +
                        '    "build": {\n' +
                        '      "commands": [\n' +
                        '        "cdk-assets --path \\"assembly-pcc-shared-test-pcc-sdlc-test-stage/pccsharedtestpccsdlcteststagepccsdlctest0A9A7A91.assets.json\\" --verbose publish \\"a701d9c4e1414bfb5bdc604564a232c79e82fa1c4186ebc7245836fb15ee2c49:11111-us-west-2\\"",\n' +
                        '        "cdk-assets --path \\"assembly-pcc-shared-test-pcc-prod-test-stage/pccsharedtestpccprodteststagepccprodtest180889E6.assets.json\\" --verbose publish \\"a701d9c4e1414bfb5bdc604564a232c79e82fa1c4186ebc7245836fb15ee2c49:22222-us-west-2\\""\n' +
                        '      ]\n' +
                        '    }\n' +
                        '  }\n' +
                        '}',
                    Type: 'CODEPIPELINE'
                },
                Cache: {Type: 'NO_CACHE'},
                Description: 'Pipeline step pcc-shared-test/Pipeline/Assets/FileAsset2',
                EncryptionKey: {
                    'Fn::GetAtt': [
                        'pccsharedtestcodepipelinePipelineArtifactsBucketEncryptionKey3CA0A728',
                        'Arn'
                    ]
                }
            }
        },
        pccsharedtestcodepipelineAssetsFileAsset37A91F8F0: {
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
                ServiceRole: {
                    'Fn::GetAtt': [
                        'pccsharedtestcodepipelineAssetsFileRole8E4F3120',
                        'Arn'
                    ]
                },
                Source: {
                    BuildSpec: '{\n' +
                        '  "version": "0.2",\n' +
                        '  "phases": {\n' +
                        '    "install": {\n' +
                        '      "commands": [\n' +
                        '        "npm install -g cdk-assets@2"\n' +
                        '      ]\n' +
                        '    },\n' +
                        '    "build": {\n' +
                        '      "commands": [\n' +
                        '        "cdk-assets --path \\"assembly-pcc-shared-test-pcc-sdlc-test-stage/pccsharedtestpccsdlcteststagepccsdlctest0A9A7A91.assets.json\\" --verbose publish \\"eb5b005c858404ea0c8f68098ed5dcdf5340e02461f149751d10f59c210d5ef8:11111-us-west-2\\"",\n' +
                        '        "cdk-assets --path \\"assembly-pcc-shared-test-pcc-prod-test-stage/pccsharedtestpccprodteststagepccprodtest180889E6.assets.json\\" --verbose publish \\"eb5b005c858404ea0c8f68098ed5dcdf5340e02461f149751d10f59c210d5ef8:22222-us-west-2\\""\n' +
                        '      ]\n' +
                        '    }\n' +
                        '  }\n' +
                        '}',
                    Type: 'CODEPIPELINE'
                },
                Cache: {Type: 'NO_CACHE'},
                Description: 'Pipeline step pcc-shared-test/Pipeline/Assets/FileAsset3',
                EncryptionKey: {
                    'Fn::GetAtt': [
                        'pccsharedtestcodepipelinePipelineArtifactsBucketEncryptionKey3CA0A728',
                        'Arn'
                    ]
                }
            }
        },
        pccsharedtestcodepipelineAssetsFileAsset4BE2D5F70: {
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
                ServiceRole: {
                    'Fn::GetAtt': [
                        'pccsharedtestcodepipelineAssetsFileRole8E4F3120',
                        'Arn'
                    ]
                },
                Source: {
                    BuildSpec: '{\n' +
                        '  "version": "0.2",\n' +
                        '  "phases": {\n' +
                        '    "install": {\n' +
                        '      "commands": [\n' +
                        '        "npm install -g cdk-assets@2"\n' +
                        '      ]\n' +
                        '    },\n' +
                        '    "build": {\n' +
                        '      "commands": [\n' +
                        '        "cdk-assets --path \\"assembly-pcc-shared-test-pcc-sdlc-test-stage/pccsharedtestpccsdlcteststagepccsdlctest0A9A7A91.assets.json\\" --verbose publish \\"c53d3eefd84eda81ec21cae72089e12b7729368cb85e86fc9fb8b2031b76415b:11111-us-west-2\\"",\n' +
                        '        "cdk-assets --path \\"assembly-pcc-shared-test-pcc-prod-test-stage/pccsharedtestpccprodteststagepccprodtest180889E6.assets.json\\" --verbose publish \\"c53d3eefd84eda81ec21cae72089e12b7729368cb85e86fc9fb8b2031b76415b:22222-us-west-2\\""\n' +
                        '      ]\n' +
                        '    }\n' +
                        '  }\n' +
                        '}',
                    Type: 'CODEPIPELINE'
                },
                Cache: {Type: 'NO_CACHE'},
                Description: 'Pipeline step pcc-shared-test/Pipeline/Assets/FileAsset4',
                EncryptionKey: {
                    'Fn::GetAtt': [
                        'pccsharedtestcodepipelinePipelineArtifactsBucketEncryptionKey3CA0A728',
                        'Arn'
                    ]
                }
            }
        },
        pccsharedtestcodepipelineAssetsFileAsset50FE53496: {
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
                ServiceRole: {
                    'Fn::GetAtt': [
                        'pccsharedtestcodepipelineAssetsFileRole8E4F3120',
                        'Arn'
                    ]
                },
                Source: {
                    BuildSpec: '{\n' +
                        '  "version": "0.2",\n' +
                        '  "phases": {\n' +
                        '    "install": {\n' +
                        '      "commands": [\n' +
                        '        "npm install -g cdk-assets@2"\n' +
                        '      ]\n' +
                        '    },\n' +
                        '    "build": {\n' +
                        '      "commands": [\n' +
                        '        "cdk-assets --path \\"assembly-pcc-shared-test-pcc-sdlc-test-stage/pccsharedtestpccsdlcteststagepccsdlctest0A9A7A91.assets.json\\" --verbose publish \\"731f24951dbe4e08bfc519dd7c23a4f7158528bd5557e38437b08292ab2a873c:11111-us-west-2\\"",\n' +
                        '        "cdk-assets --path \\"assembly-pcc-shared-test-pcc-prod-test-stage/pccsharedtestpccprodteststagepccprodtest180889E6.assets.json\\" --verbose publish \\"731f24951dbe4e08bfc519dd7c23a4f7158528bd5557e38437b08292ab2a873c:22222-us-west-2\\""\n' +
                        '      ]\n' +
                        '    }\n' +
                        '  }\n' +
                        '}',
                    Type: 'CODEPIPELINE'
                },
                Cache: {Type: 'NO_CACHE'},
                Description: 'Pipeline step pcc-shared-test/Pipeline/Assets/FileAsset5',
                EncryptionKey: {
                    'Fn::GetAtt': [
                        'pccsharedtestcodepipelinePipelineArtifactsBucketEncryptionKey3CA0A728',
                        'Arn'
                    ]
                }
            }
        },
        pccsharedtestcodepipelineAssetsFileAsset6F5FBAD21: {
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
                ServiceRole: {
                    'Fn::GetAtt': [
                        'pccsharedtestcodepipelineAssetsFileRole8E4F3120',
                        'Arn'
                    ]
                },
                Source: {
                    BuildSpec: '{\n' +
                        '  "version": "0.2",\n' +
                        '  "phases": {\n' +
                        '    "install": {\n' +
                        '      "commands": [\n' +
                        '        "npm install -g cdk-assets@2"\n' +
                        '      ]\n' +
                        '    },\n' +
                        '    "build": {\n' +
                        '      "commands": [\n' +
                        '        "cdk-assets --path \\"assembly-pcc-shared-test-pcc-sdlc-test-stage/pccsharedtestpccsdlcteststagepccsdlctest0A9A7A91.assets.json\\" --verbose publish \\"f98b78092dcdd31f5e6d47489beb5f804d4835ef86a8085d0a2053cb9ae711da:11111-us-west-2\\"",\n' +
                        '        "cdk-assets --path \\"assembly-pcc-shared-test-pcc-prod-test-stage/pccsharedtestpccprodteststagepccprodtest180889E6.assets.json\\" --verbose publish \\"f98b78092dcdd31f5e6d47489beb5f804d4835ef86a8085d0a2053cb9ae711da:22222-us-west-2\\""\n' +
                        '      ]\n' +
                        '    }\n' +
                        '  }\n' +
                        '}',
                    Type: 'CODEPIPELINE'
                },
                Cache: {Type: 'NO_CACHE'},
                Description: 'Pipeline step pcc-shared-test/Pipeline/Assets/FileAsset6',
                EncryptionKey: {
                    'Fn::GetAtt': [
                        'pccsharedtestcodepipelinePipelineArtifactsBucketEncryptionKey3CA0A728',
                        'Arn'
                    ]
                }
            }
        },
        pccsharedtestcodepipelineAssetsFileAsset733D38662: {
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
                ServiceRole: {
                    'Fn::GetAtt': [
                        'pccsharedtestcodepipelineAssetsFileRole8E4F3120',
                        'Arn'
                    ]
                },
                Source: {
                    BuildSpec: '{\n' +
                        '  "version": "0.2",\n' +
                        '  "phases": {\n' +
                        '    "install": {\n' +
                        '      "commands": [\n' +
                        '        "npm install -g cdk-assets@2"\n' +
                        '      ]\n' +
                        '    },\n' +
                        '    "build": {\n' +
                        '      "commands": [\n' +
                        '        "cdk-assets --path \\"assembly-pcc-shared-test-pcc-sdlc-test-stage/pccsharedtestpccsdlcteststagepccsdlctest0A9A7A91.assets.json\\" --verbose publish \\"4dd7b3acb0d8c02094bb424ce803d0e3418f6db703e9524905cb0d32ff66b78b:11111-us-west-2\\"",\n' +
                        '        "cdk-assets --path \\"assembly-pcc-shared-test-pcc-prod-test-stage/pccsharedtestpccprodteststagepccprodtest180889E6.assets.json\\" --verbose publish \\"4dd7b3acb0d8c02094bb424ce803d0e3418f6db703e9524905cb0d32ff66b78b:22222-us-west-2\\""\n' +
                        '      ]\n' +
                        '    }\n' +
                        '  }\n' +
                        '}',
                    Type: 'CODEPIPELINE'
                },
                Cache: {Type: 'NO_CACHE'},
                Description: 'Pipeline step pcc-shared-test/Pipeline/Assets/FileAsset7',
                EncryptionKey: {
                    'Fn::GetAtt': [
                        'pccsharedtestcodepipelinePipelineArtifactsBucketEncryptionKey3CA0A728',
                        'Arn'
                    ]
                }
            }
        },
        pccsharedtestcodepipelineAssetsFileAsset80E0C40E0: {
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
                ServiceRole: {
                    'Fn::GetAtt': [
                        'pccsharedtestcodepipelineAssetsFileRole8E4F3120',
                        'Arn'
                    ]
                },
                Source: {
                    BuildSpec: '{\n' +
                        '  "version": "0.2",\n' +
                        '  "phases": {\n' +
                        '    "install": {\n' +
                        '      "commands": [\n' +
                        '        "npm install -g cdk-assets@2"\n' +
                        '      ]\n' +
                        '    },\n' +
                        '    "build": {\n' +
                        '      "commands": [\n' +
                        '        "cdk-assets --path \\"assembly-pcc-shared-test-pcc-sdlc-test-stage/pccsharedtestpccsdlcteststagepccsdlctest0A9A7A91.assets.json\\" --verbose publish \\"6dbd112fe448437b3438da4382c72fccbb7d2ee1543db222620d7447fffebc50:11111-us-west-2\\"",\n' +
                        '        "cdk-assets --path \\"assembly-pcc-shared-test-pcc-prod-test-stage/pccsharedtestpccprodteststagepccprodtest180889E6.assets.json\\" --verbose publish \\"6dbd112fe448437b3438da4382c72fccbb7d2ee1543db222620d7447fffebc50:22222-us-west-2\\""\n' +
                        '      ]\n' +
                        '    }\n' +
                        '  }\n' +
                        '}',
                    Type: 'CODEPIPELINE'
                },
                Cache: {Type: 'NO_CACHE'},
                Description: 'Pipeline step pcc-shared-test/Pipeline/Assets/FileAsset8',
                EncryptionKey: {
                    'Fn::GetAtt': [
                        'pccsharedtestcodepipelinePipelineArtifactsBucketEncryptionKey3CA0A728',
                        'Arn'
                    ]
                }
            }
        },
        pccsharedtestnotificationruletopic0AF49361: {Type: 'AWS::SNS::Topic'},
        pccsharedtestnotificationruletopicadminexampleeduBB0C5B11: {
            Type: 'AWS::SNS::Subscription',
            Properties: {
                Protocol: 'email',
                TopicArn: {Ref: 'pccsharedtestnotificationruletopic0AF49361'},
                Endpoint: 'admin@example.edu'
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