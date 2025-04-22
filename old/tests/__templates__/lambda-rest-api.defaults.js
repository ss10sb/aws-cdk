const {MatchHelper} = require("../../../src/utils/testing/match-helper");
module.exports = {
    Resources: {
        functioneventfn0lgD47CFCEB: {
            Type: 'AWS::Logs::LogGroup',
            Properties: { RetentionInDays: 30 },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        functioneventfn0ServiceRole30E080B7: {
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
                ]
            }
        },
        functioneventfn01CDA78AF: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-12344-us-east-1',
                    S3Key: MatchHelper.endsWith('zip')
                },
                FunctionName: 'function-event-fn-0',
                Handler: 'artisan',
                Layers: [
                    {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                { Ref: 'AWS::Partition' },
                                ':lambda:us-east-1:534081306603:layer:php-81-fpm:59'
                            ]
                        ]
                    }
                ],
                LoggingConfig: { LogGroup: { Ref: 'functioneventfn0lgD47CFCEB' } },
                MemorySize: 512,
                Role: {
                    'Fn::GetAtt': [ 'functioneventfn0ServiceRole30E080B7', 'Arn' ]
                },
                Runtime: 'provided.al2',
                Timeout: 120
            },
            DependsOn: [ 'functioneventfn0ServiceRole30E080B7' ]
        },
        certtestfooeduD0B35127: {
            Type: 'AWS::CertificateManager::Certificate',
            Properties: {
                DomainName: 'test.foo.edu',
                DomainValidationOptions: [ { DomainName: 'test.foo.edu', HostedZoneId: 'DUMMY' } ],
                Tags: [ { Key: 'Name', Value: 'stack/cert-test.foo.edu' } ],
                ValidationMethod: 'DNS'
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
          },
          lambdarestapiauthorizerfnlg4387803A: {
            Type: 'AWS::Logs::LogGroup',
            Properties: { RetentionInDays: 7 },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        lambdarestapiauthorizerfnServiceRoleD60184C8: {
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
                ]
            }
        },
        lambdarestapiauthorizerfn50A4BE92: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-12344-us-east-1',
                    S3Key: MatchHelper.endsWith('zip')
                },
                Environment: { Variables: { AUTHORIZER_TOKEN: 'abc123' } },
                FunctionName: 'lambda-rest-api-authorizer-fn',
                Handler: 'token.handler',
              LoggingConfig: { LogGroup: { Ref: 'lambdarestapiauthorizerfnlg4387803A' } },
                Role: {
                    'Fn::GetAtt': [ 'lambdarestapiauthorizerfnServiceRoleD60184C8', 'Arn' ]
                },
                Runtime: MatchHelper.startsWith('nodejs'),
                Timeout: 5
            },
            DependsOn: [ 'lambdarestapiauthorizerfnServiceRoleD60184C8' ]
        },
        lambdarestapirestapiB0B38C03: {
            Type: 'AWS::ApiGateway::RestApi',
            Properties: {
                DisableExecuteApiEndpoint: false,
                EndpointConfiguration: { Types: [ 'REGIONAL' ] },
                Name: 'lambda-rest-api-rest-api'
            }
        },
        lambdarestapirestapiCloudWatchRole49104EB8: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: { Service: 'apigateway.amazonaws.com' }
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
                                ':iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs'
                            ]
                        ]
                    }
                ]
            },
            UpdateReplacePolicy: 'Retain',
            DeletionPolicy: 'Retain'
        },
        lambdarestapirestapiAccount1C40998B: {
            Type: 'AWS::ApiGateway::Account',
            Properties: {
                CloudWatchRoleArn: {
                    'Fn::GetAtt': [ 'lambdarestapirestapiCloudWatchRole49104EB8', 'Arn' ]
                }
            },
            DependsOn: [ 'lambdarestapirestapiB0B38C03' ],
            UpdateReplacePolicy: 'Retain',
            DeletionPolicy: 'Retain'
        },
        lambdarestapirestapiDeploymentC05A0C9B06fbb04964e28293022f5b2844c95a88: {
            Type: 'AWS::ApiGateway::Deployment',
            Properties: {
                Description: 'Automatically created by the RestApi construct',
                RestApiId: { Ref: 'lambdarestapirestapiB0B38C03' }
            },
            DependsOn: [
                'lambdarestapirestapiproxyANYE4AA6D7A',
                'lambdarestapirestapiproxy4B137EDE',
                'lambdarestapirestapiANY2C46F550'
            ]
        },
        lambdarestapirestapiDeploymentStageprod8A2EE98F: {
            Type: 'AWS::ApiGateway::Stage',
            Properties: {
                DeploymentId: {
                    Ref: 'lambdarestapirestapiDeploymentC05A0C9B06fbb04964e28293022f5b2844c95a88'
                },
                RestApiId: { Ref: 'lambdarestapirestapiB0B38C03' },
                StageName: 'prod'
            },
            DependsOn: [ 'lambdarestapirestapiAccount1C40998B' ]
        },
        lambdarestapirestapiCustomDomainCF580E1E: {
            Type: 'AWS::ApiGateway::DomainName',
            Properties: {
                DomainName: 'test.foo.edu',
                EndpointConfiguration: { Types: [ 'REGIONAL' ] },
                RegionalCertificateArn: { Ref: 'certtestfooeduD0B35127' }
            }
        },
        lambdarestapirestapiCustomDomainMapstacklambdarestapirestapi0757661F11D53B0D: {
            Type: 'AWS::ApiGateway::BasePathMapping',
            Properties: {
                DomainName: { Ref: 'lambdarestapirestapiCustomDomainCF580E1E' },
                RestApiId: { Ref: 'lambdarestapirestapiB0B38C03' },
                Stage: { Ref: 'lambdarestapirestapiDeploymentStageprod8A2EE98F' }
            }
        },
        lambdarestapirestapiproxy4B137EDE: {
            Type: 'AWS::ApiGateway::Resource',
            Properties: {
                ParentId: {
                    'Fn::GetAtt': [ 'lambdarestapirestapiB0B38C03', 'RootResourceId' ]
                },
                PathPart: '{proxy+}',
                RestApiId: { Ref: 'lambdarestapirestapiB0B38C03' }
            }
        },
        lambdarestapirestapiproxyANYApiPermissionstacklambdarestapirestapi0757661FANYproxy67605D5A: {
            Type: 'AWS::Lambda::Permission',
            Properties: {
                Action: 'lambda:InvokeFunction',
                FunctionName: { 'Fn::GetAtt': [ 'functioneventfn01CDA78AF', 'Arn' ] },
                Principal: 'apigateway.amazonaws.com',
                SourceArn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            { Ref: 'AWS::Partition' },
                            ':execute-api:us-east-1:12344:',
                            { Ref: 'lambdarestapirestapiB0B38C03' },
                            '/',
                            {
                                Ref: 'lambdarestapirestapiDeploymentStageprod8A2EE98F'
                            },
                            '/*/*'
                        ]
                    ]
                }
            }
        },
        lambdarestapirestapiproxyANYApiPermissionTeststacklambdarestapirestapi0757661FANYproxy8B5A9AD0: {
            Type: 'AWS::Lambda::Permission',
            Properties: {
                Action: 'lambda:InvokeFunction',
                FunctionName: { 'Fn::GetAtt': [ 'functioneventfn01CDA78AF', 'Arn' ] },
                Principal: 'apigateway.amazonaws.com',
                SourceArn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            { Ref: 'AWS::Partition' },
                            ':execute-api:us-east-1:12344:',
                            { Ref: 'lambdarestapirestapiB0B38C03' },
                            '/test-invoke-stage/*/*'
                        ]
                    ]
                }
            }
        },
        lambdarestapirestapiproxyANYE4AA6D7A: {
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
                                { Ref: 'AWS::Partition' },
                                ':apigateway:us-east-1:lambda:path/2015-03-31/functions/',
                                {
                                    'Fn::GetAtt': [ 'functioneventfn01CDA78AF', 'Arn' ]
                                },
                                '/invocations'
                            ]
                        ]
                    }
                },
                ResourceId: { Ref: 'lambdarestapirestapiproxy4B137EDE' },
                RestApiId: { Ref: 'lambdarestapirestapiB0B38C03' }
            }
        },
        lambdarestapirestapiANYApiPermissionstacklambdarestapirestapi0757661FANY583C3E4E: {
            Type: 'AWS::Lambda::Permission',
            Properties: {
                Action: 'lambda:InvokeFunction',
                FunctionName: { 'Fn::GetAtt': [ 'functioneventfn01CDA78AF', 'Arn' ] },
                Principal: 'apigateway.amazonaws.com',
                SourceArn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            { Ref: 'AWS::Partition' },
                            ':execute-api:us-east-1:12344:',
                            { Ref: 'lambdarestapirestapiB0B38C03' },
                            '/',
                            {
                                Ref: 'lambdarestapirestapiDeploymentStageprod8A2EE98F'
                            },
                            '/*/'
                        ]
                    ]
                }
            }
        },
        lambdarestapirestapiANYApiPermissionTeststacklambdarestapirestapi0757661FANY42E1BF66: {
            Type: 'AWS::Lambda::Permission',
            Properties: {
                Action: 'lambda:InvokeFunction',
                FunctionName: { 'Fn::GetAtt': [ 'functioneventfn01CDA78AF', 'Arn' ] },
                Principal: 'apigateway.amazonaws.com',
                SourceArn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            { Ref: 'AWS::Partition' },
                            ':execute-api:us-east-1:12344:',
                            { Ref: 'lambdarestapirestapiB0B38C03' },
                            '/test-invoke-stage/*/'
                        ]
                    ]
                }
            }
        },
        lambdarestapirestapiANY2C46F550: {
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
                                { Ref: 'AWS::Partition' },
                                ':apigateway:us-east-1:lambda:path/2015-03-31/functions/',
                                {
                                    'Fn::GetAtt': [ 'functioneventfn01CDA78AF', 'Arn' ]
                                },
                                '/invocations'
                            ]
                        ]
                    }
                },
                ResourceId: {
                    'Fn::GetAtt': [ 'lambdarestapirestapiB0B38C03', 'RootResourceId' ]
                },
                RestApiId: { Ref: 'lambdarestapirestapiB0B38C03' }
            }
        }
    },
    Outputs: {
        lambdarestapirestapiEndpointF8394473: {
            Value: {
                'Fn::Join': [
                    '',
                    [
                        'https://',
                        { Ref: 'lambdarestapirestapiB0B38C03' },
                        '.execute-api.us-east-1.',
                        { Ref: 'AWS::URLSuffix' },
                        '/',
                        {
                            Ref: 'lambdarestapirestapiDeploymentStageprod8A2EE98F'
                        },
                        '/'
                    ]
                ]
            }
        }
    }
}