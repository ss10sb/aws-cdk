import {Match, Template} from "aws-cdk-lib/assertions";
import {resetStaticProps} from "../../src/utils/reset-static-props";
import {App, Stack} from "aws-cdk-lib";
import {Cluster} from "aws-cdk-lib/aws-ecs";
import {ContainerCommand, ContainerCommandFactory, ContainerEntryPoint} from "../../src/ecs/container-command-factory";
import {TaskDefinitionFactory} from "../../src/ecs/task-definition-factory";
import {Secrets} from "../../src/secret/secrets";
import {ContainerType} from "../../src/ecs/container-definitions";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {EcsTaskFactory} from "../../src/ecs/ecs-task-factory";
import {EcrRepositoryType} from "../../src/ecr/ecr-definitions";
import {EcrRepositories} from "../../src/ecr/ecr-repositories";
import {SchedulableTypes, TaskServiceType} from "../../src/ecs/task-definitions";
import {ContainerFactory} from "../../src/ecs/container-factory";
import {EcrRepositoryFactory} from "../../src/ecr/ecr-repository-factory";
import {VpcHelper} from "../../src/utils/vpc-helper";

const ecrRepoProps = {
    repositories: [EcrRepositoryType.NGINX, EcrRepositoryType.PHPFPM]
};

describe('ecs task factory', () => {

    beforeEach(() => {
        resetStaticProps();
    });

    it('should create scheduled task from defaults', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const vpc = VpcHelper.getVpcById(stack, 'vpcId');
        const cluster = new Cluster(stack, 'cluster', {
            vpc: vpc
        });
        const ecrRepositories = new EcrRepositories('my-repos', ecrRepoProps);
        const taskFactory = new EcsTaskFactory(stack, 'task', {
            cluster: cluster,
            taskDefinitionFactory: new TaskDefinitionFactory(stack, 'task-def', {
                containerFactory: new ContainerFactory(stack, 'container', {
                    repositoryFactory: new EcrRepositoryFactory(stack, 'ecr-repos', ecrRepositories),
                    secrets: new Secrets(stack, 'stack'),
                    commandFactory: new ContainerCommandFactory(stack, 'commands', {})
                })
            })
        });
        const tasks = [
            {
                type: TaskServiceType.SCHEDULED_TASK,
                schedule: {
                    type: SchedulableTypes.EXPRESSION,
                    value: 'cron(0 12 * * ? *)'
                },
                taskDefinition: {
                    cpu: '256',
                    memoryMiB: '512',
                    containers: [
                        {
                            type: ContainerType.SCHEDULED_TASK,
                            image: 'phpfpm',
                            hasSecrets: true,
                            hasEnv: true,
                            cpu: 256,
                            memoryLimitMiB: 512,
                            essential: true,
                            dependsOn: true,
                            entryPoint: ContainerEntryPoint.PHP,
                            command: ContainerCommand.ARTISAN,
                            additionalCommand: ['import:all']
                        }
                    ]
                }
            }
        ];
        taskFactory.create(tasks);
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
        templateHelper.expected('AWS::IAM::Role',  [
            {
                key: 'taskdeftaskdefscheduledtask0execrole',
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
                key: 'taskdeftaskdefscheduledtask0TaskRole',
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
                key: 'taskdeftaskdefscheduledtask0EventsRole',
                properties: Match.objectEquals({
                    Type: 'AWS::IAM::Role',
                    Properties: {
                        AssumeRolePolicyDocument: {
                            Statement: [
                                {
                                    Action: 'sts:AssumeRole',
                                    Effect: 'Allow',
                                    Principal: {Service: 'events.amazonaws.com'}
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
                key: 'taskdeftaskdefscheduledtask0execroleDefaultPolicy',
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
                                        'Fn::GetAtt': [
                                            templateHelper.startsWithMatch('containercontainerphpfpmscheduledtaskst0loggroup'),
                                            'Arn'
                                        ]
                                    }
                                }
                            ],
                            Version: '2012-10-17'
                        },
                        PolicyName: templateHelper.startsWithMatch('taskdeftaskdefscheduledtask0execroleDefaultPolicy'),
                        Roles: [{Ref: templateHelper.startsWithMatch('taskdeftaskdefscheduledtask0execrole')}]
                    }
                })
            },
            {
                key: 'taskdeftaskdefscheduledtask0EventsRoleDefaultPolicy',
                properties: Match.objectEquals({
                    Type: 'AWS::IAM::Policy',
                    Properties: {
                        PolicyDocument: {
                            Statement: [
                                {
                                    Action: 'ecs:RunTask',
                                    Condition: {
                                        ArnEquals: {
                                            'ecs:cluster': {'Fn::GetAtt': [templateHelper.startsWithMatch('cluster'), 'Arn']}
                                        }
                                    },
                                    Effect: 'Allow',
                                    Resource: {Ref: templateHelper.startsWithMatch('taskdeftaskdefscheduledtask')}
                                },
                                {
                                    Action: 'iam:PassRole',
                                    Effect: 'Allow',
                                    Resource: {
                                        'Fn::GetAtt': [templateHelper.startsWithMatch('taskdeftaskdefscheduledtask0execrole'), 'Arn']
                                    }
                                },
                                {
                                    Action: 'iam:PassRole',
                                    Effect: 'Allow',
                                    Resource: {
                                        'Fn::GetAtt': [templateHelper.startsWithMatch('taskdeftaskdefscheduledtask0TaskRole'), 'Arn']
                                    }
                                }
                            ],
                            Version: '2012-10-17'
                        },
                        PolicyName: templateHelper.startsWithMatch('taskdeftaskdefscheduledtask0EventsRoleDefaultPolicy'),
                        Roles: [{Ref: templateHelper.startsWithMatch('taskdeftaskdefscheduledtask0EventsRole')}]
                    }
                })
            }
        ]);
        templateHelper.expected('AWS::ECS::TaskDefinition',  [
            {
                key: 'taskdeftaskdefscheduledtask',
                properties: Match.objectEquals({
                    Type: 'AWS::ECS::TaskDefinition',
                    Properties: {
                        ContainerDefinitions: [
                            {
                                Command: ['artisan', 'import:all'],
                                Cpu: 256,
                                EntryPoint: ['/usr/local/bin/php'],
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
                                        'awslogs-group': {
                                            Ref: templateHelper.startsWithMatch('containercontainerphpfpmscheduledtaskst0loggroup9954A4D2')
                                        },
                                        'awslogs-stream-prefix': 'phpfpm',
                                        'awslogs-region': 'us-east-1'
                                    }
                                },
                                Memory: 512,
                                Name: 'container-container-phpfpm-scheduledtask-st-0',
                                Secrets: []
                            }
                        ],
                        Cpu: '256',
                        ExecutionRoleArn: {
                            'Fn::GetAtt': [templateHelper.startsWithMatch('taskdeftaskdefscheduledtask0execrole'), 'Arn']
                        },
                        Family: 'task-def-task-def-scheduledtask-0',
                        Memory: '512',
                        NetworkMode: 'awsvpc',
                        RequiresCompatibilities: ['FARGATE'],
                        TaskRoleArn: {
                            'Fn::GetAtt': [templateHelper.startsWithMatch('taskdeftaskdefscheduledtask0TaskRole'), 'Arn']
                        }
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
        templateHelper.expected('AWS::EC2::SecurityGroup',  [
            {
                key: 'taskdeftaskdefscheduledtask0SecurityGroup',
                properties: Match.objectEquals({
                    Type: 'AWS::EC2::SecurityGroup',
                    Properties: {
                        GroupDescription: 'stack/task-def-task-def-scheduledtask-0/SecurityGroup',
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
        templateHelper.expected('AWS::Logs::LogGroup',  [
            {
                key: 'containercontainerphpfpmscheduledtaskst0loggroup',
                properties: Match.objectEquals({
                    Type: 'AWS::Logs::LogGroup',
                    Properties: {
                        LogGroupName: 'container-container-phpfpm-scheduledtask-st-0-log-group',
                        RetentionInDays: 30
                    },
                    UpdateReplacePolicy: 'Delete',
                    DeletionPolicy: 'Delete'
                })
            }
        ]);
        templateHelper.expected('AWS::Events::Rule',  [
            {
                key: 'tasktaskscheduledtask0ScheduledEventRule',
                properties: Match.objectEquals({
                    Type: 'AWS::Events::Rule',
                    Properties: {
                        Name: 'task-task-scheduledtask-0',
                        ScheduleExpression: 'cron(0 12 * * ? *)',
                        State: 'ENABLED',
                        Targets: [
                            {
                                Arn: {'Fn::GetAtt': [templateHelper.startsWithMatch('cluster'), 'Arn']},
                                EcsParameters: {
                                    LaunchType: 'FARGATE',
                                    NetworkConfiguration: {
                                        AwsVpcConfiguration: {
                                            AssignPublicIp: 'DISABLED',
                                            SecurityGroups: [
                                                {
                                                    'Fn::GetAtt': [
                                                        templateHelper.startsWithMatch('taskdeftaskdefscheduledtask0SecurityGroup'),
                                                        'GroupId'
                                                    ]
                                                }
                                            ],
                                            Subnets: ['p-12345', 'p-67890']
                                        }
                                    },
                                    PlatformVersion: 'LATEST',
                                    TaskCount: 1,
                                    TaskDefinitionArn: {Ref: templateHelper.startsWithMatch('taskdeftaskdefscheduledtask')}
                                },
                                Id: 'Target0',
                                Input: '{}',
                                RoleArn: {
                                    'Fn::GetAtt': [templateHelper.startsWithMatch('taskdeftaskdefscheduledtask0EventsRole'), 'Arn']
                                }
                            }
                        ]
                    }
                })
            }
        ]);
    });

    it('should create run once on create task from defaults', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const vpc = VpcHelper.getVpcById(stack, 'vpcId');
        const cluster = new Cluster(stack, 'cluster', {
            vpc: vpc
        });
        const ecrRepositories = new EcrRepositories('my-repos', ecrRepoProps);
        const taskFactory = new EcsTaskFactory(stack, 'task', {
            cluster: cluster,
            taskDefinitionFactory: new TaskDefinitionFactory(stack, 'task-def', {
                containerFactory: new ContainerFactory(stack, 'container', {
                    repositoryFactory: new EcrRepositoryFactory(stack, 'ecr-repos', ecrRepositories),
                    secrets: new Secrets(stack, 'stack'),
                    commandFactory: new ContainerCommandFactory(stack, 'commands', {})
                })
            })
        });
        const tasks = [
            {
                type: TaskServiceType.CREATE_RUN_ONCE_TASK,
                taskDefinition: {
                    cpu: '256',
                    memoryMiB: '512',
                    containers: [
                        {
                            type: ContainerType.CREATE_RUN_ONCE_TASK,
                            image: 'phpfpm',
                            hasSecrets: true,
                            hasEnv: true,
                            cpu: 256,
                            memoryLimitMiB: 512,
                            essential: true,
                            dependency: true,
                            entryPoint: ContainerEntryPoint.SH,
                            command: ContainerCommand.ON_CREATE
                        }
                    ]
                }
            }
        ];
        taskFactory.create(tasks);
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
        templateHelper.expected('AWS::IAM::Role',  [
            {
                key: 'taskdeftaskdefcreateruntask0execrole',
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
                key: 'taskdeftaskdefcreateruntask0TaskRole',
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
                key: '^AWS.*ServiceRole.*',
                properties: Match.objectEquals({
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
                })
            },
            {
                key: '^LogRetention.*ServiceRole.*',
                properties: Match.objectEquals({
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
                })
            }
        ]);
        templateHelper.expected('AWS::IAM::Policy',  [
            {
                key: 'taskdeftaskdefcreateruntask0execroleDefaultPolicy',
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
                                        'Fn::GetAtt': [
                                            templateHelper.startsWithMatch('containercontainerphpfpmcreateruntaskcrot0loggroup'),
                                            'Arn'
                                        ]
                                    }
                                }
                            ],
                            Version: '2012-10-17'
                        },
                        PolicyName: templateHelper.startsWithMatch('taskdeftaskdefcreateruntask0execroleDefaultPolicy'),
                        Roles: [{Ref: templateHelper.startsWithMatch('taskdeftaskdefcreateruntask0execrole')}]
                    }
                })
            },
            {
                key: 'tasktaskcreateruntask0createfnCustomResourcePolicy',
                properties: Match.objectEquals({
                    Type: 'AWS::IAM::Policy',
                    Properties: {
                        PolicyDocument: {
                            Statement: [
                                {
                                    Action: 'ecs:RunTask',
                                    Effect: 'Allow',
                                    Resource: {Ref: templateHelper.startsWithMatch('taskdeftaskdefcreateruntask')}
                                }
                            ],
                            Version: '2012-10-17'
                        },
                        PolicyName: templateHelper.startsWithMatch('tasktaskcreateruntask0createfnCustomResourcePolicy'),
                        Roles: [
                            {Ref: Match.stringLikeRegexp('^AWS.*ServiceRole.*')}
                        ]
                    }
                })
            },
            {
                key: '^AWS.*ServiceRoleDefaultPolicy.*',
                properties: Match.objectEquals({
                    Type: 'AWS::IAM::Policy',
                    Properties: {
                        PolicyDocument: {
                            Statement: [
                                {
                                    Action: 'iam:PassRole',
                                    Effect: 'Allow',
                                    Resource: {
                                        'Fn::GetAtt': [templateHelper.startsWithMatch('taskdeftaskdefcreateruntask0TaskRole'), 'Arn']
                                    }
                                },
                                {
                                    Action: 'iam:PassRole',
                                    Effect: 'Allow',
                                    Resource: {
                                        'Fn::GetAtt': [templateHelper.startsWithMatch('taskdeftaskdefcreateruntask0execrole'), 'Arn']
                                    }
                                }
                            ],
                            Version: '2012-10-17'
                        },
                        PolicyName: Match.stringLikeRegexp('^AWS.*ServiceRoleDefaultPolicy.*'),
                        Roles: [
                            {Ref: Match.stringLikeRegexp('^AWS.*ServiceRole.*')}
                        ]
                    }
                })
            },
            {
                key: '^LogRetention.*ServiceRoleDefaultPolicy.*',
                properties: Match.objectEquals({
                    Type: 'AWS::IAM::Policy',
                    Properties: {
                        PolicyDocument: {
                            Statement: [
                                {
                                    Action: ['logs:PutRetentionPolicy', 'logs:DeleteRetentionPolicy'],
                                    Effect: 'Allow',
                                    Resource: '*'
                                }
                            ],
                            Version: '2012-10-17'
                        },
                        PolicyName: Match.stringLikeRegexp('^LogRetention.*ServiceRoleDefaultPolicy.*'),
                        Roles: [
                            {
                                Ref: Match.stringLikeRegexp('^LogRetention.*ServiceRole.*')
                            }
                        ]
                    }
                })
            }
        ]);
        templateHelper.expected('AWS::ECS::TaskDefinition',  [
            {
                key: 'taskdeftaskdefcreateruntask',
                properties: Match.objectEquals({
                    Type: 'AWS::ECS::TaskDefinition',
                    Properties: {
                        ContainerDefinitions: [
                            {
                                Command: ['/on_create.sh'],
                                Cpu: 256,
                                EntryPoint: ['/bin/sh', '-c'],
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
                                        'awslogs-group': {
                                            Ref: templateHelper.startsWithMatch('containercontainerphpfpmcreateruntaskcrot0loggroup')
                                        },
                                        'awslogs-stream-prefix': 'phpfpm',
                                        'awslogs-region': 'us-east-1'
                                    }
                                },
                                Memory: 512,
                                Name: 'container-container-phpfpm-createruntask-crot-0',
                                Secrets: []
                            }
                        ],
                        Cpu: '256',
                        ExecutionRoleArn: {
                            'Fn::GetAtt': [templateHelper.startsWithMatch('taskdeftaskdefcreateruntask0execrole'), 'Arn']
                        },
                        Family: 'task-def-task-def-createruntask-0',
                        Memory: '512',
                        NetworkMode: 'awsvpc',
                        RequiresCompatibilities: ['FARGATE'],
                        TaskRoleArn: {
                            'Fn::GetAtt': [templateHelper.startsWithMatch('taskdeftaskdefcreateruntask0TaskRole'), 'Arn']
                        }
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
                key: 'containercontainerphpfpmcreateruntaskcrot0loggroup',
                properties: Match.objectEquals({
                    Type: 'AWS::Logs::LogGroup',
                    Properties: {
                        LogGroupName: 'container-container-phpfpm-createruntask-crot-0-log-group',
                        RetentionInDays: 30
                    },
                    UpdateReplacePolicy: 'Delete',
                    DeletionPolicy: 'Delete'
                })
            }
        ]);
        templateHelper.expected('AWS::EC2::SecurityGroup',  [
            {
                key: 'tasktaskcreateruntask0SecurityGroup',
                properties: Match.objectEquals({
                    Type: 'AWS::EC2::SecurityGroup',
                    Properties: {
                        GroupDescription: 'stack/task-task-createruntask-0/SecurityGroup',
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
        templateHelper.expected('Custom::AWS',  [
            {
                key: 'tasktaskcreateruntask0createfn',
                properties: Match.objectEquals({
                    Type: 'Custom::AWS',
                    Properties: {
                        ServiceToken: {
                            'Fn::GetAtt': [Match.stringLikeRegexp('^AWS.*'), 'Arn']
                        },
                        Create: {
                            'Fn::Join': [
                                '',
                                [
                                    '{"service":"ECS","action":"runTask","physicalResourceId":{"id":"',
                                    {Ref: templateHelper.startsWithMatch('taskdeftaskdefcreateruntask')},
                                    '"},"parameters":{"cluster":"',
                                    {Ref: templateHelper.startsWithMatch('cluster')},
                                    '","taskDefinition":"',
                                    {Ref: templateHelper.startsWithMatch('taskdeftaskdefcreateruntask')},
                                    '","capacityProviderStrategy":[],"launchType":"FARGATE","platformVersion":"LATEST","networkConfiguration":{"awsvpcConfiguration":{"assignPublicIp":"DISABLED","subnets":["p-12345","p-67890"],"securityGroups":["',
                                    {
                                        'Fn::GetAtt': [
                                            templateHelper.startsWithMatch('tasktaskcreateruntask0SecurityGroup'),
                                            'GroupId'
                                        ]
                                    },
                                    '"]}}}}'
                                ]
                            ]
                        },
                        InstallLatestAwsSdk: true
                    },
                    DependsOn: [
                        templateHelper.startsWithMatch('tasktaskcreateruntask0createfnCustomResourcePolicy')
                    ],
                    UpdateReplacePolicy: 'Delete',
                    DeletionPolicy: 'Delete'
                })
            }
        ]);
        templateHelper.expected('AWS::Lambda::Function',  [
            {
                key: '^AWS.*',
                properties: Match.objectEquals({
                    Type: 'AWS::Lambda::Function',
                    Properties: {
                        Code: {
                            S3Bucket: 'cdk-hnb659fds-assets-12344-us-east-1',
                            S3Key: Match.stringLikeRegexp('^.*\.zip')
                        },
                        Role: {
                            'Fn::GetAtt': [
                                Match.stringLikeRegexp('^AWS.*ServiceRole.*'),
                                'Arn'
                            ]
                        },
                        FunctionName: 'create-fn',
                        Handler: 'index.handler',
                        Runtime: 'nodejs14.x',
                        Timeout: 120
                    },
                    DependsOn: [
                        Match.stringLikeRegexp('^AWS.*ServiceRoleDefaultPolicy.*'),
                        Match.stringLikeRegexp('^AWS.*ServiceRole.*')
                    ]
                })
            },
            {
                key: '^LogRetention.*',
                properties: Match.objectEquals({
                    Type: 'AWS::Lambda::Function',
                    Properties: {
                        Handler: 'index.handler',
                        Runtime: 'nodejs14.x',
                        Code: {
                            S3Bucket: 'cdk-hnb659fds-assets-12344-us-east-1',
                            S3Key: Match.stringLikeRegexp('^.*\.zip')
                        },
                        Role: {
                            'Fn::GetAtt': [
                                Match.stringLikeRegexp('^LogRetention.*ServiceRole.*'),
                                'Arn'
                            ]
                        }
                    },
                    DependsOn: [
                        Match.stringLikeRegexp('^LogRetention.*ServiceRoleDefaultPolicy.*'),
                        Match.stringLikeRegexp('^LogRetention.*ServiceRole.*')
                    ]
                })
            }
        ]);
        templateHelper.expected('Custom::LogRetention',  [
            {
                key: '^AWS.*LogRetention.*',
                properties: Match.objectEquals({
                    Type: 'Custom::LogRetention',
                    Properties: {
                        ServiceToken: {
                            'Fn::GetAtt': [templateHelper.startsWithMatch('LogRetention'), 'Arn']
                        },
                        LogGroupName: {
                            'Fn::Join': [
                                '',
                                [
                                    '/aws/lambda/',
                                    {Ref: templateHelper.startsWithMatch('AWS')}
                                ]
                            ]
                        },
                        RetentionInDays: 7
                    }
                })
            }
        ]);
    });

    it('should create run once on update task from defaults', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const vpc = VpcHelper.getVpcById(stack, 'vpcId');
        const cluster = new Cluster(stack, 'cluster', {
            vpc: vpc
        });
        const ecrRepositories = new EcrRepositories('my-repos', ecrRepoProps);
        const taskFactory = new EcsTaskFactory(stack, 'task', {
            cluster: cluster,
            taskDefinitionFactory: new TaskDefinitionFactory(stack, 'task-def', {
                containerFactory: new ContainerFactory(stack, 'container', {
                    repositoryFactory: new EcrRepositoryFactory(stack, 'ecr-repos', ecrRepositories),
                    secrets: new Secrets(stack, 'stack'),
                    commandFactory: new ContainerCommandFactory(stack, 'commands', {})
                })
            })
        });
        const tasks = [
            {
                type: TaskServiceType.UPDATE_RUN_ONCE_TASK,
                taskDefinition: {
                    cpu: '256',
                    memoryMiB: '512',
                    containers: [
                        {
                            type: ContainerType.UPDATE_RUN_ONCE_TASK,
                            image: 'phpfpm',
                            hasSecrets: true,
                            hasEnv: true,
                            cpu: 256,
                            memoryLimitMiB: 512,
                            essential: true,
                            dependsOn: true,
                            entryPoint: ContainerEntryPoint.PHP,
                            command: ContainerCommand.MIGRATE,
                        }
                    ]
                }
            }
        ];
        taskFactory.create(tasks);
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
        templateHelper.expected('AWS::IAM::Role',  [
            {
                key: 'taskdeftaskdefupdateruntask0execrole',
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
                key: 'taskdeftaskdefupdateruntask0TaskRole',
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
                key: '^AWS.*ServiceRole.*',
                properties: Match.objectEquals({
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
                })
            },
            {
                key: '^LogRetention.*ServiceRole.*',
                properties: Match.objectEquals({
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
                })
            }
        ]);
        templateHelper.expected('AWS::IAM::Policy',  [
            {
                key: 'taskdeftaskdefupdateruntask0execroleDefaultPolicy',
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
                                        'Fn::GetAtt': [
                                            templateHelper.startsWithMatch('containercontainerphpfpmupdateruntaskurot0loggroup'),
                                            'Arn'
                                        ]
                                    }
                                }
                            ],
                            Version: '2012-10-17'
                        },
                        PolicyName: templateHelper.startsWithMatch('taskdeftaskdefupdateruntask0execroleDefaultPolicy'),
                        Roles: [{Ref: templateHelper.startsWithMatch('taskdeftaskdefupdateruntask0execrole')}]
                    }
                })
            },
            {
                key: 'tasktaskupdateruntask0updatefnCustomResourcePolicy',
                properties: Match.objectEquals({
                    Type: 'AWS::IAM::Policy',
                    Properties: {
                        PolicyDocument: {
                            Statement: [
                                {
                                    Action: 'ecs:RunTask',
                                    Effect: 'Allow',
                                    Resource: {Ref: templateHelper.startsWithMatch('taskdeftaskdefupdateruntask')}
                                }
                            ],
                            Version: '2012-10-17'
                        },
                        PolicyName: templateHelper.startsWithMatch('tasktaskupdateruntask0updatefnCustomResourcePolicy'),
                        Roles: [
                            {Ref: Match.stringLikeRegexp('^AWS.*ServiceRole.*')}
                        ]
                    }
                })
            },
            {
                key: '^AWS.*ServiceRoleDefaultPolicy.*',
                properties: Match.objectEquals({
                    Type: 'AWS::IAM::Policy',
                    Properties: {
                        PolicyDocument: {
                            Statement: [
                                {
                                    Action: 'iam:PassRole',
                                    Effect: 'Allow',
                                    Resource: {
                                        'Fn::GetAtt': [templateHelper.startsWithMatch('taskdeftaskdefupdateruntask0TaskRole'), 'Arn']
                                    }
                                },
                                {
                                    Action: 'iam:PassRole',
                                    Effect: 'Allow',
                                    Resource: {
                                        'Fn::GetAtt': [templateHelper.startsWithMatch('taskdeftaskdefupdateruntask0execrole'), 'Arn']
                                    }
                                }
                            ],
                            Version: '2012-10-17'
                        },
                        PolicyName: Match.stringLikeRegexp('^AWS.*ServiceRoleDefaultPolicy.*'),
                        Roles: [
                            {Ref: Match.stringLikeRegexp('^AWS.*ServiceRole.*')}
                        ]
                    }
                })
            },
            {
                key: '^LogRetention.*ServiceRoleDefaultPolicy.*',
                properties: Match.objectEquals({
                    Type: 'AWS::IAM::Policy',
                    Properties: {
                        PolicyDocument: {
                            Statement: [
                                {
                                    Action: ['logs:PutRetentionPolicy', 'logs:DeleteRetentionPolicy'],
                                    Effect: 'Allow',
                                    Resource: '*'
                                }
                            ],
                            Version: '2012-10-17'
                        },
                        PolicyName: Match.stringLikeRegexp('^LogRetention.*ServiceRoleDefaultPolicy.*'),
                        Roles: [
                            {
                                Ref: Match.stringLikeRegexp('^LogRetention.*ServiceRole.*')
                            }
                        ]
                    }
                })
            }
        ]);
        templateHelper.expected('AWS::ECS::TaskDefinition',  [
            {
                key: 'taskdeftaskdefupdateruntask',
                properties: Match.objectEquals({
                    Type: 'AWS::ECS::TaskDefinition',
                    Properties: {
                        ContainerDefinitions: [
                            {
                                Command: [
                                    "artisan",
                                    "migrate",
                                    "--force"
                                ],
                                Cpu: 256,
                                EntryPoint: ['/usr/local/bin/php'],
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
                                        'awslogs-group': {
                                            Ref: templateHelper.startsWithMatch('containercontainerphpfpmupdateruntaskurot0loggroup')
                                        },
                                        'awslogs-stream-prefix': 'phpfpm',
                                        'awslogs-region': 'us-east-1'
                                    }
                                },
                                Memory: 512,
                                Name: 'container-container-phpfpm-updateruntask-urot-0',
                                Secrets: []
                            }
                        ],
                        Cpu: '256',
                        ExecutionRoleArn: {
                            'Fn::GetAtt': [templateHelper.startsWithMatch('taskdeftaskdefupdateruntask0execrole'), 'Arn']
                        },
                        Family: 'task-def-task-def-updateruntask-0',
                        Memory: '512',
                        NetworkMode: 'awsvpc',
                        RequiresCompatibilities: ['FARGATE'],
                        TaskRoleArn: {
                            'Fn::GetAtt': [templateHelper.startsWithMatch('taskdeftaskdefupdateruntask0TaskRole'), 'Arn']
                        }
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
                key: 'containercontainerphpfpmupdateruntaskurot0loggroup',
                properties: Match.objectEquals({
                    Type: 'AWS::Logs::LogGroup',
                    Properties: {
                        LogGroupName: 'container-container-phpfpm-updateruntask-urot-0-log-group',
                        RetentionInDays: 30
                    },
                    UpdateReplacePolicy: 'Delete',
                    DeletionPolicy: 'Delete'
                })
            }
        ]);
        templateHelper.expected('AWS::EC2::SecurityGroup',  [
            {
                key: 'tasktaskupdateruntask0SecurityGroup',
                properties: Match.objectEquals({
                    Type: 'AWS::EC2::SecurityGroup',
                    Properties: {
                        GroupDescription: 'stack/task-task-updateruntask-0/SecurityGroup',
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
        templateHelper.expected('Custom::AWS',  [
            {
                key: 'tasktaskupdateruntask0updatefn',
                properties: Match.objectEquals({
                    Type: 'Custom::AWS',
                    Properties: {
                        ServiceToken: {
                            'Fn::GetAtt': [Match.stringLikeRegexp('^AWS.*'), 'Arn']
                        },
                        Create: {
                            'Fn::Join': [
                                '',
                                [
                                    '{"service":"ECS","action":"runTask","physicalResourceId":{"id":"',
                                    {Ref: templateHelper.startsWithMatch('taskdeftaskdefupdateruntask')},
                                    '"},"parameters":{"cluster":"',
                                    {Ref: templateHelper.startsWithMatch('cluster')},
                                    '","taskDefinition":"',
                                    {Ref: templateHelper.startsWithMatch('taskdeftaskdefupdateruntask')},
                                    '","capacityProviderStrategy":[],"launchType":"FARGATE","platformVersion":"LATEST","networkConfiguration":{"awsvpcConfiguration":{"assignPublicIp":"DISABLED","subnets":["p-12345","p-67890"],"securityGroups":["',
                                    {
                                        'Fn::GetAtt': [
                                            templateHelper.startsWithMatch('tasktaskupdateruntask0SecurityGroup'),
                                            'GroupId'
                                        ]
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
                                    {Ref: templateHelper.startsWithMatch('taskdeftaskdefupdateruntask')},
                                    '"},"parameters":{"cluster":"',
                                    {Ref: templateHelper.startsWithMatch('cluster')},
                                    '","taskDefinition":"',
                                    {Ref: templateHelper.startsWithMatch('taskdeftaskdefupdateruntask')},
                                    '","capacityProviderStrategy":[],"launchType":"FARGATE","platformVersion":"LATEST","networkConfiguration":{"awsvpcConfiguration":{"assignPublicIp":"DISABLED","subnets":["p-12345","p-67890"],"securityGroups":["',
                                    {
                                        'Fn::GetAtt': [
                                            templateHelper.startsWithMatch('tasktaskupdateruntask0SecurityGroup'),
                                            'GroupId'
                                        ]
                                    },
                                    '"]}}}}'
                                ]
                            ]
                        },
                        InstallLatestAwsSdk: true
                    },
                    DependsOn: [
                        templateHelper.startsWithMatch('tasktaskupdateruntask0updatefnCustomResourcePolicy')
                    ],
                    UpdateReplacePolicy: 'Delete',
                    DeletionPolicy: 'Delete'
                })
            }
        ]);
        templateHelper.expected('AWS::Lambda::Function',  [
            {
                key: '^AWS.*',
                properties: Match.objectEquals({
                    Type: 'AWS::Lambda::Function',
                    Properties: {
                        Code: {
                            S3Bucket: 'cdk-hnb659fds-assets-12344-us-east-1',
                            S3Key: Match.stringLikeRegexp('^.*\.zip')
                        },
                        Role: {
                            'Fn::GetAtt': [
                                Match.stringLikeRegexp('^AWS.*ServiceRole.*'),
                                'Arn'
                            ]
                        },
                        FunctionName: 'update-fn',
                        Handler: 'index.handler',
                        Runtime: 'nodejs14.x',
                        Timeout: 120
                    },
                    DependsOn: [
                        Match.stringLikeRegexp('^AWS.*ServiceRoleDefaultPolicy.*'),
                        Match.stringLikeRegexp('^AWS.*ServiceRole.*')
                    ]
                })
            },
            {
                key: '^LogRetention.*',
                properties: Match.objectEquals({
                    Type: 'AWS::Lambda::Function',
                    Properties: {
                        Handler: 'index.handler',
                        Runtime: 'nodejs14.x',
                        Code: {
                            S3Bucket: 'cdk-hnb659fds-assets-12344-us-east-1',
                            S3Key: Match.stringLikeRegexp('^.*\.zip')
                        },
                        Role: {
                            'Fn::GetAtt': [
                                Match.stringLikeRegexp('^LogRetention.*ServiceRole.*'),
                                'Arn'
                            ]
                        }
                    },
                    DependsOn: [
                        Match.stringLikeRegexp('^LogRetention.*ServiceRoleDefaultPolicy.*'),
                        Match.stringLikeRegexp('^LogRetention.*ServiceRole.*')
                    ]
                })
            }
        ]);
        templateHelper.expected('Custom::LogRetention',  [
            {
                key: '^AWS.*LogRetention.*',
                properties: Match.objectEquals({
                    Type: 'Custom::LogRetention',
                    Properties: {
                        ServiceToken: {
                            'Fn::GetAtt': [templateHelper.startsWithMatch('LogRetention'), 'Arn']
                        },
                        LogGroupName: {
                            'Fn::Join': [
                                '',
                                [
                                    '/aws/lambda/',
                                    {Ref: templateHelper.startsWithMatch('AWS')}
                                ]
                            ]
                        },
                        RetentionInDays: 7
                    }
                })
            }
        ]);
    });
});