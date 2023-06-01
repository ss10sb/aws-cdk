const {Match} = require("aws-cdk-lib/assertions");
module.exports = {
    Resources: {
        repoBEC318EA: {
            Type: 'AWS::ECR::Repository',
            UpdateReplacePolicy: 'Retain',
            DeletionPolicy: 'Retain'
        },
        stackecrsteproleA96EA46E: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: { Service: 'codebuild.amazonaws.com' }
                        }
                    ],
                    Version: '2012-10-17'
                }
            }
        },
        stackecrsteproleDefaultPolicy6EC74578: {
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
                                            { Ref: 'AWS::Partition' },
                                            ':logs:us-pipeline:123pipeline:log-group:/aws/codebuild/',
                                            {
                                                Ref: 'pipelinePipelineecrbuildsomethingecrstepEA7F14E6'
                                            }
                                        ]
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            { Ref: 'AWS::Partition' },
                                            ':logs:us-pipeline:123pipeline:log-group:/aws/codebuild/',
                                            {
                                                Ref: 'pipelinePipelineecrbuildsomethingecrstepEA7F14E6'
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
                                        { Ref: 'AWS::Partition' },
                                        ':codebuild:us-pipeline:123pipeline:report-group/',
                                        {
                                            Ref: 'pipelinePipelineecrbuildsomethingecrstepEA7F14E6'
                                        },
                                        '-*'
                                    ]
                                ]
                            }
                        },
                        {
                            Action: [ 's3:GetObject*', 's3:GetBucket*', 's3:List*' ],
                            Effect: 'Allow',
                            Resource: [
                                {
                                    'Fn::GetAtt': [
                                        'pipelinePipelineArtifactsBucketC2CD5B5E',
                                        'Arn'
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [
                                                    'pipelinePipelineArtifactsBucketC2CD5B5E',
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
                },
                PolicyName: 'stackecrsteproleDefaultPolicy6EC74578',
                Roles: [ { Ref: 'stackecrsteproleA96EA46E' } ]
            }
        },
        pipelinePipelineArtifactsBucketC2CD5B5E: {
            Type: 'AWS::S3::Bucket',
            Properties: {
                BucketEncryption: {
                    ServerSideEncryptionConfiguration: [
                        {
                            ServerSideEncryptionByDefault: { SSEAlgorithm: 'aws:kms' }
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
        pipelinePipelineArtifactsBucketPolicy10A41055: {
            Type: 'AWS::S3::BucketPolicy',
            Properties: {
                Bucket: { Ref: 'pipelinePipelineArtifactsBucketC2CD5B5E' },
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 's3:*',
                            Condition: { Bool: { 'aws:SecureTransport': 'false' } },
                            Effect: 'Deny',
                            Principal: { AWS: '*' },
                            Resource: [
                                {
                                    'Fn::GetAtt': [
                                        'pipelinePipelineArtifactsBucketC2CD5B5E',
                                        'Arn'
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [
                                                    'pipelinePipelineArtifactsBucketC2CD5B5E',
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
        pipelinePipelineRole7016E5DF: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: { Service: 'codepipeline.amazonaws.com' }
                        }
                    ],
                    Version: '2012-10-17'
                }
            }
        },
        pipelinePipelineRoleDefaultPolicy16010F3E: {
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
                                        'pipelinePipelineArtifactsBucketC2CD5B5E',
                                        'Arn'
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [
                                                    'pipelinePipelineArtifactsBucketC2CD5B5E',
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
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'pipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRoleFA3ACF67',
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [ 'pipelineCodeBuildActionRole4D1FDB53', 'Arn' ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pipelinePipelineRoleDefaultPolicy16010F3E',
                Roles: [ { Ref: 'pipelinePipelineRole7016E5DF' } ]
            }
        },
        pipelinePipeline4163A4B1: {
            Type: 'AWS::CodePipeline::Pipeline',
            Properties: {
                RoleArn: { 'Fn::GetAtt': [ 'pipelinePipelineRole7016E5DF', 'Arn' ] },
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
                                OutputArtifacts: [ { Name: 'repoOwner_repoName_Source' } ],
                                RoleArn: {
                                    'Fn::GetAtt': [
                                        'pipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRoleFA3ACF67',
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
                                        Ref: 'pipelinePipelineBuildsynthCdkBuildProject2CCFF688'
                                    },
                                    EnvironmentVariables: Match.stringLikeRegexp('\[\{"name":"_PROJECT_CONFIG_HASH","type":"PLAINTEXT","value":"[^"]*"\}\]')
                                },
                                InputArtifacts: [ { Name: 'repoOwner_repoName_Source' } ],
                                Name: 'synth',
                                OutputArtifacts: [ { Name: 'synth_Output' } ],
                                RoleArn: {
                                    'Fn::GetAtt': [ 'pipelineCodeBuildActionRole4D1FDB53', 'Arn' ]
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
                                        Ref: 'pipelineUpdatePipelineSelfMutation14A96D2F'
                                    },
                                    EnvironmentVariables: Match.stringLikeRegexp('\[\{"name":"_PROJECT_CONFIG_HASH","type":"PLAINTEXT","value":"[^"]*"\}\]')
                                },
                                InputArtifacts: [ { Name: 'synth_Output' } ],
                                Name: 'SelfMutate',
                                RoleArn: {
                                    'Fn::GetAtt': [ 'pipelineCodeBuildActionRole4D1FDB53', 'Arn' ]
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
                                        Ref: 'pipelinePipelineecrbuildsomethingecrstepEA7F14E6'
                                    }
                                },
                                InputArtifacts: [ { Name: 'repoOwner_repoName_Source' } ],
                                Name: 'build-something-ecr-step',
                                RoleArn: {
                                    'Fn::GetAtt': [ 'pipelineCodeBuildActionRole4D1FDB53', 'Arn' ]
                                },
                                RunOrder: 1
                            }
                        ],
                        Name: 'ecr'
                    }
                ],
                ArtifactStore: {
                    Location: { Ref: 'pipelinePipelineArtifactsBucketC2CD5B5E' },
                    Type: 'S3'
                },
                RestartExecutionOnUpdate: true
            },
            DependsOn: [
                'pipelinePipelineRoleDefaultPolicy16010F3E',
                'pipelinePipelineRole7016E5DF'
            ]
        },
        pipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRoleFA3ACF67: {
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
                                            { Ref: 'AWS::Partition' },
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
        pipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRoleDefaultPolicyBE5A6722: {
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
                                        'pipelinePipelineArtifactsBucketC2CD5B5E',
                                        'Arn'
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [
                                                    'pipelinePipelineArtifactsBucketC2CD5B5E',
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
                            Action: [ 's3:PutObjectAcl', 's3:PutObjectVersionAcl' ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        {
                                            'Fn::GetAtt': [
                                                'pipelinePipelineArtifactsBucketC2CD5B5E',
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
                PolicyName: 'pipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRoleDefaultPolicyBE5A6722',
                Roles: [
                    {
                        Ref: 'pipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRoleFA3ACF67'
                    }
                ]
            }
        },
        pipelinePipelineBuildsynthCdkBuildProjectRole540A6912: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: { Service: 'codebuild.amazonaws.com' }
                        }
                    ],
                    Version: '2012-10-17'
                }
            }
        },
        pipelinePipelineBuildsynthCdkBuildProjectRoleDefaultPolicyD900621D: {
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
                                            { Ref: 'AWS::Partition' },
                                            ':logs:us-pipeline:123pipeline:log-group:/aws/codebuild/',
                                            {
                                                Ref: 'pipelinePipelineBuildsynthCdkBuildProject2CCFF688'
                                            }
                                        ]
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            { Ref: 'AWS::Partition' },
                                            ':logs:us-pipeline:123pipeline:log-group:/aws/codebuild/',
                                            {
                                                Ref: 'pipelinePipelineBuildsynthCdkBuildProject2CCFF688'
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
                                        { Ref: 'AWS::Partition' },
                                        ':codebuild:us-pipeline:123pipeline:report-group/',
                                        {
                                            Ref: 'pipelinePipelineBuildsynthCdkBuildProject2CCFF688'
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
                                        'pipelinePipelineArtifactsBucketC2CD5B5E',
                                        'Arn'
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [
                                                    'pipelinePipelineArtifactsBucketC2CD5B5E',
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
                },
                PolicyName: 'pipelinePipelineBuildsynthCdkBuildProjectRoleDefaultPolicyD900621D',
                Roles: [
                    {
                        Ref: 'pipelinePipelineBuildsynthCdkBuildProjectRole540A6912'
                    }
                ]
            }
        },
        pipelinePipelineBuildsynthCdkBuildProject2CCFF688: {
            Type: 'AWS::CodeBuild::Project',
            Properties: {
                Artifacts: { Type: 'CODEPIPELINE' },
                Environment: {
                    ComputeType: 'BUILD_GENERAL1_SMALL',
                    Image: 'aws/codebuild/standard:6.0',
                    ImagePullCredentialsType: 'CODEBUILD',
                    PrivilegedMode: false,
                    Type: 'LINUX_CONTAINER'
                },
                ServiceRole: {
                    'Fn::GetAtt': [
                        'pipelinePipelineBuildsynthCdkBuildProjectRole540A6912',
                        'Arn'
                    ]
                },
                Source: {
                    BuildSpec: '{\n' +
                        '  "version": "0.2",\n' +
                        '  "phases": {\n' +
                        '    "build": {\n' +
                        '      "commands": [\n' +
                        '        "npm"\n' +
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
                Cache: { Type: 'NO_CACHE' },
                Description: 'Pipeline step stack/Pipeline/Build/synth',
                EncryptionKey: 'alias/aws/s3'
            }
        },
        pipelinePipelineecrbuildsomethingecrstepEA7F14E6: {
            Type: 'AWS::CodeBuild::Project',
            Properties: {
                Artifacts: { Type: 'CODEPIPELINE' },
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
                                                            'Fn::GetAtt': [ 'repoBEC318EA', 'Arn' ]
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
                                                            'Fn::GetAtt': [ 'repoBEC318EA', 'Arn' ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        '.',
                                        { Ref: 'AWS::URLSuffix' },
                                        '/',
                                        { Ref: 'repoBEC318EA' }
                                    ]
                                ]
                            }
                        },
                        {
                            Name: 'DOCKER_NAME',
                            Type: 'PLAINTEXT',
                            Value: 'build-something'
                        },
                        { Name: 'IMAGE_TAG', Type: 'PLAINTEXT', Value: '1' },
                        {
                            Name: 'ECR_REGION',
                            Type: 'PLAINTEXT',
                            Value: 'us-pipeline'
                        }
                    ],
                    Image: 'aws/codebuild/standard:5.0',
                    ImagePullCredentialsType: 'CODEBUILD',
                    PrivilegedMode: true,
                    Type: 'LINUX_CONTAINER'
                },
                ServiceRole: { 'Fn::GetAtt': [ 'stackecrsteproleA96EA46E', 'Arn' ] },
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
                },
                Cache: { Type: 'NO_CACHE' },
                Description: 'Pipeline step stack/Pipeline/ecr/build-something-ecr-step',
                EncryptionKey: 'alias/aws/s3'
            }
        },
        pipelineCodeBuildActionRole4D1FDB53: {
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
                                        'pipelinePipelineRole7016E5DF',
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
        pipelineCodeBuildActionRoleDefaultPolicyE3C51929: {
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
                                    'pipelinePipelineBuildsynthCdkBuildProject2CCFF688',
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
                                    'pipelineUpdatePipelineSelfMutation14A96D2F',
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
                                    'pipelinePipelineecrbuildsomethingecrstepEA7F14E6',
                                    'Arn'
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pipelineCodeBuildActionRoleDefaultPolicyE3C51929',
                Roles: [ { Ref: 'pipelineCodeBuildActionRole4D1FDB53' } ]
            }
        },
        pipelineUpdatePipelineSelfMutationRole91820177: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: { Service: 'codebuild.amazonaws.com' }
                        }
                    ],
                    Version: '2012-10-17'
                }
            }
        },
        pipelineUpdatePipelineSelfMutationRoleDefaultPolicy095404B8: {
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
                                            { Ref: 'AWS::Partition' },
                                            ':logs:us-pipeline:123pipeline:log-group:/aws/codebuild/',
                                            {
                                                Ref: 'pipelineUpdatePipelineSelfMutation14A96D2F'
                                            }
                                        ]
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            { Ref: 'AWS::Partition' },
                                            ':logs:us-pipeline:123pipeline:log-group:/aws/codebuild/',
                                            {
                                                Ref: 'pipelineUpdatePipelineSelfMutation14A96D2F'
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
                                        { Ref: 'AWS::Partition' },
                                        ':codebuild:us-pipeline:123pipeline:report-group/',
                                        {
                                            Ref: 'pipelineUpdatePipelineSelfMutation14A96D2F'
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
                                    'iam:ResourceTag/aws-cdk:bootstrap-role': [ 'image-publishing', 'file-publishing', 'deploy' ]
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
                            Action: [ 's3:GetObject*', 's3:GetBucket*', 's3:List*' ],
                            Effect: 'Allow',
                            Resource: [
                                {
                                    'Fn::GetAtt': [
                                        'pipelinePipelineArtifactsBucketC2CD5B5E',
                                        'Arn'
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [
                                                    'pipelinePipelineArtifactsBucketC2CD5B5E',
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
                },
                PolicyName: 'pipelineUpdatePipelineSelfMutationRoleDefaultPolicy095404B8',
                Roles: [ { Ref: 'pipelineUpdatePipelineSelfMutationRole91820177' } ]
            }
        },
        pipelineUpdatePipelineSelfMutation14A96D2F: {
            Type: 'AWS::CodeBuild::Project',
            Properties: {
                Artifacts: { Type: 'CODEPIPELINE' },
                Environment: {
                    ComputeType: 'BUILD_GENERAL1_SMALL',
                    Image: 'aws/codebuild/standard:6.0',
                    ImagePullCredentialsType: 'CODEBUILD',
                    PrivilegedMode: false,
                    Type: 'LINUX_CONTAINER'
                },
                ServiceRole: {
                    'Fn::GetAtt': [ 'pipelineUpdatePipelineSelfMutationRole91820177', 'Arn' ]
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
                Cache: { Type: 'NO_CACHE' },
                Description: 'Pipeline step stack/Pipeline/UpdatePipeline/SelfMutate',
                EncryptionKey: 'alias/aws/s3'
            }
        }
    }
};