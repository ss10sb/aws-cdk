const {Match} = require("aws-cdk-lib/assertions");
module.exports = {
    Resources: {
        buildlambdabuildsteproleE9EE6387: {
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
        buildlambdabuildsteproleDefaultPolicyFC299D82: {
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
                                                Ref: 'pipelinecodepipelinePipelineBuildbuildbuildstepB76B66EB'
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
                                                Ref: 'pipelinecodepipelinePipelineBuildbuildbuildstepB76B66EB'
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
                                            Ref: 'pipelinecodepipelinePipelineBuildbuildbuildstepB76B66EB'
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
                                        'pipelinecodepipelinePipelineArtifactsBucket584C21F7',
                                        'Arn'
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [
                                                    'pipelinecodepipelinePipelineArtifactsBucket584C21F7',
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
                                    'pipelinecodepipelinePipelineArtifactsBucketEncryptionKeyE0C1D3A5',
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
                                    'pipelinecodepipelinePipelineArtifactsBucketEncryptionKeyE0C1D3A5',
                                    'Arn'
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'buildlambdabuildsteproleDefaultPolicyFC299D82',
                Roles: [{Ref: 'buildlambdabuildsteproleE9EE6387'}]
            }
        },
        synthsynthsteproleBD6F73A4: {
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
        synthsynthsteproleDefaultPolicyE7FED82F: {
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
                                                Ref: 'pipelinecodepipelinePipelineBuildsynthsynthstepCdkBuildProjectA8521E6B'
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
                                                Ref: 'pipelinecodepipelinePipelineBuildsynthsynthstepCdkBuildProjectA8521E6B'
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
                                            Ref: 'pipelinecodepipelinePipelineBuildsynthsynthstepCdkBuildProjectA8521E6B'
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
                                        'pipelinecodepipelinePipelineArtifactsBucket584C21F7',
                                        'Arn'
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [
                                                    'pipelinecodepipelinePipelineArtifactsBucket584C21F7',
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
                                    'pipelinecodepipelinePipelineArtifactsBucketEncryptionKeyE0C1D3A5',
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
                                    'pipelinecodepipelinePipelineArtifactsBucketEncryptionKeyE0C1D3A5',
                                    'Arn'
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'synthsynthsteproleDefaultPolicyE7FED82F',
                Roles: [{Ref: 'synthsynthsteproleBD6F73A4'}]
            }
        },
        pipelinecodepipelinePipelineArtifactsBucketEncryptionKeyE0C1D3A5: {
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
        pipelinecodepipelinePipelineArtifactsBucketEncryptionKeyAlias2A99F16D: {
            Type: 'AWS::KMS::Alias',
            Properties: {
                AliasName: 'alias/codepipeline-stackpipelinecodepipelinepipelinee9513b46',
                TargetKeyId: {
                    'Fn::GetAtt': [
                        'pipelinecodepipelinePipelineArtifactsBucketEncryptionKeyE0C1D3A5',
                        'Arn'
                    ]
                }
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pipelinecodepipelinePipelineArtifactsBucket584C21F7: {
            Type: 'AWS::S3::Bucket',
            Properties: {
                BucketEncryption: {
                    ServerSideEncryptionConfiguration: [
                        {
                            ServerSideEncryptionByDefault: {
                                KMSMasterKeyID: {
                                    'Fn::GetAtt': [
                                        'pipelinecodepipelinePipelineArtifactsBucketEncryptionKeyE0C1D3A5',
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
        pipelinecodepipelinePipelineArtifactsBucketPolicy8E568170: {
            Type: 'AWS::S3::BucketPolicy',
            Properties: {
                Bucket: {
                    Ref: 'pipelinecodepipelinePipelineArtifactsBucket584C21F7'
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
                                        'pipelinecodepipelinePipelineArtifactsBucket584C21F7',
                                        'Arn'
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [
                                                    'pipelinecodepipelinePipelineArtifactsBucket584C21F7',
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
        pipelinecodepipelinePipelineRoleCE72FCDC: {
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
        pipelinecodepipelinePipelineRoleDefaultPolicy91377819: {
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
                                        'pipelinecodepipelinePipelineArtifactsBucket584C21F7',
                                        'Arn'
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [
                                                    'pipelinecodepipelinePipelineArtifactsBucket584C21F7',
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
                                    'pipelinecodepipelinePipelineArtifactsBucketEncryptionKeyE0C1D3A5',
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'pipelinecodepipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRoleEC6D53D7',
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'pipelinecodepipelineCodeBuildActionRoleD00A2C1F',
                                    'Arn'
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pipelinecodepipelinePipelineRoleDefaultPolicy91377819',
                Roles: [{Ref: 'pipelinecodepipelinePipelineRoleCE72FCDC'}]
            }
        },
        pipelinecodepipelinePipeline682A7EE4: {
            Type: 'AWS::CodePipeline::Pipeline',
            Properties: {
                ArtifactStore: {
                    EncryptionKey: {
                        Id: {
                            'Fn::GetAtt': [
                                'pipelinecodepipelinePipelineArtifactsBucketEncryptionKeyE0C1D3A5',
                                'Arn'
                            ]
                        },
                        Type: 'KMS'
                    },
                    Location: {
                        Ref: 'pipelinecodepipelinePipelineArtifactsBucket584C21F7'
                    },
                    Type: 'S3'
                },
                Name: 'pipeline-code-pipeline',
                PipelineType: 'V1',
                RestartExecutionOnUpdate: true,
                RoleArn: {
                    'Fn::GetAtt': ['pipelinecodepipelinePipelineRoleCE72FCDC', 'Arn']
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
                                    BranchName: 'foo',
                                    DetectChanges: true
                                },
                                Name: 'repoOwner_repoName',
                                OutputArtifacts: [{Name: 'repoOwner_repoName_Source'}],
                                RoleArn: {
                                    'Fn::GetAtt': [
                                        'pipelinecodepipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRoleEC6D53D7',
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
                                        Ref: 'pipelinecodepipelinePipelineBuildbuildbuildstepB76B66EB'
                                    },
                                    EnvironmentVariables: Match.anyValue(),
                                },
                                InputArtifacts: [{Name: 'repoOwner_repoName_Source'}],
                                Name: 'build-build-step',
                                OutputArtifacts: [{Name: 'build_build_step_Output'}],
                                RoleArn: {
                                    'Fn::GetAtt': [
                                        'pipelinecodepipelineCodeBuildActionRoleD00A2C1F',
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
                                        Ref: 'pipelinecodepipelinePipelineBuildsynthsynthstepCdkBuildProjectA8521E6B'
                                    },
                                    EnvironmentVariables: Match.anyValue(),
                                },
                                InputArtifacts: [{Name: 'build_build_step_Output'}],
                                Name: 'synth-synth-step',
                                OutputArtifacts: [{Name: 'synth_synth_step_Output'}],
                                RoleArn: {
                                    'Fn::GetAtt': [
                                        'pipelinecodepipelineCodeBuildActionRoleD00A2C1F',
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
                                        Ref: 'pipelinecodepipelineUpdatePipelineSelfMutation85999C79'
                                    },
                                    EnvironmentVariables: Match.anyValue(),
                                },
                                InputArtifacts: [{Name: 'synth_synth_step_Output'}],
                                Name: 'SelfMutate',
                                RoleArn: {
                                    'Fn::GetAtt': [
                                        'pipelinecodepipelineCodeBuildActionRoleD00A2C1F',
                                        'Arn'
                                    ]
                                },
                                RunOrder: 1
                            }
                        ],
                        Name: 'UpdatePipeline'
                    }
                ]
            },
            DependsOn: [
                'pipelinecodepipelinePipelineRoleDefaultPolicy91377819',
                'pipelinecodepipelinePipelineRoleCE72FCDC'
            ]
        },
        pipelinecodepipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRoleEC6D53D7: {
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
        pipelinecodepipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRoleDefaultPolicy017E1A6C: {
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
                                        'pipelinecodepipelinePipelineArtifactsBucket584C21F7',
                                        'Arn'
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [
                                                    'pipelinecodepipelinePipelineArtifactsBucket584C21F7',
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
                                    'pipelinecodepipelinePipelineArtifactsBucketEncryptionKeyE0C1D3A5',
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
                                                'pipelinecodepipelinePipelineArtifactsBucket584C21F7',
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
                PolicyName: 'pipelinecodepipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRoleDefaultPolicy017E1A6C',
                Roles: [
                    {
                        Ref: 'pipelinecodepipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRoleEC6D53D7'
                    }
                ]
            }
        },
        pipelinecodepipelinePipelineBuildbuildbuildstepB76B66EB: {
            Type: 'AWS::CodeBuild::Project',
            Properties: {
                Artifacts: {Type: 'CODEPIPELINE'},
                Cache: {Type: 'NO_CACHE'},
                Description: 'Pipeline step stack/Pipeline/Build/build-build-step',
                EncryptionKey: {
                    'Fn::GetAtt': [
                        'pipelinecodepipelinePipelineArtifactsBucketEncryptionKeyE0C1D3A5',
                        'Arn'
                    ]
                },
                Environment: {
                    ComputeType: 'BUILD_GENERAL1_SMALL',
                    Image: 'aws/codebuild/standard:7.0',
                    ImagePullCredentialsType: 'CODEBUILD',
                    PrivilegedMode: true,
                    Type: 'LINUX_CONTAINER'
                },
                ServiceRole: {
                    'Fn::GetAtt': ['buildlambdabuildsteproleE9EE6387', 'Arn']
                },
                Source: {
                    BuildSpec: '{\n' +
                        '  "phases": {\n' +
                        '    "install": {\n' +
                        '      "runtime-versions": {\n' +
                        '        "php": "8.3"\n' +
                        '      },\n' +
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
                        '        "cp .env.example .env",\n' +
                        '        "composer install --ignore-platform-reqs --no-ansi --no-autoloader --no-dev --no-interaction --no-progress",\n' +
                        '        "composer dump-autoload --optimize --classmap-authoritative",\n' +
                        '        "php artisan route:cache",\n' +
                        '        "rm -rf vendor/bin",\n' +
                        '        "rm -f .env",\n' +
                        '        "npm ci",\n' +
                        '        "npm run prod",\n' +
                        '        "rm -rf node_modules tests",\n' +
                        '        "cd .."\n' +
                        '      ]\n' +
                        '    }\n' +
                        '  },\n' +
                        '  "version": "0.2",\n' +
                        '  "artifacts": {\n' +
                        '    "base-directory": "./",\n' +
                        '    "files": [\n' +
                        '      "**/*"\n' +
                        '    ]\n' +
                        '  }\n' +
                        '}',
                    Type: 'CODEPIPELINE'
                }
            }
        },
        pipelinecodepipelinePipelineBuildsynthsynthstepCdkBuildProjectA8521E6B: {
            Type: 'AWS::CodeBuild::Project',
            Properties: {
                Artifacts: {Type: 'CODEPIPELINE'},
                Cache: {Type: 'NO_CACHE'},
                Description: 'Pipeline step stack/Pipeline/Build/synth-synth-step',
                EncryptionKey: {
                    'Fn::GetAtt': [
                        'pipelinecodepipelinePipelineArtifactsBucketEncryptionKeyE0C1D3A5',
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
                ServiceRole: {'Fn::GetAtt': ['synthsynthsteproleBD6F73A4', 'Arn']},
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
                }
            }
        },
        pipelinecodepipelineCodeBuildActionRoleD00A2C1F: {
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
                                        'pipelinecodepipelinePipelineRoleCE72FCDC',
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
        pipelinecodepipelineCodeBuildActionRoleDefaultPolicyE54BC770: {
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
                                    'pipelinecodepipelinePipelineBuildbuildbuildstepB76B66EB',
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
                                    'pipelinecodepipelinePipelineBuildsynthsynthstepCdkBuildProjectA8521E6B',
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
                                    'pipelinecodepipelineUpdatePipelineSelfMutation85999C79',
                                    'Arn'
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pipelinecodepipelineCodeBuildActionRoleDefaultPolicyE54BC770',
                Roles: [
                    {Ref: 'pipelinecodepipelineCodeBuildActionRoleD00A2C1F'}
                ]
            }
        },
        pipelinecodepipelineUpdatePipelineSelfMutationRoleFF406EEC: {
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
        pipelinecodepipelineUpdatePipelineSelfMutationRoleDefaultPolicyBDBBD082: {
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
                                                Ref: 'pipelinecodepipelineUpdatePipelineSelfMutation85999C79'
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
                                                Ref: 'pipelinecodepipelineUpdatePipelineSelfMutation85999C79'
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
                                            Ref: 'pipelinecodepipelineUpdatePipelineSelfMutation85999C79'
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
                                        'pipelinecodepipelinePipelineArtifactsBucket584C21F7',
                                        'Arn'
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [
                                                    'pipelinecodepipelinePipelineArtifactsBucket584C21F7',
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
                                    'pipelinecodepipelinePipelineArtifactsBucketEncryptionKeyE0C1D3A5',
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
                                    'pipelinecodepipelinePipelineArtifactsBucketEncryptionKeyE0C1D3A5',
                                    'Arn'
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pipelinecodepipelineUpdatePipelineSelfMutationRoleDefaultPolicyBDBBD082',
                Roles: [
                    {
                        Ref: 'pipelinecodepipelineUpdatePipelineSelfMutationRoleFF406EEC'
                    }
                ]
            }
        },
        pipelinecodepipelineUpdatePipelineSelfMutation85999C79: {
            Type: 'AWS::CodeBuild::Project',
            Properties: {
                Artifacts: {Type: 'CODEPIPELINE'},
                Cache: {Type: 'NO_CACHE'},
                Description: 'Pipeline step stack/Pipeline/UpdatePipeline/SelfMutate',
                EncryptionKey: {
                    'Fn::GetAtt': [
                        'pipelinecodepipelinePipelineArtifactsBucketEncryptionKeyE0C1D3A5',
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
                Name: 'pipeline-code-pipeline-selfupdate',
                ServiceRole: {
                    'Fn::GetAtt': [
                        'pipelinecodepipelineUpdatePipelineSelfMutationRoleFF406EEC',
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
                        '        "cdk -a . deploy stack --require-approval=never --verbose"\n' +
                        '      ]\n' +
                        '    }\n' +
                        '  }\n' +
                        '}',
                    Type: 'CODEPIPELINE'
                }
            }
        }
    }
}