const {MatchHelper} = require("../../src/utils/testing/match-helper");
module.exports = {
    Resources: {
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
        pccsdlctestdefaulttestsdlcexampleeduC912A0B0: {
            Type: 'AWS::CertificateManager::Certificate',
            Properties: {
                DomainName: 'test.sdlc.example.edu',
                DomainValidationOptions: [
                    {
                        DomainName: 'test.sdlc.example.edu',
                        HostedZoneId: 'DUMMY'
                    }
                ],
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'},
                    {
                        Key: 'Name',
                        Value: 'pcc-shared-test/pcc-sdlc-test-stage/pcc-sdlc-test/pcc-sdlc-test-default-test.sdlc.example.edu'
                    }
                ],
                ValidationMethod: 'DNS'
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
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
                    S3Key: MatchHelper.endsWith('zip')
                },
                Environment: {
                    Variables: {
                        MAIL_FROM_ADDRESS: 'no-reply@test.sdlc.example.edu',
                        IMPORTER_FROM: 'importer-no-reply@test.sdlc.example.edu',
                        DYNAMODB_CACHE_TABLE: {Ref: 'pccsdlctestcacheFE02D1F3'},
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
                        AWS_APP_NAME: 'pcc-sdlc-test',
                        CAN_RUN_CREATE: '0',
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
                FunctionName: 'pcc-sdlc-test-web-fn-0',
                Handler: 'public/index.php',
                Layers: [
                    {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                {Ref: 'AWS::Partition'},
                                ':lambda:us-west-2:534081306603:layer:php-81-fpm:59'
                            ]
                        ]
                    }
                ],
                LoggingConfig: {LogGroup: {Ref: 'pccsdlctestwebfn0lg4B926758'}},
                MemorySize: 512,
                Role: {
                    'Fn::GetAtt': ['pccsdlctestwebfn0ServiceRoleBF73EA7E', 'Arn']
                },
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
        pccsdlctestlocaltestsdlcexampleeduCD22174F: {
            Type: 'AWS::CertificateManager::Certificate',
            Properties: {
                DomainName: 'test.sdlc.example.edu',
                DomainValidationOptions: [
                    {
                        DomainName: 'test.sdlc.example.edu',
                        HostedZoneId: 'DUMMY'
                    }
                ],
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'},
                    {
                        Key: 'Name',
                        Value: 'pcc-shared-test/pcc-sdlc-test-stage/pcc-sdlc-test/pcc-sdlc-test-local-test.sdlc.example.edu'
                    }
                ],
                ValidationMethod: 'DNS'
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlctestauthorizerfnlg7CF1BC1E: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                RetentionInDays: 7,
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
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
                    S3Key: MatchHelper.endsWith('zip')
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
                LoggingConfig: {LogGroup: {Ref: 'pccsdlctestauthorizerfnlg7CF1BC1E'}},
                Role: {
                    'Fn::GetAtt': ['pccsdlctestauthorizerfnServiceRole7F5FF31D', 'Arn']
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
                'pccsdlctestauthorizerfnServiceRoleDefaultPolicyB4E147EB',
                'pccsdlctestauthorizerfnServiceRole7F5FF31D'
            ]
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
                Description: 'Automatically created by the RestApi construct',
                RestApiId: {Ref: 'pccsdlctestrestapiAAD4F80F'}
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
                DeploymentId: {
                    Ref: 'pccsdlctestrestapiDeployment337567643bd0c4be1bef1770a92f5e8ff453a9c1'
                },
                RestApiId: {Ref: 'pccsdlctestrestapiAAD4F80F'},
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
                RegionalCertificateArn: {Ref: 'pccsdlctestlocaltestsdlcexampleeduCD22174F'},
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
                AuthorizationType: 'CUSTOM',
                HttpMethod: 'ANY',
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
                },
                ResourceId: {Ref: 'pccsdlctestrestapiproxy36BCA665'},
                RestApiId: {Ref: 'pccsdlctestrestapiAAD4F80F'}
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
                AuthorizationType: 'CUSTOM',
                HttpMethod: 'ANY',
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
                },
                ResourceId: {
                    'Fn::GetAtt': ['pccsdlctestrestapiAAD4F80F', 'RootResourceId']
                },
                RestApiId: {Ref: 'pccsdlctestrestapiAAD4F80F'}
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
                Endpoint: 'sdlc@example.edu',
                Protocol: 'email',
                TopicArn: {Ref: 'pccsdlctestrestapialarmtopic04851A3F'}
            }
        },
        pccsdlctestrestapiservererroralarm532DFBD6: {
            Type: 'AWS::CloudWatch::Alarm',
            Properties: {
                AlarmActions: [{Ref: 'pccsdlctestrestapialarmtopic04851A3F'}],
                ComparisonOperator: 'GreaterThanOrEqualToThreshold',
                Dimensions: [{Name: 'ApiName', Value: 'pcc-sdlc-test-rest-api'}],
                EvaluationPeriods: 1,
                MetricName: '5XXError',
                Namespace: 'AWS/ApiGateway',
                OKActions: [{Ref: 'pccsdlctestrestapialarmtopic04851A3F'}],
                Period: 300,
                Statistic: 'Sum',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                Threshold: 5,
                TreatMissingData: 'notBreaching'
            }
        },
        pccsdlctestrestapiclienterroralarm5F582179: {
            Type: 'AWS::CloudWatch::Alarm',
            Properties: {
                AlarmActions: [{Ref: 'pccsdlctestrestapialarmtopic04851A3F'}],
                ComparisonOperator: 'GreaterThanOrEqualToThreshold',
                Dimensions: [{Name: 'ApiName', Value: 'pcc-sdlc-test-rest-api'}],
                EvaluationPeriods: 1,
                MetricName: '4XXError',
                Namespace: 'AWS/ApiGateway',
                OKActions: [{Ref: 'pccsdlctestrestapialarmtopic04851A3F'}],
                Period: 300,
                Statistic: 'Sum',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                Threshold: 5,
                TreatMissingData: 'notBreaching'
            }
        },
        pccsdlctestrestapicountalarm39FE1A18: {
            Type: 'AWS::CloudWatch::Alarm',
            Properties: {
                AlarmActions: [{Ref: 'pccsdlctestrestapialarmtopic04851A3F'}],
                ComparisonOperator: 'GreaterThanOrEqualToThreshold',
                Dimensions: [{Name: 'ApiName', Value: 'pcc-sdlc-test-rest-api'}],
                EvaluationPeriods: 1,
                MetricName: 'Count',
                Namespace: 'AWS/ApiGateway',
                OKActions: [{Ref: 'pccsdlctestrestapialarmtopic04851A3F'}],
                Period: 300,
                Statistic: 'SampleCount',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
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
                OwnershipControls: {Rules: [{ObjectOwnership: 'BucketOwnerEnforced'}]},
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
                    Condition: {
                      StringEquals: {
                        'AWS:SourceArn': {
                                'Fn::Join': [
                                    '',
                                    [
                              'arn:',
                              { Ref: 'AWS::Partition' },
                              ':cloudfront::',
                              { Ref: 'AWS::AccountId' },
                              ':distribution/',
                              { Ref: 'pccsdlctestcfdist9445C9A4' }
                                    ]
                                ]
                            }
                      }
                        },
                            Effect: 'Allow',
                    Principal: { Service: 'cloudfront.amazonaws.com' },
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
        s3assetscopylg083B90F8: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                RetentionInDays: 1,
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        s3assetscopyAwsCliLayerA9EB8F42: {
            Type: 'AWS::Lambda::LayerVersion',
            Properties: {
                Content: {
                    S3Bucket: 'cdk-hnb659fds-assets-11111-us-west-2',
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
                SourceBucketNames: ['cdk-hnb659fds-assets-11111-us-west-2'],
                SourceObjectKeys: [
                    MatchHelper.endsWith('zip')
                ],
                DestinationBucketName: {Ref: 'pccsdlctestassets21EA24EB'},
                DestinationBucketKeyPrefix: 'assets',
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
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                Timeout: 900
            },
            DependsOn: [
                'CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756CServiceRoleDefaultPolicy88902FDF',
                'CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756CServiceRole89A01265'
            ]
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
                    OriginAccessControlId: {
                      'Fn::GetAtt': [
                        'pccsdlctestcfdistOrigin2S3OriginAccessControl018FD971',
                        'Id'
                                        ]
                    },
                    S3OriginConfig: { OriginAccessIdentity: '' }
                        },
                        {
                            DomainName: {
                                'Fn::GetAtt': ['pccsdlctestassets21EA24EB', 'RegionalDomainName']
                            },
                            Id: 'pccsharedtestpccsdlcteststagepccsdlctestpccsdlctestcfdistOrigin3E083D5EF',
                    OriginAccessControlId: {
                      'Fn::GetAtt': [
                        'pccsdlctestcfdistOrigin3S3OriginAccessControlAE41B39E',
                        'Id'
                      ]
                    },
                            OriginPath: '/assets',
                    S3OriginConfig: { OriginAccessIdentity: '' }
                        }
                    ],
                    PriceClass: 'PriceClass_100',
                    Restrictions: {
                        GeoRestriction: {
                            Locations: ['RU', 'BY', 'CN'],
                            RestrictionType: 'blacklist'
                        }
                    },
                    ViewerCertificate: {
                        AcmCertificateArn: {Ref: 'pccsdlctestdefaulttestsdlcexampleeduC912A0B0'},
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
          pccsdlctestcfdistOrigin2S3OriginAccessControl018FD971: {
            Type: 'AWS::CloudFront::OriginAccessControl',
            Properties: {
              OriginAccessControlConfig: {
                Name: 'pccsdlctestpccsdlctestcfdistOrigin2S3OriginAccessControlE4924722',
                OriginAccessControlOriginType: 's3',
                SigningBehavior: 'always',
                SigningProtocol: 'sigv4'
                }
            }
        },
          pccsdlctestcfdistOrigin3S3OriginAccessControlAE41B39E: {
            Type: 'AWS::CloudFront::OriginAccessControl',
            Properties: {
              OriginAccessControlConfig: {
                Name: 'pccsdlctestpccsdlctestcfdistOrigin3S3OriginAccessControl63BBC91F',
                OriginAccessControlOriginType: 's3',
                SigningBehavior: 'always',
                SigningProtocol: 'sigv4'
                }
            }
        },
        pccsdlctesttestsdlcexampleeduarecord40417570: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
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