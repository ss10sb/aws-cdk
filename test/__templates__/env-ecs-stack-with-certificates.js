module.exports = {
    Resources: {
        pccsdlcmyapptestdevexampleedudefaultCertificateRequestorFunctionServiceRole3E8C6A4E: {
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
        pccsdlcmyapptestdevexampleedudefaultCertificateRequestorFunctionServiceRoleDefaultPolicy4024ACE2: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: [
                                'acm:RequestCertificate',
                                'acm:DescribeCertificate',
                                'acm:DeleteCertificate',
                                'acm:AddTagsToCertificate'
                            ],
                            Effect: 'Allow',
                            Resource: '*'
                        },
                        {
                            Action: 'route53:GetChange',
                            Effect: 'Allow',
                            Resource: '*'
                        },
                        {
                            Action: 'route53:changeResourceRecordSets',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {Ref: 'AWS::Partition'},
                                        ':route53:::hostedzone/DUMMY'
                                    ]
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlcmyapptestdevexampleedudefaultCertificateRequestorFunctionServiceRoleDefaultPolicy4024ACE2',
                Roles: [
                    {
                        Ref: 'pccsdlcmyapptestdevexampleedudefaultCertificateRequestorFunctionServiceRole3E8C6A4E'
                    }
                ]
            }
        },
        pccsdlcmyapptestdevexampleedudefaultCertificateRequestorFunction6A341C72: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-2222-us-west-2',
                    S3Key: 'e85f10a8bf0e7f4f7931fce24b29d4faf6874948090a2b568b2da33a7116cf84.zip'
                },
                Role: {
                    'Fn::GetAtt': [
                        'pccsdlcmyapptestdevexampleedudefaultCertificateRequestorFunctionServiceRole3E8C6A4E',
                        'Arn'
                    ]
                },
                Handler: 'index.certificateRequestHandler',
                Runtime: 'nodejs14.x',
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                Timeout: 900
            },
            DependsOn: [
                'pccsdlcmyapptestdevexampleedudefaultCertificateRequestorFunctionServiceRoleDefaultPolicy4024ACE2',
                'pccsdlcmyapptestdevexampleedudefaultCertificateRequestorFunctionServiceRole3E8C6A4E'
            ]
        },
        pccsdlcmyapptestdevexampleedudefaultCertificateRequestorResource63E29D46: {
            Type: 'AWS::CloudFormation::CustomResource',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': [
                        'pccsdlcmyapptestdevexampleedudefaultCertificateRequestorFunction6A341C72',
                        'Arn'
                    ]
                },
                DomainName: 'test.dev.example.edu',
                HostedZoneId: 'DUMMY',
                CleanupRecords: 'true',
                Tags: {App: 'myapp', College: 'PCC', Environment: 'sdlc'}
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlcmyappt1testdevexampleedudefaultCertificateRequestorFunctionServiceRole55BB21CA: {
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
        pccsdlcmyappt1testdevexampleedudefaultCertificateRequestorFunctionServiceRoleDefaultPolicyF5D87959: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: [
                                'acm:RequestCertificate',
                                'acm:DescribeCertificate',
                                'acm:DeleteCertificate',
                                'acm:AddTagsToCertificate'
                            ],
                            Effect: 'Allow',
                            Resource: '*'
                        },
                        {
                            Action: 'route53:GetChange',
                            Effect: 'Allow',
                            Resource: '*'
                        },
                        {
                            Action: 'route53:changeResourceRecordSets',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {Ref: 'AWS::Partition'},
                                        ':route53:::hostedzone/DUMMY'
                                    ]
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlcmyappt1testdevexampleedudefaultCertificateRequestorFunctionServiceRoleDefaultPolicyF5D87959',
                Roles: [
                    {
                        Ref: 'pccsdlcmyappt1testdevexampleedudefaultCertificateRequestorFunctionServiceRole55BB21CA'
                    }
                ]
            }
        },
        pccsdlcmyappt1testdevexampleedudefaultCertificateRequestorFunction00944829: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-2222-us-west-2',
                    S3Key: 'e85f10a8bf0e7f4f7931fce24b29d4faf6874948090a2b568b2da33a7116cf84.zip'
                },
                Role: {
                    'Fn::GetAtt': [
                        'pccsdlcmyappt1testdevexampleedudefaultCertificateRequestorFunctionServiceRole55BB21CA',
                        'Arn'
                    ]
                },
                Handler: 'index.certificateRequestHandler',
                Runtime: 'nodejs14.x',
                Tags: [
                    {Key: 'App', Value: 'myapp'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'sdlc'}
                ],
                Timeout: 900
            },
            DependsOn: [
                'pccsdlcmyappt1testdevexampleedudefaultCertificateRequestorFunctionServiceRoleDefaultPolicyF5D87959',
                'pccsdlcmyappt1testdevexampleedudefaultCertificateRequestorFunctionServiceRole55BB21CA'
            ]
        },
        pccsdlcmyappt1testdevexampleedudefaultCertificateRequestorResource026CE6A2: {
            Type: 'AWS::CloudFormation::CustomResource',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': [
                        'pccsdlcmyappt1testdevexampleedudefaultCertificateRequestorFunction00944829',
                        'Arn'
                    ]
                },
                DomainName: 't1.test.dev.example.edu',
                HostedZoneId: 'DUMMY',
                CleanupRecords: 'true',
                Tags: {App: 'myapp', College: 'PCC', Environment: 'sdlc'}
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlcmyapplistenercertificatesF5C82E98: {
            Type: 'AWS::ElasticLoadBalancingV2::ListenerCertificate',
            Properties: {
                Certificates: [
                    {
                        CertificateArn: {
                            'Fn::GetAtt': [
                                'pccsdlcmyapptestdevexampleedudefaultCertificateRequestorResource63E29D46',
                                'Arn'
                            ]
                        }
                    },
                    {
                        CertificateArn: {
                            'Fn::GetAtt': [
                                'pccsdlcmyappt1testdevexampleedudefaultCertificateRequestorResource026CE6A2',
                                'Arn'
                            ]
                        }
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
        }
    }
};