module.exports = {
    Resources: {
        pccsdlcmyapparecordtestdevexampleeduarecordA329E9B2: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                Name: 'test.dev.example.edu.',
                Type: 'A',
                AliasTarget: {
                    DNSName: 'dualstack.my-load-balancer-1234567890.us-west-2.elb.amazonaws.com',
                    HostedZoneId: 'Z3DZXE0EXAMPLE'
                },
                Comment: 'pcc-sdlc-myapp-arecord: test.dev.example.edu',
                HostedZoneId: 'DUMMY'
            }
        },
        pccsdlcmyappsesverifytestVerifyDomainIdentityCustomResourcePolicy4BE20186: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: [ 'ses:VerifyDomainIdentity', 'ses:DeleteIdentity' ],
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
        pccsdlcmyappsesverifytestVerifyDomainIdentityE052339E: {
            Type: 'Custom::AWS',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': [ 'AWS679f53fac002430cb0da5b7982bd22872D164C4C', 'Arn' ]
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
        pccsdlcmyappsesverifytestSesVerificationRecord5CAAC1A0: {
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
                                        'pccsdlcmyappsesverifytestVerifyDomainIdentityE052339E',
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
                'pccsdlcmyappsesverifytestVerifyDomainIdentityCustomResourcePolicy4BE20186',
                'pccsdlcmyappsesverifytestVerifyDomainIdentityE052339E'
            ]
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
        pccsdlcmyappsesverifytestVerifyDomainDkim21798902: {
            Type: 'Custom::AWS',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': [ 'AWS679f53fac002430cb0da5b7982bd22872D164C4C', 'Arn' ]
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
        pccsdlcmyappsesverifytestSesDkimVerificationRecord043B916AD: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
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
                Type: 'CNAME',
                HostedZoneId: 'DUMMY',
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
                TTL: '1800'
            },
            DependsOn: [
                'pccsdlcmyappsesverifytestVerifyDomainDkimCustomResourcePolicyD5E756D9',
                'pccsdlcmyappsesverifytestVerifyDomainDkim21798902'
            ]
        },
        pccsdlcmyappsesverifytestSesDkimVerificationRecord1B5DB9210: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
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
                Type: 'CNAME',
                HostedZoneId: 'DUMMY',
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
                TTL: '1800'
            },
            DependsOn: [
                'pccsdlcmyappsesverifytestVerifyDomainDkimCustomResourcePolicyD5E756D9',
                'pccsdlcmyappsesverifytestVerifyDomainDkim21798902'
            ]
        },
        pccsdlcmyappsesverifytestSesDkimVerificationRecord265DB581E: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
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
                Type: 'CNAME',
                HostedZoneId: 'DUMMY',
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
                TTL: '1800'
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
                            Principal: { Service: 'lambda.amazonaws.com' }
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
                                { Ref: 'AWS::Partition' },
                                ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole'
                            ]
                        ]
                    }
                ],
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
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
                                    'pccsdlcmyapptaskdefcreateruntask0TaskRole18544913',
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: 'iam:PassRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'pccsdlcmyapptaskdefcreateruntask0execroleFD656F56',
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: 'iam:PassRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'pccsdlcmyapptaskdefupdateruntask0TaskRole449B3FA9',
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: 'iam:PassRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'pccsdlcmyapptaskdefupdateruntask0execrole7DA97922',
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
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
                ],
                Timeout: 120
            },
            DependsOn: [
                'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleDefaultPolicyD28E1A5E',
                'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2'
            ]
        },
        pccsdlcmyapptg1E18EDE5: {
            Type: 'AWS::ElasticLoadBalancingV2::TargetGroup',
            Properties: {
                HealthCheckPath: '/api/healthz',
                HealthCheckProtocol: 'HTTP',
                Name: 'pcc-sdlc-myapp-tg',
                Port: 80,
                Protocol: 'HTTP',
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
                ],
                TargetGroupAttributes: [ { Key: 'stickiness.enabled', Value: 'false' } ],
                TargetType: 'ip',
                VpcId: 'vpc-12345'
            }
        },
        pccsdlcmyapplistenerrule10003C2FE33: {
            Type: 'AWS::ElasticLoadBalancingV2::ListenerRule',
            Properties: {
                Actions: [
                    {
                        TargetGroupArn: { Ref: 'pccsdlcmyapptg1E18EDE5' },
                        Type: 'forward'
                    }
                ],
                Conditions: [
                    {
                        Field: 'host-header',
                        HostHeaderConfig: { Values: [ 'test.dev.example.edu' ] }
                    }
                ],
                ListenerArn: 'arn:aws:elasticloadbalancing:us-west-2:123456789012:listener/application/my-load-balancer/50dc6c495c0c9188/f2f7dc8efc522ab2',
                Priority: 100
            }
        },
        pccsdlcmyapptghealthtopic931BBE6A: {
            Type: 'AWS::SNS::Topic',
            Properties: {
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
                ]
            }
        },
        pccsdlcmyapptghealthtopictestexampleedu14AC2650: {
            Type: 'AWS::SNS::Subscription',
            Properties: {
                Protocol: 'email',
                TopicArn: { Ref: 'pccsdlcmyapptghealthtopic931BBE6A' },
                Endpoint: 'test@example.edu'
            }
        },
        pccsdlcmyapptghealthalarm6EE82B9B: {
            Type: 'AWS::CloudWatch::Alarm',
            Properties: {
                ComparisonOperator: 'GreaterThanOrEqualToThreshold',
                EvaluationPeriods: 3,
                AlarmActions: [ { Ref: 'pccsdlcmyapptghealthtopic931BBE6A' } ],
                Dimensions: [
                    {
                        Name: 'LoadBalancer',
                        Value: 'application/my-load-balancer/50dc6c495c0c9188'
                    },
                    {
                        Name: 'TargetGroup',
                        Value: {
                            'Fn::GetAtt': [ 'pccsdlcmyapptg1E18EDE5', 'TargetGroupFullName' ]
                        }
                    }
                ],
                MetricName: 'UnHealthyHostCount',
                Namespace: 'AWS/ApplicationELB',
                OKActions: [ { Ref: 'pccsdlcmyapptghealthtopic931BBE6A' } ],
                Period: 60,
                Statistic: 'Maximum',
                Threshold: 1
            }
        },
        pccsdlcmyappcacheF6FEBBE3: {
            Type: 'AWS::DynamoDB::Table',
            Properties: {
                KeySchema: [ { AttributeName: 'key', KeyType: 'HASH' } ],
                AttributeDefinitions: [ { AttributeName: 'key', AttributeType: 'S' } ],
                BillingMode: 'PAY_PER_REQUEST',
                SSESpecification: { SSEEnabled: true },
                TableName: 'pcc-sdlc-myapp-cache',
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlcmyappdlqAB5BBAC4: {
            Type: 'AWS::SQS::Queue',
            Properties: {
                KmsMasterKeyId: 'alias/aws/sqs',
                MessageRetentionPeriod: 259200,
                QueueName: 'pcc-sdlc-myapp-dlq',
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
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
                    deadLetterTargetArn: { 'Fn::GetAtt': [ 'pccsdlcmyappdlqAB5BBAC4', 'Arn' ] },
                    maxReceiveCount: 3
                },
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlcmyapps352258330: {
            Type: 'AWS::S3::Bucket',
            Properties: {
                BucketEncryption: {
                    ServerSideEncryptionConfiguration: [
                        {
                            ServerSideEncryptionByDefault: { SSEAlgorithm: 'aws:kms' }
                        }
                    ]
                },
                BucketName: 'pcc-sdlc-myapp-s3',
                PublicAccessBlockConfiguration: {
                    BlockPublicAcls: true,
                    BlockPublicPolicy: true,
                    IgnorePublicAcls: true,
                    RestrictPublicBuckets: true
                },
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
                ]
            },
            UpdateReplacePolicy: 'Retain',
            DeletionPolicy: 'Retain'
        },
        pccsdlcmyapps3Policy9B6B2F29: {
            Type: 'AWS::S3::BucketPolicy',
            Properties: {
                Bucket: { Ref: 'pccsdlcmyapps352258330' },
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 's3:*',
                            Condition: { Bool: { 'aws:SecureTransport': 'false' } },
                            Effect: 'Deny',
                            Principal: { AWS: '*' },
                            Resource: [
                                { 'Fn::GetAtt': [ 'pccsdlcmyapps352258330', 'Arn' ] },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [ 'pccsdlcmyapps352258330', 'Arn' ]
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
        pccsdlcmyappcluster4E9F2DE3: {
            Type: 'AWS::ECS::Cluster',
            Properties: {
                ClusterName: 'pcc-sdlc-myapp-cluster',
                ClusterSettings: [ { Name: 'containerInsights', Value: 'disabled' } ],
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
                ]
            }
        },
        pccsdlcmyappclusteralarmtopic96EDDED7: {
            Type: 'AWS::SNS::Topic',
            Properties: {
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
                ]
            }
        },
        pccsdlcmyappclusteralarmtopictestexampleeduCAEE872F: {
            Type: 'AWS::SNS::Subscription',
            Properties: {
                Protocol: 'email',
                TopicArn: { Ref: 'pccsdlcmyappclusteralarmtopic96EDDED7' },
                Endpoint: 'test@example.edu'
            }
        },
        pccsdlcmyappclustercpualarmD245A87F: {
            Type: 'AWS::CloudWatch::Alarm',
            Properties: {
                ComparisonOperator: 'GreaterThanOrEqualToThreshold',
                EvaluationPeriods: 1,
                AlarmActions: [ { Ref: 'pccsdlcmyappclusteralarmtopic96EDDED7' } ],
                Dimensions: [
                    {
                        Name: 'ClusterName',
                        Value: { Ref: 'pccsdlcmyappcluster4E9F2DE3' }
                    }
                ],
                MetricName: 'CPUUtilization',
                Namespace: 'AWS/ECS',
                OKActions: [ { Ref: 'pccsdlcmyappclusteralarmtopic96EDDED7' } ],
                Period: 300,
                Statistic: 'Average',
                Threshold: 90
            }
        },
        pccsdlcmyappclustermemoryalarmD54F55B5: {
            Type: 'AWS::CloudWatch::Alarm',
            Properties: {
                ComparisonOperator: 'GreaterThanOrEqualToThreshold',
                EvaluationPeriods: 1,
                AlarmActions: [ { Ref: 'pccsdlcmyappclusteralarmtopic96EDDED7' } ],
                Dimensions: [
                    {
                        Name: 'ClusterName',
                        Value: { Ref: 'pccsdlcmyappcluster4E9F2DE3' }
                    }
                ],
                MetricName: 'MemoryUtilization',
                Namespace: 'AWS/ECS',
                OKActions: [ { Ref: 'pccsdlcmyappclusteralarmtopic96EDDED7' } ],
                Period: 300,
                Statistic: 'Average',
                Threshold: 90
            }
        },
        pccsdlcmyapptaskdefcreateruntask0execroleFD656F56: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: { Service: 'ecs-tasks.amazonaws.com' }
                        }
                    ],
                    Version: '2012-10-17'
                },
                RoleName: 'pccsharedstackpccsdlcmyapruntask0execrole6e82a3c5be0c01402fdc',
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
                ]
            }
        },
        pccsdlcmyapptaskdefcreateruntask0execroleDefaultPolicyC9168FB2: {
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
                                        { Ref: 'AWS::Partition' },
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
                            Action: [ 'logs:CreateLogStream', 'logs:PutLogEvents' ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'pccsdlcmyappcontainerphpfpmcreateruntaskcrot0loggroupA7E390A1',
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
                                        { Ref: 'AWS::Partition' },
                                        ':secretsmanager:us-west-2:2222:secret:pcc-sdlc-myapp-secrets/environment-??????'
                                    ]
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlcmyapptaskdefcreateruntask0execroleDefaultPolicyC9168FB2',
                Roles: [
                    {
                        Ref: 'pccsdlcmyapptaskdefcreateruntask0execroleFD656F56'
                    }
                ]
            }
        },
        pccsdlcmyapptaskdefcreateruntask0TaskRole18544913: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: { Service: 'ecs-tasks.amazonaws.com' }
                        }
                    ],
                    Version: '2012-10-17'
                },
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
                ]
            }
        },
        pccsdlcmyapptaskdefcreateruntask0TaskRoleDefaultPolicy46B6E2DC: {
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
                                { 'Fn::GetAtt': [ 'pccsdlcmyapps352258330', 'Arn' ] },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [ 'pccsdlcmyapps352258330', 'Arn' ]
                                            },
                                            '/*'
                                        ]
                                    ]
                                }
                            ]
                        },
                        {
                            Action: [ 'ses:SendEmail', 'ses:SendRawEmail' ],
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
                                    'Fn::GetAtt': [ 'pccsdlcmyappcacheF6FEBBE3', 'Arn' ]
                                },
                                { Ref: 'AWS::NoValue' }
                            ]
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlcmyapptaskdefcreateruntask0TaskRoleDefaultPolicy46B6E2DC',
                Roles: [
                    {
                        Ref: 'pccsdlcmyapptaskdefcreateruntask0TaskRole18544913'
                    }
                ]
            }
        },
        pccsdlcmyapptaskdefcreateruntask07A17E066: {
            Type: 'AWS::ECS::TaskDefinition',
            Properties: {
                ContainerDefinitions: [
                    {
                        Command: [ '/on_create.sh' ],
                        Cpu: 256,
                        EntryPoint: [ '/bin/sh', '-c' ],
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
                                Value: { Ref: 'pccsdlcmyappcacheF6FEBBE3' }
                            },
                            {
                                Name: 'SQS_QUEUE',
                                Value: { Ref: 'pccsdlcmyappqueue069E607A' }
                            },
                            {
                                Name: 'AWS_BUCKET',
                                Value: { Ref: 'pccsdlcmyapps352258330' }
                            },
                            { Name: 'CAN_RUN_CREATE', Value: '1' }
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
                                                                { Ref: 'AWS::Partition' },
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
                                                                { Ref: 'AWS::Partition' },
                                                                ':ecr:us-east-1:12344:repository/pcc-myapp/phpfpm'
                                                            ]
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    '.',
                                    { Ref: 'AWS::URLSuffix' },
                                    '/pcc-myapp/phpfpm:1'
                                ]
                            ]
                        },
                        LogConfiguration: {
                            LogDriver: 'awslogs',
                            Options: {
                                'awslogs-group': {
                                    Ref: 'pccsdlcmyappcontainerphpfpmcreateruntaskcrot0loggroupA7E390A1'
                                },
                                'awslogs-stream-prefix': 'phpfpm',
                                'awslogs-region': 'us-west-2'
                            }
                        },
                        Memory: 512,
                        Name: 'pcc-sdlc-myapp-container-phpfpm-createruntask-crot-0',
                        Secrets: [
                            {
                                Name: 'FOO',
                                ValueFrom: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            { Ref: 'AWS::Partition' },
                                            ':secretsmanager:us-west-2:2222:secret:pcc-sdlc-myapp-secrets/environment:FOO::'
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
                                            { Ref: 'AWS::Partition' },
                                            ':secretsmanager:us-west-2:2222:secret:pcc-sdlc-myapp-secrets/environment:BAR::'
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
                        'pccsdlcmyapptaskdefcreateruntask0execroleFD656F56',
                        'Arn'
                    ]
                },
                Family: 'pcc-sdlc-myapp-task-def-createruntask-0',
                Memory: '512',
                NetworkMode: 'awsvpc',
                RequiresCompatibilities: [ 'FARGATE' ],
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
                ],
                TaskRoleArn: {
                    'Fn::GetAtt': [
                        'pccsdlcmyapptaskdefcreateruntask0TaskRole18544913',
                        'Arn'
                    ]
                }
            }
        },
        pccsdlcmyappcontainerphpfpmcreateruntaskcrot0loggroupA7E390A1: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                LogGroupName: 'pcc-sdlc-myapp-container-phpfpm-createruntask-crot-0-log-group',
                RetentionInDays: 30,
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlcmyapptaskcreateruntask0SecurityGroup43402166: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                GroupDescription: 'pcc-shared-stack/pcc-sdlc-myapp/pcc-sdlc-myapp-task-createruntask-0/SecurityGroup',
                SecurityGroupEgress: [
                    {
                        CidrIp: '0.0.0.0/0',
                        Description: 'Allow all outbound traffic by default',
                        IpProtocol: '-1'
                    }
                ],
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
                ],
                VpcId: 'vpc-12345'
            }
        },
        pccsdlcmyapptaskcreateruntask0createfnCustomResourcePolicy7E64AD5A: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 'ecs:RunTask',
                            Effect: 'Allow',
                            Resource: { Ref: 'pccsdlcmyapptaskdefcreateruntask07A17E066' }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlcmyapptaskcreateruntask0createfnCustomResourcePolicy7E64AD5A',
                Roles: [
                    {
                        Ref: 'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2'
                    }
                ]
            }
        },
        pccsdlcmyapptaskcreateruntask0createfnAB13F8A3: {
            Type: 'Custom::AWS',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': [ 'AWS679f53fac002430cb0da5b7982bd22872D164C4C', 'Arn' ]
                },
                Create: {
                    'Fn::Join': [
                        '',
                        [
                            '{"service":"ECS","action":"runTask","physicalResourceId":{"id":"',
                            { Ref: 'pccsdlcmyapptaskdefcreateruntask07A17E066' },
                            '"},"parameters":{"cluster":"',
                            { Ref: 'pccsdlcmyappcluster4E9F2DE3' },
                            '","taskDefinition":"',
                            { Ref: 'pccsdlcmyapptaskdefcreateruntask07A17E066' },
                            '","capacityProviderStrategy":[],"launchType":"FARGATE","platformVersion":"LATEST","networkConfiguration":{"awsvpcConfiguration":{"assignPublicIp":"DISABLED","subnets":["p-12345","p-67890"],"securityGroups":["',
                            {
                                'Fn::GetAtt': [
                                    'pccsdlcmyapptaskcreateruntask0SecurityGroup43402166',
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
                'pccsdlcmyapptaskcreateruntask0createfnCustomResourcePolicy7E64AD5A'
            ],
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlcmyapptaskdefupdateruntask0execrole7DA97922: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: { Service: 'ecs-tasks.amazonaws.com' }
                        }
                    ],
                    Version: '2012-10-17'
                },
                RoleName: 'pccsharedstackpccsdlcmyapruntask0execrole73af5f4b9dfb869222db',
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
                ]
            }
        },
        pccsdlcmyapptaskdefupdateruntask0execroleDefaultPolicy5DB232CA: {
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
                                        { Ref: 'AWS::Partition' },
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
                            Action: [ 'logs:CreateLogStream', 'logs:PutLogEvents' ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'pccsdlcmyappcontainerphpfpmupdateruntaskurot0loggroupA9BA0B7B',
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
                                        { Ref: 'AWS::Partition' },
                                        ':secretsmanager:us-west-2:2222:secret:pcc-sdlc-myapp-secrets/environment-??????'
                                    ]
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlcmyapptaskdefupdateruntask0execroleDefaultPolicy5DB232CA',
                Roles: [
                    {
                        Ref: 'pccsdlcmyapptaskdefupdateruntask0execrole7DA97922'
                    }
                ]
            }
        },
        pccsdlcmyapptaskdefupdateruntask0TaskRole449B3FA9: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: { Service: 'ecs-tasks.amazonaws.com' }
                        }
                    ],
                    Version: '2012-10-17'
                },
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
                ]
            }
        },
        pccsdlcmyapptaskdefupdateruntask0TaskRoleDefaultPolicy1BFBDBA3: {
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
                                { 'Fn::GetAtt': [ 'pccsdlcmyapps352258330', 'Arn' ] },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [ 'pccsdlcmyapps352258330', 'Arn' ]
                                            },
                                            '/*'
                                        ]
                                    ]
                                }
                            ]
                        },
                        {
                            Action: [ 'ses:SendEmail', 'ses:SendRawEmail' ],
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
                                    'Fn::GetAtt': [ 'pccsdlcmyappcacheF6FEBBE3', 'Arn' ]
                                },
                                { Ref: 'AWS::NoValue' }
                            ]
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlcmyapptaskdefupdateruntask0TaskRoleDefaultPolicy1BFBDBA3',
                Roles: [
                    {
                        Ref: 'pccsdlcmyapptaskdefupdateruntask0TaskRole449B3FA9'
                    }
                ]
            }
        },
        pccsdlcmyapptaskdefupdateruntask0D1DC2ACD: {
            Type: 'AWS::ECS::TaskDefinition',
            Properties: {
                ContainerDefinitions: [
                    {
                        Command: [ 'artisan', 'migrate', '--force' ],
                        Cpu: 256,
                        EntryPoint: [ '/usr/local/bin/php' ],
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
                                Value: { Ref: 'pccsdlcmyappcacheF6FEBBE3' }
                            },
                            {
                                Name: 'SQS_QUEUE',
                                Value: { Ref: 'pccsdlcmyappqueue069E607A' }
                            },
                            {
                                Name: 'AWS_BUCKET',
                                Value: { Ref: 'pccsdlcmyapps352258330' }
                            },
                            { Name: 'CAN_RUN_CREATE', Value: '1' }
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
                                                                { Ref: 'AWS::Partition' },
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
                                                                { Ref: 'AWS::Partition' },
                                                                ':ecr:us-east-1:12344:repository/pcc-myapp/phpfpm'
                                                            ]
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    '.',
                                    { Ref: 'AWS::URLSuffix' },
                                    '/pcc-myapp/phpfpm:1'
                                ]
                            ]
                        },
                        LogConfiguration: {
                            LogDriver: 'awslogs',
                            Options: {
                                'awslogs-group': {
                                    Ref: 'pccsdlcmyappcontainerphpfpmupdateruntaskurot0loggroupA9BA0B7B'
                                },
                                'awslogs-stream-prefix': 'phpfpm',
                                'awslogs-region': 'us-west-2'
                            }
                        },
                        Memory: 512,
                        Name: 'pcc-sdlc-myapp-container-phpfpm-updateruntask-urot-0',
                        Secrets: [
                            {
                                Name: 'FOO',
                                ValueFrom: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            { Ref: 'AWS::Partition' },
                                            ':secretsmanager:us-west-2:2222:secret:pcc-sdlc-myapp-secrets/environment:FOO::'
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
                                            { Ref: 'AWS::Partition' },
                                            ':secretsmanager:us-west-2:2222:secret:pcc-sdlc-myapp-secrets/environment:BAR::'
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
                        'pccsdlcmyapptaskdefupdateruntask0execrole7DA97922',
                        'Arn'
                    ]
                },
                Family: 'pcc-sdlc-myapp-task-def-updateruntask-0',
                Memory: '512',
                NetworkMode: 'awsvpc',
                RequiresCompatibilities: [ 'FARGATE' ],
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
                ],
                TaskRoleArn: {
                    'Fn::GetAtt': [
                        'pccsdlcmyapptaskdefupdateruntask0TaskRole449B3FA9',
                        'Arn'
                    ]
                }
            }
        },
        pccsdlcmyappcontainerphpfpmupdateruntaskurot0loggroupA9BA0B7B: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                LogGroupName: 'pcc-sdlc-myapp-container-phpfpm-updateruntask-urot-0-log-group',
                RetentionInDays: 30,
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlcmyapptaskupdateruntask0SecurityGroup7D97467B: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                GroupDescription: 'pcc-shared-stack/pcc-sdlc-myapp/pcc-sdlc-myapp-task-updateruntask-0/SecurityGroup',
                SecurityGroupEgress: [
                    {
                        CidrIp: '0.0.0.0/0',
                        Description: 'Allow all outbound traffic by default',
                        IpProtocol: '-1'
                    }
                ],
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
                ],
                VpcId: 'vpc-12345'
            }
        },
        pccsdlcmyapptaskupdateruntask0updatefnCustomResourcePolicyB3AA7548: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 'ecs:RunTask',
                            Effect: 'Allow',
                            Resource: { Ref: 'pccsdlcmyapptaskdefupdateruntask0D1DC2ACD' }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlcmyapptaskupdateruntask0updatefnCustomResourcePolicyB3AA7548',
                Roles: [
                    {
                        Ref: 'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2'
                    }
                ]
            }
        },
        pccsdlcmyapptaskupdateruntask0updatefnCF58E13D: {
            Type: 'Custom::AWS',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': [ 'AWS679f53fac002430cb0da5b7982bd22872D164C4C', 'Arn' ]
                },
                Create: {
                    'Fn::Join': [
                        '',
                        [
                            '{"service":"ECS","action":"runTask","physicalResourceId":{"id":"',
                            { Ref: 'pccsdlcmyapptaskdefupdateruntask0D1DC2ACD' },
                            '"},"parameters":{"cluster":"',
                            { Ref: 'pccsdlcmyappcluster4E9F2DE3' },
                            '","taskDefinition":"',
                            { Ref: 'pccsdlcmyapptaskdefupdateruntask0D1DC2ACD' },
                            '","capacityProviderStrategy":[],"launchType":"FARGATE","platformVersion":"LATEST","networkConfiguration":{"awsvpcConfiguration":{"assignPublicIp":"DISABLED","subnets":["p-12345","p-67890"],"securityGroups":["',
                            {
                                'Fn::GetAtt': [
                                    'pccsdlcmyapptaskupdateruntask0SecurityGroup7D97467B',
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
                            { Ref: 'pccsdlcmyapptaskdefupdateruntask0D1DC2ACD' },
                            '"},"parameters":{"cluster":"',
                            { Ref: 'pccsdlcmyappcluster4E9F2DE3' },
                            '","taskDefinition":"',
                            { Ref: 'pccsdlcmyapptaskdefupdateruntask0D1DC2ACD' },
                            '","capacityProviderStrategy":[],"launchType":"FARGATE","platformVersion":"LATEST","networkConfiguration":{"awsvpcConfiguration":{"assignPublicIp":"DISABLED","subnets":["p-12345","p-67890"],"securityGroups":["',
                            {
                                'Fn::GetAtt': [
                                    'pccsdlcmyapptaskupdateruntask0SecurityGroup7D97467B',
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
                'pccsdlcmyapptaskupdateruntask0updatefnCustomResourcePolicyB3AA7548'
            ],
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlcmyapptaskdefscheduledtask0execrole253CB36D: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: { Service: 'ecs-tasks.amazonaws.com' }
                        }
                    ],
                    Version: '2012-10-17'
                },
                RoleName: 'pccsharedstackpccsdlcmyapledtask0execrole4daf8ab8b44fa0163f53',
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
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
                                        { Ref: 'AWS::Partition' },
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
                            Action: [ 'logs:CreateLogStream', 'logs:PutLogEvents' ],
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
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        { Ref: 'AWS::Partition' },
                                        ':secretsmanager:us-west-2:2222:secret:pcc-sdlc-myapp-secrets/environment-??????'
                                    ]
                                ]
                            }
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
                            Principal: { Service: 'ecs-tasks.amazonaws.com' }
                        }
                    ],
                    Version: '2012-10-17'
                },
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
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
                                'Fn::GetAtt': [ 'pccsdlcmyappqueue069E607A', 'Arn' ]
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
                                { 'Fn::GetAtt': [ 'pccsdlcmyapps352258330', 'Arn' ] },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [ 'pccsdlcmyapps352258330', 'Arn' ]
                                            },
                                            '/*'
                                        ]
                                    ]
                                }
                            ]
                        },
                        {
                            Action: [ 'ses:SendEmail', 'ses:SendRawEmail' ],
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
                                    'Fn::GetAtt': [ 'pccsdlcmyappcacheF6FEBBE3', 'Arn' ]
                                },
                                { Ref: 'AWS::NoValue' }
                            ]
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
                        Command: [ 'artisan', 'catalyst:daily' ],
                        Cpu: 256,
                        EntryPoint: [ '/usr/local/bin/php' ],
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
                                Value: { Ref: 'pccsdlcmyappcacheF6FEBBE3' }
                            },
                            {
                                Name: 'SQS_QUEUE',
                                Value: { Ref: 'pccsdlcmyappqueue069E607A' }
                            },
                            {
                                Name: 'AWS_BUCKET',
                                Value: { Ref: 'pccsdlcmyapps352258330' }
                            },
                            { Name: 'CAN_RUN_CREATE', Value: '1' }
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
                                                                { Ref: 'AWS::Partition' },
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
                                                                { Ref: 'AWS::Partition' },
                                                                ':ecr:us-east-1:12344:repository/pcc-myapp/phpfpm'
                                                            ]
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    '.',
                                    { Ref: 'AWS::URLSuffix' },
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
                        Secrets: [
                            {
                                Name: 'FOO',
                                ValueFrom: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            { Ref: 'AWS::Partition' },
                                            ':secretsmanager:us-west-2:2222:secret:pcc-sdlc-myapp-secrets/environment:FOO::'
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
                                            { Ref: 'AWS::Partition' },
                                            ':secretsmanager:us-west-2:2222:secret:pcc-sdlc-myapp-secrets/environment:BAR::'
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
                        'pccsdlcmyapptaskdefscheduledtask0execrole253CB36D',
                        'Arn'
                    ]
                },
                Family: 'pcc-sdlc-myapp-task-def-scheduledtask-0',
                Memory: '512',
                NetworkMode: 'awsvpc',
                RequiresCompatibilities: [ 'FARGATE' ],
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
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
                            Principal: { Service: 'events.amazonaws.com' }
                        }
                    ],
                    Version: '2012-10-17'
                },
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
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
                                        'Fn::GetAtt': [ 'pccsdlcmyappcluster4E9F2DE3', 'Arn' ]
                                    }
                                }
                            },
                            Effect: 'Allow',
                            Resource: { Ref: 'pccsdlcmyapptaskdefscheduledtask0DC6034F0' }
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
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
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
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
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
                            'Fn::GetAtt': [ 'pccsdlcmyappcluster4E9F2DE3', 'Arn' ]
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
                                    Subnets: [ 'p-12345', 'p-67890' ]
                                }
                            },
                            PlatformVersion: 'LATEST',
                            TaskCount: 1,
                            TaskDefinitionArn: { Ref: 'pccsdlcmyapptaskdefscheduledtask0DC6034F0' }
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
                            Principal: { Service: 'ecs-tasks.amazonaws.com' }
                        }
                    ],
                    Version: '2012-10-17'
                },
                RoleName: 'pccsharedstackpccsdlcmyapkdefweb0execrole0b98dea745592a0c944b',
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
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
                                        { Ref: 'AWS::Partition' },
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
                            Action: [ 'logs:CreateLogStream', 'logs:PutLogEvents' ],
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
                                        { Ref: 'AWS::Partition' },
                                        ':ecr:us-east-1:12344:repository/pcc-myapp/phpfpm'
                                    ]
                                ]
                            }
                        },
                        {
                            Action: [ 'logs:CreateLogStream', 'logs:PutLogEvents' ],
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
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        { Ref: 'AWS::Partition' },
                                        ':secretsmanager:us-west-2:2222:secret:pcc-sdlc-myapp-secrets/environment-??????'
                                    ]
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlcmyapptaskdefweb0execroleDefaultPolicyF933D5F4',
                Roles: [ { Ref: 'pccsdlcmyapptaskdefweb0execrole32538409' } ]
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
                            Principal: { Service: 'ecs-tasks.amazonaws.com' }
                        }
                    ],
                    Version: '2012-10-17'
                },
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
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
                                'Fn::GetAtt': [ 'pccsdlcmyappqueue069E607A', 'Arn' ]
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
                                { 'Fn::GetAtt': [ 'pccsdlcmyapps352258330', 'Arn' ] },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [ 'pccsdlcmyapps352258330', 'Arn' ]
                                            },
                                            '/*'
                                        ]
                                    ]
                                }
                            ]
                        },
                        {
                            Action: [ 'ses:SendEmail', 'ses:SendRawEmail' ],
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
                                    'Fn::GetAtt': [ 'pccsdlcmyappcacheF6FEBBE3', 'Arn' ]
                                },
                                { Ref: 'AWS::NoValue' }
                            ]
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlcmyapptaskdefweb0TaskRoleDefaultPolicy4427BD76',
                Roles: [ { Ref: 'pccsdlcmyapptaskdefweb0TaskRole44A5F54B' } ]
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
                                                                { Ref: 'AWS::Partition' },
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
                                                                { Ref: 'AWS::Partition' },
                                                                ':ecr:us-east-1:12344:repository/pcc-myapp/nginx'
                                                            ]
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    '.',
                                    { Ref: 'AWS::URLSuffix' },
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
                        PortMappings: [ { ContainerPort: 80, Protocol: 'tcp' } ],
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
                                Value: { Ref: 'pccsdlcmyappcacheF6FEBBE3' }
                            },
                            {
                                Name: 'SQS_QUEUE',
                                Value: { Ref: 'pccsdlcmyappqueue069E607A' }
                            },
                            {
                                Name: 'AWS_BUCKET',
                                Value: { Ref: 'pccsdlcmyapps352258330' }
                            },
                            { Name: 'CAN_RUN_CREATE', Value: '1' }
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
                                                                { Ref: 'AWS::Partition' },
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
                                                                { Ref: 'AWS::Partition' },
                                                                ':ecr:us-east-1:12344:repository/pcc-myapp/phpfpm'
                                                            ]
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    '.',
                                    { Ref: 'AWS::URLSuffix' },
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
                        PortMappings: [ { ContainerPort: 9000, Protocol: 'tcp' } ],
                        Secrets: [
                            {
                                Name: 'FOO',
                                ValueFrom: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            { Ref: 'AWS::Partition' },
                                            ':secretsmanager:us-west-2:2222:secret:pcc-sdlc-myapp-secrets/environment:FOO::'
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
                                            { Ref: 'AWS::Partition' },
                                            ':secretsmanager:us-west-2:2222:secret:pcc-sdlc-myapp-secrets/environment:BAR::'
                                        ]
                                    ]
                                }
                            }
                        ]
                    }
                ],
                Cpu: '512',
                ExecutionRoleArn: {
                    'Fn::GetAtt': [ 'pccsdlcmyapptaskdefweb0execrole32538409', 'Arn' ]
                },
                Family: 'pcc-sdlc-myapp-task-def-web-0',
                Memory: '1024',
                NetworkMode: 'awsvpc',
                RequiresCompatibilities: [ 'FARGATE' ],
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
                ],
                TaskRoleArn: {
                    'Fn::GetAtt': [ 'pccsdlcmyapptaskdefweb0TaskRole44A5F54B', 'Arn' ]
                }
            }
        },
        pccsdlcmyappcontainernginxwebu0loggroup46546295: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                LogGroupName: 'pcc-sdlc-myapp-container-nginx-web-u-0-log-group',
                RetentionInDays: 30,
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
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
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlcmyappserviceweb0Service28A2C321: {
            Type: 'AWS::ECS::Service',
            Properties: {
                Cluster: { Ref: 'pccsdlcmyappcluster4E9F2DE3' },
                DeploymentConfiguration: { MaximumPercent: 200, MinimumHealthyPercent: 50 },
                DesiredCount: 1,
                EnableECSManagedTags: false,
                EnableExecuteCommand: true,
                HealthCheckGracePeriodSeconds: 60,
                LaunchType: 'FARGATE',
                LoadBalancers: [
                    {
                        ContainerName: 'pcc-sdlc-myapp-container-nginx-web-u-0',
                        ContainerPort: 80,
                        TargetGroupArn: { Ref: 'pccsdlcmyapptg1E18EDE5' }
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
                        Subnets: [ 'p-12345', 'p-67890' ]
                    }
                },
                PlatformVersion: 'LATEST',
                ServiceName: 'pcc-sdlc-myapp-service-web-0',
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
                ],
                TaskDefinition: { Ref: 'pccsdlcmyapptaskdefweb0C12FF3F1' }
            },
            DependsOn: [ 'pccsdlcmyapplistenerrule10003C2FE33' ]
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
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
                ],
                VpcId: 'vpc-12345'
            }
        },
        pccsdlcmyappserviceweb0SecurityGroupfrompccsharedstackpccsdlcmyapplookuphttpslistenerSecurityGroupsg123456789012543CF5BD804E7E318F: {
            Type: 'AWS::EC2::SecurityGroupIngress',
            Properties: {
                IpProtocol: 'tcp',
                Description: 'Load balancer to target',
                FromPort: 80,
                GroupId: {
                    'Fn::GetAtt': [
                        'pccsdlcmyappserviceweb0SecurityGroupEA0D4069',
                        'GroupId'
                    ]
                },
                SourceSecurityGroupId: 'sg-12345',
                ToPort: 80
            }
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
                            { Ref: 'pccsdlcmyappcluster4E9F2DE3' },
                            '/',
                            {
                                'Fn::GetAtt': [ 'pccsdlcmyappserviceweb0Service28A2C321', 'Name' ]
                            }
                        ]
                    ]
                },
                RoleARN: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            { Ref: 'AWS::Partition' },
                            ':iam::2222:role/aws-service-role/ecs.application-autoscaling.amazonaws.com/AWSServiceRoleForApplicationAutoScaling_ECSService'
                        ]
                    ]
                },
                ScalableDimension: 'ecs:service:DesiredCount',
                ServiceNamespace: 'ecs'
            }
        },
        pccsdlcmyappserviceweb0TaskCountTargetpccsdlcmyappservicescalecpu580E5A4F: {
            Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
            Properties: {
                PolicyName: 'pccsharedstackpccsdlcmyapppccsdlcmyappserviceweb0TaskCountTargetpccsdlcmyappservicescalecpu43CE0804',
                PolicyType: 'TargetTrackingScaling',
                ScalingTargetId: { Ref: 'pccsdlcmyappserviceweb0TaskCountTargetC0BDCD4E' },
                TargetTrackingScalingPolicyConfiguration: {
                    PredefinedMetricSpecification: { PredefinedMetricType: 'ECSServiceAverageCPUUtilization' },
                    TargetValue: 75
                }
            }
        },
        pccsdlcmyappserviceweb0TaskCountTargetpccsdlcmyappservicescalememB0AA1F75: {
            Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
            Properties: {
                PolicyName: 'pccsharedstackpccsdlcmyapppccsdlcmyappserviceweb0TaskCountTargetpccsdlcmyappservicescalemem27F521B3',
                PolicyType: 'TargetTrackingScaling',
                ScalingTargetId: { Ref: 'pccsdlcmyappserviceweb0TaskCountTargetC0BDCD4E' },
                TargetTrackingScalingPolicyConfiguration: {
                    PredefinedMetricSpecification: {
                        PredefinedMetricType: 'ECSServiceAverageMemoryUtilization'
                    },
                    TargetValue: 75
                }
            }
        },
        pccsdlcmyappservicequeue0loggroup9DDCB13E: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                LogGroupName: 'pcc-sdlc-myapp-service-queue-0-log-group',
                RetentionInDays: 30,
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlcmyappservicequeue0EcsProcessingDeadLetterQueue54B95565: {
            Type: 'AWS::SQS::Queue',
            Properties: {
                MessageRetentionPeriod: 1209600,
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlcmyappservicequeue0EcsProcessingQueue1F0BEE27: {
            Type: 'AWS::SQS::Queue',
            Properties: {
                RedrivePolicy: {
                    deadLetterTargetArn: {
                        'Fn::GetAtt': [
                            'pccsdlcmyappservicequeue0EcsProcessingDeadLetterQueue54B95565',
                            'Arn'
                        ]
                    },
                    maxReceiveCount: 3
                },
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
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
                            Principal: { Service: 'ecs-tasks.amazonaws.com' }
                        }
                    ],
                    Version: '2012-10-17'
                },
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
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
                                'Fn::GetAtt': [
                                    'pccsdlcmyappservicequeue0EcsProcessingQueue1F0BEE27',
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
                            Resource: {
                                'Fn::GetAtt': [ 'pccsdlcmyappqueue069E607A', 'Arn' ]
                            }
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
                            Resource: {
                                'Fn::GetAtt': [ 'pccsdlcmyappqueue069E607A', 'Arn' ]
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
                                { 'Fn::GetAtt': [ 'pccsdlcmyapps352258330', 'Arn' ] },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [ 'pccsdlcmyapps352258330', 'Arn' ]
                                            },
                                            '/*'
                                        ]
                                    ]
                                }
                            ]
                        },
                        {
                            Action: [ 'ses:SendEmail', 'ses:SendRawEmail' ],
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
                                    'Fn::GetAtt': [ 'pccsdlcmyappcacheF6FEBBE3', 'Arn' ]
                                },
                                { Ref: 'AWS::NoValue' }
                            ]
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
                                    'Fn::GetAtt': [
                                        'pccsdlcmyappservicequeue0EcsProcessingQueue1F0BEE27',
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
                                                                { Ref: 'AWS::Partition' },
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
                                                                { Ref: 'AWS::Partition' },
                                                                ':ecr:us-east-1:12344:repository/pcc-myapp/phpfpm'
                                                            ]
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    '.',
                                    { Ref: 'AWS::URLSuffix' },
                                    '/pcc-myapp/phpfpm:1'
                                ]
                            ]
                        },
                        LogConfiguration: {
                            LogDriver: 'awslogs',
                            Options: {
                                'awslogs-group': { Ref: 'pccsdlcmyappservicequeue0loggroup9DDCB13E' },
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
                        'pccsdlcmyappservicequeue0QueueProcessingTaskDefExecutionRoleC60C75CA',
                        'Arn'
                    ]
                },
                Family: 'pcc-sdlc-myapp-service-queue-0',
                Memory: '512',
                NetworkMode: 'awsvpc',
                RequiresCompatibilities: [ 'FARGATE' ],
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
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
                            Principal: { Service: 'ecs-tasks.amazonaws.com' }
                        }
                    ],
                    Version: '2012-10-17'
                },
                RoleName: 'pccsharedstackpccsdlcmyapdefexecutionrolef9c314234098b2c4e8ec',
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
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
                                        { Ref: 'AWS::Partition' },
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
                            Action: [ 'logs:CreateLogStream', 'logs:PutLogEvents' ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'pccsdlcmyappservicequeue0loggroup9DDCB13E',
                                    'Arn'
                                ]
                            }
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
                Cluster: { Ref: 'pccsdlcmyappcluster4E9F2DE3' },
                DeploymentConfiguration: { MaximumPercent: 200, MinimumHealthyPercent: 50 },
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
                        Subnets: [ 'p-12345', 'p-67890' ]
                    }
                },
                PlatformVersion: 'LATEST',
                ServiceName: 'pcc-sdlc-myapp-service-queue-0',
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
                ],
                TaskDefinition: {
                    Ref: 'pccsdlcmyappservicequeue0QueueProcessingTaskDef277B33FF'
                }
            }
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
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
                ],
                VpcId: 'vpc-12345'
            }
        },
        pccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetCE82EEC2: {
            Type: 'AWS::ApplicationAutoScaling::ScalableTarget',
            Properties: {
                MaxCapacity: 2,
                MinCapacity: 1,
                ResourceId: {
                    'Fn::Join': [
                        '',
                        [
                            'service/',
                            { Ref: 'pccsdlcmyappcluster4E9F2DE3' },
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
                            { Ref: 'AWS::Partition' },
                            ':iam::2222:role/aws-service-role/ecs.application-autoscaling.amazonaws.com/AWSServiceRoleForApplicationAutoScaling_ECSService'
                        ]
                    ]
                },
                ScalableDimension: 'ecs:service:DesiredCount',
                ServiceNamespace: 'ecs'
            }
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
                    PredefinedMetricSpecification: { PredefinedMetricType: 'ECSServiceAverageCPUUtilization' },
                    TargetValue: 50
                }
            }
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
                    StepAdjustments: [ { MetricIntervalUpperBound: 0, ScalingAdjustment: -1 } ]
                }
            }
        },
        pccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingLowerAlarmBF362659: {
            Type: 'AWS::CloudWatch::Alarm',
            Properties: {
                ComparisonOperator: 'LessThanOrEqualToThreshold',
                EvaluationPeriods: 1,
                AlarmActions: [
                    {
                        Ref: 'pccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingLowerPolicy0EA8CD56'
                    }
                ],
                AlarmDescription: 'Lower threshold scaling alarm',
                Dimensions: [
                    {
                        Name: 'QueueName',
                        Value: {
                            'Fn::GetAtt': [
                                'pccsdlcmyappservicequeue0EcsProcessingQueue1F0BEE27',
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
                            MetricIntervalUpperBound: 400,
                            ScalingAdjustment: 1
                        },
                        { MetricIntervalLowerBound: 400, ScalingAdjustment: 5 }
                    ]
                }
            }
        },
        pccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingUpperAlarm617AF3F0: {
            Type: 'AWS::CloudWatch::Alarm',
            Properties: {
                ComparisonOperator: 'GreaterThanOrEqualToThreshold',
                EvaluationPeriods: 1,
                AlarmActions: [
                    {
                        Ref: 'pccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingUpperPolicy49011084'
                    }
                ],
                AlarmDescription: 'Upper threshold scaling alarm',
                Dimensions: [
                    {
                        Name: 'QueueName',
                        Value: {
                            'Fn::GetAtt': [
                                'pccsdlcmyappservicequeue0EcsProcessingQueue1F0BEE27',
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
        pccsdlcmyappstartstopfnServiceRole4E724A81: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: { Service: 'lambda.amazonaws.com' }
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
                                { Ref: 'AWS::Partition' },
                                ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole'
                            ]
                        ]
                    }
                ],
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
                ]
            }
        },
        pccsdlcmyappstartstopfnServiceRoleDefaultPolicy6AEE6644: {
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
                            Action: [ 'ecs:DescribeServices', 'ecs:UpdateService' ],
                            Condition: {
                                ArnEquals: {
                                    'ecs:cluster': {
                                        'Fn::GetAtt': [ 'pccsdlcmyappcluster4E9F2DE3', 'Arn' ]
                                    }
                                }
                            },
                            Effect: 'Allow',
                            Resource: '*'
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlcmyappstartstopfnServiceRoleDefaultPolicy6AEE6644',
                Roles: [ { Ref: 'pccsdlcmyappstartstopfnServiceRole4E724A81' } ]
            }
        },
        pccsdlcmyappstartstopfnB40C404E: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-2222-us-west-2',
                    S3Key: 'c012c7fd0e4894113249eb5c826403161dd1c6a34234610b37c7bad30532d0e0.zip'
                },
                Role: {
                    'Fn::GetAtt': [ 'pccsdlcmyappstartstopfnServiceRole4E724A81', 'Arn' ]
                },
                Environment: { Variables: { CLUSTER: '' } },
                FunctionName: 'pcc-sdlc-myapp-start-stop-fn',
                Handler: 'index.handler',
                MemorySize: 128,
                Runtime: 'nodejs14.x',
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
                ],
                Timeout: 5
            },
            DependsOn: [
                'pccsdlcmyappstartstopfnServiceRoleDefaultPolicy6AEE6644',
                'pccsdlcmyappstartstopfnServiceRole4E724A81'
            ]
        },
        pccsdlcmyappstartstopfnLogRetention1C08E520: {
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
                            { Ref: 'pccsdlcmyappstartstopfnB40C404E' }
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
                            Principal: { Service: 'lambda.amazonaws.com' }
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
                                { Ref: 'AWS::Partition' },
                                ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole'
                            ]
                        ]
                    }
                ],
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
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
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
                ]
            },
            DependsOn: [
                'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRoleDefaultPolicyADDA7DEB',
                'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB'
            ]
        },
        pccsdlcmyappstartstopstartrule70F0260F: {
            Type: 'AWS::Events::Rule',
            Properties: {
                ScheduleExpression: 'cron(0 13 * * ? *)',
                State: 'ENABLED',
                Targets: [
                    {
                        Arn: {
                            'Fn::GetAtt': [ 'pccsdlcmyappstartstopfnB40C404E', 'Arn' ]
                        },
                        Id: 'Target0',
                        Input: {
                            'Fn::Join': [
                                '',
                                [
                                    '{"cluster":"',
                                    {
                                        'Fn::GetAtt': [ 'pccsdlcmyappcluster4E9F2DE3', 'Arn' ]
                                    },
                                    '","status":"start"}'
                                ]
                            ]
                        }
                    }
                ]
            }
        },
        pccsdlcmyappstartstopstartruleAllowEventRulepccsharedstackpccsdlcmyapppccsdlcmyappstartstopfnF3B1D02A9B529698: {
            Type: 'AWS::Lambda::Permission',
            Properties: {
                Action: 'lambda:InvokeFunction',
                FunctionName: {
                    'Fn::GetAtt': [ 'pccsdlcmyappstartstopfnB40C404E', 'Arn' ]
                },
                Principal: 'events.amazonaws.com',
                SourceArn: {
                    'Fn::GetAtt': [ 'pccsdlcmyappstartstopstartrule70F0260F', 'Arn' ]
                }
            }
        },
        pccsdlcmyappstartstopstopruleE9201095: {
            Type: 'AWS::Events::Rule',
            Properties: {
                ScheduleExpression: 'cron(0 5 * * ? *)',
                State: 'ENABLED',
                Targets: [
                    {
                        Arn: {
                            'Fn::GetAtt': [ 'pccsdlcmyappstartstopfnB40C404E', 'Arn' ]
                        },
                        Id: 'Target0',
                        Input: {
                            'Fn::Join': [
                                '',
                                [
                                    '{"cluster":"',
                                    {
                                        'Fn::GetAtt': [ 'pccsdlcmyappcluster4E9F2DE3', 'Arn' ]
                                    },
                                    '","status":"stop"}'
                                ]
                            ]
                        }
                    }
                ]
            }
        },
        pccsdlcmyappstartstopstopruleAllowEventRulepccsharedstackpccsdlcmyapppccsdlcmyappstartstopfnF3B1D02AEAE78146: {
            Type: 'AWS::Lambda::Permission',
            Properties: {
                Action: 'lambda:InvokeFunction',
                FunctionName: {
                    'Fn::GetAtt': [ 'pccsdlcmyappstartstopfnB40C404E', 'Arn' ]
                },
                Principal: 'events.amazonaws.com',
                SourceArn: {
                    'Fn::GetAtt': [ 'pccsdlcmyappstartstopstopruleE9201095', 'Arn' ]
                }
            }
        }
    },
    Outputs: {
        pccsdlcmyappservicequeue0SQSDeadLetterQueueBD13D545: {
            Value: {
                'Fn::GetAtt': [
                    'pccsdlcmyappservicequeue0EcsProcessingDeadLetterQueue54B95565',
                    'QueueName'
                ]
            }
        },
        pccsdlcmyappservicequeue0SQSDeadLetterQueueArn72D25855: {
            Value: {
                'Fn::GetAtt': [
                    'pccsdlcmyappservicequeue0EcsProcessingDeadLetterQueue54B95565',
                    'Arn'
                ]
            }
        },
        pccsdlcmyappservicequeue0SQSQueue8306BFF0: {
            Value: {
                'Fn::GetAtt': [
                    'pccsdlcmyappservicequeue0EcsProcessingQueue1F0BEE27',
                    'QueueName'
                ]
            }
        },
        pccsdlcmyappservicequeue0SQSQueueArn061B9BC6: {
            Value: {
                'Fn::GetAtt': [
                    'pccsdlcmyappservicequeue0EcsProcessingQueue1F0BEE27',
                    'Arn'
                ]
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
                                    [ '1', '2', '3', '4', '5' ],
                                    { Ref: 'BootstrapVersion' }
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