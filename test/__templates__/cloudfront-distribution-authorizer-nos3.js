module.exports = {
    Resources: {
        certfoobarcomuseast1CertificateRequestorFunctionServiceRole60453E82: {
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
        certfoobarcomuseast1CertificateRequestorFunctionServiceRoleDefaultPolicy99C07B55: {
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
                                        { Ref: 'AWS::Partition' },
                                        ':route53:::hostedzone/DUMMY'
                                    ]
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'certfoobarcomuseast1CertificateRequestorFunctionServiceRoleDefaultPolicy99C07B55',
                Roles: [
                    {
                        Ref: 'certfoobarcomuseast1CertificateRequestorFunctionServiceRole60453E82'
                    }
                ]
            }
        },
        certfoobarcomuseast1CertificateRequestorFunction2C565E6C: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-12344-us-west-2',
                    S3Key: 'e85f10a8bf0e7f4f7931fce24b29d4faf6874948090a2b568b2da33a7116cf84.zip'
                },
                Role: {
                    'Fn::GetAtt': [
                        'certfoobarcomuseast1CertificateRequestorFunctionServiceRole60453E82',
                        'Arn'
                    ]
                },
                Handler: 'index.certificateRequestHandler',
                Runtime: 'nodejs14.x',
                Timeout: 900
            },
            DependsOn: [
                'certfoobarcomuseast1CertificateRequestorFunctionServiceRoleDefaultPolicy99C07B55',
                'certfoobarcomuseast1CertificateRequestorFunctionServiceRole60453E82'
            ]
        },
        certfoobarcomuseast1CertificateRequestorResourceC3ACAF62: {
            Type: 'AWS::CloudFormation::CustomResource',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': [
                        'certfoobarcomuseast1CertificateRequestorFunction2C565E6C',
                        'Arn'
                    ]
                },
                DomainName: 'foo.bar.com',
                HostedZoneId: 'DUMMY',
                Region: 'us-east-1',
                CleanupRecords: 'true'
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
                    S3Bucket: 'cdk-hnb659fds-assets-12344-us-west-2',
                    S3Key: 'a701d9c4e1414bfb5bdc604564a232c79e82fa1c4186ebc7245836fb15ee2c49.zip'
                },
                Role: {
                    'Fn::GetAtt': [ 'functioneventfn0ServiceRole30E080B7', 'Arn' ]
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
                                ':lambda:us-west-2:209497400698:layer:php-81-fpm:28'
                            ]
                        ]
                    }
                ],
                MemorySize: 512,
                Runtime: 'provided.al2',
                Timeout: 120
            },
            DependsOn: [ 'functioneventfn0ServiceRole30E080B7' ]
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
                        [ '/aws/lambda/', { Ref: 'functioneventfn01CDA78AF' } ]
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
                    S3Bucket: 'cdk-hnb659fds-assets-12344-us-west-2',
                    S3Key: 'eb5b005c858404ea0c8f68098ed5dcdf5340e02461f149751d10f59c210d5ef8.zip'
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
                Role: {
                    'Fn::GetAtt': [ 'httpapiauthorizerfnServiceRoleE977EE3D', 'Arn' ]
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
                Runtime: 'nodejs16.x',
                Timeout: 5
            },
            DependsOn: [ 'httpapiauthorizerfnServiceRoleE977EE3D' ]
        },
        httpapiauthorizerfnLogRetention5E1645C2: {
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
                            { Ref: 'httpapiauthorizerfn8B4D1E1C' }
                        ]
                    ]
                },
                RetentionInDays: 7
            }
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
                ApiId: { Ref: 'httpapihttpapi5E89BCFA' },
                IntegrationType: 'AWS_PROXY',
                IntegrationUri: { 'Fn::GetAtt': [ 'functioneventfn01CDA78AF', 'Arn' ] },
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
                FunctionName: { 'Fn::GetAtt': [ 'functioneventfn01CDA78AF', 'Arn' ] },
                Principal: 'apigateway.amazonaws.com',
                SourceArn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            { Ref: 'AWS::Partition' },
                            ':execute-api:us-west-2:12344:',
                            { Ref: 'httpapihttpapi5E89BCFA' },
                            '/*/*'
                        ]
                    ]
                }
            }
        },
        httpapihttpapiDefaultRouteBFDE9743: {
            Type: 'AWS::ApiGatewayV2::Route',
            Properties: {
                ApiId: { Ref: 'httpapihttpapi5E89BCFA' },
                RouteKey: '$default',
                AuthorizationType: 'CUSTOM',
                AuthorizerId: { Ref: 'httpapihttpapiauthorizer9218F2F9' },
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
        httpapihttpapiauthorizer9218F2F9: {
            Type: 'AWS::ApiGatewayV2::Authorizer',
            Properties: {
                ApiId: { Ref: 'httpapihttpapi5E89BCFA' },
                AuthorizerType: 'REQUEST',
                Name: 'http-api-http-lambda-authorizer',
                AuthorizerPayloadFormatVersion: '1.0',
                AuthorizerResultTtlInSeconds: 300,
                AuthorizerUri: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            { Ref: 'AWS::Partition' },
                            ':apigateway:us-west-2:lambda:path/2015-03-31/functions/',
                            {
                                'Fn::GetAtt': [ 'httpapiauthorizerfn8B4D1E1C', 'Arn' ]
                            },
                            '/invocations'
                        ]
                    ]
                },
                IdentitySource: [
                    '$request.header.x-auth-token',
                    '$context.identity.sourceIp'
                ]
            }
        },
        httpapihttpapistackhttpapihttpapiauthorizer75CF2ED6PermissionB6ED44F2: {
            Type: 'AWS::Lambda::Permission',
            Properties: {
                Action: 'lambda:InvokeFunction',
                FunctionName: { 'Fn::GetAtt': [ 'httpapiauthorizerfn8B4D1E1C', 'Arn' ] },
                Principal: 'apigateway.amazonaws.com',
                SourceArn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            { Ref: 'AWS::Partition' },
                            ':execute-api:us-west-2:12344:',
                            { Ref: 'httpapihttpapi5E89BCFA' },
                            '/authorizers/',
                            { Ref: 'httpapihttpapiauthorizer9218F2F9' }
                        ]
                    ]
                }
            }
        },
        httpapihttpapiDefaultStage2FC5FDEF: {
            Type: 'AWS::ApiGatewayV2::Stage',
            Properties: {
                ApiId: { Ref: 'httpapihttpapi5E89BCFA' },
                StageName: '$default',
                AutoDeploy: true
            }
        },
        distributionoriginrequestpolicyF5975AB2: {
            Type: 'AWS::CloudFront::OriginRequestPolicy',
            Properties: {
                OriginRequestPolicyConfig: {
                    CookiesConfig: { CookieBehavior: 'all' },
                    HeadersConfig: {
                        HeaderBehavior: 'allViewerAndWhitelistCloudFront',
                        Headers: [ 'CloudFront-Viewer-Address' ]
                    },
                    Name: 'distribution-origin-request-policy',
                    QueryStringsConfig: { QueryStringBehavior: 'all' }
                }
            }
        },
        distributioncfdistD32B15FD: {
            Type: 'AWS::CloudFront::Distribution',
            Properties: {
                DistributionConfig: {
                    Aliases: [ 'foo.bar.com' ],
                    Comment: 'distribution-cf-dist',
                    DefaultCacheBehavior: {
                        AllowedMethods: [
                            'GET',     'HEAD',
                            'OPTIONS', 'PUT',
                            'PATCH',   'POST',
                            'DELETE'
                        ],
                        CachePolicyId: '4135ea2d-6df8-44a3-9df3-4b5a84be39ad',
                        Compress: true,
                        FunctionAssociations: [],
                        OriginRequestPolicyId: { Ref: 'distributionoriginrequestpolicyF5975AB2' },
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
                                OriginSSLProtocols: [ 'TLSv1.2' ]
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
                                                        { Ref: 'httpapihttpapi5E89BCFA' },
                                                        '.execute-api.us-west-2.',
                                                        { Ref: 'AWS::URLSuffix' },
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
                                                { Ref: 'AWS::Partition' },
                                                ':secretsmanager:us-west-2:12344:secret:secrets-secrets/environment:SecretString:AUTHORIZER_TOKEN::}}'
                                            ]
                                        ]
                                    }
                                }
                            ]
                        }
                    ],
                    PriceClass: 'PriceClass_100',
                    ViewerCertificate: {
                        AcmCertificateArn: {
                            'Fn::GetAtt': [
                                'certfoobarcomuseast1CertificateRequestorResourceC3ACAF62',
                                'Arn'
                            ]
                        },
                        MinimumProtocolVersion: 'TLSv1.2_2019',
                        SslSupportMethod: 'sni-only'
                    }
                }
            }
        }
    }
}