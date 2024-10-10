const {MatchHelper} = require("../../../../src/utils/testing/match-helper");
module.exports = {
    Resources: {
        pccprodtesttestexampleeduarecord3CF5C63C: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                AliasTarget: {
                    DNSName: 'dualstack.my-load-balancer-1234567890.us-west-2.elb.amazonaws.com',
                    HostedZoneId: 'Z3DZXE0EXAMPLE'
                },
                Comment: 'pcc-prod-test: test.example.edu',
                HostedZoneId: 'DUMMY',
                Name: 'test.example.edu.',
                Type: 'A'
            }
        },
        pccprodtestsesverifytestVerifyDomainIdentityB3C4D659: {
            Type: 'Custom::AWS',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': ['AWS679f53fac002430cb0da5b7982bd22872D164C4C', 'Arn']
                },
              Create: '{"service":"SES","action":"verifyDomainIdentity","parameters":{"Domain":"test.example.edu"},"physicalResourceId":{"responsePath":"VerificationToken"}}',
              Update: '{"service":"SES","action":"verifyDomainIdentity","parameters":{"Domain":"test.example.edu"},"physicalResourceId":{"responsePath":"VerificationToken"}}',
              Delete: '{"service":"SES","action":"deleteIdentity","parameters":{"Identity":"test.example.edu"}}',
                InstallLatestAwsSdk: true
            },
            DependsOn: [
                'pccprodtestsesverifytestVerifyDomainIdentityCustomResourcePolicyDACCBB6D'
            ],
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccprodtestsesverifytestVerifyDomainIdentityCustomResourcePolicyDACCBB6D: {
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
                PolicyName: 'pccprodtestsesverifytestVerifyDomainIdentityCustomResourcePolicyDACCBB6D',
                Roles: [
                    {
                        Ref: 'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2'
                    }
                ]
            }
        },
        pccprodtestsesverifytestSesNotificationTopicE0DECAC2: {
            Type: 'AWS::SNS::Topic',
            Properties: {
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ]
            },
            DependsOn: [
                'pccprodtestsesverifytestVerifyDomainIdentityCustomResourcePolicyDACCBB6D',
                'pccprodtestsesverifytestVerifyDomainIdentityB3C4D659'
            ]
        },
        pccprodtestsesverifytestAddComplaintTopictestexampleeduDEBDE091: {
            Type: 'Custom::AWS',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': ['AWS679f53fac002430cb0da5b7982bd22872D164C4C', 'Arn']
                },
                Create: {
                    'Fn::Join': [
                        '',
                        [
                            '{"service":"SES","action":"setIdentityNotificationTopic","parameters":{"Identity":"test.example.edu","NotificationType":"Complaint","SnsTopic":"',
                            {
                                Ref: 'pccprodtestsesverifytestSesNotificationTopicE0DECAC2'
                            },
                    '"},"physicalResourceId":{"id":"test.example.edu-set-Complaint-topic"}}'
                        ]
                    ]
                },
                InstallLatestAwsSdk: true
            },
            DependsOn: [
                'pccprodtestsesverifytestAddComplaintTopictestexampleeduCustomResourcePolicy746F326B',
                'pccprodtestsesverifytestSesNotificationTopicE0DECAC2'
            ],
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccprodtestsesverifytestAddComplaintTopictestexampleeduCustomResourcePolicy746F326B: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 'ses:SetIdentityNotificationTopic',
                            Effect: 'Allow',
                            Resource: '*'
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccprodtestsesverifytestAddComplaintTopictestexampleeduCustomResourcePolicy746F326B',
                Roles: [
                    {
                        Ref: 'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2'
                    }
                ]
            },
            DependsOn: ['pccprodtestsesverifytestSesNotificationTopicE0DECAC2']
        },
        pccprodtestsesverifytestSesVerificationRecordEE0838F9: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                HostedZoneId: 'DUMMY',
                Name: '_amazonses.test.example.edu.',
                ResourceRecords: [
                    {
                        'Fn::Join': [
                            '',
                            [
                                '"',
                                {
                                    'Fn::GetAtt': [
                                        'pccprodtestsesverifytestVerifyDomainIdentityB3C4D659',
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
                'pccprodtestsesverifytestVerifyDomainIdentityCustomResourcePolicyDACCBB6D',
                'pccprodtestsesverifytestVerifyDomainIdentityB3C4D659'
            ]
        },
        pccprodtestsesverifytestSesMxRecord14A765C0: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                HostedZoneId: 'DUMMY',
                Name: 'test.example.edu.',
                ResourceRecords: [
                    {
                        'Fn::Join': [
                            '',
                            [
                                '10 ',
                                {
                                    'Fn::Sub': 'inbound-smtp.${AWS::Region}.amazonaws.com'
                                }
                            ]
                        ]
                    }
                ],
                TTL: '1800',
                Type: 'MX'
            },
            DependsOn: [
                'pccprodtestsesverifytestVerifyDomainIdentityCustomResourcePolicyDACCBB6D',
                'pccprodtestsesverifytestVerifyDomainIdentityB3C4D659'
            ]
        },
        pccprodtestsesverifytestVerifyDomainDkim5FC89C53: {
            Type: 'Custom::AWS',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': ['AWS679f53fac002430cb0da5b7982bd22872D164C4C', 'Arn']
                },
              Create: '{"service":"SES","action":"verifyDomainDkim","parameters":{"Domain":"test.example.edu"},"physicalResourceId":{"id":"test.example.edu-verify-domain-dkim"}}',
              Update: '{"service":"SES","action":"verifyDomainDkim","parameters":{"Domain":"test.example.edu"},"physicalResourceId":{"id":"test.example.edu-verify-domain-dkim"}}',
                InstallLatestAwsSdk: true
            },
            DependsOn: [
                'pccprodtestsesverifytestVerifyDomainDkimCustomResourcePolicyAA33B787',
                'pccprodtestsesverifytestVerifyDomainIdentityCustomResourcePolicyDACCBB6D',
                'pccprodtestsesverifytestVerifyDomainIdentityB3C4D659'
            ],
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccprodtestsesverifytestVerifyDomainDkimCustomResourcePolicyAA33B787: {
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
                PolicyName: 'pccprodtestsesverifytestVerifyDomainDkimCustomResourcePolicyAA33B787',
                Roles: [
                    {
                        Ref: 'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2'
                    }
                ]
            },
            DependsOn: [
                'pccprodtestsesverifytestVerifyDomainIdentityCustomResourcePolicyDACCBB6D',
                'pccprodtestsesverifytestVerifyDomainIdentityB3C4D659'
            ]
        },
        pccprodtestsesverifytestSesDkimVerificationRecord0F1EA9D60: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                HostedZoneId: 'DUMMY',
                Name: {
                    'Fn::Join': [
                        '',
                        [
                            {
                                'Fn::GetAtt': [
                                    'pccprodtestsesverifytestVerifyDomainDkim5FC89C53',
                                    'DkimTokens.0'
                                ]
                            },
                            '._domainkey.test.example.edu.'
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
                                        'pccprodtestsesverifytestVerifyDomainDkim5FC89C53',
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
                'pccprodtestsesverifytestVerifyDomainDkimCustomResourcePolicyAA33B787',
                'pccprodtestsesverifytestVerifyDomainDkim5FC89C53'
            ]
        },
        pccprodtestsesverifytestSesDkimVerificationRecord1F83632A1: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                HostedZoneId: 'DUMMY',
                Name: {
                    'Fn::Join': [
                        '',
                        [
                            {
                                'Fn::GetAtt': [
                                    'pccprodtestsesverifytestVerifyDomainDkim5FC89C53',
                                    'DkimTokens.1'
                                ]
                            },
                            '._domainkey.test.example.edu.'
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
                                        'pccprodtestsesverifytestVerifyDomainDkim5FC89C53',
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
                'pccprodtestsesverifytestVerifyDomainDkimCustomResourcePolicyAA33B787',
                'pccprodtestsesverifytestVerifyDomainDkim5FC89C53'
            ]
        },
        pccprodtestsesverifytestSesDkimVerificationRecord27126929F: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                HostedZoneId: 'DUMMY',
                Name: {
                    'Fn::Join': [
                        '',
                        [
                            {
                                'Fn::GetAtt': [
                                    'pccprodtestsesverifytestVerifyDomainDkim5FC89C53',
                                    'DkimTokens.2'
                                ]
                            },
                            '._domainkey.test.example.edu.'
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
                                        'pccprodtestsesverifytestVerifyDomainDkim5FC89C53',
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
                'pccprodtestsesverifytestVerifyDomainDkimCustomResourcePolicyAA33B787',
                'pccprodtestsesverifytestVerifyDomainDkim5FC89C53'
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
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ]
            }
        },
        AWS679f53fac002430cb0da5b7982bd22872D164C4C: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-22222-us-west-2',
                    S3Key: MatchHelper.endsWith('zip')
                },
                Handler: 'index.handler',
                Role: {
                    'Fn::GetAtt': [
                        'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2',
                        'Arn'
                    ]
                },
                Runtime: MatchHelper.startsWith('nodejs'),
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ],
                Timeout: 120
            },
            DependsOn: ['AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2']
        },
        pccprodtestcache90B0E581: {
            Type: 'AWS::DynamoDB::Table',
            Properties: {
                AttributeDefinitions: [{AttributeName: 'key', AttributeType: 'S'}],
                BillingMode: 'PAY_PER_REQUEST',
                KeySchema: [{AttributeName: 'key', KeyType: 'HASH'}],
                SSESpecification: {SSEEnabled: true},
                TableName: 'pcc-prod-test-cache',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ],
                TimeToLiveSpecification: {AttributeName: 'expires_at', Enabled: true}
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccprodtestqueue7472DA6D: {
            Type: 'AWS::SQS::Queue',
            Properties: {
                KmsMasterKeyId: 'alias/aws/sqs',
                QueueName: 'pcc-prod-test-queue',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccprodtesttgAE852883: {
            Type: 'AWS::ElasticLoadBalancingV2::TargetGroup',
            Properties: {
                Name: 'pcc-prod-test-tg',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ],
                TargetType: 'lambda',
                Targets: [
                    {
                        Id: {'Fn::GetAtt': ['pccprodtestwebfn0B6D4CE6D', 'Arn']}
                    }
                ]
            },
            DependsOn: [
                'pccprodtestwebfn0Invoke2UTWxhlfyqbT5FTn5jvgbLgjFfJwzswGk55DU1HY1623D802'
            ]
        },
        pccprodtestlistenerrule1001DDE5657: {
            Type: 'AWS::ElasticLoadBalancingV2::ListenerRule',
            Properties: {
                Actions: [
                    {
                        TargetGroupArn: {Ref: 'pccprodtesttgAE852883'},
                        Type: 'forward'
                    }
                ],
                Conditions: [
                    {
                        Field: 'host-header',
                        HostHeaderConfig: {Values: ['foo.sdlc.example.edu']}
                    }
                ],
                ListenerArn: 'arn:aws:elasticloadbalancing:us-west-2:123456789012:listener/application/my-load-balancer/50dc6c495c0c9188/f2f7dc8efc522ab2',
                Priority: 100
            }
        },
        pccprodtesteventfn0lg49C9809B: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                RetentionInDays: 30,
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccprodtesteventfn0ServiceRoleF3F26E3C: {
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
                    },
                    {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                {Ref: 'AWS::Partition'},
                                ':iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole'
                            ]
                        ]
                    }
                ],
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ]
            }
        },
        pccprodtesteventfn0ServiceRoleDefaultPolicyCEAFAB52: {
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
                            Resource: {'Fn::GetAtt': ['pccprodtestqueue7472DA6D', 'Arn']}
                        },
                        {
                            Action: ['ses:SendEmail', 'ses:SendRawEmail'],
                            Effect: 'Allow',
                            Resource: '*'
                        },
                        {
                            Action: [
                                'dynamodb:BatchGetItem',
                                'dynamodb:GetRecords',
                                'dynamodb:GetShardIterator',
                                'dynamodb:Query',
                                'dynamodb:GetItem',
                                'dynamodb:Scan',
                                'dynamodb:ConditionCheckItem',
                                'dynamodb:BatchWriteItem',
                                'dynamodb:PutItem',
                                'dynamodb:UpdateItem',
                                'dynamodb:DeleteItem',
                                'dynamodb:DescribeTable'
                            ],
                            Effect: 'Allow',
                            Resource: [
                                {
                                    'Fn::GetAtt': ['pccprodtestcache90B0E581', 'Arn']
                                },
                                {Ref: 'AWS::NoValue'}
                            ]
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
                                        ':secretsmanager:us-west-2:22222:secret:pcc-prod-test-secrets/environment-??????'
                                    ]
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccprodtesteventfn0ServiceRoleDefaultPolicyCEAFAB52',
                Roles: [{Ref: 'pccprodtesteventfn0ServiceRoleF3F26E3C'}]
            }
        },
        pccprodtesteventfn0SecurityGroup19F10904: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                GroupDescription: 'Automatic security group for Lambda Function pccsharedtestpccprodteststagepccprodtestpccprodtesteventfn05F5A1485',
                SecurityGroupEgress: [
                    {
                        CidrIp: '0.0.0.0/0',
                        Description: 'Allow all outbound traffic by default',
                        IpProtocol: '-1'
                    }
                ],
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ],
                VpcId: 'vpc-12345'
            }
        },
        pccprodtesteventfn06B99FE66: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-22222-us-west-2',
                    S3Key: MatchHelper.endsWith('zip')
                },
                Environment: {
                    Variables: {
                        AWS_APP_NAME: 'pcc-prod-test',
                        MAIL_FROM_ADDRESS: 'no-reply@test.example.edu',
                        IMPORTER_FROM: 'importer-no-reply@test.example.edu',
                        DYNAMODB_CACHE_TABLE: {Ref: 'pccprodtestcache90B0E581'},
                        SQS_QUEUE: {Ref: 'pccprodtestqueue7472DA6D'},
                        AWS_SECRET_ARN: {
                            'Fn::Join': [
                                '',
                                [
                                    'arn:',
                                    {Ref: 'AWS::Partition'},
                                    ':secretsmanager:us-west-2:22222:secret:pcc-prod-test-secrets/environment'
                                ]
                            ]
                        },
                        APP_BASE_PATH: '/var/task',
                        BREF_LOAD_SECRETS: 'bref-ssm:loadOnly',
                        SECRETS_LOOKUP: {
                            'Fn::Join': [
                                '',
                                [
                                    'bref-secretsmanager:arn:',
                                    {Ref: 'AWS::Partition'},
                                    ':secretsmanager:us-west-2:22222:secret:pcc-prod-test-secrets/environment'
                                ]
                            ]
                        }
                    }
                },
                FunctionName: 'pcc-prod-test-event-fn-0',
                Handler: 'artisan',
                Layers: [
                    {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                {Ref: 'AWS::Partition'},
                                ':lambda:us-west-2:534081306603:layer:php-82:48'
                            ]
                        ]
                    },
                    {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                {Ref: 'AWS::Partition'},
                                ':lambda:us-west-2:534081306603:layer:console:58'
                            ]
                        ]
                    }
                ],
                LoggingConfig: {LogGroup: {Ref: 'pccprodtesteventfn0lg49C9809B'}},
                MemorySize: 512,
                Role: {
                    'Fn::GetAtt': ['pccprodtesteventfn0ServiceRoleF3F26E3C', 'Arn']
                },
                Runtime: 'provided.al2023',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ],
                Timeout: 120,
                VpcConfig: {
                    SecurityGroupIds: [
                        {
                            'Fn::GetAtt': [
                                'pccprodtesteventfn0SecurityGroup19F10904',
                                'GroupId'
                            ]
                        }
                    ],
                    SubnetIds: ['p-12345', 'p-67890']
                }
            },
            DependsOn: [
                'pccprodtesteventfn0ServiceRoleDefaultPolicyCEAFAB52',
                'pccprodtesteventfn0ServiceRoleF3F26E3C'
            ]
        },
        pccprodtesteventfn0scheduledevent0F7203651: {
            Type: 'AWS::Events::Rule',
            Properties: {
                Name: 'pcc-prod-test-event-fn-0-scheduled-event-0',
                ScheduleExpression: 'rate(5 minutes)',
                State: 'ENABLED',
                Targets: [
                    {
                        Arn: {
                            'Fn::GetAtt': ['pccprodtesteventfn06B99FE66', 'Arn']
                        },
                        Id: 'Target0',
                        Input: '{"cli":"schedule:run"}'
                    }
                ]
            }
        },
        pccprodtesteventfn0scheduledevent0AllowEventRulepccsharedtestpccprodteststagepccprodtestpccprodtesteventfn05F5A14859831339D: {
            Type: 'AWS::Lambda::Permission',
            Properties: {
                Action: 'lambda:InvokeFunction',
                FunctionName: {'Fn::GetAtt': ['pccprodtesteventfn06B99FE66', 'Arn']},
                Principal: 'events.amazonaws.com',
                SourceArn: {
                    'Fn::GetAtt': ['pccprodtesteventfn0scheduledevent0F7203651', 'Arn']
                }
            }
        },
        pccprodtestqueuefn0lgE7D75594: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                RetentionInDays: 30,
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccprodtestqueuefn0ServiceRole654705B9: {
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
                    },
                    {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                {Ref: 'AWS::Partition'},
                                ':iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole'
                            ]
                        ]
                    }
                ],
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ]
            }
        },
        pccprodtestqueuefn0ServiceRoleDefaultPolicy9B6CD734: {
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
                            Resource: {'Fn::GetAtt': ['pccprodtestqueue7472DA6D', 'Arn']}
                        },
                        {
                            Action: [
                                'sqs:SendMessage',
                                'sqs:GetQueueAttributes',
                                'sqs:GetQueueUrl'
                            ],
                            Effect: 'Allow',
                            Resource: {'Fn::GetAtt': ['pccprodtestqueue7472DA6D', 'Arn']}
                        },
                        {
                            Action: [
                                'sqs:PurgeQueue',
                                'sqs:GetQueueAttributes',
                                'sqs:GetQueueUrl'
                            ],
                            Effect: 'Allow',
                            Resource: {'Fn::GetAtt': ['pccprodtestqueue7472DA6D', 'Arn']}
                        },
                        {
                            Action: ['ses:SendEmail', 'ses:SendRawEmail'],
                            Effect: 'Allow',
                            Resource: '*'
                        },
                        {
                            Action: [
                                'dynamodb:BatchGetItem',
                                'dynamodb:GetRecords',
                                'dynamodb:GetShardIterator',
                                'dynamodb:Query',
                                'dynamodb:GetItem',
                                'dynamodb:Scan',
                                'dynamodb:ConditionCheckItem',
                                'dynamodb:BatchWriteItem',
                                'dynamodb:PutItem',
                                'dynamodb:UpdateItem',
                                'dynamodb:DeleteItem',
                                'dynamodb:DescribeTable'
                            ],
                            Effect: 'Allow',
                            Resource: [
                                {
                                    'Fn::GetAtt': ['pccprodtestcache90B0E581', 'Arn']
                                },
                                {Ref: 'AWS::NoValue'}
                            ]
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
                                        ':secretsmanager:us-west-2:22222:secret:pcc-prod-test-secrets/environment-??????'
                                    ]
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccprodtestqueuefn0ServiceRoleDefaultPolicy9B6CD734',
                Roles: [{Ref: 'pccprodtestqueuefn0ServiceRole654705B9'}]
            }
        },
        pccprodtestqueuefn0SecurityGroup2CCD097E: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                GroupDescription: 'Automatic security group for Lambda Function pccsharedtestpccprodteststagepccprodtestpccprodtestqueuefn0509FFF37',
                SecurityGroupEgress: [
                    {
                        CidrIp: '0.0.0.0/0',
                        Description: 'Allow all outbound traffic by default',
                        IpProtocol: '-1'
                    }
                ],
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ],
                VpcId: 'vpc-12345'
            }
        },
        pccprodtestqueuefn0816902CA: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-22222-us-west-2',
                    S3Key: MatchHelper.endsWith('zip')
                },
                Environment: {
                    Variables: {
                        AWS_APP_NAME: 'pcc-prod-test',
                        MAIL_FROM_ADDRESS: 'no-reply@test.example.edu',
                        IMPORTER_FROM: 'importer-no-reply@test.example.edu',
                        DYNAMODB_CACHE_TABLE: {Ref: 'pccprodtestcache90B0E581'},
                        SQS_QUEUE: {Ref: 'pccprodtestqueue7472DA6D'},
                        AWS_SECRET_ARN: {
                            'Fn::Join': [
                                '',
                                [
                                    'arn:',
                                    {Ref: 'AWS::Partition'},
                                    ':secretsmanager:us-west-2:22222:secret:pcc-prod-test-secrets/environment'
                                ]
                            ]
                        },
                        APP_BASE_PATH: '/var/task',
                        BREF_LOAD_SECRETS: 'bref-ssm:loadOnly',
                        SECRETS_LOOKUP: {
                            'Fn::Join': [
                                '',
                                [
                                    'bref-secretsmanager:arn:',
                                    {Ref: 'AWS::Partition'},
                                    ':secretsmanager:us-west-2:22222:secret:pcc-prod-test-secrets/environment'
                                ]
                            ]
                        }
                    }
                },
                FunctionName: 'pcc-prod-test-queue-fn-0',
                Handler: 'Bref\\LaravelBridge\\Queue\\QueueHandler',
                Layers: [
                    {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                {Ref: 'AWS::Partition'},
                                ':lambda:us-west-2:534081306603:layer:php-82:48'
                            ]
                        ]
                    }
                ],
                LoggingConfig: {LogGroup: {Ref: 'pccprodtestqueuefn0lgE7D75594'}},
                MemorySize: 512,
                Role: {
                    'Fn::GetAtt': ['pccprodtestqueuefn0ServiceRole654705B9', 'Arn']
                },
                Runtime: 'provided.al2023',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ],
                Timeout: 120,
                VpcConfig: {
                    SecurityGroupIds: [
                        {
                            'Fn::GetAtt': [
                                'pccprodtestqueuefn0SecurityGroup2CCD097E',
                                'GroupId'
                            ]
                        }
                    ],
                    SubnetIds: ['p-12345', 'p-67890']
                }
            },
            DependsOn: [
                'pccprodtestqueuefn0ServiceRoleDefaultPolicy9B6CD734',
                'pccprodtestqueuefn0ServiceRole654705B9'
            ]
        },
        pccprodtestqueuefn0SqsEventSourcepccsharedtestpccprodteststagepccprodtestpccprodtestqueue210C3883B7AA06FE: {
            Type: 'AWS::Lambda::EventSourceMapping',
            Properties: {
                EventSourceArn: {'Fn::GetAtt': ['pccprodtestqueue7472DA6D', 'Arn']},
              FunctionName: { Ref: 'pccprodtestqueuefn0816902CA' },
              Tags: [
                { Key: 'App', Value: 'test' },
                { Key: 'College', Value: 'PCC' },
                { Key: 'Environment', Value: 'prod' }
              ]
            }
        },
        assetstestexampleedu17784CFA: {
            Type: 'AWS::S3::Bucket',
            Properties: {
                BucketName: 'assets-test-example-edu',
                CorsConfiguration: {
                    CorsRules: [
                        {
                            AllowedHeaders: ['*'],
                            AllowedMethods: ['GET'],
                            AllowedOrigins: ['https://test.example.edu'],
                            MaxAge: 3000
                        }
                    ]
                },
                PublicAccessBlockConfiguration: {
                    BlockPublicAcls: false,
                    BlockPublicPolicy: false,
                    IgnorePublicAcls: false,
                    RestrictPublicBuckets: false
                },
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'aws-cdk:cr-owned:15be1f63', Value: 'true'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ]
            },
            UpdateReplacePolicy: 'Retain',
            DeletionPolicy: 'Retain'
        },
        assetstestexampleeduPolicy3AAD0C7B: {
            Type: 'AWS::S3::BucketPolicy',
            Properties: {
                Bucket: {Ref: 'assetstestexampleedu17784CFA'},
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 's3:*',
                            Condition: {Bool: {'aws:SecureTransport': 'false'}},
                            Effect: 'Deny',
                            Principal: {AWS: '*'},
                            Resource: [
                                {
                                    'Fn::GetAtt': ['assetstestexampleedu17784CFA', 'Arn']
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': ['assetstestexampleedu17784CFA', 'Arn']
                                            },
                                            '/*'
                                        ]
                                    ]
                                }
                            ]
                        },
                        {
                            Action: 's3:GetObject',
                            Effect: 'Allow',
                            Principal: {AWS: '*'},
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        {
                                            'Fn::GetAtt': ['assetstestexampleedu17784CFA', 'Arn']
                                        },
                                        '/*'
                                    ]
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                }
            }
        },
        s3assetscopylg083B90F8: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                RetentionInDays: 1,
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        s3assetscopyAwsCliLayerA9EB8F42: {
            Type: 'AWS::Lambda::LayerVersion',
            Properties: {
                Content: {
                    S3Bucket: 'cdk-hnb659fds-assets-22222-us-west-2',
                    S3Key: MatchHelper.endsWith('zip')
                },
                Description: '/opt/awscli/aws'
            }
        },
        s3assetscopyCustomResourceB5844E7B: {
            Type: 'Custom::CDKBucketDeployment',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': [
                        'CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C81C01536',
                        'Arn'
                    ]
                },
                SourceBucketNames: ['cdk-hnb659fds-assets-22222-us-west-2'],
                SourceObjectKeys: [
                    MatchHelper.endsWith('zip')
                ],
                DestinationBucketName: {Ref: 'assetstestexampleedu17784CFA'},
              Prune: true,
              OutputObjectKeys: true
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756CServiceRole89A01265: {
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
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ]
            }
        },
        CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756CServiceRoleDefaultPolicy88902FDF: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: ['s3:GetObject*', 's3:GetBucket*', 's3:List*'],
                            Effect: 'Allow',
                            Resource: [
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':s3:::cdk-hnb659fds-assets-22222-us-west-2'
                                        ]
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':s3:::cdk-hnb659fds-assets-22222-us-west-2/*'
                                        ]
                                    ]
                                }
                            ]
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
                                    'Fn::GetAtt': ['assetstestexampleedu17784CFA', 'Arn']
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': ['assetstestexampleedu17784CFA', 'Arn']
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
                PolicyName: 'CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756CServiceRoleDefaultPolicy88902FDF',
                Roles: [
                    {
                        Ref: 'CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756CServiceRole89A01265'
                    }
                ]
            }
        },
        CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C81C01536: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-22222-us-west-2',
                    S3Key: MatchHelper.endsWith('zip')
                },
                Environment: {
                    Variables: {
                        AWS_CA_BUNDLE: '/etc/pki/ca-trust/extracted/pem/tls-ca-bundle.pem'
                    }
                },
                Handler: 'index.handler',
                Layers: [{Ref: 's3assetscopyAwsCliLayerA9EB8F42'}],
                LoggingConfig: {LogGroup: {Ref: 's3assetscopylg083B90F8'}},
                Role: {
                    'Fn::GetAtt': [
                        'CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756CServiceRole89A01265',
                        'Arn'
                    ]
                },
                Runtime: MatchHelper.startsWith('python3'),
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ],
                Timeout: 900
            },
            DependsOn: [
                'CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756CServiceRoleDefaultPolicy88902FDF',
                'CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756CServiceRole89A01265'
            ]
        },
        pccprodtestwebfn0lgAD4873DC: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                RetentionInDays: 30,
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccprodtestwebfn0ServiceRole6B6FD81D: {
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
                    },
                    {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                {Ref: 'AWS::Partition'},
                                ':iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole'
                            ]
                        ]
                    }
                ],
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ]
            }
        },
        pccprodtestwebfn0ServiceRoleDefaultPolicy08BFFBDA: {
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
                            Resource: {'Fn::GetAtt': ['pccprodtestqueue7472DA6D', 'Arn']}
                        },
                        {
                            Action: ['ses:SendEmail', 'ses:SendRawEmail'],
                            Effect: 'Allow',
                            Resource: '*'
                        },
                        {
                            Action: [
                                'dynamodb:BatchGetItem',
                                'dynamodb:GetRecords',
                                'dynamodb:GetShardIterator',
                                'dynamodb:Query',
                                'dynamodb:GetItem',
                                'dynamodb:Scan',
                                'dynamodb:ConditionCheckItem',
                                'dynamodb:BatchWriteItem',
                                'dynamodb:PutItem',
                                'dynamodb:UpdateItem',
                                'dynamodb:DeleteItem',
                                'dynamodb:DescribeTable'
                            ],
                            Effect: 'Allow',
                            Resource: [
                                {
                                    'Fn::GetAtt': ['pccprodtestcache90B0E581', 'Arn']
                                },
                                {Ref: 'AWS::NoValue'}
                            ]
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
                                        ':secretsmanager:us-west-2:22222:secret:pcc-prod-test-secrets/environment-??????'
                                    ]
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccprodtestwebfn0ServiceRoleDefaultPolicy08BFFBDA',
                Roles: [{Ref: 'pccprodtestwebfn0ServiceRole6B6FD81D'}]
            }
        },
        pccprodtestwebfn0SecurityGroup38080B55: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                GroupDescription: 'Automatic security group for Lambda Function pccsharedtestpccprodteststagepccprodtestpccprodtestwebfn059D3C475',
                SecurityGroupEgress: [
                    {
                        CidrIp: '0.0.0.0/0',
                        Description: 'Allow all outbound traffic by default',
                        IpProtocol: '-1'
                    }
                ],
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ],
                VpcId: 'vpc-12345'
            }
        },
        pccprodtestwebfn0B6D4CE6D: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-22222-us-west-2',
                    S3Key: MatchHelper.endsWith('zip')
                },
                Environment: {
                    Variables: {
                        AWS_APP_NAME: 'pcc-prod-test',
                        MAIL_FROM_ADDRESS: 'no-reply@test.example.edu',
                        IMPORTER_FROM: 'importer-no-reply@test.example.edu',
                        DYNAMODB_CACHE_TABLE: {Ref: 'pccprodtestcache90B0E581'},
                        SQS_QUEUE: {Ref: 'pccprodtestqueue7472DA6D'},
                        AWS_SECRET_ARN: {
                            'Fn::Join': [
                                '',
                                [
                                    'arn:',
                                    {Ref: 'AWS::Partition'},
                                    ':secretsmanager:us-west-2:22222:secret:pcc-prod-test-secrets/environment'
                                ]
                            ]
                        },
                        APP_BASE_PATH: '/var/task',
                        S3_ASSET_URL: {
                            'Fn::Join': [
                                '',
                                [
                                    'https://',
                                    {
                                        'Fn::GetAtt': ['assetstestexampleedu17784CFA', 'DomainName']
                                    }
                                ]
                            ]
                        },
                        ASSET_URL: {
                            'Fn::Join': [
                                '',
                                [
                                    'https://',
                                    {
                                        'Fn::GetAtt': ['assetstestexampleedu17784CFA', 'DomainName']
                                    }
                                ]
                            ]
                        },
                        BREF_LOAD_SECRETS: 'bref-ssm:loadOnly',
                        SECRETS_LOOKUP: {
                            'Fn::Join': [
                                '',
                                [
                                    'bref-secretsmanager:arn:',
                                    {Ref: 'AWS::Partition'},
                                    ':secretsmanager:us-west-2:22222:secret:pcc-prod-test-secrets/environment'
                                ]
                            ]
                        }
                    }
                },
                FunctionName: 'pcc-prod-test-web-fn-0',
                Handler: 'public/index.php',
                Layers: [
                    {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                {Ref: 'AWS::Partition'},
                                ':lambda:us-west-2:534081306603:layer:php-82-fpm:48'
                            ]
                        ]
                    }
                ],
                LoggingConfig: {LogGroup: {Ref: 'pccprodtestwebfn0lgAD4873DC'}},
                MemorySize: 512,
                Role: {
                    'Fn::GetAtt': ['pccprodtestwebfn0ServiceRole6B6FD81D', 'Arn']
                },
                Runtime: 'provided.al2023',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ],
                Timeout: 120,
                VpcConfig: {
                    SecurityGroupIds: [
                        {
                            'Fn::GetAtt': ['pccprodtestwebfn0SecurityGroup38080B55', 'GroupId']
                        }
                    ],
                    SubnetIds: ['p-12345', 'p-67890']
                }
            },
            DependsOn: [
                'pccprodtestwebfn0ServiceRoleDefaultPolicy08BFFBDA',
                'pccprodtestwebfn0ServiceRole6B6FD81D'
            ]
        },
        pccprodtestwebfn0Invoke2UTWxhlfyqbT5FTn5jvgbLgjFfJwzswGk55DU1HY1623D802: {
            Type: 'AWS::Lambda::Permission',
            Properties: {
                Action: 'lambda:InvokeFunction',
                FunctionName: {'Fn::GetAtt': ['pccprodtestwebfn0B6D4CE6D', 'Arn']},
                Principal: 'elasticloadbalancing.amazonaws.com'
            }
        }
    },
    Outputs: {
        pccprodtestsesverifytesttestexampleeduSesNotificationTopic54474B14: {
            Description: 'SES notification topic for test.example.edu',
            Value: {Ref: 'pccprodtestsesverifytestSesNotificationTopicE0DECAC2'}
        }
    }
}