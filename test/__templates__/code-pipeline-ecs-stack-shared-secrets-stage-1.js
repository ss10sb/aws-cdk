const {Match} = require("aws-cdk-lib/assertions");
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
                    S3Key: '17c16a3854838fd3ff4bda08146122a6701f33b9c86ae17f415ad0dc47a97544.zip'
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
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ],
                Timeout: 120
            },
            DependsOn: ['AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2']
        },
        pccprodtesttgAE852883: {
            Type: 'AWS::ElasticLoadBalancingV2::TargetGroup',
            Properties: {
                HealthCheckPath: '/api/healthz',
                HealthCheckProtocol: 'HTTP',
                Name: 'pcc-prod-test-tg',
                Port: 80,
                Protocol: 'HTTP',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ],
                TargetGroupAttributes: [{Key: 'stickiness.enabled', Value: 'false'}],
                TargetType: 'ip',
                VpcId: 'vpc-12345'
            }
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
                        HostHeaderConfig: {Values: ['test.example.edu']}
                    }
                ],
                ListenerArn: 'arn:aws:elasticloadbalancing:us-west-2:123456789012:listener/application/my-load-balancer/50dc6c495c0c9188/f2f7dc8efc522ab2',
                Priority: 100
            }
        },
        pccprodtesttghealthtopicFEDC890C: {
            Type: 'AWS::SNS::Topic',
            Properties: {
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ]
            }
        },
        pccprodtesttghealthtopicprodexampleedu3D416C24: {
            Type: 'AWS::SNS::Subscription',
            Properties: {
                Endpoint: 'prod@example.edu',
                Protocol: 'email',
                TopicArn: {Ref: 'pccprodtesttghealthtopicFEDC890C'}
            }
        },
        pccprodtesttghealthalarmA8A2460E: {
            Type: 'AWS::CloudWatch::Alarm',
            Properties: {
                AlarmActions: [{Ref: 'pccprodtesttghealthtopicFEDC890C'}],
                ComparisonOperator: 'GreaterThanOrEqualToThreshold',
                Dimensions: [
                    {
                        Name: 'LoadBalancer',
                        Value: 'application/my-load-balancer/50dc6c495c0c9188'
                    },
                    {
                        Name: 'TargetGroup',
                        Value: {
                            'Fn::GetAtt': ['pccprodtesttgAE852883', 'TargetGroupFullName']
                        }
                    }
                ],
                EvaluationPeriods: 3,
                MetricName: 'UnHealthyHostCount',
                Namespace: 'AWS/ApplicationELB',
                OKActions: [{Ref: 'pccprodtesttghealthtopicFEDC890C'}],
                Period: 60,
                Statistic: 'Maximum',
                Threshold: 1
            }
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
        pccprodtestclusterB438B945: {
            Type: 'AWS::ECS::Cluster',
            Properties: {
                ClusterName: 'pcc-prod-test-cluster',
                ClusterSettings: [{Name: 'containerInsights', Value: 'disabled'}],
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ]
            }
        },
        pccprodtestclusteralarmtopic047C7141: {
            Type: 'AWS::SNS::Topic',
            Properties: {
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ]
            }
        },
        pccprodtestclusteralarmtopicprodexampleedu7B8525D9: {
            Type: 'AWS::SNS::Subscription',
            Properties: {
                Endpoint: 'prod@example.edu',
                Protocol: 'email',
                TopicArn: {Ref: 'pccprodtestclusteralarmtopic047C7141'}
            }
        },
        pccprodtestclustercpualarm72892A4F: {
            Type: 'AWS::CloudWatch::Alarm',
            Properties: {
                AlarmActions: [{Ref: 'pccprodtestclusteralarmtopic047C7141'}],
                ComparisonOperator: 'GreaterThanOrEqualToThreshold',
                Dimensions: [
                    {
                        Name: 'ClusterName',
                        Value: {Ref: 'pccprodtestclusterB438B945'}
                    }
                ],
                EvaluationPeriods: 1,
                MetricName: 'CPUUtilization',
                Namespace: 'AWS/ECS',
                OKActions: [{Ref: 'pccprodtestclusteralarmtopic047C7141'}],
                Period: 300,
                Statistic: 'Average',
                Threshold: 90
            }
        },
        pccprodtestclustermemoryalarm899FB323: {
            Type: 'AWS::CloudWatch::Alarm',
            Properties: {
                AlarmActions: [{Ref: 'pccprodtestclusteralarmtopic047C7141'}],
                ComparisonOperator: 'GreaterThanOrEqualToThreshold',
                Dimensions: [
                    {
                        Name: 'ClusterName',
                        Value: {Ref: 'pccprodtestclusterB438B945'}
                    }
                ],
                EvaluationPeriods: 1,
                MetricName: 'MemoryUtilization',
                Namespace: 'AWS/ECS',
                OKActions: [{Ref: 'pccprodtestclusteralarmtopic047C7141'}],
                Period: 300,
                Statistic: 'Average',
                Threshold: 90
            }
        },
        pccprodtesttaskdefweb0execroleE6E7A48B: {
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
                        Value: 'pcc-prod-test_c8377fe56a6e467df695938bbf33321cd042464048'
                    },
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ]
            }
        },
        pccprodtesttaskdefweb0execroleDefaultPolicy728E5871: {
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
                                    'pccprodtestcontainernginxwebu0loggroup73502B24',
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
                                    'pccprodtestcontainerphpfpmwebu0loggroupDFF439A5',
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
                            Resource: 'arn:aws:secretsmanager:us-west-2:22222:secret:pcc-prod-shared-secrets/environment-abc123'
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccprodtesttaskdefweb0execroleDefaultPolicy728E5871',
                Roles: [{Ref: 'pccprodtesttaskdefweb0execroleE6E7A48B'}]
            }
        },
        pccprodtesttaskdefweb0TaskRole6981EBC4: {
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
                    {Key: 'Environment', Value: 'prod'}
                ]
            }
        },
        pccprodtesttaskdefweb0TaskRoleDefaultPolicyA38EEE7B: {
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
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccprodtesttaskdefweb0TaskRoleDefaultPolicyA38EEE7B',
                Roles: [{Ref: 'pccprodtesttaskdefweb0TaskRole6981EBC4'}]
            }
        },
        pccprodtesttaskdefweb0F11751C9: {
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
                                    Ref: 'pccprodtestcontainernginxwebu0loggroup73502B24'
                                },
                                'awslogs-stream-prefix': 'nginx',
                                'awslogs-region': 'us-west-2'
                            }
                        },
                        Memory: 64,
                        Name: 'pcc-prod-test-container-nginx-web-u-0',
                        PortMappings: [{ContainerPort: 80, Protocol: 'tcp'}],
                        ReadonlyRootFilesystem: false
                    },
                    {
                        Cpu: 128,
                        Environment: [
                            {
                                Name: 'MAIL_FROM_ADDRESS',
                                Value: 'no-reply@test.example.edu'
                            },
                            {
                                Name: 'IMPORTER_FROM',
                                Value: 'importer-no-reply@test.example.edu'
                            },
                            {
                                Name: 'DYNAMODB_CACHE_TABLE',
                                Value: {Ref: 'pccprodtestcache90B0E581'}
                            },
                            {
                                Name: 'AWS_SECRET_ARN',
                                Value: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':secretsmanager:us-west-2:22222:secret:pcc-prod-test-secrets/environment'
                                        ]
                                    ]
                                }
                            },
                            {
                                Name: 'AWS_SHARED_SECRET_ARN',
                                Value: 'arn:aws:secretsmanager:us-west-2:22222:secret:pcc-prod-shared-secrets/environment-abc123'
                            },
                            {Name: 'AWS_APP_NAME', Value: 'pcc-prod-test'},
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
                                    Ref: 'pccprodtestcontainerphpfpmwebu0loggroupDFF439A5'
                                },
                                'awslogs-stream-prefix': 'phpfpm',
                                'awslogs-region': 'us-west-2'
                            }
                        },
                        Memory: 128,
                        Name: 'pcc-prod-test-container-phpfpm-web-u-0',
                        PortMappings: [{ContainerPort: 9000, Protocol: 'tcp'}],
                        ReadonlyRootFilesystem: false,
                        Secrets: [
                            {
                                Name: 'AZURE_CLIENT_ID',
                                ValueFrom: 'arn:aws:secretsmanager:us-west-2:22222:secret:pcc-prod-shared-secrets/environment-abc123:AZURE_CLIENT_ID::'
                            },
                            {
                                Name: 'AZURE_CLIENT_SECRET',
                                ValueFrom: 'arn:aws:secretsmanager:us-west-2:22222:secret:pcc-prod-shared-secrets/environment-abc123:AZURE_CLIENT_SECRET::'
                            },
                            {
                                Name: 'AZURE_TENANT_ID',
                                ValueFrom: 'arn:aws:secretsmanager:us-west-2:22222:secret:pcc-prod-shared-secrets/environment-abc123:AZURE_TENANT_ID::'
                            },
                            {
                                Name: 'AZURE_FOO',
                                ValueFrom: 'arn:aws:secretsmanager:us-west-2:22222:secret:pcc-prod-shared-secrets/environment-abc123:AZURE_FOO::'
                            }
                        ]
                    }
                ],
                Cpu: '512',
                ExecutionRoleArn: {
                    'Fn::GetAtt': ['pccprodtesttaskdefweb0execroleE6E7A48B', 'Arn']
                },
                Family: 'pcc-prod-test-task-def-web-0',
                Memory: '1024',
                NetworkMode: 'awsvpc',
                RequiresCompatibilities: ['FARGATE'],
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ],
                TaskRoleArn: {
                    'Fn::GetAtt': ['pccprodtesttaskdefweb0TaskRole6981EBC4', 'Arn']
                }
            }
        },
        pccprodtestcontainernginxwebu0loggroup73502B24: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                LogGroupName: 'pcc-prod-test-container-nginx-web-u-0-log-group',
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
        pccprodtestcontainerphpfpmwebu0loggroupDFF439A5: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                LogGroupName: 'pcc-prod-test-container-phpfpm-web-u-0-log-group',
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
        pccprodtestserviceweb0ServiceF76D8A1A: {
            Type: 'AWS::ECS::Service',
            Properties: {
                Cluster: {Ref: 'pccprodtestclusterB438B945'},
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
                        ContainerName: 'pcc-prod-test-container-nginx-web-u-0',
                        ContainerPort: 80,
                        TargetGroupArn: {Ref: 'pccprodtesttgAE852883'}
                    }
                ],
                NetworkConfiguration: {
                    AwsvpcConfiguration: {
                        AssignPublicIp: 'DISABLED',
                        SecurityGroups: [
                            {
                                'Fn::GetAtt': [
                                    'pccprodtestserviceweb0SecurityGroup4F23E23D',
                                    'GroupId'
                                ]
                            }
                        ],
                        Subnets: ['p-12345', 'p-67890']
                    }
                },
                PlatformVersion: 'LATEST',
                ServiceName: 'pcc-prod-test-service-web-0',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ],
                TaskDefinition: {Ref: 'pccprodtesttaskdefweb0F11751C9'}
            },
            DependsOn: [
                'pccprodtestlistenerrule1001DDE5657',
                'pccprodtesttaskdefweb0TaskRoleDefaultPolicyA38EEE7B',
                'pccprodtesttaskdefweb0TaskRole6981EBC4'
            ]
        },
        pccprodtestserviceweb0SecurityGroup4F23E23D: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                GroupDescription: 'pcc-shared-test/pcc-prod-test-stage/pcc-prod-test/pcc-prod-test-service-web-0/SecurityGroup',
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
            },
            DependsOn: [
                'pccprodtesttaskdefweb0TaskRoleDefaultPolicyA38EEE7B',
                'pccprodtesttaskdefweb0TaskRole6981EBC4'
            ]
        },
        pccprodtestserviceweb0SecurityGroupfrompccsharedtestpccprodteststagepccprodtestlookuphttpslistenerSecurityGroupsg1234567890129A0533B78035769511: {
            Type: 'AWS::EC2::SecurityGroupIngress',
            Properties: {
                Description: 'Load balancer to target',
                FromPort: 80,
                GroupId: {
                    'Fn::GetAtt': [
                        'pccprodtestserviceweb0SecurityGroup4F23E23D',
                        'GroupId'
                    ]
                },
                IpProtocol: 'tcp',
                SourceSecurityGroupId: 'sg-12345678',
                ToPort: 80
            },
            DependsOn: [
                'pccprodtesttaskdefweb0TaskRoleDefaultPolicyA38EEE7B',
                'pccprodtesttaskdefweb0TaskRole6981EBC4'
            ]
        },
        pccprodtestserviceweb0TaskCountTargetFBBD0985: {
            Type: 'AWS::ApplicationAutoScaling::ScalableTarget',
            Properties: {
                MaxCapacity: 3,
                MinCapacity: 1,
                ResourceId: {
                    'Fn::Join': [
                        '',
                        [
                            'service/',
                            {Ref: 'pccprodtestclusterB438B945'},
                            '/',
                            {
                                'Fn::GetAtt': ['pccprodtestserviceweb0ServiceF76D8A1A', 'Name']
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
                            ':iam::22222:role/aws-service-role/ecs.application-autoscaling.amazonaws.com/AWSServiceRoleForApplicationAutoScaling_ECSService'
                        ]
                    ]
                },
                ScalableDimension: 'ecs:service:DesiredCount',
                ServiceNamespace: 'ecs'
            },
            DependsOn: [
                'pccprodtesttaskdefweb0TaskRoleDefaultPolicyA38EEE7B',
                'pccprodtesttaskdefweb0TaskRole6981EBC4'
            ]
        },
        pccprodtestserviceweb0TaskCountTargetpccprodtestservicescalecpu25C41293: {
            Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
            Properties: {
                PolicyName: 'pccsharedtestpccprodteststagepccprodtestpccprodtestserviceweb0TaskCountTargetpccprodtestservicescalecpu2C7FAA9A',
                PolicyType: 'TargetTrackingScaling',
                ScalingTargetId: {Ref: 'pccprodtestserviceweb0TaskCountTargetFBBD0985'},
                TargetTrackingScalingPolicyConfiguration: {
                    PredefinedMetricSpecification: {PredefinedMetricType: 'ECSServiceAverageCPUUtilization'},
                    TargetValue: 75
                }
            },
            DependsOn: [
                'pccprodtesttaskdefweb0TaskRoleDefaultPolicyA38EEE7B',
                'pccprodtesttaskdefweb0TaskRole6981EBC4'
            ]
        },
        pccprodtestserviceweb0TaskCountTargetpccprodtestservicescalemem9DCAF5B8: {
            Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
            Properties: {
                PolicyName: 'pccsharedtestpccprodteststagepccprodtestpccprodtestserviceweb0TaskCountTargetpccprodtestservicescalemem226A522F',
                PolicyType: 'TargetTrackingScaling',
                ScalingTargetId: {Ref: 'pccprodtestserviceweb0TaskCountTargetFBBD0985'},
                TargetTrackingScalingPolicyConfiguration: {
                    PredefinedMetricSpecification: {
                        PredefinedMetricType: 'ECSServiceAverageMemoryUtilization'
                    },
                    TargetValue: 75
                }
            },
            DependsOn: [
                'pccprodtesttaskdefweb0TaskRoleDefaultPolicyA38EEE7B',
                'pccprodtesttaskdefweb0TaskRole6981EBC4'
            ]
        }
    }
}