const {MatchHelper} = require("../../src/utils/testing/match-helper");
module.exports = {
    Resources: {
        myappdefaultfoobarcom221C8B61: {
            Type: 'AWS::CertificateManager::Certificate',
            Properties: {
                DomainName: 'foo.bar.com',
                DomainValidationOptions: [{DomainName: 'foo.bar.com', HostedZoneId: 'DUMMY'}],
                Tags: [
                    {Key: 'Name', Value: 'stack/my-app-default-foo.bar.com'}
                ],
                ValidationMethod: 'DNS'
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        funcwebfn0lg7D0BB952: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {RetentionInDays: 30},
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
                LoggingConfig: {LogGroup: {Ref: 'funcwebfn0lg7D0BB952'}},
                MemorySize: 512,
                Role: {'Fn::GetAtt': ['funcwebfn0ServiceRoleA9004225', 'Arn']},
                Runtime: 'provided.al2',
                Timeout: 28
            },
            DependsOn: ['funcwebfn0ServiceRoleA9004225']
        },
        myapplocalfoobarcom8042E6FE: {
            Type: 'AWS::CertificateManager::Certificate',
            Properties: {
                DomainName: 'foo.bar.com',
                DomainValidationOptions: [{DomainName: 'foo.bar.com', HostedZoneId: 'DUMMY'}],
                Tags: [{Key: 'Name', Value: 'stack/my-app-local-foo.bar.com'}],
                ValidationMethod: 'DNS'
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        myappauthorizerfnlg23C1AACD: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {RetentionInDays: 7},
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
                LoggingConfig: {LogGroup: {Ref: 'myappauthorizerfnlg23C1AACD'}},
                Role: {
                    'Fn::GetAtt': ['myappauthorizerfnServiceRole2952ABDD', 'Arn']
                },
                Runtime: MatchHelper.startsWith('nodejs'),
                Timeout: 5
            },
            DependsOn: ['myappauthorizerfnServiceRole2952ABDD']
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
                Description: 'Automatically created by the RestApi construct',
                RestApiId: {Ref: 'myapprestapiA58A667F'}
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
                DeploymentId: {
                    Ref: 'myapprestapiDeployment12B3E9C9195db37062f799c38906cb088bd6ffdd'
                },
                RestApiId: {Ref: 'myapprestapiA58A667F'},
                StageName: 'prod'
            },
            DependsOn: ['myapprestapiAccount8A1D9816']
        },
        myapprestapiCustomDomain41938B8D: {
            Type: 'AWS::ApiGateway::DomainName',
            Properties: {
                DomainName: 'foo.bar.com',
                EndpointConfiguration: {Types: ['REGIONAL']},
                RegionalCertificateArn: {Ref: 'myapplocalfoobarcom8042E6FE'}
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
                                {'Fn::GetAtt': ['funcwebfn067A6530A', 'Arn']},
                                '/invocations'
                            ]
                        ]
                    }
                },
                ResourceId: {Ref: 'myapprestapiproxyA8E921A0'},
                RestApiId: {Ref: 'myapprestapiA58A667F'}
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
                                {'Fn::GetAtt': ['funcwebfn067A6530A', 'Arn']},
                                '/invocations'
                            ]
                        ]
                    }
                },
                ResourceId: {
                    'Fn::GetAtt': ['myapprestapiA58A667F', 'RootResourceId']
                },
                RestApiId: {Ref: 'myapprestapiA58A667F'}
            }
        },
        myappassets1E699741: {
            Type: 'AWS::S3::Bucket',
            Properties: {
                BucketEncryption: {
                    ServerSideEncryptionConfiguration: [
                        {
                            ServerSideEncryptionByDefault: {SSEAlgorithm: 'AES256'}
                        }
                    ]
                },
                BucketName: 'my-app-assets',
                OwnershipControls: {Rules: [{ObjectOwnership: 'BucketOwnerEnforced'}]},
                PublicAccessBlockConfiguration: {
                    BlockPublicAcls: true,
                    BlockPublicPolicy: true,
                    IgnorePublicAcls: true,
                    RestrictPublicBuckets: true
                },
                Tags: [
                    {Key: 'aws-cdk:cr-owned:assets:93eef604', Value: 'true'}
                ]
            },
            UpdateReplacePolicy: 'Retain',
            DeletionPolicy: 'Retain'
        },
        myappassetsPolicy7F00A2B3: {
            Type: 'AWS::S3::BucketPolicy',
            Properties: {
                Bucket: {Ref: 'myappassets1E699741'},
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 's3:*',
                            Condition: {Bool: {'aws:SecureTransport': 'false'}},
                            Effect: 'Deny',
                            Principal: {AWS: '*'},
                            Resource: [
                                {'Fn::GetAtt': ['myappassets1E699741', 'Arn']},
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': ['myappassets1E699741', 'Arn']
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
                              { Ref: 'myappcfdist8AC41345' }
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
                                            'Fn::GetAtt': ['myappassets1E699741', 'Arn']
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
            Properties: {RetentionInDays: 1},
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        s3assetscopyAwsCliLayerA9EB8F42: {
            Type: 'AWS::Lambda::LayerVersion',
            Properties: {
                Content: {
                    S3Bucket: 'cdk-hnb659fds-assets-12344-us-west-2',
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
                SourceBucketNames: ['cdk-hnb659fds-assets-12344-us-west-2'],
                SourceObjectKeys: [
                    MatchHelper.endsWith('zip')
                ],
                DestinationBucketName: {Ref: 'myappassets1E699741'},
                DestinationBucketKeyPrefix: 'assets',
                Prune: true
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
                                            ':s3:::cdk-hnb659fds-assets-12344-us-west-2'
                                        ]
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':s3:::cdk-hnb659fds-assets-12344-us-west-2/*'
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
                                {'Fn::GetAtt': ['myappassets1E699741', 'Arn']},
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': ['myappassets1E699741', 'Arn']
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
                    S3Bucket: 'cdk-hnb659fds-assets-12344-us-west-2',
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
                Timeout: 900
            },
            DependsOn: [
                'CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756CServiceRoleDefaultPolicy88902FDF',
                'CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756CServiceRole89A01265'
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
                    CacheBehaviors: [
                        {
                            CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
                            Compress: true,
                            PathPattern: 'assets/*',
                            TargetOriginId: 'stackmyappcfdistOrigin208B05384',
                            ViewerProtocolPolicy: 'redirect-to-https'
                        },
                        {
                            CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
                            Compress: true,
                            PathPattern: '/favicon.ico',
                            TargetOriginId: 'stackmyappcfdistOrigin3F2382364',
                            ViewerProtocolPolicy: 'redirect-to-https'
                        },
                        {
                            CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
                            Compress: true,
                            PathPattern: '/robots.txt',
                            TargetOriginId: 'stackmyappcfdistOrigin3F2382364',
                            ViewerProtocolPolicy: 'redirect-to-https'
                        }
                    ],
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
                                    HeaderValue: 'INVALID'
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
                        },
                        {
                            DomainName: {
                                'Fn::GetAtt': ['myappassets1E699741', 'RegionalDomainName']
                            },
                            Id: 'stackmyappcfdistOrigin208B05384',
                    OriginAccessControlId: {
                      'Fn::GetAtt': [
                        'myappcfdistOrigin2S3OriginAccessControl48A66C5D',
                        'Id'
                                        ]
                    },
                    S3OriginConfig: { OriginAccessIdentity: '' }
                        },
                        {
                            DomainName: {
                                'Fn::GetAtt': ['myappassets1E699741', 'RegionalDomainName']
                            },
                            Id: 'stackmyappcfdistOrigin3F2382364',
                    OriginAccessControlId: {
                      'Fn::GetAtt': [
                        'myappcfdistOrigin3S3OriginAccessControlAF6F4C51',
                        'Id'
                      ]
                    },
                            OriginPath: '/assets',
                    S3OriginConfig: { OriginAccessIdentity: '' }
                        }
                    ],
                    PriceClass: 'PriceClass_100',
                    ViewerCertificate: {
                        AcmCertificateArn: {Ref: 'myappdefaultfoobarcom221C8B61'},
                        MinimumProtocolVersion: 'TLSv1.2_2019',
                        SslSupportMethod: 'sni-only'
                    }
                }
            }
        },
          myappcfdistOrigin2S3OriginAccessControl48A66C5D: {
            Type: 'AWS::CloudFront::OriginAccessControl',
            Properties: {
              OriginAccessControlConfig: {
                Name: 'stackmyappcfdistOrigin2S3OriginAccessControl503EACDD',
                OriginAccessControlOriginType: 's3',
                SigningBehavior: 'always',
                SigningProtocol: 'sigv4'
              }
            }
        },
          myappcfdistOrigin3S3OriginAccessControlAF6F4C51: {
            Type: 'AWS::CloudFront::OriginAccessControl',
            Properties: {
              OriginAccessControlConfig: {
                Name: 'stackmyappcfdistOrigin3S3OriginAccessControlBC9883B3',
                OriginAccessControlOriginType: 's3',
                SigningBehavior: 'always',
                SigningProtocol: 'sigv4'
              }
            }
        }
    }
}