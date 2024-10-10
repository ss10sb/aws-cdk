const {MatchHelper} = require("../../src/utils/testing/match-helper");
module.exports = {
    Resources: {
          functioneventfn0lgD47CFCEB: {
            Type: 'AWS::Logs::LogGroup',
            Properties: { RetentionInDays: 30 },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
          },
        functioneventfn0ServiceRole30E080B7: {
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
            }
        },
        functioneventfn0SecurityGroup03393729: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                GroupDescription: 'Automatic security group for Lambda Function stackfunctioneventfn0A614FAB1',
                SecurityGroupEgress: [
                    {
                        CidrIp: '0.0.0.0/0',
                        Description: 'Allow all outbound traffic by default',
                        IpProtocol: '-1'
                    }
                ],
                VpcId: 'vpc-12345'
            }
        },
        functioneventfn01CDA78AF: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-12344-us-east-1',
                    S3Key: MatchHelper.endsWith('zip')
                },
                FunctionName: 'function-event-fn-0',
                Handler: 'artisan',
                Layers: [
                    {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                {Ref: 'AWS::Partition'},
                                ':lambda:us-east-1:534081306603:layer:php-81-fpm:59'
                            ]
                        ]
                    }
                ],
                LoggingConfig: {LogGroup: {Ref: 'functioneventfn0lgD47CFCEB'}},
                MemorySize: 512,
                Role: {
                    'Fn::GetAtt': ['functioneventfn0ServiceRole30E080B7', 'Arn']
                },
                Runtime: 'provided.al2023',
                Timeout: 120,
                VpcConfig: {
                    SecurityGroupIds: [
                        {
                            'Fn::GetAtt': ['functioneventfn0SecurityGroup03393729', 'GroupId']
                        }
                    ],
                    SubnetIds: ['p-12345', 'p-67890']
                }
            },
            DependsOn: ['functioneventfn0ServiceRole30E080B7']
        }
    }
}