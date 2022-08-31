const {Match} = require("aws-cdk-lib/assertions");
module.exports = {
    Resources: {
        certfoobarcomCertificateRequestorFunctionServiceRole5597334B: {
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
        certfoobarcomCertificateRequestorFunctionServiceRoleDefaultPolicy8B8D1886: {
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
                PolicyName: 'certfoobarcomCertificateRequestorFunctionServiceRoleDefaultPolicy8B8D1886',
                Roles: [
                    {
                        Ref: 'certfoobarcomCertificateRequestorFunctionServiceRole5597334B'
                    }
                ]
            }
        },
        certfoobarcomCertificateRequestorFunction62C7DA69: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-12344-us-west-2',
                    S3Key: Match.stringLikeRegexp('.*\.zip')
                },
                Role: {
                    'Fn::GetAtt': [
                        'certfoobarcomCertificateRequestorFunctionServiceRole5597334B',
                        'Arn'
                    ]
                },
                Handler: 'index.certificateRequestHandler',
                Runtime: 'nodejs14.x',
                Timeout: 900
            },
            DependsOn: [
                'certfoobarcomCertificateRequestorFunctionServiceRoleDefaultPolicy8B8D1886',
                'certfoobarcomCertificateRequestorFunctionServiceRole5597334B'
            ]
        },
        certfoobarcomCertificateRequestorResource5B4BBAB0: {
            Type: 'AWS::CloudFormation::CustomResource',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': [
                        'certfoobarcomCertificateRequestorFunction62C7DA69',
                        'Arn'
                    ]
                },
                DomainName: 'foo.bar.com',
                HostedZoneId: 'DUMMY',
                Region: 'us-east-1'
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        }
    }
}
