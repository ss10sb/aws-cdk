const {MatchHelper} = require("../../../../src/utils/testing/match-helper");
module.exports = {
    Resources: {
        pccsdlcmyappfoosdlcexampleeduarecord85887D68: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                AliasTarget: {
                    DNSName: 'dualstack.my-load-balancer-1234567890.us-west-2.elb.amazonaws.com',
                    HostedZoneId: 'Z3DZXE0EXAMPLE'
                },
                Comment: 'pcc-sdlc-myapp: foo.sdlc.example.edu',
                HostedZoneId: 'DUMMY',
                Name: 'foo.sdlc.example.edu.',
                Type: 'A'
            }
        },
        pccsdlcmyappsesverifyfooVerifyDomainIdentity12CDE9A5: {
            Type: 'Custom::AWS',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': ['AWS679f53fac002430cb0da5b7982bd22872D164C4C', 'Arn']
                },
              Create: '{"service":"SES","action":"verifyDomainIdentity","parameters":{"Domain":"foo.sdlc.example.edu"},"physicalResourceId":{"responsePath":"VerificationToken"}}',
              Update: '{"service":"SES","action":"verifyDomainIdentity","parameters":{"Domain":"foo.sdlc.example.edu"},"physicalResourceId":{"responsePath":"VerificationToken"}}',
              Delete: '{"service":"SES","action":"deleteIdentity","parameters":{"Identity":"foo.sdlc.example.edu"}}',
                InstallLatestAwsSdk: true
            },
            DependsOn: [
                'pccsdlcmyappsesverifyfooVerifyDomainIdentityCustomResourcePolicy31BD3CDF'
            ],
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlcmyappsesverifyfooVerifyDomainIdentityCustomResourcePolicy31BD3CDF: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: ['ses:VerifyDomainIdentity', 'ses:DeleteIdentity'],
                            Effect: 'Allow',
                            Resource: '*'
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlcmyappsesverifyfooVerifyDomainIdentityCustomResourcePolicy31BD3CDF',
                Roles: [
                    {
                        Ref: 'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2'
                    }
                ]
            }
        },
        pccsdlcmyappsesverifyfooSesNotificationTopic99002DE8: {
            Type: 'AWS::SNS::Topic',
            Properties: {
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            },
            DependsOn: [
                'pccsdlcmyappsesverifyfooVerifyDomainIdentityCustomResourcePolicy31BD3CDF',
                'pccsdlcmyappsesverifyfooVerifyDomainIdentity12CDE9A5'
            ]
        },
        pccsdlcmyappsesverifyfooAddComplaintTopicfoosdlcexampleedu2648C576: {
            Type: 'Custom::AWS',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': ['AWS679f53fac002430cb0da5b7982bd22872D164C4C', 'Arn']
                },
                Create: {
                    'Fn::Join': [
                        '',
                        [
                            '{"service":"SES","action":"setIdentityNotificationTopic","parameters":{"Identity":"foo.sdlc.example.edu","NotificationType":"Complaint","SnsTopic":"',
                            {
                                Ref: 'pccsdlcmyappsesverifyfooSesNotificationTopic99002DE8'
                            },
                    '"},"physicalResourceId":{"id":"foo.sdlc.example.edu-set-Complaint-topic"}}'
                        ]
                    ]
                },
                InstallLatestAwsSdk: true
            },
            DependsOn: [
                'pccsdlcmyappsesverifyfooAddComplaintTopicfoosdlcexampleeduCustomResourcePolicyB39B76FC',
                'pccsdlcmyappsesverifyfooSesNotificationTopic99002DE8'
            ],
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlcmyappsesverifyfooAddComplaintTopicfoosdlcexampleeduCustomResourcePolicyB39B76FC: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 'ses:SetIdentityNotificationTopic',
                            Effect: 'Allow',
                            Resource: '*'
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlcmyappsesverifyfooAddComplaintTopicfoosdlcexampleeduCustomResourcePolicyB39B76FC',
                Roles: [
                    {
                        Ref: 'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2'
                    }
                ]
            },
            DependsOn: ['pccsdlcmyappsesverifyfooSesNotificationTopic99002DE8']
        },
        pccsdlcmyappsesverifyfooSesVerificationRecordA035C070: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                HostedZoneId: 'DUMMY',
                Name: '_amazonses.foo.sdlc.example.edu.',
                ResourceRecords: [
                    {
                        'Fn::Join': [
                            '',
                            [
                                '"',
                                {
                                    'Fn::GetAtt': [
                                        'pccsdlcmyappsesverifyfooVerifyDomainIdentity12CDE9A5',
                                        'VerificationToken'
                                    ]
                                },
                                '"'
                            ]
                        ]
                    }
                ],
                TTL: '1800',
                Type: 'TXT'
            },
            DependsOn: [
              'pccsdlcmyappsesverifyfooVerifyDomainIdentityCustomResourcePolicy31BD3CDF',
              'pccsdlcmyappsesverifyfooVerifyDomainIdentity12CDE9A5'
            ]
          },
          pccsdlcmyappsesverifyfooSesMxRecord6E4D608F: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
              HostedZoneId: 'DUMMY',
              Name: 'foo.sdlc.example.edu.',
              ResourceRecords: [
                {
                  'Fn::Join': [
                    '',
                    [
                      '10 ',
                      {
                        'Fn::Sub': 'inbound-smtp.${AWS::Region}.amazonaws.com'
                      }
                    ]
                  ]
                }
              ],
              TTL: '1800',
              Type: 'MX'
            },
            DependsOn: [
                'pccsdlcmyappsesverifyfooVerifyDomainIdentityCustomResourcePolicy31BD3CDF',
                'pccsdlcmyappsesverifyfooVerifyDomainIdentity12CDE9A5'
            ]
        },
        pccsdlcmyappsesverifyfooVerifyDomainDkimF4C21CA2: {
            Type: 'Custom::AWS',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': ['AWS679f53fac002430cb0da5b7982bd22872D164C4C', 'Arn']
                },
              Create: '{"service":"SES","action":"verifyDomainDkim","parameters":{"Domain":"foo.sdlc.example.edu"},"physicalResourceId":{"id":"foo.sdlc.example.edu-verify-domain-dkim"}}',
              Update: '{"service":"SES","action":"verifyDomainDkim","parameters":{"Domain":"foo.sdlc.example.edu"},"physicalResourceId":{"id":"foo.sdlc.example.edu-verify-domain-dkim"}}',
                InstallLatestAwsSdk: true
            },
            DependsOn: [
                'pccsdlcmyappsesverifyfooVerifyDomainDkimCustomResourcePolicy0280A11A',
                'pccsdlcmyappsesverifyfooVerifyDomainIdentityCustomResourcePolicy31BD3CDF',
                'pccsdlcmyappsesverifyfooVerifyDomainIdentity12CDE9A5'
            ],
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlcmyappsesverifyfooVerifyDomainDkimCustomResourcePolicy0280A11A: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 'ses:VerifyDomainDkim',
                            Effect: 'Allow',
                            Resource: '*'
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlcmyappsesverifyfooVerifyDomainDkimCustomResourcePolicy0280A11A',
                Roles: [
                    {
                        Ref: 'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2'
                    }
                ]
            },
            DependsOn: [
                'pccsdlcmyappsesverifyfooVerifyDomainIdentityCustomResourcePolicy31BD3CDF',
                'pccsdlcmyappsesverifyfooVerifyDomainIdentity12CDE9A5'
            ]
        },
        pccsdlcmyappsesverifyfooSesDkimVerificationRecord006CD2808: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                HostedZoneId: 'DUMMY',
                Name: {
                    'Fn::Join': [
                        '',
                        [
                            {
                                'Fn::GetAtt': [
                                    'pccsdlcmyappsesverifyfooVerifyDomainDkimF4C21CA2',
                                    'DkimTokens.0'
                                ]
                            },
                            '._domainkey.foo.sdlc.example.edu.'
                        ]
                    ]
                },
                ResourceRecords: [
                    {
                        'Fn::Join': [
                            '',
                            [
                                {
                                    'Fn::GetAtt': [
                                        'pccsdlcmyappsesverifyfooVerifyDomainDkimF4C21CA2',
                                        'DkimTokens.0'
                                    ]
                                },
                                '.dkim.amazonses.com'
                            ]
                        ]
                    }
                ],
                TTL: '1800',
                Type: 'CNAME'
            },
            DependsOn: [
                'pccsdlcmyappsesverifyfooVerifyDomainDkimCustomResourcePolicy0280A11A',
                'pccsdlcmyappsesverifyfooVerifyDomainDkimF4C21CA2'
            ]
        },
        pccsdlcmyappsesverifyfooSesDkimVerificationRecord190BF15BF: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                HostedZoneId: 'DUMMY',
                Name: {
                    'Fn::Join': [
                        '',
                        [
                            {
                                'Fn::GetAtt': [
                                    'pccsdlcmyappsesverifyfooVerifyDomainDkimF4C21CA2',
                                    'DkimTokens.1'
                                ]
                            },
                            '._domainkey.foo.sdlc.example.edu.'
                        ]
                    ]
                },
                ResourceRecords: [
                    {
                        'Fn::Join': [
                            '',
                            [
                                {
                                    'Fn::GetAtt': [
                                        'pccsdlcmyappsesverifyfooVerifyDomainDkimF4C21CA2',
                                        'DkimTokens.1'
                                    ]
                                },
                                '.dkim.amazonses.com'
                            ]
                        ]
                    }
                ],
                TTL: '1800',
                Type: 'CNAME'
            },
            DependsOn: [
                'pccsdlcmyappsesverifyfooVerifyDomainDkimCustomResourcePolicy0280A11A',
                'pccsdlcmyappsesverifyfooVerifyDomainDkimF4C21CA2'
            ]
        },
        pccsdlcmyappsesverifyfooSesDkimVerificationRecord263CE8871: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                HostedZoneId: 'DUMMY',
                Name: {
                    'Fn::Join': [
                        '',
                        [
                            {
                                'Fn::GetAtt': [
                                    'pccsdlcmyappsesverifyfooVerifyDomainDkimF4C21CA2',
                                    'DkimTokens.2'
                                ]
                            },
                            '._domainkey.foo.sdlc.example.edu.'
                        ]
                    ]
                },
                ResourceRecords: [
                    {
                        'Fn::Join': [
                            '',
                            [
                                {
                                    'Fn::GetAtt': [
                                        'pccsdlcmyappsesverifyfooVerifyDomainDkimF4C21CA2',
                                        'DkimTokens.2'
                                    ]
                                },
                                '.dkim.amazonses.com'
                            ]
                        ]
                    }
                ],
                TTL: '1800',
                Type: 'CNAME'
            },
            DependsOn: [
                'pccsdlcmyappsesverifyfooVerifyDomainDkimCustomResourcePolicy0280A11A',
                'pccsdlcmyappsesverifyfooVerifyDomainDkimF4C21CA2'
            ]
        },
        AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2: {
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
                ],
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        AWS679f53fac002430cb0da5b7982bd22872D164C4C: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-2222-us-west-2',
                    S3Key: MatchHelper.endsWith('zip')
                },
                Handler: 'index.handler',
                Role: {
                    'Fn::GetAtt': [
                        'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2',
                        'Arn'
                    ]
                },
                Runtime: MatchHelper.startsWith('nodejs'),
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                Timeout: 120
            },
            DependsOn: ['AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2']
        },
        pccsdlcmyappcacheF6FEBBE3: {
            Type: 'AWS::DynamoDB::Table',
            Properties: {
                AttributeDefinitions: [{AttributeName: 'key', AttributeType: 'S'}],
                BillingMode: 'PAY_PER_REQUEST',
                KeySchema: [{AttributeName: 'key', KeyType: 'HASH'}],
                SSESpecification: {SSEEnabled: true},
                TableName: 'pcc-sdlc-myapp-cache',
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                TimeToLiveSpecification: {AttributeName: 'expires_at', Enabled: true}
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlcmyappdlqAB5BBAC4: {
            Type: 'AWS::SQS::Queue',
            Properties: {
                KmsMasterKeyId: 'alias/aws/sqs',
                MessageRetentionPeriod: 259200,
                QueueName: 'pcc-sdlc-myapp-dlq',
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlcmyappqueue069E607A: {
            Type: 'AWS::SQS::Queue',
            Properties: {
                KmsMasterKeyId: 'alias/aws/sqs',
                QueueName: 'pcc-sdlc-myapp-queue',
                RedrivePolicy: {
                    deadLetterTargetArn: {'Fn::GetAtt': ['pccsdlcmyappdlqAB5BBAC4', 'Arn']},
                    maxReceiveCount: 3
                },
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlcmyapps352258330: {
            Type: 'AWS::S3::Bucket',
            Properties: {
                BucketEncryption: {
                    ServerSideEncryptionConfiguration: [
                        {
                            ServerSideEncryptionByDefault: {SSEAlgorithm: 'aws:kms'}
                        }
                    ]
                },
                BucketName: 'pcc-sdlc-myapp-s3',
                OwnershipControls: {Rules: [{ObjectOwnership: 'BucketOwnerEnforced'}]},
                PublicAccessBlockConfiguration: {
                    BlockPublicAcls: true,
                    BlockPublicPolicy: true,
                    IgnorePublicAcls: true,
                    RestrictPublicBuckets: true
                },
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            },
            UpdateReplacePolicy: 'Retain',
            DeletionPolicy: 'Retain'
        },
        pccsdlcmyapps3Policy9B6B2F29: {
            Type: 'AWS::S3::BucketPolicy',
            Properties: {
                Bucket: {Ref: 'pccsdlcmyapps352258330'},
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 's3:*',
                            Condition: {Bool: {'aws:SecureTransport': 'false'}},
                            Effect: 'Deny',
                            Principal: {AWS: '*'},
                            Resource: [
                                {'Fn::GetAtt': ['pccsdlcmyapps352258330', 'Arn']},
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': ['pccsdlcmyapps352258330', 'Arn']
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
          pccsdlcmyappartisanfn0lgB0FC1686: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
              RetentionInDays: 30,
              Tags: [
                { Key: 'App', Value: 'myapp' },
                { Key: 'College', Value: 'PCC' },
                { Key: 'Environment', Value: 'sdlc' }
              ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
          },
          pccsdlcmyappartisanfn0ServiceRole71B468C8: {
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
              ],
              Tags: [
                { Key: 'App', Value: 'myapp' },
                { Key: 'College', Value: 'PCC' },
                { Key: 'Environment', Value: 'sdlc' }
              ]
            }
          },
          pccsdlcmyappartisanfn0ServiceRoleDefaultPolicyC9211DD1: {
            Type: 'AWS::IAM::Policy',
            Properties: {
              PolicyDocument: {
                Statement: [
                  {
                    Action: [
                      'sqs:SendMessage',
                      'sqs:GetQueueAttributes',
                      'sqs:GetQueueUrl'
                    ],
                    Effect: 'Allow',
                    Resource: {
                      'Fn::GetAtt': [ 'pccsdlcmyappqueue069E607A', 'Arn' ]
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
                      { 'Fn::GetAtt': [ 'pccsdlcmyapps352258330', 'Arn' ] },
                      {
                        'Fn::Join': [
                          '',
                          [
                            {
                              'Fn::GetAtt': [ 'pccsdlcmyapps352258330', 'Arn' ]
                            },
                            '/*'
                          ]
                        ]
                      }
                    ]
                  },
                  {
                    Action: [ 'ses:SendEmail', 'ses:SendRawEmail' ],
                    Effect: 'Allow',
                    Resource: '*'
                  },
                  {
                    Action: [
                      'dynamodb:BatchGetItem',
                      'dynamodb:GetRecords',
                      'dynamodb:GetShardIterator',
                      'dynamodb:Query',
                      'dynamodb:GetItem',
                      'dynamodb:Scan',
                      'dynamodb:ConditionCheckItem',
                      'dynamodb:BatchWriteItem',
                      'dynamodb:PutItem',
                      'dynamodb:UpdateItem',
                      'dynamodb:DeleteItem',
                      'dynamodb:DescribeTable'
                    ],
                    Effect: 'Allow',
                    Resource: [
                      {
                        'Fn::GetAtt': [ 'pccsdlcmyappcacheF6FEBBE3', 'Arn' ]
                      },
                      { Ref: 'AWS::NoValue' }
                    ]
                  },
                  {
                    Action: [
                      'secretsmanager:GetSecretValue',
                      'secretsmanager:DescribeSecret'
                    ],
                    Effect: 'Allow',
                    Resource: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-test-secrets/environment-ABC123'
                  },
                  {
                    Action: [
                      'secretsmanager:GetSecretValue',
                      'secretsmanager:DescribeSecret'
                    ],
                    Effect: 'Allow',
                    Resource: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-shared-secrets/environment-DEF456'
                  }
                ],
                Version: '2012-10-17'
              },
              PolicyName: 'pccsdlcmyappartisanfn0ServiceRoleDefaultPolicyC9211DD1',
              Roles: [ { Ref: 'pccsdlcmyappartisanfn0ServiceRole71B468C8' } ]
            }
          },
          pccsdlcmyappartisanfn0SecurityGroup49481376: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
              GroupDescription: 'Automatic security group for Lambda Function pccsharedstackpccsdlcmyapppccsdlcmyappartisanfn021C137A6',
              SecurityGroupEgress: [
                {
                  CidrIp: '0.0.0.0/0',
                  Description: 'Allow all outbound traffic by default',
                  IpProtocol: '-1'
                }
              ],
              Tags: [
                { Key: 'App', Value: 'myapp' },
                { Key: 'College', Value: 'PCC' },
                { Key: 'Environment', Value: 'sdlc' }
              ],
              VpcId: 'vpc-12345'
            }
          },
          pccsdlcmyappartisanfn03CF1867A: {
            Type: 'AWS::Lambda::Function',
            Properties: {
              Code: {
                S3Bucket: 'cdk-hnb659fds-assets-2222-us-west-2',
                S3Key: 'f783265af338426734f8dd0676fbe351130e46ad3456447acf36651a1de9dad4.zip'
              },
              Environment: {
                Variables: {
                  AWS_APP_NAME: 'pcc-sdlc-myapp',
                  MAIL_FROM_ADDRESS: 'no-reply@foo.sdlc.example.edu',
                  IMPORTER_FROM: 'importer-no-reply@foo.sdlc.example.edu',
                  DYNAMODB_CACHE_TABLE: { Ref: 'pccsdlcmyappcacheF6FEBBE3' },
                  SQS_QUEUE: { Ref: 'pccsdlcmyappqueue069E607A' },
                  AWS_BUCKET: { Ref: 'pccsdlcmyapps352258330' },
                  AWS_SECRET_ARN: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-test-secrets/environment-ABC123',
                  AWS_SHARED_SECRET_ARN: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-shared-secrets/environment-DEF456',
                  APP_BASE_PATH: '/var/task',
                  BREF_LOAD_SECRETS: 'bref-ssm:loadOnly',
                  SHARED_SECRETS_LOOKUP: 'bref-secretsmanager:arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-shared-secrets/environment-DEF456',
                  SECRETS_LOOKUP: 'bref-secretsmanager:arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-test-secrets/environment-ABC123'
                }
              },
              FunctionName: 'pcc-sdlc-myapp-artisan-fn-0',
              Handler: 'artisan',
              Layers: [
                {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      { Ref: 'AWS::Partition' },
                      ':lambda:us-west-2:534081306603:layer:php-82:48'
                    ]
                  ]
                },
                {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      { Ref: 'AWS::Partition' },
                      ':lambda:us-west-2:534081306603:layer:console:58'
                    ]
                  ]
                }
              ],
              LoggingConfig: { LogGroup: { Ref: 'pccsdlcmyappartisanfn0lgB0FC1686' } },
              MemorySize: 512,
              Role: {
                'Fn::GetAtt': [ 'pccsdlcmyappartisanfn0ServiceRole71B468C8', 'Arn' ]
              },
              Runtime: 'provided.al2',
              Tags: [
                { Key: 'App', Value: 'myapp' },
                { Key: 'College', Value: 'PCC' },
                { Key: 'Environment', Value: 'sdlc' }
              ],
              Timeout: 720,
              VpcConfig: {
                SecurityGroupIds: [
                  {
                    'Fn::GetAtt': [
                      'pccsdlcmyappartisanfn0SecurityGroup49481376',
                      'GroupId'
                    ]
                  }
                ],
                SubnetIds: [ 'p-12345', 'p-67890' ]
              }
            },
            DependsOn: [
              'pccsdlcmyappartisanfn0ServiceRoleDefaultPolicyC9211DD1',
              'pccsdlcmyappartisanfn0ServiceRole71B468C8'
            ]
        },
        pccsdlcmyappeventfn0lg4E9F168A: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                RetentionInDays: 30,
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlcmyappeventfn0ServiceRole01FF5957: {
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
                ],
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlcmyappeventfn0ServiceRoleDefaultPolicy83382AEF: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: [
                                'sqs:SendMessage',
                                'sqs:GetQueueAttributes',
                                'sqs:GetQueueUrl'
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': ['pccsdlcmyappqueue069E607A', 'Arn']
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
                                {'Fn::GetAtt': ['pccsdlcmyapps352258330', 'Arn']},
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': ['pccsdlcmyapps352258330', 'Arn']
                                            },
                                            '/*'
                                        ]
                                    ]
                                }
                            ]
                        },
                        {
                            Action: ['ses:SendEmail', 'ses:SendRawEmail'],
                            Effect: 'Allow',
                            Resource: '*'
                        },
                        {
                            Action: [
                                'dynamodb:BatchGetItem',
                                'dynamodb:GetRecords',
                                'dynamodb:GetShardIterator',
                                'dynamodb:Query',
                                'dynamodb:GetItem',
                                'dynamodb:Scan',
                                'dynamodb:ConditionCheckItem',
                                'dynamodb:BatchWriteItem',
                                'dynamodb:PutItem',
                                'dynamodb:UpdateItem',
                                'dynamodb:DeleteItem',
                                'dynamodb:DescribeTable'
                            ],
                            Effect: 'Allow',
                            Resource: [
                                {
                                    'Fn::GetAtt': ['pccsdlcmyappcacheF6FEBBE3', 'Arn']
                                },
                                {Ref: 'AWS::NoValue'}
                            ]
                        },
                        {
                            Action: [
                                'secretsmanager:GetSecretValue',
                                'secretsmanager:DescribeSecret'
                            ],
                            Effect: 'Allow',
                            Resource: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-test-secrets/environment-ABC123'
                        },
                        {
                            Action: [
                                'secretsmanager:GetSecretValue',
                                'secretsmanager:DescribeSecret'
                            ],
                            Effect: 'Allow',
                            Resource: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-shared-secrets/environment-DEF456'
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlcmyappeventfn0ServiceRoleDefaultPolicy83382AEF',
                Roles: [{Ref: 'pccsdlcmyappeventfn0ServiceRole01FF5957'}]
            }
        },
        pccsdlcmyappeventfn0SecurityGroup44B88D09: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                GroupDescription: 'Automatic security group for Lambda Function pccsharedstackpccsdlcmyapppccsdlcmyappeventfn09787DE19',
                SecurityGroupEgress: [
                    {
                        CidrIp: '0.0.0.0/0',
                        Description: 'Allow all outbound traffic by default',
                        IpProtocol: '-1'
                    }
                ],
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                VpcId: 'vpc-12345'
            }
        },
        pccsdlcmyappeventfn02B9B50C4: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-2222-us-west-2',
                    S3Key: MatchHelper.endsWith('zip')
                },
                Environment: {
                    Variables: {
                        AWS_APP_NAME: 'pcc-sdlc-myapp',
                        MAIL_FROM_ADDRESS: 'no-reply@foo.sdlc.example.edu',
                        IMPORTER_FROM: 'importer-no-reply@foo.sdlc.example.edu',
                        DYNAMODB_CACHE_TABLE: {Ref: 'pccsdlcmyappcacheF6FEBBE3'},
                        SQS_QUEUE: {Ref: 'pccsdlcmyappqueue069E607A'},
                        AWS_BUCKET: {Ref: 'pccsdlcmyapps352258330'},
                        AWS_SECRET_ARN: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-test-secrets/environment-ABC123',
                        AWS_SHARED_SECRET_ARN: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-shared-secrets/environment-DEF456',
                        APP_BASE_PATH: '/var/task',
                        BREF_LOAD_SECRETS: 'bref-ssm:loadOnly',
                        SHARED_SECRETS_LOOKUP: 'bref-secretsmanager:arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-shared-secrets/environment-DEF456',
                        SECRETS_LOOKUP: 'bref-secretsmanager:arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-test-secrets/environment-ABC123'
                    }
                },
                FunctionName: 'pcc-sdlc-myapp-event-fn-0',
                Handler: 'artisan',
                Layers: [
                    {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                {Ref: 'AWS::Partition'},
                                ':lambda:us-west-2:534081306603:layer:php-82:48'
                            ]
                        ]
                    },
                    {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                {Ref: 'AWS::Partition'},
                                ':lambda:us-west-2:534081306603:layer:console:58'
                            ]
                        ]
                    }
                ],
                LoggingConfig: {LogGroup: {Ref: 'pccsdlcmyappeventfn0lg4E9F168A'}},
                MemorySize: 512,
                Role: {
                    'Fn::GetAtt': ['pccsdlcmyappeventfn0ServiceRole01FF5957', 'Arn']
                },
                Runtime: 'provided.al2',
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                Timeout: 120,
                VpcConfig: {
                    SecurityGroupIds: [
                        {
                            'Fn::GetAtt': [
                                'pccsdlcmyappeventfn0SecurityGroup44B88D09',
                                'GroupId'
                            ]
                        }
                    ],
                    SubnetIds: ['p-12345', 'p-67890']
                }
            },
            DependsOn: [
                'pccsdlcmyappeventfn0ServiceRoleDefaultPolicy83382AEF',
                'pccsdlcmyappeventfn0ServiceRole01FF5957'
            ]
        },
        pccsdlcmyappeventfn0scheduledevent05EED96BF: {
            Type: 'AWS::Events::Rule',
            Properties: {
                Name: 'pcc-sdlc-myapp-event-fn-0-scheduled-event-0',
                ScheduleExpression: 'rate(5 minutes)',
                State: 'ENABLED',
                Targets: [
                    {
                        Arn: {
                            'Fn::GetAtt': ['pccsdlcmyappeventfn02B9B50C4', 'Arn']
                        },
                        Id: 'Target0',
                        Input: '{"cli":"schedule:run"}'
                    }
                ]
            }
        },
        pccsdlcmyappeventfn0scheduledevent0AllowEventRulepccsharedstackpccsdlcmyapppccsdlcmyappeventfn09787DE19067C9B23: {
            Type: 'AWS::Lambda::Permission',
            Properties: {
                Action: 'lambda:InvokeFunction',
                FunctionName: {'Fn::GetAtt': ['pccsdlcmyappeventfn02B9B50C4', 'Arn']},
                Principal: 'events.amazonaws.com',
                SourceArn: {
                    'Fn::GetAtt': ['pccsdlcmyappeventfn0scheduledevent05EED96BF', 'Arn']
                }
            }
        },
        pccsdlcmyappqueuefn0lg8470ED06: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                RetentionInDays: 30,
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlcmyappqueuefn0ServiceRole25D2EC47: {
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
                ],
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlcmyappqueuefn0ServiceRoleDefaultPolicy7CEEC49D: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: [
                                'sqs:ReceiveMessage',
                                'sqs:ChangeMessageVisibility',
                                'sqs:GetQueueUrl',
                                'sqs:DeleteMessage',
                                'sqs:GetQueueAttributes'
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': ['pccsdlcmyappqueue069E607A', 'Arn']
                            }
                        },
                        {
                            Action: [
                                'sqs:SendMessage',
                                'sqs:GetQueueAttributes',
                                'sqs:GetQueueUrl'
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': ['pccsdlcmyappqueue069E607A', 'Arn']
                            }
                        },
                        {
                            Action: [
                                'sqs:PurgeQueue',
                                'sqs:GetQueueAttributes',
                                'sqs:GetQueueUrl'
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': ['pccsdlcmyappqueue069E607A', 'Arn']
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
                                {'Fn::GetAtt': ['pccsdlcmyapps352258330', 'Arn']},
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': ['pccsdlcmyapps352258330', 'Arn']
                                            },
                                            '/*'
                                        ]
                                    ]
                                }
                            ]
                        },
                        {
                            Action: ['ses:SendEmail', 'ses:SendRawEmail'],
                            Effect: 'Allow',
                            Resource: '*'
                        },
                        {
                            Action: [
                                'dynamodb:BatchGetItem',
                                'dynamodb:GetRecords',
                                'dynamodb:GetShardIterator',
                                'dynamodb:Query',
                                'dynamodb:GetItem',
                                'dynamodb:Scan',
                                'dynamodb:ConditionCheckItem',
                                'dynamodb:BatchWriteItem',
                                'dynamodb:PutItem',
                                'dynamodb:UpdateItem',
                                'dynamodb:DeleteItem',
                                'dynamodb:DescribeTable'
                            ],
                            Effect: 'Allow',
                            Resource: [
                                {
                                    'Fn::GetAtt': ['pccsdlcmyappcacheF6FEBBE3', 'Arn']
                                },
                                {Ref: 'AWS::NoValue'}
                            ]
                        },
                        {
                            Action: [
                                'secretsmanager:GetSecretValue',
                                'secretsmanager:DescribeSecret'
                            ],
                            Effect: 'Allow',
                            Resource: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-test-secrets/environment-ABC123'
                        },
                        {
                            Action: [
                                'secretsmanager:GetSecretValue',
                                'secretsmanager:DescribeSecret'
                            ],
                            Effect: 'Allow',
                            Resource: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-shared-secrets/environment-DEF456'
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlcmyappqueuefn0ServiceRoleDefaultPolicy7CEEC49D',
                Roles: [{Ref: 'pccsdlcmyappqueuefn0ServiceRole25D2EC47'}]
            }
        },
        pccsdlcmyappqueuefn0SecurityGroup9AAF5451: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                GroupDescription: 'Automatic security group for Lambda Function pccsharedstackpccsdlcmyapppccsdlcmyappqueuefn01B673C6E',
                SecurityGroupEgress: [
                    {
                        CidrIp: '0.0.0.0/0',
                        Description: 'Allow all outbound traffic by default',
                        IpProtocol: '-1'
                    }
                ],
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                VpcId: 'vpc-12345'
            }
        },
        pccsdlcmyappqueuefn0959517EB: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-2222-us-west-2',
                    S3Key: MatchHelper.endsWith('zip')
                },
                Environment: {
                    Variables: {
                        AWS_APP_NAME: 'pcc-sdlc-myapp',
                        MAIL_FROM_ADDRESS: 'no-reply@foo.sdlc.example.edu',
                        IMPORTER_FROM: 'importer-no-reply@foo.sdlc.example.edu',
                        DYNAMODB_CACHE_TABLE: {Ref: 'pccsdlcmyappcacheF6FEBBE3'},
                        SQS_QUEUE: {Ref: 'pccsdlcmyappqueue069E607A'},
                        AWS_BUCKET: {Ref: 'pccsdlcmyapps352258330'},
                        AWS_SECRET_ARN: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-test-secrets/environment-ABC123',
                        AWS_SHARED_SECRET_ARN: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-shared-secrets/environment-DEF456',
                        APP_BASE_PATH: '/var/task',
                        BREF_LOAD_SECRETS: 'bref-ssm:loadOnly',
                        SHARED_SECRETS_LOOKUP: 'bref-secretsmanager:arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-shared-secrets/environment-DEF456',
                        SECRETS_LOOKUP: 'bref-secretsmanager:arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-test-secrets/environment-ABC123'
                    }
                },
                FunctionName: 'pcc-sdlc-myapp-queue-fn-0',
                Handler: 'Bref\\LaravelBridge\\Queue\\QueueHandler',
                Layers: [
                    {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                {Ref: 'AWS::Partition'},
                                ':lambda:us-west-2:534081306603:layer:php-82:48'
                            ]
                        ]
                    }
                ],
                LoggingConfig: {LogGroup: {Ref: 'pccsdlcmyappqueuefn0lg8470ED06'}},
                MemorySize: 512,
                Role: {
                    'Fn::GetAtt': ['pccsdlcmyappqueuefn0ServiceRole25D2EC47', 'Arn']
                },
                Runtime: 'provided.al2',
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                Timeout: 120,
                VpcConfig: {
                    SecurityGroupIds: [
                        {
                            'Fn::GetAtt': [
                                'pccsdlcmyappqueuefn0SecurityGroup9AAF5451',
                                'GroupId'
                            ]
                        }
                    ],
                    SubnetIds: ['p-12345', 'p-67890']
                }
            },
            DependsOn: [
                'pccsdlcmyappqueuefn0ServiceRoleDefaultPolicy7CEEC49D',
                'pccsdlcmyappqueuefn0ServiceRole25D2EC47'
            ]
        },
        pccsdlcmyappqueuefn0SqsEventSourcepccsharedstackpccsdlcmyapppccsdlcmyappqueueE04FE5CD2B31C978: {
            Type: 'AWS::Lambda::EventSourceMapping',
            Properties: {
                EventSourceArn: {'Fn::GetAtt': ['pccsdlcmyappqueue069E607A', 'Arn']},
              FunctionName: { Ref: 'pccsdlcmyappqueuefn0959517EB' },
              Tags: [
                { Key: 'App', Value: 'myapp' },
                { Key: 'College', Value: 'PCC' },
                { Key: 'Environment', Value: 'sdlc' }
              ]
            }
        },
        pccsdlcmyapptg1E18EDE5: {
            Type: 'AWS::ElasticLoadBalancingV2::TargetGroup',
            Properties: {
                Name: 'pcc-sdlc-myapp-tg',
                Port: 80,
                Protocol: 'HTTP',
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                TargetGroupAttributes: [{Key: 'stickiness.enabled', Value: 'false'}],
                TargetType: 'ip',
                VpcId: 'vpc-12345'
            }
        },
        pccsdlcmyapplistenerrule10003C2FE33: {
            Type: 'AWS::ElasticLoadBalancingV2::ListenerRule',
            Properties: {
                Actions: [
                    {
                        TargetGroupArn: {Ref: 'pccsdlcmyapptg1E18EDE5'},
                        Type: 'forward'
                    }
                ],
                Conditions: [
                    {
                        Field: 'host-header',
                        HostHeaderConfig: {Values: ['foo.sdlc.example.edu']}
                    }
                ],
                ListenerArn: 'arn:aws:elasticloadbalancing:us-west-2:123456789012:listener/application/my-load-balancer/50dc6c495c0c9188/f2f7dc8efc522ab2',
                Priority: 100
            }
        },
        pccsdlcmyappcluster4E9F2DE3: {
            Type: 'AWS::ECS::Cluster',
            Properties: {
                ClusterName: 'pcc-sdlc-myapp-cluster',
                ClusterSettings: [{Name: 'containerInsights', Value: 'disabled'}],
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlcmyappclusteralarmtopic96EDDED7: {
            Type: 'AWS::SNS::Topic',
            Properties: {
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlcmyappclusteralarmtopictestexampleeduCAEE872F: {
            Type: 'AWS::SNS::Subscription',
            Properties: {
                Endpoint: 'test@example.edu',
                Protocol: 'email',
                TopicArn: {Ref: 'pccsdlcmyappclusteralarmtopic96EDDED7'}
            }
        },
        pccsdlcmyappclustercpualarmD245A87F: {
            Type: 'AWS::CloudWatch::Alarm',
            Properties: {
                AlarmActions: [{Ref: 'pccsdlcmyappclusteralarmtopic96EDDED7'}],
                ComparisonOperator: 'GreaterThanOrEqualToThreshold',
                Dimensions: [
                    {
                        Name: 'ClusterName',
                        Value: {Ref: 'pccsdlcmyappcluster4E9F2DE3'}
                    }
                ],
                EvaluationPeriods: 1,
                MetricName: 'CPUUtilization',
                Namespace: 'AWS/ECS',
                OKActions: [{Ref: 'pccsdlcmyappclusteralarmtopic96EDDED7'}],
                Period: 300,
                Statistic: 'Average',
              Tags: [
                { Key: 'App', Value: 'myapp' },
                { Key: 'College', Value: 'PCC' },
                { Key: 'Environment', Value: 'sdlc' }
              ],
                Threshold: 90
            }
        },
        pccsdlcmyappclustermemoryalarmD54F55B5: {
            Type: 'AWS::CloudWatch::Alarm',
            Properties: {
                AlarmActions: [{Ref: 'pccsdlcmyappclusteralarmtopic96EDDED7'}],
                ComparisonOperator: 'GreaterThanOrEqualToThreshold',
                Dimensions: [
                    {
                        Name: 'ClusterName',
                        Value: {Ref: 'pccsdlcmyappcluster4E9F2DE3'}
                    }
                ],
                EvaluationPeriods: 1,
                MetricName: 'MemoryUtilization',
                Namespace: 'AWS/ECS',
                OKActions: [{Ref: 'pccsdlcmyappclusteralarmtopic96EDDED7'}],
                Period: 300,
                Statistic: 'Average',
              Tags: [
                { Key: 'App', Value: 'myapp' },
                { Key: 'College', Value: 'PCC' },
                { Key: 'Environment', Value: 'sdlc' }
              ],
                Threshold: 90
            }
        },
        pccsdlcmyapptaskdefscheduledtask0execrole253CB36D: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: {Service: 'ecs-tasks.amazonaws.com'}
                        }
                    ],
                    Version: '2012-10-17'
                },
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {
                        Key: 'aws-cdk:id',
                        Value: 'pccsharedstackpccsdlcmyapp6F659917_c8123df86de9aa7f08137c98c6c5d84f0ce6535dd2'
                    },
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlcmyapptaskdefscheduledtask0execroleDefaultPolicyB28A7122: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: [
                                'ecr:BatchCheckLayerAvailability',
                                'ecr:GetDownloadUrlForLayer',
                                'ecr:BatchGetImage'
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {Ref: 'AWS::Partition'},
                                        ':ecr:us-east-1:12344:repository/pcc-myapp/phpfpm'
                                    ]
                                ]
                            }
                        },
                        {
                            Action: 'ecr:GetAuthorizationToken',
                            Effect: 'Allow',
                            Resource: '*'
                        },
                        {
                            Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'pccsdlcmyappcontainerphpfpmscheduledtaskst0loggroupF6594B4E',
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: [
                                'secretsmanager:GetSecretValue',
                                'secretsmanager:DescribeSecret'
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {Ref: 'AWS::Partition'},
                                        ':secretsmanager:us-west-2:2222:secret:pcc-sdlc-myapp-secrets/environment-??????'
                                    ]
                                ]
                            }
                        },
                        {
                            Action: [
                                'secretsmanager:GetSecretValue',
                                'secretsmanager:DescribeSecret'
                            ],
                            Effect: 'Allow',
                            Resource: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-shared-secrets/environment-DEF456'
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlcmyapptaskdefscheduledtask0execroleDefaultPolicyB28A7122',
                Roles: [
                    {
                        Ref: 'pccsdlcmyapptaskdefscheduledtask0execrole253CB36D'
                    }
                ]
            }
        },
        pccsdlcmyapptaskdefscheduledtask0TaskRoleC9F469E3: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: {Service: 'ecs-tasks.amazonaws.com'}
                        }
                    ],
                    Version: '2012-10-17'
                },
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlcmyapptaskdefscheduledtask0TaskRoleDefaultPolicy393992EC: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: [
                                'sqs:SendMessage',
                                'sqs:GetQueueAttributes',
                                'sqs:GetQueueUrl'
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': ['pccsdlcmyappqueue069E607A', 'Arn']
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
                                {'Fn::GetAtt': ['pccsdlcmyapps352258330', 'Arn']},
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': ['pccsdlcmyapps352258330', 'Arn']
                                            },
                                            '/*'
                                        ]
                                    ]
                                }
                            ]
                        },
                        {
                            Action: ['ses:SendEmail', 'ses:SendRawEmail'],
                            Effect: 'Allow',
                            Resource: '*'
                        },
                        {
                            Action: [
                                'dynamodb:BatchGetItem',
                                'dynamodb:GetRecords',
                                'dynamodb:GetShardIterator',
                                'dynamodb:Query',
                                'dynamodb:GetItem',
                                'dynamodb:Scan',
                                'dynamodb:ConditionCheckItem',
                                'dynamodb:BatchWriteItem',
                                'dynamodb:PutItem',
                                'dynamodb:UpdateItem',
                                'dynamodb:DeleteItem',
                                'dynamodb:DescribeTable'
                            ],
                            Effect: 'Allow',
                            Resource: [
                                {
                                    'Fn::GetAtt': ['pccsdlcmyappcacheF6FEBBE3', 'Arn']
                                },
                                {Ref: 'AWS::NoValue'}
                            ]
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlcmyapptaskdefscheduledtask0TaskRoleDefaultPolicy393992EC',
                Roles: [
                    {
                        Ref: 'pccsdlcmyapptaskdefscheduledtask0TaskRoleC9F469E3'
                    }
                ]
            }
        },
        pccsdlcmyapptaskdefscheduledtask0DC6034F0: {
            Type: 'AWS::ECS::TaskDefinition',
            Properties: {
                ContainerDefinitions: [
                    {
                        Command: ['artisan', 'something:daily'],
                        Cpu: 256,
                        EntryPoint: ['/usr/local/bin/php'],
                        Environment: [
                            {Name: 'AWS_APP_NAME', Value: 'pcc-sdlc-myapp'},
                            {
                                Name: 'MAIL_FROM_ADDRESS',
                                Value: 'no-reply@foo.sdlc.example.edu'
                            },
                            {
                                Name: 'IMPORTER_FROM',
                                Value: 'importer-no-reply@foo.sdlc.example.edu'
                            },
                            {
                                Name: 'DYNAMODB_CACHE_TABLE',
                                Value: {Ref: 'pccsdlcmyappcacheF6FEBBE3'}
                            },
                            {
                                Name: 'SQS_QUEUE',
                                Value: {Ref: 'pccsdlcmyappqueue069E607A'}
                            },
                            {
                                Name: 'AWS_BUCKET',
                                Value: {Ref: 'pccsdlcmyapps352258330'}
                            },
                            {
                                Name: 'AWS_SECRET_ARN',
                                Value: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-test-secrets/environment-ABC123'
                            },
                            {
                                Name: 'AWS_SHARED_SECRET_ARN',
                                Value: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-shared-secrets/environment-DEF456'
                            },
                            {Name: 'APP_BASE_PATH', Value: '/app'}
                        ],
                        Essential: true,
                        Image: {
                            'Fn::Join': [
                                '',
                                [
                                    {
                                        'Fn::Select': [
                                            4,
                                            {
                                                'Fn::Split': [
                                                    ':',
                                                    {
                                                        'Fn::Join': [
                                                            '',
                                                            [
                                                                'arn:',
                                                                {Ref: 'AWS::Partition'},
                                                                ':ecr:us-east-1:12344:repository/pcc-myapp/phpfpm'
                                                            ]
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    '.dkr.ecr.',
                                    {
                                        'Fn::Select': [
                                            3,
                                            {
                                                'Fn::Split': [
                                                    ':',
                                                    {
                                                        'Fn::Join': [
                                                            '',
                                                            [
                                                                'arn:',
                                                                {Ref: 'AWS::Partition'},
                                                                ':ecr:us-east-1:12344:repository/pcc-myapp/phpfpm'
                                                            ]
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    '.',
                                    {Ref: 'AWS::URLSuffix'},
                                    '/pcc-myapp/phpfpm:1'
                                ]
                            ]
                        },
                        LogConfiguration: {
                            LogDriver: 'awslogs',
                            Options: {
                                'awslogs-group': {
                                    Ref: 'pccsdlcmyappcontainerphpfpmscheduledtaskst0loggroupF6594B4E'
                                },
                                'awslogs-stream-prefix': 'phpfpm',
                                'awslogs-region': 'us-west-2'
                            }
                        },
                        Memory: 512,
                        Name: 'pcc-sdlc-myapp-container-phpfpm-scheduledtask-st-0',
                        ReadonlyRootFilesystem: true,
                        Secrets: [
                            {
                                Name: 'FOO',
                                ValueFrom: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':secretsmanager:us-west-2:2222:secret:pcc-sdlc-myapp-secrets/environment:FOO::'
                                        ]
                                    ]
                                }
                            },
                            {
                                Name: 'BAR',
                                ValueFrom: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':secretsmanager:us-west-2:2222:secret:pcc-sdlc-myapp-secrets/environment:BAR::'
                                        ]
                                    ]
                                }
                            },
                            {
                                Name: 'FIZ',
                                ValueFrom: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-shared-secrets/environment-DEF456:FIZ::'
                            }
                        ]
                    }
                ],
                Cpu: '256',
                ExecutionRoleArn: {
                    'Fn::GetAtt': [
                        'pccsdlcmyapptaskdefscheduledtask0execrole253CB36D',
                        'Arn'
                    ]
                },
                Family: 'pcc-sdlc-myapp-task-def-scheduledtask-0',
                Memory: '512',
                NetworkMode: 'awsvpc',
                RequiresCompatibilities: ['FARGATE'],
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                TaskRoleArn: {
                    'Fn::GetAtt': [
                        'pccsdlcmyapptaskdefscheduledtask0TaskRoleC9F469E3',
                        'Arn'
                    ]
                }
            }
        },
        pccsdlcmyapptaskdefscheduledtask0EventsRole73440933: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: {Service: 'events.amazonaws.com'}
                        }
                    ],
                    Version: '2012-10-17'
                },
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlcmyapptaskdefscheduledtask0EventsRoleDefaultPolicy9563716F: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 'ecs:RunTask',
                            Condition: {
                                ArnEquals: {
                                    'ecs:cluster': {
                                        'Fn::GetAtt': ['pccsdlcmyappcluster4E9F2DE3', 'Arn']
                                    }
                                }
                            },
                            Effect: 'Allow',
                            Resource: {Ref: 'pccsdlcmyapptaskdefscheduledtask0DC6034F0'}
                        },
                        {
                    Action: 'ecs:TagResource',
                    Effect: 'Allow',
                    Resource: {
                      'Fn::Join': [
                        '',
                        [
                          'arn:',
                          { Ref: 'AWS::Partition' },
                          ':ecs:us-west-2:*:task/',
                          { Ref: 'pccsdlcmyappcluster4E9F2DE3' },
                          '/*'
                        ]
                      ]
                    }
                  },
                  {
                            Action: 'iam:PassRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'pccsdlcmyapptaskdefscheduledtask0execrole253CB36D',
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: 'iam:PassRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'pccsdlcmyapptaskdefscheduledtask0TaskRoleC9F469E3',
                                    'Arn'
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlcmyapptaskdefscheduledtask0EventsRoleDefaultPolicy9563716F',
                Roles: [
                    {
                        Ref: 'pccsdlcmyapptaskdefscheduledtask0EventsRole73440933'
                    }
                ]
            }
        },
        pccsdlcmyapptaskdefscheduledtask0SecurityGroup55A61535: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                GroupDescription: 'pcc-shared-stack/pcc-sdlc-myapp/pcc-sdlc-myapp-task-def-scheduledtask-0/SecurityGroup',
                SecurityGroupEgress: [
                    {
                        CidrIp: '0.0.0.0/0',
                        Description: 'Allow all outbound traffic by default',
                        IpProtocol: '-1'
                    }
                ],
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                VpcId: 'vpc-12345'
            }
        },
        pccsdlcmyappcontainerphpfpmscheduledtaskst0loggroupF6594B4E: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                LogGroupName: 'pcc-sdlc-myapp-container-phpfpm-scheduledtask-st-0-log-group',
                RetentionInDays: 30,
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlcmyapptaskscheduledtask0ScheduledEventRuleC595C301: {
            Type: 'AWS::Events::Rule',
            Properties: {
                Name: 'pcc-sdlc-myapp-task-scheduledtask-0',
                ScheduleExpression: 'cron(0 12 * * ? *)',
                State: 'ENABLED',
                Targets: [
                    {
                        Arn: {
                            'Fn::GetAtt': ['pccsdlcmyappcluster4E9F2DE3', 'Arn']
                        },
                        EcsParameters: {
                            LaunchType: 'FARGATE',
                            NetworkConfiguration: {
                                AwsVpcConfiguration: {
                                    AssignPublicIp: 'DISABLED',
                                    SecurityGroups: [
                                        {
                                            'Fn::GetAtt': [
                                                'pccsdlcmyapptaskdefscheduledtask0SecurityGroup55A61535',
                                                'GroupId'
                                            ]
                                        }
                                    ],
                                    Subnets: ['p-12345', 'p-67890']
                                }
                            },
                            PlatformVersion: 'LATEST',
                            TaskCount: 1,
                            TaskDefinitionArn: {Ref: 'pccsdlcmyapptaskdefscheduledtask0DC6034F0'}
                        },
                        Id: 'Target0',
                        Input: '{}',
                        RoleArn: {
                            'Fn::GetAtt': [
                                'pccsdlcmyapptaskdefscheduledtask0EventsRole73440933',
                                'Arn'
                            ]
                        }
                    }
                ]
            }
        },
        pccsdlcmyapptaskdefweb0execrole32538409: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: {Service: 'ecs-tasks.amazonaws.com'}
                        }
                    ],
                    Version: '2012-10-17'
                },
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {
                        Key: 'aws-cdk:id',
                        Value: 'pccsharedstackpccsdlcmyapp6F659917_c8c2883eedf18aff6d7bb3e69c33e4acc1c5472efa'
                    },
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlcmyapptaskdefweb0execroleDefaultPolicyF933D5F4: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: [
                                'ecr:BatchCheckLayerAvailability',
                                'ecr:GetDownloadUrlForLayer',
                                'ecr:BatchGetImage'
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {Ref: 'AWS::Partition'},
                                        ':ecr:us-east-1:12344:repository/pcc-myapp/nginx'
                                    ]
                                ]
                            }
                        },
                        {
                            Action: 'ecr:GetAuthorizationToken',
                            Effect: 'Allow',
                            Resource: '*'
                        },
                        {
                            Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'pccsdlcmyappcontainernginxwebu0loggroup46546295',
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: [
                                'ecr:BatchCheckLayerAvailability',
                                'ecr:GetDownloadUrlForLayer',
                                'ecr:BatchGetImage'
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {Ref: 'AWS::Partition'},
                                        ':ecr:us-east-1:12344:repository/pcc-myapp/phpfpm'
                                    ]
                                ]
                            }
                        },
                        {
                            Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'pccsdlcmyappcontainerphpfpmwebu0loggroupDD777995',
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: [
                                'secretsmanager:GetSecretValue',
                                'secretsmanager:DescribeSecret'
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {Ref: 'AWS::Partition'},
                                        ':secretsmanager:us-west-2:2222:secret:pcc-sdlc-myapp-secrets/environment-??????'
                                    ]
                                ]
                            }
                        },
                        {
                            Action: [
                                'secretsmanager:GetSecretValue',
                                'secretsmanager:DescribeSecret'
                            ],
                            Effect: 'Allow',
                            Resource: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-shared-secrets/environment-DEF456'
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlcmyapptaskdefweb0execroleDefaultPolicyF933D5F4',
                Roles: [{Ref: 'pccsdlcmyapptaskdefweb0execrole32538409'}]
            }
        },
        pccsdlcmyapptaskdefweb0TaskRole44A5F54B: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: {Service: 'ecs-tasks.amazonaws.com'}
                        }
                    ],
                    Version: '2012-10-17'
                },
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlcmyapptaskdefweb0TaskRoleDefaultPolicy4427BD76: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: [
                                'ssmmessages:CreateControlChannel',
                                'ssmmessages:CreateDataChannel',
                                'ssmmessages:OpenControlChannel',
                                'ssmmessages:OpenDataChannel'
                            ],
                            Effect: 'Allow',
                            Resource: '*'
                        },
                        {
                            Action: 'logs:DescribeLogGroups',
                            Effect: 'Allow',
                            Resource: '*'
                        },
                        {
                            Action: [
                                'logs:CreateLogStream',
                                'logs:DescribeLogStreams',
                                'logs:PutLogEvents'
                            ],
                            Effect: 'Allow',
                            Resource: '*'
                        },
                        {
                            Action: [
                                'sqs:SendMessage',
                                'sqs:GetQueueAttributes',
                                'sqs:GetQueueUrl'
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': ['pccsdlcmyappqueue069E607A', 'Arn']
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
                                {'Fn::GetAtt': ['pccsdlcmyapps352258330', 'Arn']},
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': ['pccsdlcmyapps352258330', 'Arn']
                                            },
                                            '/*'
                                        ]
                                    ]
                                }
                            ]
                        },
                        {
                            Action: ['ses:SendEmail', 'ses:SendRawEmail'],
                            Effect: 'Allow',
                            Resource: '*'
                        },
                        {
                            Action: [
                                'dynamodb:BatchGetItem',
                                'dynamodb:GetRecords',
                                'dynamodb:GetShardIterator',
                                'dynamodb:Query',
                                'dynamodb:GetItem',
                                'dynamodb:Scan',
                                'dynamodb:ConditionCheckItem',
                                'dynamodb:BatchWriteItem',
                                'dynamodb:PutItem',
                                'dynamodb:UpdateItem',
                                'dynamodb:DeleteItem',
                                'dynamodb:DescribeTable'
                            ],
                            Effect: 'Allow',
                            Resource: [
                                {
                                    'Fn::GetAtt': ['pccsdlcmyappcacheF6FEBBE3', 'Arn']
                                },
                                {Ref: 'AWS::NoValue'}
                            ]
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlcmyapptaskdefweb0TaskRoleDefaultPolicy4427BD76',
                Roles: [{Ref: 'pccsdlcmyapptaskdefweb0TaskRole44A5F54B'}]
            }
        },
        pccsdlcmyapptaskdefweb0C12FF3F1: {
            Type: 'AWS::ECS::TaskDefinition',
            Properties: {
                ContainerDefinitions: [
                    {
                        Cpu: 64,
                        Essential: true,
                        Image: {
                            'Fn::Join': [
                                '',
                                [
                                    {
                                        'Fn::Select': [
                                            4,
                                            {
                                                'Fn::Split': [
                                                    ':',
                                                    {
                                                        'Fn::Join': [
                                                            '',
                                                            [
                                                                'arn:',
                                                                {Ref: 'AWS::Partition'},
                                                                ':ecr:us-east-1:12344:repository/pcc-myapp/nginx'
                                                            ]
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    '.dkr.ecr.',
                                    {
                                        'Fn::Select': [
                                            3,
                                            {
                                                'Fn::Split': [
                                                    ':',
                                                    {
                                                        'Fn::Join': [
                                                            '',
                                                            [
                                                                'arn:',
                                                                {Ref: 'AWS::Partition'},
                                                                ':ecr:us-east-1:12344:repository/pcc-myapp/nginx'
                                                            ]
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    '.',
                                    {Ref: 'AWS::URLSuffix'},
                                    '/pcc-myapp/nginx:1'
                                ]
                            ]
                        },
                        LogConfiguration: {
                            LogDriver: 'awslogs',
                            Options: {
                                'awslogs-group': {
                                    Ref: 'pccsdlcmyappcontainernginxwebu0loggroup46546295'
                                },
                                'awslogs-stream-prefix': 'nginx',
                                'awslogs-region': 'us-west-2'
                            }
                        },
                        Memory: 64,
                        Name: 'pcc-sdlc-myapp-container-nginx-web-u-0',
                        PortMappings: [{ContainerPort: 80, Protocol: 'tcp'}],
                        ReadonlyRootFilesystem: true
                    },
                    {
                        Cpu: 128,
                        Environment: [
                            {Name: 'AWS_APP_NAME', Value: 'pcc-sdlc-myapp'},
                            {
                                Name: 'MAIL_FROM_ADDRESS',
                                Value: 'no-reply@foo.sdlc.example.edu'
                            },
                            {
                                Name: 'IMPORTER_FROM',
                                Value: 'importer-no-reply@foo.sdlc.example.edu'
                            },
                            {
                                Name: 'DYNAMODB_CACHE_TABLE',
                                Value: {Ref: 'pccsdlcmyappcacheF6FEBBE3'}
                            },
                            {
                                Name: 'SQS_QUEUE',
                                Value: {Ref: 'pccsdlcmyappqueue069E607A'}
                            },
                            {
                                Name: 'AWS_BUCKET',
                                Value: {Ref: 'pccsdlcmyapps352258330'}
                            },
                            {
                                Name: 'AWS_SECRET_ARN',
                                Value: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-test-secrets/environment-ABC123'
                            },
                            {
                                Name: 'AWS_SHARED_SECRET_ARN',
                                Value: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-shared-secrets/environment-DEF456'
                            },
                            {Name: 'APP_BASE_PATH', Value: '/app'}
                        ],
                        Essential: true,
                        Image: {
                            'Fn::Join': [
                                '',
                                [
                                    {
                                        'Fn::Select': [
                                            4,
                                            {
                                                'Fn::Split': [
                                                    ':',
                                                    {
                                                        'Fn::Join': [
                                                            '',
                                                            [
                                                                'arn:',
                                                                {Ref: 'AWS::Partition'},
                                                                ':ecr:us-east-1:12344:repository/pcc-myapp/phpfpm'
                                                            ]
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    '.dkr.ecr.',
                                    {
                                        'Fn::Select': [
                                            3,
                                            {
                                                'Fn::Split': [
                                                    ':',
                                                    {
                                                        'Fn::Join': [
                                                            '',
                                                            [
                                                                'arn:',
                                                                {Ref: 'AWS::Partition'},
                                                                ':ecr:us-east-1:12344:repository/pcc-myapp/phpfpm'
                                                            ]
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    '.',
                                    {Ref: 'AWS::URLSuffix'},
                                    '/pcc-myapp/phpfpm:1'
                                ]
                            ]
                        },
                        LogConfiguration: {
                            LogDriver: 'awslogs',
                            Options: {
                                'awslogs-group': {
                                    Ref: 'pccsdlcmyappcontainerphpfpmwebu0loggroupDD777995'
                                },
                                'awslogs-stream-prefix': 'phpfpm',
                                'awslogs-region': 'us-west-2'
                            }
                        },
                        Memory: 128,
                        Name: 'pcc-sdlc-myapp-container-phpfpm-web-u-0',
                        PortMappings: [{ContainerPort: 9000, Protocol: 'tcp'}],
                        ReadonlyRootFilesystem: true,
                        Secrets: [
                            {
                                Name: 'FOO',
                                ValueFrom: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':secretsmanager:us-west-2:2222:secret:pcc-sdlc-myapp-secrets/environment:FOO::'
                                        ]
                                    ]
                                }
                            },
                            {
                                Name: 'BAR',
                                ValueFrom: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':secretsmanager:us-west-2:2222:secret:pcc-sdlc-myapp-secrets/environment:BAR::'
                                        ]
                                    ]
                                }
                            },
                            {
                                Name: 'FIZ',
                                ValueFrom: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-shared-secrets/environment-DEF456:FIZ::'
                            }
                        ]
                    }
                ],
                Cpu: '512',
                ExecutionRoleArn: {
                    'Fn::GetAtt': ['pccsdlcmyapptaskdefweb0execrole32538409', 'Arn']
                },
                Family: 'pcc-sdlc-myapp-task-def-web-0',
                Memory: '1024',
                NetworkMode: 'awsvpc',
                RequiresCompatibilities: ['FARGATE'],
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                TaskRoleArn: {
                    'Fn::GetAtt': ['pccsdlcmyapptaskdefweb0TaskRole44A5F54B', 'Arn']
                }
            }
        },
        pccsdlcmyappcontainernginxwebu0loggroup46546295: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                LogGroupName: 'pcc-sdlc-myapp-container-nginx-web-u-0-log-group',
                RetentionInDays: 30,
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlcmyappcontainerphpfpmwebu0loggroupDD777995: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                LogGroupName: 'pcc-sdlc-myapp-container-phpfpm-web-u-0-log-group',
                RetentionInDays: 30,
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlcmyappserviceweb0Service28A2C321: {
            Type: 'AWS::ECS::Service',
            Properties: {
                Cluster: {Ref: 'pccsdlcmyappcluster4E9F2DE3'},
                DeploymentConfiguration: {
                    Alarms: {AlarmNames: [], Enable: false, Rollback: false},
                    MaximumPercent: 200,
                    MinimumHealthyPercent: 50
                },
                DesiredCount: 1,
                EnableECSManagedTags: false,
                EnableExecuteCommand: true,
                HealthCheckGracePeriodSeconds: 60,
                LaunchType: 'FARGATE',
                LoadBalancers: [
                    {
                        ContainerName: 'pcc-sdlc-myapp-container-nginx-web-u-0',
                        ContainerPort: 80,
                        TargetGroupArn: {Ref: 'pccsdlcmyapptg1E18EDE5'}
                    }
                ],
                NetworkConfiguration: {
                    AwsvpcConfiguration: {
                        AssignPublicIp: 'DISABLED',
                        SecurityGroups: [
                            {
                                'Fn::GetAtt': [
                                    'pccsdlcmyappserviceweb0SecurityGroupEA0D4069',
                                    'GroupId'
                                ]
                            }
                        ],
                        Subnets: ['p-12345', 'p-67890']
                    }
                },
                PlatformVersion: 'LATEST',
                ServiceName: 'pcc-sdlc-myapp-service-web-0',
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                TaskDefinition: {Ref: 'pccsdlcmyapptaskdefweb0C12FF3F1'}
            },
            DependsOn: [
                'pccsdlcmyapplistenerrule10003C2FE33',
                'pccsdlcmyapptaskdefweb0TaskRoleDefaultPolicy4427BD76',
                'pccsdlcmyapptaskdefweb0TaskRole44A5F54B'
            ]
        },
        pccsdlcmyappserviceweb0SecurityGroupEA0D4069: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                GroupDescription: 'pcc-shared-stack/pcc-sdlc-myapp/pcc-sdlc-myapp-service-web-0/SecurityGroup',
                SecurityGroupEgress: [
                    {
                        CidrIp: '0.0.0.0/0',
                        Description: 'Allow all outbound traffic by default',
                        IpProtocol: '-1'
                    }
                ],
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                VpcId: 'vpc-12345'
            },
            DependsOn: [
                'pccsdlcmyapptaskdefweb0TaskRoleDefaultPolicy4427BD76',
                'pccsdlcmyapptaskdefweb0TaskRole44A5F54B'
            ]
        },
        pccsdlcmyappserviceweb0SecurityGroupfrompccsharedstackpccsdlcmyapplookuphttpslistenerSecurityGroupsg123456789012543CF5BD804E7E318F: {
            Type: 'AWS::EC2::SecurityGroupIngress',
            Properties: {
                Description: 'Load balancer to target',
                FromPort: 80,
                GroupId: {
                    'Fn::GetAtt': [
                        'pccsdlcmyappserviceweb0SecurityGroupEA0D4069',
                        'GroupId'
                    ]
                },
                IpProtocol: 'tcp',
                SourceSecurityGroupId: 'sg-12345678',
                ToPort: 80
            },
            DependsOn: [
                'pccsdlcmyapptaskdefweb0TaskRoleDefaultPolicy4427BD76',
                'pccsdlcmyapptaskdefweb0TaskRole44A5F54B'
            ]
        },
        pccsdlcmyappserviceweb0TaskCountTargetC0BDCD4E: {
            Type: 'AWS::ApplicationAutoScaling::ScalableTarget',
            Properties: {
                MaxCapacity: 3,
                MinCapacity: 1,
                ResourceId: {
                    'Fn::Join': [
                        '',
                        [
                            'service/',
                            {Ref: 'pccsdlcmyappcluster4E9F2DE3'},
                            '/',
                            {
                                'Fn::GetAtt': ['pccsdlcmyappserviceweb0Service28A2C321', 'Name']
                            }
                        ]
                    ]
                },
                RoleARN: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {Ref: 'AWS::Partition'},
                            ':iam::2222:role/aws-service-role/ecs.application-autoscaling.amazonaws.com/AWSServiceRoleForApplicationAutoScaling_ECSService'
                        ]
                    ]
                },
                ScalableDimension: 'ecs:service:DesiredCount',
                ServiceNamespace: 'ecs'
            },
            DependsOn: [
                'pccsdlcmyapptaskdefweb0TaskRoleDefaultPolicy4427BD76',
                'pccsdlcmyapptaskdefweb0TaskRole44A5F54B'
            ]
        },
        pccsdlcmyappserviceweb0TaskCountTargetpccsdlcmyappservicescalecpu580E5A4F: {
            Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
            Properties: {
                PolicyName: 'pccsharedstackpccsdlcmyapppccsdlcmyappserviceweb0TaskCountTargetpccsdlcmyappservicescalecpu43CE0804',
                PolicyType: 'TargetTrackingScaling',
                ScalingTargetId: {Ref: 'pccsdlcmyappserviceweb0TaskCountTargetC0BDCD4E'},
                TargetTrackingScalingPolicyConfiguration: {
                    PredefinedMetricSpecification: {PredefinedMetricType: 'ECSServiceAverageCPUUtilization'},
                    TargetValue: 75
                }
            },
            DependsOn: [
                'pccsdlcmyapptaskdefweb0TaskRoleDefaultPolicy4427BD76',
                'pccsdlcmyapptaskdefweb0TaskRole44A5F54B'
            ]
        },
        pccsdlcmyappserviceweb0TaskCountTargetpccsdlcmyappservicescalememB0AA1F75: {
            Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
            Properties: {
                PolicyName: 'pccsharedstackpccsdlcmyapppccsdlcmyappserviceweb0TaskCountTargetpccsdlcmyappservicescalemem27F521B3',
                PolicyType: 'TargetTrackingScaling',
                ScalingTargetId: {Ref: 'pccsdlcmyappserviceweb0TaskCountTargetC0BDCD4E'},
                TargetTrackingScalingPolicyConfiguration: {
                    PredefinedMetricSpecification: {
                        PredefinedMetricType: 'ECSServiceAverageMemoryUtilization'
                    },
                    TargetValue: 75
                }
            },
            DependsOn: [
                'pccsdlcmyapptaskdefweb0TaskRoleDefaultPolicy4427BD76',
                'pccsdlcmyapptaskdefweb0TaskRole44A5F54B'
            ]
        }
    },
    Outputs: {
        pccsdlcmyappsesverifyfoofoosdlcexampleeduSesNotificationTopic75284EDE: {
            Description: 'SES notification topic for foo.sdlc.example.edu',
            Value: {Ref: 'pccsdlcmyappsesverifyfooSesNotificationTopic99002DE8'}
        }
    }
}