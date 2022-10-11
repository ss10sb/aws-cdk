module.exports = {
    Resources: {
        stackcluster05FAB0DF: {
            Type: 'AWS::ECS::Cluster',
            Properties: {
                ClusterName: 'stack-cluster',
                ClusterSettings: [{Name: 'containerInsights', Value: 'disabled'}]
            }
        },
        targetgroup897B0682: {
            Type: 'AWS::ElasticLoadBalancingV2::TargetGroup',
            Properties: {
                Name: 'target-group',
                Port: 80,
                Protocol: 'HTTP',
                TargetGroupAttributes: [{Key: 'stickiness.enabled', Value: 'false'}],
                TargetType: 'ip',
                VpcId: 'vpc-12345'
            }
        },
        stacktaskdefcreateruntask0execrole907DA49E: {
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
        stacktaskdefcreateruntask0execroleDefaultPolicy0F6E8B7F: {
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
                                    'stackcontainerphpfpmcreateruntaskcrot0loggroupD33B83FA',
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: [
                                'secretsmanager:GetSecretValue',
                                'secretsmanager:DescribeSecret'
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {Ref: 'AWS::Partition'},
                                        ':secretsmanager:us-east-1:12344:secret:stack-secrets/environment-??????'
                                    ]
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'stacktaskdefcreateruntask0execroleDefaultPolicy0F6E8B7F',
                Roles: [{Ref: 'stacktaskdefcreateruntask0execrole907DA49E'}]
            }
        },
        stacktaskdefcreateruntask0TaskRole9DAF85ED: {
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
        stacktaskdefcreateruntask06F95C280: {
            Type: 'AWS::ECS::TaskDefinition',
            Properties: {
                ContainerDefinitions: [
                    {
                        Command: ['/on_create.sh'],
                        Cpu: 256,
                        EntryPoint: ['/bin/sh', '-c'],
                        Environment: [{Name: 'FIZZ', Value: 'buzz'}],
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
                                    Ref: 'stackcontainerphpfpmcreateruntaskcrot0loggroupD33B83FA'
                                },
                                'awslogs-stream-prefix': 'phpfpm',
                                'awslogs-region': 'us-east-1'
                            }
                        },
                        Memory: 512,
                        Name: 'stack-container-phpfpm-createruntask-crot-0',
                        Secrets: [
                            {
                                Name: 'FOO',
                                ValueFrom: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':secretsmanager:us-east-1:12344:secret:stack-secrets/environment:FOO::'
                                        ]
                                    ]
                                }
                            },
                            {
                                Name: 'BAR',
                                ValueFrom: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':secretsmanager:us-east-1:12344:secret:stack-secrets/environment:BAR::'
                                        ]
                                    ]
                                }
                            }
                        ]
                    }
                ],
                Cpu: '256',
                ExecutionRoleArn: {
                    'Fn::GetAtt': ['stacktaskdefcreateruntask0execrole907DA49E', 'Arn']
                },
                Family: 'stack-task-def-createruntask-0',
                Memory: '512',
                NetworkMode: 'awsvpc',
                RequiresCompatibilities: ['FARGATE'],
                TaskRoleArn: {
                    'Fn::GetAtt': ['stacktaskdefcreateruntask0TaskRole9DAF85ED', 'Arn']
                }
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
        stackcontainerphpfpmcreateruntaskcrot0loggroupD33B83FA: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                LogGroupName: 'stack-container-phpfpm-createruntask-crot-0-log-group',
                RetentionInDays: 30
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        stacktaskcreateruntask0SecurityGroup60C3C0F6: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                GroupDescription: 'stack/stack-task-createruntask-0/SecurityGroup',
                SecurityGroupEgress: [
                    {
                        CidrIp: '0.0.0.0/0',
                        Description: 'Allow all outbound traffic by default',
                        IpProtocol: '-1'
                    }
                ],
                VpcId: 'vpc-12345'
            }
        },
        stacktaskcreateruntask0createfn73D8F471: {
            Type: 'Custom::AWS',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': ['AWS679f53fac002430cb0da5b7982bd22872D164C4C', 'Arn']
                },
                Create: {
                    'Fn::Join': [
                        '',
                        [
                            '{"service":"ECS","action":"runTask","physicalResourceId":{"id":"',
                            {Ref: 'stacktaskdefcreateruntask06F95C280'},
                            '"},"parameters":{"cluster":"',
                            {Ref: 'stackcluster05FAB0DF'},
                            '","taskDefinition":"',
                            {Ref: 'stacktaskdefcreateruntask06F95C280'},
                            '","capacityProviderStrategy":[],"launchType":"FARGATE","platformVersion":"LATEST","networkConfiguration":{"awsvpcConfiguration":{"assignPublicIp":"DISABLED","subnets":["p-12345","p-67890"],"securityGroups":["',
                            {
                                'Fn::GetAtt': [
                                    'stacktaskcreateruntask0SecurityGroup60C3C0F6',
                                    'GroupId'
                                ]
                            },
                            '"]}}}}'
                        ]
                    ]
                },
                InstallLatestAwsSdk: true
            },
            DependsOn: [
                'stacktaskcreateruntask0createfnCustomResourcePolicy211D8038'
            ],
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        stacktaskcreateruntask0createfnCustomResourcePolicy211D8038: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 'ecs:RunTask',
                            Effect: 'Allow',
                            Resource: {Ref: 'stacktaskdefcreateruntask06F95C280'}
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'stacktaskcreateruntask0createfnCustomResourcePolicy211D8038',
                Roles: [
                    {
                        Ref: 'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2'
                    }
                ]
            }
        },
        AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: {Service: 'lambda.amazonaws.com'}
                        }
                    ],
                    Version: '2012-10-17'
                },
                ManagedPolicyArns: [
                    {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                {Ref: 'AWS::Partition'},
                                ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole'
                            ]
                        ]
                    }
                ]
            }
        },
        AWS679f53fac002430cb0da5b7982bd2287ServiceRoleDefaultPolicyD28E1A5E: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 'iam:PassRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'stacktaskdefcreateruntask0TaskRole9DAF85ED',
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: 'iam:PassRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'stacktaskdefcreateruntask0execrole907DA49E',
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: 'iam:PassRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'stacktaskdefupdateruntask0TaskRoleFEFD1491',
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: 'iam:PassRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'stacktaskdefupdateruntask0execroleEC367416',
                                    'Arn'
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleDefaultPolicyD28E1A5E',
                Roles: [
                    {
                        Ref: 'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2'
                    }
                ]
            }
        },
        AWS679f53fac002430cb0da5b7982bd22872D164C4C: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-12344-us-east-1',
                    S3Key: '6dbd112fe448437b3438da4382c72fccbb7d2ee1543db222620d7447fffebc50.zip'
                },
                Role: {
                    'Fn::GetAtt': [
                        'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2',
                        'Arn'
                    ]
                },
                FunctionName: 'create-fn',
                Handler: 'index.handler',
                Runtime: 'nodejs14.x',
                Timeout: 120
            },
            DependsOn: [
                'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleDefaultPolicyD28E1A5E',
                'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2'
            ]
        },
        AWS679f53fac002430cb0da5b7982bd2287LogRetentionCE72797A: {
            Type: 'Custom::LogRetention',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': [
                        'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aFD4BFC8A',
                        'Arn'
                    ]
                },
                LogGroupName: {
                    'Fn::Join': [
                        '',
                        [
                            '/aws/lambda/',
                            {Ref: 'AWS679f53fac002430cb0da5b7982bd22872D164C4C'}
                        ]
                    ]
                },
                RetentionInDays: 7
            }
        },
        LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: {Service: 'lambda.amazonaws.com'}
                        }
                    ],
                    Version: '2012-10-17'
                },
                ManagedPolicyArns: [
                    {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                {Ref: 'AWS::Partition'},
                                ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole'
                            ]
                        ]
                    }
                ]
            }
        },
        LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRoleDefaultPolicyADDA7DEB: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: [
                                'logs:PutRetentionPolicy',
                                'logs:DeleteRetentionPolicy'
                            ],
                            Effect: 'Allow',
                            Resource: '*'
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRoleDefaultPolicyADDA7DEB',
                Roles: [
                    {
                        Ref: 'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB'
                    }
                ]
            }
        },
        LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aFD4BFC8A: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Handler: 'index.handler',
                Runtime: 'nodejs14.x',
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-12344-us-east-1',
                    S3Key: 'eb5b005c858404ea0c8f68098ed5dcdf5340e02461f149751d10f59c210d5ef8.zip'
                },
                Role: {
                    'Fn::GetAtt': [
                        'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB',
                        'Arn'
                    ]
                }
            },
            DependsOn: [
                'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRoleDefaultPolicyADDA7DEB',
                'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB'
            ]
        },
        stacktaskdefupdateruntask0execroleEC367416: {
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
        stacktaskdefupdateruntask0execroleDefaultPolicy09BD4082: {
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
                                    'stackcontainerphpfpmupdateruntaskurot0loggroup3A9C7432',
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: [
                                'secretsmanager:GetSecretValue',
                                'secretsmanager:DescribeSecret'
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {Ref: 'AWS::Partition'},
                                        ':secretsmanager:us-east-1:12344:secret:stack-secrets/environment-??????'
                                    ]
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'stacktaskdefupdateruntask0execroleDefaultPolicy09BD4082',
                Roles: [{Ref: 'stacktaskdefupdateruntask0execroleEC367416'}]
            }
        },
        stacktaskdefupdateruntask0TaskRoleFEFD1491: {
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
        stacktaskdefupdateruntask04479EE6D: {
            Type: 'AWS::ECS::TaskDefinition',
            Properties: {
                ContainerDefinitions: [
                    {
                        Command: ['artisan', 'migrate', '--force'],
                        Cpu: 256,
                        EntryPoint: ['/usr/local/bin/php'],
                        Environment: [{Name: 'FIZZ', Value: 'buzz'}],
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
                                    Ref: 'stackcontainerphpfpmupdateruntaskurot0loggroup3A9C7432'
                                },
                                'awslogs-stream-prefix': 'phpfpm',
                                'awslogs-region': 'us-east-1'
                            }
                        },
                        Memory: 512,
                        Name: 'stack-container-phpfpm-updateruntask-urot-0',
                        Secrets: [
                            {
                                Name: 'FOO',
                                ValueFrom: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':secretsmanager:us-east-1:12344:secret:stack-secrets/environment:FOO::'
                                        ]
                                    ]
                                }
                            },
                            {
                                Name: 'BAR',
                                ValueFrom: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':secretsmanager:us-east-1:12344:secret:stack-secrets/environment:BAR::'
                                        ]
                                    ]
                                }
                            }
                        ]
                    }
                ],
                Cpu: '256',
                ExecutionRoleArn: {
                    'Fn::GetAtt': ['stacktaskdefupdateruntask0execroleEC367416', 'Arn']
                },
                Family: 'stack-task-def-updateruntask-0',
                Memory: '512',
                NetworkMode: 'awsvpc',
                RequiresCompatibilities: ['FARGATE'],
                TaskRoleArn: {
                    'Fn::GetAtt': ['stacktaskdefupdateruntask0TaskRoleFEFD1491', 'Arn']
                }
            }
        },
        stackcontainerphpfpmupdateruntaskurot0loggroup3A9C7432: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                LogGroupName: 'stack-container-phpfpm-updateruntask-urot-0-log-group',
                RetentionInDays: 30
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        stacktaskupdateruntask0SecurityGroup73DC7299: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                GroupDescription: 'stack/stack-task-updateruntask-0/SecurityGroup',
                SecurityGroupEgress: [
                    {
                        CidrIp: '0.0.0.0/0',
                        Description: 'Allow all outbound traffic by default',
                        IpProtocol: '-1'
                    }
                ],
                VpcId: 'vpc-12345'
            }
        },
        stacktaskupdateruntask0updatefn284D71FE: {
            Type: 'Custom::AWS',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': ['AWS679f53fac002430cb0da5b7982bd22872D164C4C', 'Arn']
                },
                Create: {
                    'Fn::Join': [
                        '',
                        [
                            '{"service":"ECS","action":"runTask","physicalResourceId":{"id":"',
                            {Ref: 'stacktaskdefupdateruntask04479EE6D'},
                            '"},"parameters":{"cluster":"',
                            {Ref: 'stackcluster05FAB0DF'},
                            '","taskDefinition":"',
                            {Ref: 'stacktaskdefupdateruntask04479EE6D'},
                            '","capacityProviderStrategy":[],"launchType":"FARGATE","platformVersion":"LATEST","networkConfiguration":{"awsvpcConfiguration":{"assignPublicIp":"DISABLED","subnets":["p-12345","p-67890"],"securityGroups":["',
                            {
                                'Fn::GetAtt': [
                                    'stacktaskupdateruntask0SecurityGroup73DC7299',
                                    'GroupId'
                                ]
                            },
                            '"]}}}}'
                        ]
                    ]
                },
                Update: {
                    'Fn::Join': [
                        '',
                        [
                            '{"service":"ECS","action":"runTask","physicalResourceId":{"id":"',
                            {Ref: 'stacktaskdefupdateruntask04479EE6D'},
                            '"},"parameters":{"cluster":"',
                            {Ref: 'stackcluster05FAB0DF'},
                            '","taskDefinition":"',
                            {Ref: 'stacktaskdefupdateruntask04479EE6D'},
                            '","capacityProviderStrategy":[],"launchType":"FARGATE","platformVersion":"LATEST","networkConfiguration":{"awsvpcConfiguration":{"assignPublicIp":"DISABLED","subnets":["p-12345","p-67890"],"securityGroups":["',
                            {
                                'Fn::GetAtt': [
                                    'stacktaskupdateruntask0SecurityGroup73DC7299',
                                    'GroupId'
                                ]
                            },
                            '"]}}}}'
                        ]
                    ]
                },
                InstallLatestAwsSdk: true
            },
            DependsOn: [
                'stacktaskupdateruntask0updatefnCustomResourcePolicy4B8702A5'
            ],
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        stacktaskupdateruntask0updatefnCustomResourcePolicy4B8702A5: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 'ecs:RunTask',
                            Effect: 'Allow',
                            Resource: {Ref: 'stacktaskdefupdateruntask04479EE6D'}
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'stacktaskupdateruntask0updatefnCustomResourcePolicy4B8702A5',
                Roles: [
                    {
                        Ref: 'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2'
                    }
                ]
            }
        },
        stacktaskdefweb0execroleF48E5557: {
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
        stacktaskdefweb0execroleDefaultPolicyA1E628C2: {
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
                            Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': ['stackcontainernginxwebu0loggroupA0485B8E', 'Arn']
                            }
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
                            Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'stackcontainerphpfpmwebu0loggroup678C2866',
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: [
                                'secretsmanager:GetSecretValue',
                                'secretsmanager:DescribeSecret'
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {Ref: 'AWS::Partition'},
                                        ':secretsmanager:us-east-1:12344:secret:stack-secrets/environment-??????'
                                    ]
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'stacktaskdefweb0execroleDefaultPolicyA1E628C2',
                Roles: [{Ref: 'stacktaskdefweb0execroleF48E5557'}]
            }
        },
        stacktaskdefweb0TaskRole8BC1F26E: {
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
        stacktaskdefweb0TaskRoleDefaultPolicy30BB6C4E: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: [
                                'ssmmessages:CreateControlChannel',
                                'ssmmessages:CreateDataChannel',
                                'ssmmessages:OpenControlChannel',
                                'ssmmessages:OpenDataChannel'
                            ],
                            Effect: 'Allow',
                            Resource: '*'
                        },
                        {
                            Action: 'logs:DescribeLogGroups',
                            Effect: 'Allow',
                            Resource: '*'
                        },
                        {
                            Action: [
                                'logs:CreateLogStream',
                                'logs:DescribeLogStreams',
                                'logs:PutLogEvents'
                            ],
                            Effect: 'Allow',
                            Resource: '*'
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'stacktaskdefweb0TaskRoleDefaultPolicy30BB6C4E',
                Roles: [{Ref: 'stacktaskdefweb0TaskRole8BC1F26E'}]
            }
        },
        stacktaskdefweb065A59601: {
            Type: 'AWS::ECS::TaskDefinition',
            Properties: {
                ContainerDefinitions: [
                    {
                        Cpu: 64,
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
                                    {Ref: 'nginxecrC430EE7B'},
                                    ':1'
                                ]
                            ]
                        },
                        LogConfiguration: {
                            LogDriver: 'awslogs',
                            Options: {
                                'awslogs-group': {Ref: 'stackcontainernginxwebu0loggroupA0485B8E'},
                                'awslogs-stream-prefix': 'nginx',
                                'awslogs-region': 'us-east-1'
                            }
                        },
                        Memory: 64,
                        Name: 'stack-container-nginx-web-u-0',
                        PortMappings: [{ContainerPort: 80, Protocol: 'tcp'}],
                        Secrets: []
                    },
                    {
                        Cpu: 128,
                        Environment: [{Name: 'FIZZ', Value: 'buzz'}],
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
                                'awslogs-group': {Ref: 'stackcontainerphpfpmwebu0loggroup678C2866'},
                                'awslogs-stream-prefix': 'phpfpm',
                                'awslogs-region': 'us-east-1'
                            }
                        },
                        Memory: 128,
                        Name: 'stack-container-phpfpm-web-u-0',
                        PortMappings: [{ContainerPort: 9000, Protocol: 'tcp'}],
                        Secrets: [
                            {
                                Name: 'FOO',
                                ValueFrom: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':secretsmanager:us-east-1:12344:secret:stack-secrets/environment:FOO::'
                                        ]
                                    ]
                                }
                            },
                            {
                                Name: 'BAR',
                                ValueFrom: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':secretsmanager:us-east-1:12344:secret:stack-secrets/environment:BAR::'
                                        ]
                                    ]
                                }
                            }
                        ]
                    }
                ],
                Cpu: '256',
                ExecutionRoleArn: {
                    'Fn::GetAtt': ['stacktaskdefweb0execroleF48E5557', 'Arn']
                },
                Family: 'stack-task-def-web-0',
                Memory: '512',
                NetworkMode: 'awsvpc',
                RequiresCompatibilities: ['FARGATE'],
                TaskRoleArn: {
                    'Fn::GetAtt': ['stacktaskdefweb0TaskRole8BC1F26E', 'Arn']
                }
            }
        },
        stackcontainernginxwebu0loggroupA0485B8E: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                LogGroupName: 'stack-container-nginx-web-u-0-log-group',
                RetentionInDays: 30
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        stackcontainerphpfpmwebu0loggroup678C2866: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                LogGroupName: 'stack-container-phpfpm-web-u-0-log-group',
                RetentionInDays: 30
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        stackserviceweb0Service4596BF8E: {
            Type: 'AWS::ECS::Service',
            Properties: {
                Cluster: {Ref: 'stackcluster05FAB0DF'},
                DeploymentConfiguration: {MaximumPercent: 200, MinimumHealthyPercent: 50},
                DesiredCount: 1,
                EnableECSManagedTags: false,
                EnableExecuteCommand: true,
                HealthCheckGracePeriodSeconds: 60,
                LaunchType: 'FARGATE',
                LoadBalancers: [
                    {
                        ContainerName: 'stack-container-nginx-web-u-0',
                        ContainerPort: 80,
                        TargetGroupArn: {Ref: 'targetgroup897B0682'}
                    }
                ],
                NetworkConfiguration: {
                    AwsvpcConfiguration: {
                        AssignPublicIp: 'DISABLED',
                        SecurityGroups: [
                            {
                                'Fn::GetAtt': [
                                    'stackserviceweb0SecurityGroup2BBE8DB1',
                                    'GroupId'
                                ]
                            }
                        ],
                        Subnets: ['p-12345', 'p-67890']
                    }
                },
                PlatformVersion: 'LATEST',
                ServiceName: 'stack-service-web-0',
                TaskDefinition: {Ref: 'stacktaskdefweb065A59601'}
            }
        },
        stackserviceweb0SecurityGroup2BBE8DB1: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                GroupDescription: 'stack/stack-service-web-0/SecurityGroup',
                SecurityGroupEgress: [
                    {
                        CidrIp: '0.0.0.0/0',
                        Description: 'Allow all outbound traffic by default',
                        IpProtocol: '-1'
                    }
                ],
                VpcId: 'vpc-12345'
            }
        },
        stackserviceweb0TaskCountTarget25516769: {
            Type: 'AWS::ApplicationAutoScaling::ScalableTarget',
            Properties: {
                MaxCapacity: 2,
                MinCapacity: 1,
                ResourceId: {
                    'Fn::Join': [
                        '',
                        [
                            'service/',
                            {Ref: 'stackcluster05FAB0DF'},
                            '/',
                            {
                                'Fn::GetAtt': ['stackserviceweb0Service4596BF8E', 'Name']
                            }
                        ]
                    ]
                },
                RoleARN: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {Ref: 'AWS::Partition'},
                            ':iam::12344:role/aws-service-role/ecs.application-autoscaling.amazonaws.com/AWSServiceRoleForApplicationAutoScaling_ECSService'
                        ]
                    ]
                },
                ScalableDimension: 'ecs:service:DesiredCount',
                ServiceNamespace: 'ecs'
            }
        },
        stackserviceweb0TaskCountTargetstackservicescalecpuFCB34C28: {
            Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
            Properties: {
                PolicyName: 'stackstackserviceweb0TaskCountTargetstackservicescalecpu24230823',
                PolicyType: 'TargetTrackingScaling',
                ScalingTargetId: {Ref: 'stackserviceweb0TaskCountTarget25516769'},
                TargetTrackingScalingPolicyConfiguration: {
                    PredefinedMetricSpecification: {PredefinedMetricType: 'ECSServiceAverageCPUUtilization'},
                    TargetValue: 75
                }
            }
        },
        stackserviceweb0TaskCountTargetstackservicescalemem7A298342: {
            Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
            Properties: {
                PolicyName: 'stackstackserviceweb0TaskCountTargetstackservicescalemem5B089F4E',
                PolicyType: 'TargetTrackingScaling',
                ScalingTargetId: {Ref: 'stackserviceweb0TaskCountTarget25516769'},
                TargetTrackingScalingPolicyConfiguration: {
                    PredefinedMetricSpecification: {
                        PredefinedMetricType: 'ECSServiceAverageMemoryUtilization'
                    },
                    TargetValue: 75
                }
            }
        },
        stackservicequeue0loggroup53D31D05: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                LogGroupName: 'stack-service-queue-0-log-group',
                RetentionInDays: 30
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        stackservicequeue0EcsProcessingDeadLetterQueueF40FEAC0: {
            Type: 'AWS::SQS::Queue',
            Properties: {MessageRetentionPeriod: 1209600},
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        stackservicequeue0EcsProcessingQueue856D2EE2: {
            Type: 'AWS::SQS::Queue',
            Properties: {
                RedrivePolicy: {
                    deadLetterTargetArn: {
                        'Fn::GetAtt': [
                            'stackservicequeue0EcsProcessingDeadLetterQueueF40FEAC0',
                            'Arn'
                        ]
                    },
                    maxReceiveCount: 3
                }
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        stackservicequeue0QueueProcessingTaskDefTaskRoleE3846A7C: {
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
        stackservicequeue0QueueProcessingTaskDefTaskRoleDefaultPolicy1B9DFD49: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: [
                                'sqs:ReceiveMessage',
                                'sqs:ChangeMessageVisibility',
                                'sqs:GetQueueUrl',
                                'sqs:DeleteMessage',
                                'sqs:GetQueueAttributes'
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'stackservicequeue0EcsProcessingQueue856D2EE2',
                                    'Arn'
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'stackservicequeue0QueueProcessingTaskDefTaskRoleDefaultPolicy1B9DFD49',
                Roles: [
                    {
                        Ref: 'stackservicequeue0QueueProcessingTaskDefTaskRoleE3846A7C'
                    }
                ]
            }
        },
        stackservicequeue0QueueProcessingTaskDef1796ACC1: {
            Type: 'AWS::ECS::TaskDefinition',
            Properties: {
                ContainerDefinitions: [
                    {
                        Command: [
                            '/usr/local/bin/php',
                            'artisan',
                            'queue:work',
                            '--tries=3',
                            '--delay=3',
                            '--sleep=3'
                        ],
                        Environment: [
                            {Name: 'FIZZ', Value: 'buzz'},
                            {
                                Name: 'QUEUE_NAME',
                                Value: {
                                    'Fn::GetAtt': [
                                        'stackservicequeue0EcsProcessingQueue856D2EE2',
                                        'QueueName'
                                    ]
                                }
                            }
                        ],
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
                                'awslogs-group': {Ref: 'stackservicequeue0loggroup53D31D05'},
                                'awslogs-stream-prefix': 'phpfpm',
                                'awslogs-region': 'us-east-1'
                            }
                        },
                        Name: 'QueueProcessingContainer',
                        Secrets: [
                            {
                                Name: 'FOO',
                                ValueFrom: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':secretsmanager:us-east-1:12344:secret:stack-secrets/environment:FOO::'
                                        ]
                                    ]
                                }
                            },
                            {
                                Name: 'BAR',
                                ValueFrom: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':secretsmanager:us-east-1:12344:secret:stack-secrets/environment:BAR::'
                                        ]
                                    ]
                                }
                            }
                        ]
                    }
                ],
                Cpu: '256',
                ExecutionRoleArn: {
                    'Fn::GetAtt': [
                        'stackservicequeue0QueueProcessingTaskDefExecutionRole8FAE0316',
                        'Arn'
                    ]
                },
                Family: 'stack-service-queue-0',
                Memory: '512',
                NetworkMode: 'awsvpc',
                RequiresCompatibilities: ['FARGATE'],
                TaskRoleArn: {
                    'Fn::GetAtt': [
                        'stackservicequeue0QueueProcessingTaskDefTaskRoleE3846A7C',
                        'Arn'
                    ]
                }
            }
        },
        stackservicequeue0QueueProcessingTaskDefExecutionRole8FAE0316: {
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
        stackservicequeue0QueueProcessingTaskDefExecutionRoleDefaultPolicy1EB6C53F: {
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
                                'Fn::GetAtt': ['stackservicequeue0loggroup53D31D05', 'Arn']
                            }
                        },
                        {
                            Action: [
                                'secretsmanager:GetSecretValue',
                                'secretsmanager:DescribeSecret'
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {Ref: 'AWS::Partition'},
                                        ':secretsmanager:us-east-1:12344:secret:stack-secrets/environment-??????'
                                    ]
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'stackservicequeue0QueueProcessingTaskDefExecutionRoleDefaultPolicy1EB6C53F',
                Roles: [
                    {
                        Ref: 'stackservicequeue0QueueProcessingTaskDefExecutionRole8FAE0316'
                    }
                ]
            }
        },
        stackservicequeue0QueueProcessingFargateServiceD4DA0ABF: {
            Type: 'AWS::ECS::Service',
            Properties: {
                Cluster: {Ref: 'stackcluster05FAB0DF'},
                DeploymentConfiguration: {MaximumPercent: 200, MinimumHealthyPercent: 50},
                EnableECSManagedTags: false,
                LaunchType: 'FARGATE',
                NetworkConfiguration: {
                    AwsvpcConfiguration: {
                        AssignPublicIp: 'DISABLED',
                        SecurityGroups: [
                            {
                                'Fn::GetAtt': [
                                    'stackservicequeue0QueueProcessingFargateServiceSecurityGroupDD9BE1AC',
                                    'GroupId'
                                ]
                            }
                        ],
                        Subnets: ['p-12345', 'p-67890']
                    }
                },
                PlatformVersion: 'LATEST',
                ServiceName: 'stack-service-queue-0',
                TaskDefinition: {Ref: 'stackservicequeue0QueueProcessingTaskDef1796ACC1'}
            }
        },
        stackservicequeue0QueueProcessingFargateServiceSecurityGroupDD9BE1AC: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                GroupDescription: 'stack/stack-service-queue-0/QueueProcessingFargateService/SecurityGroup',
                SecurityGroupEgress: [
                    {
                        CidrIp: '0.0.0.0/0',
                        Description: 'Allow all outbound traffic by default',
                        IpProtocol: '-1'
                    }
                ],
                VpcId: 'vpc-12345'
            }
        },
        stackservicequeue0QueueProcessingFargateServiceTaskCountTargetAA840AB8: {
            Type: 'AWS::ApplicationAutoScaling::ScalableTarget',
            Properties: {
                MaxCapacity: 2,
                MinCapacity: 0,
                ResourceId: {
                    'Fn::Join': [
                        '',
                        [
                            'service/',
                            {Ref: 'stackcluster05FAB0DF'},
                            '/',
                            {
                                'Fn::GetAtt': [
                                    'stackservicequeue0QueueProcessingFargateServiceD4DA0ABF',
                                    'Name'
                                ]
                            }
                        ]
                    ]
                },
                RoleARN: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {Ref: 'AWS::Partition'},
                            ':iam::12344:role/aws-service-role/ecs.application-autoscaling.amazonaws.com/AWSServiceRoleForApplicationAutoScaling_ECSService'
                        ]
                    ]
                },
                ScalableDimension: 'ecs:service:DesiredCount',
                ServiceNamespace: 'ecs'
            }
        },
        stackservicequeue0QueueProcessingFargateServiceTaskCountTargetCpuScalingEE28B00C: {
            Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
            Properties: {
                PolicyName: 'stackstackservicequeue0QueueProcessingFargateServiceTaskCountTargetCpuScalingE1D6ED30',
                PolicyType: 'TargetTrackingScaling',
                ScalingTargetId: {
                    Ref: 'stackservicequeue0QueueProcessingFargateServiceTaskCountTargetAA840AB8'
                },
                TargetTrackingScalingPolicyConfiguration: {
                    PredefinedMetricSpecification: {PredefinedMetricType: 'ECSServiceAverageCPUUtilization'},
                    TargetValue: 50
                }
            }
        },
        stackservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingLowerPolicy7C874CE0: {
            Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
            Properties: {
                PolicyName: 'stackstackservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingLowerPolicyE9445A06',
                PolicyType: 'StepScaling',
                ScalingTargetId: {
                    Ref: 'stackservicequeue0QueueProcessingFargateServiceTaskCountTargetAA840AB8'
                },
                StepScalingPolicyConfiguration: {
                    AdjustmentType: 'ChangeInCapacity',
                    MetricAggregationType: 'Maximum',
                    StepAdjustments: [{MetricIntervalUpperBound: 0, ScalingAdjustment: -1}]
                }
            }
        },
        stackservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingLowerAlarm9DEA3919: {
            Type: 'AWS::CloudWatch::Alarm',
            Properties: {
                ComparisonOperator: 'LessThanOrEqualToThreshold',
                EvaluationPeriods: 1,
                AlarmActions: [
                    {
                        Ref: 'stackservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingLowerPolicy7C874CE0'
                    }
                ],
                AlarmDescription: 'Lower threshold scaling alarm',
                Dimensions: [
                    {
                        Name: 'QueueName',
                        Value: {
                            'Fn::GetAtt': [
                                'stackservicequeue0EcsProcessingQueue856D2EE2',
                                'QueueName'
                            ]
                        }
                    }
                ],
                MetricName: 'ApproximateNumberOfMessagesVisible',
                Namespace: 'AWS/SQS',
                Period: 300,
                Statistic: 'Maximum',
                Threshold: 0
            }
        },
        stackservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingUpperPolicy7F90BD53: {
            Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
            Properties: {
                PolicyName: 'stackstackservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingUpperPolicy45175FE2',
                PolicyType: 'StepScaling',
                ScalingTargetId: {
                    Ref: 'stackservicequeue0QueueProcessingFargateServiceTaskCountTargetAA840AB8'
                },
                StepScalingPolicyConfiguration: {
                    AdjustmentType: 'ChangeInCapacity',
                    MetricAggregationType: 'Maximum',
                    StepAdjustments: [
                        {
                            MetricIntervalLowerBound: 0,
                            MetricIntervalUpperBound: 9,
                            ScalingAdjustment: 1
                        },
                        {MetricIntervalLowerBound: 9, ScalingAdjustment: 2}
                    ]
                }
            }
        },
        stackservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingUpperAlarm09E09486: {
            Type: 'AWS::CloudWatch::Alarm',
            Properties: {
                ComparisonOperator: 'GreaterThanOrEqualToThreshold',
                EvaluationPeriods: 1,
                AlarmActions: [
                    {
                        Ref: 'stackservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingUpperPolicy7F90BD53'
                    }
                ],
                AlarmDescription: 'Upper threshold scaling alarm',
                Dimensions: [
                    {
                        Name: 'QueueName',
                        Value: {
                            'Fn::GetAtt': [
                                'stackservicequeue0EcsProcessingQueue856D2EE2',
                                'QueueName'
                            ]
                        }
                    }
                ],
                MetricName: 'ApproximateNumberOfMessagesVisible',
                Namespace: 'AWS/SQS',
                Period: 300,
                Statistic: 'Maximum',
                Threshold: 1
            }
        }
    },
    Outputs: {
        stackservicequeue0SQSDeadLetterQueue7523CA34: {
            Value: {
                'Fn::GetAtt': [
                    'stackservicequeue0EcsProcessingDeadLetterQueueF40FEAC0',
                    'QueueName'
                ]
            }
        },
        stackservicequeue0SQSDeadLetterQueueArn84EBCE8C: {
            Value: {
                'Fn::GetAtt': [
                    'stackservicequeue0EcsProcessingDeadLetterQueueF40FEAC0',
                    'Arn'
                ]
            }
        },
        stackservicequeue0SQSQueue9F259124: {
            Value: {
                'Fn::GetAtt': [
                    'stackservicequeue0EcsProcessingQueue856D2EE2',
                    'QueueName'
                ]
            }
        },
        stackservicequeue0SQSQueueArnDB42E6EB: {
            Value: {
                'Fn::GetAtt': ['stackservicequeue0EcsProcessingQueue856D2EE2', 'Arn']
            }
        }
    }
};