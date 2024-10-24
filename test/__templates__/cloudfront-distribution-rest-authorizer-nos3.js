const {MatchHelper} = require("../../src/utils/testing/match-helper");
module.exports = {
    Resources: {
        certfoobarcom430629AB: {
            Type: 'AWS::CertificateManager::Certificate',
            Properties: {
                DomainName: 'foo.bar.com',
                DomainValidationOptions: [ { DomainName: 'foo.bar.com', HostedZoneId: 'DUMMY' } ],
                Tags: [ { Key: 'Name', Value: 'stack/cert-foo.bar.com' } ],
                ValidationMethod: 'DNS'
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
          },
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
                ]
            }
        },
        functioneventfn01CDA78AF: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-12344-us-west-2',
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
                                {Ref: 'AWS::Partition'},
                                ':lambda:us-west-2:534081306603:layer:php-81-fpm:59'
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
            DependsOn: ['functioneventfn0ServiceRole30E080B7']
        },
          httpapiauthorizerfnlg7D7CDD47: {
            Type: 'AWS::Logs::LogGroup',
            Properties: { RetentionInDays: 7 },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
          },
          httpapiauthorizerfnServiceRoleE977EE3D: {
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
          httpapiauthorizerfn8B4D1E1C: {
            Type: 'AWS::Lambda::Function',
            Properties: {
              Code: {
                S3Bucket: 'cdk-hnb659fds-assets-12344-us-west-2',
                S3Key: 'c53d3eefd84eda81ec21cae72089e12b7729368cb85e86fc9fb8b2031b76415b.zip'
              },
              Environment: {
                Variables: {
                  AUTHORIZER_TOKEN: {
                    'Fn::Join': [
                      '',
                      [
                        '{{resolve:secretsmanager:arn:',
                        { Ref: 'AWS::Partition' },
                        ':secretsmanager:us-west-2:12344:secret:secrets-secrets/environment:SecretString:AUTHORIZER_TOKEN::}}'
                      ]
                    ]
                  }
                }
              },
              FunctionName: 'http-api-authorizer-fn',
              Handler: 'token.handler',
              LoggingConfig: { LogGroup: { Ref: 'httpapiauthorizerfnlg7D7CDD47' } },
              Role: {
                'Fn::GetAtt': [ 'httpapiauthorizerfnServiceRoleE977EE3D', 'Arn' ]
              },
              Runtime: MatchHelper.startsWith('nodejs'),
              Timeout: 5
            },
            DependsOn: [ 'httpapiauthorizerfnServiceRoleE977EE3D' ]
          },
        httpapirestapi0816E9CD: {
            Type: 'AWS::ApiGateway::RestApi',
            Properties: {
                DisableExecuteApiEndpoint: false,
                EndpointConfiguration: {Types: ['REGIONAL']},
                Name: 'http-api-rest-api'
            }
        },
        httpapirestapiCloudWatchRole5288DACF: {
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
                ]
            },
            UpdateReplacePolicy: 'Retain',
            DeletionPolicy: 'Retain'
        },
        httpapirestapiAccount656712A3: {
            Type: 'AWS::ApiGateway::Account',
            Properties: {
                CloudWatchRoleArn: {
                    'Fn::GetAtt': ['httpapirestapiCloudWatchRole5288DACF', 'Arn']
                }
            },
            DependsOn: ['httpapirestapi0816E9CD'],
            UpdateReplacePolicy: 'Retain',
            DeletionPolicy: 'Retain'
        },
        httpapirestapiDeployment21137E35d43a23f862da801afce015678d98e954: {
            Type: 'AWS::ApiGateway::Deployment',
            Properties: {
              Description: 'Automatically created by the RestApi construct',
              RestApiId: { Ref: 'httpapirestapi0816E9CD' }
            },
            DependsOn: [
                'httpapirestapiproxyANY628EF2C4',
                'httpapirestapiproxyE1EF9649',
                'httpapirestapiANY8D6F2651'
            ]
        },
        httpapirestapiDeploymentStageprodF4611BAD: {
            Type: 'AWS::ApiGateway::Stage',
            Properties: {
                DeploymentId: {
                    Ref: 'httpapirestapiDeployment21137E35d43a23f862da801afce015678d98e954'
                },
              RestApiId: { Ref: 'httpapirestapi0816E9CD' },
                StageName: 'prod'
            },
            DependsOn: ['httpapirestapiAccount656712A3']
        },
        httpapirestapiproxyE1EF9649: {
            Type: 'AWS::ApiGateway::Resource',
            Properties: {
                ParentId: {
                    'Fn::GetAtt': ['httpapirestapi0816E9CD', 'RootResourceId']
                },
                PathPart: '{proxy+}',
                RestApiId: {Ref: 'httpapirestapi0816E9CD'}
            }
        },
        httpapirestapiproxyANYApiPermissionstackhttpapirestapi4AFCA52EANYproxyCC3DF99D: {
            Type: 'AWS::Lambda::Permission',
            Properties: {
                Action: 'lambda:InvokeFunction',
                FunctionName: {'Fn::GetAtt': ['functioneventfn01CDA78AF', 'Arn']},
                Principal: 'apigateway.amazonaws.com',
                SourceArn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {Ref: 'AWS::Partition'},
                            ':execute-api:us-west-2:12344:',
                            {Ref: 'httpapirestapi0816E9CD'},
                            '/',
                            {Ref: 'httpapirestapiDeploymentStageprodF4611BAD'},
                            '/*/*'
                        ]
                    ]
                }
            }
        },
        httpapirestapiproxyANYApiPermissionTeststackhttpapirestapi4AFCA52EANYproxy6FE3050D: {
            Type: 'AWS::Lambda::Permission',
            Properties: {
                Action: 'lambda:InvokeFunction',
                FunctionName: {'Fn::GetAtt': ['functioneventfn01CDA78AF', 'Arn']},
                Principal: 'apigateway.amazonaws.com',
                SourceArn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {Ref: 'AWS::Partition'},
                            ':execute-api:us-west-2:12344:',
                            {Ref: 'httpapirestapi0816E9CD'},
                            '/test-invoke-stage/*/*'
                        ]
                    ]
                }
            }
        },
        httpapirestapiproxyANY628EF2C4: {
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
                                    'Fn::GetAtt': ['functioneventfn01CDA78AF', 'Arn']
                                },
                                '/invocations'
                            ]
                        ]
                    }
              },
              ResourceId: { Ref: 'httpapirestapiproxyE1EF9649' },
              RestApiId: { Ref: 'httpapirestapi0816E9CD' }
            }
        },
        httpapirestapiANYApiPermissionstackhttpapirestapi4AFCA52EANY11A75849: {
            Type: 'AWS::Lambda::Permission',
            Properties: {
                Action: 'lambda:InvokeFunction',
                FunctionName: {'Fn::GetAtt': ['functioneventfn01CDA78AF', 'Arn']},
                Principal: 'apigateway.amazonaws.com',
                SourceArn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {Ref: 'AWS::Partition'},
                            ':execute-api:us-west-2:12344:',
                            {Ref: 'httpapirestapi0816E9CD'},
                            '/',
                            {Ref: 'httpapirestapiDeploymentStageprodF4611BAD'},
                            '/*/'
                        ]
                    ]
                }
            }
        },
        httpapirestapiANYApiPermissionTeststackhttpapirestapi4AFCA52EANY685F59CA: {
            Type: 'AWS::Lambda::Permission',
            Properties: {
                Action: 'lambda:InvokeFunction',
                FunctionName: {'Fn::GetAtt': ['functioneventfn01CDA78AF', 'Arn']},
                Principal: 'apigateway.amazonaws.com',
                SourceArn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {Ref: 'AWS::Partition'},
                            ':execute-api:us-west-2:12344:',
                            {Ref: 'httpapirestapi0816E9CD'},
                            '/test-invoke-stage/*/'
                        ]
                    ]
                }
            }
        },
        httpapirestapiANY8D6F2651: {
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
                                    'Fn::GetAtt': ['functioneventfn01CDA78AF', 'Arn']
                                },
                                '/invocations'
                            ]
                        ]
                    }
              },
              ResourceId: {
                'Fn::GetAtt': [ 'httpapirestapi0816E9CD', 'RootResourceId' ]
              },
              RestApiId: { Ref: 'httpapirestapi0816E9CD' }
            }
        },
        distributionoriginrequestpolicyF5975AB2: {
            Type: 'AWS::CloudFront::OriginRequestPolicy',
            Properties: {
                OriginRequestPolicyConfig: {
                    CookiesConfig: {CookieBehavior: 'all'},
                    HeadersConfig: {
                        HeaderBehavior: 'allViewerAndWhitelistCloudFront',
                        Headers: ['CloudFront-Viewer-Address']
                    },
                    Name: 'distribution-origin-request-policy',
                    QueryStringsConfig: {QueryStringBehavior: 'all'}
                }
            }
        },
        distributioncfdistD32B15FD: {
            Type: 'AWS::CloudFront::Distribution',
            Properties: {
                DistributionConfig: {
                    Aliases: ['foo.bar.com'],
                    Comment: 'distribution-cf-dist',
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
                        OriginRequestPolicyId: {Ref: 'distributionoriginrequestpolicyF5975AB2'},
                        ResponseHeadersPolicyId: '67f7725c-6f97-4210-82d7-5512b31e9d03',
                        TargetOriginId: 'stackdistributioncfdistOrigin19DF8816C',
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
                                                        {Ref: 'httpapirestapi0816E9CD'},
                                                        '.execute-api.us-west-2.',
                                                        {Ref: 'AWS::URLSuffix'},
                                                        '/',
                                                        {
                                                            Ref: 'httpapirestapiDeploymentStageprodF4611BAD'
                                                        },
                                                        '/'
                                                    ]
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            Id: 'stackdistributioncfdistOrigin19DF8816C',
                            OriginCustomHeaders: [
                                {
                                    HeaderName: 'x-auth-token',
                                    HeaderValue: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                '{{resolve:secretsmanager:arn:',
                                                {Ref: 'AWS::Partition'},
                                                ':secretsmanager:us-west-2:12344:secret:secrets-secrets/environment:SecretString:AUTHORIZER_TOKEN::}}'
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
                                                                    {Ref: 'httpapirestapi0816E9CD'},
                                                                    '.execute-api.us-west-2.',
                                                                    {Ref: 'AWS::URLSuffix'},
                                                                    '/',
                                                                    {
                                                                        Ref: 'httpapirestapiDeploymentStageprodF4611BAD'
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
                        }
                    ],
                    PriceClass: 'PriceClass_100',
                    ViewerCertificate: {
                        AcmCertificateArn: { Ref: 'certfoobarcom430629AB' },
                        MinimumProtocolVersion: 'TLSv1.2_2019',
                        SslSupportMethod: 'sni-only'
                    }
                }
            }
        }
    },
    Outputs: {
        httpapirestapiEndpoint1255D238: {
            Value: {
                'Fn::Join': [
                    '',
                    [
                        'https://',
                        {Ref: 'httpapirestapi0816E9CD'},
                        '.execute-api.us-west-2.',
                        {Ref: 'AWS::URLSuffix'},
                        '/',
                        {Ref: 'httpapirestapiDeploymentStageprodF4611BAD'},
                        '/'
                    ]
                ]
            }
        }
    }
}