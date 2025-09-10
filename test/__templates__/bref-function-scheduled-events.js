const {MatchHelper} = require("../../src/utils/testing/match-helper");
module.exports = {
    Resources: {
          functionwebfn0lgD95A7CF9: {
            Type: 'AWS::Logs::LogGroup',
            Properties: { RetentionInDays: 30 },
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
            }
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
            }
        },
        functionwebfn0DF20C809: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-12344-us-east-1',
                    S3Key: MatchHelper.endsWith('zip')
                },
                FunctionName: 'function-web-fn-0',
                Handler: 'public/index.php',
                Layers: [
                    {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                {Ref: 'AWS::Partition'},
                                ':lambda:us-east-1:534081306603:layer:php-81-fpm:112'
                            ]
                        ]
                    }
                ],
              LoggingConfig: { LogGroup: { Ref: 'functionwebfn0lgD95A7CF9' } },
                MemorySize: 512,
                Role: {
                    'Fn::GetAtt': ['functionwebfn0ServiceRole21C72759', 'Arn']
                },
                Runtime: 'provided.al2',
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
            DependsOn: ['functionwebfn0ServiceRole21C72759']
        },
        functionwebfn0scheduledevent0F79BB987: {
            Type: 'AWS::Events::Rule',
            Properties: {
                Name: 'function-web-fn-0-scheduled-event-0',
                ScheduleExpression: 'rate(1 minute)',
                State: 'ENABLED',
                Targets: [
                    {
                        Arn: {'Fn::GetAtt': ['functionwebfn0DF20C809', 'Arn']},
                        Id: 'Target0',
                        Input: '{"cli":"schedule:run"}'
                    }
                ]
            }
        },
        functionwebfn0scheduledevent0AllowEventRulestackfunctionwebfn0A4DC51CCA901EF07: {
            Type: 'AWS::Lambda::Permission',
            Properties: {
                Action: 'lambda:InvokeFunction',
                FunctionName: {'Fn::GetAtt': ['functionwebfn0DF20C809', 'Arn']},
                Principal: 'events.amazonaws.com',
                SourceArn: {
                    'Fn::GetAtt': ['functionwebfn0scheduledevent0F79BB987', 'Arn']
                }
            }
        }
    }
}