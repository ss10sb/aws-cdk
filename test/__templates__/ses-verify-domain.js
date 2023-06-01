const {MatchHelper} = require("../../src/utils/testing/match-helper");
module.exports = {
    Resources: {
        sesverifydomainsesverifytestexampleeduVerifyDomainIdentity73F74ED0: {
            Type: 'Custom::AWS',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': [ 'AWS679f53fac002430cb0da5b7982bd22872D164C4C', 'Arn' ]
                },
                Create: '{"service":"SES","action":"verifyDomainIdentity","parameters":{"Domain":"test.example.edu"},"physicalResourceId":{"responsePath":"VerificationToken"}}',
                Update: '{"service":"SES","action":"verifyDomainIdentity","parameters":{"Domain":"test.example.edu"},"physicalResourceId":{"responsePath":"VerificationToken"}}',
                Delete: '{"service":"SES","action":"deleteIdentity","parameters":{"Identity":"test.example.edu"}}',
                InstallLatestAwsSdk: true
            },
            DependsOn: [
                'sesverifydomainsesverifytestexampleeduVerifyDomainIdentityCustomResourcePolicyD2E578B8'
            ],
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        sesverifydomainsesverifytestexampleeduVerifyDomainIdentityCustomResourcePolicyD2E578B8: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: [ 'ses:VerifyDomainIdentity', 'ses:DeleteIdentity' ],
                            Effect: 'Allow',
                            Resource: '*'
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'sesverifydomainsesverifytestexampleeduVerifyDomainIdentityCustomResourcePolicyD2E578B8',
                Roles: [
                    {
                        Ref: 'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2'
                    }
                ]
            }
        },
        sesverifydomainsesverifytestexampleeduSesVerificationRecord8A177481: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                Name: '_amazonses.test.example.edu.',
                Type: 'TXT',
                HostedZoneId: 'DUMMY',
                ResourceRecords: [
                    {
                        'Fn::Join': [
                            '',
                            [
                                '"',
                                {
                                    'Fn::GetAtt': [
                                        'sesverifydomainsesverifytestexampleeduVerifyDomainIdentity73F74ED0',
                                        'VerificationToken'
                                    ]
                                },
                                '"'
                            ]
                        ]
                    }
                ],
                TTL: '1800'
            },
            DependsOn: [
                'sesverifydomainsesverifytestexampleeduVerifyDomainIdentityCustomResourcePolicyD2E578B8',
                'sesverifydomainsesverifytestexampleeduVerifyDomainIdentity73F74ED0'
            ]
        },
        sesverifydomainsesverifytestexampleeduVerifyDomainDkimEEBF9F33: {
            Type: 'Custom::AWS',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': [ 'AWS679f53fac002430cb0da5b7982bd22872D164C4C', 'Arn' ]
                },
                Create: '{"service":"SES","action":"verifyDomainDkim","parameters":{"Domain":"test.example.edu"},"physicalResourceId":{"id":"test.example.edu-verify-domain-dkim"}}',
                Update: '{"service":"SES","action":"verifyDomainDkim","parameters":{"Domain":"test.example.edu"},"physicalResourceId":{"id":"test.example.edu-verify-domain-dkim"}}',
                InstallLatestAwsSdk: true
            },
            DependsOn: [
                'sesverifydomainsesverifytestexampleeduVerifyDomainDkimCustomResourcePolicy23887402',
                'sesverifydomainsesverifytestexampleeduVerifyDomainIdentityCustomResourcePolicyD2E578B8',
                'sesverifydomainsesverifytestexampleeduVerifyDomainIdentity73F74ED0'
            ],
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        sesverifydomainsesverifytestexampleeduVerifyDomainDkimCustomResourcePolicy23887402: {
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
                PolicyName: 'sesverifydomainsesverifytestexampleeduVerifyDomainDkimCustomResourcePolicy23887402',
                Roles: [
                    {
                        Ref: 'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2'
                    }
                ]
            },
            DependsOn: [
                'sesverifydomainsesverifytestexampleeduVerifyDomainIdentityCustomResourcePolicyD2E578B8',
                'sesverifydomainsesverifytestexampleeduVerifyDomainIdentity73F74ED0'
            ]
        },
        sesverifydomainsesverifytestexampleeduSesDkimVerificationRecord09984B9B2: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                Name: {
                    'Fn::Join': [
                        '',
                        [
                            {
                                'Fn::GetAtt': [
                                    'sesverifydomainsesverifytestexampleeduVerifyDomainDkimEEBF9F33',
                                    'DkimTokens.0'
                                ]
                            },
                            '._domainkey.test.example.edu.'
                        ]
                    ]
                },
                Type: 'CNAME',
                HostedZoneId: 'DUMMY',
                ResourceRecords: [
                    {
                        'Fn::Join': [
                            '',
                            [
                                {
                                    'Fn::GetAtt': [
                                        'sesverifydomainsesverifytestexampleeduVerifyDomainDkimEEBF9F33',
                                        'DkimTokens.0'
                                    ]
                                },
                                '.dkim.amazonses.com'
                            ]
                        ]
                    }
                ],
                TTL: '1800'
            },
            DependsOn: [
                'sesverifydomainsesverifytestexampleeduVerifyDomainDkimCustomResourcePolicy23887402',
                'sesverifydomainsesverifytestexampleeduVerifyDomainDkimEEBF9F33'
            ]
        },
        sesverifydomainsesverifytestexampleeduSesDkimVerificationRecord1D7CA4F78: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                Name: {
                    'Fn::Join': [
                        '',
                        [
                            {
                                'Fn::GetAtt': [
                                    'sesverifydomainsesverifytestexampleeduVerifyDomainDkimEEBF9F33',
                                    'DkimTokens.1'
                                ]
                            },
                            '._domainkey.test.example.edu.'
                        ]
                    ]
                },
                Type: 'CNAME',
                HostedZoneId: 'DUMMY',
                ResourceRecords: [
                    {
                        'Fn::Join': [
                            '',
                            [
                                {
                                    'Fn::GetAtt': [
                                        'sesverifydomainsesverifytestexampleeduVerifyDomainDkimEEBF9F33',
                                        'DkimTokens.1'
                                    ]
                                },
                                '.dkim.amazonses.com'
                            ]
                        ]
                    }
                ],
                TTL: '1800'
            },
            DependsOn: [
                'sesverifydomainsesverifytestexampleeduVerifyDomainDkimCustomResourcePolicy23887402',
                'sesverifydomainsesverifytestexampleeduVerifyDomainDkimEEBF9F33'
            ]
        },
        sesverifydomainsesverifytestexampleeduSesDkimVerificationRecord2E5D09023: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                Name: {
                    'Fn::Join': [
                        '',
                        [
                            {
                                'Fn::GetAtt': [
                                    'sesverifydomainsesverifytestexampleeduVerifyDomainDkimEEBF9F33',
                                    'DkimTokens.2'
                                ]
                            },
                            '._domainkey.test.example.edu.'
                        ]
                    ]
                },
                Type: 'CNAME',
                HostedZoneId: 'DUMMY',
                ResourceRecords: [
                    {
                        'Fn::Join': [
                            '',
                            [
                                {
                                    'Fn::GetAtt': [
                                        'sesverifydomainsesverifytestexampleeduVerifyDomainDkimEEBF9F33',
                                        'DkimTokens.2'
                                    ]
                                },
                                '.dkim.amazonses.com'
                            ]
                        ]
                    }
                ],
                TTL: '1800'
            },
            DependsOn: [
                'sesverifydomainsesverifytestexampleeduVerifyDomainDkimCustomResourcePolicy23887402',
                'sesverifydomainsesverifytestexampleeduVerifyDomainDkimEEBF9F33'
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
        AWS679f53fac002430cb0da5b7982bd22872D164C4C: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-12344-us-east-1',
                    S3Key: MatchHelper.endsWith('zip')
                },
                Role: {
                    'Fn::GetAtt': [
                        'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2',
                        'Arn'
                    ]
                },
                Handler: 'index.handler',
                Runtime: MatchHelper.startsWith('nodejs'),
                Timeout: 120
            },
            DependsOn: [ 'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2' ]
        }
    }
}