const {MatchHelper} = require("../../src/utils/testing/match-helper");
module.exports = {
    Resources: {
        tdTaskRole8FD72FE1: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: {Service: 'ecs-tasks.amazonaws.com'}
                        }
                    ],
                    Version: '2012-10-17'
                }
            }
        },
        td7B720589: {
            Type: 'AWS::ECS::TaskDefinition',
            Properties: {
                ContainerDefinitions: [
                    {
                        Cpu: 256,
                        Essential: true,
                        Image: {
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
                                    {Ref: 'phpfpmecr3C5F411B'},
                                    ':1'
                                ]
                            ]
                        },
                        LogConfiguration: {
                            LogDriver: 'awslogs',
                            Options: {
                                'awslogs-group': {
                                    Ref: 'containercontainerphpfpmwebu0loggroupB7AA327B'
                                },
                                'awslogs-stream-prefix': 'phpfpm',
                                'awslogs-region': 'us-east-1'
                            }
                        },
                        Memory: 512,
                  MountPoints: [
                    {
                      ContainerPath: '/mnt/files',
                      ReadOnly: false,
                      SourceVolume: 'stack-bucket-s3-files-volume'
                    }
                  ],
                        Name: 'container-container-phpfpm-web-u-0',
                        ReadonlyRootFilesystem: true
                    }
                ],
                Cpu: '256',
                ExecutionRoleArn: {'Fn::GetAtt': ['tdExecutionRole432FAE8A', 'Arn']},
                Family: 'stacktd2794DBE0',
                Memory: '512',
                NetworkMode: 'awsvpc',
                RequiresCompatibilities: ['FARGATE'],
              TaskRoleArn: { 'Fn::GetAtt': [ 'tdTaskRole8FD72FE1', 'Arn' ] },
              Volumes: [
                {
                  Name: 'stack-bucket-s3-files-volume',
                  S3FilesVolumeConfiguration: {
                    AccessPointArn: {
                      'Fn::GetAtt': [
                        'stackbuckets3filesnfscontainers3filesap037F4A435',
                        'AccessPointArn'
                      ]
                    },
                    FileSystemArn: {
                      'Fn::GetAtt': [ 'stackbuckets3filesnfs', 'FileSystemArn' ]
                    },
                    RootDirectory: '/'
                  }
                }
              ]
            }
        },
        tdExecutionRole432FAE8A: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: {Service: 'ecs-tasks.amazonaws.com'}
                        }
                    ],
                    Version: '2012-10-17'
                }
            }
        },
        tdExecutionRoleDefaultPolicyBC1748C4: {
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
                            Resource: {'Fn::GetAtt': ['phpfpmecr3C5F411B', 'Arn']}
                        },
                        {
                            Action: 'ecr:GetAuthorizationToken',
                            Effect: 'Allow',
                            Resource: '*'
                        },
                        {
                            Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'containercontainerphpfpmwebu0loggroupB7AA327B',
                                    'Arn'
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'tdExecutionRoleDefaultPolicyBC1748C4',
                Roles: [{Ref: 'tdExecutionRole432FAE8A'}]
            }
        },
        stackbuckets3files2028AFD4: {
            Type: 'AWS::S3::Bucket',
            Properties: {
                BucketEncryption: {
                    ServerSideEncryptionConfiguration: [
                        {
                            ServerSideEncryptionByDefault: {SSEAlgorithm: 'aws:kms'}
                        }
                    ]
                },
                BucketName: 'stack-bucket-s3-files',
                OwnershipControls: {Rules: [{ObjectOwnership: 'BucketOwnerEnforced'}]},
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
        stackbuckets3filesPolicy2C434124: {
            Type: 'AWS::S3::BucketPolicy',
            Properties: {
                Bucket: {Ref: 'stackbuckets3files2028AFD4'},
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 's3:*',
                            Condition: {Bool: {'aws:SecureTransport': 'false'}},
                            Effect: 'Deny',
                            Principal: {AWS: '*'},
                            Resource: [
                                {
                                    'Fn::GetAtt': ['stackbuckets3files2028AFD4', 'Arn']
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': ['stackbuckets3files2028AFD4', 'Arn']
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
        stackbuckets3filesnfsroleC4B20C4D: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: {Service: 'elasticfilesystem.amazonaws.com'}
                        }
                    ],
                    Version: '2012-10-17'
                }
            }
        },
        stackbuckets3filesnfsroleDefaultPolicy8F6B3059: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 's3:ListBucket*',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': ['stackbuckets3files2028AFD4', 'Arn']
                            }
                        },
                        {
                            Action: [
                                's3:AbortMultipartUpload',
                                's3:DeleteObject',
                                's3:GetObject*',
                                's3:List*',
                                's3:PutObject*'
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        {
                                            'Fn::GetAtt': ['stackbuckets3files2028AFD4', 'Arn']
                                        },
                                        '/*'
                                    ]
                                ]
                            }
                        },
                        {
                            Action: [
                                'events:DeleteRule',
                                'events:DisableRule',
                                'events:EnableRule',
                                'events:PutRule',
                                'events:PutTargets',
                                'events:RemoveTargets'
                            ],
                            Condition: {
                                StringEquals: {
                                    'events:ManagedBy': 'elasticfilesystem.amazonaws.com'
                                }
                            },
                            Effect: 'Allow',
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {Ref: 'AWS::Partition'},
                                        ':events:*:*:rule/DO-NOT-DELETE-S3-Files*'
                                    ]
                                ]
                            }
                        },
                        {
                            Action: [
                                'events:DescribeRule',
                                'events:ListRuleNamesByTarget',
                                'events:ListRules',
                                'events:ListTargetsByRule'
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {Ref: 'AWS::Partition'},
                                        ':events:*:*:rule/*'
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
                                    'Fn::GetAtt': ['stackbuckets3files2028AFD4', 'Arn']
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': ['stackbuckets3files2028AFD4', 'Arn']
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
                PolicyName: 'stackbuckets3filesnfsroleDefaultPolicy8F6B3059',
                Roles: [{Ref: 'stackbuckets3filesnfsroleC4B20C4D'}]
            }
        },
        stackbuckets3filesnfs: {
            Type: 'AWS::S3Files::FileSystem',
            Properties: {
                Bucket: {'Fn::GetAtt': ['stackbuckets3files2028AFD4', 'Arn']},
                RoleArn: {
                    'Fn::GetAtt': ['stackbuckets3filesnfsroleC4B20C4D', 'Arn']
                }
            }
        },
          stackbuckets3filesnfscontainers3filesap037F4A435: {
            Type: 'AWS::S3Files::AccessPoint',
            Properties: {
                FileSystemId: {'Fn::GetAtt': ['stackbuckets3filesnfs', 'FileSystemId']},
                PosixUser: {Gid: '1000', Uid: '1000'},
                RootDirectory: {
                    CreationPermissions: {OwnerGid: '1000', OwnerUid: '1000', Permissions: '750'},
                    Path: '/'
                }
            }
        },
        stackbuckets3filesnfssg1C8F8B2D: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                GroupDescription: 'S3 Files traffic',
                SecurityGroupEgress: [
                    {
                        CidrIp: '0.0.0.0/0',
                        Description: 'Allow all outbound traffic by default',
                        IpProtocol: '-1'
                    }
                ],
                SecurityGroupIngress: [
                    {
                        CidrIp: '1.2.3.4/5',
                        Description: 'Allow NFS from VPC',
                        FromPort: 2049,
                        IpProtocol: 'tcp',
                        ToPort: 2049
                    }
                ],
                VpcId: 'vpc-12345'
            }
        },
        stackbuckets3filesnfsmt0: {
            Type: 'AWS::S3Files::MountTarget',
            Properties: {
                FileSystemId: {'Fn::GetAtt': ['stackbuckets3filesnfs', 'FileSystemId']},
                IpAddressType: 'ipv4',
                SecurityGroups: [
                    {
                        'Fn::GetAtt': ['stackbuckets3filesnfssg1C8F8B2D', 'GroupId']
                    }
                ],
                SubnetId: 'p-12345'
            }
        },
        stackbuckets3filesnfsmt1: {
            Type: 'AWS::S3Files::MountTarget',
            Properties: {
                FileSystemId: {'Fn::GetAtt': ['stackbuckets3filesnfs', 'FileSystemId']},
                IpAddressType: 'ipv4',
                SecurityGroups: [
                    {
                        'Fn::GetAtt': ['stackbuckets3filesnfssg1C8F8B2D', 'GroupId']
                    }
                ],
                SubnetId: 'p-67890'
            }
        },
        nginxecrC430EE7B: {
            Type: 'AWS::ECR::Repository',
            Properties: {
                ImageScanningConfiguration: {ScanOnPush: true},
                LifecyclePolicy: {
                    LifecyclePolicyText: '{"rules":[{"rulePriority":1,"selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":3},"action":{"type":"expire"}}]}'
                },
                RepositoryName: 'my-repos/nginx'
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
                RepositoryName: 'my-repos/phpfpm'
            },
            UpdateReplacePolicy: 'Retain',
            DeletionPolicy: 'Retain'
        },
        containercontainerphpfpmwebu0loggroupB7AA327B: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                LogGroupName: 'container-container-phpfpm-web-u-0-log-group',
                RetentionInDays: 30
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        }
    }
};