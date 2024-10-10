const {MatchHelper} = require("../../../../src/utils/testing/match-helper");
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
                                    'pccsdlctesttaskdefupdateruntask0TaskRole66D87FB5',
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: 'iam:PassRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'pccsdlctesttaskdefupdateruntask0execrole43F59F47',
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
                    S3Bucket: 'cdk-hnb659fds-assets-11111-us-west-2',
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
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                Timeout: 120
            },
            DependsOn: [
                'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleDefaultPolicyD28E1A5E',
                'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2'
            ]
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
                    S3Key: MatchHelper.endsWith('zip')
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
                        APP_BASE_PATH: '/var/task',
                        BREF_LOAD_SECRETS: 'bref-ssm:loadOnly',
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
        pccsdlctesteventfn0scheduledevent091D241D0: {
            Type: 'AWS::Events::Rule',
            Properties: {
                Name: 'pcc-sdlc-test-event-fn-0-scheduled-event-0',
                ScheduleExpression: 'rate(5 minutes)',
                State: 'ENABLED',
                Targets: [
                    {
                        Arn: {
                            'Fn::GetAtt': ['pccsdlctesteventfn00E8A306A', 'Arn']
                        },
                        Id: 'Target0',
                        Input: '{"cli":"schedule:run"}'
                    }
                ]
            }
        },
        pccsdlctesteventfn0scheduledevent0AllowEventRulepccsharedtestpccsdlcteststagepccsdlctestpccsdlctesteventfn0C9D0622B3F02DB56: {
            Type: 'AWS::Lambda::Permission',
            Properties: {
                Action: 'lambda:InvokeFunction',
                FunctionName: {'Fn::GetAtt': ['pccsdlctesteventfn00E8A306A', 'Arn']},
                Principal: 'events.amazonaws.com',
                SourceArn: {
                    'Fn::GetAtt': ['pccsdlctesteventfn0scheduledevent091D241D0', 'Arn']
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
                    S3Key: MatchHelper.endsWith('zip')
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
                        APP_BASE_PATH: '/var/task',
                        BREF_LOAD_SECRETS: 'bref-ssm:loadOnly',
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
                                ':lambda:us-west-2:534081306603:layer:php-82:48'
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
              FunctionName: { Ref: 'pccsdlctestqueuefn0B6C6E75C' },
              Tags: [
                { Key: 'App', Value: 'test' },
                { Key: 'College', Value: 'PCC' },
                { Key: 'Environment', Value: 'sdlc' }
              ]
            }
        },
        pccsdlctesttg0CACFFBC: {
            Type: 'AWS::ElasticLoadBalancingV2::TargetGroup',
            Properties: {
                HealthCheckPath: '/api/healthz',
                HealthCheckProtocol: 'HTTP',
                Name: 'pcc-sdlc-test-tg',
                Port: 80,
                Protocol: 'HTTP',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                TargetGroupAttributes: [{Key: 'stickiness.enabled', Value: 'false'}],
                TargetType: 'ip',
                VpcId: 'vpc-12345'
            }
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
                        HostHeaderConfig: {Values: ['test.sdlc.example.edu']}
                    }
                ],
                ListenerArn: 'arn:aws:elasticloadbalancing:us-west-2:123456789012:listener/application/my-load-balancer/50dc6c495c0c9188/f2f7dc8efc522ab2',
                Priority: 100
            }
        },
        pccsdlctesttghealthhealthtopicE7461CB4: {
            Type: 'AWS::SNS::Topic',
            Properties: {
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlctesttghealthhealthtopicsdlcexampleeduB75F543C: {
            Type: 'AWS::SNS::Subscription',
            Properties: {
                Endpoint: 'sdlc@example.edu',
                Protocol: 'email',
                TopicArn: {Ref: 'pccsdlctesttghealthhealthtopicE7461CB4'}
            }
        },
        pccsdlctesttghealthhealthalarm0255CC3E: {
            Type: 'AWS::CloudWatch::Alarm',
            Properties: {
                AlarmActions: [{Ref: 'pccsdlctesttghealthhealthtopicE7461CB4'}],
                ComparisonOperator: 'GreaterThanOrEqualToThreshold',
                Dimensions: [
                    {
                        Name: 'LoadBalancer',
                        Value: 'application/my-load-balancer/50dc6c495c0c9188'
                    },
                    {
                        Name: 'TargetGroup',
                        Value: {
                            'Fn::GetAtt': ['pccsdlctesttg0CACFFBC', 'TargetGroupFullName']
                        }
                    }
                ],
                EvaluationPeriods: 3,
                MetricName: 'UnHealthyHostCount',
                Namespace: 'AWS/ApplicationELB',
                OKActions: [{Ref: 'pccsdlctesttghealthhealthtopicE7461CB4'}],
                Period: 60,
                Statistic: 'Maximum',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                Threshold: 1
            }
        },
        pccsdlctestcluster8AFBBF8E: {
            Type: 'AWS::ECS::Cluster',
            Properties: {
                ClusterName: 'pcc-sdlc-test-cluster',
                ClusterSettings: [{Name: 'containerInsights', Value: 'disabled'}],
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlctestclusteralarmtopicF04676D2: {
            Type: 'AWS::SNS::Topic',
            Properties: {
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlctestclusteralarmtopicsdlcexampleedu72F8FBA9: {
            Type: 'AWS::SNS::Subscription',
            Properties: {
                Endpoint: 'sdlc@example.edu',
                Protocol: 'email',
                TopicArn: {Ref: 'pccsdlctestclusteralarmtopicF04676D2'}
            }
        },
        pccsdlctestclustercpualarmE8F5C704: {
            Type: 'AWS::CloudWatch::Alarm',
            Properties: {
                AlarmActions: [{Ref: 'pccsdlctestclusteralarmtopicF04676D2'}],
                ComparisonOperator: 'GreaterThanOrEqualToThreshold',
                Dimensions: [
                    {
                        Name: 'ClusterName',
                        Value: {Ref: 'pccsdlctestcluster8AFBBF8E'}
                    }
                ],
                EvaluationPeriods: 1,
                MetricName: 'CPUUtilization',
                Namespace: 'AWS/ECS',
                OKActions: [{Ref: 'pccsdlctestclusteralarmtopicF04676D2'}],
                Period: 300,
                Statistic: 'Average',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                Threshold: 90
            }
        },
        pccsdlctestclustermemoryalarmE7902466: {
            Type: 'AWS::CloudWatch::Alarm',
            Properties: {
                AlarmActions: [{Ref: 'pccsdlctestclusteralarmtopicF04676D2'}],
                ComparisonOperator: 'GreaterThanOrEqualToThreshold',
                Dimensions: [
                    {
                        Name: 'ClusterName',
                        Value: {Ref: 'pccsdlctestcluster8AFBBF8E'}
                    }
                ],
                EvaluationPeriods: 1,
                MetricName: 'MemoryUtilization',
                Namespace: 'AWS/ECS',
                OKActions: [{Ref: 'pccsdlctestclusteralarmtopicF04676D2'}],
                Period: 300,
                Statistic: 'Average',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                Threshold: 90
            }
        },
        pccsdlctesttaskdefruntask0execrole81B62D6D: {
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
                    {Key: 'App', Value: 'test'},
                    {
                        Key: 'aws-cdk:id',
                        Value: 'pcc-sdlc-test_c8b91c1ffe80bdc3470c62a5fe8f643694314789c6'
                    },
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlctesttaskdefruntask0execroleDefaultPolicy007EA977: {
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
                                        ':ecr:us-west-2:12344:repository/pcc-test/phpfpm'
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
                                    'pccsdlctestcontainerphpfpmruntaskrot0loggroup287B5180',
                                    'Arn'
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlctesttaskdefruntask0execroleDefaultPolicy007EA977',
                Roles: [{Ref: 'pccsdlctesttaskdefruntask0execrole81B62D6D'}]
            }
        },
        pccsdlctesttaskdefruntask0TaskRole30FAACF0: {
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
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlctesttaskdefruntask0TaskRoleDefaultPolicy6DBB2FB0: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
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
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlctesttaskdefruntask0TaskRoleDefaultPolicy6DBB2FB0',
                Roles: [{Ref: 'pccsdlctesttaskdefruntask0TaskRole30FAACF0'}]
            }
        },
        pccsdlctesttaskdefruntask04446F3C7: {
            Type: 'AWS::ECS::TaskDefinition',
            Properties: {
                ContainerDefinitions: [
                    {
                        Command: ['/on_create.sh'],
                        Cpu: 256,
                        EntryPoint: ['/bin/sh', '-c'],
                        Environment: [
                            {Name: 'AWS_APP_NAME', Value: 'pcc-sdlc-test'},
                            {
                                Name: 'MAIL_FROM_ADDRESS',
                                Value: 'no-reply@test.sdlc.example.edu'
                            },
                            {
                                Name: 'IMPORTER_FROM',
                                Value: 'importer-no-reply@test.sdlc.example.edu'
                            },
                            {
                                Name: 'DYNAMODB_CACHE_TABLE',
                                Value: {Ref: 'pccsdlctestcacheFE02D1F3'}
                            },
                            {
                                Name: 'SQS_QUEUE',
                                Value: {Ref: 'pccsdlctestqueue3EA5766D'}
                            },
                            {
                                Name: 'AWS_SECRET_ARN',
                                Value: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':secretsmanager:us-west-2:11111:secret:pcc-sdlc-test-secrets/environment'
                                        ]
                                    ]
                                }
                            },
                            {Name: 'APP_BASE_PATH', Value: '/app'}
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
                                                                ':ecr:us-west-2:12344:repository/pcc-test/phpfpm'
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
                                                                ':ecr:us-west-2:12344:repository/pcc-test/phpfpm'
                                                            ]
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    '.',
                                    {Ref: 'AWS::URLSuffix'},
                                    '/pcc-test/phpfpm:1'
                                ]
                            ]
                        },
                        LogConfiguration: {
                            LogDriver: 'awslogs',
                            Options: {
                                'awslogs-group': {
                                    Ref: 'pccsdlctestcontainerphpfpmruntaskrot0loggroup287B5180'
                                },
                                'awslogs-stream-prefix': 'phpfpm',
                                'awslogs-region': 'us-west-2'
                            }
                        },
                        Memory: 512,
                        Name: 'pcc-sdlc-test-container-phpfpm-runtask-rot-0',
                        ReadonlyRootFilesystem: true
                    }
                ],
                Cpu: '256',
                ExecutionRoleArn: {
                    'Fn::GetAtt': ['pccsdlctesttaskdefruntask0execrole81B62D6D', 'Arn']
                },
                Family: 'pcc-sdlc-test-task-def-runtask-0',
                Memory: '512',
                NetworkMode: 'awsvpc',
                RequiresCompatibilities: ['FARGATE'],
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                TaskRoleArn: {
                    'Fn::GetAtt': ['pccsdlctesttaskdefruntask0TaskRole30FAACF0', 'Arn']
                }
            }
        },
        pccsdlctestcontainerphpfpmruntaskrot0loggroup287B5180: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                LogGroupName: 'pcc-sdlc-test-container-phpfpm-runtask-rot-0-log-group',
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
        pccsdlctesttaskdefupdateruntask0execrole43F59F47: {
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
                    {Key: 'App', Value: 'test'},
                    {
                        Key: 'aws-cdk:id',
                        Value: 'pcc-sdlc-test_c8a729fbb151b1823948564aa948b18a4b8648e09d'
                    },
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlctesttaskdefupdateruntask0execroleDefaultPolicyB90650A0: {
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
                                        ':ecr:us-west-2:12344:repository/pcc-test/phpfpm'
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
                                    'pccsdlctestcontainerphpfpmupdateruntaskurot0loggroup530DAF6C',
                                    'Arn'
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlctesttaskdefupdateruntask0execroleDefaultPolicyB90650A0',
                Roles: [
                    {Ref: 'pccsdlctesttaskdefupdateruntask0execrole43F59F47'}
                ]
            }
        },
        pccsdlctesttaskdefupdateruntask0TaskRole66D87FB5: {
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
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlctesttaskdefupdateruntask0TaskRoleDefaultPolicyB44A8399: {
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
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlctesttaskdefupdateruntask0TaskRoleDefaultPolicyB44A8399',
                Roles: [
                    {Ref: 'pccsdlctesttaskdefupdateruntask0TaskRole66D87FB5'}
                ]
            }
        },
        pccsdlctesttaskdefupdateruntask07C547B30: {
            Type: 'AWS::ECS::TaskDefinition',
            Properties: {
                ContainerDefinitions: [
                    {
                        Command: ['artisan', 'migrate', '--force'],
                        Cpu: 256,
                        EntryPoint: ['/usr/local/bin/php'],
                        Environment: [
                            {Name: 'AWS_APP_NAME', Value: 'pcc-sdlc-test'},
                            {
                                Name: 'MAIL_FROM_ADDRESS',
                                Value: 'no-reply@test.sdlc.example.edu'
                            },
                            {
                                Name: 'IMPORTER_FROM',
                                Value: 'importer-no-reply@test.sdlc.example.edu'
                            },
                            {
                                Name: 'DYNAMODB_CACHE_TABLE',
                                Value: {Ref: 'pccsdlctestcacheFE02D1F3'}
                            },
                            {
                                Name: 'SQS_QUEUE',
                                Value: {Ref: 'pccsdlctestqueue3EA5766D'}
                            },
                            {
                                Name: 'AWS_SECRET_ARN',
                                Value: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':secretsmanager:us-west-2:11111:secret:pcc-sdlc-test-secrets/environment'
                                        ]
                                    ]
                                }
                            },
                            {Name: 'APP_BASE_PATH', Value: '/app'}
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
                                                                ':ecr:us-west-2:12344:repository/pcc-test/phpfpm'
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
                                                                ':ecr:us-west-2:12344:repository/pcc-test/phpfpm'
                                                            ]
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    '.',
                                    {Ref: 'AWS::URLSuffix'},
                                    '/pcc-test/phpfpm:1'
                                ]
                            ]
                        },
                        LogConfiguration: {
                            LogDriver: 'awslogs',
                            Options: {
                                'awslogs-group': {
                                    Ref: 'pccsdlctestcontainerphpfpmupdateruntaskurot0loggroup530DAF6C'
                                },
                                'awslogs-stream-prefix': 'phpfpm',
                                'awslogs-region': 'us-west-2'
                            }
                        },
                        Memory: 512,
                        Name: 'pcc-sdlc-test-container-phpfpm-updateruntask-urot-0',
                        ReadonlyRootFilesystem: true
                    }
                ],
                Cpu: '256',
                ExecutionRoleArn: {
                    'Fn::GetAtt': [
                        'pccsdlctesttaskdefupdateruntask0execrole43F59F47',
                        'Arn'
                    ]
                },
                Family: 'pcc-sdlc-test-task-def-updateruntask-0',
                Memory: '512',
                NetworkMode: 'awsvpc',
                RequiresCompatibilities: ['FARGATE'],
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                TaskRoleArn: {
                    'Fn::GetAtt': [
                        'pccsdlctesttaskdefupdateruntask0TaskRole66D87FB5',
                        'Arn'
                    ]
                }
            }
        },
        pccsdlctestcontainerphpfpmupdateruntaskurot0loggroup530DAF6C: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                LogGroupName: 'pcc-sdlc-test-container-phpfpm-updateruntask-urot-0-log-group',
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
        pccsdlctesttaskupdateruntask0SecurityGroupCBF1FF11: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                GroupDescription: 'pcc-shared-test/pcc-sdlc-test-stage/pcc-sdlc-test/pcc-sdlc-test-task-updateruntask-0/SecurityGroup',
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
        pccsdlctesttaskupdateruntask0updatefnCD6D2156: {
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
                            {Ref: 'pccsdlctesttaskdefupdateruntask07C547B30'},
                            '"},"parameters":{"cluster":"',
                            {Ref: 'pccsdlctestcluster8AFBBF8E'},
                            '","taskDefinition":"',
                            {Ref: 'pccsdlctesttaskdefupdateruntask07C547B30'},
                            '","capacityProviderStrategy":[],"launchType":"FARGATE","platformVersion":"LATEST","networkConfiguration":{"awsvpcConfiguration":{"assignPublicIp":"DISABLED","subnets":["p-12345","p-67890"],"securityGroups":["',
                            {
                                'Fn::GetAtt': [
                                    'pccsdlctesttaskupdateruntask0SecurityGroupCBF1FF11',
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
                            {Ref: 'pccsdlctesttaskdefupdateruntask07C547B30'},
                            '"},"parameters":{"cluster":"',
                            {Ref: 'pccsdlctestcluster8AFBBF8E'},
                            '","taskDefinition":"',
                            {Ref: 'pccsdlctesttaskdefupdateruntask07C547B30'},
                            '","capacityProviderStrategy":[],"launchType":"FARGATE","platformVersion":"LATEST","networkConfiguration":{"awsvpcConfiguration":{"assignPublicIp":"DISABLED","subnets":["p-12345","p-67890"],"securityGroups":["',
                            {
                                'Fn::GetAtt': [
                                    'pccsdlctesttaskupdateruntask0SecurityGroupCBF1FF11',
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
                'pccsdlctesttaskupdateruntask0updatefnCustomResourcePolicy3BB7D065'
            ],
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlctesttaskupdateruntask0updatefnCustomResourcePolicy3BB7D065: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 'ecs:RunTask',
                            Effect: 'Allow',
                            Resource: {Ref: 'pccsdlctesttaskdefupdateruntask07C547B30'}
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlctesttaskupdateruntask0updatefnCustomResourcePolicy3BB7D065',
                Roles: [
                    {
                        Ref: 'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2'
                    }
                ]
            }
        },
        pccsdlctesttaskdefweb0execrole33B297FF: {
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
                    {Key: 'App', Value: 'test'},
                    {
                        Key: 'aws-cdk:id',
                        Value: 'pcc-sdlc-test_c85929a4a3a49658cfd5c77ee35b1dc791992ba00d'
                    },
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlctesttaskdefweb0execroleDefaultPolicy3CC3C592: {
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
                                        ':ecr:us-west-2:12344:repository/pcc-test/nginx'
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
                                    'pccsdlctestcontainernginxwebu0loggroup84744344',
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
                                        ':ecr:us-west-2:12344:repository/pcc-test/phpfpm'
                                    ]
                                ]
                            }
                        },
                        {
                            Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'pccsdlctestcontainerphpfpmwebu0loggroup11DFEEF9',
                                    'Arn'
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlctesttaskdefweb0execroleDefaultPolicy3CC3C592',
                Roles: [{Ref: 'pccsdlctesttaskdefweb0execrole33B297FF'}]
            }
        },
        pccsdlctesttaskdefweb0TaskRoleFFDD04CB: {
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
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlctesttaskdefweb0TaskRoleDefaultPolicy5EA04ED0: {
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
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlctesttaskdefweb0TaskRoleDefaultPolicy5EA04ED0',
                Roles: [{Ref: 'pccsdlctesttaskdefweb0TaskRoleFFDD04CB'}]
            }
        },
        pccsdlctesttaskdefweb08FC2D8B2: {
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
                                                                ':ecr:us-west-2:12344:repository/pcc-test/nginx'
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
                                                                ':ecr:us-west-2:12344:repository/pcc-test/nginx'
                                                            ]
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    '.',
                                    {Ref: 'AWS::URLSuffix'},
                                    '/pcc-test/nginx:1'
                                ]
                            ]
                        },
                        LogConfiguration: {
                            LogDriver: 'awslogs',
                            Options: {
                                'awslogs-group': {
                                    Ref: 'pccsdlctestcontainernginxwebu0loggroup84744344'
                                },
                                'awslogs-stream-prefix': 'nginx',
                                'awslogs-region': 'us-west-2'
                            }
                        },
                        Memory: 64,
                        Name: 'pcc-sdlc-test-container-nginx-web-u-0',
                        PortMappings: [{ContainerPort: 80, Protocol: 'tcp'}],
                        ReadonlyRootFilesystem: true
                    },
                    {
                        Command: ['/entrypoint.sh'],
                        Cpu: 128,
                        EntryPoint: ['/bin/sh', '-c'],
                        Environment: [
                            {Name: 'AWS_APP_NAME', Value: 'pcc-sdlc-test'},
                            {
                                Name: 'MAIL_FROM_ADDRESS',
                                Value: 'no-reply@test.sdlc.example.edu'
                            },
                            {
                                Name: 'IMPORTER_FROM',
                                Value: 'importer-no-reply@test.sdlc.example.edu'
                            },
                            {
                                Name: 'DYNAMODB_CACHE_TABLE',
                                Value: {Ref: 'pccsdlctestcacheFE02D1F3'}
                            },
                            {
                                Name: 'SQS_QUEUE',
                                Value: {Ref: 'pccsdlctestqueue3EA5766D'}
                            },
                            {
                                Name: 'AWS_SECRET_ARN',
                                Value: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':secretsmanager:us-west-2:11111:secret:pcc-sdlc-test-secrets/environment'
                                        ]
                                    ]
                                }
                            },
                            {Name: 'APP_BASE_PATH', Value: '/app'}
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
                                                                ':ecr:us-west-2:12344:repository/pcc-test/phpfpm'
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
                                                                ':ecr:us-west-2:12344:repository/pcc-test/phpfpm'
                                                            ]
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    '.',
                                    {Ref: 'AWS::URLSuffix'},
                                    '/pcc-test/phpfpm:1'
                                ]
                            ]
                        },
                        LogConfiguration: {
                            LogDriver: 'awslogs',
                            Options: {
                                'awslogs-group': {
                                    Ref: 'pccsdlctestcontainerphpfpmwebu0loggroup11DFEEF9'
                                },
                                'awslogs-stream-prefix': 'phpfpm',
                                'awslogs-region': 'us-west-2'
                            }
                        },
                        Memory: 128,
                        Name: 'pcc-sdlc-test-container-phpfpm-web-u-0',
                        PortMappings: [{ContainerPort: 9000, Protocol: 'tcp'}],
                        ReadonlyRootFilesystem: true
                    }
                ],
                Cpu: '256',
                ExecutionRoleArn: {
                    'Fn::GetAtt': ['pccsdlctesttaskdefweb0execrole33B297FF', 'Arn']
                },
                Family: 'pcc-sdlc-test-task-def-web-0',
                Memory: '512',
                NetworkMode: 'awsvpc',
                RequiresCompatibilities: ['FARGATE'],
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                TaskRoleArn: {
                    'Fn::GetAtt': ['pccsdlctesttaskdefweb0TaskRoleFFDD04CB', 'Arn']
                }
            }
        },
        pccsdlctestcontainernginxwebu0loggroup84744344: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                LogGroupName: 'pcc-sdlc-test-container-nginx-web-u-0-log-group',
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
        pccsdlctestcontainerphpfpmwebu0loggroup11DFEEF9: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                LogGroupName: 'pcc-sdlc-test-container-phpfpm-web-u-0-log-group',
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
        pccsdlctestserviceweb0ServiceC3F36893: {
            Type: 'AWS::ECS::Service',
            Properties: {
                Cluster: {Ref: 'pccsdlctestcluster8AFBBF8E'},
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
                        ContainerName: 'pcc-sdlc-test-container-nginx-web-u-0',
                        ContainerPort: 80,
                        TargetGroupArn: {Ref: 'pccsdlctesttg0CACFFBC'}
                    }
                ],
                NetworkConfiguration: {
                    AwsvpcConfiguration: {
                        AssignPublicIp: 'DISABLED',
                        SecurityGroups: [
                            {
                                'Fn::GetAtt': [
                                    'pccsdlctestserviceweb0SecurityGroup73F359E4',
                                    'GroupId'
                                ]
                            }
                        ],
                        Subnets: ['p-12345', 'p-67890']
                    }
                },
                PlatformVersion: 'LATEST',
                ServiceName: 'pcc-sdlc-test-service-web-0',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                TaskDefinition: {Ref: 'pccsdlctesttaskdefweb08FC2D8B2'}
            },
            DependsOn: [
                'pccsdlctestlistenerrule100C49C5383',
                'pccsdlctesttaskdefweb0TaskRoleDefaultPolicy5EA04ED0',
                'pccsdlctesttaskdefweb0TaskRoleFFDD04CB'
            ]
        },
        pccsdlctestserviceweb0SecurityGroup73F359E4: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                GroupDescription: 'pcc-shared-test/pcc-sdlc-test-stage/pcc-sdlc-test/pcc-sdlc-test-service-web-0/SecurityGroup',
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
            },
            DependsOn: [
                'pccsdlctesttaskdefweb0TaskRoleDefaultPolicy5EA04ED0',
                'pccsdlctesttaskdefweb0TaskRoleFFDD04CB'
            ]
        },
        pccsdlctestserviceweb0SecurityGroupfrompccsharedtestpccsdlcteststagepccsdlctestlookuphttpslistenerSecurityGroupsg1234567890123CA5764080862B313A: {
            Type: 'AWS::EC2::SecurityGroupIngress',
            Properties: {
                Description: 'Load balancer to target',
                FromPort: 80,
                GroupId: {
                    'Fn::GetAtt': [
                        'pccsdlctestserviceweb0SecurityGroup73F359E4',
                        'GroupId'
                    ]
                },
                IpProtocol: 'tcp',
                SourceSecurityGroupId: 'sg-12345678',
                ToPort: 80
            },
            DependsOn: [
                'pccsdlctesttaskdefweb0TaskRoleDefaultPolicy5EA04ED0',
                'pccsdlctesttaskdefweb0TaskRoleFFDD04CB'
            ]
        },
        pccsdlctestserviceweb0TaskCountTargetDDBC0BD8: {
            Type: 'AWS::ApplicationAutoScaling::ScalableTarget',
            Properties: {
                MaxCapacity: 3,
                MinCapacity: 1,
                ResourceId: {
                    'Fn::Join': [
                        '',
                        [
                            'service/',
                            {Ref: 'pccsdlctestcluster8AFBBF8E'},
                            '/',
                            {
                                'Fn::GetAtt': ['pccsdlctestserviceweb0ServiceC3F36893', 'Name']
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
                            ':iam::11111:role/aws-service-role/ecs.application-autoscaling.amazonaws.com/AWSServiceRoleForApplicationAutoScaling_ECSService'
                        ]
                    ]
                },
                ScalableDimension: 'ecs:service:DesiredCount',
                ServiceNamespace: 'ecs'
            },
            DependsOn: [
                'pccsdlctesttaskdefweb0TaskRoleDefaultPolicy5EA04ED0',
                'pccsdlctesttaskdefweb0TaskRoleFFDD04CB'
            ]
        },
        pccsdlctestserviceweb0TaskCountTargetpccsdlctestservicescalecpu85A29FBE: {
            Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
            Properties: {
                PolicyName: 'pccsharedtestpccsdlcteststagepccsdlctestpccsdlctestserviceweb0TaskCountTargetpccsdlctestservicescalecpuE263534B',
                PolicyType: 'TargetTrackingScaling',
                ScalingTargetId: {Ref: 'pccsdlctestserviceweb0TaskCountTargetDDBC0BD8'},
                TargetTrackingScalingPolicyConfiguration: {
                    PredefinedMetricSpecification: {PredefinedMetricType: 'ECSServiceAverageCPUUtilization'},
                    TargetValue: 75
                }
            },
            DependsOn: [
                'pccsdlctesttaskdefweb0TaskRoleDefaultPolicy5EA04ED0',
                'pccsdlctesttaskdefweb0TaskRoleFFDD04CB'
            ]
        },
        pccsdlctestserviceweb0TaskCountTargetpccsdlctestservicescalemem08710950: {
            Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
            Properties: {
                PolicyName: 'pccsharedtestpccsdlcteststagepccsdlctestpccsdlctestserviceweb0TaskCountTargetpccsdlctestservicescalemem42627C7E',
                PolicyType: 'TargetTrackingScaling',
                ScalingTargetId: {Ref: 'pccsdlctestserviceweb0TaskCountTargetDDBC0BD8'},
                TargetTrackingScalingPolicyConfiguration: {
                    PredefinedMetricSpecification: {
                        PredefinedMetricType: 'ECSServiceAverageMemoryUtilization'
                    },
                    TargetValue: 75
                }
            },
            DependsOn: [
                'pccsdlctesttaskdefweb0TaskRoleDefaultPolicy5EA04ED0',
                'pccsdlctesttaskdefweb0TaskRoleFFDD04CB'
            ]
        },
        pccsdlcteststartstopfnlg5E55121D: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                RetentionInDays: 14,
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlcteststartstopfnServiceRole451756BA: {
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
        pccsdlcteststartstopfnServiceRoleDefaultPolicy369D75C4: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 'ecs:ListServices',
                            Effect: 'Allow',
                            Resource: '*'
                        },
                        {
                            Action: ['ecs:DescribeServices', 'ecs:UpdateService'],
                            Condition: {
                                ArnEquals: {
                                    'ecs:cluster': {
                                        'Fn::GetAtt': ['pccsdlctestcluster8AFBBF8E', 'Arn']
                                    }
                                }
                            },
                            Effect: 'Allow',
                            Resource: '*'
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlcteststartstopfnServiceRoleDefaultPolicy369D75C4',
                Roles: [{Ref: 'pccsdlcteststartstopfnServiceRole451756BA'}]
            }
        },
        pccsdlcteststartstopfn47B5EC6C: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-11111-us-west-2',
                    S3Key: MatchHelper.endsWith('zip')
                },
                Environment: {
                    Variables: {CLUSTER: {Ref: 'pccsdlctestcluster8AFBBF8E'}}
                },
                FunctionName: 'pcc-sdlc-test-start-stop-fn',
                Handler: 'index.handler',
                LoggingConfig: {LogGroup: {Ref: 'pccsdlcteststartstopfnlg5E55121D'}},
                MemorySize: 128,
                Role: {
                    'Fn::GetAtt': ['pccsdlcteststartstopfnServiceRole451756BA', 'Arn']
                },
                Runtime: MatchHelper.startsWith('nodejs'),
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                Timeout: 5
            },
            DependsOn: [
                'pccsdlcteststartstopfnServiceRoleDefaultPolicy369D75C4',
                'pccsdlcteststartstopfnServiceRole451756BA'
            ]
        },
        pccsdlcteststartstopstopruleD8FE9F5B: {
            Type: 'AWS::Events::Rule',
            Properties: {
                ScheduleExpression: 'cron(0 5 * * ? *)',
                State: 'ENABLED',
                Targets: [
                    {
                        Arn: {
                            'Fn::GetAtt': ['pccsdlcteststartstopfn47B5EC6C', 'Arn']
                        },
                        Id: 'Target0',
                        Input: {
                            'Fn::Join': [
                                '',
                                [
                                    '{"cluster":"',
                                    {
                                        'Fn::GetAtt': ['pccsdlctestcluster8AFBBF8E', 'Arn']
                                    },
                                    '","status":"stop"}'
                                ]
                            ]
                        }
                    }
                ]
            }
        },
        pccsdlcteststartstopstopruleAllowEventRulepccsharedtestpccsdlcteststagepccsdlctestpccsdlcteststartstopfn7FD6B915AF02F29D: {
            Type: 'AWS::Lambda::Permission',
            Properties: {
                Action: 'lambda:InvokeFunction',
                FunctionName: {'Fn::GetAtt': ['pccsdlcteststartstopfn47B5EC6C', 'Arn']},
                Principal: 'events.amazonaws.com',
                SourceArn: {
                    'Fn::GetAtt': ['pccsdlcteststartstopstopruleD8FE9F5B', 'Arn']
                }
            }
        }
    },
    Outputs: {
        pccsdlctestsesverifytesttestsdlcexampleeduSesNotificationTopic707B824F: {
            Description: 'SES notification topic for test.sdlc.example.edu',
            Value: {Ref: 'pccsdlctestsesverifytestSesNotificationTopicF2D450E7'}
        }
    }
}