const {MatchHelper} = require("../../src/utils/testing/match-helper");
module.exports = {
    Resources: {
        pccsdlcmyapptestdevexampleeduarecord1EBFD14B: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                AliasTarget: {
                    DNSName: 'dualstack.my-load-balancer-1234567890.us-west-2.elb.amazonaws.com',
                    HostedZoneId: 'Z3DZXE0EXAMPLE'
                },
                Comment: 'pcc-sdlc-myapp: test.dev.example.edu',
                HostedZoneId: 'DUMMY',
                Name: 'test.dev.example.edu.',
                Type: 'A'
            }
        },
        pccsdlcmyappsesverifytestVerifyDomainIdentityE052339E: {
            Type: 'Custom::AWS',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': ['AWS679f53fac002430cb0da5b7982bd22872D164C4C', 'Arn']
                },
                Create: '{"service":"SES","action":"verifyDomainIdentity","parameters":{"Domain":"test.dev.example.edu"},"physicalResourceId":{"responsePath":"VerificationToken"}}',
                Update: '{"service":"SES","action":"verifyDomainIdentity","parameters":{"Domain":"test.dev.example.edu"},"physicalResourceId":{"responsePath":"VerificationToken"}}',
                Delete: '{"service":"SES","action":"deleteIdentity","parameters":{"Identity":"test.dev.example.edu"}}',
                InstallLatestAwsSdk: true
            },
            DependsOn: [
                'pccsdlcmyappsesverifytestVerifyDomainIdentityCustomResourcePolicy4BE20186'
            ],
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlcmyappsesverifytestVerifyDomainIdentityCustomResourcePolicy4BE20186: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: ['ses:VerifyDomainIdentity', 'ses:DeleteIdentity'],
                            Effect: 'Allow',
                            Resource: '*'
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlcmyappsesverifytestVerifyDomainIdentityCustomResourcePolicy4BE20186',
                Roles: [
                    {
                        Ref: 'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2'
                    }
                ]
            }
        },
        pccsdlcmyappsesverifytestSesVerificationRecord5CAAC1A0: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                HostedZoneId: 'DUMMY',
                Name: '_amazonses.test.dev.example.edu.',
                ResourceRecords: [
                    {
                        'Fn::Join': [
                            '',
                            [
                                '"',
                                {
                                    'Fn::GetAtt': [
                                        'pccsdlcmyappsesverifytestVerifyDomainIdentityE052339E',
                                        'VerificationToken'
                                    ]
                                },
                                '"'
                            ]
                        ]
                    }
                ],
                TTL: '1800',
                Type: 'TXT'
            },
            DependsOn: [
                'pccsdlcmyappsesverifytestVerifyDomainIdentityCustomResourcePolicy4BE20186',
                'pccsdlcmyappsesverifytestVerifyDomainIdentityE052339E'
            ]
        },
        pccsdlcmyappsesverifytestVerifyDomainDkim21798902: {
            Type: 'Custom::AWS',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': ['AWS679f53fac002430cb0da5b7982bd22872D164C4C', 'Arn']
                },
                Create: '{"service":"SES","action":"verifyDomainDkim","parameters":{"Domain":"test.dev.example.edu"},"physicalResourceId":{"id":"test.dev.example.edu-verify-domain-dkim"}}',
                Update: '{"service":"SES","action":"verifyDomainDkim","parameters":{"Domain":"test.dev.example.edu"},"physicalResourceId":{"id":"test.dev.example.edu-verify-domain-dkim"}}',
                InstallLatestAwsSdk: true
            },
            DependsOn: [
                'pccsdlcmyappsesverifytestVerifyDomainDkimCustomResourcePolicyD5E756D9',
                'pccsdlcmyappsesverifytestVerifyDomainIdentityCustomResourcePolicy4BE20186',
                'pccsdlcmyappsesverifytestVerifyDomainIdentityE052339E'
            ],
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlcmyappsesverifytestVerifyDomainDkimCustomResourcePolicyD5E756D9: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 'ses:VerifyDomainDkim',
                            Effect: 'Allow',
                            Resource: '*'
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlcmyappsesverifytestVerifyDomainDkimCustomResourcePolicyD5E756D9',
                Roles: [
                    {
                        Ref: 'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2'
                    }
                ]
            },
            DependsOn: [
                'pccsdlcmyappsesverifytestVerifyDomainIdentityCustomResourcePolicy4BE20186',
                'pccsdlcmyappsesverifytestVerifyDomainIdentityE052339E'
            ]
        },
        pccsdlcmyappsesverifytestSesDkimVerificationRecord043B916AD: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                HostedZoneId: 'DUMMY',
                Name: {
                    'Fn::Join': [
                        '',
                        [
                            {
                                'Fn::GetAtt': [
                                    'pccsdlcmyappsesverifytestVerifyDomainDkim21798902',
                                    'DkimTokens.0'
                                ]
                            },
                            '._domainkey.test.dev.example.edu.'
                        ]
                    ]
                },
                ResourceRecords: [
                    {
                        'Fn::Join': [
                            '',
                            [
                                {
                                    'Fn::GetAtt': [
                                        'pccsdlcmyappsesverifytestVerifyDomainDkim21798902',
                                        'DkimTokens.0'
                                    ]
                                },
                                '.dkim.amazonses.com'
                            ]
                        ]
                    }
                ],
                TTL: '1800',
                Type: 'CNAME'
            },
            DependsOn: [
                'pccsdlcmyappsesverifytestVerifyDomainDkimCustomResourcePolicyD5E756D9',
                'pccsdlcmyappsesverifytestVerifyDomainDkim21798902'
            ]
        },
        pccsdlcmyappsesverifytestSesDkimVerificationRecord1B5DB9210: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                HostedZoneId: 'DUMMY',
                Name: {
                    'Fn::Join': [
                        '',
                        [
                            {
                                'Fn::GetAtt': [
                                    'pccsdlcmyappsesverifytestVerifyDomainDkim21798902',
                                    'DkimTokens.1'
                                ]
                            },
                            '._domainkey.test.dev.example.edu.'
                        ]
                    ]
                },
                ResourceRecords: [
                    {
                        'Fn::Join': [
                            '',
                            [
                                {
                                    'Fn::GetAtt': [
                                        'pccsdlcmyappsesverifytestVerifyDomainDkim21798902',
                                        'DkimTokens.1'
                                    ]
                                },
                                '.dkim.amazonses.com'
                            ]
                        ]
                    }
                ],
                TTL: '1800',
                Type: 'CNAME'
            },
            DependsOn: [
                'pccsdlcmyappsesverifytestVerifyDomainDkimCustomResourcePolicyD5E756D9',
                'pccsdlcmyappsesverifytestVerifyDomainDkim21798902'
            ]
        },
        pccsdlcmyappsesverifytestSesDkimVerificationRecord265DB581E: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                HostedZoneId: 'DUMMY',
                Name: {
                    'Fn::Join': [
                        '',
                        [
                            {
                                'Fn::GetAtt': [
                                    'pccsdlcmyappsesverifytestVerifyDomainDkim21798902',
                                    'DkimTokens.2'
                                ]
                            },
                            '._domainkey.test.dev.example.edu.'
                        ]
                    ]
                },
                ResourceRecords: [
                    {
                        'Fn::Join': [
                            '',
                            [
                                {
                                    'Fn::GetAtt': [
                                        'pccsdlcmyappsesverifytestVerifyDomainDkim21798902',
                                        'DkimTokens.2'
                                    ]
                                },
                                '.dkim.amazonses.com'
                            ]
                        ]
                    }
                ],
                TTL: '1800',
                Type: 'CNAME'
            },
            DependsOn: [
                'pccsdlcmyappsesverifytestVerifyDomainDkimCustomResourcePolicyD5E756D9',
                'pccsdlcmyappsesverifytestVerifyDomainDkim21798902'
            ]
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
                ],
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        AWS679f53fac002430cb0da5b7982bd22872D164C4C: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-2222-us-west-2',
                    S3Key: MatchHelper.endsWith('zip')
                },
                Handler: 'index.handler',
                Role: {
                    'Fn::GetAtt': [
                        'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2',
                        'Arn'
                    ]
                },
                Runtime: 'nodejs18.x',
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                Timeout: 120
            },
            DependsOn: ['AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2']
        },
        pccsdlcmyapptg1E18EDE5: {
            Type: 'AWS::ElasticLoadBalancingV2::TargetGroup',
            Properties: {
                Name: 'pcc-sdlc-myapp-tg',
                Port: 80,
                Protocol: 'HTTP',
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                TargetGroupAttributes: [{Key: 'stickiness.enabled', Value: 'false'}],
                TargetType: 'ip',
                VpcId: 'vpc-12345'
            }
        },
        pccsdlcmyapplistenerrule10003C2FE33: {
            Type: 'AWS::ElasticLoadBalancingV2::ListenerRule',
            Properties: {
                Actions: [
                    {
                        TargetGroupArn: {Ref: 'pccsdlcmyapptg1E18EDE5'},
                        Type: 'forward'
                    }
                ],
                Conditions: [
                    {
                        Field: 'host-header',
                        HostHeaderConfig: {Values: ['test.dev.example.edu']}
                    }
                ],
                ListenerArn: 'arn:aws:elasticloadbalancing:us-west-2:123456789012:listener/application/my-load-balancer/50dc6c495c0c9188/f2f7dc8efc522ab2',
                Priority: 100
            }
        },
        pccsdlcmyappdlqAB5BBAC4: {
            Type: 'AWS::SQS::Queue',
            Properties: {
                KmsMasterKeyId: 'alias/aws/sqs',
                MessageRetentionPeriod: 259200,
                QueueName: 'pcc-sdlc-myapp-dlq',
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlcmyappqueue069E607A: {
            Type: 'AWS::SQS::Queue',
            Properties: {
                KmsMasterKeyId: 'alias/aws/sqs',
                QueueName: 'pcc-sdlc-myapp-queue',
                RedrivePolicy: {
                    deadLetterTargetArn: {'Fn::GetAtt': ['pccsdlcmyappdlqAB5BBAC4', 'Arn']},
                    maxReceiveCount: 3
                },
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlcmyappcluster4E9F2DE3: {
            Type: 'AWS::ECS::Cluster',
            Properties: {
                ClusterName: 'pcc-sdlc-myapp-cluster',
                ClusterSettings: [{Name: 'containerInsights', Value: 'disabled'}],
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlcmyapptaskdefscheduledtask0execrole253CB36D: {
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
                },
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {
                        Key: 'aws-cdk:id',
                        Value: 'pccsharedstackpccsdlcmyapp6F659917_c8123df86de9aa7f08137c98c6c5d84f0ce6535dd2'
                    },
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlcmyapptaskdefscheduledtask0execroleDefaultPolicyB28A7122: {
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
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {Ref: 'AWS::Partition'},
                                        ':ecr:us-east-1:12344:repository/pcc-myapp/phpfpm'
                                    ]
                                ]
                            }
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
                                    'pccsdlcmyappcontainerphpfpmscheduledtaskst0loggroupF6594B4E',
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
                            Resource: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-shared-secrets/environment-DEF456'
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlcmyapptaskdefscheduledtask0execroleDefaultPolicyB28A7122',
                Roles: [
                    {
                        Ref: 'pccsdlcmyapptaskdefscheduledtask0execrole253CB36D'
                    }
                ]
            }
        },
        pccsdlcmyapptaskdefscheduledtask0TaskRoleC9F469E3: {
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
                },
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlcmyapptaskdefscheduledtask0TaskRoleDefaultPolicy393992EC: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: [
                                'sqs:SendMessage',
                                'sqs:GetQueueAttributes',
                                'sqs:GetQueueUrl'
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': ['pccsdlcmyappqueue069E607A', 'Arn']
                            }
                        },
                        {
                            Action: ['ses:SendEmail', 'ses:SendRawEmail'],
                            Effect: 'Allow',
                            Resource: '*'
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlcmyapptaskdefscheduledtask0TaskRoleDefaultPolicy393992EC',
                Roles: [
                    {
                        Ref: 'pccsdlcmyapptaskdefscheduledtask0TaskRoleC9F469E3'
                    }
                ]
            }
        },
        pccsdlcmyapptaskdefscheduledtask0DC6034F0: {
            Type: 'AWS::ECS::TaskDefinition',
            Properties: {
                ContainerDefinitions: [
                    {
                        Command: ['artisan', 'catalyst:daily'],
                        Cpu: 256,
                        EntryPoint: ['/usr/local/bin/php'],
                        Environment: [
                            {
                                Name: 'MAIL_FROM_ADDRESS',
                                Value: 'no-reply@test.dev.example.edu'
                            },
                            {
                                Name: 'IMPORTER_FROM',
                                Value: 'importer-no-reply@test.dev.example.edu'
                            },
                            {
                                Name: 'SQS_QUEUE',
                                Value: {Ref: 'pccsdlcmyappqueue069E607A'}
                            },
                            {
                                Name: 'AWS_SECRET_ARN',
                                Value: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':secretsmanager:us-west-2:2222:secret:pcc-sdlc-myapp-secrets/environment'
                                        ]
                                    ]
                                }
                            },
                            {
                                Name: 'AWS_SHARED_SECRET_ARN',
                                Value: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-shared-secrets/environment-DEF456'
                            },
                            {Name: 'AWS_APP_NAME', Value: 'pcc-sdlc-myapp'},
                    { Name: 'CAN_RUN_CREATE', Value: '0' }
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
                                                        'Fn::Join': [
                                                            '',
                                                            [
                                                                'arn:',
                                                                {Ref: 'AWS::Partition'},
                                                                ':ecr:us-east-1:12344:repository/pcc-myapp/phpfpm'
                                                            ]
                                                        ]
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
                                                        'Fn::Join': [
                                                            '',
                                                            [
                                                                'arn:',
                                                                {Ref: 'AWS::Partition'},
                                                                ':ecr:us-east-1:12344:repository/pcc-myapp/phpfpm'
                                                            ]
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    '.',
                                    {Ref: 'AWS::URLSuffix'},
                                    '/pcc-myapp/phpfpm:1'
                                ]
                            ]
                        },
                        LogConfiguration: {
                            LogDriver: 'awslogs',
                            Options: {
                                'awslogs-group': {
                                    Ref: 'pccsdlcmyappcontainerphpfpmscheduledtaskst0loggroupF6594B4E'
                                },
                                'awslogs-stream-prefix': 'phpfpm',
                                'awslogs-region': 'us-west-2'
                            }
                        },
                        Memory: 512,
                        Name: 'pcc-sdlc-myapp-container-phpfpm-scheduledtask-st-0',
                        ReadonlyRootFilesystem: true,
                        Secrets: [
                            {
                                Name: 'FOO',
                                ValueFrom: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-shared-secrets/environment-DEF456:FOO::'
                            },
                            {
                                Name: 'BAR',
                                ValueFrom: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-shared-secrets/environment-DEF456:BAR::'
                            }
                        ]
                    }
                ],
                Cpu: '256',
                ExecutionRoleArn: {
                    'Fn::GetAtt': [
                        'pccsdlcmyapptaskdefscheduledtask0execrole253CB36D',
                        'Arn'
                    ]
                },
                Family: 'pcc-sdlc-myapp-task-def-scheduledtask-0',
                Memory: '512',
                NetworkMode: 'awsvpc',
                RequiresCompatibilities: ['FARGATE'],
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                TaskRoleArn: {
                    'Fn::GetAtt': [
                        'pccsdlcmyapptaskdefscheduledtask0TaskRoleC9F469E3',
                        'Arn'
                    ]
                }
            }
        },
        pccsdlcmyapptaskdefscheduledtask0EventsRole73440933: {
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
                },
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlcmyapptaskdefscheduledtask0EventsRoleDefaultPolicy9563716F: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 'ecs:RunTask',
                            Condition: {
                                ArnEquals: {
                                    'ecs:cluster': {
                                        'Fn::GetAtt': ['pccsdlcmyappcluster4E9F2DE3', 'Arn']
                                    }
                                }
                            },
                            Effect: 'Allow',
                            Resource: {Ref: 'pccsdlcmyapptaskdefscheduledtask0DC6034F0'}
                        },
                        {
                            Action: 'iam:PassRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'pccsdlcmyapptaskdefscheduledtask0execrole253CB36D',
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: 'iam:PassRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'pccsdlcmyapptaskdefscheduledtask0TaskRoleC9F469E3',
                                    'Arn'
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlcmyapptaskdefscheduledtask0EventsRoleDefaultPolicy9563716F',
                Roles: [
                    {
                        Ref: 'pccsdlcmyapptaskdefscheduledtask0EventsRole73440933'
                    }
                ]
            }
        },
        pccsdlcmyapptaskdefscheduledtask0SecurityGroup55A61535: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                GroupDescription: 'pcc-shared-stack/pcc-sdlc-myapp/pcc-sdlc-myapp-task-def-scheduledtask-0/SecurityGroup',
                SecurityGroupEgress: [
                    {
                        CidrIp: '0.0.0.0/0',
                        Description: 'Allow all outbound traffic by default',
                        IpProtocol: '-1'
                    }
                ],
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                VpcId: 'vpc-12345'
            }
        },
        pccsdlcmyappcontainerphpfpmscheduledtaskst0loggroupF6594B4E: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                LogGroupName: 'pcc-sdlc-myapp-container-phpfpm-scheduledtask-st-0-log-group',
                RetentionInDays: 30,
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlcmyapptaskscheduledtask0ScheduledEventRuleC595C301: {
            Type: 'AWS::Events::Rule',
            Properties: {
                Name: 'pcc-sdlc-myapp-task-scheduledtask-0',
                ScheduleExpression: 'cron(0 12 * * ? *)',
                State: 'ENABLED',
                Targets: [
                    {
                        Arn: {
                            'Fn::GetAtt': ['pccsdlcmyappcluster4E9F2DE3', 'Arn']
                        },
                        EcsParameters: {
                            LaunchType: 'FARGATE',
                            NetworkConfiguration: {
                                AwsVpcConfiguration: {
                                    AssignPublicIp: 'DISABLED',
                                    SecurityGroups: [
                                        {
                                            'Fn::GetAtt': [
                                                'pccsdlcmyapptaskdefscheduledtask0SecurityGroup55A61535',
                                                'GroupId'
                                            ]
                                        }
                                    ],
                                    Subnets: ['p-12345', 'p-67890']
                                }
                            },
                            PlatformVersion: 'LATEST',
                            TaskCount: 1,
                            TaskDefinitionArn: {Ref: 'pccsdlcmyapptaskdefscheduledtask0DC6034F0'}
                        },
                        Id: 'Target0',
                        Input: '{}',
                        RoleArn: {
                            'Fn::GetAtt': [
                                'pccsdlcmyapptaskdefscheduledtask0EventsRole73440933',
                                'Arn'
                            ]
                        }
                    }
                ]
            }
        },
        pccsdlcmyapptaskdefweb0execrole32538409: {
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
                },
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {
                        Key: 'aws-cdk:id',
                        Value: 'pccsharedstackpccsdlcmyapp6F659917_c8c2883eedf18aff6d7bb3e69c33e4acc1c5472efa'
                    },
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlcmyapptaskdefweb0execroleDefaultPolicyF933D5F4: {
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
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {Ref: 'AWS::Partition'},
                                        ':ecr:us-east-1:12344:repository/pcc-myapp/nginx'
                                    ]
                                ]
                            }
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
                                    'pccsdlcmyappcontainernginxwebu0loggroup46546295',
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
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {Ref: 'AWS::Partition'},
                                        ':ecr:us-east-1:12344:repository/pcc-myapp/phpfpm'
                                    ]
                                ]
                            }
                        },
                        {
                            Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'pccsdlcmyappcontainerphpfpmwebu0loggroupDD777995',
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
                            Resource: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-shared-secrets/environment-DEF456'
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlcmyapptaskdefweb0execroleDefaultPolicyF933D5F4',
                Roles: [{Ref: 'pccsdlcmyapptaskdefweb0execrole32538409'}]
            }
        },
        pccsdlcmyapptaskdefweb0TaskRole44A5F54B: {
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
                },
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlcmyapptaskdefweb0TaskRoleDefaultPolicy4427BD76: {
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
                        },
                        {
                            Action: [
                                'sqs:SendMessage',
                                'sqs:GetQueueAttributes',
                                'sqs:GetQueueUrl'
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': ['pccsdlcmyappqueue069E607A', 'Arn']
                            }
                        },
                        {
                            Action: ['ses:SendEmail', 'ses:SendRawEmail'],
                            Effect: 'Allow',
                            Resource: '*'
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlcmyapptaskdefweb0TaskRoleDefaultPolicy4427BD76',
                Roles: [{Ref: 'pccsdlcmyapptaskdefweb0TaskRole44A5F54B'}]
            }
        },
        pccsdlcmyapptaskdefweb0C12FF3F1: {
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
                                                        'Fn::Join': [
                                                            '',
                                                            [
                                                                'arn:',
                                                                {Ref: 'AWS::Partition'},
                                                                ':ecr:us-east-1:12344:repository/pcc-myapp/nginx'
                                                            ]
                                                        ]
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
                                                        'Fn::Join': [
                                                            '',
                                                            [
                                                                'arn:',
                                                                {Ref: 'AWS::Partition'},
                                                                ':ecr:us-east-1:12344:repository/pcc-myapp/nginx'
                                                            ]
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    '.',
                                    {Ref: 'AWS::URLSuffix'},
                                    '/pcc-myapp/nginx:1'
                                ]
                            ]
                        },
                        LogConfiguration: {
                            LogDriver: 'awslogs',
                            Options: {
                                'awslogs-group': {
                                    Ref: 'pccsdlcmyappcontainernginxwebu0loggroup46546295'
                                },
                                'awslogs-stream-prefix': 'nginx',
                                'awslogs-region': 'us-west-2'
                            }
                        },
                        Memory: 64,
                        Name: 'pcc-sdlc-myapp-container-nginx-web-u-0',
                        PortMappings: [{ContainerPort: 80, Protocol: 'tcp'}],
                        ReadonlyRootFilesystem: true
                    },
                    {
                        Cpu: 128,
                        Environment: [
                            {
                                Name: 'MAIL_FROM_ADDRESS',
                                Value: 'no-reply@test.dev.example.edu'
                            },
                            {
                                Name: 'IMPORTER_FROM',
                                Value: 'importer-no-reply@test.dev.example.edu'
                            },
                            {
                                Name: 'SQS_QUEUE',
                                Value: {Ref: 'pccsdlcmyappqueue069E607A'}
                            },
                            {
                                Name: 'AWS_SECRET_ARN',
                                Value: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':secretsmanager:us-west-2:2222:secret:pcc-sdlc-myapp-secrets/environment'
                                        ]
                                    ]
                                }
                            },
                            {
                                Name: 'AWS_SHARED_SECRET_ARN',
                                Value: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-shared-secrets/environment-DEF456'
                            },
                            {Name: 'AWS_APP_NAME', Value: 'pcc-sdlc-myapp'},
                    { Name: 'CAN_RUN_CREATE', Value: '0' }
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
                                                        'Fn::Join': [
                                                            '',
                                                            [
                                                                'arn:',
                                                                {Ref: 'AWS::Partition'},
                                                                ':ecr:us-east-1:12344:repository/pcc-myapp/phpfpm'
                                                            ]
                                                        ]
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
                                                        'Fn::Join': [
                                                            '',
                                                            [
                                                                'arn:',
                                                                {Ref: 'AWS::Partition'},
                                                                ':ecr:us-east-1:12344:repository/pcc-myapp/phpfpm'
                                                            ]
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    '.',
                                    {Ref: 'AWS::URLSuffix'},
                                    '/pcc-myapp/phpfpm:1'
                                ]
                            ]
                        },
                        LogConfiguration: {
                            LogDriver: 'awslogs',
                            Options: {
                                'awslogs-group': {
                                    Ref: 'pccsdlcmyappcontainerphpfpmwebu0loggroupDD777995'
                                },
                                'awslogs-stream-prefix': 'phpfpm',
                                'awslogs-region': 'us-west-2'
                            }
                        },
                        Memory: 128,
                        Name: 'pcc-sdlc-myapp-container-phpfpm-web-u-0',
                        PortMappings: [{ContainerPort: 9000, Protocol: 'tcp'}],
                        ReadonlyRootFilesystem: true,
                        Secrets: [
                            {
                                Name: 'FOO',
                                ValueFrom: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-shared-secrets/environment-DEF456:FOO::'
                            },
                            {
                                Name: 'BAR',
                                ValueFrom: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-shared-secrets/environment-DEF456:BAR::'
                            }
                        ]
                    }
                ],
                Cpu: '512',
                ExecutionRoleArn: {
                    'Fn::GetAtt': ['pccsdlcmyapptaskdefweb0execrole32538409', 'Arn']
                },
                Family: 'pcc-sdlc-myapp-task-def-web-0',
                Memory: '1024',
                NetworkMode: 'awsvpc',
                RequiresCompatibilities: ['FARGATE'],
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                TaskRoleArn: {
                    'Fn::GetAtt': ['pccsdlcmyapptaskdefweb0TaskRole44A5F54B', 'Arn']
                }
            }
        },
        pccsdlcmyappcontainernginxwebu0loggroup46546295: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                LogGroupName: 'pcc-sdlc-myapp-container-nginx-web-u-0-log-group',
                RetentionInDays: 30,
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlcmyappcontainerphpfpmwebu0loggroupDD777995: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                LogGroupName: 'pcc-sdlc-myapp-container-phpfpm-web-u-0-log-group',
                RetentionInDays: 30,
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlcmyappserviceweb0Service28A2C321: {
            Type: 'AWS::ECS::Service',
            Properties: {
                Cluster: {Ref: 'pccsdlcmyappcluster4E9F2DE3'},
                DeploymentConfiguration: {
                    Alarms: {AlarmNames: [], Enable: false, Rollback: false},
                    MaximumPercent: 200,
                    MinimumHealthyPercent: 50
                },
                DesiredCount: 1,
                EnableECSManagedTags: false,
                EnableExecuteCommand: true,
                HealthCheckGracePeriodSeconds: 60,
                LaunchType: 'FARGATE',
                LoadBalancers: [
                    {
                        ContainerName: 'pcc-sdlc-myapp-container-nginx-web-u-0',
                        ContainerPort: 80,
                        TargetGroupArn: {Ref: 'pccsdlcmyapptg1E18EDE5'}
                    }
                ],
                NetworkConfiguration: {
                    AwsvpcConfiguration: {
                        AssignPublicIp: 'DISABLED',
                        SecurityGroups: [
                            {
                                'Fn::GetAtt': [
                                    'pccsdlcmyappserviceweb0SecurityGroupEA0D4069',
                                    'GroupId'
                                ]
                            }
                        ],
                        Subnets: ['p-12345', 'p-67890']
                    }
                },
                PlatformVersion: 'LATEST',
                ServiceName: 'pcc-sdlc-myapp-service-web-0',
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                TaskDefinition: {Ref: 'pccsdlcmyapptaskdefweb0C12FF3F1'}
            },
            DependsOn: [
                'pccsdlcmyapplistenerrule10003C2FE33',
                'pccsdlcmyapptaskdefweb0TaskRoleDefaultPolicy4427BD76',
                'pccsdlcmyapptaskdefweb0TaskRole44A5F54B'
            ]
        },
        pccsdlcmyappserviceweb0SecurityGroupEA0D4069: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                GroupDescription: 'pcc-shared-stack/pcc-sdlc-myapp/pcc-sdlc-myapp-service-web-0/SecurityGroup',
                SecurityGroupEgress: [
                    {
                        CidrIp: '0.0.0.0/0',
                        Description: 'Allow all outbound traffic by default',
                        IpProtocol: '-1'
                    }
                ],
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                VpcId: 'vpc-12345'
            },
            DependsOn: [
                'pccsdlcmyapptaskdefweb0TaskRoleDefaultPolicy4427BD76',
                'pccsdlcmyapptaskdefweb0TaskRole44A5F54B'
            ]
        },
        pccsdlcmyappserviceweb0SecurityGroupfrompccsharedstackpccsdlcmyapplookuphttpslistenerSecurityGroupsg123456789012543CF5BD804E7E318F: {
            Type: 'AWS::EC2::SecurityGroupIngress',
            Properties: {
                Description: 'Load balancer to target',
                FromPort: 80,
                GroupId: {
                    'Fn::GetAtt': [
                        'pccsdlcmyappserviceweb0SecurityGroupEA0D4069',
                        'GroupId'
                    ]
                },
                IpProtocol: 'tcp',
                SourceSecurityGroupId: 'sg-12345678',
                ToPort: 80
            },
            DependsOn: [
                'pccsdlcmyapptaskdefweb0TaskRoleDefaultPolicy4427BD76',
                'pccsdlcmyapptaskdefweb0TaskRole44A5F54B'
            ]
        },
        pccsdlcmyappserviceweb0TaskCountTargetC0BDCD4E: {
            Type: 'AWS::ApplicationAutoScaling::ScalableTarget',
            Properties: {
                MaxCapacity: 3,
                MinCapacity: 1,
                ResourceId: {
                    'Fn::Join': [
                        '',
                        [
                            'service/',
                            {Ref: 'pccsdlcmyappcluster4E9F2DE3'},
                            '/',
                            {
                                'Fn::GetAtt': ['pccsdlcmyappserviceweb0Service28A2C321', 'Name']
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
                            ':iam::2222:role/aws-service-role/ecs.application-autoscaling.amazonaws.com/AWSServiceRoleForApplicationAutoScaling_ECSService'
                        ]
                    ]
                },
                ScalableDimension: 'ecs:service:DesiredCount',
                ServiceNamespace: 'ecs'
            },
            DependsOn: [
                'pccsdlcmyapptaskdefweb0TaskRoleDefaultPolicy4427BD76',
                'pccsdlcmyapptaskdefweb0TaskRole44A5F54B'
            ]
        },
        pccsdlcmyappserviceweb0TaskCountTargetpccsdlcmyappservicescalecpu580E5A4F: {
            Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
            Properties: {
                PolicyName: 'pccsharedstackpccsdlcmyapppccsdlcmyappserviceweb0TaskCountTargetpccsdlcmyappservicescalecpu43CE0804',
                PolicyType: 'TargetTrackingScaling',
                ScalingTargetId: {Ref: 'pccsdlcmyappserviceweb0TaskCountTargetC0BDCD4E'},
                TargetTrackingScalingPolicyConfiguration: {
                    PredefinedMetricSpecification: {PredefinedMetricType: 'ECSServiceAverageCPUUtilization'},
                    TargetValue: 75
                }
            },
            DependsOn: [
                'pccsdlcmyapptaskdefweb0TaskRoleDefaultPolicy4427BD76',
                'pccsdlcmyapptaskdefweb0TaskRole44A5F54B'
            ]
        },
        pccsdlcmyappserviceweb0TaskCountTargetpccsdlcmyappservicescalememB0AA1F75: {
            Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
            Properties: {
                PolicyName: 'pccsharedstackpccsdlcmyapppccsdlcmyappserviceweb0TaskCountTargetpccsdlcmyappservicescalemem27F521B3',
                PolicyType: 'TargetTrackingScaling',
                ScalingTargetId: {Ref: 'pccsdlcmyappserviceweb0TaskCountTargetC0BDCD4E'},
                TargetTrackingScalingPolicyConfiguration: {
                    PredefinedMetricSpecification: {
                        PredefinedMetricType: 'ECSServiceAverageMemoryUtilization'
                    },
                    TargetValue: 75
                }
            },
            DependsOn: [
                'pccsdlcmyapptaskdefweb0TaskRoleDefaultPolicy4427BD76',
                'pccsdlcmyapptaskdefweb0TaskRole44A5F54B'
            ]
        },
        pccsdlcmyappservicequeue0loggroup9DDCB13E: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                LogGroupName: 'pcc-sdlc-myapp-service-queue-0-log-group',
                RetentionInDays: 30,
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleECEB1AA4: {
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
                },
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleDefaultPolicyDBA3B087: {
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
                                'Fn::GetAtt': ['pccsdlcmyappqueue069E607A', 'Arn']
                            }
                        },
                        {
                            Action: [
                                'sqs:SendMessage',
                                'sqs:GetQueueAttributes',
                                'sqs:GetQueueUrl'
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': ['pccsdlcmyappqueue069E607A', 'Arn']
                            }
                        },
                        {
                            Action: [
                                'sqs:PurgeQueue',
                                'sqs:GetQueueAttributes',
                                'sqs:GetQueueUrl'
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': ['pccsdlcmyappqueue069E607A', 'Arn']
                            }
                        },
                        {
                            Action: ['ses:SendEmail', 'ses:SendRawEmail'],
                            Effect: 'Allow',
                            Resource: '*'
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleDefaultPolicyDBA3B087',
                Roles: [
                    {
                        Ref: 'pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleECEB1AA4'
                    }
                ]
            }
        },
        pccsdlcmyappservicequeue0QueueProcessingTaskDef277B33FF: {
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
                            {
                                Name: 'QUEUE_NAME',
                                Value: {
                                    'Fn::GetAtt': ['pccsdlcmyappqueue069E607A', 'QueueName']
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
                                                        'Fn::Join': [
                                                            '',
                                                            [
                                                                'arn:',
                                                                {Ref: 'AWS::Partition'},
                                                                ':ecr:us-east-1:12344:repository/pcc-myapp/phpfpm'
                                                            ]
                                                        ]
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
                                                        'Fn::Join': [
                                                            '',
                                                            [
                                                                'arn:',
                                                                {Ref: 'AWS::Partition'},
                                                                ':ecr:us-east-1:12344:repository/pcc-myapp/phpfpm'
                                                            ]
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    '.',
                                    {Ref: 'AWS::URLSuffix'},
                                    '/pcc-myapp/phpfpm:1'
                                ]
                            ]
                        },
                        LogConfiguration: {
                            LogDriver: 'awslogs',
                            Options: {
                                'awslogs-group': {Ref: 'pccsdlcmyappservicequeue0loggroup9DDCB13E'},
                                'awslogs-stream-prefix': 'phpfpm',
                                'awslogs-region': 'us-west-2'
                            }
                        },
                        Name: 'QueueProcessingContainer',
                        Secrets: [
                            {
                                Name: 'FOO',
                                ValueFrom: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-shared-secrets/environment-DEF456:FOO::'
                            },
                            {
                                Name: 'BAR',
                                ValueFrom: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-shared-secrets/environment-DEF456:BAR::'
                            }
                        ]
                    }
                ],
                Cpu: '256',
                ExecutionRoleArn: {
                    'Fn::GetAtt': [
                        'pccsdlcmyappservicequeue0QueueProcessingTaskDefExecutionRoleC60C75CA',
                        'Arn'
                    ]
                },
                Family: 'pcc-sdlc-myapp-service-queue-0',
                Memory: '512',
                NetworkMode: 'awsvpc',
                RequiresCompatibilities: ['FARGATE'],
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                TaskRoleArn: {
                    'Fn::GetAtt': [
                        'pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleECEB1AA4',
                        'Arn'
                    ]
                }
            }
        },
        pccsdlcmyappservicequeue0QueueProcessingTaskDefExecutionRoleC60C75CA: {
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
                },
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {
                        Key: 'aws-cdk:id',
                        Value: 'pccsharedstackpccsdlcmyapp6F659917_c8d405c8da7563e75c62ee4e93b91a3deb6ceb6bc1'
                    },
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlcmyappservicequeue0QueueProcessingTaskDefExecutionRoleDefaultPolicy7AFB8ADD: {
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
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {Ref: 'AWS::Partition'},
                                        ':ecr:us-east-1:12344:repository/pcc-myapp/phpfpm'
                                    ]
                                ]
                            }
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
                                    'pccsdlcmyappservicequeue0loggroup9DDCB13E',
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
                            Resource: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-shared-secrets/environment-DEF456'
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlcmyappservicequeue0QueueProcessingTaskDefExecutionRoleDefaultPolicy7AFB8ADD',
                Roles: [
                    {
                        Ref: 'pccsdlcmyappservicequeue0QueueProcessingTaskDefExecutionRoleC60C75CA'
                    }
                ]
            }
        },
        pccsdlcmyappservicequeue0QueueProcessingFargateServiceF0BE3522: {
            Type: 'AWS::ECS::Service',
            Properties: {
                Cluster: {Ref: 'pccsdlcmyappcluster4E9F2DE3'},
                DeploymentConfiguration: {
                    Alarms: {AlarmNames: [], Enable: false, Rollback: false},
                    MaximumPercent: 200,
                    MinimumHealthyPercent: 50
                },
                EnableECSManagedTags: false,
                LaunchType: 'FARGATE',
                NetworkConfiguration: {
                    AwsvpcConfiguration: {
                        AssignPublicIp: 'DISABLED',
                        SecurityGroups: [
                            {
                                'Fn::GetAtt': [
                                    'pccsdlcmyappservicequeue0QueueProcessingFargateServiceSecurityGroup5B7C2C6C',
                                    'GroupId'
                                ]
                            }
                        ],
                        Subnets: ['p-12345', 'p-67890']
                    }
                },
                PlatformVersion: 'LATEST',
                ServiceName: 'pcc-sdlc-myapp-service-queue-0',
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                TaskDefinition: {
                    Ref: 'pccsdlcmyappservicequeue0QueueProcessingTaskDef277B33FF'
                }
            },
            DependsOn: [
                'pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleDefaultPolicyDBA3B087',
                'pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleECEB1AA4'
            ]
        },
        pccsdlcmyappservicequeue0QueueProcessingFargateServiceSecurityGroup5B7C2C6C: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                GroupDescription: 'pcc-shared-stack/pcc-sdlc-myapp/pcc-sdlc-myapp-service-queue-0/QueueProcessingFargateService/SecurityGroup',
                SecurityGroupEgress: [
                    {
                        CidrIp: '0.0.0.0/0',
                        Description: 'Allow all outbound traffic by default',
                        IpProtocol: '-1'
                    }
                ],
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                VpcId: 'vpc-12345'
            },
            DependsOn: [
                'pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleDefaultPolicyDBA3B087',
                'pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleECEB1AA4'
            ]
        },
        pccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetCE82EEC2: {
            Type: 'AWS::ApplicationAutoScaling::ScalableTarget',
            Properties: {
                MaxCapacity: 2,
                MinCapacity: 0,
                ResourceId: {
                    'Fn::Join': [
                        '',
                        [
                            'service/',
                            {Ref: 'pccsdlcmyappcluster4E9F2DE3'},
                            '/',
                            {
                                'Fn::GetAtt': [
                                    'pccsdlcmyappservicequeue0QueueProcessingFargateServiceF0BE3522',
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
                            ':iam::2222:role/aws-service-role/ecs.application-autoscaling.amazonaws.com/AWSServiceRoleForApplicationAutoScaling_ECSService'
                        ]
                    ]
                },
                ScalableDimension: 'ecs:service:DesiredCount',
                ServiceNamespace: 'ecs'
            },
            DependsOn: [
                'pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleDefaultPolicyDBA3B087',
                'pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleECEB1AA4'
            ]
        },
        pccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetCpuScaling1EF49E37: {
            Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
            Properties: {
                PolicyName: 'pccsharedstackpccsdlcmyapppccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetCpuScaling56699606',
                PolicyType: 'TargetTrackingScaling',
                ScalingTargetId: {
                    Ref: 'pccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetCE82EEC2'
                },
                TargetTrackingScalingPolicyConfiguration: {
                    PredefinedMetricSpecification: {PredefinedMetricType: 'ECSServiceAverageCPUUtilization'},
                    TargetValue: 50
                }
            },
            DependsOn: [
                'pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleDefaultPolicyDBA3B087',
                'pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleECEB1AA4'
            ]
        },
        pccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingLowerPolicy0EA8CD56: {
            Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
            Properties: {
                PolicyName: 'pccsharedstackpccsdlcmyapppccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingLowerPolicy9E1B0C0F',
                PolicyType: 'StepScaling',
                ScalingTargetId: {
                    Ref: 'pccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetCE82EEC2'
                },
                StepScalingPolicyConfiguration: {
                    AdjustmentType: 'ChangeInCapacity',
                    MetricAggregationType: 'Maximum',
                    StepAdjustments: [{MetricIntervalUpperBound: 0, ScalingAdjustment: -1}]
                }
            },
            DependsOn: [
                'pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleDefaultPolicyDBA3B087',
                'pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleECEB1AA4'
            ]
        },
        pccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingLowerAlarmBF362659: {
            Type: 'AWS::CloudWatch::Alarm',
            Properties: {
                AlarmActions: [
                    {
                        Ref: 'pccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingLowerPolicy0EA8CD56'
                    }
                ],
                AlarmDescription: 'Lower threshold scaling alarm',
                ComparisonOperator: 'LessThanOrEqualToThreshold',
                Dimensions: [
                    {
                        Name: 'QueueName',
                        Value: {
                            'Fn::GetAtt': ['pccsdlcmyappqueue069E607A', 'QueueName']
                        }
                    }
                ],
                EvaluationPeriods: 1,
                MetricName: 'ApproximateNumberOfMessagesVisible',
                Namespace: 'AWS/SQS',
                Period: 300,
                Statistic: 'Maximum',
                Threshold: 0
            },
            DependsOn: [
                'pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleDefaultPolicyDBA3B087',
                'pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleECEB1AA4'
            ]
        },
        pccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingUpperPolicy49011084: {
            Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
            Properties: {
                PolicyName: 'pccsharedstackpccsdlcmyapppccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingUpperPolicy6BCBC944',
                PolicyType: 'StepScaling',
                ScalingTargetId: {
                    Ref: 'pccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetCE82EEC2'
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
            },
            DependsOn: [
                'pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleDefaultPolicyDBA3B087',
                'pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleECEB1AA4'
            ]
        },
        pccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingUpperAlarm617AF3F0: {
            Type: 'AWS::CloudWatch::Alarm',
            Properties: {
                AlarmActions: [
                    {
                        Ref: 'pccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingUpperPolicy49011084'
                    }
                ],
                AlarmDescription: 'Upper threshold scaling alarm',
                ComparisonOperator: 'GreaterThanOrEqualToThreshold',
                Dimensions: [
                    {
                        Name: 'QueueName',
                        Value: {
                            'Fn::GetAtt': ['pccsdlcmyappqueue069E607A', 'QueueName']
                        }
                    }
                ],
                EvaluationPeriods: 1,
                MetricName: 'ApproximateNumberOfMessagesVisible',
                Namespace: 'AWS/SQS',
                Period: 300,
                Statistic: 'Maximum',
                Threshold: 1
            },
            DependsOn: [
                'pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleDefaultPolicyDBA3B087',
                'pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleECEB1AA4'
            ]
        }
    }
};