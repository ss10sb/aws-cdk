module.exports = {
    Resources: {
        pccsdlctestcacheFE02D1F3: {
            Type: 'AWS::DynamoDB::Table',
            Properties: {
                KeySchema: [{AttributeName: 'key', KeyType: 'HASH'}],
                AttributeDefinitions: [{AttributeName: 'key', AttributeType: 'S'}],
                BillingMode: 'PAY_PER_REQUEST',
                SSESpecification: {SSEEnabled: true},
                TableName: 'pcc-sdlc-test-cache',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlctesttestsdlcexampleeduuseast1CertificateRequestorFunctionServiceRole6433EA0B: {
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
        pccsdlctesttestsdlcexampleeduuseast1CertificateRequestorFunctionServiceRoleDefaultPolicyD40D1EA4: {
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
                PolicyName: 'pccsdlctesttestsdlcexampleeduuseast1CertificateRequestorFunctionServiceRoleDefaultPolicyD40D1EA4',
                Roles: [
                    {
                        Ref: 'pccsdlctesttestsdlcexampleeduuseast1CertificateRequestorFunctionServiceRole6433EA0B'
                    }
                ]
            }
        },
        pccsdlctesttestsdlcexampleeduuseast1CertificateRequestorFunction52773115: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-11111-us-west-2',
                    S3Key: 'e85f10a8bf0e7f4f7931fce24b29d4faf6874948090a2b568b2da33a7116cf84.zip'
                },
                Role: {
                    'Fn::GetAtt': [
                        'pccsdlctesttestsdlcexampleeduuseast1CertificateRequestorFunctionServiceRole6433EA0B',
                        'Arn'
                    ]
                },
                Handler: 'index.certificateRequestHandler',
                Runtime: 'nodejs14.x',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                Timeout: 900
            },
            DependsOn: [
                'pccsdlctesttestsdlcexampleeduuseast1CertificateRequestorFunctionServiceRoleDefaultPolicyD40D1EA4',
                'pccsdlctesttestsdlcexampleeduuseast1CertificateRequestorFunctionServiceRole6433EA0B'
            ]
        },
        pccsdlctesttestsdlcexampleeduuseast1CertificateRequestorResource19802A88: {
            Type: 'AWS::CloudFormation::CustomResource',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': [
                        'pccsdlctesttestsdlcexampleeduuseast1CertificateRequestorFunction52773115',
                        'Arn'
                    ]
                },
                DomainName: 'test.sdlc.example.edu',
                HostedZoneId: 'DUMMY',
                Region: 'us-east-1',
                CleanupRecords: 'true',
                Tags: {App: 'test', College: 'PCC', Environment: 'sdlc'}
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
                    S3Key: 'a701d9c4e1414bfb5bdc604564a232c79e82fa1c4186ebc7245836fb15ee2c49.zip'
                },
                Role: {
                    'Fn::GetAtt': ['pccsdlctestwebfn0ServiceRoleBF73EA7E', 'Arn']
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
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                Timeout: 28,
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
        pccsdlctestwebfn0LogRetention7C256B9B: {
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
                        ['/aws/lambda/', {Ref: 'pccsdlctestwebfn051C9C4DD'}]
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
                    S3Bucket: 'cdk-hnb659fds-assets-11111-us-west-2',
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
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            },
            DependsOn: [
                'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRoleDefaultPolicyADDA7DEB',
                'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB'
            ]
        },
        pccsdlctesttestsdlcexampleedudefaultCertificateRequestorFunctionServiceRole663011D6: {
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
        pccsdlctesttestsdlcexampleedudefaultCertificateRequestorFunctionServiceRoleDefaultPolicy2264B181: {
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
                PolicyName: 'pccsdlctesttestsdlcexampleedudefaultCertificateRequestorFunctionServiceRoleDefaultPolicy2264B181',
                Roles: [
                    {
                        Ref: 'pccsdlctesttestsdlcexampleedudefaultCertificateRequestorFunctionServiceRole663011D6'
                    }
                ]
            }
        },
        pccsdlctesttestsdlcexampleedudefaultCertificateRequestorFunctionB1E51451: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-11111-us-west-2',
                    S3Key: 'e85f10a8bf0e7f4f7931fce24b29d4faf6874948090a2b568b2da33a7116cf84.zip'
                },
                Role: {
                    'Fn::GetAtt': [
                        'pccsdlctesttestsdlcexampleedudefaultCertificateRequestorFunctionServiceRole663011D6',
                        'Arn'
                    ]
                },
                Handler: 'index.certificateRequestHandler',
                Runtime: 'nodejs14.x',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                Timeout: 900
            },
            DependsOn: [
                'pccsdlctesttestsdlcexampleedudefaultCertificateRequestorFunctionServiceRoleDefaultPolicy2264B181',
                'pccsdlctesttestsdlcexampleedudefaultCertificateRequestorFunctionServiceRole663011D6'
            ]
        },
        pccsdlctesttestsdlcexampleedudefaultCertificateRequestorResource9147F058: {
            Type: 'AWS::CloudFormation::CustomResource',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': [
                        'pccsdlctesttestsdlcexampleedudefaultCertificateRequestorFunctionB1E51451',
                        'Arn'
                    ]
                },
                DomainName: 'test.sdlc.example.edu',
                HostedZoneId: 'DUMMY',
                CleanupRecords: 'true',
                Tags: {App: 'test', College: 'PCC', Environment: 'sdlc'}
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlctestauthorizerfnServiceRole7F5FF31D: {
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
        pccsdlctestauthorizerfnServiceRoleDefaultPolicyB4E147EB: {
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
                PolicyName: 'pccsdlctestauthorizerfnServiceRoleDefaultPolicyB4E147EB',
                Roles: [{Ref: 'pccsdlctestauthorizerfnServiceRole7F5FF31D'}]
            }
        },
        pccsdlctestauthorizerfnB9B5C7F9: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-11111-us-west-2',
                    S3Key: 'c53d3eefd84eda81ec21cae72089e12b7729368cb85e86fc9fb8b2031b76415b.zip'
                },
                Role: {
                    'Fn::GetAtt': ['pccsdlctestauthorizerfnServiceRole7F5FF31D', 'Arn']
                },
                Environment: {
                    Variables: {
                        AUTHORIZER_TOKEN: {
                            'Fn::Join': [
                                '',
                                [
                                    '{{resolve:secretsmanager:arn:',
                                    {Ref: 'AWS::Partition'},
                                    ':secretsmanager:us-west-2:11111:secret:pcc-sdlc-test-secrets/environment:SecretString:AUTHORIZER_TOKEN::}}'
                                ]
                            ]
                        }
                    }
                },
                FunctionName: 'pcc-sdlc-test-authorizer-fn',
                Handler: 'token.handler',
                Runtime: 'nodejs16.x',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                Timeout: 5
            },
            DependsOn: [
                'pccsdlctestauthorizerfnServiceRoleDefaultPolicyB4E147EB',
                'pccsdlctestauthorizerfnServiceRole7F5FF31D'
            ]
        },
        pccsdlctestauthorizerfnLogRetention52D501C3: {
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
                            {Ref: 'pccsdlctestauthorizerfnB9B5C7F9'}
                        ]
                    ]
                },
                RetentionInDays: 7
            }
        },
        pccsdlctestrestapiAAD4F80F: {
            Type: 'AWS::ApiGateway::RestApi',
            Properties: {
                DisableExecuteApiEndpoint: false,
                EndpointConfiguration: {Types: ['REGIONAL']},
                Name: 'pcc-sdlc-test-rest-api',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlctestrestapiCloudWatchRole4CBB2768: {
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
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            },
            UpdateReplacePolicy: 'Retain',
            DeletionPolicy: 'Retain'
        },
        pccsdlctestrestapiAccount89F9E43A: {
            Type: 'AWS::ApiGateway::Account',
            Properties: {
                CloudWatchRoleArn: {
                    'Fn::GetAtt': ['pccsdlctestrestapiCloudWatchRole4CBB2768', 'Arn']
                }
            },
            DependsOn: ['pccsdlctestrestapiAAD4F80F'],
            UpdateReplacePolicy: 'Retain',
            DeletionPolicy: 'Retain'
        },
        pccsdlctestrestapiDeployment337567643bd0c4be1bef1770a92f5e8ff453a9c1: {
            Type: 'AWS::ApiGateway::Deployment',
            Properties: {
                RestApiId: {Ref: 'pccsdlctestrestapiAAD4F80F'},
                Description: 'Automatically created by the RestApi construct'
            },
            DependsOn: [
                'pccsdlctestrestapiproxyANYF54AF509',
                'pccsdlctestrestapiproxy36BCA665',
                'pccsdlctestrestapiANY725240DF'
            ]
        },
        pccsdlctestrestapiDeploymentStageprodD1FB4446: {
            Type: 'AWS::ApiGateway::Stage',
            Properties: {
                RestApiId: {Ref: 'pccsdlctestrestapiAAD4F80F'},
                DeploymentId: {
                    Ref: 'pccsdlctestrestapiDeployment337567643bd0c4be1bef1770a92f5e8ff453a9c1'
                },
                StageName: 'prod',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            },
            DependsOn: ['pccsdlctestrestapiAccount89F9E43A']
        },
        pccsdlctestrestapiCustomDomain0F7920B7: {
            Type: 'AWS::ApiGateway::DomainName',
            Properties: {
                DomainName: 'test.sdlc.example.edu',
                EndpointConfiguration: {Types: ['REGIONAL']},
                RegionalCertificateArn: {
                    'Fn::GetAtt': [
                        'pccsdlctesttestsdlcexampleedudefaultCertificateRequestorResource9147F058',
                        'Arn'
                    ]
                },
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlctestrestapiCustomDomainMappccsharedtestpccsdlcteststagepccsdlctestpccsdlctestrestapiE219ED1F08A2A994: {
            Type: 'AWS::ApiGateway::BasePathMapping',
            Properties: {
                DomainName: {Ref: 'pccsdlctestrestapiCustomDomain0F7920B7'},
                RestApiId: {Ref: 'pccsdlctestrestapiAAD4F80F'},
                Stage: {Ref: 'pccsdlctestrestapiDeploymentStageprodD1FB4446'}
            }
        },
        pccsdlctestrestapiproxy36BCA665: {
            Type: 'AWS::ApiGateway::Resource',
            Properties: {
                ParentId: {
                    'Fn::GetAtt': ['pccsdlctestrestapiAAD4F80F', 'RootResourceId']
                },
                PathPart: '{proxy+}',
                RestApiId: {Ref: 'pccsdlctestrestapiAAD4F80F'}
            }
        },
        pccsdlctestrestapiproxyANYApiPermissionpccsharedtestpccsdlcteststagepccsdlctestpccsdlctestrestapiE219ED1FANYproxyA88A9ECD: {
            Type: 'AWS::Lambda::Permission',
            Properties: {
                Action: 'lambda:InvokeFunction',
                FunctionName: {'Fn::GetAtt': ['pccsdlctestwebfn051C9C4DD', 'Arn']},
                Principal: 'apigateway.amazonaws.com',
                SourceArn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {Ref: 'AWS::Partition'},
                            ':execute-api:us-west-2:11111:',
                            {Ref: 'pccsdlctestrestapiAAD4F80F'},
                            '/',
                            {
                                Ref: 'pccsdlctestrestapiDeploymentStageprodD1FB4446'
                            },
                            '/*/*'
                        ]
                    ]
                }
            }
        },
        pccsdlctestrestapiproxyANYApiPermissionTestpccsharedtestpccsdlcteststagepccsdlctestpccsdlctestrestapiE219ED1FANYproxyA2B60C32: {
            Type: 'AWS::Lambda::Permission',
            Properties: {
                Action: 'lambda:InvokeFunction',
                FunctionName: {'Fn::GetAtt': ['pccsdlctestwebfn051C9C4DD', 'Arn']},
                Principal: 'apigateway.amazonaws.com',
                SourceArn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {Ref: 'AWS::Partition'},
                            ':execute-api:us-west-2:11111:',
                            {Ref: 'pccsdlctestrestapiAAD4F80F'},
                            '/test-invoke-stage/*/*'
                        ]
                    ]
                }
            }
        },
        pccsdlctestrestapiproxyANYF54AF509: {
            Type: 'AWS::ApiGateway::Method',
            Properties: {
                HttpMethod: 'ANY',
                ResourceId: {Ref: 'pccsdlctestrestapiproxy36BCA665'},
                RestApiId: {Ref: 'pccsdlctestrestapiAAD4F80F'},
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
                                    'Fn::GetAtt': ['pccsdlctestwebfn051C9C4DD', 'Arn']
                                },
                                '/invocations'
                            ]
                        ]
                    }
                }
            }
        },
        pccsdlctestrestapiANYApiPermissionpccsharedtestpccsdlcteststagepccsdlctestpccsdlctestrestapiE219ED1FANYAD438E9F: {
            Type: 'AWS::Lambda::Permission',
            Properties: {
                Action: 'lambda:InvokeFunction',
                FunctionName: {'Fn::GetAtt': ['pccsdlctestwebfn051C9C4DD', 'Arn']},
                Principal: 'apigateway.amazonaws.com',
                SourceArn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {Ref: 'AWS::Partition'},
                            ':execute-api:us-west-2:11111:',
                            {Ref: 'pccsdlctestrestapiAAD4F80F'},
                            '/',
                            {
                                Ref: 'pccsdlctestrestapiDeploymentStageprodD1FB4446'
                            },
                            '/*/'
                        ]
                    ]
                }
            }
        },
        pccsdlctestrestapiANYApiPermissionTestpccsharedtestpccsdlcteststagepccsdlctestpccsdlctestrestapiE219ED1FANYC9C4A07A: {
            Type: 'AWS::Lambda::Permission',
            Properties: {
                Action: 'lambda:InvokeFunction',
                FunctionName: {'Fn::GetAtt': ['pccsdlctestwebfn051C9C4DD', 'Arn']},
                Principal: 'apigateway.amazonaws.com',
                SourceArn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {Ref: 'AWS::Partition'},
                            ':execute-api:us-west-2:11111:',
                            {Ref: 'pccsdlctestrestapiAAD4F80F'},
                            '/test-invoke-stage/*/'
                        ]
                    ]
                }
            }
        },
        pccsdlctestrestapiANY725240DF: {
            Type: 'AWS::ApiGateway::Method',
            Properties: {
                HttpMethod: 'ANY',
                ResourceId: {
                    'Fn::GetAtt': ['pccsdlctestrestapiAAD4F80F', 'RootResourceId']
                },
                RestApiId: {Ref: 'pccsdlctestrestapiAAD4F80F'},
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
                                    'Fn::GetAtt': ['pccsdlctestwebfn051C9C4DD', 'Arn']
                                },
                                '/invocations'
                            ]
                        ]
                    }
                }
            }
        },
        pccsdlctestrestapialarmtopic04851A3F: {
            Type: 'AWS::SNS::Topic',
            Properties: {
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlctestrestapialarmtopicsdlcexampleedu4EDE660E: {
            Type: 'AWS::SNS::Subscription',
            Properties: {
                Protocol: 'email',
                TopicArn: {Ref: 'pccsdlctestrestapialarmtopic04851A3F'},
                Endpoint: 'sdlc@example.edu'
            }
        },
        pccsdlctestrestapiservererroralarm532DFBD6: {
            Type: 'AWS::CloudWatch::Alarm',
            Properties: {
                ComparisonOperator: 'GreaterThanOrEqualToThreshold',
                EvaluationPeriods: 1,
                AlarmActions: [{Ref: 'pccsdlctestrestapialarmtopic04851A3F'}],
                Dimensions: [{Name: 'ApiName', Value: 'pcc-sdlc-test-rest-api'}],
                MetricName: '5XXError',
                Namespace: 'AWS/ApiGateway',
                OKActions: [{Ref: 'pccsdlctestrestapialarmtopic04851A3F'}],
                Period: 300,
                Statistic: 'Sum',
                Threshold: 5,
                TreatMissingData: 'notBreaching'
            }
        },
        pccsdlctestrestapiclienterroralarm5F582179: {
            Type: 'AWS::CloudWatch::Alarm',
            Properties: {
                ComparisonOperator: 'GreaterThanOrEqualToThreshold',
                EvaluationPeriods: 1,
                AlarmActions: [{Ref: 'pccsdlctestrestapialarmtopic04851A3F'}],
                Dimensions: [{Name: 'ApiName', Value: 'pcc-sdlc-test-rest-api'}],
                MetricName: '4XXError',
                Namespace: 'AWS/ApiGateway',
                OKActions: [{Ref: 'pccsdlctestrestapialarmtopic04851A3F'}],
                Period: 300,
                Statistic: 'Sum',
                Threshold: 5,
                TreatMissingData: 'notBreaching'
            }
        },
        pccsdlctestrestapicountalarm39FE1A18: {
            Type: 'AWS::CloudWatch::Alarm',
            Properties: {
                ComparisonOperator: 'GreaterThanOrEqualToThreshold',
                EvaluationPeriods: 1,
                AlarmActions: [{Ref: 'pccsdlctestrestapialarmtopic04851A3F'}],
                Dimensions: [{Name: 'ApiName', Value: 'pcc-sdlc-test-rest-api'}],
                MetricName: 'Count',
                Namespace: 'AWS/ApiGateway',
                OKActions: [{Ref: 'pccsdlctestrestapialarmtopic04851A3F'}],
                Period: 300,
                Statistic: 'SampleCount',
                Threshold: 500,
                TreatMissingData: 'notBreaching'
            }
        },
        pccsdlctestassets21EA24EB: {
            Type: 'AWS::S3::Bucket',
            Properties: {
                BucketEncryption: {
                    ServerSideEncryptionConfiguration: [
                        {
                            ServerSideEncryptionByDefault: {SSEAlgorithm: 'AES256'}
                        }
                    ]
                },
                BucketName: 'pcc-sdlc-test-assets',
                PublicAccessBlockConfiguration: {
                    BlockPublicAcls: true,
                    BlockPublicPolicy: true,
                    IgnorePublicAcls: true,
                    RestrictPublicBuckets: true
                },
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'aws-cdk:cr-owned:assets:50d04f65', Value: 'true'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            },
            UpdateReplacePolicy: 'Retain',
            DeletionPolicy: 'Retain'
        },
        pccsdlctestassetsPolicyC699C462: {
            Type: 'AWS::S3::BucketPolicy',
            Properties: {
                Bucket: {Ref: 'pccsdlctestassets21EA24EB'},
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 's3:*',
                            Condition: {Bool: {'aws:SecureTransport': 'false'}},
                            Effect: 'Deny',
                            Principal: {AWS: '*'},
                            Resource: [
                                {
                                    'Fn::GetAtt': ['pccsdlctestassets21EA24EB', 'Arn']
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': ['pccsdlctestassets21EA24EB', 'Arn']
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
                                        'pccsdlctestcfdistOrigin2S3OriginA8660DCA',
                                        'S3CanonicalUserId'
                                    ]
                                }
                            },
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        {
                                            'Fn::GetAtt': ['pccsdlctestassets21EA24EB', 'Arn']
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
                                        'pccsdlctestcfdistOrigin3S3Origin644D5457',
                                        'S3CanonicalUserId'
                                    ]
                                }
                            },
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        {
                                            'Fn::GetAtt': ['pccsdlctestassets21EA24EB', 'Arn']
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
                    S3Bucket: 'cdk-hnb659fds-assets-11111-us-west-2',
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
                SourceBucketNames: ['cdk-hnb659fds-assets-11111-us-west-2'],
                SourceObjectKeys: [
                    '4dd7b3acb0d8c02094bb424ce803d0e3418f6db703e9524905cb0d32ff66b78b.zip'
                ],
                DestinationBucketName: {Ref: 'pccsdlctestassets21EA24EB'},
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
                                            ':s3:::cdk-hnb659fds-assets-11111-us-west-2'
                                        ]
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':s3:::cdk-hnb659fds-assets-11111-us-west-2/*'
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
                                    'Fn::GetAtt': ['pccsdlctestassets21EA24EB', 'Arn']
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': ['pccsdlctestassets21EA24EB', 'Arn']
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
                    S3Bucket: 'cdk-hnb659fds-assets-11111-us-west-2',
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
        pccsdlctestoriginrequestpolicy4A546A08: {
            Type: 'AWS::CloudFront::OriginRequestPolicy',
            Properties: {
                OriginRequestPolicyConfig: {
                    CookiesConfig: {CookieBehavior: 'all'},
                    HeadersConfig: {
                        HeaderBehavior: 'allViewerAndWhitelistCloudFront',
                        Headers: ['CloudFront-Viewer-Address']
                    },
                    Name: 'pcc-sdlc-test-origin-request-policy',
                    QueryStringsConfig: {QueryStringBehavior: 'all'}
                }
            }
        },
        pccsdlctestcfdist9445C9A4: {
            Type: 'AWS::CloudFront::Distribution',
            Properties: {
                DistributionConfig: {
                    Aliases: ['test.sdlc.example.edu'],
                    CacheBehaviors: [
                        {
                            CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
                            Compress: true,
                            PathPattern: 'assets/*',
                            TargetOriginId: 'pccsharedtestpccsdlcteststagepccsdlctestpccsdlctestcfdistOrigin2CBF0808C',
                            ViewerProtocolPolicy: 'redirect-to-https'
                        },
                        {
                            CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
                            Compress: true,
                            PathPattern: '/favicon.ico',
                            TargetOriginId: 'pccsharedtestpccsdlcteststagepccsdlctestpccsdlctestcfdistOrigin3E083D5EF',
                            ViewerProtocolPolicy: 'redirect-to-https'
                        },
                        {
                            CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
                            Compress: true,
                            PathPattern: '/robots.txt',
                            TargetOriginId: 'pccsharedtestpccsdlcteststagepccsdlctestpccsdlctestcfdistOrigin3E083D5EF',
                            ViewerProtocolPolicy: 'redirect-to-https'
                        }
                    ],
                    Comment: 'pcc-sdlc-test-cf-dist',
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
                        OriginRequestPolicyId: {Ref: 'pccsdlctestoriginrequestpolicy4A546A08'},
                        ResponseHeadersPolicyId: '67f7725c-6f97-4210-82d7-5512b31e9d03',
                        TargetOriginId: 'pccsharedtestpccsdlcteststagepccsdlctestpccsdlctestcfdistOrigin15D802970',
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
                                                        {Ref: 'pccsdlctestrestapiAAD4F80F'},
                                                        '.execute-api.us-west-2.',
                                                        {Ref: 'AWS::URLSuffix'},
                                                        '/',
                                                        {
                                                            Ref: 'pccsdlctestrestapiDeploymentStageprodD1FB4446'
                                                        },
                                                        '/'
                                                    ]
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            Id: 'pccsharedtestpccsdlcteststagepccsdlctestpccsdlctestcfdistOrigin15D802970',
                            OriginCustomHeaders: [
                                {
                                    HeaderName: 'x-auth-token',
                                    HeaderValue: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                '{{resolve:secretsmanager:arn:',
                                                {Ref: 'AWS::Partition'},
                                                ':secretsmanager:us-west-2:11111:secret:pcc-sdlc-test-secrets/environment:SecretString:AUTHORIZER_TOKEN::}}'
                                            ]
                                        ]
                                    }
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
                                                                        Ref: 'pccsdlctestrestapiAAD4F80F'
                                                                    },
                                                                    '.execute-api.us-west-2.',
                                                                    {Ref: 'AWS::URLSuffix'},
                                                                    '/',
                                                                    {
                                                                        Ref: 'pccsdlctestrestapiDeploymentStageprodD1FB4446'
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
                                'Fn::GetAtt': ['pccsdlctestassets21EA24EB', 'RegionalDomainName']
                            },
                            Id: 'pccsharedtestpccsdlcteststagepccsdlctestpccsdlctestcfdistOrigin2CBF0808C',
                            S3OriginConfig: {
                                OriginAccessIdentity: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'origin-access-identity/cloudfront/',
                                            {
                                                Ref: 'pccsdlctestcfdistOrigin2S3OriginA8660DCA'
                                            }
                                        ]
                                    ]
                                }
                            }
                        },
                        {
                            DomainName: {
                                'Fn::GetAtt': ['pccsdlctestassets21EA24EB', 'RegionalDomainName']
                            },
                            Id: 'pccsharedtestpccsdlcteststagepccsdlctestpccsdlctestcfdistOrigin3E083D5EF',
                            OriginPath: '/assets',
                            S3OriginConfig: {
                                OriginAccessIdentity: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'origin-access-identity/cloudfront/',
                                            {
                                                Ref: 'pccsdlctestcfdistOrigin3S3Origin644D5457'
                                            }
                                        ]
                                    ]
                                }
                            }
                        }
                    ],
                    PriceClass: 'PriceClass_100',
                    Restrictions: {
                        GeoRestriction: {
                            Locations: [ 'RU', 'BY', 'CN' ],
                            RestrictionType: 'blacklist'
                        }
                    },
                    ViewerCertificate: {
                        AcmCertificateArn: {
                            'Fn::GetAtt': [
                                'pccsdlctesttestsdlcexampleeduuseast1CertificateRequestorResource19802A88',
                                'Arn'
                            ]
                        },
                        MinimumProtocolVersion: 'TLSv1.2_2019',
                        SslSupportMethod: 'sni-only'
                    },
                    WebACLId: 'arn:aws:wafv2:us-east-1:12344:global/webacl/webacl-sdlc'
                },
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlctestcfdistOrigin2S3OriginA8660DCA: {
            Type: 'AWS::CloudFront::CloudFrontOriginAccessIdentity',
            Properties: {
                CloudFrontOriginAccessIdentityConfig: {
                    Comment: 'Identity for pccsharedtestpccsdlcteststagepccsdlctestpccsdlctestcfdistOrigin2CBF0808C'
                }
            }
        },
        pccsdlctestcfdistOrigin3S3Origin644D5457: {
            Type: 'AWS::CloudFront::CloudFrontOriginAccessIdentity',
            Properties: {
                CloudFrontOriginAccessIdentityConfig: {
                    Comment: 'Identity for pccsharedtestpccsdlcteststagepccsdlctestpccsdlctestcfdistOrigin3E083D5EF'
                }
            }
        },
        pccsdlctestarecordtestsdlcexampleeduarecordDC640DAE: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                Name: 'test.sdlc.example.edu.',
                Type: 'A',
                AliasTarget: {
                    DNSName: {
                        'Fn::GetAtt': ['pccsdlctestcfdist9445C9A4', 'DomainName']
                    },
                    HostedZoneId: {
                        'Fn::FindInMap': [
                            'AWSCloudFrontPartitionHostedZoneIdMap',
                            {Ref: 'AWS::Partition'},
                            'zoneId'
                        ]
                    }
                },
                Comment: 'pcc-sdlc-test-arecord: test.sdlc.example.edu',
                HostedZoneId: 'DUMMY'
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
        pccsdlctestsesverifytestSesVerificationRecord44B46B12: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                Name: '_amazonses.test.sdlc.example.edu.',
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
                                        'pccsdlctestsesverifytestVerifyDomainIdentity1170B174',
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
                Type: 'CNAME',
                HostedZoneId: 'DUMMY',
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
                TTL: '1800'
            },
            DependsOn: [
                'pccsdlctestsesverifytestVerifyDomainDkimCustomResourcePolicy0B41BEC6',
                'pccsdlctestsesverifytestVerifyDomainDkimB9257EE5'
            ]
        },
        pccsdlctestsesverifytestSesDkimVerificationRecord1721DFA54: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
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
                Type: 'CNAME',
                HostedZoneId: 'DUMMY',
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
                TTL: '1800'
            },
            DependsOn: [
                'pccsdlctestsesverifytestVerifyDomainDkimCustomResourcePolicy0B41BEC6',
                'pccsdlctestsesverifytestVerifyDomainDkimB9257EE5'
            ]
        },
        pccsdlctestsesverifytestSesDkimVerificationRecord2D4DFE38C: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
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
                Type: 'CNAME',
                HostedZoneId: 'DUMMY',
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
                TTL: '1800'
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
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                Timeout: 120
            },
            DependsOn: ['AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2']
        }
    },
    Outputs: {
        pccsdlctestrestapiEndpoint3C65948E: {
            Value: {
                'Fn::Join': [
                    '',
                    [
                        'https://',
                        {Ref: 'pccsdlctestrestapiAAD4F80F'},
                        '.execute-api.us-west-2.',
                        {Ref: 'AWS::URLSuffix'},
                        '/',
                        {Ref: 'pccsdlctestrestapiDeploymentStageprodD1FB4446'},
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