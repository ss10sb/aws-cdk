const {Match} = require("aws-cdk-lib/assertions");
module.exports = {
    Resources: {
        pccsdlctesttestsdlcexampleeduarecord40417570: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                AliasTarget: {
                    DNSName: 'dualstack.my-load-balancer-1234567890.us-west-2.elb.amazonaws.com',
                    HostedZoneId: 'Z3DZXE0EXAMPLE'
                },
                Comment: 'pcc-sdlc-test: test.sdlc.example.edu',
                HostedZoneId: 'DUMMY',
                Name: 'test.sdlc.example.edu.',
                Type: 'A'
            }
        },
        pccsdlctestsesverifytestVerifyDomainIdentity1170B174: {
            Type: 'Custom::AWS',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': ['AWS679f53fac002430cb0da5b7982bd22872D164C4C', 'Arn']
                },
                Create: '{"service":"SES","action":"verifyDomainIdentity","parameters":{"Domain":"test.sdlc.example.edu"},"physicalResourceId":{"responsePath":"VerificationToken"}}',
                Update: '{"service":"SES","action":"verifyDomainIdentity","parameters":{"Domain":"test.sdlc.example.edu"},"physicalResourceId":{"responsePath":"VerificationToken"}}',
                Delete: '{"service":"SES","action":"deleteIdentity","parameters":{"Identity":"test.sdlc.example.edu"}}',
                InstallLatestAwsSdk: true
            },
            DependsOn: [
                'pccsdlctestsesverifytestVerifyDomainIdentityCustomResourcePolicyC09302B4'
            ],
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlctestsesverifytestVerifyDomainIdentityCustomResourcePolicyC09302B4: {
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
                PolicyName: 'pccsdlctestsesverifytestVerifyDomainIdentityCustomResourcePolicyC09302B4',
                Roles: [
                    {
                        Ref: 'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2'
                    }
                ]
            }
        },
        pccsdlctestsesverifytestSesNotificationTopicF2D450E7: {
            Type: 'AWS::SNS::Topic',
            Properties: {
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            },
            DependsOn: [
                'pccsdlctestsesverifytestVerifyDomainIdentityCustomResourcePolicyC09302B4',
                'pccsdlctestsesverifytestVerifyDomainIdentity1170B174'
            ]
        },
        pccsdlctestsesverifytestAddComplaintTopictestsdlcexampleedu7C639B49: {
            Type: 'Custom::AWS',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': ['AWS679f53fac002430cb0da5b7982bd22872D164C4C', 'Arn']
                },
                Create: {
                    'Fn::Join': [
                        '',
                        [
                            '{"service":"SES","action":"setIdentityNotificationTopic","parameters":{"Identity":"test.sdlc.example.edu","NotificationType":"Complaint","SnsTopic":"',
                            {
                                Ref: 'pccsdlctestsesverifytestSesNotificationTopicF2D450E7'
                            },
                            '"},"physicalResourceId":{"id":"test.sdlc.example.edu-set-Complaint-topic"}}'
                        ]
                    ]
                },
                InstallLatestAwsSdk: true
            },
            DependsOn: [
                'pccsdlctestsesverifytestAddComplaintTopictestsdlcexampleeduCustomResourcePolicyF71B0FE2',
                'pccsdlctestsesverifytestSesNotificationTopicF2D450E7'
            ],
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlctestsesverifytestAddComplaintTopictestsdlcexampleeduCustomResourcePolicyF71B0FE2: {
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
                PolicyName: 'pccsdlctestsesverifytestAddComplaintTopictestsdlcexampleeduCustomResourcePolicyF71B0FE2',
                Roles: [
                    {
                        Ref: 'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2'
                    }
                ]
            },
            DependsOn: ['pccsdlctestsesverifytestSesNotificationTopicF2D450E7']
        },
        pccsdlctestsesverifytestSesVerificationRecord44B46B12: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                HostedZoneId: 'DUMMY',
                Name: '_amazonses.test.sdlc.example.edu.',
                ResourceRecords: [
                    {
                        'Fn::Join': [
                            '',
                            [
                                '"',
                                {
                                    'Fn::GetAtt': [
                                        'pccsdlctestsesverifytestVerifyDomainIdentity1170B174',
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
                'pccsdlctestsesverifytestVerifyDomainIdentityCustomResourcePolicyC09302B4',
                'pccsdlctestsesverifytestVerifyDomainIdentity1170B174'
            ]
        },
        pccsdlctestsesverifytestSesMxRecordEBA4BEB7: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                HostedZoneId: 'DUMMY',
                Name: 'test.sdlc.example.edu.',
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
                'pccsdlctestsesverifytestVerifyDomainIdentityCustomResourcePolicyC09302B4',
                'pccsdlctestsesverifytestVerifyDomainIdentity1170B174'
            ]
        },
        pccsdlctestsesverifytestVerifyDomainDkimB9257EE5: {
            Type: 'Custom::AWS',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': ['AWS679f53fac002430cb0da5b7982bd22872D164C4C', 'Arn']
                },
                Create: '{"service":"SES","action":"verifyDomainDkim","parameters":{"Domain":"test.sdlc.example.edu"},"physicalResourceId":{"id":"test.sdlc.example.edu-verify-domain-dkim"}}',
                Update: '{"service":"SES","action":"verifyDomainDkim","parameters":{"Domain":"test.sdlc.example.edu"},"physicalResourceId":{"id":"test.sdlc.example.edu-verify-domain-dkim"}}',
                InstallLatestAwsSdk: true
            },
            DependsOn: [
                'pccsdlctestsesverifytestVerifyDomainDkimCustomResourcePolicy0B41BEC6',
                'pccsdlctestsesverifytestVerifyDomainIdentityCustomResourcePolicyC09302B4',
                'pccsdlctestsesverifytestVerifyDomainIdentity1170B174'
            ],
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlctestsesverifytestVerifyDomainDkimCustomResourcePolicy0B41BEC6: {
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
                PolicyName: 'pccsdlctestsesverifytestVerifyDomainDkimCustomResourcePolicy0B41BEC6',
                Roles: [
                    {
                        Ref: 'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2'
                    }
                ]
            },
            DependsOn: [
                'pccsdlctestsesverifytestVerifyDomainIdentityCustomResourcePolicyC09302B4',
                'pccsdlctestsesverifytestVerifyDomainIdentity1170B174'
            ]
        },
        pccsdlctestsesverifytestSesDkimVerificationRecord06F732AC0: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                HostedZoneId: 'DUMMY',
                Name: {
                    'Fn::Join': [
                        '',
                        [
                            {
                                'Fn::GetAtt': [
                                    'pccsdlctestsesverifytestVerifyDomainDkimB9257EE5',
                                    'DkimTokens.0'
                                ]
                            },
                            '._domainkey.test.sdlc.example.edu.'
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
                                        'pccsdlctestsesverifytestVerifyDomainDkimB9257EE5',
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
                'pccsdlctestsesverifytestVerifyDomainDkimCustomResourcePolicy0B41BEC6',
                'pccsdlctestsesverifytestVerifyDomainDkimB9257EE5'
            ]
        },
        pccsdlctestsesverifytestSesDkimVerificationRecord1721DFA54: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                HostedZoneId: 'DUMMY',
                Name: {
                    'Fn::Join': [
                        '',
                        [
                            {
                                'Fn::GetAtt': [
                                    'pccsdlctestsesverifytestVerifyDomainDkimB9257EE5',
                                    'DkimTokens.1'
                                ]
                            },
                            '._domainkey.test.sdlc.example.edu.'
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
                                        'pccsdlctestsesverifytestVerifyDomainDkimB9257EE5',
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
                'pccsdlctestsesverifytestVerifyDomainDkimCustomResourcePolicy0B41BEC6',
                'pccsdlctestsesverifytestVerifyDomainDkimB9257EE5'
            ]
        },
        pccsdlctestsesverifytestSesDkimVerificationRecord2D4DFE38C: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                HostedZoneId: 'DUMMY',
                Name: {
                    'Fn::Join': [
                        '',
                        [
                            {
                                'Fn::GetAtt': [
                                    'pccsdlctestsesverifytestVerifyDomainDkimB9257EE5',
                                    'DkimTokens.2'
                                ]
                            },
                            '._domainkey.test.sdlc.example.edu.'
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
                                        'pccsdlctestsesverifytestVerifyDomainDkimB9257EE5',
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
                'pccsdlctestsesverifytestVerifyDomainDkimCustomResourcePolicy0B41BEC6',
                'pccsdlctestsesverifytestVerifyDomainDkimB9257EE5'
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
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        AWS679f53fac002430cb0da5b7982bd22872D164C4C: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-11111-us-west-2',
                    S3Key: '34a66902956b031404ef497526f619b900363fe7fd65ff02b1de4c30fe10c034.zip'
                },
                Handler: 'index.handler',
                Role: {
                    'Fn::GetAtt': [
                        'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2',
                        'Arn'
                    ]
                },
                Runtime: 'nodejs22.x',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                Timeout: 120
            },
            DependsOn: ['AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2']
        },
        pccsdlctestcacheFE02D1F3: {
            Type: 'AWS::DynamoDB::Table',
            Properties: {
                AttributeDefinitions: [{AttributeName: 'key', AttributeType: 'S'}],
                BillingMode: 'PAY_PER_REQUEST',
                KeySchema: [{AttributeName: 'key', KeyType: 'HASH'}],
                SSESpecification: {SSEEnabled: true},
                TableName: 'pcc-sdlc-test-cache',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                TimeToLiveSpecification: {AttributeName: 'expires_at', Enabled: true}
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlctestqueue3EA5766D: {
            Type: 'AWS::SQS::Queue',
            Properties: {
                KmsMasterKeyId: 'alias/aws/sqs',
                QueueName: 'pcc-sdlc-test-queue',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlctesttg0CACFFBC: {
            Type: 'AWS::ElasticLoadBalancingV2::TargetGroup',
            Properties: {
                Name: 'pcc-sdlc-test-tg',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                TargetType: 'lambda',
                Targets: [
                    {
                        Id: {'Fn::GetAtt': ['pccsdlctestwebfn051C9C4DD', 'Arn']}
                    }
                ]
            },
            DependsOn: [
                'pccsdlctestwebfn0Invoke2UTWxhlfyqbT5FTn5jvgbLgjFfJwzswGk55DU1HY4096C269'
            ]
        },
        pccsdlctestlistenerrule100C49C5383: {
            Type: 'AWS::ElasticLoadBalancingV2::ListenerRule',
            Properties: {
                Actions: [
                    {
                        TargetGroupArn: {Ref: 'pccsdlctesttg0CACFFBC'},
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
        pccsdlctesteventfn0lg10590A36: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                RetentionInDays: 30,
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlctesteventfn0ServiceRole5B8A432E: {
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
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlctesteventfn0ServiceRoleDefaultPolicyC994CC2E: {
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
                            Resource: {'Fn::GetAtt': ['pccsdlctestqueue3EA5766D', 'Arn']}
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
                                    'Fn::GetAtt': ['pccsdlctestcacheFE02D1F3', 'Arn']
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
                                        ':secretsmanager:us-west-2:11111:secret:pcc-sdlc-test-secrets/environment-??????'
                                    ]
                                ]
                            }
                        },
                        {
                            Action: [
                                'secretsmanager:GetSecretValue',
                                'secretsmanager:DescribeSecret'
                            ],
                            Effect: 'Allow',
                            Resource: 'arn:aws:secretsmanager:us-east-1:12345:secret:shared-secrets/environment-abc123'
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlctesteventfn0ServiceRoleDefaultPolicyC994CC2E',
                Roles: [{Ref: 'pccsdlctesteventfn0ServiceRole5B8A432E'}]
            }
        },
        pccsdlctesteventfn0SecurityGroup29416485: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                GroupDescription: 'Automatic security group for Lambda Function pccsharedtestpccsdlcteststagepccsdlctestpccsdlctesteventfn0C9D0622B',
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
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                VpcId: 'vpc-12345'
            }
        },
        pccsdlctesteventfn00E8A306A: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-11111-us-west-2',
                    S3Key: '2c986e803e9cb2973f4a7f1f224e03626c988feccc1453ba2aaf55a7c4ae33a1.zip'
                },
                Environment: {
                    Variables: {
                        AWS_APP_NAME: 'pcc-sdlc-test',
                        MAIL_FROM_ADDRESS: 'no-reply@test.sdlc.example.edu',
                        IMPORTER_FROM: 'importer-no-reply@test.sdlc.example.edu',
                        DYNAMODB_CACHE_TABLE: {Ref: 'pccsdlctestcacheFE02D1F3'},
                        SQS_QUEUE: {Ref: 'pccsdlctestqueue3EA5766D'},
                        AWS_SECRET_ARN: {
                            'Fn::Join': [
                                '',
                                [
                                    'arn:',
                                    {Ref: 'AWS::Partition'},
                                    ':secretsmanager:us-west-2:11111:secret:pcc-sdlc-test-secrets/environment'
                                ]
                            ]
                        },
                        AWS_SHARED_SECRET_ARN: 'arn:aws:secretsmanager:us-east-1:12345:secret:shared-secrets/environment-abc123',
                        APP_BASE_PATH: '/var/task',
                        BREF_LOAD_SECRETS: 'bref-ssm:loadOnly',
                        SHARED_SECRETS_LOOKUP: 'bref-secretsmanager:arn:aws:secretsmanager:us-east-1:12345:secret:shared-secrets/environment-abc123',
                        SECRETS_LOOKUP: {
                            'Fn::Join': [
                                '',
                                [
                                    'bref-secretsmanager:arn:',
                                    {Ref: 'AWS::Partition'},
                                    ':secretsmanager:us-west-2:11111:secret:pcc-sdlc-test-secrets/environment'
                                ]
                            ]
                        }
                    }
                },
                FunctionName: 'pcc-sdlc-test-event-fn-0',
                Handler: 'artisan',
                Layers: [
                    {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                {Ref: 'AWS::Partition'},
                                ':lambda:us-west-2:873528684822:layer:php-84:29'
                            ]
                        ]
                    }
                ],
                LoggingConfig: {LogGroup: {Ref: 'pccsdlctesteventfn0lg10590A36'}},
                MemorySize: 512,
                Role: {
                    'Fn::GetAtt': ['pccsdlctesteventfn0ServiceRole5B8A432E', 'Arn']
                },
                Runtime: 'provided.al2023',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                Timeout: 120,
                VpcConfig: {
                    SecurityGroupIds: [
                        {
                            'Fn::GetAtt': [
                                'pccsdlctesteventfn0SecurityGroup29416485',
                                'GroupId'
                            ]
                        }
                    ],
                    SubnetIds: ['p-12345', 'p-67890']
                }
            },
            DependsOn: [
                'pccsdlctesteventfn0ServiceRoleDefaultPolicyC994CC2E',
                'pccsdlctesteventfn0ServiceRole5B8A432E'
            ]
        },
        pccsdlctesteventfn1lg4C026A74: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                RetentionInDays: 30,
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlctesteventfn1ServiceRole24354BBB: {
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
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlctesteventfn1ServiceRoleDefaultPolicy6B60B944: {
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
                            Resource: {'Fn::GetAtt': ['pccsdlctestqueue3EA5766D', 'Arn']}
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
                                    'Fn::GetAtt': ['pccsdlctestcacheFE02D1F3', 'Arn']
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
                                        ':secretsmanager:us-west-2:11111:secret:pcc-sdlc-test-secrets/environment-??????'
                                    ]
                                ]
                            }
                        },
                        {
                            Action: [
                                'secretsmanager:GetSecretValue',
                                'secretsmanager:DescribeSecret'
                            ],
                            Effect: 'Allow',
                            Resource: 'arn:aws:secretsmanager:us-east-1:12345:secret:shared-secrets/environment-abc123'
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlctesteventfn1ServiceRoleDefaultPolicy6B60B944',
                Roles: [{Ref: 'pccsdlctesteventfn1ServiceRole24354BBB'}]
            }
        },
        pccsdlctesteventfn1SecurityGroup9EB89AC0: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                GroupDescription: 'Automatic security group for Lambda Function pccsharedtestpccsdlcteststagepccsdlctestpccsdlctesteventfn1E928F226',
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
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                VpcId: 'vpc-12345'
            }
        },
        pccsdlctesteventfn1CD989762: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-11111-us-west-2',
                    S3Key: '2c986e803e9cb2973f4a7f1f224e03626c988feccc1453ba2aaf55a7c4ae33a1.zip'
                },
                Environment: {
                    Variables: {
                        AWS_APP_NAME: 'pcc-sdlc-test',
                        MAIL_FROM_ADDRESS: 'no-reply@test.sdlc.example.edu',
                        IMPORTER_FROM: 'importer-no-reply@test.sdlc.example.edu',
                        DYNAMODB_CACHE_TABLE: {Ref: 'pccsdlctestcacheFE02D1F3'},
                        SQS_QUEUE: {Ref: 'pccsdlctestqueue3EA5766D'},
                        AWS_SECRET_ARN: {
                            'Fn::Join': [
                                '',
                                [
                                    'arn:',
                                    {Ref: 'AWS::Partition'},
                                    ':secretsmanager:us-west-2:11111:secret:pcc-sdlc-test-secrets/environment'
                                ]
                            ]
                        },
                        AWS_SHARED_SECRET_ARN: 'arn:aws:secretsmanager:us-east-1:12345:secret:shared-secrets/environment-abc123',
                        APP_BASE_PATH: '/var/task',
                        BREF_LOAD_SECRETS: 'bref-ssm:loadOnly',
                        SHARED_SECRETS_LOOKUP: 'bref-secretsmanager:arn:aws:secretsmanager:us-east-1:12345:secret:shared-secrets/environment-abc123',
                        SECRETS_LOOKUP: {
                            'Fn::Join': [
                                '',
                                [
                                    'bref-secretsmanager:arn:',
                                    {Ref: 'AWS::Partition'},
                                    ':secretsmanager:us-west-2:11111:secret:pcc-sdlc-test-secrets/environment'
                                ]
                            ]
                        }
                    }
                },
                FunctionName: 'pcc-sdlc-test-event-fn-1',
                Handler: 'artisan',
                Layers: [
                    {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                {Ref: 'AWS::Partition'},
                                ':lambda:us-west-2:873528684822:layer:php-84:29'
                            ]
                        ]
                    }
                ],
                LoggingConfig: {LogGroup: {Ref: 'pccsdlctesteventfn1lg4C026A74'}},
                MemorySize: 512,
                Role: {
                    'Fn::GetAtt': ['pccsdlctesteventfn1ServiceRole24354BBB', 'Arn']
                },
                Runtime: 'provided.al2023',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                Timeout: 120,
                VpcConfig: {
                    SecurityGroupIds: [
                        {
                            'Fn::GetAtt': [
                                'pccsdlctesteventfn1SecurityGroup9EB89AC0',
                                'GroupId'
                            ]
                        }
                    ],
                    SubnetIds: ['p-12345', 'p-67890']
                }
            },
            DependsOn: [
                'pccsdlctesteventfn1ServiceRoleDefaultPolicy6B60B944',
                'pccsdlctesteventfn1ServiceRole24354BBB'
            ]
        },
        pccsdlctesteventfn1scheduledevent09E40751E: {
            Type: 'AWS::Events::Rule',
            Properties: {
                Name: 'pcc-sdlc-test-event-fn-1-scheduled-event-0',
                ScheduleExpression: 'rate(5 minutes)',
                State: 'ENABLED',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                Targets: [
                    {
                        Arn: {
                            'Fn::GetAtt': ['pccsdlctesteventfn1CD989762', 'Arn']
                        },
                        Id: 'Target0',
                        Input: '{"cli":"schedule:run"}'
                    }
                ]
            }
        },
        pccsdlctesteventfn1scheduledevent0AllowEventRulepccsharedtestpccsdlcteststagepccsdlctestpccsdlctesteventfn1E928F226D9DD5811: {
            Type: 'AWS::Lambda::Permission',
            Properties: {
                Action: 'lambda:InvokeFunction',
                FunctionName: {'Fn::GetAtt': ['pccsdlctesteventfn1CD989762', 'Arn']},
                Principal: 'events.amazonaws.com',
                SourceArn: {
                    'Fn::GetAtt': ['pccsdlctesteventfn1scheduledevent09E40751E', 'Arn']
                }
            }
        },
        pccsdlctestqueuefn0lgCF213245: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                RetentionInDays: 30,
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlctestqueuefn0ServiceRole474925C9: {
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
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlctestqueuefn0ServiceRoleDefaultPolicy963C6FED: {
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
                            Resource: {'Fn::GetAtt': ['pccsdlctestqueue3EA5766D', 'Arn']}
                        },
                        {
                            Action: [
                                'sqs:SendMessage',
                                'sqs:GetQueueAttributes',
                                'sqs:GetQueueUrl'
                            ],
                            Effect: 'Allow',
                            Resource: {'Fn::GetAtt': ['pccsdlctestqueue3EA5766D', 'Arn']}
                        },
                        {
                            Action: [
                                'sqs:PurgeQueue',
                                'sqs:GetQueueAttributes',
                                'sqs:GetQueueUrl'
                            ],
                            Effect: 'Allow',
                            Resource: {'Fn::GetAtt': ['pccsdlctestqueue3EA5766D', 'Arn']}
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
                                    'Fn::GetAtt': ['pccsdlctestcacheFE02D1F3', 'Arn']
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
                                        ':secretsmanager:us-west-2:11111:secret:pcc-sdlc-test-secrets/environment-??????'
                                    ]
                                ]
                            }
                        },
                        {
                            Action: [
                                'secretsmanager:GetSecretValue',
                                'secretsmanager:DescribeSecret'
                            ],
                            Effect: 'Allow',
                            Resource: 'arn:aws:secretsmanager:us-east-1:12345:secret:shared-secrets/environment-abc123'
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlctestqueuefn0ServiceRoleDefaultPolicy963C6FED',
                Roles: [{Ref: 'pccsdlctestqueuefn0ServiceRole474925C9'}]
            }
        },
        pccsdlctestqueuefn0SecurityGroup0C127671: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                GroupDescription: 'Automatic security group for Lambda Function pccsharedtestpccsdlcteststagepccsdlctestpccsdlctestqueuefn05E5E5333',
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
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                VpcId: 'vpc-12345'
            }
        },
        pccsdlctestqueuefn0B6C6E75C: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-11111-us-west-2',
                    S3Key: '2c986e803e9cb2973f4a7f1f224e03626c988feccc1453ba2aaf55a7c4ae33a1.zip'
                },
                Environment: {
                    Variables: {
                        AWS_APP_NAME: 'pcc-sdlc-test',
                        MAIL_FROM_ADDRESS: 'no-reply@test.sdlc.example.edu',
                        IMPORTER_FROM: 'importer-no-reply@test.sdlc.example.edu',
                        DYNAMODB_CACHE_TABLE: {Ref: 'pccsdlctestcacheFE02D1F3'},
                        SQS_QUEUE: {Ref: 'pccsdlctestqueue3EA5766D'},
                        AWS_SECRET_ARN: {
                            'Fn::Join': [
                                '',
                                [
                                    'arn:',
                                    {Ref: 'AWS::Partition'},
                                    ':secretsmanager:us-west-2:11111:secret:pcc-sdlc-test-secrets/environment'
                                ]
                            ]
                        },
                        AWS_SHARED_SECRET_ARN: 'arn:aws:secretsmanager:us-east-1:12345:secret:shared-secrets/environment-abc123',
                        APP_BASE_PATH: '/var/task',
                        BREF_LOAD_SECRETS: 'bref-ssm:loadOnly',
                        SHARED_SECRETS_LOOKUP: 'bref-secretsmanager:arn:aws:secretsmanager:us-east-1:12345:secret:shared-secrets/environment-abc123',
                        SECRETS_LOOKUP: {
                            'Fn::Join': [
                                '',
                                [
                                    'bref-secretsmanager:arn:',
                                    {Ref: 'AWS::Partition'},
                                    ':secretsmanager:us-west-2:11111:secret:pcc-sdlc-test-secrets/environment'
                                ]
                            ]
                        }
                    }
                },
                FunctionName: 'pcc-sdlc-test-queue-fn-0',
                Handler: 'Bref\\LaravelBridge\\Queue\\QueueHandler',
                Layers: [
                    {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                {Ref: 'AWS::Partition'},
                                ':lambda:us-west-2:873528684822:layer:php-84:29'
                            ]
                        ]
                    }
                ],
                LoggingConfig: {LogGroup: {Ref: 'pccsdlctestqueuefn0lgCF213245'}},
                MemorySize: 512,
                Role: {
                    'Fn::GetAtt': ['pccsdlctestqueuefn0ServiceRole474925C9', 'Arn']
                },
                Runtime: 'provided.al2023',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                Timeout: 120,
                VpcConfig: {
                    SecurityGroupIds: [
                        {
                            'Fn::GetAtt': [
                                'pccsdlctestqueuefn0SecurityGroup0C127671',
                                'GroupId'
                            ]
                        }
                    ],
                    SubnetIds: ['p-12345', 'p-67890']
                }
            },
            DependsOn: [
                'pccsdlctestqueuefn0ServiceRoleDefaultPolicy963C6FED',
                'pccsdlctestqueuefn0ServiceRole474925C9'
            ]
        },
        pccsdlctestqueuefn0SqsEventSourcepccsharedtestpccsdlcteststagepccsdlctestpccsdlctestqueue701214883A2C8C19: {
            Type: 'AWS::Lambda::EventSourceMapping',
            Properties: {
                EventSourceArn: {'Fn::GetAtt': ['pccsdlctestqueue3EA5766D', 'Arn']},
                FunctionName: {Ref: 'pccsdlctestqueuefn0B6C6E75C'},
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlctestwebfn0lg4B926758: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                RetentionInDays: 30,
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlctestwebfn0ServiceRoleBF73EA7E: {
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
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlctestwebfn0ServiceRoleDefaultPolicy78EAC02D: {
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
                            Resource: {'Fn::GetAtt': ['pccsdlctestqueue3EA5766D', 'Arn']}
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
                                    'Fn::GetAtt': ['pccsdlctestcacheFE02D1F3', 'Arn']
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
                                        ':secretsmanager:us-west-2:11111:secret:pcc-sdlc-test-secrets/environment-??????'
                                    ]
                                ]
                            }
                        },
                        {
                            Action: [
                                'secretsmanager:GetSecretValue',
                                'secretsmanager:DescribeSecret'
                            ],
                            Effect: 'Allow',
                            Resource: 'arn:aws:secretsmanager:us-east-1:12345:secret:shared-secrets/environment-abc123'
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlctestwebfn0ServiceRoleDefaultPolicy78EAC02D',
                Roles: [{Ref: 'pccsdlctestwebfn0ServiceRoleBF73EA7E'}]
            }
        },
        pccsdlctestwebfn0SecurityGroup124542E5: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                GroupDescription: 'Automatic security group for Lambda Function pccsharedtestpccsdlcteststagepccsdlctestpccsdlctestwebfn0F48690D6',
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
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                VpcId: 'vpc-12345'
            }
        },
        pccsdlctestwebfn051C9C4DD: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-11111-us-west-2',
                    S3Key: '2c986e803e9cb2973f4a7f1f224e03626c988feccc1453ba2aaf55a7c4ae33a1.zip'
                },
                Environment: {
                    Variables: {
                        AWS_APP_NAME: 'pcc-sdlc-test',
                        MAIL_FROM_ADDRESS: 'no-reply@test.sdlc.example.edu',
                        IMPORTER_FROM: 'importer-no-reply@test.sdlc.example.edu',
                        DYNAMODB_CACHE_TABLE: {Ref: 'pccsdlctestcacheFE02D1F3'},
                        SQS_QUEUE: {Ref: 'pccsdlctestqueue3EA5766D'},
                        AWS_SECRET_ARN: {
                            'Fn::Join': [
                                '',
                                [
                                    'arn:',
                                    {Ref: 'AWS::Partition'},
                                    ':secretsmanager:us-west-2:11111:secret:pcc-sdlc-test-secrets/environment'
                                ]
                            ]
                        },
                        AWS_SHARED_SECRET_ARN: 'arn:aws:secretsmanager:us-east-1:12345:secret:shared-secrets/environment-abc123',
                        APP_BASE_PATH: '/var/task',
                        BREF_LOAD_SECRETS: 'bref-ssm:loadOnly',
                        SHARED_SECRETS_LOOKUP: 'bref-secretsmanager:arn:aws:secretsmanager:us-east-1:12345:secret:shared-secrets/environment-abc123',
                        SECRETS_LOOKUP: {
                            'Fn::Join': [
                                '',
                                [
                                    'bref-secretsmanager:arn:',
                                    {Ref: 'AWS::Partition'},
                                    ':secretsmanager:us-west-2:11111:secret:pcc-sdlc-test-secrets/environment'
                                ]
                            ]
                        }
                    }
                },
                FunctionName: 'pcc-sdlc-test-web-fn-0',
                Handler: 'public/index.php',
                Layers: [
                    {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                {Ref: 'AWS::Partition'},
                                ':lambda:us-west-2:873528684822:layer:php-84:29'
                            ]
                        ]
                    }
                ],
                LoggingConfig: {LogGroup: {Ref: 'pccsdlctestwebfn0lg4B926758'}},
                MemorySize: 512,
                Role: {
                    'Fn::GetAtt': ['pccsdlctestwebfn0ServiceRoleBF73EA7E', 'Arn']
                },
                Runtime: 'provided.al2023',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                Timeout: 120,
                VpcConfig: {
                    SecurityGroupIds: [
                        {
                            'Fn::GetAtt': ['pccsdlctestwebfn0SecurityGroup124542E5', 'GroupId']
                        }
                    ],
                    SubnetIds: ['p-12345', 'p-67890']
                }
            },
            DependsOn: [
                'pccsdlctestwebfn0ServiceRoleDefaultPolicy78EAC02D',
                'pccsdlctestwebfn0ServiceRoleBF73EA7E'
            ]
        },
        pccsdlctestwebfn0Invoke2UTWxhlfyqbT5FTn5jvgbLgjFfJwzswGk55DU1HY4096C269: {
            Type: 'AWS::Lambda::Permission',
            Properties: {
                Action: 'lambda:InvokeFunction',
                FunctionName: {'Fn::GetAtt': ['pccsdlctestwebfn051C9C4DD', 'Arn']},
                Principal: 'elasticloadbalancing.amazonaws.com'
            }
        }
    }
}