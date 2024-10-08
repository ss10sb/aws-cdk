const {MatchHelper} = require("../../src/utils/testing/match-helper");
module.exports = {
    Resources: {
        cluster611F8AFF: {Type: 'AWS::ECS::Cluster'},
        taskdefTaskRoleE9325785: {
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
                }
            }
        },
        taskdef9C0AB9A2: {
            Type: 'AWS::ECS::TaskDefinition',
            Properties: {
                Cpu: '256',
                ExecutionRoleArn: {'Fn::GetAtt': ['taskdefExecutionRole2D63790E', 'Arn']},
                Family: 'stacktaskdefF83D530D',
                Memory: '512',
                NetworkMode: 'awsvpc',
                RequiresCompatibilities: ['FARGATE'],
                TaskRoleArn: {'Fn::GetAtt': ['taskdefTaskRoleE9325785', 'Arn']}
            }
        },
        taskdefExecutionRole2D63790E: {
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
                }
            }
        },
        runtaskSecurityGroup04CE6B59: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                GroupDescription: 'stack/run-task/SecurityGroup',
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
        runtaskupdatefnF0630FBF: {
            Type: 'Custom::AWS',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': ['AWS679f53fac002430cb0da5b7982bd22872D164C4C', 'Arn']
                },
                Create: {
                    'Fn::Join': [
                        '',
                        [
                            '{"service":"ECS","action":"runTask","physicalResourceId":{"id":"',
                            {Ref: 'taskdef9C0AB9A2'},
                            '"},"parameters":{"cluster":"',
                            {Ref: 'cluster611F8AFF'},
                            '","taskDefinition":"',
                            {Ref: 'taskdef9C0AB9A2'},
                            '","capacityProviderStrategy":[],"launchType":"FARGATE","networkConfiguration":{"awsvpcConfiguration":{"assignPublicIp":"DISABLED","subnets":["p-12345","p-67890"],"securityGroups":["',
                            {
                                'Fn::GetAtt': ['runtaskSecurityGroup04CE6B59', 'GroupId']
                            },
                            '"]}}}}'
                        ]
                    ]
                },
                Update: {
                    'Fn::Join': [
                        '',
                        [
                            '{"service":"ECS","action":"runTask","physicalResourceId":{"id":"',
                            {Ref: 'taskdef9C0AB9A2'},
                            '"},"parameters":{"cluster":"',
                            {Ref: 'cluster611F8AFF'},
                            '","taskDefinition":"',
                            {Ref: 'taskdef9C0AB9A2'},
                            '","capacityProviderStrategy":[],"launchType":"FARGATE","networkConfiguration":{"awsvpcConfiguration":{"assignPublicIp":"DISABLED","subnets":["p-12345","p-67890"],"securityGroups":["',
                            {
                                'Fn::GetAtt': ['runtaskSecurityGroup04CE6B59', 'GroupId']
                            },
                            '"]}}}}'
                        ]
                    ]
                },
                InstallLatestAwsSdk: true
            },
            DependsOn: ['runtaskupdatefnCustomResourcePolicy84727C89'],
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        runtaskupdatefnCustomResourcePolicy84727C89: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 'ecs:RunTask',
                            Effect: 'Allow',
                            Resource: {Ref: 'taskdef9C0AB9A2'}
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'runtaskupdatefnCustomResourcePolicy84727C89',
                Roles: [
                    {
                        Ref: 'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2'
                    }
                ]
            }
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
        AWS679f53fac002430cb0da5b7982bd2287ServiceRoleDefaultPolicyD28E1A5E: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 'iam:PassRole',
                            Effect: 'Allow',
                            Resource: {'Fn::GetAtt': ['taskdefTaskRoleE9325785', 'Arn']}
                        },
                        {
                            Action: 'iam:PassRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': ['taskdefExecutionRole2D63790E', 'Arn']
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleDefaultPolicyD28E1A5E',
                Roles: [
                    {
                        Ref: 'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2'
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
                FunctionName: 'update-fn',
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
            DependsOn: [
                'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleDefaultPolicyD28E1A5E',
                'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2'
            ]
        },
        AWS679f53fac002430cb0da5b7982bd2287LogRetentionCE72797A: {
            Type: 'Custom::LogRetention',
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': [
                        'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aFD4BFC8A',
                        'Arn'
                    ]
                },
                LogGroupName: {
                    'Fn::Join': [
                        '',
                        [
                            '/aws/lambda/',
                            {Ref: 'AWS679f53fac002430cb0da5b7982bd22872D164C4C'}
                        ]
                    ]
                },
                RetentionInDays: 7
            }
        },
        LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB: {
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
        LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRoleDefaultPolicyADDA7DEB: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: [
                                'logs:PutRetentionPolicy',
                                'logs:DeleteRetentionPolicy'
                            ],
                            Effect: 'Allow',
                            Resource: '*'
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRoleDefaultPolicyADDA7DEB',
                Roles: [
                    {
                        Ref: 'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB'
                    }
                ]
            }
        },
        LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aFD4BFC8A: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Handler: 'index.handler',
                Runtime: MatchHelper.startsWith('nodejs'),
                Timeout: 900,
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-12344-us-east-1',
                    S3Key: MatchHelper.endsWith('zip')
                },
                Role: {
                    'Fn::GetAtt': [
                        'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB',
                        'Arn'
                    ]
                }
            },
            DependsOn: [
                'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRoleDefaultPolicyADDA7DEB',
                'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB'
            ]
        }
    }
}