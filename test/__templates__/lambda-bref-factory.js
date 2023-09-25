const {MatchHelper} = require("../../src/utils/testing/match-helper");
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
                Role: {'Fn::GetAtt': ['funcwebfn0ServiceRoleA9004225', 'Arn']},
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
                MemorySize: 512,
                Runtime: 'provided.al2',
                Timeout: 28
            },
            DependsOn: ['funcwebfn0ServiceRoleA9004225']
        },
        funcwebfn0LogRetentionF9CFF3D3: {
            Type: 'Custom::LogRetention',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': [
                        'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aFD4BFC8A',
                        'Arn'
                    ]
                },
                LogGroupName: {
                    'Fn::Join': ['', ['/aws/lambda/', {Ref: 'funcwebfn067A6530A'}]]
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
                Runtime: MatchHelper.startsWith('nodejs'),
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-12344-us-west-2',
                    S3Key: MatchHelper.endsWith('zip')
                },
                Role: {
                    'Fn::GetAtt': [
                        'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB',
                        'Arn'
                    ]
                }
            },
            DependsOn: [
                'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRoleDefaultPolicyADDA7DEB',
                'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB'
            ]
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
                Role: {
                    'Fn::GetAtt': ['myappauthorizerfnServiceRole2952ABDD', 'Arn']
                },
                Environment: {
                    Variables: {
                        AUTHORIZER_TOKEN: {
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
                },
                FunctionName: 'my-app-authorizer-fn',
                Handler: 'token.handler',
                Runtime: MatchHelper.startsWith('nodejs'),
                Timeout: 5
            },
            DependsOn: ['myappauthorizerfnServiceRole2952ABDD']
        },
        myappauthorizerfnLogRetention55CB4DDF: {
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
                        ['/aws/lambda/', {Ref: 'myappauthorizerfn61B51A4F'}]
                    ]
                },
                RetentionInDays: 7
            }
        },
        myapprestapiA58A667F: {
            Type: 'AWS::ApiGateway::RestApi',
            Properties: {
                DisableExecuteApiEndpoint: false,
                EndpointConfiguration: {Types: ['REGIONAL']},
                Name: 'my-app-rest-api'
            }
        },
        myapprestapiCloudWatchRole5E8C4765: {
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
        myapprestapiAccount8A1D9816: {
            Type: 'AWS::ApiGateway::Account',
            Properties: {
                CloudWatchRoleArn: {
                    'Fn::GetAtt': ['myapprestapiCloudWatchRole5E8C4765', 'Arn']
                }
            },
            DependsOn: ['myapprestapiA58A667F'],
            UpdateReplacePolicy: 'Retain',
            DeletionPolicy: 'Retain'
        },
        myapprestapiDeployment12B3E9C9195db37062f799c38906cb088bd6ffdd: {
            Type: 'AWS::ApiGateway::Deployment',
            Properties: {
                RestApiId: {Ref: 'myapprestapiA58A667F'},
                Description: 'Automatically created by the RestApi construct'
            },
            DependsOn: [
                'myapprestapiproxyANYC6BA8B79',
                'myapprestapiproxyA8E921A0',
                'myapprestapiANY919BD794'
            ]
        },
        myapprestapiDeploymentStageprod4D80311E: {
            Type: 'AWS::ApiGateway::Stage',
            Properties: {
                RestApiId: {Ref: 'myapprestapiA58A667F'},
                DeploymentId: {
                    Ref: 'myapprestapiDeployment12B3E9C9195db37062f799c38906cb088bd6ffdd'
                },
                StageName: 'prod'
            },
            DependsOn: ['myapprestapiAccount8A1D9816']
        },
        myapprestapiCustomDomain41938B8D: {
            Type: 'AWS::ApiGateway::DomainName',
            Properties: {
                DomainName: 'foo.bar.com',
                EndpointConfiguration: {Types: ['REGIONAL']},
                RegionalCertificateArn: { Ref: 'myapplocalfoobarcom8042E6FE' }
            }
        },
        myapprestapiCustomDomainMapstackmyapprestapi9020B329247EBF5F: {
            Type: 'AWS::ApiGateway::BasePathMapping',
            Properties: {
                DomainName: {Ref: 'myapprestapiCustomDomain41938B8D'},
                RestApiId: {Ref: 'myapprestapiA58A667F'},
                Stage: {Ref: 'myapprestapiDeploymentStageprod4D80311E'}
            }
        },
        myapprestapiproxyA8E921A0: {
            Type: 'AWS::ApiGateway::Resource',
            Properties: {
                ParentId: {
                    'Fn::GetAtt': ['myapprestapiA58A667F', 'RootResourceId']
                },
                PathPart: '{proxy+}',
                RestApiId: {Ref: 'myapprestapiA58A667F'}
            }
        },
        myapprestapiproxyANYApiPermissionstackmyapprestapi9020B329ANYproxy66A7DD59: {
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
                            {Ref: 'myapprestapiA58A667F'},
                            '/',
                            {Ref: 'myapprestapiDeploymentStageprod4D80311E'},
                            '/*/*'
                        ]
                    ]
                }
            }
        },
        myapprestapiproxyANYApiPermissionTeststackmyapprestapi9020B329ANYproxyD055B967: {
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
                            {Ref: 'myapprestapiA58A667F'},
                            '/test-invoke-stage/*/*'
                        ]
                    ]
                }
            }
        },
        myapprestapiproxyANYC6BA8B79: {
            Type: 'AWS::ApiGateway::Method',
            Properties: {
                HttpMethod: 'ANY',
                ResourceId: {Ref: 'myapprestapiproxyA8E921A0'},
                RestApiId: {Ref: 'myapprestapiA58A667F'},
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
                                {'Fn::GetAtt': ['funcwebfn067A6530A', 'Arn']},
                                '/invocations'
                            ]
                        ]
                    }
                }
            }
        },
        myapprestapiANYApiPermissionstackmyapprestapi9020B329ANY54901306: {
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
                            {Ref: 'myapprestapiA58A667F'},
                            '/',
                            {Ref: 'myapprestapiDeploymentStageprod4D80311E'},
                            '/*/'
                        ]
                    ]
                }
            }
        },
        myapprestapiANYApiPermissionTeststackmyapprestapi9020B329ANY9DB645C5: {
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
                            {Ref: 'myapprestapiA58A667F'},
                            '/test-invoke-stage/*/'
                        ]
                    ]
                }
            }
        },
        myapprestapiANY919BD794: {
            Type: 'AWS::ApiGateway::Method',
            Properties: {
                HttpMethod: 'ANY',
                ResourceId: {
                    'Fn::GetAtt': ['myapprestapiA58A667F', 'RootResourceId']
                },
                RestApiId: {Ref: 'myapprestapiA58A667F'},
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
                                {'Fn::GetAtt': ['funcwebfn067A6530A', 'Arn']},
                                '/invocations'
                            ]
                        ]
                    }
                }
            }
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
                                                        {Ref: 'myapprestapiA58A667F'},
                                                        '.execute-api.us-west-2.',
                                                        {Ref: 'AWS::URLSuffix'},
                                                        '/',
                                                        {
                                                            Ref: 'myapprestapiDeploymentStageprod4D80311E'
                                                        },
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
                                                                    {Ref: 'myapprestapiA58A667F'},
                                                                    '.execute-api.us-west-2.',
                                                                    {Ref: 'AWS::URLSuffix'},
                                                                    '/',
                                                                    {
                                                                        Ref: 'myapprestapiDeploymentStageprod4D80311E'
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
                        AcmCertificateArn: { Ref: 'myappdefaultfoobarcom221C8B61' },
                        MinimumProtocolVersion: 'TLSv1.2_2019',
                        SslSupportMethod: 'sni-only'
                    }
                }
            }
        }
    }
}