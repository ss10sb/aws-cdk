import {App, Stack} from "aws-cdk-lib";
import {CodePipelineCodestarSource, CodePipelinePipeline, CodePipelineSynthStep} from "../../src/pipeline";
import {ConfigEnvironments} from "../../src/config";
import {EcrRepositories, EcrRepositoryFactory, EcrRepositoryType} from "../../src/ecr";
import {TemplateHelper} from "../../src/utils/testing";
import {Match, Template} from "aws-cdk-lib/assertions";

describe('code pipeline pipeline', () => {

    it('should create a code pipeline', () => {
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
        const repositories = new EcrRepositories(stack.node.id, baseBuildConfig.Parameters.repositories);
        new CodePipelinePipeline(stack, stack.node.id, {
            source: codeStarSource,
            synth: synthStep,
            repositoryFactory: new EcrRepositoryFactory(stack, stack.node.id, repositories)
        });
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        templateHelper.expected('AWS::IAM::Role',  [
            {
                key: 'stacksynthsteprole',
                properties: Match.objectEquals({
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
                })
            },
            {
                key: 'stackcodepipelinePipelineRole',
                properties: Match.objectEquals({
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
                })
            },
            {
                key: 'stackcodepipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRole',
                properties: Match.objectEquals({
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
                })
            },
            {
                key: 'stackcodepipelinePipelineBuildstacksynthstepCodePipelineActionRole',
                properties: Match.objectEquals({
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
                })
            },
            {
                key: 'stackcodepipelinePipelineUpdatePipelineSelfMutateCodePipelineActionRole',
                properties: Match.objectEquals({
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
                })
            },
            {
                key: 'stackcodepipelineUpdatePipelineSelfMutationRole',
                properties: Match.objectEquals({
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
                })
            }
        ]);
        templateHelper.expected('AWS::IAM::Policy',  [
            {
                key: 'stacksynthsteproleDefaultPolicy',
                properties: Match.objectEquals({
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
                                                        Ref: templateHelper.startsWithMatch('stackcodepipelinePipelineBuildstacksynthstepCdkBuildProject')
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
                                                        Ref: templateHelper.startsWithMatch('stackcodepipelinePipelineBuildstacksynthstepCdkBuildProject')
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
                                                    Ref: templateHelper.startsWithMatch('stackcodepipelinePipelineBuildstacksynthstepCdkBuildProject')
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
                                                templateHelper.startsWithMatch('stackcodepipelinePipelineArtifactsBucket'),
                                                'Arn'
                                            ]
                                        },
                                        {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    {
                                                        'Fn::GetAtt': [
                                                            templateHelper.startsWithMatch('stackcodepipelinePipelineArtifactsBucket'),
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
                                            templateHelper.startsWithMatch('stackcodepipelinePipelineArtifactsBucketEncryptionKey'),
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
                                            templateHelper.startsWithMatch('stackcodepipelinePipelineArtifactsBucketEncryptionKey'),
                                            'Arn'
                                        ]
                                    }
                                }
                            ],
                            Version: '2012-10-17'
                        },
                        PolicyName: templateHelper.startsWithMatch('stacksynthsteproleDefaultPolicy'),
                        Roles: [{Ref: templateHelper.startsWithMatch('stacksynthsteprole')}]
                    }
                })
            },
            {
                key: 'stackcodepipelinePipelineRoleDefaultPolicy',
                properties: Match.objectEquals({
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
                                                templateHelper.startsWithMatch('stackcodepipelinePipelineArtifactsBucket'),
                                                'Arn'
                                            ]
                                        },
                                        {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    {
                                                        'Fn::GetAtt': [
                                                            templateHelper.startsWithMatch('stackcodepipelinePipelineArtifactsBucket'),
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
                                            templateHelper.startsWithMatch('stackcodepipelinePipelineArtifactsBucketEncryptionKey'),
                                            'Arn'
                                        ]
                                    }
                                },
                                {
                                    Action: 'sts:AssumeRole',
                                    Effect: 'Allow',
                                    Resource: {
                                        'Fn::GetAtt': [
                                            templateHelper.startsWithMatch('stackcodepipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRole'),
                                            'Arn'
                                        ]
                                    }
                                },
                                {
                                    Action: 'sts:AssumeRole',
                                    Effect: 'Allow',
                                    Resource: {
                                        'Fn::GetAtt': [
                                            templateHelper.startsWithMatch('stackcodepipelinePipelineBuildstacksynthstepCodePipelineActionRole'),
                                            'Arn'
                                        ]
                                    }
                                },
                                {
                                    Action: 'sts:AssumeRole',
                                    Effect: 'Allow',
                                    Resource: {
                                        'Fn::GetAtt': [
                                            templateHelper.startsWithMatch('stackcodepipelinePipelineUpdatePipelineSelfMutateCodePipelineActionRole'),
                                            'Arn'
                                        ]
                                    }
                                }
                            ],
                            Version: '2012-10-17'
                        },
                        PolicyName: templateHelper.startsWithMatch('stackcodepipelinePipelineRoleDefaultPolicy'),
                        Roles: [{Ref: templateHelper.startsWithMatch('stackcodepipelinePipelineRole')}]
                    }
                })
            },
            {
                key: 'stackcodepipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRoleDefaultPolicy',
                properties: Match.objectEquals({
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
                                                templateHelper.startsWithMatch('stackcodepipelinePipelineArtifactsBucket'),
                                                'Arn'
                                            ]
                                        },
                                        {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    {
                                                        'Fn::GetAtt': [
                                                            templateHelper.startsWithMatch('stackcodepipelinePipelineArtifactsBucket'),
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
                                            templateHelper.startsWithMatch('stackcodepipelinePipelineArtifactsBucketEncryptionKey'),
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
                                                        templateHelper.startsWithMatch('stackcodepipelinePipelineArtifactsBucket'),
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
                        PolicyName: templateHelper.startsWithMatch('stackcodepipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRoleDefaultPolicy'),
                        Roles: [
                            {
                                Ref: templateHelper.startsWithMatch('stackcodepipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRole')
                            }
                        ]
                    }
                })
            },
            {
                key: 'stackcodepipelinePipelineBuildstacksynthstepCodePipelineActionRoleDefaultPolicy',
                properties: Match.objectEquals({
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
                                            templateHelper.startsWithMatch('stackcodepipelinePipelineBuildstacksynthstepCdkBuildProject'),
                                            'Arn'
                                        ]
                                    }
                                }
                            ],
                            Version: '2012-10-17'
                        },
                        PolicyName: templateHelper.startsWithMatch('stackcodepipelinePipelineBuildstacksynthstepCodePipelineActionRoleDefaultPolicy'),
                        Roles: [
                            {
                                Ref: templateHelper.startsWithMatch('stackcodepipelinePipelineBuildstacksynthstepCodePipelineActionRole')
                            }
                        ]
                    }
                })
            },
            {
                key: 'stackcodepipelinePipelineUpdatePipelineSelfMutateCodePipelineActionRoleDefaultPolicy',
                properties: Match.objectEquals({
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
                                            templateHelper.startsWithMatch('stackcodepipelineUpdatePipelineSelfMutation'),
                                            'Arn'
                                        ]
                                    }
                                }
                            ],
                            Version: '2012-10-17'
                        },
                        PolicyName: templateHelper.startsWithMatch('stackcodepipelinePipelineUpdatePipelineSelfMutateCodePipelineActionRoleDefaultPolicy'),
                        Roles: [
                            {
                                Ref: templateHelper.startsWithMatch('stackcodepipelinePipelineUpdatePipelineSelfMutateCodePipelineActionRole')
                            }
                        ]
                    }
                })
            },
            {
                key: 'stackcodepipelineUpdatePipelineSelfMutationRoleDefaultPolicy',
                properties: Match.objectEquals({
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
                                                        Ref: templateHelper.startsWithMatch('stackcodepipelineUpdatePipelineSelfMutation')
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
                                                        Ref: templateHelper.startsWithMatch('stackcodepipelineUpdatePipelineSelfMutation')
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
                                                    Ref: templateHelper.startsWithMatch('stackcodepipelineUpdatePipelineSelfMutation')
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
                                                templateHelper.startsWithMatch('stackcodepipelinePipelineArtifactsBucket'),
                                                'Arn'
                                            ]
                                        },
                                        {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    {
                                                        'Fn::GetAtt': [
                                                            templateHelper.startsWithMatch('stackcodepipelinePipelineArtifactsBucket'),
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
                                            templateHelper.startsWithMatch('stackcodepipelinePipelineArtifactsBucketEncryptionKey'),
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
                                            templateHelper.startsWithMatch('stackcodepipelinePipelineArtifactsBucketEncryptionKey'),
                                            'Arn'
                                        ]
                                    }
                                }
                            ],
                            Version: '2012-10-17'
                        },
                        PolicyName: templateHelper.startsWithMatch('stackcodepipelineUpdatePipelineSelfMutationRoleDefaultPolicy'),
                        Roles: [
                            {
                                Ref: templateHelper.startsWithMatch('stackcodepipelineUpdatePipelineSelfMutationRole')
                            }
                        ]
                    }
                })
            }
        ]);
        templateHelper.expected('AWS::KMS::Key',  [
            {
                key: 'stackcodepipelinePipelineArtifactsBucketEncryptionKey',
                properties: Match.objectEquals({
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
                })
            }
        ]);
        templateHelper.expected('AWS::KMS::Alias',  [
            {
                key: 'stackcodepipelinePipelineArtifactsBucketEncryptionKeyAlias',
                properties: Match.objectEquals({
                    Type: 'AWS::KMS::Alias',
                    Properties: {
                        AliasName: templateHelper.startsWithMatch('alias/codepipeline-stackstackcodepipelinepipeline'),
                        TargetKeyId: {
                            'Fn::GetAtt': [
                                templateHelper.startsWithMatch('stackcodepipelinePipelineArtifactsBucketEncryptionKey'),
                                'Arn'
                            ]
                        }
                    },
                    UpdateReplacePolicy: 'Delete',
                    DeletionPolicy: 'Delete'
                })
            }
        ]);
        templateHelper.expected('AWS::S3::Bucket',  [
            {
                key: 'stackcodepipelinePipelineArtifactsBucket',
                properties: Match.objectEquals({
                    Type: 'AWS::S3::Bucket',
                    Properties: {
                        BucketEncryption: {
                            ServerSideEncryptionConfiguration: [
                                {
                                    ServerSideEncryptionByDefault: {
                                        KMSMasterKeyID: {
                                            'Fn::GetAtt': [
                                                templateHelper.startsWithMatch('stackcodepipelinePipelineArtifactsBucketEncryptionKey'),
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
                })
            }
        ]);
        templateHelper.expected('AWS::S3::BucketPolicy',  [
            {
                key: 'stackcodepipelinePipelineArtifactsBucketPolicy',
                properties: Match.objectEquals({
                    Type: 'AWS::S3::BucketPolicy',
                    Properties: {
                        Bucket: {Ref: templateHelper.startsWithMatch('stackcodepipelinePipelineArtifactsBucket')},
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
                                                templateHelper.startsWithMatch('stackcodepipelinePipelineArtifactsBucket'),
                                                'Arn'
                                            ]
                                        },
                                        {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    {
                                                        'Fn::GetAtt': [
                                                            templateHelper.startsWithMatch('stackcodepipelinePipelineArtifactsBucket'),
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
                })
            }
        ]);
        templateHelper.expected('AWS::CodePipeline::Pipeline',  [
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
                            }
                        ],
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
                            Location: {Ref: templateHelper.startsWithMatch('stackcodepipelinePipelineArtifactsBucket')},
                            Type: 'S3'
                        },
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
        templateHelper.expected('AWS::CodeBuild::Project',  [
            {
                key: 'stackcodepipelinePipelineBuildstacksynthstepCdkBuildProject',
                properties: Match.objectEquals({
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
                        ServiceRole: {'Fn::GetAtt': [templateHelper.startsWithMatch('stacksynthsteprole'), 'Arn']},
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
                        Description: 'Pipeline step stack/Pipeline/Build/stack-synth-step',
                        EncryptionKey: {
                            'Fn::GetAtt': [
                                templateHelper.startsWithMatch('stackcodepipelinePipelineArtifactsBucketEncryptionKey'),
                                'Arn'
                            ]
                        }
                    }
                })
            },
            {
                key: 'stackcodepipelineUpdatePipelineSelfMutation',
                properties: Match.objectEquals({
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
                                templateHelper.startsWithMatch('stackcodepipelineUpdatePipelineSelfMutationRole'),
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
                        },
                        Cache: {Type: 'NO_CACHE'},
                        Description: 'Pipeline step stack/Pipeline/UpdatePipeline/SelfMutate',
                        EncryptionKey: {
                            'Fn::GetAtt': [
                                templateHelper.startsWithMatch('stackcodepipelinePipelineArtifactsBucketEncryptionKey'),
                                'Arn'
                            ]
                        },
                        Name: 'stack-code-pipeline-selfupdate'
                    }
                })
            }
        ]);
    });
});