const {MatchHelper} = require("../../src/utils/testing/match-helper");
module.exports = {
    Resources: {
        pccsdlcmyapptestdevexampleeduarecord1EBFD14B: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                Name: 'test.dev.example.edu.',
                Type: 'A',
                AliasTarget: {
                    DNSName: 'dualstack.my-load-balancer-1234567890.us-west-2.elb.amazonaws.com',
                    HostedZoneId: 'Z3DZXE0EXAMPLE'
                },
                Comment: 'pcc-sdlc-myapp: test.dev.example.edu',
                HostedZoneId: 'DUMMY'
            }
        },
        pccsdlcmyappsesverifytestVerifyDomainIdentityE052339E: {
            Type: 'Custom::AWS',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': [ 'AWS679f53fac002430cb0da5b7982bd22872D164C4C', 'Arn' ]
                },
                Create: '{"service":"SES","action":"verifyDomainIdentity","parameters":{"Domain":"test.dev.example.edu"},"physicalResourceId":{"responsePath":"VerificationToken"}}',
                Update: '{"service":"SES","action":"verifyDomainIdentity","parameters":{"Domain":"test.dev.example.edu"},"physicalResourceId":{"responsePath":"VerificationToken"}}',
                Delete: '{"service":"SES","action":"deleteIdentity","parameters":{"Identity":"test.dev.example.edu"}}',
                InstallLatestAwsSdk: true
            },
            DependsOn: [
                'pccsdlcmyappsesverifytestVerifyDomainIdentityCustomResourcePolicy4BE20186'
            ],
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlcmyappsesverifytestVerifyDomainIdentityCustomResourcePolicy4BE20186: {
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
                PolicyName: 'pccsdlcmyappsesverifytestVerifyDomainIdentityCustomResourcePolicy4BE20186',
                Roles: [
                    {
                        Ref: 'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2'
                    }
                ]
            }
        },
        pccsdlcmyappsesverifytestSesVerificationRecord5CAAC1A0: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                Name: '_amazonses.test.dev.example.edu.',
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
                                        'pccsdlcmyappsesverifytestVerifyDomainIdentityE052339E',
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
                'pccsdlcmyappsesverifytestVerifyDomainIdentityCustomResourcePolicy4BE20186',
                'pccsdlcmyappsesverifytestVerifyDomainIdentityE052339E'
            ]
        },
        pccsdlcmyappsesverifytestVerifyDomainDkim21798902: {
            Type: 'Custom::AWS',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': [ 'AWS679f53fac002430cb0da5b7982bd22872D164C4C', 'Arn' ]
                },
                Create: '{"service":"SES","action":"verifyDomainDkim","parameters":{"Domain":"test.dev.example.edu"},"physicalResourceId":{"id":"test.dev.example.edu-verify-domain-dkim"}}',
                Update: '{"service":"SES","action":"verifyDomainDkim","parameters":{"Domain":"test.dev.example.edu"},"physicalResourceId":{"id":"test.dev.example.edu-verify-domain-dkim"}}',
                InstallLatestAwsSdk: true
            },
            DependsOn: [
                'pccsdlcmyappsesverifytestVerifyDomainDkimCustomResourcePolicyD5E756D9',
                'pccsdlcmyappsesverifytestVerifyDomainIdentityCustomResourcePolicy4BE20186',
                'pccsdlcmyappsesverifytestVerifyDomainIdentityE052339E'
            ],
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlcmyappsesverifytestVerifyDomainDkimCustomResourcePolicyD5E756D9: {
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
                PolicyName: 'pccsdlcmyappsesverifytestVerifyDomainDkimCustomResourcePolicyD5E756D9',
                Roles: [
                    {
                        Ref: 'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2'
                    }
                ]
            },
            DependsOn: [
                'pccsdlcmyappsesverifytestVerifyDomainIdentityCustomResourcePolicy4BE20186',
                'pccsdlcmyappsesverifytestVerifyDomainIdentityE052339E'
            ]
        },
        pccsdlcmyappsesverifytestSesDkimVerificationRecord043B916AD: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                Name: {
                    'Fn::Join': [
                        '',
                        [
                            {
                                'Fn::GetAtt': [
                                    'pccsdlcmyappsesverifytestVerifyDomainDkim21798902',
                                    'DkimTokens.0'
                                ]
                            },
                            '._domainkey.test.dev.example.edu.'
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
                                        'pccsdlcmyappsesverifytestVerifyDomainDkim21798902',
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
                'pccsdlcmyappsesverifytestVerifyDomainDkimCustomResourcePolicyD5E756D9',
                'pccsdlcmyappsesverifytestVerifyDomainDkim21798902'
            ]
        },
        pccsdlcmyappsesverifytestSesDkimVerificationRecord1B5DB9210: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                Name: {
                    'Fn::Join': [
                        '',
                        [
                            {
                                'Fn::GetAtt': [
                                    'pccsdlcmyappsesverifytestVerifyDomainDkim21798902',
                                    'DkimTokens.1'
                                ]
                            },
                            '._domainkey.test.dev.example.edu.'
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
                                        'pccsdlcmyappsesverifytestVerifyDomainDkim21798902',
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
                'pccsdlcmyappsesverifytestVerifyDomainDkimCustomResourcePolicyD5E756D9',
                'pccsdlcmyappsesverifytestVerifyDomainDkim21798902'
            ]
        },
        pccsdlcmyappsesverifytestSesDkimVerificationRecord265DB581E: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                Name: {
                    'Fn::Join': [
                        '',
                        [
                            {
                                'Fn::GetAtt': [
                                    'pccsdlcmyappsesverifytestVerifyDomainDkim21798902',
                                    'DkimTokens.2'
                                ]
                            },
                            '._domainkey.test.dev.example.edu.'
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
                                        'pccsdlcmyappsesverifytestVerifyDomainDkim21798902',
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
                'pccsdlcmyappsesverifytestVerifyDomainDkimCustomResourcePolicyD5E756D9',
                'pccsdlcmyappsesverifytestVerifyDomainDkim21798902'
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
                ],
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
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
                Role: {
                    'Fn::GetAtt': [
                        'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2',
                        'Arn'
                    ]
                },
                Handler: 'index.handler',
                Runtime: MatchHelper.startsWith('nodejs'),
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
                ],
                Timeout: 120
            },
            DependsOn: [ 'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2' ]
        },
        pccsdlcmyappt1testdevexampleeduarecordA7325488: {
            Type: 'AWS::Route53::RecordSet',
            Properties: {
                Name: 't1.test.dev.example.edu.',
                Type: 'A',
                AliasTarget: {
                    DNSName: 'dualstack.my-load-balancer-1234567890.us-west-2.elb.amazonaws.com',
                    HostedZoneId: 'Z3DZXE0EXAMPLE'
                },
                Comment: 'pcc-sdlc-myapp: t1.test.dev.example.edu',
                HostedZoneId: 'DUMMY'
            }
        },
        pccsdlcmyapptestdevexampleedu4278E0AC: {
            Type: 'AWS::CertificateManager::Certificate',
            Properties: {
                DomainName: 'test.dev.example.edu',
                DomainValidationOptions: [
                    {
                        DomainName: 'test.dev.example.edu',
                        HostedZoneId: 'DUMMY'
                    }
                ],
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' },
                    {
                        Key: 'Name',
                        Value: 'pcc-shared-stack/pcc-sdlc-myapp/pcc-sdlc-myapp-test.dev.example.edu'
                    }
                ],
                ValidationMethod: 'DNS'
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlcmyappt1testdevexampleedu0F61E2BF: {
            Type: 'AWS::CertificateManager::Certificate',
            Properties: {
                DomainName: 't1.test.dev.example.edu',
                DomainValidationOptions: [
                    {
                        DomainName: 't1.test.dev.example.edu',
                        HostedZoneId: 'DUMMY'
                    }
                ],
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' },
                    {
                        Key: 'Name',
                        Value: 'pcc-shared-stack/pcc-sdlc-myapp/pcc-sdlc-myapp-t1.test.dev.example.edu'
                    }
                ],
                ValidationMethod: 'DNS'
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlcmyapplistenercertificatesF5C82E98: {
            Type: 'AWS::ElasticLoadBalancingV2::ListenerCertificate',
            Properties: {
                Certificates: [
                    {
                        CertificateArn: { Ref: 'pccsdlcmyapptestdevexampleedu4278E0AC' }
                    },
                    {
                        CertificateArn: { Ref: 'pccsdlcmyappt1testdevexampleedu0F61E2BF' }
                    }
                ],
                ListenerArn: 'arn:aws:elasticloadbalancing:us-west-2:123456789012:listener/application/my-load-balancer/50dc6c495c0c9188/f2f7dc8efc522ab2'
            }
        },
        pccsdlcmyapptg1E18EDE5: {
            Type: 'AWS::ElasticLoadBalancingV2::TargetGroup',
            Properties: {
                Name: 'pcc-sdlc-myapp-tg',
                Port: 80,
                Protocol: 'HTTP',
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
                ],
                TargetGroupAttributes: [ { Key: 'stickiness.enabled', Value: 'false' } ],
                TargetType: 'ip',
                VpcId: 'vpc-12345'
            }
        },
        pccsdlcmyapplistenerrule10003C2FE33: {
            Type: 'AWS::ElasticLoadBalancingV2::ListenerRule',
            Properties: {
                Actions: [
                    {
                        TargetGroupArn: { Ref: 'pccsdlcmyapptg1E18EDE5' },
                        Type: 'forward'
                    }
                ],
                Conditions: [
                    {
                        Field: 'host-header',
                        HostHeaderConfig: { Values: [ 'test.dev.example.edu' ] }
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
                ClusterSettings: [ { Name: 'containerInsights', Value: 'disabled' } ],
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
                ]
            }
        }
    }
};