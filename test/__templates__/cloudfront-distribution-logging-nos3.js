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
                Role: {
                    'Fn::GetAtt': ['functioneventfn0ServiceRole30E080B7', 'Arn']
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
                MemorySize: 512,
                Runtime: 'provided.al2',
                Timeout: 120
            },
            DependsOn: ['functioneventfn0ServiceRole30E080B7']
        },
        functioneventfn0LogRetention13B86148: {
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
                        ['/aws/lambda/', {Ref: 'functioneventfn01CDA78AF'}]
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
        httpapihttpapi5E89BCFA: {
            Type: 'AWS::ApiGatewayV2::Api',
            Properties: {
                DisableExecuteApiEndpoint: false,
                Name: 'http-api-http-api',
                ProtocolType: 'HTTP'
            }
        },
        httpapihttpapiDefaultRoutehttpapihttpapiint560D1C07: {
            Type: 'AWS::ApiGatewayV2::Integration',
            Properties: {
                ApiId: {Ref: 'httpapihttpapi5E89BCFA'},
                IntegrationType: 'AWS_PROXY',
                IntegrationUri: {'Fn::GetAtt': ['functioneventfn01CDA78AF', 'Arn']},
                PayloadFormatVersion: '2.0',
                RequestParameters: {
                    'append:header.x-cf-source-ip': '$request.header.x-cf-source-ip'
                }
            }
        },
        httpapihttpapiDefaultRoutehttpapihttpapiintPermission5B4ABB59: {
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
                            {Ref: 'httpapihttpapi5E89BCFA'},
                            '/*/*'
                        ]
                    ]
                }
            }
        },
        httpapihttpapiDefaultRouteBFDE9743: {
            Type: 'AWS::ApiGatewayV2::Route',
            Properties: {
                ApiId: {Ref: 'httpapihttpapi5E89BCFA'},
                RouteKey: '$default',
                AuthorizationType: 'NONE',
                Target: {
                    'Fn::Join': [
                        '',
                        [
                            'integrations/',
                            {
                                Ref: 'httpapihttpapiDefaultRoutehttpapihttpapiint560D1C07'
                            }
                        ]
                    ]
                }
            }
        },
        httpapihttpapiDefaultStage2FC5FDEF: {
            Type: 'AWS::ApiGatewayV2::Stage',
            Properties: {
                ApiId: {Ref: 'httpapihttpapi5E89BCFA'},
                StageName: '$default',
                AutoDeploy: true
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
        distributioncfdistLoggingBucketFAF3A8F3: {
            Type: 'AWS::S3::Bucket',
            Properties: {
                BucketEncryption: {
                    ServerSideEncryptionConfiguration: [
                        {
                            ServerSideEncryptionByDefault: {SSEAlgorithm: 'AES256'}
                        }
                    ]
                }
            },
            UpdateReplacePolicy: 'Retain',
            DeletionPolicy: 'Retain'
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
                    Logging: {
                        Bucket: {
                            'Fn::GetAtt': [
                                'distributioncfdistLoggingBucketFAF3A8F3',
                                'RegionalDomainName'
                            ]
                        }
                    },
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
                                                        {Ref: 'httpapihttpapi5E89BCFA'},
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
                            Id: 'stackdistributioncfdistOrigin19DF8816C'
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
    }
}