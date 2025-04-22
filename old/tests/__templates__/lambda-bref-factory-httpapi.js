const {MatchHelper} = require("../../../src/utils/testing/match-helper");
module.exports = {
    Resources: {
        myappdefaultfoobarcom221C8B61: {
            Type: 'AWS::CertificateManager::Certificate',
            Properties: {
                DomainName: 'foo.bar.com',
                DomainValidationOptions: [ { DomainName: 'foo.bar.com', HostedZoneId: 'DUMMY' } ],
                Tags: [
                    { Key: 'Name', Value: 'stack/my-app-default-foo.bar.com' }
                ],
                ValidationMethod: 'DNS'
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
          },
          funcwebfn0lg7D0BB952: {
            Type: 'AWS::Logs::LogGroup',
            Properties: { RetentionInDays: 30 },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        funcwebfn0ServiceRoleA9004225: {
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
        funcwebfn067A6530A: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-12344-us-west-2',
                    S3Key: MatchHelper.endsWith('zip')
                },
                FunctionName: 'func-web-fn-0',
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
              LoggingConfig: { LogGroup: { Ref: 'funcwebfn0lg7D0BB952' } },
                MemorySize: 512,
              Role: { 'Fn::GetAtt': [ 'funcwebfn0ServiceRoleA9004225', 'Arn' ] },
                Runtime: 'provided.al2',
                Timeout: 28
            },
            DependsOn: ['funcwebfn0ServiceRoleA9004225']
        },
        myapplocalfoobarcom8042E6FE: {
            Type: 'AWS::CertificateManager::Certificate',
            Properties: {
                DomainName: 'foo.bar.com',
                DomainValidationOptions: [ { DomainName: 'foo.bar.com', HostedZoneId: 'DUMMY' } ],
                Tags: [ { Key: 'Name', Value: 'stack/my-app-local-foo.bar.com' } ],
                ValidationMethod: 'DNS'
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
          },
          myappauthorizerfnlg23C1AACD: {
            Type: 'AWS::Logs::LogGroup',
            Properties: { RetentionInDays: 7 },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        myappauthorizerfnServiceRole2952ABDD: {
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
        myappauthorizerfn61B51A4F: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-12344-us-west-2',
                    S3Key: MatchHelper.endsWith('zip')
                },
                Environment: {Variables: {AUTHORIZER_TOKEN: 'INVALID'}},
                FunctionName: 'my-app-authorizer-fn',
                Handler: 'token.handler',
              LoggingConfig: { LogGroup: { Ref: 'myappauthorizerfnlg23C1AACD' } },
              Role: {
                'Fn::GetAtt': [ 'myappauthorizerfnServiceRole2952ABDD', 'Arn' ]
              },
              Runtime: MatchHelper.startsWith('nodejs'),
                Timeout: 5
            },
            DependsOn: ['myappauthorizerfnServiceRole2952ABDD']
        },
        myappdomainnamefoobarcomB8FC36EF: {
            Type: 'AWS::ApiGatewayV2::DomainName',
            Properties: {
                DomainName: 'foo.bar.com',
                DomainNameConfigurations: [
                    {
                        CertificateArn: { Ref: 'myapplocalfoobarcom8042E6FE' },
                        EndpointType: 'REGIONAL'
                    }
                ]
            }
        },
        myapphttpapiF20864F5: {
            Type: 'AWS::ApiGatewayV2::Api',
            Properties: {
                DisableExecuteApiEndpoint: false,
                Name: 'my-app-http-api',
                ProtocolType: 'HTTP'
            }
        },
        myapphttpapiDefaultRoutemyapphttpapiintF1C61421: {
            Type: 'AWS::ApiGatewayV2::Integration',
            Properties: {
                ApiId: {Ref: 'myapphttpapiF20864F5'},
                IntegrationType: 'AWS_PROXY',
                IntegrationUri: {'Fn::GetAtt': ['funcwebfn067A6530A', 'Arn']},
                PayloadFormatVersion: '2.0',
                RequestParameters: {
                    'append:header.x-cf-source-ip': '$request.header.x-cf-source-ip'
                }
            }
        },
        myapphttpapiDefaultRoutemyapphttpapiintPermissionDC684FDE: {
            Type: 'AWS::Lambda::Permission',
            Properties: {
                Action: 'lambda:InvokeFunction',
                FunctionName: {'Fn::GetAtt': ['funcwebfn067A6530A', 'Arn']},
                Principal: 'apigateway.amazonaws.com',
                SourceArn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {Ref: 'AWS::Partition'},
                            ':execute-api:us-west-2:12344:',
                            {Ref: 'myapphttpapiF20864F5'},
                            '/*/*'
                        ]
                    ]
                }
            }
        },
        myapphttpapiDefaultRoute5A39A2C4: {
            Type: 'AWS::ApiGatewayV2::Route',
            Properties: {
                ApiId: {Ref: 'myapphttpapiF20864F5'},
                AuthorizationType: 'CUSTOM',
                AuthorizerId: {Ref: 'myapphttpapiauthorizerFB2D4417'},
              RouteKey: '$default',
                Target: {
                    'Fn::Join': [
                        '',
                        [
                            'integrations/',
                            {
                                Ref: 'myapphttpapiDefaultRoutemyapphttpapiintF1C61421'
                            }
                        ]
                    ]
                }
            }
        },
        myapphttpapiauthorizerFB2D4417: {
            Type: 'AWS::ApiGatewayV2::Authorizer',
            Properties: {
                ApiId: {Ref: 'myapphttpapiF20864F5'},
                AuthorizerPayloadFormatVersion: '1.0',
                AuthorizerResultTtlInSeconds: 300,
              AuthorizerType: 'REQUEST',
                AuthorizerUri: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {Ref: 'AWS::Partition'},
                            ':apigateway:us-west-2:lambda:path/2015-03-31/functions/',
                            {
                                'Fn::GetAtt': ['myappauthorizerfn61B51A4F', 'Arn']
                            },
                            '/invocations'
                        ]
                    ]
                },
                IdentitySource: [
                    '$request.header.x-auth-token',
                    '$context.identity.sourceIp'
              ],
              Name: 'my-app-http-lambda-authorizer'
            }
        },
        myapphttpapistackmyapphttpapiauthorizerA42E3832PermissionA17444B7: {
            Type: 'AWS::Lambda::Permission',
            Properties: {
                Action: 'lambda:InvokeFunction',
                FunctionName: {'Fn::GetAtt': ['myappauthorizerfn61B51A4F', 'Arn']},
                Principal: 'apigateway.amazonaws.com',
                SourceArn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {Ref: 'AWS::Partition'},
                            ':execute-api:us-west-2:12344:',
                            {Ref: 'myapphttpapiF20864F5'},
                            '/authorizers/',
                            {Ref: 'myapphttpapiauthorizerFB2D4417'}
                        ]
                    ]
                }
            }
        },
        myapphttpapiDefaultStage7791846B: {
            Type: 'AWS::ApiGatewayV2::Stage',
            Properties: {
                ApiId: {Ref: 'myapphttpapiF20864F5'},
              AutoDeploy: true,
              StageName: '$default'
            },
            DependsOn: ['myappdomainnamefoobarcomB8FC36EF']
        },
        myapphttpapiDefaultStagestackmyappdomainnamefoobarcomundefinedC02D59CA: {
            Type: 'AWS::ApiGatewayV2::ApiMapping',
            Properties: {
                ApiId: {Ref: 'myapphttpapiF20864F5'},
                DomainName: {Ref: 'myappdomainnamefoobarcomB8FC36EF'},
                Stage: '$default'
            },
            DependsOn: [
                'myappdomainnamefoobarcomB8FC36EF',
                'myapphttpapiDefaultStage7791846B'
            ]
        },
        myapporiginrequestpolicy353E9D0B: {
            Type: 'AWS::CloudFront::OriginRequestPolicy',
            Properties: {
                OriginRequestPolicyConfig: {
                    CookiesConfig: {CookieBehavior: 'all'},
                    HeadersConfig: {
                        HeaderBehavior: 'allViewerAndWhitelistCloudFront',
                        Headers: ['CloudFront-Viewer-Address']
                    },
                    Name: 'my-app-origin-request-policy',
                    QueryStringsConfig: {QueryStringBehavior: 'all'}
                }
            }
        },
        myappcfdist8AC41345: {
            Type: 'AWS::CloudFront::Distribution',
            Properties: {
                DistributionConfig: {
                    Aliases: ['foo.bar.com'],
                    Comment: 'my-app-cf-dist',
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
                        OriginRequestPolicyId: {Ref: 'myapporiginrequestpolicy353E9D0B'},
                        ResponseHeadersPolicyId: '67f7725c-6f97-4210-82d7-5512b31e9d03',
                        TargetOriginId: 'stackmyappcfdistOrigin1A51E9D25',
                        ViewerProtocolPolicy: 'redirect-to-https'
                    },
                    Enabled: true,
                    HttpVersion: 'http2',
                    IPV6Enabled: true,
                    Origins: [
                        {
                            ConnectionAttempts: 1,
                            CustomOriginConfig: {
                                OriginKeepaliveTimeout: 5,
                                OriginProtocolPolicy: 'https-only',
                                OriginReadTimeout: 30,
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
                                                        {Ref: 'myapphttpapiF20864F5'},
                                                        '.execute-api.us-west-2.',
                                                        {Ref: 'AWS::URLSuffix'},
                                                        '/'
                                                    ]
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            Id: 'stackmyappcfdistOrigin1A51E9D25',
                            OriginCustomHeaders: [
                                {
                                    HeaderName: 'x-auth-token',
                                    HeaderValue: 'INVALID'
                                }
                            ]
                        }
                    ],
                    PriceClass: 'PriceClass_100',
                    ViewerCertificate: {
                        AcmCertificateArn: { Ref: 'myappdefaultfoobarcom221C8B61' },
                        MinimumProtocolVersion: 'TLSv1.2_2019',
                        SslSupportMethod: 'sni-only'
                    }
                }
            }
        }
    }
}