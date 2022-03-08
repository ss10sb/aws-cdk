import {App, Stack} from "aws-cdk-lib";
import {Compatibility, TaskDefinition} from "aws-cdk-lib/aws-ecs";
import {ContainerCommandFactory, ContainerFactory, ContainerType, TaskServiceType} from "../../src/ecs";
import {EcrRepositories, EcrRepositoryFactory, EcrRepositoryType} from "../../src/ecr";
import {Secrets} from "../../src/secret";
import {Match, Template} from "aws-cdk-lib/assertions";
import {TemplateHelper} from "../../src/utils/testing";

const ecrRepoProps = {
    repositories: [EcrRepositoryType.NGINX, EcrRepositoryType.PHPFPM]
};

describe('container factory', () => {

    it('should create web service container with defaults', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const td = new TaskDefinition(stack, 'td', {
            compatibility: Compatibility.FARGATE,
            cpu: '256',
            memoryMiB: '512'
        });
        const ecrRepositories = new EcrRepositories('my-repos', ecrRepoProps);
        const containerFactory = new ContainerFactory(stack, 'container', {
            commandFactory: new ContainerCommandFactory(stack, 'command', {}),
            repositoryFactory: new EcrRepositoryFactory(stack, 'repos', ecrRepositories),
            secrets: new Secrets(stack, 'secrets')
        });
        const containerProps = [
            {
                image: EcrRepositoryType.PHPFPM,
                cpu: 256,
                memoryLimitMiB: 512
            }
        ];
        containerFactory.create(TaskServiceType.WEB_SERVICE, td, containerProps);
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        templateHelper.expected('AWS::IAM::Role',  [
            {
                key: 'tdTaskRole',
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
                key: 'tdExecutionRole',
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
        const containerRefMatch = templateHelper.startsWithMatch("phpfpmecr");
        templateHelper.expected('AWS::ECS::TaskDefinition',  [
            {
                key: 'td',
                properties: Match.objectEquals({
                    Type: 'AWS::ECS::TaskDefinition',
                    Properties: {
                        ContainerDefinitions: [
                            {
                                Cpu: 256,
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
                                                            {'Fn::GetAtt': [containerRefMatch, 'Arn']}
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
                                                            {'Fn::GetAtt': [containerRefMatch, 'Arn']}
                                                        ]
                                                    }
                                                ]
                                            },
                                            '.',
                                            {Ref: 'AWS::URLSuffix'},
                                            '/',
                                            {Ref: containerRefMatch},
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
                                Memory: 512,
                                Name: 'container-container-phpfpm-web-u-0',
                                Secrets: []
                            }
                        ],
                        Cpu: '256',
                        ExecutionRoleArn: {'Fn::GetAtt': [templateHelper.startsWithMatch('tdExecutionRole'), 'Arn']},
                        Family: templateHelper.startsWithMatch('stacktd'),
                        Memory: '512',
                        NetworkMode: 'awsvpc',
                        RequiresCompatibilities: ['FARGATE'],
                        TaskRoleArn: {'Fn::GetAtt': [templateHelper.startsWithMatch('tdTaskRole'), 'Arn']}
                    }
                })
            }
        ]);
        templateHelper.expected('AWS::IAM::Policy',  [
            {
                key: 'tdExecutionRoleDefaultPolicy',
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
                                    Resource: {'Fn::GetAtt': [containerRefMatch, 'Arn']}
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
                                        'Fn::GetAtt': [templateHelper.startsWithMatch('containercontainerphpfpmwebu0loggroup'), 'Arn']
                                    }
                                }
                            ],
                            Version: '2012-10-17'
                        },
                        PolicyName: templateHelper.startsWithMatch('tdExecutionRoleDefaultPolicy'),
                        Roles: [{Ref: templateHelper.startsWithMatch('tdExecutionRole')}]
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
    });

    it('should create run once task container with defaults', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const td = new TaskDefinition(stack, 'td', {
            compatibility: Compatibility.FARGATE,
            cpu: '256',
            memoryMiB: '512'
        });
        const ecrRepositories = new EcrRepositories('my-repos', ecrRepoProps);
        const containerFactory = new ContainerFactory(stack, 'container', {
            commandFactory: new ContainerCommandFactory(stack, 'command', {}),
            repositoryFactory: new EcrRepositoryFactory(stack, 'repos', ecrRepositories),
            secrets: new Secrets(stack, 'secrets')
        });
        const containerProps = [
            {
                image: EcrRepositoryType.PHPFPM,
                cpu: 256,
                memoryLimitMiB: 512
            }
        ];
        containerFactory.create(TaskServiceType.CREATE_RUN_ONCE_TASK, td, containerProps);
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        templateHelper.expected('AWS::IAM::Role',  [
            {
                key: 'tdTaskRole',
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
                key: 'tdExecutionRole',
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
        const containerRefMatch = templateHelper.startsWithMatch("phpfpmecr");
        templateHelper.expected('AWS::ECS::TaskDefinition',  [
            {
                key: 'td',
                properties: Match.objectEquals({
                    Type: 'AWS::ECS::TaskDefinition',
                    Properties: {
                        ContainerDefinitions: [
                            {
                                Cpu: 256,
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
                                                            {'Fn::GetAtt': [containerRefMatch, 'Arn']}
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
                                                            {'Fn::GetAtt': [containerRefMatch, 'Arn']}
                                                        ]
                                                    }
                                                ]
                                            },
                                            '.',
                                            {Ref: 'AWS::URLSuffix'},
                                            '/',
                                            {Ref: containerRefMatch},
                                            ':1'
                                        ]
                                    ]
                                },
                                LogConfiguration: {
                                    LogDriver: 'awslogs',
                                    Options: {
                                        'awslogs-group': {
                                            Ref: templateHelper.startsWithMatch('containercontainerphpfpmcreateruntasku0loggroup')
                                        },
                                        'awslogs-stream-prefix': 'phpfpm',
                                        'awslogs-region': 'us-east-1'
                                    }
                                },
                                Memory: 512,
                                Name: 'container-container-phpfpm-createruntask-u-0',
                                Secrets: []
                            }
                        ],
                        Cpu: '256',
                        ExecutionRoleArn: {'Fn::GetAtt': [templateHelper.startsWithMatch('tdExecutionRole'), 'Arn']},
                        Family: 'stacktd2794DBE0',
                        Memory: '512',
                        NetworkMode: 'awsvpc',
                        RequiresCompatibilities: ['FARGATE'],
                        TaskRoleArn: {'Fn::GetAtt': [templateHelper.startsWithMatch('tdTaskRole'), 'Arn']}
                    }
                })
            }
        ]);
        templateHelper.expected('AWS::IAM::Policy',  [
            {
                key: 'tdExecutionRoleDefaultPolicy',
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
                                    Resource: {'Fn::GetAtt': [containerRefMatch, 'Arn']}
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
                                            templateHelper.startsWithMatch('containercontainerphpfpmcreateruntasku0loggroup'),
                                            'Arn'
                                        ]
                                    }
                                }
                            ],
                            Version: '2012-10-17'
                        },
                        PolicyName: templateHelper.startsWithMatch('tdExecutionRoleDefaultPolicy'),
                        Roles: [{Ref: templateHelper.startsWithMatch('tdExecutionRole')}]
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
                key: 'containercontainerphpfpmcreateruntasku0loggroup',
                properties: Match.objectEquals({
                    Type: 'AWS::Logs::LogGroup',
                    Properties: {
                        LogGroupName: 'container-container-phpfpm-createruntask-u-0-log-group',
                        RetentionInDays: 30
                    },
                    UpdateReplacePolicy: 'Delete',
                    DeletionPolicy: 'Delete'
                })
            }
        ]);
    });

    it('should create scheduled task container with defaults', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const td = new TaskDefinition(stack, 'td', {
            compatibility: Compatibility.FARGATE,
            cpu: '256',
            memoryMiB: '512'
        });
        const ecrRepositories = new EcrRepositories('my-repos', ecrRepoProps);
        const containerFactory = new ContainerFactory(stack, 'container', {
            commandFactory: new ContainerCommandFactory(stack, 'command', {}),
            repositoryFactory: new EcrRepositoryFactory(stack, 'repos', ecrRepositories),
            secrets: new Secrets(stack, 'secrets')
        });
        const containerProps = [
            {
                image: EcrRepositoryType.PHPFPM,
                cpu: 256,
                memoryLimitMiB: 512
            }
        ];
        containerFactory.create(TaskServiceType.SCHEDULED_TASK, td, containerProps);
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        templateHelper.expected('AWS::IAM::Role',  [
            {
                key: 'tdTaskRole',
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
                key: 'tdExecutionRole',
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
        const containerRefMatch = templateHelper.startsWithMatch("phpfpmecr");
        templateHelper.expected('AWS::ECS::TaskDefinition',  [
            {
                key: 'td',
                properties: Match.objectEquals({
                    Type: 'AWS::ECS::TaskDefinition',
                    Properties: {
                        ContainerDefinitions: [
                            {
                                Cpu: 256,
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
                                                            {'Fn::GetAtt': [containerRefMatch, 'Arn']}
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
                                                            {'Fn::GetAtt': [containerRefMatch, 'Arn']}
                                                        ]
                                                    }
                                                ]
                                            },
                                            '.',
                                            {Ref: 'AWS::URLSuffix'},
                                            '/',
                                            {Ref: containerRefMatch},
                                            ':1'
                                        ]
                                    ]
                                },
                                LogConfiguration: {
                                    LogDriver: 'awslogs',
                                    Options: {
                                        'awslogs-group': {Ref: templateHelper.startsWithMatch('containercontainerphpfpmscheduledtasku0loggroup')},
                                        'awslogs-stream-prefix': 'phpfpm',
                                        'awslogs-region': 'us-east-1'
                                    }
                                },
                                Memory: 512,
                                Name: 'container-container-phpfpm-scheduledtask-u-0',
                                Secrets: []
                            }
                        ],
                        Cpu: '256',
                        ExecutionRoleArn: {'Fn::GetAtt': [templateHelper.startsWithMatch('tdExecutionRole'), 'Arn']},
                        Family: templateHelper.startsWithMatch('stacktd'),
                        Memory: '512',
                        NetworkMode: 'awsvpc',
                        RequiresCompatibilities: ['FARGATE'],
                        TaskRoleArn: {'Fn::GetAtt': [templateHelper.startsWithMatch('tdTaskRole'), 'Arn']}
                    }
                })
            }
        ]);
        templateHelper.expected('AWS::IAM::Policy',  [
            {
                key: 'tdExecutionRoleDefaultPolicy',
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
                                    Resource: {'Fn::GetAtt': [containerRefMatch, 'Arn']}
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
                                        'Fn::GetAtt': [templateHelper.startsWithMatch('containercontainerphpfpmscheduledtasku0loggroup'), 'Arn']
                                    }
                                }
                            ],
                            Version: '2012-10-17'
                        },
                        PolicyName: templateHelper.startsWithMatch('tdExecutionRoleDefaultPolicy'),
                        Roles: [{Ref: templateHelper.startsWithMatch('tdExecutionRole')}]
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
                key: 'containercontainerphpfpmscheduledtasku0loggroup',
                properties: Match.objectEquals({
                    Type: 'AWS::Logs::LogGroup',
                    Properties: {
                        LogGroupName: 'container-container-phpfpm-scheduledtask-u-0-log-group',
                        RetentionInDays: 30
                    },
                    UpdateReplacePolicy: 'Delete',
                    DeletionPolicy: 'Delete'
                })
            }
        ]);
    });

    it('should not create scheduled task container when container type is service', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const td = new TaskDefinition(stack, 'td', {
            compatibility: Compatibility.FARGATE,
            cpu: '256',
            memoryMiB: '512'
        });
        const ecrRepositories = new EcrRepositories('my-repos', ecrRepoProps);
        const containerFactory = new ContainerFactory(stack, 'container', {
            commandFactory: new ContainerCommandFactory(stack, 'command', {}),
            repositoryFactory: new EcrRepositoryFactory(stack, 'repos', ecrRepositories),
            secrets: new Secrets(stack, 'secrets')
        });
        containerFactory.props.repositoryFactory.create();
        const containerProps = [
            {
                image: EcrRepositoryType.PHPFPM,
                cpu: 256,
                memoryLimitMiB: 512,
                type: ContainerType.SERVICE
            }
        ];
        containerFactory.create(TaskServiceType.SCHEDULED_TASK, td, containerProps);
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        templateHelper.expected('AWS::IAM::Role',  [
            {
                key: 'tdTaskRole',
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
        templateHelper.expected('AWS::ECS::TaskDefinition',  [
            {
                key: 'td',
                properties: Match.objectEquals({
                    Type: 'AWS::ECS::TaskDefinition',
                    Properties: {
                        Cpu: '256',
                        Family: templateHelper.startsWithMatch('stacktd'),
                        Memory: '512',
                        NetworkMode: 'awsvpc',
                        RequiresCompatibilities: ['FARGATE'],
                        TaskRoleArn: {'Fn::GetAtt': [templateHelper.startsWithMatch('tdTaskRole'), 'Arn']}
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
        template.resourceCountIs('AWS::IAM::Policy', 0);
        template.resourceCountIs('AWS::Logs::LogGroup', 0);
    });

    it('should create web service container with secrets and environment variables', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const td = new TaskDefinition(stack, 'td', {
            compatibility: Compatibility.FARGATE,
            cpu: '256',
            memoryMiB: '512'
        });
        const ecrRepositories = new EcrRepositories('my-repos', ecrRepoProps);
        const containerFactory = new ContainerFactory(stack, 'container', {
            commandFactory: new ContainerCommandFactory(stack, 'command', {}),
            repositoryFactory: new EcrRepositoryFactory(stack, 'repos', ecrRepositories),
            secrets: new Secrets(stack, 'secrets'),
            secretKeys: ['FOO', 'BAR'],
            environment: {
                BIZ: 'buz'
            }
        });
        const containerProps = [
            {
                image: EcrRepositoryType.PHPFPM,
                cpu: 256,
                memoryLimitMiB: 512,
                hasSecrets: true,
                hasEnv: true
            }
        ];
        containerFactory.create(TaskServiceType.WEB_SERVICE, td, containerProps);
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        templateHelper.expected('AWS::IAM::Role',  [
            {
                key: 'tdTaskRole',
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
                key: 'tdExecutionRole',
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
        const containerRefMatch = templateHelper.startsWithMatch("phpfpmecr");
        templateHelper.expected('AWS::ECS::TaskDefinition',  [
            {
                key: 'td',
                properties: Match.objectEquals({
                    Type: 'AWS::ECS::TaskDefinition',
                    Properties: {
                        ContainerDefinitions: [
                            {
                                Cpu: 256,
                                Environment: [{Name: 'BIZ', Value: 'buz'}],
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
                                                            {'Fn::GetAtt': [containerRefMatch, 'Arn']}
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
                                                            {'Fn::GetAtt': [containerRefMatch, 'Arn']}
                                                        ]
                                                    }
                                                ]
                                            },
                                            '.',
                                            {Ref: 'AWS::URLSuffix'},
                                            '/',
                                            {Ref: containerRefMatch},
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
                                Memory: 512,
                                Name: 'container-container-phpfpm-web-u-0',
                                Secrets: [
                                    {
                                        Name: 'FOO',
                                        ValueFrom: {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    'arn:',
                                                    {Ref: 'AWS::Partition'},
                                                    ':secretsmanager:us-east-1:12344:secret:secrets-secrets/environment:FOO::'
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
                                                    {Ref: 'AWS::Partition'},
                                                    ':secretsmanager:us-east-1:12344:secret:secrets-secrets/environment:BAR::'
                                                ]
                                            ]
                                        }
                                    }
                                ]
                            }
                        ],
                        Cpu: '256',
                        ExecutionRoleArn: {'Fn::GetAtt': [templateHelper.startsWithMatch('tdExecutionRole'), 'Arn']},
                        Family: templateHelper.startsWithMatch('stacktd'),
                        Memory: '512',
                        NetworkMode: 'awsvpc',
                        RequiresCompatibilities: ['FARGATE'],
                        TaskRoleArn: {'Fn::GetAtt': [templateHelper.startsWithMatch('tdTaskRole'), 'Arn']}
                    }
                })
            }
        ]);
        templateHelper.expected('AWS::IAM::Policy',  [
            {
                key: 'tdExecutionRoleDefaultPolicy',
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
                                    Resource: {'Fn::GetAtt': [containerRefMatch, 'Arn']}
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
                                        'Fn::GetAtt': [templateHelper.startsWithMatch('containercontainerphpfpmwebu0loggroup'), 'Arn']
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
                                                {Ref: 'AWS::Partition'},
                                                ':secretsmanager:us-east-1:12344:secret:secrets-secrets/environment-??????'
                                            ]
                                        ]
                                    }
                                }
                            ],
                            Version: '2012-10-17'
                        },
                        PolicyName: templateHelper.startsWithMatch('tdExecutionRoleDefaultPolicy'),
                        Roles: [{Ref: templateHelper.startsWithMatch('tdExecutionRole')}]
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
    });
});