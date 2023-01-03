module.exports = {
    Resources: {
        myappfoobarcomuseast1CertificateRequestorFunctionServiceRoleE778C848: {
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
        myappfoobarcomuseast1CertificateRequestorFunctionServiceRoleDefaultPolicy0FB0BFF9: {
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
                PolicyName: 'myappfoobarcomuseast1CertificateRequestorFunctionServiceRoleDefaultPolicy0FB0BFF9',
                Roles: [
                    {
                        Ref: 'myappfoobarcomuseast1CertificateRequestorFunctionServiceRoleE778C848'
                    }
                ]
            }
        },
        myappfoobarcomuseast1CertificateRequestorFunctionEC985F99: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-12344-us-west-2',
                    S3Key: '8ddf29ab619460567d3cda58de2ff1bf0f6e95d8822ff630ec58a4d52ed1fa67.zip'
                },
                Role: {
                    'Fn::GetAtt': [
                        'myappfoobarcomuseast1CertificateRequestorFunctionServiceRoleE778C848',
                        'Arn'
                    ]
                },
                Handler: 'index.certificateRequestHandler',
                Runtime: 'nodejs14.x',
                Timeout: 900
            },
            DependsOn: [
                'myappfoobarcomuseast1CertificateRequestorFunctionServiceRoleDefaultPolicy0FB0BFF9',
                'myappfoobarcomuseast1CertificateRequestorFunctionServiceRoleE778C848'
            ]
        },
        myappfoobarcomuseast1CertificateRequestorResource3662DFC0: {
            Type: 'AWS::CloudFormation::CustomResource',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': [
                        'myappfoobarcomuseast1CertificateRequestorFunctionEC985F99',
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
                    S3Key: 'a701d9c4e1414bfb5bdc604564a232c79e82fa1c4186ebc7245836fb15ee2c49.zip'
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
                                ':lambda:us-west-2:209497400698:layer:php-81-fpm:28'
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
        myappfoobarcomdefaultCertificateRequestorFunctionServiceRoleE779F489: {
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
        myappfoobarcomdefaultCertificateRequestorFunctionServiceRoleDefaultPolicy34FF517E: {
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
                PolicyName: 'myappfoobarcomdefaultCertificateRequestorFunctionServiceRoleDefaultPolicy34FF517E',
                Roles: [
                    {
                        Ref: 'myappfoobarcomdefaultCertificateRequestorFunctionServiceRoleE779F489'
                    }
                ]
            }
        },
        myappfoobarcomdefaultCertificateRequestorFunctionFAF97FED: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-12344-us-west-2',
                    S3Key: '8ddf29ab619460567d3cda58de2ff1bf0f6e95d8822ff630ec58a4d52ed1fa67.zip'
                },
                Role: {
                    'Fn::GetAtt': [
                        'myappfoobarcomdefaultCertificateRequestorFunctionServiceRoleE779F489',
                        'Arn'
                    ]
                },
                Handler: 'index.certificateRequestHandler',
                Runtime: 'nodejs14.x',
                Timeout: 900
            },
            DependsOn: [
                'myappfoobarcomdefaultCertificateRequestorFunctionServiceRoleDefaultPolicy34FF517E',
                'myappfoobarcomdefaultCertificateRequestorFunctionServiceRoleE779F489'
            ]
        },
        myappfoobarcomdefaultCertificateRequestorResource1A22308B: {
            Type: 'AWS::CloudFormation::CustomResource',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': [
                        'myappfoobarcomdefaultCertificateRequestorFunctionFAF97FED',
                        'Arn'
                    ]
                },
                DomainName: 'foo.bar.com',
                HostedZoneId: 'DUMMY',
                CleanupRecords: 'true'
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
                    S3Key: 'c53d3eefd84eda81ec21cae72089e12b7729368cb85e86fc9fb8b2031b76415b.zip'
                },
                Role: {
                    'Fn::GetAtt': ['myappauthorizerfnServiceRole2952ABDD', 'Arn']
                },
                Environment: {Variables: {AUTHORIZER_TOKEN: 'INVALID'}},
                FunctionName: 'my-app-authorizer-fn',
                Handler: 'token.handler',
                Runtime: 'nodejs16.x',
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
        myappdomainnamefoobarcomB8FC36EF: {
            Type: 'AWS::ApiGatewayV2::DomainName',
            Properties: {
                DomainName: 'foo.bar.com',
                DomainNameConfigurations: [
                    {
                        CertificateArn: {
                            'Fn::GetAtt': [
                                'myappfoobarcomdefaultCertificateRequestorResource1A22308B',
                                'Arn'
                            ]
                        },
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
                RouteKey: '$default',
                AuthorizationType: 'CUSTOM',
                AuthorizerId: {Ref: 'myapphttpapiauthorizerFB2D4417'},
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
                AuthorizerType: 'REQUEST',
                Name: 'my-app-http-lambda-authorizer',
                AuthorizerPayloadFormatVersion: '1.0',
                AuthorizerResultTtlInSeconds: 300,
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
                ]
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
                StageName: '$default',
                AutoDeploy: true
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
                        AcmCertificateArn: {
                            'Fn::GetAtt': [
                                'myappfoobarcomuseast1CertificateRequestorResource3662DFC0',
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