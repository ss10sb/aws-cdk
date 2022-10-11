module.exports = {
    Resources: {
        cluster611F8AFF: { Type: 'AWS::ECS::Cluster' },
        nginxecrC430EE7B: {
            Type: 'AWS::ECR::Repository',
            Properties: {
                ImageScanningConfiguration: { ScanOnPush: true },
                LifecyclePolicy: {
                    LifecyclePolicyText: '{"rules":[{"rulePriority":1,"selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":3},"action":{"type":"expire"}}]}'
                },
                RepositoryName: 'my-repos/nginx'
            },
            UpdateReplacePolicy: 'Retain',
            DeletionPolicy: 'Retain'
        },
        phpfpmecr3C5F411B: {
            Type: 'AWS::ECR::Repository',
            Properties: {
                ImageScanningConfiguration: { ScanOnPush: true },
                LifecyclePolicy: {
                    LifecyclePolicyText: '{"rules":[{"rulePriority":1,"selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":3},"action":{"type":"expire"}}]}'
                },
                RepositoryName: 'my-repos/phpfpm'
            },
            UpdateReplacePolicy: 'Retain',
            DeletionPolicy: 'Retain'
        },
        queueservicequeue0loggroup74C0F893: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                LogGroupName: 'queue-service-queue-0-log-group',
                RetentionInDays: 30
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        queueservicequeue0EcsProcessingDeadLetterQueue385656B4: {
            Type: 'AWS::SQS::Queue',
            Properties: { MessageRetentionPeriod: 1209600 },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        queueservicequeue0EcsProcessingQueue10C25DB4: {
            Type: 'AWS::SQS::Queue',
            Properties: {
                RedrivePolicy: {
                    deadLetterTargetArn: {
                        'Fn::GetAtt': [
                            'queueservicequeue0EcsProcessingDeadLetterQueue385656B4',
                            'Arn'
                        ]
                    },
                    maxReceiveCount: 3
                }
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        queueservicequeue0QueueProcessingTaskDefTaskRole0FEAB074: {
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
                }
            }
        },
        queueservicequeue0QueueProcessingTaskDefTaskRoleDefaultPolicyEBD3009C: {
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
                                'Fn::GetAtt': [
                                    'queueservicequeue0EcsProcessingQueue10C25DB4',
                                    'Arn'
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'queueservicequeue0QueueProcessingTaskDefTaskRoleDefaultPolicyEBD3009C',
                Roles: [
                    {
                        Ref: 'queueservicequeue0QueueProcessingTaskDefTaskRole0FEAB074'
                    }
                ]
            }
        },
        queueservicequeue0QueueProcessingTaskDefC899143B: {
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
                                    'Fn::GetAtt': [
                                        'queueservicequeue0EcsProcessingQueue10C25DB4',
                                        'QueueName'
                                    ]
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
                                                        'Fn::GetAtt': [ 'phpfpmecr3C5F411B', 'Arn' ]
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
                                                        'Fn::GetAtt': [ 'phpfpmecr3C5F411B', 'Arn' ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    '.',
                                    { Ref: 'AWS::URLSuffix' },
                                    '/',
                                    { Ref: 'phpfpmecr3C5F411B' },
                                    ':1'
                                ]
                            ]
                        },
                        LogConfiguration: {
                            LogDriver: 'awslogs',
                            Options: {
                                'awslogs-group': { Ref: 'queueservicequeue0loggroup74C0F893' },
                                'awslogs-stream-prefix': 'phpfpm',
                                'awslogs-region': 'us-east-1'
                            }
                        },
                        Name: 'QueueProcessingContainer',
                        Secrets: []
                    }
                ],
                Cpu: '256',
                ExecutionRoleArn: {
                    'Fn::GetAtt': [
                        'queueservicequeue0QueueProcessingTaskDefExecutionRole141E0C4C',
                        'Arn'
                    ]
                },
                Family: 'queue-service-queue-0',
                Memory: '512',
                NetworkMode: 'awsvpc',
                RequiresCompatibilities: [ 'FARGATE' ],
                TaskRoleArn: {
                    'Fn::GetAtt': [
                        'queueservicequeue0QueueProcessingTaskDefTaskRole0FEAB074',
                        'Arn'
                    ]
                }
            }
        },
        queueservicequeue0QueueProcessingTaskDefExecutionRole141E0C4C: {
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
                }
            }
        },
        queueservicequeue0QueueProcessingTaskDefExecutionRoleDefaultPolicy993E2439: {
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
                            Resource: { 'Fn::GetAtt': [ 'phpfpmecr3C5F411B', 'Arn' ] }
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
                                'Fn::GetAtt': [ 'queueservicequeue0loggroup74C0F893', 'Arn' ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'queueservicequeue0QueueProcessingTaskDefExecutionRoleDefaultPolicy993E2439',
                Roles: [
                    {
                        Ref: 'queueservicequeue0QueueProcessingTaskDefExecutionRole141E0C4C'
                    }
                ]
            }
        },
        queueservicequeue0QueueProcessingFargateServiceF7C96E8E: {
            Type: 'AWS::ECS::Service',
            Properties: {
                Cluster: { Ref: 'cluster611F8AFF' },
                DeploymentConfiguration: { MaximumPercent: 200, MinimumHealthyPercent: 50 },
                EnableECSManagedTags: false,
                LaunchType: 'FARGATE',
                NetworkConfiguration: {
                    AwsvpcConfiguration: {
                        AssignPublicIp: 'DISABLED',
                        SecurityGroups: [
                            {
                                'Fn::GetAtt': [
                                    'queueservicequeue0QueueProcessingFargateServiceSecurityGroupDB543355',
                                    'GroupId'
                                ]
                            }
                        ],
                        Subnets: [ 'p-12345', 'p-67890' ]
                    }
                },
                PlatformVersion: 'LATEST',
                ServiceName: 'queue-service-queue-0',
                TaskDefinition: { Ref: 'queueservicequeue0QueueProcessingTaskDefC899143B' }
            }
        },
        queueservicequeue0QueueProcessingFargateServiceSecurityGroupDB543355: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                GroupDescription: 'stack/queue-service-queue-0/QueueProcessingFargateService/SecurityGroup',
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
        queueservicequeue0QueueProcessingFargateServiceTaskCountTargetF8DFE126: {
            Type: 'AWS::ApplicationAutoScaling::ScalableTarget',
            Properties: {
                MaxCapacity: 2,
                MinCapacity: 0,
                ResourceId: {
                    'Fn::Join': [
                        '',
                        [
                            'service/',
                            { Ref: 'cluster611F8AFF' },
                            '/',
                            {
                                'Fn::GetAtt': [
                                    'queueservicequeue0QueueProcessingFargateServiceF7C96E8E',
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
                            ':iam::12344:role/aws-service-role/ecs.application-autoscaling.amazonaws.com/AWSServiceRoleForApplicationAutoScaling_ECSService'
                        ]
                    ]
                },
                ScalableDimension: 'ecs:service:DesiredCount',
                ServiceNamespace: 'ecs'
            }
        },
        queueservicequeue0QueueProcessingFargateServiceTaskCountTargetCpuScalingF642D40A: {
            Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
            Properties: {
                PolicyName: 'stackqueueservicequeue0QueueProcessingFargateServiceTaskCountTargetCpuScalingEDF630B1',
                PolicyType: 'TargetTrackingScaling',
                ScalingTargetId: {
                    Ref: 'queueservicequeue0QueueProcessingFargateServiceTaskCountTargetF8DFE126'
                },
                TargetTrackingScalingPolicyConfiguration: {
                    PredefinedMetricSpecification: { PredefinedMetricType: 'ECSServiceAverageCPUUtilization' },
                    TargetValue: 50
                }
            }
        },
        queueservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingLowerPolicyB3CCEC62: {
            Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
            Properties: {
                PolicyName: 'stackqueueservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingLowerPolicy30AE5837',
                PolicyType: 'StepScaling',
                ScalingTargetId: {
                    Ref: 'queueservicequeue0QueueProcessingFargateServiceTaskCountTargetF8DFE126'
                },
                StepScalingPolicyConfiguration: {
                    AdjustmentType: 'ChangeInCapacity',
                    MetricAggregationType: 'Maximum',
                    StepAdjustments: [ { MetricIntervalUpperBound: 0, ScalingAdjustment: -1 } ]
                }
            }
        },
        queueservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingLowerAlarm10347FB1: {
            Type: 'AWS::CloudWatch::Alarm',
            Properties: {
                ComparisonOperator: 'LessThanOrEqualToThreshold',
                EvaluationPeriods: 1,
                AlarmActions: [
                    {
                        Ref: 'queueservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingLowerPolicyB3CCEC62'
                    }
                ],
                AlarmDescription: 'Lower threshold scaling alarm',
                Dimensions: [
                    {
                        Name: 'QueueName',
                        Value: {
                            'Fn::GetAtt': [
                                'queueservicequeue0EcsProcessingQueue10C25DB4',
                                'QueueName'
                            ]
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
        queueservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingUpperPolicy27772B8E: {
            Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
            Properties: {
                PolicyName: 'stackqueueservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingUpperPolicy99E8B6EB',
                PolicyType: 'StepScaling',
                ScalingTargetId: {
                    Ref: 'queueservicequeue0QueueProcessingFargateServiceTaskCountTargetF8DFE126'
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
        queueservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingUpperAlarmD0E7883D: {
            Type: 'AWS::CloudWatch::Alarm',
            Properties: {
                ComparisonOperator: 'GreaterThanOrEqualToThreshold',
                EvaluationPeriods: 1,
                AlarmActions: [
                    {
                        Ref: 'queueservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingUpperPolicy27772B8E'
                    }
                ],
                AlarmDescription: 'Upper threshold scaling alarm',
                Dimensions: [
                    {
                        Name: 'QueueName',
                        Value: {
                            'Fn::GetAtt': [
                                'queueservicequeue0EcsProcessingQueue10C25DB4',
                                'QueueName'
                            ]
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
        queueservicequeue0SQSDeadLetterQueue4856410F: {
            Value: {
                'Fn::GetAtt': [
                    'queueservicequeue0EcsProcessingDeadLetterQueue385656B4',
                    'QueueName'
                ]
            }
        },
        queueservicequeue0SQSDeadLetterQueueArnBCE33219: {
            Value: {
                'Fn::GetAtt': [
                    'queueservicequeue0EcsProcessingDeadLetterQueue385656B4',
                    'Arn'
                ]
            }
        },
        queueservicequeue0SQSQueue1C838927: {
            Value: {
                'Fn::GetAtt': [
                    'queueservicequeue0EcsProcessingQueue10C25DB4',
                    'QueueName'
                ]
            }
        },
        queueservicequeue0SQSQueueArnEAE2B1A8: {
            Value: {
                'Fn::GetAtt': [ 'queueservicequeue0EcsProcessingQueue10C25DB4', 'Arn' ]
            }
        }
    }
};