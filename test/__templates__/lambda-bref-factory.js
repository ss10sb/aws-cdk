module.exports = {
    Resources: {
        myappfoobarcomCertificateRequestorFunctionServiceRole1A8B583A: {
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
        myappfoobarcomCertificateRequestorFunctionServiceRoleDefaultPolicyB792092A: {
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
                PolicyName: 'myappfoobarcomCertificateRequestorFunctionServiceRoleDefaultPolicyB792092A',
                Roles: [
                    {
                        Ref: 'myappfoobarcomCertificateRequestorFunctionServiceRole1A8B583A'
                    }
                ]
            }
        },
        myappfoobarcomCertificateRequestorFunctionE04346D1: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-12344-us-west-2',
                    S3Key: 'e85f10a8bf0e7f4f7931fce24b29d4faf6874948090a2b568b2da33a7116cf84.zip'
                },
                Role: {
                    'Fn::GetAtt': [
                        'myappfoobarcomCertificateRequestorFunctionServiceRole1A8B583A',
                        'Arn'
                    ]
                },
                Handler: 'index.certificateRequestHandler',
                Runtime: 'nodejs14.x',
                Timeout: 900
            },
            DependsOn: [
                'myappfoobarcomCertificateRequestorFunctionServiceRoleDefaultPolicyB792092A',
                'myappfoobarcomCertificateRequestorFunctionServiceRole1A8B583A'
            ]
        },
        myappfoobarcomCertificateRequestorResource1FF26786: {
            Type: 'AWS::CloudFormation::CustomResource',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': [
                        'myappfoobarcomCertificateRequestorFunctionE04346D1',
                        'Arn'
                    ]
                },
                DomainName: 'foo.bar.com',
                HostedZoneId: 'DUMMY',
                Region: 'us-east-1'
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
        funcwebfn067A6530A: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-12344-us-west-2',
                    S3Key: 'ce9adb4fda6fdc569b2bd894a02aa2f273695def9558c5ad237cedf56562f55e.zip'
                },
                Role: { 'Fn::GetAtt': [ 'funcwebfn0ServiceRoleA9004225', 'Arn' ] },
                FunctionName: 'func-web-fn-0',
                Handler: 'public/index.php',
                Layers: [
                    {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                { Ref: 'AWS::Partition' },
                                ':lambda:us-west-2:209497400698:layer/php-81-fpm:28'
                            ]
                        ]
                    }
                ],
                Runtime: 'provided.al2',
                Timeout: 120
            },
            DependsOn: [ 'funcwebfn0ServiceRoleA9004225' ]
        },
        myappdefault218ED08E: {
            Type: 'AWS::ApiGatewayV2::Api',
            Properties: {
                DisableExecuteApiEndpoint: true,
                Name: 'my-app-default',
                ProtocolType: 'HTTP'
            }
        },
        myappdefaultDefaultRoutemyappdefaultint147514D2: {
            Type: 'AWS::ApiGatewayV2::Integration',
            Properties: {
                ApiId: { Ref: 'myappdefault218ED08E' },
                IntegrationType: 'AWS_PROXY',
                IntegrationUri: { 'Fn::GetAtt': [ 'funcwebfn067A6530A', 'Arn' ] },
                PayloadFormatVersion: '2.0'
            }
        },
        myappdefaultDefaultRoutemyappdefaultintPermission39FFD5DD: {
            Type: 'AWS::Lambda::Permission',
            Properties: {
                Action: 'lambda:InvokeFunction',
                FunctionName: { 'Fn::GetAtt': [ 'funcwebfn067A6530A', 'Arn' ] },
                Principal: 'apigateway.amazonaws.com',
                SourceArn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            { Ref: 'AWS::Partition' },
                            ':execute-api:us-west-2:12344:',
                            { Ref: 'myappdefault218ED08E' },
                            '/*/*'
                        ]
                    ]
                }
            }
        },
        myappdefaultDefaultRouteAE84B4D4: {
            Type: 'AWS::ApiGatewayV2::Route',
            Properties: {
                ApiId: { Ref: 'myappdefault218ED08E' },
                RouteKey: '$default',
                AuthorizationType: 'NONE',
                Target: {
                    'Fn::Join': [
                        '',
                        [
                            'integrations/',
                            {
                                Ref: 'myappdefaultDefaultRoutemyappdefaultint147514D2'
                            }
                        ]
                    ]
                }
            }
        },
        myappdefaultDefaultStage8523A78B: {
            Type: 'AWS::ApiGatewayV2::Stage',
            Properties: {
                ApiId: { Ref: 'myappdefault218ED08E' },
                StageName: '$default',
                AutoDeploy: true
            }
        },
        myappcfwdBE0EA7E2: {
            Type: 'AWS::CloudFront::Distribution',
            Properties: {
                DistributionConfig: {
                    Aliases: [ 'foo.bar.com' ],
                    DefaultCacheBehavior: {
                        AllowedMethods: [
                            'GET',     'HEAD',
                            'OPTIONS', 'PUT',
                            'PATCH',   'POST',
                            'DELETE'
                        ],
                        CachePolicyId: '4135ea2d-6df8-44a3-9df3-4b5a84be39ad',
                        Compress: true,
                        TargetOriginId: 'stackmyappcfwdOrigin1B5A8BDA9',
                        ViewerProtocolPolicy: 'redirect-to-https'
                    },
                    Enabled: true,
                    HttpVersion: 'http2',
                    IPV6Enabled: true,
                    Origins: [
                        {
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
                                                        { Ref: 'myappdefault218ED08E' },
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
                            Id: 'stackmyappcfwdOrigin1B5A8BDA9',
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
                                                                    { Ref: 'myappdefault218ED08E' },
                                                                    '.execute-api.us-west-2.',
                                                                    { Ref: 'AWS::URLSuffix' },
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
                        AcmCertificateArn: {
                            'Fn::GetAtt': [
                                'myappfoobarcomCertificateRequestorResource1FF26786',
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