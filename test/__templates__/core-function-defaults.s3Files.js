const {MatchHelper} = require("../../src/utils/testing/match-helper");
module.exports = {
    Resources: {
        stacks3filesA500DFEA: {
            Type: 'AWS::S3::Bucket',
            Properties: {
                BucketEncryption: {
                    ServerSideEncryptionConfiguration: [
                        {
                            ServerSideEncryptionByDefault: {SSEAlgorithm: 'aws:kms'}
                        }
                    ]
                },
                BucketName: 'stack-s3-files',
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
        stacks3filesPolicyDA68A662: {
            Type: 'AWS::S3::BucketPolicy',
            Properties: {
                Bucket: {Ref: 'stacks3filesA500DFEA'},
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 's3:*',
                            Condition: {Bool: {'aws:SecureTransport': 'false'}},
                            Effect: 'Deny',
                            Principal: {AWS: '*'},
                            Resource: [
                                {'Fn::GetAtt': ['stacks3filesA500DFEA', 'Arn']},
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': ['stacks3filesA500DFEA', 'Arn']
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
        stacks3filesnfsroleD3DF3C5C: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                    Principal: { Service: 'elasticfilesystem.amazonaws.com' }
                        }
                    ],
                    Version: '2012-10-17'
                }
            }
        },
        stacks3filesnfsroleDefaultPolicy5935F81E: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                    Action: 's3:ListBucket*',
                    Effect: 'Allow',
                    Resource: { 'Fn::GetAtt': [ 'stacks3filesA500DFEA', 'Arn' ] }
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
                            'Fn::GetAtt': [ 'stacks3filesA500DFEA', 'Arn' ]
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
                          { Ref: 'AWS::Partition' },
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
                          { Ref: 'AWS::Partition' },
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
                                {'Fn::GetAtt': ['stacks3filesA500DFEA', 'Arn']},
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': ['stacks3filesA500DFEA', 'Arn']
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
                PolicyName: 'stacks3filesnfsroleDefaultPolicy5935F81E',
                Roles: [{Ref: 'stacks3filesnfsroleD3DF3C5C'}]
            }
        },
        stacks3filesnfs: {
            Type: 'AWS::S3Files::FileSystem',
            Properties: {
                Bucket: {'Fn::GetAtt': ['stacks3filesA500DFEA', 'Arn']},
                RoleArn: {'Fn::GetAtt': ['stacks3filesnfsroleD3DF3C5C', 'Arn']}
            }
        },
          stacks3filesnfsstacks3filesap00BDD77AA: {
            Type: 'AWS::S3Files::AccessPoint',
            Properties: {
              FileSystemId: { 'Fn::GetAtt': [ 'stacks3filesnfs', 'FileSystemId' ] },
              PosixUser: { Gid: '1000', Uid: '1000' },
              RootDirectory: {
                CreationPermissions: { OwnerGid: '1000', OwnerUid: '1000', Permissions: '750' },
                Path: '/'
              }
            }
          },
          stacks3filesnfsstacks3filesap0MountTargetSG0fromstackfunctionwebfn0SecurityGroup9F97A0772049639B4EB4: {
            Type: 'AWS::EC2::SecurityGroupIngress',
            Properties: {
              Description: 'from stackfunctionwebfn0SecurityGroup9F97A077:2049',
              FromPort: 2049,
              GroupId: { 'Fn::GetAtt': [ 'stacks3filesnfssgF8F88AD5', 'GroupId' ] },
              IpProtocol: 'tcp',
              SourceSecurityGroupId: {
                'Fn::GetAtt': [ 'functionwebfn0SecurityGroupCFD2651F', 'GroupId' ]
              },
              ToPort: 2049
            }
          },
        stacks3filesnfssgF8F88AD5: {
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
        stacks3filesnfsmt0: {
            Type: 'AWS::S3Files::MountTarget',
            Properties: {
              FileSystemId: { 'Fn::GetAtt': [ 'stacks3filesnfs', 'FileSystemId' ] },
              IpAddressType: 'ipv4',
                SecurityGroups: [
                    {
                        'Fn::GetAtt': ['stacks3filesnfssgF8F88AD5', 'GroupId']
                    }
                ],
                SubnetId: 'p-12345'
            }
        },
        stacks3filesnfsmt1: {
            Type: 'AWS::S3Files::MountTarget',
            Properties: {
              FileSystemId: { 'Fn::GetAtt': [ 'stacks3filesnfs', 'FileSystemId' ] },
              IpAddressType: 'ipv4',
                SecurityGroups: [
                    {
                        'Fn::GetAtt': ['stacks3filesnfssgF8F88AD5', 'GroupId']
                    }
                ],
                SubnetId: 'p-67890'
            }
        },
        functionwebfn0lgD95A7CF9: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {RetentionInDays: 30},
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        functionwebfn0ServiceRole21C72759: {
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
                    },
                    {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                {Ref: 'AWS::Partition'},
                                ':iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole'
                            ]
                        ]
                    }
                ]
            },
            DependsOn: [ 'stacks3filesnfsmt0', 'stacks3filesnfsmt1' ]
          },
          functionwebfn0ServiceRoleDefaultPolicy96DB82DF: {
            Type: 'AWS::IAM::Policy',
            Properties: {
              PolicyDocument: {
                Statement: [
                  {
                    Action: 's3files:ClientMount',
                    Effect: 'Allow',
                    Resource: {
                      'Fn::GetAtt': [
                        'stacks3filesnfsstacks3filesap00BDD77AA',
                        'AccessPointArn'
                      ]
                    }
                  },
                  {
                    Action: [ 's3files:ClientMount', 's3files:ClientWrite' ],
                    Effect: 'Allow',
                    Resource: { Ref: 'stacks3filesnfs' }
                  }
                ],
                Version: '2012-10-17'
              },
              PolicyName: 'functionwebfn0ServiceRoleDefaultPolicy96DB82DF',
              Roles: [ { Ref: 'functionwebfn0ServiceRole21C72759' } ]
            },
            DependsOn: [ 'stacks3filesnfsmt0', 'stacks3filesnfsmt1' ]
        },
        functionwebfn0SecurityGroupCFD2651F: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                GroupDescription: 'Automatic security group for Lambda Function stackfunctionwebfn0A4DC51CC',
                SecurityGroupEgress: [
                    {
                        CidrIp: '0.0.0.0/0',
                        Description: 'Allow all outbound traffic by default',
                        IpProtocol: '-1'
                    }
                ],
                VpcId: 'vpc-12345'
            },
            DependsOn: [ 'stacks3filesnfsmt0', 'stacks3filesnfsmt1' ]
        },
        functionwebfn0DF20C809: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-12344-us-east-1',
                    S3Key: MatchHelper.endsWith('zip')
                },
                FileSystemConfigs: [
                    {
                        Arn: {
                            'Fn::GetAtt': [
                      'stacks3filesnfsstacks3filesap00BDD77AA',
                                'AccessPointArn'
                            ]
                        },
                        LocalMountPath: '/mnt/files'
                    }
                ],
                FunctionName: 'function-web-fn-0',
                Handler: 'public/index.php',
                LoggingConfig: {LogGroup: {Ref: 'functionwebfn0lgD95A7CF9'}},
                MemorySize: 512,
                Role: {
                    'Fn::GetAtt': ['functionwebfn0ServiceRole21C72759', 'Arn']
                },
                Runtime: 'provided.al2023',
                Timeout: 28,
                VpcConfig: {
                    SecurityGroupIds: [
                        {
                            'Fn::GetAtt': ['functionwebfn0SecurityGroupCFD2651F', 'GroupId']
                        }
                    ],
                    SubnetIds: ['p-12345', 'p-67890']
                }
            },
            DependsOn: [
                'functionwebfn0ServiceRoleDefaultPolicy96DB82DF',
                'functionwebfn0ServiceRole21C72759',
                'stacks3filesnfsmt0',
                'stacks3filesnfsmt1',
              'stacks3filesnfsstacks3filesap0MountTargetSG0fromstackfunctionwebfn0SecurityGroup9F97A0772049639B4EB4'
            ]
        }
    }
}