module.exports = {
    Resources: {
        pccsdlcmyappcacheF6FEBBE3: {
            Type: 'AWS::DynamoDB::Table',
            Properties: {
                KeySchema: [{AttributeName: 'key', KeyType: 'HASH'}],
                AttributeDefinitions: [{AttributeName: 'key', AttributeType: 'S'}],
                BillingMode: 'PAY_PER_REQUEST',
                SSESpecification: {SSEEnabled: true},
                TableName: 'pcc-sdlc-myapp-cache',
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
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
        pccsdlcmyappqueuefn0ServiceRole25D2EC47: {
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
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlcmyappqueuefn0ServiceRoleDefaultPolicy7CEEC49D: {
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
                                    'Fn::GetAtt': ['pccsdlcmyappcacheF6FEBBE3', 'Arn']
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
                            Resource: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-test-secrets/environment-ABC123'
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlcmyappqueuefn0ServiceRoleDefaultPolicy7CEEC49D',
                Roles: [{Ref: 'pccsdlcmyappqueuefn0ServiceRole25D2EC47'}]
            }
        },
        pccsdlcmyappqueuefn0SecurityGroup9AAF5451: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                GroupDescription: 'Automatic security group for Lambda Function pccsharedstackpccsdlcmyapppccsdlcmyappqueuefn01B673C6E',
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
        pccsdlcmyappqueuefn0959517EB: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-2222-us-west-2',
                    S3Key: 'a701d9c4e1414bfb5bdc604564a232c79e82fa1c4186ebc7245836fb15ee2c49.zip'
                },
                Role: {
                    'Fn::GetAtt': ['pccsdlcmyappqueuefn0ServiceRole25D2EC47', 'Arn']
                },
                FunctionName: 'pcc-sdlc-myapp-queue-fn-0',
                Handler: 'worker.php',
                Layers: [
                    {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                {Ref: 'AWS::Partition'},
                                ':lambda:us-west-2:209497400698:layer:php-81:28'
                            ]
                        ]
                    }
                ],
                MemorySize: 512,
                Runtime: 'provided.al2',
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                Timeout: 120,
                VpcConfig: {
                    SecurityGroupIds: [
                        {
                            'Fn::GetAtt': [
                                'pccsdlcmyappqueuefn0SecurityGroup9AAF5451',
                                'GroupId'
                            ]
                        }
                    ],
                    SubnetIds: ['p-12345', 'p-67890']
                }
            },
            DependsOn: [
                'pccsdlcmyappqueuefn0ServiceRoleDefaultPolicy7CEEC49D',
                'pccsdlcmyappqueuefn0ServiceRole25D2EC47'
            ]
        },
        pccsdlcmyappqueuefn0LogRetention0DF7A761: {
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
                            {Ref: 'pccsdlcmyappqueuefn0959517EB'}
                        ]
                    ]
                },
                RetentionInDays: 30
            }
        },
        pccsdlcmyappqueuefn0SqsEventSourcepccsharedstackpccsdlcmyapppccsdlcmyappqueueE04FE5CD2B31C978: {
            Type: 'AWS::Lambda::EventSourceMapping',
            Properties: {
                FunctionName: {Ref: 'pccsdlcmyappqueuefn0959517EB'},
                EventSourceArn: {'Fn::GetAtt': ['pccsdlcmyappqueue069E607A', 'Arn']}
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
                    S3Key: 'eb5b005c858404ea0c8f68098ed5dcdf5340e02461f149751d10f59c210d5ef8.zip'
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
        pccsdlcmyapptestdevexampleeduuseast1CertificateRequestorFunctionServiceRoleA1E2685A: {
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
        pccsdlcmyapptestdevexampleeduuseast1CertificateRequestorFunctionServiceRoleDefaultPolicyE4E2E992: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: [
                                'acm:RequestCertificate',
                                'acm:DescribeCertificate',
                                'acm:DeleteCertificate',
                                'acm:AddTagsToCertificate'
                            ],
                            Effect: 'Allow',
                            Resource: '*'
                        },
                        {
                            Action: 'route53:GetChange',
                            Effect: 'Allow',
                            Resource: '*'
                        },
                        {
                            Action: 'route53:changeResourceRecordSets',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {Ref: 'AWS::Partition'},
                                        ':route53:::hostedzone/DUMMY'
                                    ]
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlcmyapptestdevexampleeduuseast1CertificateRequestorFunctionServiceRoleDefaultPolicyE4E2E992',
                Roles: [
                    {
                        Ref: 'pccsdlcmyapptestdevexampleeduuseast1CertificateRequestorFunctionServiceRoleA1E2685A'
                    }
                ]
            }
        },
        pccsdlcmyapptestdevexampleeduuseast1CertificateRequestorFunction2C9738D0: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-2222-us-west-2',
                    S3Key: '8ddf29ab619460567d3cda58de2ff1bf0f6e95d8822ff630ec58a4d52ed1fa67.zip'
                },
                Role: {
                    'Fn::GetAtt': [
                        'pccsdlcmyapptestdevexampleeduuseast1CertificateRequestorFunctionServiceRoleA1E2685A',
                        'Arn'
                    ]
                },
                Handler: 'index.certificateRequestHandler',
                Runtime: 'nodejs14.x',
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                Timeout: 900
            },
            DependsOn: [
                'pccsdlcmyapptestdevexampleeduuseast1CertificateRequestorFunctionServiceRoleDefaultPolicyE4E2E992',
                'pccsdlcmyapptestdevexampleeduuseast1CertificateRequestorFunctionServiceRoleA1E2685A'
            ]
        },
        pccsdlcmyapptestdevexampleeduuseast1CertificateRequestorResource1DB708E5: {
            Type: 'AWS::CloudFormation::CustomResource',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': [
                        'pccsdlcmyapptestdevexampleeduuseast1CertificateRequestorFunction2C9738D0',
                        'Arn'
                    ]
                },
                DomainName: 'test.dev.example.edu',
                HostedZoneId: 'DUMMY',
                Region: 'us-east-1',
                CleanupRecords: 'true',
                Tags: {App: 'myapp', College: 'PCC', Environment: 'sdlc'}
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlcmyappwebfn0ServiceRole50B25A5F: {
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
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlcmyappwebfn0ServiceRoleDefaultPolicyCE13F846: {
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
                                    'Fn::GetAtt': ['pccsdlcmyappcacheF6FEBBE3', 'Arn']
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
                            Resource: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-test-secrets/environment-ABC123'
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlcmyappwebfn0ServiceRoleDefaultPolicyCE13F846',
                Roles: [{Ref: 'pccsdlcmyappwebfn0ServiceRole50B25A5F'}]
            }
        },
        pccsdlcmyappwebfn0SecurityGroup281B0580: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                GroupDescription: 'Automatic security group for Lambda Function pccsharedstackpccsdlcmyapppccsdlcmyappwebfn07DEA1A1F',
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
        pccsdlcmyappwebfn023B6D61B: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-2222-us-west-2',
                    S3Key: 'a701d9c4e1414bfb5bdc604564a232c79e82fa1c4186ebc7245836fb15ee2c49.zip'
                },
                Role: {
                    'Fn::GetAtt': ['pccsdlcmyappwebfn0ServiceRole50B25A5F', 'Arn']
                },
                FunctionName: 'pcc-sdlc-myapp-web-fn-0',
                Handler: 'public/index.php',
                Layers: [
                    {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                {Ref: 'AWS::Partition'},
                                ':lambda:us-west-2:209497400698:layer:php-81-fpm:28'
                            ]
                        ]
                    }
                ],
                MemorySize: 512,
                Runtime: 'provided.al2',
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                Timeout: 28,
                VpcConfig: {
                    SecurityGroupIds: [
                        {
                            'Fn::GetAtt': [
                                'pccsdlcmyappwebfn0SecurityGroup281B0580',
                                'GroupId'
                            ]
                        }
                    ],
                    SubnetIds: ['p-12345', 'p-67890']
                }
            },
            DependsOn: [
                'pccsdlcmyappwebfn0ServiceRoleDefaultPolicyCE13F846',
                'pccsdlcmyappwebfn0ServiceRole50B25A5F'
            ]
        },
        pccsdlcmyappwebfn0LogRetention49E1B142: {
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
                        ['/aws/lambda/', {Ref: 'pccsdlcmyappwebfn023B6D61B'}]
                    ]
                },
                RetentionInDays: 30
            }
        },
        pccsdlcmyapptestdevexampleedudefaultCertificateRequestorFunctionServiceRole3E8C6A4E: {
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
        pccsdlcmyapptestdevexampleedudefaultCertificateRequestorFunctionServiceRoleDefaultPolicy4024ACE2: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: [
                                'acm:RequestCertificate',
                                'acm:DescribeCertificate',
                                'acm:DeleteCertificate',
                                'acm:AddTagsToCertificate'
                            ],
                            Effect: 'Allow',
                            Resource: '*'
                        },
                        {
                            Action: 'route53:GetChange',
                            Effect: 'Allow',
                            Resource: '*'
                        },
                        {
                            Action: 'route53:changeResourceRecordSets',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {Ref: 'AWS::Partition'},
                                        ':route53:::hostedzone/DUMMY'
                                    ]
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlcmyapptestdevexampleedudefaultCertificateRequestorFunctionServiceRoleDefaultPolicy4024ACE2',
                Roles: [
                    {
                        Ref: 'pccsdlcmyapptestdevexampleedudefaultCertificateRequestorFunctionServiceRole3E8C6A4E'
                    }
                ]
            }
        },
        pccsdlcmyapptestdevexampleedudefaultCertificateRequestorFunction6A341C72: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-2222-us-west-2',
                    S3Key: '8ddf29ab619460567d3cda58de2ff1bf0f6e95d8822ff630ec58a4d52ed1fa67.zip'
                },
                Role: {
                    'Fn::GetAtt': [
                        'pccsdlcmyapptestdevexampleedudefaultCertificateRequestorFunctionServiceRole3E8C6A4E',
                        'Arn'
                    ]
                },
                Handler: 'index.certificateRequestHandler',
                Runtime: 'nodejs14.x',
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                Timeout: 900
            },
            DependsOn: [
                'pccsdlcmyapptestdevexampleedudefaultCertificateRequestorFunctionServiceRoleDefaultPolicy4024ACE2',
                'pccsdlcmyapptestdevexampleedudefaultCertificateRequestorFunctionServiceRole3E8C6A4E'
            ]
        },
        pccsdlcmyapptestdevexampleedudefaultCertificateRequestorResource63E29D46: {
            Type: 'AWS::CloudFormation::CustomResource',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': [
                        'pccsdlcmyapptestdevexampleedudefaultCertificateRequestorFunction6A341C72',
                        'Arn'
                    ]
                },
                DomainName: 'test.dev.example.edu',
                HostedZoneId: 'DUMMY',
                CleanupRecords: 'true',
                Tags: {App: 'myapp', College: 'PCC', Environment: 'sdlc'}
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlcmyappauthorizerfnServiceRole6F874BA1: {
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
        pccsdlcmyappauthorizerfnServiceRoleDefaultPolicyB29EF52A: {
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
                                    'Fn::GetAtt': ['pccsdlcmyappcacheF6FEBBE3', 'Arn']
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
                            Resource: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-test-secrets/environment-ABC123'
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlcmyappauthorizerfnServiceRoleDefaultPolicyB29EF52A',
                Roles: [{Ref: 'pccsdlcmyappauthorizerfnServiceRole6F874BA1'}]
            }
        },
        pccsdlcmyappauthorizerfn94599CE7: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-2222-us-west-2',
                    S3Key: 'c53d3eefd84eda81ec21cae72089e12b7729368cb85e86fc9fb8b2031b76415b.zip'
                },
                Role: {
                    'Fn::GetAtt': ['pccsdlcmyappauthorizerfnServiceRole6F874BA1', 'Arn']
                },
                Environment: {
                    Variables: {
                        AUTHORIZER_TOKEN: '{{resolve:secretsmanager:arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-test-secrets/environment-ABC123:SecretString:AUTHORIZER_TOKEN::}}'
                    }
                },
                FunctionName: 'pcc-sdlc-myapp-authorizer-fn',
                Handler: 'token.handler',
                Runtime: 'nodejs16.x',
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                Timeout: 5
            },
            DependsOn: [
                'pccsdlcmyappauthorizerfnServiceRoleDefaultPolicyB29EF52A',
                'pccsdlcmyappauthorizerfnServiceRole6F874BA1'
            ]
        },
        pccsdlcmyappauthorizerfnLogRetention8F57F3D3: {
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
                            {Ref: 'pccsdlcmyappauthorizerfn94599CE7'}
                        ]
                    ]
                },
                RetentionInDays: 7
            }
        },
        pccsdlcmyapprestapi9C566785: {
            Type: 'AWS::ApiGateway::RestApi',
            Properties: {
                DisableExecuteApiEndpoint: false,
                EndpointConfiguration: {Types: ['REGIONAL']},
                Name: 'pcc-sdlc-myapp-rest-api',
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlcmyapprestapiCloudWatchRoleAE0F6C67: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: {Service: 'apigateway.amazonaws.com'}
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
                                ':iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs'
                            ]
                        ]
                    }
                ],
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            },
            UpdateReplacePolicy: 'Retain',
            DeletionPolicy: 'Retain'
        },
        pccsdlcmyapprestapiAccount2815FAF9: {
            Type: 'AWS::ApiGateway::Account',
            Properties: {
                CloudWatchRoleArn: {
                    'Fn::GetAtt': ['pccsdlcmyapprestapiCloudWatchRoleAE0F6C67', 'Arn']
                }
            },
            DependsOn: ['pccsdlcmyapprestapi9C566785'],
            UpdateReplacePolicy: 'Retain',
            DeletionPolicy: 'Retain'
        },
        pccsdlcmyapprestapiDeployment89B7D2D50a8a29fcac6507ba7851d01e703bdc2a: {
            Type: 'AWS::ApiGateway::Deployment',
            Properties: {
                RestApiId: {Ref: 'pccsdlcmyapprestapi9C566785'},
                Description: 'Automatically created by the RestApi construct'
            },
            DependsOn: [
                'pccsdlcmyapprestapiproxyANYD89B4045',
                'pccsdlcmyapprestapiproxy78257C10',
                'pccsdlcmyapprestapiANY861F3D8B'
            ]
        },
        pccsdlcmyapprestapiDeploymentStageprod3055E24F: {
            Type: 'AWS::ApiGateway::Stage',
            Properties: {
                RestApiId: {Ref: 'pccsdlcmyapprestapi9C566785'},
                DeploymentId: {
                    Ref: 'pccsdlcmyapprestapiDeployment89B7D2D50a8a29fcac6507ba7851d01e703bdc2a'
                },
                StageName: 'prod',
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            },
            DependsOn: ['pccsdlcmyapprestapiAccount2815FAF9']
        },
        pccsdlcmyapprestapiCustomDomainE30BD6DE: {
            Type: 'AWS::ApiGateway::DomainName',
            Properties: {
                DomainName: 'test.dev.example.edu',
                EndpointConfiguration: {Types: ['REGIONAL']},
                RegionalCertificateArn: {
                    'Fn::GetAtt': [
                        'pccsdlcmyapptestdevexampleedudefaultCertificateRequestorResource63E29D46',
                        'Arn'
                    ]
                },
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlcmyapprestapiCustomDomainMappccsharedstackpccsdlcmyapppccsdlcmyapprestapi9ABDFE56D5B5F989: {
            Type: 'AWS::ApiGateway::BasePathMapping',
            Properties: {
                DomainName: {Ref: 'pccsdlcmyapprestapiCustomDomainE30BD6DE'},
                RestApiId: {Ref: 'pccsdlcmyapprestapi9C566785'},
                Stage: {Ref: 'pccsdlcmyapprestapiDeploymentStageprod3055E24F'}
            }
        },
        pccsdlcmyapprestapiproxy78257C10: {
            Type: 'AWS::ApiGateway::Resource',
            Properties: {
                ParentId: {
                    'Fn::GetAtt': ['pccsdlcmyapprestapi9C566785', 'RootResourceId']
                },
                PathPart: '{proxy+}',
                RestApiId: {Ref: 'pccsdlcmyapprestapi9C566785'}
            }
        },
        pccsdlcmyapprestapiproxyANYApiPermissionpccsharedstackpccsdlcmyapppccsdlcmyapprestapi9ABDFE56ANYproxyA5E205DA: {
            Type: 'AWS::Lambda::Permission',
            Properties: {
                Action: 'lambda:InvokeFunction',
                FunctionName: {'Fn::GetAtt': ['pccsdlcmyappwebfn023B6D61B', 'Arn']},
                Principal: 'apigateway.amazonaws.com',
                SourceArn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {Ref: 'AWS::Partition'},
                            ':execute-api:us-west-2:2222:',
                            {Ref: 'pccsdlcmyapprestapi9C566785'},
                            '/',
                            {
                                Ref: 'pccsdlcmyapprestapiDeploymentStageprod3055E24F'
                            },
                            '/*/*'
                        ]
                    ]
                }
            }
        },
        pccsdlcmyapprestapiproxyANYApiPermissionTestpccsharedstackpccsdlcmyapppccsdlcmyapprestapi9ABDFE56ANYproxy4D14A616: {
            Type: 'AWS::Lambda::Permission',
            Properties: {
                Action: 'lambda:InvokeFunction',
                FunctionName: {'Fn::GetAtt': ['pccsdlcmyappwebfn023B6D61B', 'Arn']},
                Principal: 'apigateway.amazonaws.com',
                SourceArn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {Ref: 'AWS::Partition'},
                            ':execute-api:us-west-2:2222:',
                            {Ref: 'pccsdlcmyapprestapi9C566785'},
                            '/test-invoke-stage/*/*'
                        ]
                    ]
                }
            }
        },
        pccsdlcmyapprestapiproxyANYD89B4045: {
            Type: 'AWS::ApiGateway::Method',
            Properties: {
                HttpMethod: 'ANY',
                ResourceId: {Ref: 'pccsdlcmyapprestapiproxy78257C10'},
                RestApiId: {Ref: 'pccsdlcmyapprestapi9C566785'},
                AuthorizationType: 'CUSTOM',
                Integration: {
                    IntegrationHttpMethod: 'POST',
                    Type: 'AWS_PROXY',
                    Uri: {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                {Ref: 'AWS::Partition'},
                                ':apigateway:us-west-2:lambda:path/2015-03-31/functions/',
                                {
                                    'Fn::GetAtt': ['pccsdlcmyappwebfn023B6D61B', 'Arn']
                                },
                                '/invocations'
                            ]
                        ]
                    }
                }
            }
        },
        pccsdlcmyapprestapiANYApiPermissionpccsharedstackpccsdlcmyapppccsdlcmyapprestapi9ABDFE56ANY68B56F3A: {
            Type: 'AWS::Lambda::Permission',
            Properties: {
                Action: 'lambda:InvokeFunction',
                FunctionName: {'Fn::GetAtt': ['pccsdlcmyappwebfn023B6D61B', 'Arn']},
                Principal: 'apigateway.amazonaws.com',
                SourceArn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {Ref: 'AWS::Partition'},
                            ':execute-api:us-west-2:2222:',
                            {Ref: 'pccsdlcmyapprestapi9C566785'},
                            '/',
                            {
                                Ref: 'pccsdlcmyapprestapiDeploymentStageprod3055E24F'
                            },
                            '/*/'
                        ]
                    ]
                }
            }
        },
        pccsdlcmyapprestapiANYApiPermissionTestpccsharedstackpccsdlcmyapppccsdlcmyapprestapi9ABDFE56ANY7287AC2D: {
            Type: 'AWS::Lambda::Permission',
            Properties: {
                Action: 'lambda:InvokeFunction',
                FunctionName: {'Fn::GetAtt': ['pccsdlcmyappwebfn023B6D61B', 'Arn']},
                Principal: 'apigateway.amazonaws.com',
                SourceArn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {Ref: 'AWS::Partition'},
                            ':execute-api:us-west-2:2222:',
                            {Ref: 'pccsdlcmyapprestapi9C566785'},
                            '/test-invoke-stage/*/'
                        ]
                    ]
                }
            }
        },
        pccsdlcmyapprestapiANY861F3D8B: {
            Type: 'AWS::ApiGateway::Method',
            Properties: {
                HttpMethod: 'ANY',
                ResourceId: {
                    'Fn::GetAtt': ['pccsdlcmyapprestapi9C566785', 'RootResourceId']
                },
                RestApiId: {Ref: 'pccsdlcmyapprestapi9C566785'},
                AuthorizationType: 'CUSTOM',
                Integration: {
                    IntegrationHttpMethod: 'POST',
                    Type: 'AWS_PROXY',
                    Uri: {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                {Ref: 'AWS::Partition'},
                                ':apigateway:us-west-2:lambda:path/2015-03-31/functions/',
                                {
                                    'Fn::GetAtt': ['pccsdlcmyappwebfn023B6D61B', 'Arn']
                                },
                                '/invocations'
                            ]
                        ]
                    }
                }
            }
        },
        pccsdlcmyapprestapialarmtopicDE1D141D: {
            Type: 'AWS::SNS::Topic',
            Properties: {
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlcmyapprestapialarmtopictestexampleeduB8A0A869: {
            Type: 'AWS::SNS::Subscription',
            Properties: {
                Protocol: 'email',
                TopicArn: {Ref: 'pccsdlcmyapprestapialarmtopicDE1D141D'},
                Endpoint: 'test@example.edu'
            }
        },
        pccsdlcmyapprestapiservererroralarm44D039D4: {
            Type: 'AWS::CloudWatch::Alarm',
            Properties: {
                ComparisonOperator: 'GreaterThanOrEqualToThreshold',
                EvaluationPeriods: 1,
                AlarmActions: [{Ref: 'pccsdlcmyapprestapialarmtopicDE1D141D'}],
                Dimensions: [{Name: 'ApiName', Value: 'pcc-sdlc-myapp-rest-api'}],
                MetricName: '5XXError',
                Namespace: 'AWS/ApiGateway',
                OKActions: [{Ref: 'pccsdlcmyapprestapialarmtopicDE1D141D'}],
                Period: 300,
                Statistic: 'Sum',
                Threshold: 5,
                TreatMissingData: 'notBreaching'
            }
        },
        pccsdlcmyapprestapiclienterroralarm4EFCA464: {
            Type: 'AWS::CloudWatch::Alarm',
            Properties: {
                ComparisonOperator: 'GreaterThanOrEqualToThreshold',
                EvaluationPeriods: 1,
                AlarmActions: [{Ref: 'pccsdlcmyapprestapialarmtopicDE1D141D'}],
                Dimensions: [{Name: 'ApiName', Value: 'pcc-sdlc-myapp-rest-api'}],
                MetricName: '4XXError',
                Namespace: 'AWS/ApiGateway',
                OKActions: [{Ref: 'pccsdlcmyapprestapialarmtopicDE1D141D'}],
                Period: 300,
                Statistic: 'Sum',
                Threshold: 5,
                TreatMissingData: 'notBreaching'
            }
        },
        pccsdlcmyapprestapicountalarm80BA419A: {
            Type: 'AWS::CloudWatch::Alarm',
            Properties: {
                ComparisonOperator: 'GreaterThanOrEqualToThreshold',
                EvaluationPeriods: 1,
                AlarmActions: [{Ref: 'pccsdlcmyapprestapialarmtopicDE1D141D'}],
                Dimensions: [{Name: 'ApiName', Value: 'pcc-sdlc-myapp-rest-api'}],
                MetricName: 'Count',
                Namespace: 'AWS/ApiGateway',
                OKActions: [{Ref: 'pccsdlcmyapprestapialarmtopicDE1D141D'}],
                Period: 300,
                Statistic: 'SampleCount',
                Threshold: 500,
                TreatMissingData: 'notBreaching'
            }
        },
        pccsdlcmyappassets5EE4E88C: {
            Type: 'AWS::S3::Bucket',
            Properties: {
                BucketEncryption: {
                    ServerSideEncryptionConfiguration: [
                        {
                            ServerSideEncryptionByDefault: {SSEAlgorithm: 'AES256'}
                        }
                    ]
                },
                BucketName: 'pcc-sdlc-myapp-assets',
                PublicAccessBlockConfiguration: {
                    BlockPublicAcls: true,
                    BlockPublicPolicy: true,
                    IgnorePublicAcls: true,
                    RestrictPublicBuckets: true
                },
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'aws-cdk:cr-owned:assets:304161ad', Value: 'true'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            },
            UpdateReplacePolicy: 'Retain',
            DeletionPolicy: 'Retain'
        },
        pccsdlcmyappassetsPolicy40CD8B35: {
            Type: 'AWS::S3::BucketPolicy',
            Properties: {
                Bucket: {Ref: 'pccsdlcmyappassets5EE4E88C'},
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 's3:*',
                            Condition: {Bool: {'aws:SecureTransport': 'false'}},
                            Effect: 'Deny',
                            Principal: {AWS: '*'},
                            Resource: [
                                {
                                    'Fn::GetAtt': ['pccsdlcmyappassets5EE4E88C', 'Arn']
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': ['pccsdlcmyappassets5EE4E88C', 'Arn']
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
                            Principal: {
                                CanonicalUser: {
                                    'Fn::GetAtt': [
                                        'pccsdlcmyappcfdistOrigin2S3OriginC74A342C',
                                        'S3CanonicalUserId'
                                    ]
                                }
                            },
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        {
                                            'Fn::GetAtt': ['pccsdlcmyappassets5EE4E88C', 'Arn']
                                        },
                                        '/*'
                                    ]
                                ]
                            }
                        },
                        {
                            Action: 's3:GetObject',
                            Effect: 'Allow',
                            Principal: {
                                CanonicalUser: {
                                    'Fn::GetAtt': [
                                        'pccsdlcmyappcfdistOrigin3S3Origin851F5391',
                                        'S3CanonicalUserId'
                                    ]
                                }
                            },
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        {
                                            'Fn::GetAtt': ['pccsdlcmyappassets5EE4E88C', 'Arn']
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
        s3assetscopyAwsCliLayerA9EB8F42: {
            Type: 'AWS::Lambda::LayerVersion',
            Properties: {
                Content: {
                    S3Bucket: 'cdk-hnb659fds-assets-2222-us-west-2',
                    S3Key: '1d3b5490cd99feddeb525a62c046988997469f2a765d0f12b43cff9d87a284fa.zip'
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
                SourceBucketNames: ['cdk-hnb659fds-assets-2222-us-west-2'],
                SourceObjectKeys: [
                    '4dd7b3acb0d8c02094bb424ce803d0e3418f6db703e9524905cb0d32ff66b78b.zip'
                ],
                DestinationBucketName: {Ref: 'pccsdlcmyappassets5EE4E88C'},
                DestinationBucketKeyPrefix: 'assets',
                Prune: true
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
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
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
                                            ':s3:::cdk-hnb659fds-assets-2222-us-west-2'
                                        ]
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':s3:::cdk-hnb659fds-assets-2222-us-west-2/*'
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
                                    'Fn::GetAtt': ['pccsdlcmyappassets5EE4E88C', 'Arn']
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': ['pccsdlcmyappassets5EE4E88C', 'Arn']
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
                    S3Bucket: 'cdk-hnb659fds-assets-2222-us-west-2',
                    S3Key: 'f98b78092dcdd31f5e6d47489beb5f804d4835ef86a8085d0a2053cb9ae711da.zip'
                },
                Role: {
                    'Fn::GetAtt': [
                        'CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756CServiceRole89A01265',
                        'Arn'
                    ]
                },
                Handler: 'index.handler',
                Layers: [{Ref: 's3assetscopyAwsCliLayerA9EB8F42'}],
                Runtime: 'python3.9',
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                Timeout: 900
            },
            DependsOn: [
                'CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756CServiceRoleDefaultPolicy88902FDF',
                'CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756CServiceRole89A01265'
            ]
        },
        CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756CLogRetention1948627D: {
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
                            {
                                Ref: 'CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C81C01536'
                            }
                        ]
                    ]
                },
                RetentionInDays: 1
            }
        },
        pccsdlcmyapporiginrequestpolicy28F23D4F: {
            Type: 'AWS::CloudFront::OriginRequestPolicy',
            Properties: {
                OriginRequestPolicyConfig: {
                    CookiesConfig: {CookieBehavior: 'all'},
                    HeadersConfig: {
                        HeaderBehavior: 'allViewerAndWhitelistCloudFront',
                        Headers: ['CloudFront-Viewer-Address']
                    },
                    Name: 'pcc-sdlc-myapp-origin-request-policy',
                    QueryStringsConfig: {QueryStringBehavior: 'all'}
                }
            }
        },
        pccsdlcmyappcfdist7CEB1764: {
            Type: 'AWS::CloudFront::Distribution',
            Properties: {
                DistributionConfig: {
                    Aliases: ['test.dev.example.edu'],
                    CacheBehaviors: [
                        {
                            CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
                            Compress: true,
                            PathPattern: '/assets/*',
                            TargetOriginId: 'pccsharedstackpccsdlcmyapppccsdlcmyappcfdistOrigin21EE63934',
                            ViewerProtocolPolicy: 'redirect-to-https'
                        },
                        {
                            CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
                            Compress: true,
                            PathPattern: '/favicon.ico',
                            TargetOriginId: 'pccsharedstackpccsdlcmyapppccsdlcmyappcfdistOrigin3365CFF60',
                            ViewerProtocolPolicy: 'redirect-to-https'
                        },
                        {
                            CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
                            Compress: true,
                            PathPattern: '/robots.txt',
                            TargetOriginId: 'pccsharedstackpccsdlcmyapppccsdlcmyappcfdistOrigin3365CFF60',
                            ViewerProtocolPolicy: 'redirect-to-https'
                        }
                    ],
                    Comment: 'pcc-sdlc-myapp-cf-dist',
                    DefaultCacheBehavior: {
                        AllowedMethods: [
                            'GET', 'HEAD',
                            'OPTIONS', 'PUT',
                            'PATCH', 'POST',
                            'DELETE'
                        ],
                        CachePolicyId: '4135ea2d-6df8-44a3-9df3-4b5a84be39ad',
                        Compress: true,
                        FunctionAssociations: [],
                        OriginRequestPolicyId: {Ref: 'pccsdlcmyapporiginrequestpolicy28F23D4F'},
                        ResponseHeadersPolicyId: '67f7725c-6f97-4210-82d7-5512b31e9d03',
                        TargetOriginId: 'pccsharedstackpccsdlcmyapppccsdlcmyappcfdistOrigin1C2752F70',
                        ViewerProtocolPolicy: 'redirect-to-https'
                    },
                    Enabled: true,
                    HttpVersion: 'http2',
                    IPV6Enabled: true,
                    Origins: [
                        {
                            ConnectionAttempts: 1,
                            CustomOriginConfig: {
                                OriginProtocolPolicy: 'https-only',
                                OriginSSLProtocols: ['TLSv1.2']
                            },
                            DomainName: {
                                'Fn::Select': [
                                    2,
                                    {
                                        'Fn::Split': [
                                            '/',
                                            {
                                                'Fn::Join': [
                                                    '',
                                                    [
                                                        'https://',
                                                        {Ref: 'pccsdlcmyapprestapi9C566785'},
                                                        '.execute-api.us-west-2.',
                                                        {Ref: 'AWS::URLSuffix'},
                                                        '/',
                                                        {
                                                            Ref: 'pccsdlcmyapprestapiDeploymentStageprod3055E24F'
                                                        },
                                                        '/'
                                                    ]
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            Id: 'pccsharedstackpccsdlcmyapppccsdlcmyappcfdistOrigin1C2752F70',
                            OriginCustomHeaders: [
                                {
                                    HeaderName: 'x-auth-token',
                                    HeaderValue: '{{resolve:secretsmanager:arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-test-secrets/environment-ABC123:SecretString:AUTHORIZER_TOKEN::}}'
                                }
                            ],
                            OriginPath: {
                                'Fn::Join': [
                                    '',
                                    [
                                        '/',
                                        {
                                            'Fn::Select': [
                                                3,
                                                {
                                                    'Fn::Split': [
                                                        '/',
                                                        {
                                                            'Fn::Join': [
                                                                '',
                                                                [
                                                                    'https://',
                                                                    {
                                                                        Ref: 'pccsdlcmyapprestapi9C566785'
                                                                    },
                                                                    '.execute-api.us-west-2.',
                                                                    {Ref: 'AWS::URLSuffix'},
                                                                    '/',
                                                                    {
                                                                        Ref: 'pccsdlcmyapprestapiDeploymentStageprod3055E24F'
                                                                    },
                                                                    '/'
                                                                ]
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                ]
                            }
                        },
                        {
                            DomainName: {
                                'Fn::GetAtt': [
                                    'pccsdlcmyappassets5EE4E88C',
                                    'RegionalDomainName'
                                ]
                            },
                            Id: 'pccsharedstackpccsdlcmyapppccsdlcmyappcfdistOrigin21EE63934',
                            S3OriginConfig: {
                                OriginAccessIdentity: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'origin-access-identity/cloudfront/',
                                            {
                                                Ref: 'pccsdlcmyappcfdistOrigin2S3OriginC74A342C'
                                            }
                                        ]
                                    ]
                                }
                            }
                        },
                        {
                            DomainName: {
                                'Fn::GetAtt': [
                                    'pccsdlcmyappassets5EE4E88C',
                                    'RegionalDomainName'
                                ]
                            },
                            Id: 'pccsharedstackpccsdlcmyapppccsdlcmyappcfdistOrigin3365CFF60',
                            OriginPath: '/assets',
                            S3OriginConfig: {
                                OriginAccessIdentity: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'origin-access-identity/cloudfront/',
                                            {
                                                Ref: 'pccsdlcmyappcfdistOrigin3S3Origin851F5391'
                                            }
                                        ]
                                    ]
                                }
                            }
                        }
                    ],
                    PriceClass: 'PriceClass_100',
                    ViewerCertificate: {
                        AcmCertificateArn: {
                            'Fn::GetAtt': [
                                'pccsdlcmyapptestdevexampleeduuseast1CertificateRequestorResource1DB708E5',
                                'Arn'
                            ]
                        },
                        MinimumProtocolVersion: 'TLSv1.2_2019',
                        SslSupportMethod: 'sni-only'
                    },
                    WebACLId: 'arn:aws:wafv2:us-east-1:123456789012:global/webacl/pccprodwafcf-arn-random-characters'
                },
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlcmyappcfdistOrigin2S3OriginC74A342C: {
            Type: 'AWS::CloudFront::CloudFrontOriginAccessIdentity',
            Properties: {
                CloudFrontOriginAccessIdentityConfig: {
                    Comment: 'Identity for pccsharedstackpccsdlcmyapppccsdlcmyappcfdistOrigin21EE63934'
                }
            }
        },
        pccsdlcmyappcfdistOrigin3S3Origin851F5391: {
            Type: 'AWS::CloudFront::CloudFrontOriginAccessIdentity',
            Properties: {
                CloudFrontOriginAccessIdentityConfig: {
                    Comment: 'Identity for pccsharedstackpccsdlcmyapppccsdlcmyappcfdistOrigin3365CFF60'
                }
            }
        },
        pccsdlcmyapptestdevexampleeduarecord1EBFD14B: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                Name: 'test.dev.example.edu.',
                Type: 'A',
                AliasTarget: {
                    DNSName: {
                        'Fn::GetAtt': ['pccsdlcmyappcfdist7CEB1764', 'DomainName']
                    },
                    HostedZoneId: {
                        'Fn::FindInMap': [
                            'AWSCloudFrontPartitionHostedZoneIdMap',
                            {Ref: 'AWS::Partition'},
                            'zoneId'
                        ]
                    }
                },
                Comment: 'pcc-sdlc-myapp: test.dev.example.edu',
                HostedZoneId: 'DUMMY'
            }
        },
        pccsdlcmyapptestdevexampleedudkimDkimDnsToken10D424A26: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                Name: {
                    'Fn::GetAtt': [
                        'pccsdlcmyapptestdevexampleedudkimF4B7E8AC',
                        'DkimDNSTokenName1'
                    ]
                },
                Type: 'CNAME',
                HostedZoneId: 'DUMMY',
                ResourceRecords: [
                    {
                        'Fn::GetAtt': [
                            'pccsdlcmyapptestdevexampleedudkimF4B7E8AC',
                            'DkimDNSTokenValue1'
                        ]
                    }
                ],
                TTL: '1800'
            }
        },
        pccsdlcmyapptestdevexampleedudkimDkimDnsToken22F5C3F51: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                Name: {
                    'Fn::GetAtt': [
                        'pccsdlcmyapptestdevexampleedudkimF4B7E8AC',
                        'DkimDNSTokenName2'
                    ]
                },
                Type: 'CNAME',
                HostedZoneId: 'DUMMY',
                ResourceRecords: [
                    {
                        'Fn::GetAtt': [
                            'pccsdlcmyapptestdevexampleedudkimF4B7E8AC',
                            'DkimDNSTokenValue2'
                        ]
                    }
                ],
                TTL: '1800'
            }
        },
        pccsdlcmyapptestdevexampleedudkimDkimDnsToken350B917DD: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                Name: {
                    'Fn::GetAtt': [
                        'pccsdlcmyapptestdevexampleedudkimF4B7E8AC',
                        'DkimDNSTokenName3'
                    ]
                },
                Type: 'CNAME',
                HostedZoneId: 'DUMMY',
                ResourceRecords: [
                    {
                        'Fn::GetAtt': [
                            'pccsdlcmyapptestdevexampleedudkimF4B7E8AC',
                            'DkimDNSTokenValue3'
                        ]
                    }
                ],
                TTL: '1800'
            }
        },
        pccsdlcmyapptestdevexampleedudkimF4B7E8AC: {
            Type: 'AWS::SES::EmailIdentity',
            Properties: {
                EmailIdentity: 'dev.example.edu',
                MailFromAttributes: {MailFromDomain: 'test.dev.example.edu'}
            }
        },
        pccsdlcmyapptestdevexampleedudkimMailFromMxRecordBD7323F9: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                Name: 'test.dev.example.edu.',
                Type: 'MX',
                HostedZoneId: 'DUMMY',
                ResourceRecords: ['10 feedback-smtp.us-west-2.amazonses.com'],
                TTL: '1800'
            }
        },
        pccsdlcmyapptestdevexampleedudkimMailFromTxtRecord1281646D: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                Name: 'test.dev.example.edu.',
                Type: 'TXT',
                HostedZoneId: 'DUMMY',
                ResourceRecords: ['"v=spf1 include:amazonses.com ~all"'],
                TTL: '1800'
            }
        }
    },
    Outputs: {
        pccsdlcmyapprestapiEndpointF393938F: {
            Value: {
                'Fn::Join': [
                    '',
                    [
                        'https://',
                        {Ref: 'pccsdlcmyapprestapi9C566785'},
                        '.execute-api.us-west-2.',
                        {Ref: 'AWS::URLSuffix'},
                        '/',
                        {Ref: 'pccsdlcmyapprestapiDeploymentStageprod3055E24F'},
                        '/'
                    ]
                ]
            }
        }
    },
    Mappings: {
        AWSCloudFrontPartitionHostedZoneIdMap: {
            aws: {zoneId: 'Z2FDTNDATAQYW2'},
            'aws-cn': {zoneId: 'Z3RFFRIM2A3IF5'}
        }
    }
}