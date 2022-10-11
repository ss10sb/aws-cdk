module.exports = {
    Resources: {
        certfoobarcomuseast1CertificateRequestorFunctionServiceRole60453E82: {
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
        certfoobarcomuseast1CertificateRequestorFunctionServiceRoleDefaultPolicy99C07B55: {
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
                PolicyName: 'certfoobarcomuseast1CertificateRequestorFunctionServiceRoleDefaultPolicy99C07B55',
                Roles: [
                    {
                        Ref: 'certfoobarcomuseast1CertificateRequestorFunctionServiceRole60453E82'
                    }
                ]
            }
        },
        certfoobarcomuseast1CertificateRequestorFunction2C565E6C: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-12344-us-west-2',
                    S3Key: 'e85f10a8bf0e7f4f7931fce24b29d4faf6874948090a2b568b2da33a7116cf84.zip'
                },
                Role: {
                    'Fn::GetAtt': [
                        'certfoobarcomuseast1CertificateRequestorFunctionServiceRole60453E82',
                        'Arn'
                    ]
                },
                Handler: 'index.certificateRequestHandler',
                Runtime: 'nodejs14.x',
                Timeout: 900
            },
            DependsOn: [
                'certfoobarcomuseast1CertificateRequestorFunctionServiceRoleDefaultPolicy99C07B55',
                'certfoobarcomuseast1CertificateRequestorFunctionServiceRole60453E82'
            ]
        },
        certfoobarcomuseast1CertificateRequestorResourceC3ACAF62: {
            Type: 'AWS::CloudFormation::CustomResource',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': [
                        'certfoobarcomuseast1CertificateRequestorFunction2C565E6C',
                        'Arn'
                    ]
                },
                DomainName: 'foo.bar.com',
                HostedZoneId: 'DUMMY',
                Region: 'us-east-1',
                CleanupRecords: 'true'
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        }
    }
}
