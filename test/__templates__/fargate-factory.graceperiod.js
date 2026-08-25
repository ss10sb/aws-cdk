const {MatchHelper} = require("../../src/utils/testing/match-helper");
module.exports = {
    Resources: {
        stackcluster05FAB0DF: {
            Type: 'AWS::ECS::Cluster',
            Properties: {
                ClusterName: 'stack-cluster',
                ClusterSettings: [ { Name: 'containerInsights', Value: 'disabled' } ]
            }
        },
        targetgroup897B0682: {
            Type: 'AWS::ElasticLoadBalancingV2::TargetGroup',
            Properties: {
                Name: 'target-group',
                Port: 80,
                Protocol: 'HTTP',
                TargetGroupAttributes: [ { Key: 'stickiness.enabled', Value: 'false' } ],
                TargetType: 'ip',
                VpcId: 'vpc-12345'
            }
        },
        stacktaskdefweb0execroleF48E5557: {
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
        stacktaskdefweb0execroleDefaultPolicyA1E628C2: {
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
                            Resource: { 'Fn::GetAtt': [ 'nginxecrC430EE7B', 'Arn' ] }
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
                                'Fn::GetAtt': [ 'stackcontainernginxwebu0loggroupA0485B8E', 'Arn' ]
                            }
                        },
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
                            Action: [ 'logs:CreateLogStream', 'logs:PutLogEvents' ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'stackcontainerphpfpmwebu0loggroup678C2866',
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: [
                                'secretsmanager:GetSecretValue',
                                'secretsmanager:DescribeSecret'
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        { Ref: 'AWS::Partition' },
                                        ':secretsmanager:us-east-1:12344:secret:stack-secrets/environment-??????'
                                    ]
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'stacktaskdefweb0execroleDefaultPolicyA1E628C2',
                Roles: [ { Ref: 'stacktaskdefweb0execroleF48E5557' } ]
            }
        },
        stacktaskdefweb0TaskRole8BC1F26E: {
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
        stacktaskdefweb0TaskRoleDefaultPolicy30BB6C4E: {
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: [
                                'ssmmessages:CreateControlChannel',
                                'ssmmessages:CreateDataChannel',
                                'ssmmessages:OpenControlChannel',
                                'ssmmessages:OpenDataChannel'
                            ],
                            Effect: 'Allow',
                            Resource: '*'
                        },
                        {
                            Action: 'logs:DescribeLogGroups',
                            Effect: 'Allow',
                            Resource: '*'
                        },
                        {
                            Action: [
                                'logs:CreateLogStream',
                                'logs:DescribeLogStreams',
                                'logs:PutLogEvents'
                            ],
                            Effect: 'Allow',
                            Resource: '*'
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: 'stacktaskdefweb0TaskRoleDefaultPolicy30BB6C4E',
                Roles: [ { Ref: 'stacktaskdefweb0TaskRole8BC1F26E' } ]
            }
        },
        stacktaskdefweb065A59601: {
            Type: 'AWS::ECS::TaskDefinition',
            Properties: {
                ContainerDefinitions: [
                    {
                        Cpu: 64,
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
                                                        'Fn::GetAtt': [ 'nginxecrC430EE7B', 'Arn' ]
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
                                                        'Fn::GetAtt': [ 'nginxecrC430EE7B', 'Arn' ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    '.',
                                    { Ref: 'AWS::URLSuffix' },
                                    '/',
                                    { Ref: 'nginxecrC430EE7B' },
                                    ':1'
                                ]
                            ]
                        },
                        LogConfiguration: {
                            LogDriver: 'awslogs',
                            Options: {
                                'awslogs-group': { Ref: 'stackcontainernginxwebu0loggroupA0485B8E' },
                                'awslogs-stream-prefix': 'nginx',
                                'awslogs-region': 'us-east-1'
                            }
                        },
                        Memory: 64,
                        Name: 'stack-container-nginx-web-u-0',
                        PortMappings: [ { ContainerPort: 80, Protocol: 'tcp' } ],
                        ReadonlyRootFilesystem: true
                    },
                    {
                        Cpu: 128,
                        Environment: [ { Name: 'FIZZ', Value: 'buzz' } ],
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
                                'awslogs-group': { Ref: 'stackcontainerphpfpmwebu0loggroup678C2866' },
                                'awslogs-stream-prefix': 'phpfpm',
                                'awslogs-region': 'us-east-1'
                            }
                        },
                        Memory: 128,
                        Name: 'stack-container-phpfpm-web-u-0',
                        PortMappings: [ { ContainerPort: 9000, Protocol: 'tcp' } ],
                        ReadonlyRootFilesystem: true,
                        Secrets: [
                            {
                                Name: 'FOO',
                                ValueFrom: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            { Ref: 'AWS::Partition' },
                                            ':secretsmanager:us-east-1:12344:secret:stack-secrets/environment:FOO::'
                                        ]
                                    ]
                                }
                            },
                            {
                                Name: 'BAR',
                                ValueFrom: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            { Ref: 'AWS::Partition' },
                                            ':secretsmanager:us-east-1:12344:secret:stack-secrets/environment:BAR::'
                                        ]
                                    ]
                                }
                            }
                        ]
                    }
                ],
                Cpu: '256',
                ExecutionRoleArn: {
                    'Fn::GetAtt': [ 'stacktaskdefweb0execroleF48E5557', 'Arn' ]
                },
                Family: 'stack-task-def-web-0',
                Memory: '512',
                NetworkMode: 'awsvpc',
                RequiresCompatibilities: [ 'FARGATE' ],
                TaskRoleArn: {
                    'Fn::GetAtt': [ 'stacktaskdefweb0TaskRole8BC1F26E', 'Arn' ]
                }
            }
        },
        nginxecrC430EE7B: {
            Type: 'AWS::ECR::Repository',
            Properties: {
                ImageScanningConfiguration: { ScanOnPush: true },
                LifecyclePolicy: {
                    LifecyclePolicyText: '{"rules":[{"rulePriority":1,"selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":3},"action":{"type":"expire"}}]}'
                },
                RepositoryName: 'stack/nginx'
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
                RepositoryName: 'stack/phpfpm'
            },
            UpdateReplacePolicy: 'Retain',
            DeletionPolicy: 'Retain'
        },
        stackcontainernginxwebu0loggroupA0485B8E: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                LogGroupName: 'stack-container-nginx-web-u-0-log-group',
                RetentionInDays: 30
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        stackcontainerphpfpmwebu0loggroup678C2866: {
            Type: 'AWS::Logs::LogGroup',
            Properties: {
                LogGroupName: 'stack-container-phpfpm-web-u-0-log-group',
                RetentionInDays: 30
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        stackserviceweb0Service4596BF8E: {
            Type: 'AWS::ECS::Service',
            Properties: {
                Cluster: { Ref: 'stackcluster05FAB0DF' },
                DeploymentConfiguration: {
                    Alarms: { AlarmNames: [], Enable: false, Rollback: false },
                    MaximumPercent: 200,
                    MinimumHealthyPercent: 50
                },
                DesiredCount: 1,
                EnableECSManagedTags: false,
                EnableExecuteCommand: true,
                HealthCheckGracePeriodSeconds: 180,
                LaunchType: 'FARGATE',
                LoadBalancers: [
                    {
                        ContainerName: 'stack-container-nginx-web-u-0',
                        ContainerPort: 80,
                        TargetGroupArn: { Ref: 'targetgroup897B0682' }
                    }
                ],
                NetworkConfiguration: {
                    AwsvpcConfiguration: {
                        AssignPublicIp: 'DISABLED',
                        SecurityGroups: [
                            {
                                'Fn::GetAtt': [
                                    'stackserviceweb0SecurityGroup2BBE8DB1',
                                    'GroupId'
                                ]
                            }
                        ],
                        Subnets: [ 'p-12345', 'p-67890' ]
                    }
                },
                PlatformVersion: 'LATEST',
                ServiceName: 'stack-service-web-0',
                TaskDefinition: { Ref: 'stacktaskdefweb065A59601' }
            },
            DependsOn: [
                'stacktaskdefweb0TaskRoleDefaultPolicy30BB6C4E',
                'stacktaskdefweb0TaskRole8BC1F26E'
            ]
        },
        stackserviceweb0SecurityGroup2BBE8DB1: {
            Type: 'AWS::EC2::SecurityGroup',
            Properties: {
                GroupDescription: 'stack/stack-service-web-0/SecurityGroup',
                SecurityGroupEgress: [
                    {
                        CidrIp: '0.0.0.0/0',
                        Description: 'Allow all outbound traffic by default',
                        IpProtocol: '-1'
                    }
                ],
                VpcId: 'vpc-12345'
            },
            DependsOn: [
                'stacktaskdefweb0TaskRoleDefaultPolicy30BB6C4E',
                'stacktaskdefweb0TaskRole8BC1F26E'
            ]
        },
        stackserviceweb0TaskCountTarget25516769: {
            Type: 'AWS::ApplicationAutoScaling::ScalableTarget',
            Properties: {
                MaxCapacity: 2,
                MinCapacity: 1,
                ResourceId: {
                    'Fn::Join': [
                        '',
                        [
                            'service/',
                            { Ref: 'stackcluster05FAB0DF' },
                            '/',
                            {
                                'Fn::GetAtt': [ 'stackserviceweb0Service4596BF8E', 'Name' ]
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
            },
            DependsOn: [
                'stacktaskdefweb0TaskRoleDefaultPolicy30BB6C4E',
                'stacktaskdefweb0TaskRole8BC1F26E'
            ]
        },
        stackserviceweb0TaskCountTargetstackservicescalecpuFCB34C28: {
            Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
            Properties: {
                PolicyName: 'stackstackserviceweb0TaskCountTargetstackservicescalecpu24230823',
                PolicyType: 'TargetTrackingScaling',
                ScalingTargetId: { Ref: 'stackserviceweb0TaskCountTarget25516769' },
                TargetTrackingScalingPolicyConfiguration: {
                    PredefinedMetricSpecification: { PredefinedMetricType: 'ECSServiceAverageCPUUtilization' },
                    TargetValue: 75
                }
            },
            DependsOn: [
                'stacktaskdefweb0TaskRoleDefaultPolicy30BB6C4E',
                'stacktaskdefweb0TaskRole8BC1F26E'
            ]
        },
        stackserviceweb0TaskCountTargetstackservicescalemem7A298342: {
            Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
            Properties: {
                PolicyName: 'stackstackserviceweb0TaskCountTargetstackservicescalemem5B089F4E',
                PolicyType: 'TargetTrackingScaling',
                ScalingTargetId: { Ref: 'stackserviceweb0TaskCountTarget25516769' },
                TargetTrackingScalingPolicyConfiguration: {
                    PredefinedMetricSpecification: {
                        PredefinedMetricType: 'ECSServiceAverageMemoryUtilization'
                    },
                    TargetValue: 75
                }
            },
            DependsOn: [
                'stacktaskdefweb0TaskRoleDefaultPolicy30BB6C4E',
                'stacktaskdefweb0TaskRole8BC1F26E'
            ]
        }
    }
};