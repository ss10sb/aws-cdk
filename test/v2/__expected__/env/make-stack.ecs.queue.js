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
                { Key: 'App', Value: 'myapp' },
                { Key: 'College', Value: 'PCC' },
                { Key: 'Environment', Value: 'sdlc' }
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
                'Fn::GetAtt': [ 'AWS679f53fac002430cb0da5b7982bd22872D164C4C', 'Arn' ]
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
            DependsOn: [ 'pccsdlcmyappsesverifyfooSesNotificationTopic99002DE8' ]
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
                        HostHeaderConfig: {Values: ['test.dev.example.edu']}
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
        pccsdlcmyappservicequeue0loggroup9DDCB13E: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                LogGroupName: 'pcc-sdlc-myapp-service-queue-0-log-group',
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
        pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleECEB1AA4: {
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
        pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleDefaultPolicyDBA3B087: {
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
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleDefaultPolicyDBA3B087',
                Roles: [
                    {
                        Ref: 'pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleECEB1AA4'
                    }
                ]
            }
        },
        pccsdlcmyappservicequeue0QueueProcessingTaskDef277B33FF: {
            Type: 'AWS::ECS::TaskDefinition',
            Properties: {
                ContainerDefinitions: [
                    {
                        Command: [
                            '/usr/local/bin/php',
                            'artisan',
                            'queue:work',
                            '--tries=3',
                            '--delay=3',
                            '--sleep=3'
                        ],
                        Environment: [
                            {
                                Name: 'QUEUE_NAME',
                                Value: {
                                    'Fn::GetAtt': ['pccsdlcmyappqueue069E607A', 'QueueName']
                                }
                            }
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
                                'awslogs-group': {Ref: 'pccsdlcmyappservicequeue0loggroup9DDCB13E'},
                                'awslogs-stream-prefix': 'phpfpm',
                                'awslogs-region': 'us-west-2'
                            }
                        },
                        Name: 'QueueProcessingContainer'
                    }
                ],
                Cpu: '256',
                ExecutionRoleArn: {
                    'Fn::GetAtt': [
                        'pccsdlcmyappservicequeue0QueueProcessingTaskDefExecutionRoleC60C75CA',
                        'Arn'
                    ]
                },
                Family: 'pcc-sdlc-myapp-service-queue-0',
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
                        'pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleECEB1AA4',
                        'Arn'
                    ]
                }
            }
        },
        pccsdlcmyappservicequeue0QueueProcessingTaskDefExecutionRoleC60C75CA: {
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
                        Value: 'pccsharedstackpccsdlcmyapp6F659917_c8d405c8da7563e75c62ee4e93b91a3deb6ceb6bc1'
                    },
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ]
            }
        },
        pccsdlcmyappservicequeue0QueueProcessingTaskDefExecutionRoleDefaultPolicy7AFB8ADD: {
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
                                    'pccsdlcmyappservicequeue0loggroup9DDCB13E',
                                    'Arn'
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlcmyappservicequeue0QueueProcessingTaskDefExecutionRoleDefaultPolicy7AFB8ADD',
                Roles: [
                    {
                        Ref: 'pccsdlcmyappservicequeue0QueueProcessingTaskDefExecutionRoleC60C75CA'
                    }
                ]
            }
        },
        pccsdlcmyappservicequeue0QueueProcessingFargateServiceF0BE3522: {
            Type: 'AWS::ECS::Service',
            Properties: {
                Cluster: {Ref: 'pccsdlcmyappcluster4E9F2DE3'},
                DeploymentConfiguration: {
                    Alarms: {AlarmNames: [], Enable: false, Rollback: false},
                    MaximumPercent: 200,
                    MinimumHealthyPercent: 50
                },
                EnableECSManagedTags: false,
                LaunchType: 'FARGATE',
                NetworkConfiguration: {
                    AwsvpcConfiguration: {
                        AssignPublicIp: 'DISABLED',
                        SecurityGroups: [
                            {
                                'Fn::GetAtt': [
                                    'pccsdlcmyappservicequeue0QueueProcessingFargateServiceSecurityGroup5B7C2C6C',
                                    'GroupId'
                                ]
                            }
                        ],
                        Subnets: ['p-12345', 'p-67890']
                    }
                },
                PlatformVersion: 'LATEST',
                ServiceName: 'pcc-sdlc-myapp-service-queue-0',
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                TaskDefinition: {
                    Ref: 'pccsdlcmyappservicequeue0QueueProcessingTaskDef277B33FF'
                }
            },
            DependsOn: [
                'pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleDefaultPolicyDBA3B087',
                'pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleECEB1AA4'
            ]
        },
        pccsdlcmyappservicequeue0QueueProcessingFargateServiceSecurityGroup5B7C2C6C: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                GroupDescription: 'pcc-shared-stack/pcc-sdlc-myapp/pcc-sdlc-myapp-service-queue-0/QueueProcessingFargateService/SecurityGroup',
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
                'pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleDefaultPolicyDBA3B087',
                'pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleECEB1AA4'
            ]
        },
        pccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetCE82EEC2: {
            Type: 'AWS::ApplicationAutoScaling::ScalableTarget',
            Properties: {
                MaxCapacity: 2,
                MinCapacity: 0,
                ResourceId: {
                    'Fn::Join': [
                        '',
                        [
                            'service/',
                            {Ref: 'pccsdlcmyappcluster4E9F2DE3'},
                            '/',
                            {
                                'Fn::GetAtt': [
                                    'pccsdlcmyappservicequeue0QueueProcessingFargateServiceF0BE3522',
                                    'Name'
                                ]
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
                'pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleDefaultPolicyDBA3B087',
                'pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleECEB1AA4'
            ]
        },
        pccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetCpuScaling1EF49E37: {
            Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
            Properties: {
                PolicyName: 'pccsharedstackpccsdlcmyapppccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetCpuScaling56699606',
                PolicyType: 'TargetTrackingScaling',
                ScalingTargetId: {
                    Ref: 'pccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetCE82EEC2'
                },
                TargetTrackingScalingPolicyConfiguration: {
                    PredefinedMetricSpecification: {PredefinedMetricType: 'ECSServiceAverageCPUUtilization'},
                    TargetValue: 50
                }
            },
            DependsOn: [
                'pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleDefaultPolicyDBA3B087',
                'pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleECEB1AA4'
            ]
        },
        pccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingLowerPolicy0EA8CD56: {
            Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
            Properties: {
                PolicyName: 'pccsharedstackpccsdlcmyapppccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingLowerPolicy9E1B0C0F',
                PolicyType: 'StepScaling',
                ScalingTargetId: {
                    Ref: 'pccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetCE82EEC2'
                },
                StepScalingPolicyConfiguration: {
                    AdjustmentType: 'ChangeInCapacity',
                    MetricAggregationType: 'Maximum',
                    StepAdjustments: [{MetricIntervalUpperBound: 0, ScalingAdjustment: -1}]
                }
            },
            DependsOn: [
                'pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleDefaultPolicyDBA3B087',
                'pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleECEB1AA4'
            ]
        },
        pccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingLowerAlarmBF362659: {
            Type: 'AWS::CloudWatch::Alarm',
            Properties: {
                AlarmActions: [
                    {
                        Ref: 'pccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingLowerPolicy0EA8CD56'
                    }
                ],
                AlarmDescription: 'Lower threshold scaling alarm',
                ComparisonOperator: 'LessThanOrEqualToThreshold',
                Dimensions: [
                    {
                        Name: 'QueueName',
                        Value: {
                            'Fn::GetAtt': ['pccsdlcmyappqueue069E607A', 'QueueName']
                        }
                    }
                ],
                EvaluationPeriods: 1,
                MetricName: 'ApproximateNumberOfMessagesVisible',
                Namespace: 'AWS/SQS',
                Period: 300,
                Statistic: 'Maximum',
              Tags: [
                { Key: 'App', Value: 'myapp' },
                { Key: 'College', Value: 'PCC' },
                { Key: 'Environment', Value: 'sdlc' }
              ],
                Threshold: 0
            },
            DependsOn: [
                'pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleDefaultPolicyDBA3B087',
                'pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleECEB1AA4'
            ]
        },
        pccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingUpperPolicy49011084: {
            Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
            Properties: {
                PolicyName: 'pccsharedstackpccsdlcmyapppccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingUpperPolicy6BCBC944',
                PolicyType: 'StepScaling',
                ScalingTargetId: {
                    Ref: 'pccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetCE82EEC2'
                },
                StepScalingPolicyConfiguration: {
                    AdjustmentType: 'ChangeInCapacity',
                    MetricAggregationType: 'Maximum',
                    StepAdjustments: [
                        {
                            MetricIntervalLowerBound: 0,
                            MetricIntervalUpperBound: 9,
                            ScalingAdjustment: 1
                        },
                        {MetricIntervalLowerBound: 9, ScalingAdjustment: 2}
                    ]
                }
            },
            DependsOn: [
                'pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleDefaultPolicyDBA3B087',
                'pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleECEB1AA4'
            ]
        },
        pccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingUpperAlarm617AF3F0: {
            Type: 'AWS::CloudWatch::Alarm',
            Properties: {
                AlarmActions: [
                    {
                        Ref: 'pccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingUpperPolicy49011084'
                    }
                ],
                AlarmDescription: 'Upper threshold scaling alarm',
                ComparisonOperator: 'GreaterThanOrEqualToThreshold',
                Dimensions: [
                    {
                        Name: 'QueueName',
                        Value: {
                            'Fn::GetAtt': ['pccsdlcmyappqueue069E607A', 'QueueName']
                        }
                    }
                ],
                EvaluationPeriods: 1,
                MetricName: 'ApproximateNumberOfMessagesVisible',
                Namespace: 'AWS/SQS',
                Period: 300,
                Statistic: 'Maximum',
              Tags: [
                { Key: 'App', Value: 'myapp' },
                { Key: 'College', Value: 'PCC' },
                { Key: 'Environment', Value: 'sdlc' }
              ],
                Threshold: 1
            },
            DependsOn: [
                'pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleDefaultPolicyDBA3B087',
                'pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleECEB1AA4'
            ]
        }
    },
    Outputs: {
          pccsdlcmyappsesverifyfoofoosdlcexampleeduSesNotificationTopic75284EDE: {
            Description: 'SES notification topic for foo.sdlc.example.edu',
            Value: { Ref: 'pccsdlcmyappsesverifyfooSesNotificationTopic99002DE8' }
          },
        pccsdlcmyappservicequeue0SQSQueue8306BFF0: {
            Value: {'Fn::GetAtt': ['pccsdlcmyappqueue069E607A', 'QueueName']}
        },
        pccsdlcmyappservicequeue0SQSQueueArn061B9BC6: {
            Value: {'Fn::GetAtt': ['pccsdlcmyappqueue069E607A', 'Arn']}
        }
    }
}