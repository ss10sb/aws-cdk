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
                                { Ref: 'AWS::Partition' },
                                ':lambda:us-east-1:534081306603:layer:php-81-fpm:112'
                            ]
                        ]
                    }
                ],
              LoggingConfig: { LogGroup: { Ref: 'functionwebfn0lgD95A7CF9' } },
                MemorySize: 512,
              Role: {
                'Fn::GetAtt': [ 'functionwebfn0ServiceRole21C72759', 'Arn' ]
              },
                Runtime: 'provided.al2',
                Timeout: 28,
                VpcConfig: {
                    SecurityGroupIds: [
                        {
                            'Fn::GetAtt': [ 'functionwebfn0SecurityGroupCFD2651F', 'GroupId' ]
                        }
                    ],
                    SubnetIds: [ 'p-12345', 'p-67890' ]
                }
            },
            DependsOn: [ 'functionwebfn0ServiceRole21C72759' ]
        },
        functionalias6A186DE0: {
            Type: 'AWS::Lambda::Alias',
            Properties: {
                FunctionName: { Ref: 'functionwebfn0DF20C809' },
                FunctionVersion: '$LATEST',
                Name: 'current'
            }
        },
        functionscalabletargetRole9FFA4E8C: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: { Service: 'application-autoscaling.amazonaws.com' }
                        }
                    ],
                    Version: '2012-10-17'
                }
            }
        },
        functionscalabletarget047671AB: {
            Type: 'AWS::ApplicationAutoScaling::ScalableTarget',
            Properties: {
                MaxCapacity: 5,
                MinCapacity: 0,
                ResourceId: {
                    'Fn::Join': [
                        '',
                        [
                            'function:',
                            { Ref: 'functionwebfn0DF20C809' },
                            ':current'
                        ]
                    ]
                },
                RoleARN: {
                    'Fn::GetAtt': [ 'functionscalabletargetRole9FFA4E8C', 'Arn' ]
                },
                ScalableDimension: 'lambda:function:ProvisionedConcurrency',
                ServiceNamespace: 'lambda'
            }
        },
        functionscalabletargetpcuautoscale06758DB1: {
            Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
            Properties: {
                PolicyName: 'stackfunctionscalabletargetpcuautoscale69752A33',
                PolicyType: 'TargetTrackingScaling',
                ScalingTargetId: { Ref: 'functionscalabletarget047671AB' },
                TargetTrackingScalingPolicyConfiguration: {
                    PredefinedMetricSpecification: {
                        PredefinedMetricType: 'LambdaProvisionedConcurrencyUtilization'
                    },
                    TargetValue: 0.9
                }
            }
        }
    }
}