const {MatchHelper} = require("../../src/utils/testing/match-helper");
module.exports = {
    Resources: {
        targetgroup897B0682: {
            Type: 'AWS::ElasticLoadBalancingV2::TargetGroup',
            Properties: {
                Name: 'target-group',
                TargetType: 'lambda',
                Targets: [
                { Id: { 'Fn::GetAtt': [ 'stackwebfn08880B307', 'Arn' ] } }
                ]
            },
            DependsOn: [
              'stackwebfn0Invoke2UTWxhlfyqbT5FTn5jvgbLgjFfJwzswGk55DU1HYE5F3E067'
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
          stackwebfn0lg1862EC8E: {
            Type: 'AWS::Logs::LogGroup',
            Properties: { RetentionInDays: 30 },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
          },
          stackwebfn0ServiceRole75FD7552: {
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
          stackwebfn0SecurityGroup6FF1F874: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
              GroupDescription: 'Automatic security group for Lambda Function stackstackwebfn089E2CE1B',
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
          stackwebfn08880B307: {
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
                  ASSET_URL: {
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
                  BREF_LOAD_SECRETS: 'bref-ssm:loadOnly',
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
              FunctionName: 'stack-web-fn-0',
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
              LoggingConfig: { LogGroup: { Ref: 'stackwebfn0lg1862EC8E' } },
                MemorySize: 512,
              Role: { 'Fn::GetAtt': [ 'stackwebfn0ServiceRole75FD7552', 'Arn' ] },
                Runtime: 'provided.al2',
                Timeout: 120,
                VpcConfig: {
                    SecurityGroupIds: [
                        {
                    'Fn::GetAtt': [ 'stackwebfn0SecurityGroup6FF1F874', 'GroupId' ]
                        }
                    ],
                    SubnetIds: [ 'p-12345', 'p-67890' ]
                }
            },
            DependsOn: [ 'stackwebfn0ServiceRole75FD7552' ]
        },
          stackwebfn0Invoke2UTWxhlfyqbT5FTn5jvgbLgjFfJwzswGk55DU1HYE5F3E067: {
            Type: 'AWS::Lambda::Permission',
            Properties: {
                Action: 'lambda:InvokeFunction',
              FunctionName: { 'Fn::GetAtt': [ 'stackwebfn08880B307', 'Arn' ] },
                Principal: 'elasticloadbalancing.amazonaws.com'
            }
        }
    }
}