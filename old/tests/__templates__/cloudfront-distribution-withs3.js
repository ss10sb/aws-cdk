const {MatchHelper} = require("../../../src/utils/testing/match-helper");
module.exports = {
    Resources: {
        certfoobarcom430629AB: {
            Type: 'AWS::CertificateManager::Certificate',
            Properties: {
                DomainName: 'foo.bar.com',
                DomainValidationOptions: [{DomainName: 'foo.bar.com', HostedZoneId: 'DUMMY'}],
                Tags: [{Key: 'Name', Value: 'stack/cert-foo.bar.com'}],
                ValidationMethod: 'DNS'
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        functioneventfn0lgD47CFCEB: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {RetentionInDays: 30},
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
                LoggingConfig: {LogGroup: {Ref: 'functioneventfn0lgD47CFCEB'}},
                MemorySize: 512,
                Role: {
                    'Fn::GetAtt': ['functioneventfn0ServiceRole30E080B7', 'Arn']
                },
                Runtime: 'provided.al2',
                Timeout: 120
            },
            DependsOn: ['functioneventfn0ServiceRole30E080B7']
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
                AuthorizationType: 'NONE',
                RouteKey: '$default',
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
                AutoDeploy: true,
                StageName: '$default'
            }
        },
        s3assets19FA3000: {
            Type: 'AWS::S3::Bucket',
            Properties: {
                BucketEncryption: {
                    ServerSideEncryptionConfiguration: [
                        {
                            ServerSideEncryptionByDefault: {SSEAlgorithm: 'AES256'}
                        }
                    ]
                },
                BucketName: 's3-assets',
                OwnershipControls: {Rules: [{ObjectOwnership: 'BucketOwnerEnforced'}]},
                PublicAccessBlockConfiguration: {
                    BlockPublicAcls: true,
                    BlockPublicPolicy: true,
                    IgnorePublicAcls: true,
                    RestrictPublicBuckets: true
                }
            },
            UpdateReplacePolicy: 'Retain',
            DeletionPolicy: 'Retain'
        },
        s3assetsPolicy036845D1: {
            Type: 'AWS::S3::BucketPolicy',
            Properties: {
                Bucket: {Ref: 's3assets19FA3000'},
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 's3:*',
                            Condition: {Bool: {'aws:SecureTransport': 'false'}},
                            Effect: 'Deny',
                            Principal: {AWS: '*'},
                            Resource: [
                                {'Fn::GetAtt': ['s3assets19FA3000', 'Arn']},
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {'Fn::GetAtt': ['s3assets19FA3000', 'Arn']},
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
                                                {Ref: 'AWS::Partition'},
                                                ':cloudfront::',
                                                {Ref: 'AWS::AccountId'},
                                                ':distribution/',
                                                {Ref: 'distributioncfdistD32B15FD'}
                                            ]
                                        ]
                                    }
                                }
                            },
                            Effect: 'Allow',
                            Principal: {Service: 'cloudfront.amazonaws.com'},
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        {'Fn::GetAtt': ['s3assets19FA3000', 'Arn']},
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
                    CacheBehaviors: [
                        {
                            CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
                            Compress: true,
                            PathPattern: 'assets/*',
                            TargetOriginId: 'stackdistributioncfdistOrigin2C6C208F6',
                            ViewerProtocolPolicy: 'redirect-to-https'
                        },
                        {
                            CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
                            Compress: true,
                            PathPattern: '/favicon.ico',
                            TargetOriginId: 'stackdistributioncfdistOrigin3226BA5D8',
                            ViewerProtocolPolicy: 'redirect-to-https'
                        },
                        {
                            CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
                            Compress: true,
                            PathPattern: '/robots.txt',
                            TargetOriginId: 'stackdistributioncfdistOrigin3226BA5D8',
                            ViewerProtocolPolicy: 'redirect-to-https'
                        }
                    ],
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
                        },
                        {
                            DomainName: {
                                'Fn::GetAtt': ['s3assets19FA3000', 'RegionalDomainName']
                            },
                            Id: 'stackdistributioncfdistOrigin2C6C208F6',
                            OriginAccessControlId: {
                                'Fn::GetAtt': [
                                    'distributioncfdistOrigin2S3OriginAccessControl900BE977',
                                    'Id'
                                ]
                            },
                            S3OriginConfig: {OriginAccessIdentity: ''}
                        },
                        {
                            DomainName: {
                                'Fn::GetAtt': ['s3assets19FA3000', 'RegionalDomainName']
                            },
                            Id: 'stackdistributioncfdistOrigin3226BA5D8',
                            OriginAccessControlId: {
                                'Fn::GetAtt': [
                                    'distributioncfdistOrigin3S3OriginAccessControl86129E20',
                                    'Id'
                                ]
                            },
                            OriginPath: '/assets',
                            S3OriginConfig: {OriginAccessIdentity: ''}
                        }
                    ],
                    PriceClass: 'PriceClass_100',
                    ViewerCertificate: {
                        AcmCertificateArn: {Ref: 'certfoobarcom430629AB'},
                        MinimumProtocolVersion: 'TLSv1.2_2019',
                        SslSupportMethod: 'sni-only'
                    }
                }
            }
        },
        distributioncfdistOrigin2S3OriginAccessControl900BE977: {
            Type: 'AWS::CloudFront::OriginAccessControl',
            Properties: {
                OriginAccessControlConfig: {
                    Name: 'stackdistributioncfdistOrigin2S3OriginAccessControl63C43D63',
                    OriginAccessControlOriginType: 's3',
                    SigningBehavior: 'always',
                    SigningProtocol: 'sigv4'
                }
            }
        },
        distributioncfdistOrigin3S3OriginAccessControl86129E20: {
            Type: 'AWS::CloudFront::OriginAccessControl',
            Properties: {
                OriginAccessControlConfig: {
                    Name: 'stackdistributioncfdistOrigin3S3OriginAccessControlA6100630',
                    OriginAccessControlOriginType: 's3',
                    SigningBehavior: 'always',
                    SigningProtocol: 'sigv4'
                }
            }
        }
    }
}