const {MatchHelper} = require("../../src/utils/testing/match-helper");
module.exports = {
    Resources: {
        stackbuckets3files2028AFD4: {
            Type: 'AWS::S3::Bucket',
            Properties: {
                BucketEncryption: {
                    ServerSideEncryptionConfiguration: [
                        {
                            ServerSideEncryptionByDefault: {SSEAlgorithm: 'aws:kms'}
                        }
                    ]
                },
                BucketName: 'stack-bucket-s3-files',
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
        stackbuckets3filesPolicy2C434124: {
            Type: 'AWS::S3::BucketPolicy',
            Properties: {
                Bucket: {Ref: 'stackbuckets3files2028AFD4'},
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 's3:*',
                            Condition: {Bool: {'aws:SecureTransport': 'false'}},
                            Effect: 'Deny',
                            Principal: {AWS: '*'},
                            Resource: [
                                {
                                    'Fn::GetAtt': ['stackbuckets3files2028AFD4', 'Arn']
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': ['stackbuckets3files2028AFD4', 'Arn']
                                            },
                                            '/*'
                                        ]
                                    ]
                                }
                            ]
                        }
                    ],
                    Version: '2012-10-17'
                }
            }
        },
        stackbuckets3filesnfsroleC4B20C4D: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: {Service: 'elasticfilesystem.amazonaws.com'}
                        }
                    ],
                    Version: '2012-10-17'
                }
            }
        },
        stackbuckets3filesnfsroleDefaultPolicy8F6B3059: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 's3:ListBucket*',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': ['stackbuckets3files2028AFD4', 'Arn']
                            }
                        },
                        {
                            Action: [
                                's3:AbortMultipartUpload',
                                's3:DeleteObject',
                                's3:GetObject*',
                                's3:List*',
                                's3:PutObject*'
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        {
                                            'Fn::GetAtt': ['stackbuckets3files2028AFD4', 'Arn']
                                        },
                                        '/*'
                                    ]
                                ]
                            }
                        },
                        {
                            Action: [
                                'events:DeleteRule',
                                'events:DisableRule',
                                'events:EnableRule',
                                'events:PutRule',
                                'events:PutTargets',
                                'events:RemoveTargets'
                            ],
                            Condition: {
                                StringEquals: {
                                    'events:ManagedBy': 'elasticfilesystem.amazonaws.com'
                                }
                            },
                            Effect: 'Allow',
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {Ref: 'AWS::Partition'},
                                        ':events:*:*:rule/DO-NOT-DELETE-S3-Files*'
                                    ]
                                ]
                            }
                        },
                        {
                            Action: [
                                'events:DescribeRule',
                                'events:ListRuleNamesByTarget',
                                'events:ListRules',
                                'events:ListTargetsByRule'
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {Ref: 'AWS::Partition'},
                                        ':events:*:*:rule/*'
                                    ]
                                ]
                            }
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
                                {
                                    'Fn::GetAtt': ['stackbuckets3files2028AFD4', 'Arn']
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': ['stackbuckets3files2028AFD4', 'Arn']
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
                PolicyName: 'stackbuckets3filesnfsroleDefaultPolicy8F6B3059',
                Roles: [{Ref: 'stackbuckets3filesnfsroleC4B20C4D'}]
            }
        },
        stackbuckets3filesnfs: {
            Type: 'AWS::S3Files::FileSystem',
            Properties: {
                Bucket: {'Fn::GetAtt': ['stackbuckets3files2028AFD4', 'Arn']},
                RoleArn: {
                    'Fn::GetAtt': ['stackbuckets3filesnfsroleC4B20C4D', 'Arn']
                }
            }
        },
        stackbuckets3filesnfssg1C8F8B2D: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                GroupDescription: 'S3 Files traffic',
                SecurityGroupEgress: [
                    {
                        CidrIp: '0.0.0.0/0',
                        Description: 'Allow all outbound traffic by default',
                        IpProtocol: '-1'
                    }
                ],
                SecurityGroupIngress: [
                    {
                        CidrIp: '1.2.3.4/5',
                        Description: 'Allow NFS from VPC',
                        FromPort: 2049,
                        IpProtocol: 'tcp',
                        ToPort: 2049
                    }
                ],
                VpcId: 'vpc-12345'
            }
        },
        stackbuckets3filesnfsmt0: {
            Type: 'AWS::S3Files::MountTarget',
            Properties: {
                FileSystemId: {'Fn::GetAtt': ['stackbuckets3filesnfs', 'FileSystemId']},
                IpAddressType: 'ipv4',
                SecurityGroups: [
                    {
                        'Fn::GetAtt': ['stackbuckets3filesnfssg1C8F8B2D', 'GroupId']
                    }
                ],
                SubnetId: 'p-12345'
            }
        },
        stackbuckets3filesnfsmt1: {
            Type: 'AWS::S3Files::MountTarget',
            Properties: {
                FileSystemId: {'Fn::GetAtt': ['stackbuckets3filesnfs', 'FileSystemId']},
                IpAddressType: 'ipv4',
                SecurityGroups: [
                    {
                        'Fn::GetAtt': ['stackbuckets3filesnfssg1C8F8B2D', 'GroupId']
                    }
                ],
                SubnetId: 'p-67890'
            }
        },
        testroleB50A37BE: {
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
                RoleName: 'test-role'
            }
        },
        stackbuckets3filesfspolicy0: {
            Type: 'AWS::S3Files::FileSystemPolicy',
            Properties: {
                FileSystemId: {'Fn::GetAtt': ['stackbuckets3filesnfs', 'FileSystemId']},
                Policy: {
                    Version: '2012-10-17',
                    Statement: [
                        {
                            Effect: 'Allow',
                            Principal: {
                                AWS: {'Fn::GetAtt': ['testroleB50A37BE', 'Arn']}
                            },
                            Action: [
                                's3files:ClientMount',
                                's3files:ClientWrite',
                                's3files:ClientRootAccess'
                            ],
                            Resource: {
                                'Fn::GetAtt': ['stackbuckets3filesnfs', 'FileSystemArn']
                            }
                        }
                    ]
                }
            }
        }
    }
};