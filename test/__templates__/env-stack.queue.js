module.exports = {
    Resources: {
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
        pccsdlcmyappdlqAB5BBAC4: {
            Type: 'AWS::SQS::Queue',
            Properties: {
                KmsMasterKeyId: 'alias/aws/sqs',
                MessageRetentionPeriod: 259200,
                QueueName: 'pcc-sdlc-myapp-dlq',
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlcmyappqueue069E607A: {
            Type: 'AWS::SQS::Queue',
            Properties: {
                KmsMasterKeyId: 'alias/aws/sqs',
                QueueName: 'pcc-sdlc-myapp-queue',
                RedrivePolicy: {
                    deadLetterTargetArn: { 'Fn::GetAtt': [ 'pccsdlcmyappdlqAB5BBAC4', 'Arn' ] },
                    maxReceiveCount: 3
                },
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
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
        },
        pccsdlcmyappservicequeue0loggroup9DDCB13E: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                LogGroupName: 'pcc-sdlc-myapp-service-queue-0-log-group',
                RetentionInDays: 30,
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleECEB1AA4: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: { Service: 'ecs-tasks.amazonaws.com' }
                        }
                    ],
                    Version: '2012-10-17'
                },
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
                ]
            }
        },
        pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleDefaultPolicyDBA3B087: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: [
                                'sqs:ReceiveMessage',
                                'sqs:ChangeMessageVisibility',
                                'sqs:GetQueueUrl',
                                'sqs:DeleteMessage',
                                'sqs:GetQueueAttributes'
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [ 'pccsdlcmyappqueue069E607A', 'Arn' ]
                            }
                        },
                        {
                            Action: [
                                'sqs:PurgeQueue',
                                'sqs:GetQueueAttributes',
                                'sqs:GetQueueUrl'
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [ 'pccsdlcmyappqueue069E607A', 'Arn' ]
                            }
                        },
                        {
                            Action: [ 'ses:SendEmail', 'ses:SendRawEmail' ],
                            Effect: 'Allow',
                            Resource: '*'
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleDefaultPolicyDBA3B087',
                Roles: [
                    {
                        Ref: 'pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleECEB1AA4'
                    }
                ]
            }
        },
        pccsdlcmyappservicequeue0QueueProcessingTaskDef277B33FF: {
            Type: 'AWS::ECS::TaskDefinition',
            Properties: {
                ContainerDefinitions: [
                    {
                        Command: [
                            '/usr/local/bin/php',
                            'artisan',
                            'queue:work',
                            '--tries=3',
                            '--delay=3',
                            '--sleep=3'
                        ],
                        Environment: [
                            {
                                Name: 'QUEUE_NAME',
                                Value: {
                                    'Fn::GetAtt': [ 'pccsdlcmyappqueue069E607A', 'QueueName' ]
                                }
                            }
                        ],
                        Essential: true,
                        Image: {
                            'Fn::Join': [
                                '',
                                [
                                    {
                                        'Fn::Select': [
                                            4,
                                            {
                                                'Fn::Split': [
                                                    ':',
                                                    {
                                                        'Fn::Join': [
                                                            '',
                                                            [
                                                                'arn:',
                                                                { Ref: 'AWS::Partition' },
                                                                ':ecr:us-east-1:12344:repository/pcc-myapp/phpfpm'
                                                            ]
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    '.dkr.ecr.',
                                    {
                                        'Fn::Select': [
                                            3,
                                            {
                                                'Fn::Split': [
                                                    ':',
                                                    {
                                                        'Fn::Join': [
                                                            '',
                                                            [
                                                                'arn:',
                                                                { Ref: 'AWS::Partition' },
                                                                ':ecr:us-east-1:12344:repository/pcc-myapp/phpfpm'
                                                            ]
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    '.',
                                    { Ref: 'AWS::URLSuffix' },
                                    '/pcc-myapp/phpfpm:1'
                                ]
                            ]
                        },
                        LogConfiguration: {
                            LogDriver: 'awslogs',
                            Options: {
                                'awslogs-group': { Ref: 'pccsdlcmyappservicequeue0loggroup9DDCB13E' },
                                'awslogs-stream-prefix': 'phpfpm',
                                'awslogs-region': 'us-west-2'
                            }
                        },
                        Name: 'QueueProcessingContainer'
                    }
                ],
                Cpu: '256',
                ExecutionRoleArn: {
                    'Fn::GetAtt': [
                        'pccsdlcmyappservicequeue0QueueProcessingTaskDefExecutionRoleC60C75CA',
                        'Arn'
                    ]
                },
                Family: 'pcc-sdlc-myapp-service-queue-0',
                Memory: '512',
                NetworkMode: 'awsvpc',
                RequiresCompatibilities: [ 'FARGATE' ],
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
                ],
                TaskRoleArn: {
                    'Fn::GetAtt': [
                        'pccsdlcmyappservicequeue0QueueProcessingTaskDefTaskRoleECEB1AA4',
                        'Arn'
                    ]
                }
            }
        },
        pccsdlcmyappservicequeue0QueueProcessingTaskDefExecutionRoleC60C75CA: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: { Service: 'ecs-tasks.amazonaws.com' }
                        }
                    ],
                    Version: '2012-10-17'
                },
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                {
                  Key: 'aws-cdk:id',
                  Value: 'pccsharedstackpccsdlcmyapp6F659917_c8d405c8da7563e75c62ee4e93b91a3deb6ceb6bc1'
                },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
                ]
            }
        },
        pccsdlcmyappservicequeue0QueueProcessingTaskDefExecutionRoleDefaultPolicy7AFB8ADD: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: [
                                'ecr:BatchCheckLayerAvailability',
                                'ecr:GetDownloadUrlForLayer',
                                'ecr:BatchGetImage'
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        { Ref: 'AWS::Partition' },
                                        ':ecr:us-east-1:12344:repository/pcc-myapp/phpfpm'
                                    ]
                                ]
                            }
                        },
                        {
                            Action: 'ecr:GetAuthorizationToken',
                            Effect: 'Allow',
                            Resource: '*'
                        },
                        {
                            Action: [ 'logs:CreateLogStream', 'logs:PutLogEvents' ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'pccsdlcmyappservicequeue0loggroup9DDCB13E',
                                    'Arn'
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'pccsdlcmyappservicequeue0QueueProcessingTaskDefExecutionRoleDefaultPolicy7AFB8ADD',
                Roles: [
                    {
                        Ref: 'pccsdlcmyappservicequeue0QueueProcessingTaskDefExecutionRoleC60C75CA'
                    }
                ]
            }
        },
        pccsdlcmyappservicequeue0QueueProcessingFargateServiceF0BE3522: {
            Type: 'AWS::ECS::Service',
            Properties: {
                Cluster: { Ref: 'pccsdlcmyappcluster4E9F2DE3' },
                DeploymentConfiguration: { MaximumPercent: 200, MinimumHealthyPercent: 50 },
                EnableECSManagedTags: false,
                LaunchType: 'FARGATE',
                NetworkConfiguration: {
                    AwsvpcConfiguration: {
                        AssignPublicIp: 'DISABLED',
                        SecurityGroups: [
                            {
                                'Fn::GetAtt': [
                                    'pccsdlcmyappservicequeue0QueueProcessingFargateServiceSecurityGroup5B7C2C6C',
                                    'GroupId'
                                ]
                            }
                        ],
                        Subnets: [ 'p-12345', 'p-67890' ]
                    }
                },
                PlatformVersion: 'LATEST',
                ServiceName: 'pcc-sdlc-myapp-service-queue-0',
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
                ],
                TaskDefinition: {
                    Ref: 'pccsdlcmyappservicequeue0QueueProcessingTaskDef277B33FF'
                }
            }
        },
        pccsdlcmyappservicequeue0QueueProcessingFargateServiceSecurityGroup5B7C2C6C: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                GroupDescription: 'pcc-shared-stack/pcc-sdlc-myapp/pcc-sdlc-myapp-service-queue-0/QueueProcessingFargateService/SecurityGroup',
                SecurityGroupEgress: [
                    {
                        CidrIp: '0.0.0.0/0',
                        Description: 'Allow all outbound traffic by default',
                        IpProtocol: '-1'
                    }
                ],
                Tags: [
                    { Key: 'App', Value: 'myapp' },
                    { Key: 'College', Value: 'PCC' },
                    { Key: 'Environment', Value: 'sdlc' }
                ],
                VpcId: 'vpc-12345'
            }
        },
        pccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetCE82EEC2: {
            Type: 'AWS::ApplicationAutoScaling::ScalableTarget',
            Properties: {
                MaxCapacity: 2,
                MinCapacity: 0,
                ResourceId: {
                    'Fn::Join': [
                        '',
                        [
                            'service/',
                            { Ref: 'pccsdlcmyappcluster4E9F2DE3' },
                            '/',
                            {
                                'Fn::GetAtt': [
                                    'pccsdlcmyappservicequeue0QueueProcessingFargateServiceF0BE3522',
                                    'Name'
                                ]
                            }
                        ]
                    ]
                },
                RoleARN: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            { Ref: 'AWS::Partition' },
                            ':iam::2222:role/aws-service-role/ecs.application-autoscaling.amazonaws.com/AWSServiceRoleForApplicationAutoScaling_ECSService'
                        ]
                    ]
                },
                ScalableDimension: 'ecs:service:DesiredCount',
                ServiceNamespace: 'ecs'
            }
        },
        pccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetCpuScaling1EF49E37: {
            Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
            Properties: {
                PolicyName: 'pccsharedstackpccsdlcmyapppccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetCpuScaling56699606',
                PolicyType: 'TargetTrackingScaling',
                ScalingTargetId: {
                    Ref: 'pccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetCE82EEC2'
                },
                TargetTrackingScalingPolicyConfiguration: {
                    PredefinedMetricSpecification: { PredefinedMetricType: 'ECSServiceAverageCPUUtilization' },
                    TargetValue: 50
                }
            }
        },
        pccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingLowerPolicy0EA8CD56: {
            Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
            Properties: {
                PolicyName: 'pccsharedstackpccsdlcmyapppccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingLowerPolicy9E1B0C0F',
                PolicyType: 'StepScaling',
                ScalingTargetId: {
                    Ref: 'pccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetCE82EEC2'
                },
                StepScalingPolicyConfiguration: {
                    AdjustmentType: 'ChangeInCapacity',
                    MetricAggregationType: 'Maximum',
                    StepAdjustments: [ { MetricIntervalUpperBound: 0, ScalingAdjustment: -1 } ]
                }
            }
        },
        pccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingLowerAlarmBF362659: {
            Type: 'AWS::CloudWatch::Alarm',
            Properties: {
                ComparisonOperator: 'LessThanOrEqualToThreshold',
                EvaluationPeriods: 1,
                AlarmActions: [
                    {
                        Ref: 'pccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingLowerPolicy0EA8CD56'
                    }
                ],
                AlarmDescription: 'Lower threshold scaling alarm',
                Dimensions: [
                    {
                        Name: 'QueueName',
                        Value: {
                            'Fn::GetAtt': [ 'pccsdlcmyappqueue069E607A', 'QueueName' ]
                        }
                    }
                ],
                MetricName: 'ApproximateNumberOfMessagesVisible',
                Namespace: 'AWS/SQS',
                Period: 300,
                Statistic: 'Maximum',
                Threshold: 0
            }
        },
        pccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingUpperPolicy49011084: {
            Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
            Properties: {
                PolicyName: 'pccsharedstackpccsdlcmyapppccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingUpperPolicy6BCBC944',
                PolicyType: 'StepScaling',
                ScalingTargetId: {
                    Ref: 'pccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetCE82EEC2'
                },
                StepScalingPolicyConfiguration: {
                    AdjustmentType: 'ChangeInCapacity',
                    MetricAggregationType: 'Maximum',
                    StepAdjustments: [
                        {
                            MetricIntervalLowerBound: 0,
                            MetricIntervalUpperBound: 9,
                            ScalingAdjustment: 1
                        },
                        { MetricIntervalLowerBound: 9, ScalingAdjustment: 2 }
                    ]
                }
            }
        },
        pccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingUpperAlarm617AF3F0: {
            Type: 'AWS::CloudWatch::Alarm',
            Properties: {
                ComparisonOperator: 'GreaterThanOrEqualToThreshold',
                EvaluationPeriods: 1,
                AlarmActions: [
                    {
                        Ref: 'pccsdlcmyappservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingUpperPolicy49011084'
                    }
                ],
                AlarmDescription: 'Upper threshold scaling alarm',
                Dimensions: [
                    {
                        Name: 'QueueName',
                        Value: {
                            'Fn::GetAtt': [ 'pccsdlcmyappqueue069E607A', 'QueueName' ]
                        }
                    }
                ],
                MetricName: 'ApproximateNumberOfMessagesVisible',
                Namespace: 'AWS/SQS',
                Period: 300,
                Statistic: 'Maximum',
                Threshold: 1
            }
        }
    },
    Outputs: {
        pccsdlcmyappservicequeue0SQSQueue8306BFF0: {
            Value: { 'Fn::GetAtt': [ 'pccsdlcmyappqueue069E607A', 'QueueName' ] }
        },
        pccsdlcmyappservicequeue0SQSQueueArn061B9BC6: {
            Value: { 'Fn::GetAtt': [ 'pccsdlcmyappqueue069E607A', 'Arn' ] }
        }
    }
};