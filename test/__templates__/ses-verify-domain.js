const {MatchHelper} = require("../../src/utils/testing/match-helper");
module.exports = {
    Resources: {
        sesverifydomainsesverifytestVerifyDomainIdentity5C0F12C0: {
            Type: 'Custom::AWS',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': ['AWS679f53fac002430cb0da5b7982bd22872D164C4C', 'Arn']
                },
                Create: '{"service":"SES","action":"verifyDomainIdentity","parameters":{"Domain":"test.example.edu"},"physicalResourceId":{"responsePath":"VerificationToken"},"logApiResponseData":true}',
                Update: '{"service":"SES","action":"verifyDomainIdentity","parameters":{"Domain":"test.example.edu"},"physicalResourceId":{"responsePath":"VerificationToken"},"logApiResponseData":true}',
                Delete: '{"service":"SES","action":"deleteIdentity","parameters":{"Identity":"test.example.edu"},"logApiResponseData":true}',
                InstallLatestAwsSdk: true
            },
            DependsOn: [
                'sesverifydomainsesverifytestVerifyDomainIdentityCustomResourcePolicy27DA3974'
            ],
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        sesverifydomainsesverifytestVerifyDomainIdentityCustomResourcePolicy27DA3974: {
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
                PolicyName: 'sesverifydomainsesverifytestVerifyDomainIdentityCustomResourcePolicy27DA3974',
                Roles: [
                    {
                        Ref: 'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2'
                    }
                ]
            }
        },
        sesverifydomainsesverifytestSesNotificationTopicA2AD7F9D: {
            Type: 'AWS::SNS::Topic',
            DependsOn: [
                'sesverifydomainsesverifytestVerifyDomainIdentityCustomResourcePolicy27DA3974',
                'sesverifydomainsesverifytestVerifyDomainIdentity5C0F12C0'
            ]
        },
        sesverifydomainsesverifytestAddComplaintTopictestexampleedu69B2CE02: {
            Type: 'Custom::AWS',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': ['AWS679f53fac002430cb0da5b7982bd22872D164C4C', 'Arn']
                },
                Create: {
                    'Fn::Join': [
                        '',
                        [
                            '{"service":"SES","action":"setIdentityNotificationTopic","parameters":{"Identity":"test.example.edu","NotificationType":"Complaint","SnsTopic":"',
                            {
                                Ref: 'sesverifydomainsesverifytestSesNotificationTopicA2AD7F9D'
                            },
                            '"},"physicalResourceId":{"id":"test.example.edu-set-Complaint-topic"},"logApiResponseData":true}'
                        ]
                    ]
                },
                InstallLatestAwsSdk: true
            },
            DependsOn: [
                'sesverifydomainsesverifytestAddComplaintTopictestexampleeduCustomResourcePolicy792F7196',
                'sesverifydomainsesverifytestSesNotificationTopicA2AD7F9D'
            ],
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        sesverifydomainsesverifytestAddComplaintTopictestexampleeduCustomResourcePolicy792F7196: {
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
                PolicyName: 'sesverifydomainsesverifytestAddComplaintTopictestexampleeduCustomResourcePolicy792F7196',
                Roles: [
                    {
                        Ref: 'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2'
                    }
                ]
            },
            DependsOn: ['sesverifydomainsesverifytestSesNotificationTopicA2AD7F9D']
        },
        sesverifydomainsesverifytestSesVerificationRecord94A73A8B: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                HostedZoneId: 'DUMMY',
                Name: '_amazonses.test.example.edu.',
                ResourceRecords: [
                    {
                        'Fn::Join': [
                            '',
                            [
                                '"',
                                {
                                    'Fn::GetAtt': [
                                        'sesverifydomainsesverifytestVerifyDomainIdentity5C0F12C0',
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
                'sesverifydomainsesverifytestVerifyDomainIdentityCustomResourcePolicy27DA3974',
                'sesverifydomainsesverifytestVerifyDomainIdentity5C0F12C0'
            ]
        },
        sesverifydomainsesverifytestSesMxRecordC3B64DCC: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                HostedZoneId: 'DUMMY',
                Name: 'test.example.edu.',
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
                'sesverifydomainsesverifytestVerifyDomainIdentityCustomResourcePolicy27DA3974',
                'sesverifydomainsesverifytestVerifyDomainIdentity5C0F12C0'
            ]
        },
        sesverifydomainsesverifytestVerifyDomainDkim7FF9FF2D: {
            Type: 'Custom::AWS',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': ['AWS679f53fac002430cb0da5b7982bd22872D164C4C', 'Arn']
                },
                Create: '{"service":"SES","action":"verifyDomainDkim","parameters":{"Domain":"test.example.edu"},"physicalResourceId":{"id":"test.example.edu-verify-domain-dkim"},"logApiResponseData":true}',
                Update: '{"service":"SES","action":"verifyDomainDkim","parameters":{"Domain":"test.example.edu"},"physicalResourceId":{"id":"test.example.edu-verify-domain-dkim"},"logApiResponseData":true}',
                InstallLatestAwsSdk: true
            },
            DependsOn: [
                'sesverifydomainsesverifytestVerifyDomainDkimCustomResourcePolicyCCDA3DEE',
                'sesverifydomainsesverifytestVerifyDomainIdentityCustomResourcePolicy27DA3974',
                'sesverifydomainsesverifytestVerifyDomainIdentity5C0F12C0'
            ],
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        sesverifydomainsesverifytestVerifyDomainDkimCustomResourcePolicyCCDA3DEE: {
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
                PolicyName: 'sesverifydomainsesverifytestVerifyDomainDkimCustomResourcePolicyCCDA3DEE',
                Roles: [
                    {
                        Ref: 'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2'
                    }
                ]
            },
            DependsOn: [
                'sesverifydomainsesverifytestVerifyDomainIdentityCustomResourcePolicy27DA3974',
                'sesverifydomainsesverifytestVerifyDomainIdentity5C0F12C0'
            ]
        },
        sesverifydomainsesverifytestSesDkimVerificationRecord0D36DD85D: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                HostedZoneId: 'DUMMY',
                Name: {
                    'Fn::Join': [
                        '',
                        [
                            {
                                'Fn::GetAtt': [
                                    'sesverifydomainsesverifytestVerifyDomainDkim7FF9FF2D',
                                    'DkimTokens.0'
                                ]
                            },
                            '._domainkey.test.example.edu.'
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
                                        'sesverifydomainsesverifytestVerifyDomainDkim7FF9FF2D',
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
                'sesverifydomainsesverifytestVerifyDomainDkimCustomResourcePolicyCCDA3DEE',
                'sesverifydomainsesverifytestVerifyDomainDkim7FF9FF2D'
            ]
        },
        sesverifydomainsesverifytestSesDkimVerificationRecord16B07C689: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                HostedZoneId: 'DUMMY',
                Name: {
                    'Fn::Join': [
                        '',
                        [
                            {
                                'Fn::GetAtt': [
                                    'sesverifydomainsesverifytestVerifyDomainDkim7FF9FF2D',
                                    'DkimTokens.1'
                                ]
                            },
                            '._domainkey.test.example.edu.'
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
                                        'sesverifydomainsesverifytestVerifyDomainDkim7FF9FF2D',
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
                'sesverifydomainsesverifytestVerifyDomainDkimCustomResourcePolicyCCDA3DEE',
                'sesverifydomainsesverifytestVerifyDomainDkim7FF9FF2D'
            ]
        },
        sesverifydomainsesverifytestSesDkimVerificationRecord2D3B5A2C2: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                HostedZoneId: 'DUMMY',
                Name: {
                    'Fn::Join': [
                        '',
                        [
                            {
                                'Fn::GetAtt': [
                                    'sesverifydomainsesverifytestVerifyDomainDkim7FF9FF2D',
                                    'DkimTokens.2'
                                ]
                            },
                            '._domainkey.test.example.edu.'
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
                                        'sesverifydomainsesverifytestVerifyDomainDkim7FF9FF2D',
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
                'sesverifydomainsesverifytestVerifyDomainDkimCustomResourcePolicyCCDA3DEE',
                'sesverifydomainsesverifytestVerifyDomainDkim7FF9FF2D'
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
                ]
            }
        },
        AWS679f53fac002430cb0da5b7982bd22872D164C4C: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-12344-us-east-1',
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
                Timeout: 120
            },
            DependsOn: ['AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2']
        }
    },
    Outputs: {
        sesverifydomainsesverifytesttestexampleeduSesNotificationTopicCE465730: {
            Description: 'SES notification topic for test.example.edu',
            Value: {
                Ref: 'sesverifydomainsesverifytestSesNotificationTopicA2AD7F9D'
            }
        }
    }
}