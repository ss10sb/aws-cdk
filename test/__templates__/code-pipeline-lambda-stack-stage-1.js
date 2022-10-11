module.exports = {
    Resources: {
        pccprodtestcache90B0E581: {
            Type: 'AWS::DynamoDB::Table',
            Properties: {
                KeySchema: [{AttributeName: 'key', KeyType: 'HASH'}],
                AttributeDefinitions: [{AttributeName: 'key', AttributeType: 'S'}],
                BillingMode: 'PAY_PER_REQUEST',
                SSESpecification: {SSEEnabled: true},
                TableName: 'pcc-prod-test-cache',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccprodtesttestexampleeduuseast1CertificateRequestorFunctionServiceRole50B13D65: {
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
        pccprodtesttestexampleeduuseast1CertificateRequestorFunctionServiceRoleDefaultPolicy7F680EB5: {
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
                PolicyName: 'pccprodtesttestexampleeduuseast1CertificateRequestorFunctionServiceRoleDefaultPolicy7F680EB5',
                Roles: [
                    {
                        Ref: 'pccprodtesttestexampleeduuseast1CertificateRequestorFunctionServiceRole50B13D65'
                    }
                ]
            }
        },
        pccprodtesttestexampleeduuseast1CertificateRequestorFunction203B279D: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-22222-us-west-2',
                    S3Key: 'e85f10a8bf0e7f4f7931fce24b29d4faf6874948090a2b568b2da33a7116cf84.zip'
                },
                Role: {
                    'Fn::GetAtt': [
                        'pccprodtesttestexampleeduuseast1CertificateRequestorFunctionServiceRole50B13D65',
                        'Arn'
                    ]
                },
                Handler: 'index.certificateRequestHandler',
                Runtime: 'nodejs14.x',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ],
                Timeout: 900
            },
            DependsOn: [
                'pccprodtesttestexampleeduuseast1CertificateRequestorFunctionServiceRoleDefaultPolicy7F680EB5',
                'pccprodtesttestexampleeduuseast1CertificateRequestorFunctionServiceRole50B13D65'
            ]
        },
        pccprodtesttestexampleeduuseast1CertificateRequestorResourceE93815B2: {
            Type: 'AWS::CloudFormation::CustomResource',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': [
                        'pccprodtesttestexampleeduuseast1CertificateRequestorFunction203B279D',
                        'Arn'
                    ]
                },
                DomainName: 'test.example.edu',
                HostedZoneId: 'DUMMY',
                Region: 'us-east-1',
                CleanupRecords: 'true',
                Tags: {App: 'test', College: 'PCC', Environment: 'prod'}
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
                            Resource: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-prod-test-secrets/environment-ABC123'
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
                    S3Key: 'a701d9c4e1414bfb5bdc604564a232c79e82fa1c4186ebc7245836fb15ee2c49.zip'
                },
                Role: {
                    'Fn::GetAtt': ['pccprodtestwebfn0ServiceRole6B6FD81D', 'Arn']
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
                                ':lambda:us-west-2:209497400698:layer:php-81-fpm:28'
                            ]
                        ]
                    }
                ],
                MemorySize: 512,
                Runtime: 'provided.al2',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ],
                Timeout: 28,
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
        pccprodtestwebfn0LogRetention2C8F5B9C: {
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
                        ['/aws/lambda/', {Ref: 'pccprodtestwebfn0B6D4CE6D'}]
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
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
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
                    S3Bucket: 'cdk-hnb659fds-assets-22222-us-west-2',
                    S3Key: 'eb5b005c858404ea0c8f68098ed5dcdf5340e02461f149751d10f59c210d5ef8.zip'
                },
                Role: {
                    'Fn::GetAtt': [
                        'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB',
                        'Arn'
                    ]
                },
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ]
            },
            DependsOn: [
                'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRoleDefaultPolicyADDA7DEB',
                'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB'
            ]
        },
        pccprodtesttestexampleedudefaultCertificateRequestorFunctionServiceRoleCFD8780C: {
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
        pccprodtesttestexampleedudefaultCertificateRequestorFunctionServiceRoleDefaultPolicyFE2BD257: {
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
                PolicyName: 'pccprodtesttestexampleedudefaultCertificateRequestorFunctionServiceRoleDefaultPolicyFE2BD257',
                Roles: [
                    {
                        Ref: 'pccprodtesttestexampleedudefaultCertificateRequestorFunctionServiceRoleCFD8780C'
                    }
                ]
            }
        },
        pccprodtesttestexampleedudefaultCertificateRequestorFunctionE2E96958: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-22222-us-west-2',
                    S3Key: 'e85f10a8bf0e7f4f7931fce24b29d4faf6874948090a2b568b2da33a7116cf84.zip'
                },
                Role: {
                    'Fn::GetAtt': [
                        'pccprodtesttestexampleedudefaultCertificateRequestorFunctionServiceRoleCFD8780C',
                        'Arn'
                    ]
                },
                Handler: 'index.certificateRequestHandler',
                Runtime: 'nodejs14.x',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ],
                Timeout: 900
            },
            DependsOn: [
                'pccprodtesttestexampleedudefaultCertificateRequestorFunctionServiceRoleDefaultPolicyFE2BD257',
                'pccprodtesttestexampleedudefaultCertificateRequestorFunctionServiceRoleCFD8780C'
            ]
        },
        pccprodtesttestexampleedudefaultCertificateRequestorResource5C09FF4B: {
            Type: 'AWS::CloudFormation::CustomResource',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': [
                        'pccprodtesttestexampleedudefaultCertificateRequestorFunctionE2E96958',
                        'Arn'
                    ]
                },
                DomainName: 'test.example.edu',
                HostedZoneId: 'DUMMY',
                CleanupRecords: 'true',
                Tags: {App: 'test', College: 'PCC', Environment: 'prod'}
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccprodtestauthorizerfnServiceRoleF62FCC42: {
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
        pccprodtestauthorizerfnServiceRoleDefaultPolicyA4587C93: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
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
                            Resource: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-prod-test-secrets/environment-ABC123'
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccprodtestauthorizerfnServiceRoleDefaultPolicyA4587C93',
                Roles: [{Ref: 'pccprodtestauthorizerfnServiceRoleF62FCC42'}]
            }
        },
        pccprodtestauthorizerfn5C96E50D: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-22222-us-west-2',
                    S3Key: 'c53d3eefd84eda81ec21cae72089e12b7729368cb85e86fc9fb8b2031b76415b.zip'
                },
                Role: {
                    'Fn::GetAtt': ['pccprodtestauthorizerfnServiceRoleF62FCC42', 'Arn']
                },
                Environment: {
                    Variables: {
                        AUTHORIZER_TOKEN: '{{resolve:secretsmanager:arn:aws:secretsmanager:us-west-2:33333:secret:pcc-prod-test-secrets/environment-ABC123:SecretString:AUTHORIZER_TOKEN::}}'
                    }
                },
                FunctionName: 'pcc-prod-test-authorizer-fn',
                Handler: 'token.handler',
                Runtime: 'nodejs16.x',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ],
                Timeout: 5
            },
            DependsOn: [
                'pccprodtestauthorizerfnServiceRoleDefaultPolicyA4587C93',
                'pccprodtestauthorizerfnServiceRoleF62FCC42'
            ]
        },
        pccprodtestauthorizerfnLogRetention4104E0B8: {
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
                            {Ref: 'pccprodtestauthorizerfn5C96E50D'}
                        ]
                    ]
                },
                RetentionInDays: 7
            }
        },
        pccprodtestrestapilg3340C571: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                LogGroupName: 'pcc-prod-test-rest-api-lg',
                RetentionInDays: 7,
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccprodtestrestapiFDFF2D0E: {
            Type: 'AWS::ApiGateway::RestApi',
            Properties: {
                DisableExecuteApiEndpoint: false,
                EndpointConfiguration: {Types: ['REGIONAL']},
                Name: 'pcc-prod-test-rest-api',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ]
            }
        },
        pccprodtestrestapiCloudWatchRole592A138C: {
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
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ]
            },
            UpdateReplacePolicy: 'Retain',
            DeletionPolicy: 'Retain'
        },
        pccprodtestrestapiAccount2BA720F6: {
            Type: 'AWS::ApiGateway::Account',
            Properties: {
                CloudWatchRoleArn: {
                    'Fn::GetAtt': ['pccprodtestrestapiCloudWatchRole592A138C', 'Arn']
                }
            },
            DependsOn: ['pccprodtestrestapiFDFF2D0E'],
            UpdateReplacePolicy: 'Retain',
            DeletionPolicy: 'Retain'
        },
        pccprodtestrestapiDeploymentD4D92C416c9e2f9b752ad0a78ba19afedc420116: {
            Type: 'AWS::ApiGateway::Deployment',
            Properties: {
                RestApiId: {Ref: 'pccprodtestrestapiFDFF2D0E'},
                Description: 'Automatically created by the RestApi construct'
            },
            DependsOn: [
                'pccprodtestrestapiproxyANY3101E90C',
                'pccprodtestrestapiproxy1A8C0D6C',
                'pccprodtestrestapiANYDE5B4726'
            ]
        },
        pccprodtestrestapiDeploymentStageprodDAE88F7E: {
            Type: 'AWS::ApiGateway::Stage',
            Properties: {
                RestApiId: {Ref: 'pccprodtestrestapiFDFF2D0E'},
                AccessLogSetting: {
                    DestinationArn: {'Fn::GetAtt': ['pccprodtestrestapilg3340C571', 'Arn']},
                    Format: '{"requestTime":"$context.requestTime","requestId":"$context.requestId","httpMethod":"$context.httpMethod","path":"$context.path","resourcePath":"$context.resourcePath","status":$context.status,"responseLatency":$context.responseLatency,"xrayTraceId":"$context.xrayTraceId","integrationRequestId":"$context.integration.requestId","functionResponseStatus":"$context.integration.status","integrationLatency":"$context.integration.latency","integrationServiceStatus":"$context.integration.integrationStatus","authorizeStatus":"$context.authorize.status","authorizerStatus":"$context.authorizer.status","authorizerLatency":"$context.authorizer.latency","authorizerRequestId":"$context.authorizer.requestId","ip":"$context.identity.sourceIp","userAgent":"$context.identity.userAgent","principalId":"$context.authorizer.principalId"}'
                },
                DeploymentId: {
                    Ref: 'pccprodtestrestapiDeploymentD4D92C416c9e2f9b752ad0a78ba19afedc420116'
                },
                MethodSettings: [
                    {
                        DataTraceEnabled: true,
                        HttpMethod: '*',
                        LoggingLevel: 'INFO',
                        MetricsEnabled: true,
                        ResourcePath: '/*'
                    }
                ],
                StageName: 'prod',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ]
            },
            DependsOn: ['pccprodtestrestapiAccount2BA720F6']
        },
        pccprodtestrestapiCustomDomain1B09C8D7: {
            Type: 'AWS::ApiGateway::DomainName',
            Properties: {
                DomainName: 'test.example.edu',
                EndpointConfiguration: {Types: ['REGIONAL']},
                RegionalCertificateArn: {
                    'Fn::GetAtt': [
                        'pccprodtesttestexampleedudefaultCertificateRequestorResource5C09FF4B',
                        'Arn'
                    ]
                },
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ]
            }
        },
        pccprodtestrestapiCustomDomainMappccsharedtestpccprodteststagepccprodtestpccprodtestrestapiFD28EDAE797436B5: {
            Type: 'AWS::ApiGateway::BasePathMapping',
            Properties: {
                DomainName: {Ref: 'pccprodtestrestapiCustomDomain1B09C8D7'},
                RestApiId: {Ref: 'pccprodtestrestapiFDFF2D0E'},
                Stage: {Ref: 'pccprodtestrestapiDeploymentStageprodDAE88F7E'}
            }
        },
        pccprodtestrestapiproxy1A8C0D6C: {
            Type: 'AWS::ApiGateway::Resource',
            Properties: {
                ParentId: {
                    'Fn::GetAtt': ['pccprodtestrestapiFDFF2D0E', 'RootResourceId']
                },
                PathPart: '{proxy+}',
                RestApiId: {Ref: 'pccprodtestrestapiFDFF2D0E'}
            }
        },
        pccprodtestrestapiproxyANYApiPermissionpccsharedtestpccprodteststagepccprodtestpccprodtestrestapiFD28EDAEANYproxy97D13096: {
            Type: 'AWS::Lambda::Permission',
            Properties: {
                Action: 'lambda:InvokeFunction',
                FunctionName: {'Fn::GetAtt': ['pccprodtestwebfn0B6D4CE6D', 'Arn']},
                Principal: 'apigateway.amazonaws.com',
                SourceArn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {Ref: 'AWS::Partition'},
                            ':execute-api:us-west-2:22222:',
                            {Ref: 'pccprodtestrestapiFDFF2D0E'},
                            '/',
                            {
                                Ref: 'pccprodtestrestapiDeploymentStageprodDAE88F7E'
                            },
                            '/*/*'
                        ]
                    ]
                }
            }
        },
        pccprodtestrestapiproxyANYApiPermissionTestpccsharedtestpccprodteststagepccprodtestpccprodtestrestapiFD28EDAEANYproxyBAD0336B: {
            Type: 'AWS::Lambda::Permission',
            Properties: {
                Action: 'lambda:InvokeFunction',
                FunctionName: {'Fn::GetAtt': ['pccprodtestwebfn0B6D4CE6D', 'Arn']},
                Principal: 'apigateway.amazonaws.com',
                SourceArn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {Ref: 'AWS::Partition'},
                            ':execute-api:us-west-2:22222:',
                            {Ref: 'pccprodtestrestapiFDFF2D0E'},
                            '/test-invoke-stage/*/*'
                        ]
                    ]
                }
            }
        },
        pccprodtestrestapiproxyANY3101E90C: {
            Type: 'AWS::ApiGateway::Method',
            Properties: {
                HttpMethod: 'ANY',
                ResourceId: {Ref: 'pccprodtestrestapiproxy1A8C0D6C'},
                RestApiId: {Ref: 'pccprodtestrestapiFDFF2D0E'},
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
                                    'Fn::GetAtt': ['pccprodtestwebfn0B6D4CE6D', 'Arn']
                                },
                                '/invocations'
                            ]
                        ]
                    }
                }
            }
        },
        pccprodtestrestapiANYApiPermissionpccsharedtestpccprodteststagepccprodtestpccprodtestrestapiFD28EDAEANYFEAAFEFE: {
            Type: 'AWS::Lambda::Permission',
            Properties: {
                Action: 'lambda:InvokeFunction',
                FunctionName: {'Fn::GetAtt': ['pccprodtestwebfn0B6D4CE6D', 'Arn']},
                Principal: 'apigateway.amazonaws.com',
                SourceArn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {Ref: 'AWS::Partition'},
                            ':execute-api:us-west-2:22222:',
                            {Ref: 'pccprodtestrestapiFDFF2D0E'},
                            '/',
                            {
                                Ref: 'pccprodtestrestapiDeploymentStageprodDAE88F7E'
                            },
                            '/*/'
                        ]
                    ]
                }
            }
        },
        pccprodtestrestapiANYApiPermissionTestpccsharedtestpccprodteststagepccprodtestpccprodtestrestapiFD28EDAEANYFF2E318E: {
            Type: 'AWS::Lambda::Permission',
            Properties: {
                Action: 'lambda:InvokeFunction',
                FunctionName: {'Fn::GetAtt': ['pccprodtestwebfn0B6D4CE6D', 'Arn']},
                Principal: 'apigateway.amazonaws.com',
                SourceArn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {Ref: 'AWS::Partition'},
                            ':execute-api:us-west-2:22222:',
                            {Ref: 'pccprodtestrestapiFDFF2D0E'},
                            '/test-invoke-stage/*/'
                        ]
                    ]
                }
            }
        },
        pccprodtestrestapiANYDE5B4726: {
            Type: 'AWS::ApiGateway::Method',
            Properties: {
                HttpMethod: 'ANY',
                ResourceId: {
                    'Fn::GetAtt': ['pccprodtestrestapiFDFF2D0E', 'RootResourceId']
                },
                RestApiId: {Ref: 'pccprodtestrestapiFDFF2D0E'},
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
                                    'Fn::GetAtt': ['pccprodtestwebfn0B6D4CE6D', 'Arn']
                                },
                                '/invocations'
                            ]
                        ]
                    }
                }
            }
        },
        pccprodtestrestapialarmtopic5D40EF12: {
            Type: 'AWS::SNS::Topic',
            Properties: {
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ]
            }
        },
        pccprodtestrestapialarmtopicprodexampleeduD8356F29: {
            Type: 'AWS::SNS::Subscription',
            Properties: {
                Protocol: 'email',
                TopicArn: {Ref: 'pccprodtestrestapialarmtopic5D40EF12'},
                Endpoint: 'prod@example.edu'
            }
        },
        pccprodtestrestapiservererroralarmCCCA44FD: {
            Type: 'AWS::CloudWatch::Alarm',
            Properties: {
                ComparisonOperator: 'GreaterThanOrEqualToThreshold',
                EvaluationPeriods: 1,
                AlarmActions: [{Ref: 'pccprodtestrestapialarmtopic5D40EF12'}],
                Dimensions: [{Name: 'ApiName', Value: 'pcc-prod-test-rest-api'}],
                MetricName: '5XXError',
                Namespace: 'AWS/ApiGateway',
                OKActions: [{Ref: 'pccprodtestrestapialarmtopic5D40EF12'}],
                Period: 300,
                Statistic: 'Sum',
                Threshold: 5,
                TreatMissingData: 'notBreaching'
            }
        },
        pccprodtestrestapiclienterroralarmF935D535: {
            Type: 'AWS::CloudWatch::Alarm',
            Properties: {
                ComparisonOperator: 'GreaterThanOrEqualToThreshold',
                EvaluationPeriods: 1,
                AlarmActions: [{Ref: 'pccprodtestrestapialarmtopic5D40EF12'}],
                Dimensions: [{Name: 'ApiName', Value: 'pcc-prod-test-rest-api'}],
                MetricName: '4XXError',
                Namespace: 'AWS/ApiGateway',
                OKActions: [{Ref: 'pccprodtestrestapialarmtopic5D40EF12'}],
                Period: 300,
                Statistic: 'Sum',
                Threshold: 5,
                TreatMissingData: 'notBreaching'
            }
        },
        pccprodtestrestapicountalarm373576A7: {
            Type: 'AWS::CloudWatch::Alarm',
            Properties: {
                ComparisonOperator: 'GreaterThanOrEqualToThreshold',
                EvaluationPeriods: 1,
                AlarmActions: [{Ref: 'pccprodtestrestapialarmtopic5D40EF12'}],
                Dimensions: [{Name: 'ApiName', Value: 'pcc-prod-test-rest-api'}],
                MetricName: 'Count',
                Namespace: 'AWS/ApiGateway',
                OKActions: [{Ref: 'pccprodtestrestapialarmtopic5D40EF12'}],
                Period: 300,
                Statistic: 'SampleCount',
                Threshold: 500,
                TreatMissingData: 'notBreaching'
            }
        },
        pccprodtestassetsEFBAF31D: {
            Type: 'AWS::S3::Bucket',
            Properties: {
                BucketEncryption: {
                    ServerSideEncryptionConfiguration: [
                        {
                            ServerSideEncryptionByDefault: {SSEAlgorithm: 'AES256'}
                        }
                    ]
                },
                BucketName: 'pcc-prod-test-assets',
                PublicAccessBlockConfiguration: {
                    BlockPublicAcls: true,
                    BlockPublicPolicy: true,
                    IgnorePublicAcls: true,
                    RestrictPublicBuckets: true
                },
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'aws-cdk:cr-owned:assets:15be1f63', Value: 'true'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ]
            },
            UpdateReplacePolicy: 'Retain',
            DeletionPolicy: 'Retain'
        },
        pccprodtestassetsPolicy43812EE5: {
            Type: 'AWS::S3::BucketPolicy',
            Properties: {
                Bucket: {Ref: 'pccprodtestassetsEFBAF31D'},
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 's3:*',
                            Condition: {Bool: {'aws:SecureTransport': 'false'}},
                            Effect: 'Deny',
                            Principal: {AWS: '*'},
                            Resource: [
                                {
                                    'Fn::GetAtt': ['pccprodtestassetsEFBAF31D', 'Arn']
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': ['pccprodtestassetsEFBAF31D', 'Arn']
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
                                        'pccprodtestcfdistOrigin2S3Origin62B417D8',
                                        'S3CanonicalUserId'
                                    ]
                                }
                            },
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        {
                                            'Fn::GetAtt': ['pccprodtestassetsEFBAF31D', 'Arn']
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
                                        'pccprodtestcfdistOrigin3S3Origin181B9166',
                                        'S3CanonicalUserId'
                                    ]
                                }
                            },
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        {
                                            'Fn::GetAtt': ['pccprodtestassetsEFBAF31D', 'Arn']
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
                    S3Bucket: 'cdk-hnb659fds-assets-22222-us-west-2',
                    S3Key: '731f24951dbe4e08bfc519dd7c23a4f7158528bd5557e38437b08292ab2a873c.zip'
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
                    '4dd7b3acb0d8c02094bb424ce803d0e3418f6db703e9524905cb0d32ff66b78b.zip'
                ],
                DestinationBucketName: {Ref: 'pccprodtestassetsEFBAF31D'},
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
                                    'Fn::GetAtt': ['pccprodtestassetsEFBAF31D', 'Arn']
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': ['pccprodtestassetsEFBAF31D', 'Arn']
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
        pccprodtestoriginrequestpolicyEFFFF1EE: {
            Type: 'AWS::CloudFront::OriginRequestPolicy',
            Properties: {
                OriginRequestPolicyConfig: {
                    CookiesConfig: {CookieBehavior: 'all'},
                    HeadersConfig: {
                        HeaderBehavior: 'allViewerAndWhitelistCloudFront',
                        Headers: ['CloudFront-Viewer-Address']
                    },
                    Name: 'pcc-prod-test-origin-request-policy',
                    QueryStringsConfig: {QueryStringBehavior: 'all'}
                }
            }
        },
        pccprodtestcfdistE17F313E: {
            Type: 'AWS::CloudFront::Distribution',
            Properties: {
                DistributionConfig: {
                    Aliases: ['test.example.edu'],
                    CacheBehaviors: [
                        {
                            CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
                            Compress: true,
                            PathPattern: 'assets/*',
                            TargetOriginId: 'pccsharedtestpccprodteststagepccprodtestpccprodtestcfdistOrigin2EFA5D6B6',
                            ViewerProtocolPolicy: 'redirect-to-https'
                        },
                        {
                            CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
                            Compress: true,
                            PathPattern: '/favicon.ico',
                            TargetOriginId: 'pccsharedtestpccprodteststagepccprodtestpccprodtestcfdistOrigin35AE50698',
                            ViewerProtocolPolicy: 'redirect-to-https'
                        },
                        {
                            CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
                            Compress: true,
                            PathPattern: '/robots.txt',
                            TargetOriginId: 'pccsharedtestpccprodteststagepccprodtestpccprodtestcfdistOrigin35AE50698',
                            ViewerProtocolPolicy: 'redirect-to-https'
                        }
                    ],
                    Comment: 'pcc-prod-test-cf-dist',
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
                        OriginRequestPolicyId: {Ref: 'pccprodtestoriginrequestpolicyEFFFF1EE'},
                        ResponseHeadersPolicyId: '67f7725c-6f97-4210-82d7-5512b31e9d03',
                        TargetOriginId: 'pccsharedtestpccprodteststagepccprodtestpccprodtestcfdistOrigin190C3EBC6',
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
                                                        {Ref: 'pccprodtestrestapiFDFF2D0E'},
                                                        '.execute-api.us-west-2.',
                                                        {Ref: 'AWS::URLSuffix'},
                                                        '/',
                                                        {
                                                            Ref: 'pccprodtestrestapiDeploymentStageprodDAE88F7E'
                                                        },
                                                        '/'
                                                    ]
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            Id: 'pccsharedtestpccprodteststagepccprodtestpccprodtestcfdistOrigin190C3EBC6',
                            OriginCustomHeaders: [
                                {
                                    HeaderName: 'x-auth-token',
                                    HeaderValue: '{{resolve:secretsmanager:arn:aws:secretsmanager:us-west-2:33333:secret:pcc-prod-test-secrets/environment-ABC123:SecretString:AUTHORIZER_TOKEN::}}'
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
                                                                        Ref: 'pccprodtestrestapiFDFF2D0E'
                                                                    },
                                                                    '.execute-api.us-west-2.',
                                                                    {Ref: 'AWS::URLSuffix'},
                                                                    '/',
                                                                    {
                                                                        Ref: 'pccprodtestrestapiDeploymentStageprodDAE88F7E'
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
                                'Fn::GetAtt': ['pccprodtestassetsEFBAF31D', 'RegionalDomainName']
                            },
                            Id: 'pccsharedtestpccprodteststagepccprodtestpccprodtestcfdistOrigin2EFA5D6B6',
                            S3OriginConfig: {
                                OriginAccessIdentity: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'origin-access-identity/cloudfront/',
                                            {
                                                Ref: 'pccprodtestcfdistOrigin2S3Origin62B417D8'
                                            }
                                        ]
                                    ]
                                }
                            }
                        },
                        {
                            DomainName: {
                                'Fn::GetAtt': ['pccprodtestassetsEFBAF31D', 'RegionalDomainName']
                            },
                            Id: 'pccsharedtestpccprodteststagepccprodtestpccprodtestcfdistOrigin35AE50698',
                            OriginPath: '/assets',
                            S3OriginConfig: {
                                OriginAccessIdentity: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'origin-access-identity/cloudfront/',
                                            {
                                                Ref: 'pccprodtestcfdistOrigin3S3Origin181B9166'
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
                                'pccprodtesttestexampleeduuseast1CertificateRequestorResourceE93815B2',
                                'Arn'
                            ]
                        },
                        MinimumProtocolVersion: 'TLSv1.2_2019',
                        SslSupportMethod: 'sni-only'
                    },
                    WebACLId: 'arn:aws:wafv2:us-east-1:12344:global/webacl/webacl-prod'
                },
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ]
            }
        },
        pccprodtestcfdistOrigin2S3Origin62B417D8: {
            Type: 'AWS::CloudFront::CloudFrontOriginAccessIdentity',
            Properties: {
                CloudFrontOriginAccessIdentityConfig: {
                    Comment: 'Identity for pccsharedtestpccprodteststagepccprodtestpccprodtestcfdistOrigin2EFA5D6B6'
                }
            }
        },
        pccprodtestcfdistOrigin3S3Origin181B9166: {
            Type: 'AWS::CloudFront::CloudFrontOriginAccessIdentity',
            Properties: {
                CloudFrontOriginAccessIdentityConfig: {
                    Comment: 'Identity for pccsharedtestpccprodteststagepccprodtestpccprodtestcfdistOrigin35AE50698'
                }
            }
        },
        pccprodtesttestexampleeduarecord3CF5C63C: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                Name: 'test.example.edu.',
                Type: 'A',
                AliasTarget: {
                    DNSName: {
                        'Fn::GetAtt': ['pccprodtestcfdistE17F313E', 'DomainName']
                    },
                    HostedZoneId: {
                        'Fn::FindInMap': [
                            'AWSCloudFrontPartitionHostedZoneIdMap',
                            {Ref: 'AWS::Partition'},
                            'zoneId'
                        ]
                    }
                },
                Comment: 'pcc-prod-test: test.example.edu',
                HostedZoneId: 'DUMMY'
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
                Name: '_amazonses.test.example.edu.',
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
                                        'pccprodtestsesverifytestVerifyDomainIdentityB3C4D659',
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
                Type: 'CNAME',
                HostedZoneId: 'DUMMY',
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
                TTL: '1800'
            },
            DependsOn: [
                'pccprodtestsesverifytestVerifyDomainDkimCustomResourcePolicyAA33B787',
                'pccprodtestsesverifytestVerifyDomainDkim5FC89C53'
            ]
        },
        pccprodtestsesverifytestSesDkimVerificationRecord1F83632A1: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
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
                Type: 'CNAME',
                HostedZoneId: 'DUMMY',
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
                TTL: '1800'
            },
            DependsOn: [
                'pccprodtestsesverifytestVerifyDomainDkimCustomResourcePolicyAA33B787',
                'pccprodtestsesverifytestVerifyDomainDkim5FC89C53'
            ]
        },
        pccprodtestsesverifytestSesDkimVerificationRecord27126929F: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
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
                Type: 'CNAME',
                HostedZoneId: 'DUMMY',
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
                TTL: '1800'
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
                    S3Key: '6dbd112fe448437b3438da4382c72fccbb7d2ee1543db222620d7447fffebc50.zip'
                },
                Role: {
                    'Fn::GetAtt': [
                        'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2',
                        'Arn'
                    ]
                },
                Handler: 'index.handler',
                Runtime: 'nodejs14.x',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ],
                Timeout: 120
            },
            DependsOn: ['AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2']
        }
    },
    Outputs: {
        pccprodtestrestapiEndpointCC100E89: {
            Value: {
                'Fn::Join': [
                    '',
                    [
                        'https://',
                        {Ref: 'pccprodtestrestapiFDFF2D0E'},
                        '.execute-api.us-west-2.',
                        {Ref: 'AWS::URLSuffix'},
                        '/',
                        {Ref: 'pccprodtestrestapiDeploymentStageprodDAE88F7E'},
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