const {MatchHelper} = require("../../src/utils/testing/match-helper");
module.exports = {
    Resources: {
        targetgroup897B0682: {
            Type: 'AWS::ElasticLoadBalancingV2::TargetGroup',
            Properties: {
                Name: 'target-group',
                TargetType: 'lambda',
                Targets: [
                    { Id: { 'Fn::GetAtt': [ 'funcwebfn067A6530A', 'Arn' ] } }
                ]
            },
            DependsOn: [
                'funcwebfn0Invoke2UTWxhlfyqbT5FTn5jvgbLgjFfJwzswGk55DU1HYA5F14DD0'
            ]
        },
        assetsfoobarcom0A6DB6C9: {
            Type: 'AWS::S3::Bucket',
            Properties: {
                BucketName: 'assets-foo-bar-com',
                CorsConfiguration: {
                    CorsRules: [
                        {
                            AllowedHeaders: [ '*' ],
                            AllowedMethods: [ 'GET' ],
                            AllowedOrigins: [ 'https://foo.bar.com' ],
                            MaxAge: 3000
                        }
                    ]
                },
                PublicAccessBlockConfiguration: {
                    BlockPublicAcls: false,
                    BlockPublicPolicy: false,
                    IgnorePublicAcls: false,
                    RestrictPublicBuckets: false
                }
            },
            UpdateReplacePolicy: 'Retain',
            DeletionPolicy: 'Retain'
        },
        assetsfoobarcomPolicyDD38D5BE: {
            Type: 'AWS::S3::BucketPolicy',
            Properties: {
                Bucket: { Ref: 'assetsfoobarcom0A6DB6C9' },
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 's3:*',
                            Condition: { Bool: { 'aws:SecureTransport': 'false' } },
                            Effect: 'Deny',
                            Principal: { AWS: '*' },
                            Resource: [
                                {
                                    'Fn::GetAtt': [ 'assetsfoobarcom0A6DB6C9', 'Arn' ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [ 'assetsfoobarcom0A6DB6C9', 'Arn' ]
                                            },
                                            '/*'
                                        ]
                                    ]
                                }
                            ]
                        },
                        {
                            Action: 's3:GetObject',
                            Effect: 'Allow',
                            Principal: { AWS: '*' },
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        {
                                            'Fn::GetAtt': [ 'assetsfoobarcom0A6DB6C9', 'Arn' ]
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
                    },
                    {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                { Ref: 'AWS::Partition' },
                                ':iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole'
                            ]
                        ]
                    }
                ]
            }
        },
        funcwebfn0SecurityGroup727361E5: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                GroupDescription: 'Automatic security group for Lambda Function stackfuncwebfn0D79057EC',
                SecurityGroupEgress: [
                    {
                        CidrIp: '0.0.0.0/0',
                        Description: 'Allow all outbound traffic by default',
                        IpProtocol: '-1'
                    }
                ],
                VpcId: 'vpc-12345'
            }
        },
        funcwebfn067A6530A: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-12344-us-west-2',
                    S3Key: MatchHelper.endsWith('zip')
                },
                Environment: {
                    Variables: {
                        S3_ASSET_URL: {
                            'Fn::Join': [
                                '',
                                [
                                    'https://',
                                    {
                                        'Fn::GetAtt': [ 'assetsfoobarcom0A6DB6C9', 'DomainName' ]
                                    }
                                ]
                            ]
                        },
                        SECRETS_LOOKUP: {
                            'Fn::Join': [
                                '',
                                [
                                    'bref-secretsmanager:arn:',
                                    { Ref: 'AWS::Partition' },
                                    ':secretsmanager:us-west-2:12344:secret:secrets-secrets/environment'
                                ]
                            ]
                        }
                    }
                },
                FunctionName: 'func-web-fn-0',
                Handler: 'public/index.php',
                Layers: [
                    {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                { Ref: 'AWS::Partition' },
                                ':lambda:us-west-2:534081306603:layer:php-81-fpm:59'
                            ]
                        ]
                    }
                ],
                MemorySize: 512,
                Role: { 'Fn::GetAtt': [ 'funcwebfn0ServiceRoleA9004225', 'Arn' ] },
                Runtime: 'provided.al2',
                Timeout: 120,
                VpcConfig: {
                    SecurityGroupIds: [
                        {
                            'Fn::GetAtt': [ 'funcwebfn0SecurityGroup727361E5', 'GroupId' ]
                        }
                    ],
                    SubnetIds: [ 'p-12345', 'p-67890' ]
                }
            },
            DependsOn: [ 'funcwebfn0ServiceRoleA9004225' ]
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
                    'Fn::Join': [ '', [ '/aws/lambda/', { Ref: 'funcwebfn067A6530A' } ] ]
                },
                RetentionInDays: 30
            }
        },
        funcwebfn0Invoke2UTWxhlfyqbT5FTn5jvgbLgjFfJwzswGk55DU1HYA5F14DD0: {
            Type: 'AWS::Lambda::Permission',
            Properties: {
                Action: 'lambda:InvokeFunction',
                FunctionName: { 'Fn::GetAtt': [ 'funcwebfn067A6530A', 'Arn' ] },
                Principal: 'elasticloadbalancing.amazonaws.com'
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
                Runtime: 'nodejs18.x',
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-12344-us-west-2',
                    S3Key: '5cc92ed0cea39e2b8de2dbc527dfb5980a3af9564bd1084d840b9787c7d0467e.zip'
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
        }
    }
}