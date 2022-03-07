module.exports = {
    Resources: {
        sdlcstackarecordtestdevexampleeduarecord34D230F4: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                Name: 'test.dev.example.edu.',
                Type: 'A',
                AliasTarget: {
                    DNSName: 'dualstack.my-load-balancer-1234567890.us-west-2.elb.amazonaws.com',
                    HostedZoneId: 'Z3DZXE0EXAMPLE'
                },
                Comment: 'sdlc-stack-arecord: test.dev.example.edu',
                HostedZoneId: 'DUMMY'
            }
        },
        sdlcstacksesverifytestVerifyDomainIdentityCustomResourcePolicyB3438DEE: {
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
                PolicyName: 'sdlcstacksesverifytestVerifyDomainIdentityCustomResourcePolicyB3438DEE',
                Roles: [
                    {
                        Ref: 'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2'
                    }
                ]
            }
        },
        sdlcstacksesverifytestVerifyDomainIdentity1E2BB072: {
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
                'sdlcstacksesverifytestVerifyDomainIdentityCustomResourcePolicyB3438DEE'
            ],
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        sdlcstacksesverifytestSesVerificationRecord3849A670: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                Name: '_amazonses.test.dev.example.edu.',
                Type: 'TXT',
                HostedZoneId: 'DUMMY',
                ResourceRecords: [
                    {
                        'Fn::Join': [
                            '',
                            [
                                '"',
                                {
                                    'Fn::GetAtt': [
                                        'sdlcstacksesverifytestVerifyDomainIdentity1E2BB072',
                                        'VerificationToken'
                                    ]
                                },
                                '"'
                            ]
                        ]
                    }
                ],
                TTL: '1800'
            },
            DependsOn: [
                'sdlcstacksesverifytestVerifyDomainIdentityCustomResourcePolicyB3438DEE',
                'sdlcstacksesverifytestVerifyDomainIdentity1E2BB072'
            ]
        },
        sdlcstacksesverifytestVerifyDomainDkimCustomResourcePolicyD2C322F9: {
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
                PolicyName: 'sdlcstacksesverifytestVerifyDomainDkimCustomResourcePolicyD2C322F9',
                Roles: [
                    {
                        Ref: 'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2'
                    }
                ]
            },
            DependsOn: [
                'sdlcstacksesverifytestVerifyDomainIdentityCustomResourcePolicyB3438DEE',
                'sdlcstacksesverifytestVerifyDomainIdentity1E2BB072'
            ]
        },
        sdlcstacksesverifytestVerifyDomainDkim14189403: {
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
                'sdlcstacksesverifytestVerifyDomainDkimCustomResourcePolicyD2C322F9',
                'sdlcstacksesverifytestVerifyDomainIdentityCustomResourcePolicyB3438DEE',
                'sdlcstacksesverifytestVerifyDomainIdentity1E2BB072'
            ],
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        sdlcstacksesverifytestSesDkimVerificationRecord0E95ACD62: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                Name: {
                    'Fn::Join': [
                        '',
                        [
                            {
                                'Fn::GetAtt': [
                                    'sdlcstacksesverifytestVerifyDomainDkim14189403',
                                    'DkimTokens.0'
                                ]
                            },
                            '._domainkey.test.dev.example.edu.'
                        ]
                    ]
                },
                Type: 'CNAME',
                HostedZoneId: 'DUMMY',
                ResourceRecords: [
                    {
                        'Fn::Join': [
                            '',
                            [
                                {
                                    'Fn::GetAtt': [
                                        'sdlcstacksesverifytestVerifyDomainDkim14189403',
                                        'DkimTokens.0'
                                    ]
                                },
                                '.dkim.amazonses.com'
                            ]
                        ]
                    }
                ],
                TTL: '1800'
            },
            DependsOn: [
                'sdlcstacksesverifytestVerifyDomainDkimCustomResourcePolicyD2C322F9',
                'sdlcstacksesverifytestVerifyDomainDkim14189403'
            ]
        },
        sdlcstacksesverifytestSesDkimVerificationRecord15521F27C: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                Name: {
                    'Fn::Join': [
                        '',
                        [
                            {
                                'Fn::GetAtt': [
                                    'sdlcstacksesverifytestVerifyDomainDkim14189403',
                                    'DkimTokens.1'
                                ]
                            },
                            '._domainkey.test.dev.example.edu.'
                        ]
                    ]
                },
                Type: 'CNAME',
                HostedZoneId: 'DUMMY',
                ResourceRecords: [
                    {
                        'Fn::Join': [
                            '',
                            [
                                {
                                    'Fn::GetAtt': [
                                        'sdlcstacksesverifytestVerifyDomainDkim14189403',
                                        'DkimTokens.1'
                                    ]
                                },
                                '.dkim.amazonses.com'
                            ]
                        ]
                    }
                ],
                TTL: '1800'
            },
            DependsOn: [
                'sdlcstacksesverifytestVerifyDomainDkimCustomResourcePolicyD2C322F9',
                'sdlcstacksesverifytestVerifyDomainDkim14189403'
            ]
        },
        sdlcstacksesverifytestSesDkimVerificationRecord29FBDB015: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                Name: {
                    'Fn::Join': [
                        '',
                        [
                            {
                                'Fn::GetAtt': [
                                    'sdlcstacksesverifytestVerifyDomainDkim14189403',
                                    'DkimTokens.2'
                                ]
                            },
                            '._domainkey.test.dev.example.edu.'
                        ]
                    ]
                },
                Type: 'CNAME',
                HostedZoneId: 'DUMMY',
                ResourceRecords: [
                    {
                        'Fn::Join': [
                            '',
                            [
                                {
                                    'Fn::GetAtt': [
                                        'sdlcstacksesverifytestVerifyDomainDkim14189403',
                                        'DkimTokens.2'
                                    ]
                                },
                                '.dkim.amazonses.com'
                            ]
                        ]
                    }
                ],
                TTL: '1800'
            },
            DependsOn: [
                'sdlcstacksesverifytestVerifyDomainDkimCustomResourcePolicyD2C322F9',
                'sdlcstacksesverifytestVerifyDomainDkim14189403'
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
                                    'sdlcstacktaskdefcreateruntask0TaskRoleAECE1908',
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: 'iam:PassRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'sdlcstacktaskdefcreateruntask0execrole12045EA1',
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: 'iam:PassRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'sdlcstacktaskdefupdateruntask0TaskRoleBD733382',
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: 'iam:PassRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'sdlcstacktaskdefupdateruntask0execrole92A0A88F',
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
                    S3Bucket: 'cdk-hnb659fds-assets-2222-us-west-2',
                    S3Key: '4a575666d1c2c6412590d2a56f328e040a81ad1ef59aecee31ae9b393d05f659.zip'
                },
                Role: {
                    'Fn::GetAtt': [
                        'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2',
                        'Arn'
                    ]
                },
                Handler: 'index.handler',
                Runtime: 'nodejs12.x',
                Tags: [
                    {Key: 'App', Value: 'myapp'},
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
        sdlcstacktgB6898DC5: {
            Type: 'AWS::ElasticLoadBalancingV2::TargetGroup',
            Properties: {
                HealthCheckPath: '/api/healthz',
                HealthCheckProtocol: 'HTTP',
                Name: 'sdlc-stack-tg',
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
        sdlcstacklistenerrule100BCBF6621: {
            Type: 'AWS::ElasticLoadBalancingV2::ListenerRule',
            Properties: {
                Actions: [
                    {
                        TargetGroupArn: {Ref: 'sdlcstacktgB6898DC5'},
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
        sdlcstacktghealthtopic843F8E43: {
            Type: 'AWS::SNS::Topic',
            Properties: {
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        sdlcstacktghealthtopictestexampleedu6BB68927: {
            Type: 'AWS::SNS::Subscription',
            Properties: {
                Protocol: 'email',
                TopicArn: {Ref: 'sdlcstacktghealthtopic843F8E43'},
                Endpoint: 'test@example.edu'
            }
        },
        sdlcstacktghealthalarm7B357DC3: {
            Type: 'AWS::CloudWatch::Alarm',
            Properties: {
                ComparisonOperator: 'GreaterThanOrEqualToThreshold',
                EvaluationPeriods: 3,
                AlarmActions: [{Ref: 'sdlcstacktghealthtopic843F8E43'}],
                Dimensions: [
                    {
                        Name: 'LoadBalancer',
                        Value: 'application/my-load-balancer/50dc6c495c0c9188'
                    },
                    {
                        Name: 'TargetGroup',
                        Value: {
                            'Fn::GetAtt': ['sdlcstacktgB6898DC5', 'TargetGroupFullName']
                        }
                    }
                ],
                MetricName: 'UnHealthyHostCount',
                Namespace: 'AWS/ApplicationELB',
                OKActions: [{Ref: 'sdlcstacktghealthtopic843F8E43'}],
                Period: 60,
                Statistic: 'Maximum',
                Threshold: 1
            }
        },
        sdlcstackcache23E312EE: {
            Type: 'AWS::DynamoDB::Table',
            Properties: {
                KeySchema: [{AttributeName: 'key', KeyType: 'HASH'}],
                AttributeDefinitions: [{AttributeName: 'key', AttributeType: 'S'}],
                BillingMode: 'PAY_PER_REQUEST',
                SSESpecification: {SSEEnabled: true},
                TableName: 'sdlc-stack-cache',
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        sdlcstackdlqB998AC86: {
            Type: 'AWS::SQS::Queue',
            Properties: {
                KmsMasterKeyId: 'alias/aws/sqs',
                MessageRetentionPeriod: 259200,
                QueueName: 'sdlc-stack-dlq',
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        sdlcstackqueue5CB6143E: {
            Type: 'AWS::SQS::Queue',
            Properties: {
                KmsMasterKeyId: 'alias/aws/sqs',
                QueueName: 'sdlc-stack-queue',
                RedrivePolicy: {
                    deadLetterTargetArn: {'Fn::GetAtt': ['sdlcstackdlqB998AC86', 'Arn']},
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
        sdlcstacks34E44945B: {
            Type: 'AWS::S3::Bucket',
            Properties: {
                BucketEncryption: {
                    ServerSideEncryptionConfiguration: [
                        {
                            ServerSideEncryptionByDefault: {SSEAlgorithm: 'aws:kms'}
                        }
                    ]
                },
                BucketName: 'sdlc-stack-s3',
                PublicAccessBlockConfiguration: {
                    BlockPublicAcls: true,
                    BlockPublicPolicy: true,
                    IgnorePublicAcls: true,
                    RestrictPublicBuckets: true
                },
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            },
            UpdateReplacePolicy: 'Retain',
            DeletionPolicy: 'Retain'
        },
        sdlcstacks3PolicyECEFCE92: {
            Type: 'AWS::S3::BucketPolicy',
            Properties: {
                Bucket: {Ref: 'sdlcstacks34E44945B'},
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 's3:*',
                            Condition: {Bool: {'aws:SecureTransport': 'false'}},
                            Effect: 'Deny',
                            Principal: {AWS: '*'},
                            Resource: [
                                {'Fn::GetAtt': ['sdlcstacks34E44945B', 'Arn']},
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': ['sdlcstacks34E44945B', 'Arn']
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
        sdlcstackclusterC84D7329: {
            Type: 'AWS::ECS::Cluster',
            Properties: {
                ClusterName: 'sdlc-stack-cluster',
                ClusterSettings: [{Name: 'containerInsights', Value: 'disabled'}],
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        sdlcstackclusteralarmtopic7DF9AAF5: {
            Type: 'AWS::SNS::Topic',
            Properties: {
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        sdlcstackclusteralarmtopictestexampleedu3541DC19: {
            Type: 'AWS::SNS::Subscription',
            Properties: {
                Protocol: 'email',
                TopicArn: {Ref: 'sdlcstackclusteralarmtopic7DF9AAF5'},
                Endpoint: 'test@example.edu'
            }
        },
        sdlcstackclustercpualarm46F19F5E: {
            Type: 'AWS::CloudWatch::Alarm',
            Properties: {
                ComparisonOperator: 'GreaterThanOrEqualToThreshold',
                EvaluationPeriods: 1,
                AlarmActions: [{Ref: 'sdlcstackclusteralarmtopic7DF9AAF5'}],
                Dimensions: [
                    {
                        Name: 'ClusterName',
                        Value: {Ref: 'sdlcstackclusterC84D7329'}
                    }
                ],
                MetricName: 'CPUUtilization',
                Namespace: 'AWS/ECS',
                OKActions: [{Ref: 'sdlcstackclusteralarmtopic7DF9AAF5'}],
                Period: 300,
                Statistic: 'Average',
                Threshold: 90
            }
        },
        sdlcstackclustermemoryalarm77C15A4F: {
            Type: 'AWS::CloudWatch::Alarm',
            Properties: {
                ComparisonOperator: 'GreaterThanOrEqualToThreshold',
                EvaluationPeriods: 1,
                AlarmActions: [{Ref: 'sdlcstackclusteralarmtopic7DF9AAF5'}],
                Dimensions: [
                    {
                        Name: 'ClusterName',
                        Value: {Ref: 'sdlcstackclusterC84D7329'}
                    }
                ],
                MetricName: 'MemoryUtilization',
                Namespace: 'AWS/ECS',
                OKActions: [{Ref: 'sdlcstackclusteralarmtopic7DF9AAF5'}],
                Period: 300,
                Statistic: 'Average',
                Threshold: 90
            }
        },
        sdlcstacktaskdefcreateruntask0execrole12045EA1: {
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
                RoleName: 'stacksdlcstackc7d51330runtask0execrolee8f353cc8c26b40fa423',
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        sdlcstacktaskdefcreateruntask0execroleDefaultPolicy09308D6C: {
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
                                        ':ecr:us-east-1:12344:repository/stack/phpfpm'
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
                                    'sdlcstackcontainerphpfpmcreateruntaskcrot0loggroup4EE94636',
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
                                        ':secretsmanager:us-west-2:2222:secret:sdlc-stack-secrets/environment-??????'
                                    ]
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'sdlcstacktaskdefcreateruntask0execroleDefaultPolicy09308D6C',
                Roles: [{Ref: 'sdlcstacktaskdefcreateruntask0execrole12045EA1'}]
            }
        },
        sdlcstacktaskdefcreateruntask0TaskRoleAECE1908: {
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
        sdlcstacktaskdefcreateruntask0TaskRoleDefaultPolicyA4CEC6EB: {
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
                                {'Fn::GetAtt': ['sdlcstacks34E44945B', 'Arn']},
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': ['sdlcstacks34E44945B', 'Arn']
                                            },
                                            '/*'
                                        ]
                                    ]
                                }
                            ]
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
                                {'Fn::GetAtt': ['sdlcstackcache23E312EE', 'Arn']},
                                {Ref: 'AWS::NoValue'}
                            ]
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'sdlcstacktaskdefcreateruntask0TaskRoleDefaultPolicyA4CEC6EB',
                Roles: [{Ref: 'sdlcstacktaskdefcreateruntask0TaskRoleAECE1908'}]
            }
        },
        sdlcstacktaskdefcreateruntask0C250D0F0: {
            Type: 'AWS::ECS::TaskDefinition',
            Properties: {
                ContainerDefinitions: [
                    {
                        Command: ['/on_create.sh'],
                        Cpu: 256,
                        EntryPoint: ['/bin/sh', '-c'],
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
                                Name: 'DYNAMODB_CACHE_TABLE',
                                Value: {Ref: 'sdlcstackcache23E312EE'}
                            },
                            {
                                Name: 'SQS_QUEUE',
                                Value: {Ref: 'sdlcstackqueue5CB6143E'}
                            },
                            {
                                Name: 'AWS_BUCKET',
                                Value: {Ref: 'sdlcstacks34E44945B'}
                            },
                            {Name: 'CAN_RUN_CREATE', Value: '1'}
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
                                                                ':ecr:us-east-1:12344:repository/stack/phpfpm'
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
                                                                ':ecr:us-east-1:12344:repository/stack/phpfpm'
                                                            ]
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    '.',
                                    {Ref: 'AWS::URLSuffix'},
                                    '/stack/phpfpm:stack/phpfpm'
                                ]
                            ]
                        },
                        LogConfiguration: {
                            LogDriver: 'awslogs',
                            Options: {
                                'awslogs-group': {
                                    Ref: 'sdlcstackcontainerphpfpmcreateruntaskcrot0loggroup4EE94636'
                                },
                                'awslogs-stream-prefix': 'phpfpm',
                                'awslogs-region': 'us-west-2'
                            }
                        },
                        Memory: 512,
                        Name: 'sdlc-stack-container-phpfpm-createruntask-crot-0',
                        Secrets: [
                            {
                                Name: 'FOO',
                                ValueFrom: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':secretsmanager:us-west-2:2222:secret:sdlc-stack-secrets/environment:FOO::'
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
                                            ':secretsmanager:us-west-2:2222:secret:sdlc-stack-secrets/environment:BAR::'
                                        ]
                                    ]
                                }
                            }
                        ]
                    }
                ],
                Cpu: '256',
                ExecutionRoleArn: {
                    'Fn::GetAtt': ['sdlcstacktaskdefcreateruntask0execrole12045EA1', 'Arn']
                },
                Family: 'sdlc-stack-task-def-createruntask-0',
                Memory: '512',
                NetworkMode: 'awsvpc',
                RequiresCompatibilities: ['FARGATE'],
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                TaskRoleArn: {
                    'Fn::GetAtt': ['sdlcstacktaskdefcreateruntask0TaskRoleAECE1908', 'Arn']
                }
            }
        },
        sdlcstackcontainerphpfpmcreateruntaskcrot0loggroup4EE94636: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                LogGroupName: 'sdlc-stack-container-phpfpm-createruntask-crot-0-log-group',
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
        sdlcstacktaskcreateruntask0SecurityGroupC27AE768: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                GroupDescription: 'stack/sdlc-stack/sdlc-stack-task-createruntask-0/SecurityGroup',
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
        sdlcstacktaskcreateruntask0createfnCustomResourcePolicyB94FE94A: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 'ecs:RunTask',
                            Effect: 'Allow',
                            Resource: {Ref: 'sdlcstacktaskdefcreateruntask0C250D0F0'}
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'sdlcstacktaskcreateruntask0createfnCustomResourcePolicyB94FE94A',
                Roles: [
                    {
                        Ref: 'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2'
                    }
                ]
            }
        },
        sdlcstacktaskcreateruntask0createfnE2228E60: {
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
                            {Ref: 'sdlcstacktaskdefcreateruntask0C250D0F0'},
                            '"},"parameters":{"cluster":"',
                            {Ref: 'sdlcstackclusterC84D7329'},
                            '","taskDefinition":"',
                            {Ref: 'sdlcstacktaskdefcreateruntask0C250D0F0'},
                            '","capacityProviderStrategy":[],"launchType":"FARGATE","platformVersion":"LATEST","networkConfiguration":{"awsvpcConfiguration":{"assignPublicIp":"DISABLED","subnets":["p-12345","p-67890"],"securityGroups":["',
                            {
                                'Fn::GetAtt': [
                                    'sdlcstacktaskcreateruntask0SecurityGroupC27AE768',
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
                'sdlcstacktaskcreateruntask0createfnCustomResourcePolicyB94FE94A'
            ],
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        sdlcstacktaskdefupdateruntask0execrole92A0A88F: {
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
                RoleName: 'stacksdlcstackc7d51330runtask0execroleadc81096c79afaaa03ce',
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        sdlcstacktaskdefupdateruntask0execroleDefaultPolicy13371C83: {
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
                                        ':ecr:us-east-1:12344:repository/stack/phpfpm'
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
                                    'sdlcstackcontainerphpfpmupdateruntaskurot0loggroup3814CEF3',
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
                                        ':secretsmanager:us-west-2:2222:secret:sdlc-stack-secrets/environment-??????'
                                    ]
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'sdlcstacktaskdefupdateruntask0execroleDefaultPolicy13371C83',
                Roles: [{Ref: 'sdlcstacktaskdefupdateruntask0execrole92A0A88F'}]
            }
        },
        sdlcstacktaskdefupdateruntask0TaskRoleBD733382: {
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
        sdlcstacktaskdefupdateruntask0TaskRoleDefaultPolicy077B040C: {
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
                                {'Fn::GetAtt': ['sdlcstacks34E44945B', 'Arn']},
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': ['sdlcstacks34E44945B', 'Arn']
                                            },
                                            '/*'
                                        ]
                                    ]
                                }
                            ]
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
                                {'Fn::GetAtt': ['sdlcstackcache23E312EE', 'Arn']},
                                {Ref: 'AWS::NoValue'}
                            ]
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'sdlcstacktaskdefupdateruntask0TaskRoleDefaultPolicy077B040C',
                Roles: [{Ref: 'sdlcstacktaskdefupdateruntask0TaskRoleBD733382'}]
            }
        },
        sdlcstacktaskdefupdateruntask04EC0A180: {
            Type: 'AWS::ECS::TaskDefinition',
            Properties: {
                ContainerDefinitions: [
                    {
                        Command: ['artisan', 'migrate', '--force'],
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
                                Name: 'DYNAMODB_CACHE_TABLE',
                                Value: {Ref: 'sdlcstackcache23E312EE'}
                            },
                            {
                                Name: 'SQS_QUEUE',
                                Value: {Ref: 'sdlcstackqueue5CB6143E'}
                            },
                            {
                                Name: 'AWS_BUCKET',
                                Value: {Ref: 'sdlcstacks34E44945B'}
                            },
                            {Name: 'CAN_RUN_CREATE', Value: '1'}
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
                                                                ':ecr:us-east-1:12344:repository/stack/phpfpm'
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
                                                                ':ecr:us-east-1:12344:repository/stack/phpfpm'
                                                            ]
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    '.',
                                    {Ref: 'AWS::URLSuffix'},
                                    '/stack/phpfpm:stack/phpfpm'
                                ]
                            ]
                        },
                        LogConfiguration: {
                            LogDriver: 'awslogs',
                            Options: {
                                'awslogs-group': {
                                    Ref: 'sdlcstackcontainerphpfpmupdateruntaskurot0loggroup3814CEF3'
                                },
                                'awslogs-stream-prefix': 'phpfpm',
                                'awslogs-region': 'us-west-2'
                            }
                        },
                        Memory: 512,
                        Name: 'sdlc-stack-container-phpfpm-updateruntask-urot-0',
                        Secrets: [
                            {
                                Name: 'FOO',
                                ValueFrom: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':secretsmanager:us-west-2:2222:secret:sdlc-stack-secrets/environment:FOO::'
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
                                            ':secretsmanager:us-west-2:2222:secret:sdlc-stack-secrets/environment:BAR::'
                                        ]
                                    ]
                                }
                            }
                        ]
                    }
                ],
                Cpu: '256',
                ExecutionRoleArn: {
                    'Fn::GetAtt': ['sdlcstacktaskdefupdateruntask0execrole92A0A88F', 'Arn']
                },
                Family: 'sdlc-stack-task-def-updateruntask-0',
                Memory: '512',
                NetworkMode: 'awsvpc',
                RequiresCompatibilities: ['FARGATE'],
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                TaskRoleArn: {
                    'Fn::GetAtt': ['sdlcstacktaskdefupdateruntask0TaskRoleBD733382', 'Arn']
                }
            }
        },
        sdlcstackcontainerphpfpmupdateruntaskurot0loggroup3814CEF3: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                LogGroupName: 'sdlc-stack-container-phpfpm-updateruntask-urot-0-log-group',
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
        sdlcstacktaskupdateruntask0SecurityGroup18F42937: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                GroupDescription: 'stack/sdlc-stack/sdlc-stack-task-updateruntask-0/SecurityGroup',
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
        sdlcstacktaskupdateruntask0updatefnCustomResourcePolicyE140266E: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 'ecs:RunTask',
                            Effect: 'Allow',
                            Resource: {Ref: 'sdlcstacktaskdefupdateruntask04EC0A180'}
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'sdlcstacktaskupdateruntask0updatefnCustomResourcePolicyE140266E',
                Roles: [
                    {
                        Ref: 'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2'
                    }
                ]
            }
        },
        sdlcstacktaskupdateruntask0updatefn99888DCD: {
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
                            {Ref: 'sdlcstacktaskdefupdateruntask04EC0A180'},
                            '"},"parameters":{"cluster":"',
                            {Ref: 'sdlcstackclusterC84D7329'},
                            '","taskDefinition":"',
                            {Ref: 'sdlcstacktaskdefupdateruntask04EC0A180'},
                            '","capacityProviderStrategy":[],"launchType":"FARGATE","platformVersion":"LATEST","networkConfiguration":{"awsvpcConfiguration":{"assignPublicIp":"DISABLED","subnets":["p-12345","p-67890"],"securityGroups":["',
                            {
                                'Fn::GetAtt': [
                                    'sdlcstacktaskupdateruntask0SecurityGroup18F42937',
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
                            {Ref: 'sdlcstacktaskdefupdateruntask04EC0A180'},
                            '"},"parameters":{"cluster":"',
                            {Ref: 'sdlcstackclusterC84D7329'},
                            '","taskDefinition":"',
                            {Ref: 'sdlcstacktaskdefupdateruntask04EC0A180'},
                            '","capacityProviderStrategy":[],"launchType":"FARGATE","platformVersion":"LATEST","networkConfiguration":{"awsvpcConfiguration":{"assignPublicIp":"DISABLED","subnets":["p-12345","p-67890"],"securityGroups":["',
                            {
                                'Fn::GetAtt': [
                                    'sdlcstacktaskupdateruntask0SecurityGroup18F42937',
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
                'sdlcstacktaskupdateruntask0updatefnCustomResourcePolicyE140266E'
            ],
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        sdlcstacktaskdefscheduledtask0execroleA22CBF1D: {
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
                RoleName: 'stacksdlcstackc7d51330ledtask0execrole55266576d307a8ff14ab',
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        sdlcstacktaskdefscheduledtask0execroleDefaultPolicy3B3D9945: {
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
                                        ':ecr:us-east-1:12344:repository/stack/phpfpm'
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
                                    'sdlcstackcontainerphpfpmscheduledtaskst0loggroup44B9D0E4',
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
                                        ':secretsmanager:us-west-2:2222:secret:sdlc-stack-secrets/environment-??????'
                                    ]
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'sdlcstacktaskdefscheduledtask0execroleDefaultPolicy3B3D9945',
                Roles: [{Ref: 'sdlcstacktaskdefscheduledtask0execroleA22CBF1D'}]
            }
        },
        sdlcstacktaskdefscheduledtask0TaskRole0C126AE2: {
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
        sdlcstacktaskdefscheduledtask0TaskRoleDefaultPolicy42EAA242: {
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
                            Resource: {'Fn::GetAtt': ['sdlcstackqueue5CB6143E', 'Arn']}
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
                                {'Fn::GetAtt': ['sdlcstacks34E44945B', 'Arn']},
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': ['sdlcstacks34E44945B', 'Arn']
                                            },
                                            '/*'
                                        ]
                                    ]
                                }
                            ]
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
                                {'Fn::GetAtt': ['sdlcstackcache23E312EE', 'Arn']},
                                {Ref: 'AWS::NoValue'}
                            ]
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'sdlcstacktaskdefscheduledtask0TaskRoleDefaultPolicy42EAA242',
                Roles: [{Ref: 'sdlcstacktaskdefscheduledtask0TaskRole0C126AE2'}]
            }
        },
        sdlcstacktaskdefscheduledtask0E3775E7B: {
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
                                Name: 'DYNAMODB_CACHE_TABLE',
                                Value: {Ref: 'sdlcstackcache23E312EE'}
                            },
                            {
                                Name: 'SQS_QUEUE',
                                Value: {Ref: 'sdlcstackqueue5CB6143E'}
                            },
                            {
                                Name: 'AWS_BUCKET',
                                Value: {Ref: 'sdlcstacks34E44945B'}
                            },
                            {Name: 'CAN_RUN_CREATE', Value: '1'}
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
                                                                ':ecr:us-east-1:12344:repository/stack/phpfpm'
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
                                                                ':ecr:us-east-1:12344:repository/stack/phpfpm'
                                                            ]
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    '.',
                                    {Ref: 'AWS::URLSuffix'},
                                    '/stack/phpfpm:stack/phpfpm'
                                ]
                            ]
                        },
                        LogConfiguration: {
                            LogDriver: 'awslogs',
                            Options: {
                                'awslogs-group': {
                                    Ref: 'sdlcstackcontainerphpfpmscheduledtaskst0loggroup44B9D0E4'
                                },
                                'awslogs-stream-prefix': 'phpfpm',
                                'awslogs-region': 'us-west-2'
                            }
                        },
                        Memory: 512,
                        Name: 'sdlc-stack-container-phpfpm-scheduledtask-st-0',
                        Secrets: [
                            {
                                Name: 'FOO',
                                ValueFrom: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':secretsmanager:us-west-2:2222:secret:sdlc-stack-secrets/environment:FOO::'
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
                                            ':secretsmanager:us-west-2:2222:secret:sdlc-stack-secrets/environment:BAR::'
                                        ]
                                    ]
                                }
                            }
                        ]
                    }
                ],
                Cpu: '256',
                ExecutionRoleArn: {
                    'Fn::GetAtt': ['sdlcstacktaskdefscheduledtask0execroleA22CBF1D', 'Arn']
                },
                Family: 'sdlc-stack-task-def-scheduledtask-0',
                Memory: '512',
                NetworkMode: 'awsvpc',
                RequiresCompatibilities: ['FARGATE'],
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                TaskRoleArn: {
                    'Fn::GetAtt': ['sdlcstacktaskdefscheduledtask0TaskRole0C126AE2', 'Arn']
                }
            }
        },
        sdlcstacktaskdefscheduledtask0EventsRoleF5629A19: {
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
        sdlcstacktaskdefscheduledtask0EventsRoleDefaultPolicy70740529: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 'ecs:RunTask',
                            Condition: {
                                ArnEquals: {
                                    'ecs:cluster': {
                                        'Fn::GetAtt': ['sdlcstackclusterC84D7329', 'Arn']
                                    }
                                }
                            },
                            Effect: 'Allow',
                            Resource: {Ref: 'sdlcstacktaskdefscheduledtask0E3775E7B'}
                        },
                        {
                            Action: 'iam:PassRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'sdlcstacktaskdefscheduledtask0execroleA22CBF1D',
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: 'iam:PassRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'sdlcstacktaskdefscheduledtask0TaskRole0C126AE2',
                                    'Arn'
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'sdlcstacktaskdefscheduledtask0EventsRoleDefaultPolicy70740529',
                Roles: [
                    {Ref: 'sdlcstacktaskdefscheduledtask0EventsRoleF5629A19'}
                ]
            }
        },
        sdlcstacktaskdefscheduledtask0SecurityGroup82FD712E: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                GroupDescription: 'stack/sdlc-stack/sdlc-stack-task-def-scheduledtask-0/SecurityGroup',
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
        sdlcstackcontainerphpfpmscheduledtaskst0loggroup44B9D0E4: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                LogGroupName: 'sdlc-stack-container-phpfpm-scheduledtask-st-0-log-group',
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
        sdlcstacktaskscheduledtask0ScheduledEventRule46A9F4AE: {
            Type: 'AWS::Events::Rule',
            Properties: {
                Name: 'sdlc-stack-task-scheduledtask-0',
                ScheduleExpression: 'cron(0 12 * * ? *)',
                State: 'ENABLED',
                Targets: [
                    {
                        Arn: {'Fn::GetAtt': ['sdlcstackclusterC84D7329', 'Arn']},
                        EcsParameters: {
                            LaunchType: 'FARGATE',
                            NetworkConfiguration: {
                                AwsVpcConfiguration: {
                                    AssignPublicIp: 'DISABLED',
                                    SecurityGroups: [
                                        {
                                            'Fn::GetAtt': [
                                                'sdlcstacktaskdefscheduledtask0SecurityGroup82FD712E',
                                                'GroupId'
                                            ]
                                        }
                                    ],
                                    Subnets: ['p-12345', 'p-67890']
                                }
                            },
                            PlatformVersion: 'LATEST',
                            TaskCount: 1,
                            TaskDefinitionArn: {Ref: 'sdlcstacktaskdefscheduledtask0E3775E7B'}
                        },
                        Id: 'Target0',
                        Input: '{}',
                        RoleArn: {
                            'Fn::GetAtt': [
                                'sdlcstacktaskdefscheduledtask0EventsRoleF5629A19',
                                'Arn'
                            ]
                        }
                    }
                ]
            }
        },
        sdlcstacktaskdefweb0execrole5521DF49: {
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
                RoleName: 'stacksdlcstackc7d51330kdefweb0execrolefb49016918e93e300cd2',
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        sdlcstacktaskdefweb0execroleDefaultPolicyF071B2C2: {
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
                                        ':ecr:us-east-1:12344:repository/stack/nginx'
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
                                    'sdlcstackcontainernginxwebu0loggroup97CBCF6E',
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
                                        ':ecr:us-east-1:12344:repository/stack/phpfpm'
                                    ]
                                ]
                            }
                        },
                        {
                            Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'sdlcstackcontainerphpfpmwebu0loggroupC0271501',
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
                                        ':secretsmanager:us-west-2:2222:secret:sdlc-stack-secrets/environment-??????'
                                    ]
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'sdlcstacktaskdefweb0execroleDefaultPolicyF071B2C2',
                Roles: [{Ref: 'sdlcstacktaskdefweb0execrole5521DF49'}]
            }
        },
        sdlcstacktaskdefweb0TaskRole4E559BCA: {
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
        sdlcstacktaskdefweb0TaskRoleDefaultPolicyAB528690: {
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
                            Resource: {'Fn::GetAtt': ['sdlcstackqueue5CB6143E', 'Arn']}
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
                                {'Fn::GetAtt': ['sdlcstacks34E44945B', 'Arn']},
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': ['sdlcstacks34E44945B', 'Arn']
                                            },
                                            '/*'
                                        ]
                                    ]
                                }
                            ]
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
                                {'Fn::GetAtt': ['sdlcstackcache23E312EE', 'Arn']},
                                {Ref: 'AWS::NoValue'}
                            ]
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'sdlcstacktaskdefweb0TaskRoleDefaultPolicyAB528690',
                Roles: [{Ref: 'sdlcstacktaskdefweb0TaskRole4E559BCA'}]
            }
        },
        sdlcstacktaskdefweb0399B538F: {
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
                                                                ':ecr:us-east-1:12344:repository/stack/nginx'
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
                                                                ':ecr:us-east-1:12344:repository/stack/nginx'
                                                            ]
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    '.',
                                    {Ref: 'AWS::URLSuffix'},
                                    '/stack/nginx:stack/nginx'
                                ]
                            ]
                        },
                        LogConfiguration: {
                            LogDriver: 'awslogs',
                            Options: {
                                'awslogs-group': {
                                    Ref: 'sdlcstackcontainernginxwebu0loggroup97CBCF6E'
                                },
                                'awslogs-stream-prefix': 'nginx',
                                'awslogs-region': 'us-west-2'
                            }
                        },
                        Memory: 64,
                        Name: 'sdlc-stack-container-nginx-web-u-0',
                        PortMappings: [{ContainerPort: 80, Protocol: 'tcp'}],
                        Secrets: []
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
                                Name: 'DYNAMODB_CACHE_TABLE',
                                Value: {Ref: 'sdlcstackcache23E312EE'}
                            },
                            {
                                Name: 'SQS_QUEUE',
                                Value: {Ref: 'sdlcstackqueue5CB6143E'}
                            },
                            {
                                Name: 'AWS_BUCKET',
                                Value: {Ref: 'sdlcstacks34E44945B'}
                            },
                            {Name: 'CAN_RUN_CREATE', Value: '1'}
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
                                                                ':ecr:us-east-1:12344:repository/stack/phpfpm'
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
                                                                ':ecr:us-east-1:12344:repository/stack/phpfpm'
                                                            ]
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    '.',
                                    {Ref: 'AWS::URLSuffix'},
                                    '/stack/phpfpm:stack/phpfpm'
                                ]
                            ]
                        },
                        LogConfiguration: {
                            LogDriver: 'awslogs',
                            Options: {
                                'awslogs-group': {
                                    Ref: 'sdlcstackcontainerphpfpmwebu0loggroupC0271501'
                                },
                                'awslogs-stream-prefix': 'phpfpm',
                                'awslogs-region': 'us-west-2'
                            }
                        },
                        Memory: 128,
                        Name: 'sdlc-stack-container-phpfpm-web-u-0',
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
                                            ':secretsmanager:us-west-2:2222:secret:sdlc-stack-secrets/environment:FOO::'
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
                                            ':secretsmanager:us-west-2:2222:secret:sdlc-stack-secrets/environment:BAR::'
                                        ]
                                    ]
                                }
                            }
                        ]
                    }
                ],
                Cpu: '512',
                ExecutionRoleArn: {
                    'Fn::GetAtt': ['sdlcstacktaskdefweb0execrole5521DF49', 'Arn']
                },
                Family: 'sdlc-stack-task-def-web-0',
                Memory: '1024',
                NetworkMode: 'awsvpc',
                RequiresCompatibilities: ['FARGATE'],
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                TaskRoleArn: {
                    'Fn::GetAtt': ['sdlcstacktaskdefweb0TaskRole4E559BCA', 'Arn']
                }
            }
        },
        sdlcstackcontainernginxwebu0loggroup97CBCF6E: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                LogGroupName: 'sdlc-stack-container-nginx-web-u-0-log-group',
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
        sdlcstackcontainerphpfpmwebu0loggroupC0271501: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                LogGroupName: 'sdlc-stack-container-phpfpm-web-u-0-log-group',
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
        sdlcstackserviceweb0Service08B0E98B: {
            Type: 'AWS::ECS::Service',
            Properties: {
                Cluster: {Ref: 'sdlcstackclusterC84D7329'},
                DeploymentConfiguration: {MaximumPercent: 200, MinimumHealthyPercent: 50},
                DesiredCount: 1,
                EnableECSManagedTags: false,
                EnableExecuteCommand: true,
                HealthCheckGracePeriodSeconds: 60,
                LaunchType: 'FARGATE',
                LoadBalancers: [
                    {
                        ContainerName: 'sdlc-stack-container-nginx-web-u-0',
                        ContainerPort: 80,
                        TargetGroupArn: {Ref: 'sdlcstacktgB6898DC5'}
                    }
                ],
                NetworkConfiguration: {
                    AwsvpcConfiguration: {
                        AssignPublicIp: 'DISABLED',
                        SecurityGroups: [
                            {
                                'Fn::GetAtt': [
                                    'sdlcstackserviceweb0SecurityGroupB8D2F2B4',
                                    'GroupId'
                                ]
                            }
                        ],
                        Subnets: ['p-12345', 'p-67890']
                    }
                },
                PlatformVersion: 'LATEST',
                ServiceName: 'sdlc-stack-service-web-0',
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                TaskDefinition: {Ref: 'sdlcstacktaskdefweb0399B538F'}
            },
            DependsOn: ['sdlcstacklistenerrule100BCBF6621']
        },
        sdlcstackserviceweb0SecurityGroupB8D2F2B4: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                GroupDescription: 'stack/sdlc-stack/sdlc-stack-service-web-0/SecurityGroup',
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
        sdlcstackserviceweb0SecurityGroupfromstacksdlcstacklookuphttpslistenerSecurityGroupsg1234567890129F2327FA80ECAA6CDA: {
            Type: 'AWS::EC2::SecurityGroupIngress',
            Properties: {
                IpProtocol: 'tcp',
                Description: 'Load balancer to target',
                FromPort: 80,
                GroupId: {
                    'Fn::GetAtt': ['sdlcstackserviceweb0SecurityGroupB8D2F2B4', 'GroupId']
                },
                SourceSecurityGroupId: 'sg-12345',
                ToPort: 80
            }
        },
        sdlcstackserviceweb0TaskCountTarget9F88A631: {
            Type: 'AWS::ApplicationAutoScaling::ScalableTarget',
            Properties: {
                MaxCapacity: 3,
                MinCapacity: 1,
                ResourceId: {
                    'Fn::Join': [
                        '',
                        [
                            'service/',
                            {Ref: 'sdlcstackclusterC84D7329'},
                            '/',
                            {
                                'Fn::GetAtt': ['sdlcstackserviceweb0Service08B0E98B', 'Name']
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
            }
        },
        sdlcstackserviceweb0TaskCountTargetsdlcstackservicescalecpu0366CB10: {
            Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
            Properties: {
                PolicyName: 'stacksdlcstacksdlcstackserviceweb0TaskCountTargetsdlcstackservicescalecpu5BB4C8F1',
                PolicyType: 'TargetTrackingScaling',
                ScalingTargetId: {Ref: 'sdlcstackserviceweb0TaskCountTarget9F88A631'},
                TargetTrackingScalingPolicyConfiguration: {
                    PredefinedMetricSpecification: {PredefinedMetricType: 'ECSServiceAverageCPUUtilization'},
                    TargetValue: 75
                }
            }
        },
        sdlcstackserviceweb0TaskCountTargetsdlcstackservicescalememB65D5C3D: {
            Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
            Properties: {
                PolicyName: 'stacksdlcstacksdlcstackserviceweb0TaskCountTargetsdlcstackservicescalemem263B0568',
                PolicyType: 'TargetTrackingScaling',
                ScalingTargetId: {Ref: 'sdlcstackserviceweb0TaskCountTarget9F88A631'},
                TargetTrackingScalingPolicyConfiguration: {
                    PredefinedMetricSpecification: {
                        PredefinedMetricType: 'ECSServiceAverageMemoryUtilization'
                    },
                    TargetValue: 75
                }
            }
        },
        sdlcstackservicequeue0loggroup25FBA60B: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                LogGroupName: 'sdlc-stack-service-queue-0-log-group',
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
        sdlcstackservicequeue0EcsProcessingDeadLetterQueue5DAF61B2: {
            Type: 'AWS::SQS::Queue',
            Properties: {
                MessageRetentionPeriod: 1209600,
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        sdlcstackservicequeue0EcsProcessingQueueF55B19EB: {
            Type: 'AWS::SQS::Queue',
            Properties: {
                RedrivePolicy: {
                    deadLetterTargetArn: {
                        'Fn::GetAtt': [
                            'sdlcstackservicequeue0EcsProcessingDeadLetterQueue5DAF61B2',
                            'Arn'
                        ]
                    },
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
        sdlcstackservicequeue0QueueProcessingTaskDefTaskRole0AE2B279: {
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
        sdlcstackservicequeue0QueueProcessingTaskDefTaskRoleDefaultPolicy9B84C3E9: {
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
                                    'sdlcstackservicequeue0EcsProcessingQueueF55B19EB',
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: [
                                'sqs:PurgeQueue',
                                'sqs:GetQueueAttributes',
                                'sqs:GetQueueUrl'
                            ],
                            Effect: 'Allow',
                            Resource: {'Fn::GetAtt': ['sdlcstackqueue5CB6143E', 'Arn']}
                        },
                        {
                            Action: [
                                'sqs:ReceiveMessage',
                                'sqs:ChangeMessageVisibility',
                                'sqs:GetQueueUrl',
                                'sqs:DeleteMessage',
                                'sqs:GetQueueAttributes'
                            ],
                            Effect: 'Allow',
                            Resource: {'Fn::GetAtt': ['sdlcstackqueue5CB6143E', 'Arn']}
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
                                {'Fn::GetAtt': ['sdlcstacks34E44945B', 'Arn']},
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': ['sdlcstacks34E44945B', 'Arn']
                                            },
                                            '/*'
                                        ]
                                    ]
                                }
                            ]
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
                                {'Fn::GetAtt': ['sdlcstackcache23E312EE', 'Arn']},
                                {Ref: 'AWS::NoValue'}
                            ]
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'sdlcstackservicequeue0QueueProcessingTaskDefTaskRoleDefaultPolicy9B84C3E9',
                Roles: [
                    {
                        Ref: 'sdlcstackservicequeue0QueueProcessingTaskDefTaskRole0AE2B279'
                    }
                ]
            }
        },
        sdlcstackservicequeue0QueueProcessingTaskDefBCEF71F0: {
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
                                    'Fn::GetAtt': [
                                        'sdlcstackservicequeue0EcsProcessingQueueF55B19EB',
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
                                                        'Fn::Join': [
                                                            '',
                                                            [
                                                                'arn:',
                                                                {Ref: 'AWS::Partition'},
                                                                ':ecr:us-east-1:12344:repository/stack/phpfpm'
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
                                                                ':ecr:us-east-1:12344:repository/stack/phpfpm'
                                                            ]
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    '.',
                                    {Ref: 'AWS::URLSuffix'},
                                    '/stack/phpfpm:stack/phpfpm'
                                ]
                            ]
                        },
                        LogConfiguration: {
                            LogDriver: 'awslogs',
                            Options: {
                                'awslogs-group': {Ref: 'sdlcstackservicequeue0loggroup25FBA60B'},
                                'awslogs-stream-prefix': 'phpfpm',
                                'awslogs-region': 'us-west-2'
                            }
                        },
                        Name: 'QueueProcessingContainer',
                        Secrets: []
                    }
                ],
                Cpu: '256',
                ExecutionRoleArn: {
                    'Fn::GetAtt': [
                        'sdlcstackservicequeue0QueueProcessingTaskDefExecutionRoleDE83DCDF',
                        'Arn'
                    ]
                },
                Family: 'sdlc-stack-service-queue-0',
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
                        'sdlcstackservicequeue0QueueProcessingTaskDefTaskRole0AE2B279',
                        'Arn'
                    ]
                }
            }
        },
        sdlcstackservicequeue0QueueProcessingTaskDefExecutionRoleDE83DCDF: {
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
                RoleName: 'stacksdlcstackc7d51330defexecutionrolee92b8f6aa0bb0a59d8f9',
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        sdlcstackservicequeue0QueueProcessingTaskDefExecutionRoleDefaultPolicy4730C7F9: {
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
                                        ':ecr:us-east-1:12344:repository/stack/phpfpm'
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
                                'Fn::GetAtt': ['sdlcstackservicequeue0loggroup25FBA60B', 'Arn']
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'sdlcstackservicequeue0QueueProcessingTaskDefExecutionRoleDefaultPolicy4730C7F9',
                Roles: [
                    {
                        Ref: 'sdlcstackservicequeue0QueueProcessingTaskDefExecutionRoleDE83DCDF'
                    }
                ]
            }
        },
        sdlcstackservicequeue0QueueProcessingFargateService7FA158A1: {
            Type: 'AWS::ECS::Service',
            Properties: {
                Cluster: {Ref: 'sdlcstackclusterC84D7329'},
                DeploymentConfiguration: {MaximumPercent: 200, MinimumHealthyPercent: 50},
                EnableECSManagedTags: false,
                LaunchType: 'FARGATE',
                NetworkConfiguration: {
                    AwsvpcConfiguration: {
                        AssignPublicIp: 'DISABLED',
                        SecurityGroups: [
                            {
                                'Fn::GetAtt': [
                                    'sdlcstackservicequeue0QueueProcessingFargateServiceSecurityGroup00214B09',
                                    'GroupId'
                                ]
                            }
                        ],
                        Subnets: ['p-12345', 'p-67890']
                    }
                },
                PlatformVersion: 'LATEST',
                ServiceName: 'sdlc-stack-service-queue-0',
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                TaskDefinition: {
                    Ref: 'sdlcstackservicequeue0QueueProcessingTaskDefBCEF71F0'
                }
            }
        },
        sdlcstackservicequeue0QueueProcessingFargateServiceSecurityGroup00214B09: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                GroupDescription: 'stack/sdlc-stack/sdlc-stack-service-queue-0/QueueProcessingFargateService/SecurityGroup',
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
        sdlcstackservicequeue0QueueProcessingFargateServiceTaskCountTargetF33CCAC3: {
            Type: 'AWS::ApplicationAutoScaling::ScalableTarget',
            Properties: {
                MaxCapacity: 2,
                MinCapacity: 1,
                ResourceId: {
                    'Fn::Join': [
                        '',
                        [
                            'service/',
                            {Ref: 'sdlcstackclusterC84D7329'},
                            '/',
                            {
                                'Fn::GetAtt': [
                                    'sdlcstackservicequeue0QueueProcessingFargateService7FA158A1',
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
            }
        },
        sdlcstackservicequeue0QueueProcessingFargateServiceTaskCountTargetCpuScaling9B410338: {
            Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
            Properties: {
                PolicyName: 'stacksdlcstacksdlcstackservicequeue0QueueProcessingFargateServiceTaskCountTargetCpuScaling51109DB2',
                PolicyType: 'TargetTrackingScaling',
                ScalingTargetId: {
                    Ref: 'sdlcstackservicequeue0QueueProcessingFargateServiceTaskCountTargetF33CCAC3'
                },
                TargetTrackingScalingPolicyConfiguration: {
                    PredefinedMetricSpecification: {PredefinedMetricType: 'ECSServiceAverageCPUUtilization'},
                    TargetValue: 50
                }
            }
        },
        sdlcstackservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingLowerPolicy04F48027: {
            Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
            Properties: {
                PolicyName: 'stacksdlcstacksdlcstackservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingLowerPolicyB9B161FC',
                PolicyType: 'StepScaling',
                ScalingTargetId: {
                    Ref: 'sdlcstackservicequeue0QueueProcessingFargateServiceTaskCountTargetF33CCAC3'
                },
                StepScalingPolicyConfiguration: {
                    AdjustmentType: 'ChangeInCapacity',
                    MetricAggregationType: 'Maximum',
                    StepAdjustments: [{MetricIntervalUpperBound: 0, ScalingAdjustment: -1}]
                }
            }
        },
        sdlcstackservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingLowerAlarm1267BDDA: {
            Type: 'AWS::CloudWatch::Alarm',
            Properties: {
                ComparisonOperator: 'LessThanOrEqualToThreshold',
                EvaluationPeriods: 1,
                AlarmActions: [
                    {
                        Ref: 'sdlcstackservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingLowerPolicy04F48027'
                    }
                ],
                AlarmDescription: 'Lower threshold scaling alarm',
                Dimensions: [
                    {
                        Name: 'QueueName',
                        Value: {
                            'Fn::GetAtt': [
                                'sdlcstackservicequeue0EcsProcessingQueueF55B19EB',
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
        sdlcstackservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingUpperPolicy73C395B8: {
            Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
            Properties: {
                PolicyName: 'stacksdlcstacksdlcstackservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingUpperPolicyE354E45A',
                PolicyType: 'StepScaling',
                ScalingTargetId: {
                    Ref: 'sdlcstackservicequeue0QueueProcessingFargateServiceTaskCountTargetF33CCAC3'
                },
                StepScalingPolicyConfiguration: {
                    AdjustmentType: 'ChangeInCapacity',
                    MetricAggregationType: 'Maximum',
                    StepAdjustments: [
                        {
                            MetricIntervalLowerBound: 0,
                            MetricIntervalUpperBound: 400,
                            ScalingAdjustment: 1
                        },
                        {MetricIntervalLowerBound: 400, ScalingAdjustment: 5}
                    ]
                }
            }
        },
        sdlcstackservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingUpperAlarmF99C3B45: {
            Type: 'AWS::CloudWatch::Alarm',
            Properties: {
                ComparisonOperator: 'GreaterThanOrEqualToThreshold',
                EvaluationPeriods: 1,
                AlarmActions: [
                    {
                        Ref: 'sdlcstackservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingUpperPolicy73C395B8'
                    }
                ],
                AlarmDescription: 'Upper threshold scaling alarm',
                Dimensions: [
                    {
                        Name: 'QueueName',
                        Value: {
                            'Fn::GetAtt': [
                                'sdlcstackservicequeue0EcsProcessingQueueF55B19EB',
                                'QueueName'
                            ]
                        }
                    }
                ],
                MetricName: 'ApproximateNumberOfMessagesVisible',
                Namespace: 'AWS/SQS',
                Period: 300,
                Statistic: 'Maximum',
                Threshold: 100
            }
        },
        sdlcstackstartstopfnServiceRole446CC1EC: {
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
        sdlcstackstartstopfnServiceRoleDefaultPolicy657C3E3A: {
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
                                        'Fn::GetAtt': ['sdlcstackclusterC84D7329', 'Arn']
                                    }
                                }
                            },
                            Effect: 'Allow',
                            Resource: '*'
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'sdlcstackstartstopfnServiceRoleDefaultPolicy657C3E3A',
                Roles: [{Ref: 'sdlcstackstartstopfnServiceRole446CC1EC'}]
            }
        },
        sdlcstackstartstopfnFBCAF4B4: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-2222-us-west-2',
                    S3Key: 'c012c7fd0e4894113249eb5c826403161dd1c6a34234610b37c7bad30532d0e0.zip'
                },
                Role: {
                    'Fn::GetAtt': ['sdlcstackstartstopfnServiceRole446CC1EC', 'Arn']
                },
                Environment: {Variables: {CLUSTER: ''}},
                FunctionName: 'sdlc-stack-start-stop-fn',
                Handler: 'index.handler',
                MemorySize: 128,
                Runtime: 'nodejs14.x',
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                Timeout: 5
            },
            DependsOn: [
                'sdlcstackstartstopfnServiceRoleDefaultPolicy657C3E3A',
                'sdlcstackstartstopfnServiceRole446CC1EC'
            ]
        },
        sdlcstackstartstopfnLogRetention7D14A8FB: {
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
                            {Ref: 'sdlcstackstartstopfnFBCAF4B4'}
                        ]
                    ]
                },
                RetentionInDays: 30
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
                ],
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
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
                    S3Bucket: 'cdk-hnb659fds-assets-2222-us-west-2',
                    S3Key: '6c0316fef24d0df8a9a705c77052001217d864f49af386539d01df54618cd131.zip'
                },
                Role: {
                    'Fn::GetAtt': [
                        'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB',
                        'Arn'
                    ]
                },
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            },
            DependsOn: [
                'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRoleDefaultPolicyADDA7DEB',
                'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB'
            ]
        },
        sdlcstackstartstopstartruleEC601624: {
            Type: 'AWS::Events::Rule',
            Properties: {
                ScheduleExpression: 'cron(0 13 * * ? *)',
                State: 'ENABLED',
                Targets: [
                    {
                        Arn: {
                            'Fn::GetAtt': ['sdlcstackstartstopfnFBCAF4B4', 'Arn']
                        },
                        Id: 'Target0',
                        Input: {
                            'Fn::Join': [
                                '',
                                [
                                    '{"cluster":"',
                                    {
                                        'Fn::GetAtt': ['sdlcstackclusterC84D7329', 'Arn']
                                    },
                                    '","status":"start"}'
                                ]
                            ]
                        }
                    }
                ]
            }
        },
        sdlcstackstartstopstartruleAllowEventRulestacksdlcstacksdlcstackstartstopfnEC2236D8AFED269E: {
            Type: 'AWS::Lambda::Permission',
            Properties: {
                Action: 'lambda:InvokeFunction',
                FunctionName: {'Fn::GetAtt': ['sdlcstackstartstopfnFBCAF4B4', 'Arn']},
                Principal: 'events.amazonaws.com',
                SourceArn: {
                    'Fn::GetAtt': ['sdlcstackstartstopstartruleEC601624', 'Arn']
                }
            }
        },
        sdlcstackstartstopstopruleC36A9980: {
            Type: 'AWS::Events::Rule',
            Properties: {
                ScheduleExpression: 'cron(0 5 * * ? *)',
                State: 'ENABLED',
                Targets: [
                    {
                        Arn: {
                            'Fn::GetAtt': ['sdlcstackstartstopfnFBCAF4B4', 'Arn']
                        },
                        Id: 'Target0',
                        Input: {
                            'Fn::Join': [
                                '',
                                [
                                    '{"cluster":"',
                                    {
                                        'Fn::GetAtt': ['sdlcstackclusterC84D7329', 'Arn']
                                    },
                                    '","status":"stop"}'
                                ]
                            ]
                        }
                    }
                ]
            }
        },
        sdlcstackstartstopstopruleAllowEventRulestacksdlcstacksdlcstackstartstopfnEC2236D8C18801CD: {
            Type: 'AWS::Lambda::Permission',
            Properties: {
                Action: 'lambda:InvokeFunction',
                FunctionName: {'Fn::GetAtt': ['sdlcstackstartstopfnFBCAF4B4', 'Arn']},
                Principal: 'events.amazonaws.com',
                SourceArn: {
                    'Fn::GetAtt': ['sdlcstackstartstopstopruleC36A9980', 'Arn']
                }
            }
        }
    },
    Outputs: {
        sdlcstackservicequeue0SQSDeadLetterQueueD04D3A2B: {
            Value: {
                'Fn::GetAtt': [
                    'sdlcstackservicequeue0EcsProcessingDeadLetterQueue5DAF61B2',
                    'QueueName'
                ]
            }
        },
        sdlcstackservicequeue0SQSDeadLetterQueueArn27455B71: {
            Value: {
                'Fn::GetAtt': [
                    'sdlcstackservicequeue0EcsProcessingDeadLetterQueue5DAF61B2',
                    'Arn'
                ]
            }
        },
        sdlcstackservicequeue0SQSQueueC2470A73: {
            Value: {
                'Fn::GetAtt': [
                    'sdlcstackservicequeue0EcsProcessingQueueF55B19EB',
                    'QueueName'
                ]
            }
        },
        sdlcstackservicequeue0SQSQueueArn7C5B0A61: {
            Value: {
                'Fn::GetAtt': ['sdlcstackservicequeue0EcsProcessingQueueF55B19EB', 'Arn']
            }
        }
    },
    Parameters: {
        BootstrapVersion: {
            Type: 'AWS::SSM::Parameter::Value<String>',
            Default: '/cdk-bootstrap/hnb659fds/version',
            Description: 'Version of the CDK Bootstrap resources in this environment, automatically retrieved from SSM Parameter Store. [cdk:skip]'
        }
    },
    Rules: {
        CheckBootstrapVersion: {
            Assertions: [
                {
                    Assert: {
                        'Fn::Not': [
                            {
                                'Fn::Contains': [
                                    ['1', '2', '3', '4', '5'],
                                    {Ref: 'BootstrapVersion'}
                                ]
                            }
                        ]
                    },
                    AssertDescription: "CDK bootstrap stack version 6 required. Please run 'cdk bootstrap' with a recent version of the CDK CLI."
                }
            ]
        }
    }
};