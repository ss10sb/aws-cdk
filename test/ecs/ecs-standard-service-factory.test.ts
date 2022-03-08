import {EcrRepositories, EcrRepositoryFactory, EcrRepositoryType} from "../../src/ecr";
import {Match, Template} from "aws-cdk-lib/assertions";
import {resetStaticProps} from "../../src/utils/reset-static-props";
import {App, Stack} from "aws-cdk-lib";
import {Cluster} from "aws-cdk-lib/aws-ecs";
import {VpcHelper} from "../../src/utils";
import {AlbTargetGroup} from "../../src/alb";
import {EnvConfig} from "../../src/env";
import {ConfigEnvironments} from "../../src/config";
import {
    ContainerCommandFactory,
    ContainerFactory,
    EcsStandardServiceFactory,
    ScalableTypes,
    TaskDefinitionFactory,
    TaskServiceType
} from "../../src/ecs";
import {Secrets} from "../../src/secret";
import {TemplateHelper} from "../../src/utils/testing";

const ecrRepoProps = {
    repositories: [EcrRepositoryType.NGINX, EcrRepositoryType.PHPFPM]
};

describe('ecs standard service factory', () => {

    beforeEach(() => {
        resetStaticProps();
    });

    it('should create service with defaults', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const vpc = VpcHelper.getVpcById(stack, 'vpcId');
        const cluster = new Cluster(stack, 'cluster', {
            vpc: vpc
        });
        const envConfig = <EnvConfig>{
            Name: 'test',
            College: 'PCC',
            Environment: ConfigEnvironments.PROD,
            Parameters: {
                targetGroup: {},
                listenerRule: {
                    priority: 100,
                    conditions: {
                        hostHeaders: ['test.example.edu']
                    }
                },
                services: [],
                tasks: []
            }
        }
        const albTargetGroup = new AlbTargetGroup(stack, 'target-group', vpc, envConfig);
        const targetGroup = albTargetGroup.createApplicationTargetGroup();
        const ecrRepositories = new EcrRepositories('my-repos', ecrRepoProps);
        const standardServiceFactory = new EcsStandardServiceFactory(stack, 'service', {
            cluster: cluster,
            targetGroup: targetGroup,
            taskDefinitionFactory: new TaskDefinitionFactory(stack, 'task-def', {
                containerFactory: new ContainerFactory(stack, 'container', {
                    repositoryFactory: new EcrRepositoryFactory(stack, 'ecr-repos', ecrRepositories),
                    secrets: new Secrets(stack, 'stack'),
                    commandFactory: new ContainerCommandFactory(stack, 'commands', {})
                })
            })
        });
        const services = [
            {
                type: TaskServiceType.WEB_SERVICE,
                attachToTargetGroup: true,
                enableExecuteCommand: true,
                scalable: {
                    types: [ScalableTypes.CPU, ScalableTypes.MEMORY],
                    scaleAt: 75,
                    minCapacity: 1,
                    maxCapacity: 2
                },
                taskDefinition: {
                    cpu: '256',
                    memoryMiB: '512',
                    containers: [
                        {
                            image: 'nginx',
                            cpu: 64,
                            memoryLimitMiB: 64,
                            portMappings: [{
                                containerPort: 80
                            }]
                        },
                        {
                            image: 'phpfpm',
                            hasSecrets: true,
                            hasEnv: true,
                            cpu: 128,
                            memoryLimitMiB: 128,
                            portMappings: [{
                                containerPort: 9000
                            }]
                        }
                    ]
                }
            }
        ];
        standardServiceFactory.create(services);
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
        templateHelper.expected('AWS::ElasticLoadBalancingV2::TargetGroup',  [
            {
                key: 'targetgroup',
                properties: Match.objectEquals({
                    Type: 'AWS::ElasticLoadBalancingV2::TargetGroup',
                    Properties: {
                        Name: 'target-group',
                        Port: 80,
                        Protocol: 'HTTP',
                        TargetGroupAttributes: [{Key: 'stickiness.enabled', Value: 'false'}],
                        TargetType: 'ip',
                        VpcId: 'vpc-12345'
                    }
                })
            }
        ]);
        templateHelper.expected('AWS::IAM::Role',  [
            {
                key: 'taskdeftaskdefweb0execrole',
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
                key: 'taskdeftaskdefweb0TaskRole',
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
                key: 'taskdeftaskdefweb0execroleDefaultPolicy',
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
                                    Resource: {'Fn::GetAtt': [templateHelper.startsWithMatch('nginxecr'), 'Arn']}
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
                                        'Fn::GetAtt': [templateHelper.startsWithMatch('containercontainernginxwebu0loggroup'), 'Arn']
                                    }
                                },
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
                                    Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
                                    Effect: 'Allow',
                                    Resource: {
                                        'Fn::GetAtt': [templateHelper.startsWithMatch('containercontainerphpfpmwebu0loggroup'), 'Arn']
                                    }
                                }
                            ],
                            Version: '2012-10-17'
                        },
                        PolicyName: templateHelper.startsWithMatch('taskdeftaskdefweb0execroleDefaultPolicy'),
                        Roles: [{Ref: templateHelper.startsWithMatch('taskdeftaskdefweb0execrole')}]
                    }
                })
            },
            {
                key: 'taskdeftaskdefweb0TaskRoleDefaultPolicy',
                properties: Match.objectEquals({
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
                        PolicyName: templateHelper.startsWithMatch('taskdeftaskdefweb0TaskRoleDefaultPolicy'),
                        Roles: [{Ref: templateHelper.startsWithMatch('taskdeftaskdefweb0TaskRole')}]
                    }
                })
            }
        ]);
        templateHelper.expected('AWS::ECS::TaskDefinition',  [
            {
                key: 'taskdeftaskdefweb',
                properties: Match.objectEquals({
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
                                                            {'Fn::GetAtt': [templateHelper.startsWithMatch('nginxecr'), 'Arn']}
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
                                                            {'Fn::GetAtt': [templateHelper.startsWithMatch('nginxecr'), 'Arn']}
                                                        ]
                                                    }
                                                ]
                                            },
                                            '.',
                                            {Ref: 'AWS::URLSuffix'},
                                            '/',
                                            {Ref: templateHelper.startsWithMatch('nginxecr')},
                                            ':1'
                                        ]
                                    ]
                                },
                                LogConfiguration: {
                                    LogDriver: 'awslogs',
                                    Options: {
                                        'awslogs-group': {Ref: templateHelper.startsWithMatch('containercontainernginxwebu0loggroup')},
                                        'awslogs-stream-prefix': 'nginx',
                                        'awslogs-region': 'us-east-1'
                                    }
                                },
                                Memory: 64,
                                Name: 'container-container-nginx-web-u-0',
                                PortMappings: [{ContainerPort: 80, Protocol: 'tcp'}],
                                Secrets: []
                            },
                            {
                                Cpu: 128,
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
                                            ':1'
                                        ]
                                    ]
                                },
                                LogConfiguration: {
                                    LogDriver: 'awslogs',
                                    Options: {
                                        'awslogs-group': {Ref: templateHelper.startsWithMatch('containercontainerphpfpmwebu0loggroup')},
                                        'awslogs-stream-prefix': 'phpfpm',
                                        'awslogs-region': 'us-east-1'
                                    }
                                },
                                Memory: 128,
                                Name: 'container-container-phpfpm-web-u-0',
                                PortMappings: [{ContainerPort: 9000, Protocol: 'tcp'}],
                                Secrets: []
                            }
                        ],
                        Cpu: '256',
                        ExecutionRoleArn: {'Fn::GetAtt': [templateHelper.startsWithMatch('taskdeftaskdefweb0execrole'), 'Arn']},
                        Family: 'task-def-task-def-web-0',
                        Memory: '512',
                        NetworkMode: 'awsvpc',
                        RequiresCompatibilities: ['FARGATE'],
                        TaskRoleArn: {'Fn::GetAtt': [templateHelper.startsWithMatch('taskdeftaskdefweb0TaskRole'), 'Arn']}
                    }
                })
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
        templateHelper.expected('AWS::Logs::LogGroup',  [
            {
                key: 'containercontainernginxwebu0loggroup',
                properties: Match.objectEquals({
                    Type: 'AWS::Logs::LogGroup',
                    Properties: {
                        LogGroupName: 'container-container-nginx-web-u-0-log-group',
                        RetentionInDays: 30
                    },
                    UpdateReplacePolicy: 'Delete',
                    DeletionPolicy: 'Delete'
                })
            },
            {
                key: 'containercontainerphpfpmwebu0loggroup',
                properties: Match.objectEquals({
                    Type: 'AWS::Logs::LogGroup',
                    Properties: {
                        LogGroupName: 'container-container-phpfpm-web-u-0-log-group',
                        RetentionInDays: 30
                    },
                    UpdateReplacePolicy: 'Delete',
                    DeletionPolicy: 'Delete'
                })
            }
        ]);
        templateHelper.expected('AWS::ECS::Service',  [
            {
                key: 'serviceserviceweb0Service',
                properties: Match.objectEquals({
                    Type: 'AWS::ECS::Service',
                    Properties: {
                        Cluster: {Ref: templateHelper.startsWithMatch('cluster')},
                        DeploymentConfiguration: {MaximumPercent: 200, MinimumHealthyPercent: 50},
                        DesiredCount: 1,
                        EnableECSManagedTags: false,
                        EnableExecuteCommand: true,
                        HealthCheckGracePeriodSeconds: 60,
                        LaunchType: 'FARGATE',
                        LoadBalancers: [
                            {
                                ContainerName: 'container-container-nginx-web-u-0',
                                ContainerPort: 80,
                                TargetGroupArn: {Ref: templateHelper.startsWithMatch('targetgroup')}
                            }
                        ],
                        NetworkConfiguration: {
                            AwsvpcConfiguration: {
                                AssignPublicIp: 'DISABLED',
                                SecurityGroups: [
                                    {
                                        'Fn::GetAtt': [templateHelper.startsWithMatch('serviceserviceweb0SecurityGroup'), 'GroupId']
                                    }
                                ],
                                Subnets: ['p-12345', 'p-67890']
                            }
                        },
                        PlatformVersion: 'LATEST',
                        ServiceName: 'service-service-web-0',
                        TaskDefinition: {Ref: templateHelper.startsWithMatch('taskdeftaskdefweb')}
                    }
                })
            }
        ]);
        templateHelper.expected('AWS::EC2::SecurityGroup',  [
            {
                key: 'serviceserviceweb0SecurityGroup',
                properties: Match.objectEquals({
                    Type: 'AWS::EC2::SecurityGroup',
                    Properties: {
                        GroupDescription: 'stack/service-service-web-0/SecurityGroup',
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
                key: 'serviceserviceweb0TaskCountTarget',
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
                                        'Fn::GetAtt': [templateHelper.startsWithMatch('serviceserviceweb0Service'), 'Name']
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
                key: 'serviceserviceweb0TaskCountTargetserviceservicescalecpu',
                properties: Match.objectEquals({
                    Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
                    Properties: {
                        PolicyName: templateHelper.startsWithMatch('stackserviceserviceweb0TaskCountTargetserviceservicescalecpu'),
                        PolicyType: 'TargetTrackingScaling',
                        ScalingTargetId: {Ref: templateHelper.startsWithMatch('serviceserviceweb0TaskCountTarget')},
                        TargetTrackingScalingPolicyConfiguration: {
                            PredefinedMetricSpecification: {PredefinedMetricType: 'ECSServiceAverageCPUUtilization'},
                            TargetValue: 75
                        }
                    }
                })
            },
            {
                key: 'serviceserviceweb0TaskCountTargetserviceservicescalemem',
                properties: Match.objectEquals({
                    Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
                    Properties: {
                        PolicyName: templateHelper.startsWithMatch('stackserviceserviceweb0TaskCountTargetserviceservicescalemem'),
                        PolicyType: 'TargetTrackingScaling',
                        ScalingTargetId: {Ref: templateHelper.startsWithMatch('serviceserviceweb0TaskCountTarget')},
                        TargetTrackingScalingPolicyConfiguration: {
                            PredefinedMetricSpecification: {PredefinedMetricType: 'ECSServiceAverageMemoryUtilization'},
                            TargetValue: 75
                        }
                    }
                })
            }
        ]);
    });
});