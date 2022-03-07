import {EcrRepositories, EcrRepositoryFactory, EcrRepositoryType} from "../../src/ecr";
import {App, Stack} from "aws-cdk-lib";
import {ContainerCommandFactory, EcsQueueFactory, TaskServiceType} from "../../src/ecs";
import {Secrets} from "../../src/secret";
import {Cluster} from "aws-cdk-lib/aws-ecs";
import {Match, Template} from "aws-cdk-lib/assertions";
import {VpcHelper} from "../../src/utils";
import {resetStaticProps} from "../../src/utils/reset-static-props";
import {TemplateHelper} from "../../src/utils/testing";

const ecrRepoProps = {
    repositories: [EcrRepositoryType.NGINX, EcrRepositoryType.PHPFPM]
};

describe('ecs queue factory', () => {

    beforeEach(() => {
        resetStaticProps();
    });

    it('should create queue factory with defaults', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const cluster = new Cluster(stack, 'cluster', {
            vpc: VpcHelper.getVpcById(stack, 'vpcId')
        });
        const ecrRepositories = new EcrRepositories('my-repos', ecrRepoProps);
        const ecsQueueFactory = new EcsQueueFactory(stack, 'queue', {
            cluster: cluster,
            repositoryFactory: new EcrRepositoryFactory(stack, 'ecr-repos', ecrRepositories),
            secrets: new Secrets(stack, 'stack'),
            commandFactory: new ContainerCommandFactory(stack, 'commands', {})
        });
        ecsQueueFactory.create({
            type: TaskServiceType.QUEUE_SERVICE,
            image: EcrRepositoryType.PHPFPM,
            cpu: 256
        });
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        templateHelper.expected('AWS::ECS::Cluster',  [
            {
                key: 'cluster',
                properties: Match.objectEquals({
                    "Type": "AWS::ECS::Cluster"
                }),
            }
        ]);
        templateHelper.expected('AWS::ECR::Repository',  [
            {
                key: 'nginxecr',
                properties: Match.objectEquals({
                    Type: 'AWS::ECR::Repository',
                    Properties: {
                        ImageScanningConfiguration: {ScanOnPush: true},
                        LifecyclePolicy: {
                            LifecyclePolicyText: '{"rules":[{"rulePriority":1,"selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":3},"action":{"type":"expire"}}]}'
                        },
                        RepositoryName: 'my-repos/nginx'
                    },
                    UpdateReplacePolicy: 'Retain',
                    DeletionPolicy: 'Retain'
                })
            },
            {
                key: 'phpfpmecr',
                properties: Match.objectEquals({
                    Type: 'AWS::ECR::Repository',
                    Properties: {
                        ImageScanningConfiguration: {ScanOnPush: true},
                        LifecyclePolicy: {
                            LifecyclePolicyText: '{"rules":[{"rulePriority":1,"selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":3},"action":{"type":"expire"}}]}'
                        },
                        RepositoryName: 'my-repos/phpfpm'
                    },
                    UpdateReplacePolicy: 'Retain',
                    DeletionPolicy: 'Retain'
                })
            }
        ]);
        templateHelper.expected('AWS::SQS::Queue',  [
            {
                key: 'queueservicequeue0EcsProcessingDeadLetterQueue',
                properties: Match.objectEquals({
                    Type: 'AWS::SQS::Queue',
                    Properties: {MessageRetentionPeriod: 1209600},
                    UpdateReplacePolicy: 'Delete',
                    DeletionPolicy: 'Delete'
                })
            },
            {
                key: 'queueservicequeue0EcsProcessingQueue',
                properties: Match.objectEquals({
                    Type: 'AWS::SQS::Queue',
                    Properties: {MessageRetentionPeriod: 1209600},
                    UpdateReplacePolicy: 'Delete',
                    DeletionPolicy: 'Delete'
                })
            }
        ]);
        templateHelper.expected('AWS::IAM::Role',  [
            {
                key: 'queueservicequeue0QueueProcessingTaskDefTaskRole',
                properties: Match.objectEquals({
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
                })
            },
            {
                key: 'queueservicequeue0QueueProcessingTaskDefExecutionRole',
                properties: Match.objectEquals({
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
                })
            }
        ]);
        templateHelper.expected('AWS::IAM::Policy',  [
            {
                key: 'queueservicequeue0QueueProcessingTaskDefTaskRoleDefaultPolicy',
                properties: Match.objectEquals({
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
                                        'Fn::GetAtt': [templateHelper.startsWithMatch('queueservicequeue0EcsProcessingQueue'), 'Arn']
                                    }
                                }
                            ],
                            Version: '2012-10-17'
                        },
                        PolicyName: templateHelper.startsWithMatch('queueservicequeue0QueueProcessingTaskDefTaskRoleDefaultPolicy'),
                        Roles: [
                            {
                                Ref: templateHelper.startsWithMatch('queueservicequeue0QueueProcessingTaskDefTaskRole')
                            }
                        ]
                    }
                })
            },
            {
                key: 'queueservicequeue0QueueProcessingTaskDefExecutionRoleDefaultPolicy',
                properties: Match.objectEquals({
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
                                    Resource: {'Fn::GetAtt': [templateHelper.startsWithMatch('phpfpmecr'), 'Arn']}
                                },
                                {
                                    Action: 'ecr:GetAuthorizationToken',
                                    Effect: 'Allow',
                                    Resource: '*'
                                },
                                {
                                    Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
                                    Effect: 'Allow',
                                    Resource: {
                                        'Fn::GetAtt': [templateHelper.startsWithMatch('queueservicequeue0loggroup'), 'Arn']
                                    }
                                }
                            ],
                            Version: '2012-10-17'
                        },
                        PolicyName: templateHelper.startsWithMatch('queueservicequeue0QueueProcessingTaskDefExecutionRoleDefaultPolicy'),
                        Roles: [
                            {
                                Ref: templateHelper.startsWithMatch('queueservicequeue0QueueProcessingTaskDefExecutionRole')
                            }
                        ]
                    }
                })
            }
        ]);
        templateHelper.expected('AWS::ECS::TaskDefinition',  [
            {
                key: 'queueservicequeue0QueueProcessingTaskDef',
                properties: Match.objectEquals({
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
                                                templateHelper.startsWithMatch('queueservicequeue0EcsProcessingQueue'),
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
                                                            {'Fn::GetAtt': [templateHelper.startsWithMatch('phpfpmecr'), 'Arn']}
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
                                                            {'Fn::GetAtt': [templateHelper.startsWithMatch('phpfpmecr'), 'Arn']}
                                                        ]
                                                    }
                                                ]
                                            },
                                            '.',
                                            {Ref: 'AWS::URLSuffix'},
                                            '/',
                                            {Ref: templateHelper.startsWithMatch('phpfpmecr')},
                                            ':my-repos/phpfpm'
                                        ]
                                    ]
                                },
                                LogConfiguration: {
                                    LogDriver: 'awslogs',
                                    Options: {
                                        'awslogs-group': {Ref: templateHelper.startsWithMatch('queueservicequeue0loggroup')},
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
                                templateHelper.startsWithMatch('queueservicequeue0QueueProcessingTaskDefExecutionRole'),
                                'Arn'
                            ]
                        },
                        Family: 'queue-service-queue-0',
                        Memory: '512',
                        NetworkMode: 'awsvpc',
                        RequiresCompatibilities: ['FARGATE'],
                        TaskRoleArn: {
                            'Fn::GetAtt': [
                                templateHelper.startsWithMatch('queueservicequeue0QueueProcessingTaskDefTaskRole'),
                                'Arn'
                            ]
                        }
                    }
                })
            }
        ]);
        templateHelper.expected('AWS::ECS::Service',  [
            {
                key: 'queueservicequeue0QueueProcessingFargateService',
                properties: Match.objectEquals({
                    Type: 'AWS::ECS::Service',
                    Properties: {
                        Cluster: {Ref: templateHelper.startsWithMatch('cluster')},
                        DeploymentConfiguration: {MaximumPercent: 200, MinimumHealthyPercent: 50},
                        EnableECSManagedTags: false,
                        LaunchType: 'FARGATE',
                        NetworkConfiguration: {
                            AwsvpcConfiguration: {
                                AssignPublicIp: 'DISABLED',
                                SecurityGroups: [
                                    {
                                        'Fn::GetAtt': [
                                            templateHelper.startsWithMatch('queueservicequeue0QueueProcessingFargateServiceSecurityGroup'),
                                            'GroupId'
                                        ]
                                    }
                                ],
                                Subnets: ['p-12345', 'p-67890']
                            }
                        },
                        PlatformVersion: 'LATEST',
                        ServiceName: 'queue-service-queue-0',
                        TaskDefinition: {Ref: templateHelper.startsWithMatch('queueservicequeue0QueueProcessingTaskDef')}
                    }
                })
            }
        ]);
        templateHelper.expected('AWS::EC2::SecurityGroup',  [
            {
                key: 'queueservicequeue0QueueProcessingFargateServiceSecurityGroup',
                properties: Match.objectEquals({
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
                })
            }
        ]);
        templateHelper.expected('AWS::ApplicationAutoScaling::ScalableTarget',  [
            {
                key: 'queueservicequeue0QueueProcessingFargateServiceTaskCountTarget',
                properties: Match.objectEquals({
                    Type: 'AWS::ApplicationAutoScaling::ScalableTarget',
                    Properties: {
                        MaxCapacity: 2,
                        MinCapacity: 1,
                        ResourceId: {
                            'Fn::Join': [
                                '',
                                [
                                    'service/',
                                    {Ref: templateHelper.startsWithMatch('cluster')},
                                    '/',
                                    {
                                        'Fn::GetAtt': [
                                            templateHelper.startsWithMatch('queueservicequeue0QueueProcessingFargateService'),
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
                                    {Ref: 'AWS::Partition'},
                                    ':iam::12344:role/aws-service-role/ecs.application-autoscaling.amazonaws.com/AWSServiceRoleForApplicationAutoScaling_ECSService'
                                ]
                            ]
                        },
                        ScalableDimension: 'ecs:service:DesiredCount',
                        ServiceNamespace: 'ecs'
                    }
                })
            }
        ]);
        templateHelper.expected('AWS::ApplicationAutoScaling::ScalingPolicy',  [
            {
                key: 'queueservicequeue0QueueProcessingFargateServiceTaskCountTargetCpuScaling',
                properties: Match.objectEquals({
                    Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
                    Properties: {
                        PolicyName: templateHelper.startsWithMatch('stackqueueservicequeue0QueueProcessingFargateServiceTaskCountTargetCpuScaling'),
                        PolicyType: 'TargetTrackingScaling',
                        ScalingTargetId: {
                            Ref: templateHelper.startsWithMatch('queueservicequeue0QueueProcessingFargateServiceTaskCountTarget')
                        },
                        TargetTrackingScalingPolicyConfiguration: {
                            PredefinedMetricSpecification: {PredefinedMetricType: 'ECSServiceAverageCPUUtilization'},
                            TargetValue: 50
                        }
                    }
                })
            },
            {
                key: 'queueservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingLowerPolicy',
                properties: Match.objectEquals({
                    Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
                    Properties: {
                        PolicyName: templateHelper.startsWithMatch('stackqueueservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingLowerPolicy'),
                        PolicyType: 'StepScaling',
                        ScalingTargetId: {
                            Ref: templateHelper.startsWithMatch('queueservicequeue0QueueProcessingFargateServiceTaskCountTarget')
                        },
                        StepScalingPolicyConfiguration: {
                            AdjustmentType: 'ChangeInCapacity',
                            MetricAggregationType: 'Maximum',
                            StepAdjustments: [{MetricIntervalUpperBound: 0, ScalingAdjustment: -1}]
                        }
                    }
                })
            },
            {
                key: 'queueservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingUpperPolicy',
                properties: Match.objectEquals({
                    Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
                    Properties: {
                        PolicyName: templateHelper.startsWithMatch('stackqueueservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingUpperPolicy'),
                        PolicyType: 'StepScaling',
                        ScalingTargetId: {
                            Ref: templateHelper.startsWithMatch('queueservicequeue0QueueProcessingFargateServiceTaskCountTarget')
                        },
                        StepScalingPolicyConfiguration: {
                            AdjustmentType: 'ChangeInCapacity',
                            MetricAggregationType: 'Maximum',
                            StepAdjustments: [
                                {
                                    MetricIntervalLowerBound: 0,
                                    MetricIntervalUpperBound: 400,
                                    ScalingAdjustment: 1
                                },
                                {MetricIntervalLowerBound: 400, ScalingAdjustment: 5}
                            ]
                        }
                    }
                })
            }
        ]);
        templateHelper.expected('AWS::CloudWatch::Alarm',  [
            {
                key: 'queueservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingLowerAlarm',
                properties: Match.objectEquals({
                    Type: 'AWS::CloudWatch::Alarm',
                    Properties: {
                        ComparisonOperator: 'LessThanOrEqualToThreshold',
                        EvaluationPeriods: 1,
                        AlarmActions: [
                            {
                                Ref: templateHelper.startsWithMatch('queueservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingLowerPolicy')
                            }
                        ],
                        AlarmDescription: 'Lower threshold scaling alarm',
                        Dimensions: [
                            {
                                Name: 'QueueName',
                                Value: {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('queueservicequeue0EcsProcessingQueue'),
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
                })
            },
            {
                key: 'queueservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingUpperAlarm',
                properties: Match.objectEquals({
                    Type: 'AWS::CloudWatch::Alarm',
                    Properties: {
                        ComparisonOperator: 'GreaterThanOrEqualToThreshold',
                        EvaluationPeriods: 1,
                        AlarmActions: [
                            {
                                Ref: templateHelper.startsWithMatch('queueservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingUpperPolicy')
                            }
                        ],
                        AlarmDescription: 'Upper threshold scaling alarm',
                        Dimensions: [
                            {
                                Name: 'QueueName',
                                Value: {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('queueservicequeue0EcsProcessingQueue'),
                                        'QueueName'
                                    ]
                                }
                            }
                        ],
                        MetricName: 'ApproximateNumberOfMessagesVisible',
                        Namespace: 'AWS/SQS',
                        Period: 300,
                        Statistic: 'Maximum',
                        Threshold: 100
                    }
                })
            }
        ]);
    });
});