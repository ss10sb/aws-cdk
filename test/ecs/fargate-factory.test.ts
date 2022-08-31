import {resetStaticProps} from "../../src/utils/reset-static-props";
import {Match, Template} from "aws-cdk-lib/assertions";
import {App, Stack} from "aws-cdk-lib";
import {ClusterFactory} from "../../src/ecs/cluster-factory";
import {ContainerCommand, ContainerEntryPoint} from "../../src/ecs/container-command-factory";
import {ScalableTypes, TaskServiceType} from "../../src/ecs/task-definitions";
import {Secrets} from "../../src/secret/secrets";
import {ContainerType} from "../../src/ecs/container-definitions";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {ConfigEnvironments} from "../../src/config/config-definitions";
import {EcrRepositoryType} from "../../src/ecr/ecr-definitions";
import {FargateFactory} from "../../src/ecs/fargate-factory";
import {EcrRepositories} from "../../src/ecr/ecr-repositories";
import {EnvConfig} from "../../src/env/env-base-stack";
import {EcrRepositoryFactory} from "../../src/ecr/ecr-repository-factory";
import {AlbTargetGroup} from "../../src/alb/alb-target-group";
import {VpcHelper} from "../../src/utils/vpc-helper";

const ecrRepoProps = {
    repositories: [EcrRepositoryType.NGINX, EcrRepositoryType.PHPFPM]
};

describe('fargate factory', () => {

    beforeEach(() => {
        resetStaticProps();
    });

    it('should create fargate deployment', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const secretKeys = ['FOO', 'BAR'];
        const environment = {
            FIZZ: 'buzz'
        };
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
        const ecrRepositories = new EcrRepositories('stack', ecrRepoProps);
        const ecrRepositoryFactory = new EcrRepositoryFactory(stack, 'stack', ecrRepositories);
        const secrets = new Secrets(stack, 'stack');
        const vpc = VpcHelper.getVpcById(stack, 'vpcId');
        const clusterFactory = new ClusterFactory(stack, 'stack', {
            vpc: vpc
        });
        const cluster = clusterFactory.create();
        const albTargetGroup = new AlbTargetGroup(stack, 'target-group', vpc);
        const targetGroup = albTargetGroup.create(envConfig.Parameters.targetGroup ?? {});
        const fargateFactory = new FargateFactory(stack, 'stack', {
            commandFactoryProps: {},
            containerFactoryProps: {
                repositoryFactory: ecrRepositoryFactory,
                secretKeys: secretKeys,
                environment: environment,
                secrets: secrets
            },
            queueFactoryProps: {
                cluster: cluster,
                repositoryFactory: ecrRepositoryFactory,
                secretKeys: secretKeys,
                environment: environment,
                secrets: secrets
            },
            standardServiceFactoryProps: {
                cluster: cluster,
                targetGroup: targetGroup
            },
            taskDefinitionFactoryProps: {},
            taskFactoryProps: {
                cluster: cluster,
                skipCreateTask: false
            }
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
            },
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
        const queue = {
            type: TaskServiceType.QUEUE_SERVICE,
            image: 'phpfpm',
            hasSecrets: true,
            hasEnv: true,
            cpu: 256,
            memoryLimitMiB: 512,
            hasDeadLetterQueue: true,
        };
        fargateFactory.create(tasks, services, queue);
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        const phpfpmContainerRef = templateHelper.startsWithMatch('phpfpmecr');
        const nginxContainerRef = templateHelper.startsWithMatch('nginxecr');
        templateHelper.expected('AWS::ECS::Cluster',  [
            {
                key: '^stackcluster.*',
                properties: Match.objectEquals({
                    "Type": "AWS::ECS::Cluster",
                    "Properties": {
                        "ClusterName": "stack-cluster",
                        "ClusterSettings": [
                            {
                                "Name": "containerInsights",
                                "Value": "disabled"
                            }
                        ]
                    }
                }),
            }
        ]);
        templateHelper.expected('AWS::ElasticLoadBalancingV2::TargetGroup',  [
            {
                key: "^targetgroup.*",
                properties: Match.objectEquals({
                    "Type": "AWS::ElasticLoadBalancingV2::TargetGroup",
                    "Properties": {
                        "Name": "target-group",
                        "Port": 80,
                        "Protocol": "HTTP",
                        "TargetGroupAttributes": [
                            {
                                "Key": "stickiness.enabled",
                                "Value": "false"
                            }
                        ],
                        "TargetType": "ip",
                        "VpcId": "vpc-12345"
                    }
                })
            }
        ]);
        templateHelper.expected('AWS::IAM::Role',  [
            {
                key: 'stacktaskdefcreateruntask0execrole',
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
                key: 'stacktaskdefcreateruntask0TaskRole',
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
            },
            {
                key: 'stacktaskdefupdateruntask0execrole',
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
                key: 'stacktaskdefupdateruntask0TaskRole',
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
                key: 'stacktaskdefweb0execrole',
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
                key: 'stacktaskdefweb0TaskRole',
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
                key: 'stackservicequeue0QueueProcessingTaskDefTaskRole',
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
                key: 'stackservicequeue0QueueProcessingTaskDefExecutionRole',
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
                key: 'stacktaskdefcreateruntask0execroleDefaultPolicy',
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
                                    Resource: {'Fn::GetAtt': [phpfpmContainerRef, 'Arn']}
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
                                            templateHelper.startsWithMatch('stackcontainerphpfpmcreateruntaskcrot0loggroup'),
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
                                                {Ref: 'AWS::Partition'},
                                                ':secretsmanager:us-east-1:12344:secret:stack-secrets/environment-??????'
                                            ]
                                        ]
                                    }
                                }
                            ],
                            Version: '2012-10-17'
                        },
                        PolicyName: templateHelper.startsWithMatch('stacktaskdefcreateruntask0execroleDefaultPolicy'),
                        Roles: [{Ref: templateHelper.startsWithMatch('stacktaskdefcreateruntask0execrole')}]
                    }
                })
            },
            {
                key: 'stacktaskcreateruntask0createfnCustomResourcePolicy',
                properties: Match.objectEquals({
                    Type: 'AWS::IAM::Policy',
                    Properties: {
                        PolicyDocument: {
                            Statement: [
                                {
                                    Action: 'ecs:RunTask',
                                    Effect: 'Allow',
                                    Resource: {Ref: templateHelper.startsWithMatch('stacktaskdefcreateruntask')}
                                }
                            ],
                            Version: '2012-10-17'
                        },
                        PolicyName: templateHelper.startsWithMatch('stacktaskcreateruntask0createfnCustomResourcePolicy'),
                        Roles: [
                            {
                                Ref: Match.stringLikeRegexp('^AWS.*ServiceRole.*')
                            }
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
                                        'Fn::GetAtt': [templateHelper.startsWithMatch('stacktaskdefcreateruntask0TaskRole'), 'Arn']
                                    }
                                },
                                {
                                    Action: 'iam:PassRole',
                                    Effect: 'Allow',
                                    Resource: {
                                        'Fn::GetAtt': [templateHelper.startsWithMatch('stacktaskdefcreateruntask0execrole'), 'Arn']
                                    }
                                },
                                {
                                    Action: 'iam:PassRole',
                                    Effect: 'Allow',
                                    Resource: {
                                        'Fn::GetAtt': [templateHelper.startsWithMatch('stacktaskdefupdateruntask0TaskRole'), 'Arn']
                                    }
                                },
                                {
                                    Action: 'iam:PassRole',
                                    Effect: 'Allow',
                                    Resource: {
                                        'Fn::GetAtt': [templateHelper.startsWithMatch('stacktaskdefupdateruntask0execrole'), 'Arn']
                                    }
                                }
                            ],
                            Version: '2012-10-17'
                        },
                        PolicyName: Match.stringLikeRegexp('^AWS.*ServiceRoleDefaultPolicy.*'),
                        Roles: [
                            {
                                Ref: Match.stringLikeRegexp('AWS.*')
                            }
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
                                Ref: Match.stringLikeRegexp('LogRetention.*ServiceRole.*')
                            }
                        ]
                    }
                })
            },
            {
                key: 'stacktaskdefupdateruntask0execroleDefaultPolicy',
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
                                    Resource: {'Fn::GetAtt': [phpfpmContainerRef, 'Arn']}
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
                                            templateHelper.startsWithMatch('stackcontainerphpfpmupdateruntaskurot0loggroup'),
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
                                                {Ref: 'AWS::Partition'},
                                                ':secretsmanager:us-east-1:12344:secret:stack-secrets/environment-??????'
                                            ]
                                        ]
                                    }
                                }
                            ],
                            Version: '2012-10-17'
                        },
                        PolicyName: templateHelper.startsWithMatch('stacktaskdefupdateruntask0execroleDefaultPolicy'),
                        Roles: [{Ref: templateHelper.startsWithMatch('stacktaskdefupdateruntask0execrole')}]
                    }
                })
            },
            {
                key: 'stacktaskupdateruntask0updatefnCustomResourcePolicy',
                properties: Match.objectEquals({
                    Type: 'AWS::IAM::Policy',
                    Properties: {
                        PolicyDocument: {
                            Statement: [
                                {
                                    Action: 'ecs:RunTask',
                                    Effect: 'Allow',
                                    Resource: {Ref: templateHelper.startsWithMatch('stacktaskdefupdateruntask')}
                                }
                            ],
                            Version: '2012-10-17'
                        },
                        PolicyName: templateHelper.startsWithMatch('stacktaskupdateruntask0updatefnCustomResourcePolicy'),
                        Roles: [
                            {
                                Ref: Match.stringLikeRegexp('^AWS.*')
                            }
                        ]
                    }
                })
            },
            {
                key: 'stacktaskdefweb0execroleDefaultPolicy',
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
                                    Resource: {'Fn::GetAtt': [nginxContainerRef, 'Arn']}
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
                                        'Fn::GetAtt': [templateHelper.startsWithMatch('stackcontainernginxwebu0loggroup'), 'Arn']
                                    }
                                },
                                {
                                    Action: [
                                        'ecr:BatchCheckLayerAvailability',
                                        'ecr:GetDownloadUrlForLayer',
                                        'ecr:BatchGetImage'
                                    ],
                                    Effect: 'Allow',
                                    Resource: {'Fn::GetAtt': [phpfpmContainerRef, 'Arn']}
                                },
                                {
                                    Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
                                    Effect: 'Allow',
                                    Resource: {
                                        'Fn::GetAtt': [templateHelper.startsWithMatch('stackcontainerphpfpmwebu0loggroup'), 'Arn']
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
                                                ':secretsmanager:us-east-1:12344:secret:stack-secrets/environment-??????'
                                            ]
                                        ]
                                    }
                                }
                            ],
                            Version: '2012-10-17'
                        },
                        PolicyName: templateHelper.startsWithMatch('stacktaskdefweb0execroleDefaultPolicy'),
                        Roles: [{Ref: templateHelper.startsWithMatch('stacktaskdefweb0execrole')}]
                    }
                })
            },
            {
                key: 'stacktaskdefweb0TaskRoleDefaultPolicy',
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
                        PolicyName: templateHelper.startsWithMatch('stacktaskdefweb0TaskRoleDefaultPolicy'),
                        Roles: [{Ref: templateHelper.startsWithMatch('stacktaskdefweb0TaskRole')}]
                    }
                })
            },
            {
                key: 'stackservicequeue0QueueProcessingTaskDefTaskRoleDefaultPolicy',
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
                                        'Fn::GetAtt': [templateHelper.startsWithMatch('stackservicequeue0EcsProcessingQueue'), 'Arn']
                                    }
                                }
                            ],
                            Version: '2012-10-17'
                        },
                        PolicyName: templateHelper.startsWithMatch('stackservicequeue0QueueProcessingTaskDefTaskRoleDefaultPolicy'),
                        Roles: [
                            {
                                Ref: templateHelper.startsWithMatch('stackservicequeue0QueueProcessingTaskDefTaskRole')
                            }
                        ]
                    }
                })
            },
            {
                key: 'stackservicequeue0QueueProcessingTaskDefExecutionRoleDefaultPolicy',
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
                                    Resource: {'Fn::GetAtt': [phpfpmContainerRef, 'Arn']}
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
                                        'Fn::GetAtt': [templateHelper.startsWithMatch('stackservicequeue0loggroup'), 'Arn']
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
                                                ':secretsmanager:us-east-1:12344:secret:stack-secrets/environment-??????'
                                            ]
                                        ]
                                    }
                                }
                            ],
                            Version: '2012-10-17'
                        },
                        PolicyName: templateHelper.startsWithMatch('stackservicequeue0QueueProcessingTaskDefExecutionRoleDefaultPolicy'),
                        Roles: [
                            {
                                Ref: templateHelper.startsWithMatch('stackservicequeue0QueueProcessingTaskDefExecutionRole')
                            }
                        ]
                    }
                })
            }
        ]);
        templateHelper.expected('AWS::ECS::TaskDefinition',  [
            {
                key: 'stacktaskdefcreateruntask',
                properties: Match.objectEquals({
                    Type: 'AWS::ECS::TaskDefinition',
                    Properties: {
                        ContainerDefinitions: [
                            {
                                Command: ['/on_create.sh'],
                                Cpu: 256,
                                EntryPoint: ['/bin/sh', '-c'],
                                Environment: [{Name: 'FIZZ', Value: 'buzz'}],
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
                                                                'Fn::GetAtt': [phpfpmContainerRef, 'Arn']
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
                                                                'Fn::GetAtt': [phpfpmContainerRef, 'Arn']
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            '.',
                                            {Ref: 'AWS::URLSuffix'},
                                            '/',
                                            {Ref: phpfpmContainerRef},
                                            ':1'
                                        ]
                                    ]
                                },
                                LogConfiguration: {
                                    LogDriver: 'awslogs',
                                    Options: {
                                        'awslogs-group': {
                                            Ref: templateHelper.startsWithMatch('stackcontainerphpfpmcreateruntaskcrot0loggroup')
                                        },
                                        'awslogs-stream-prefix': 'phpfpm',
                                        'awslogs-region': 'us-east-1'
                                    }
                                },
                                Memory: 512,
                                Name: 'stack-container-phpfpm-createruntask-crot-0',
                                Secrets: [
                                    {
                                        Name: 'FOO',
                                        ValueFrom: {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    'arn:',
                                                    {Ref: 'AWS::Partition'},
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
                                                    {Ref: 'AWS::Partition'},
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
                            'Fn::GetAtt': [templateHelper.startsWithMatch('stacktaskdefcreateruntask0execrole'), 'Arn']
                        },
                        Family: 'stack-task-def-createruntask-0',
                        Memory: '512',
                        NetworkMode: 'awsvpc',
                        RequiresCompatibilities: ['FARGATE'],
                        TaskRoleArn: {
                            'Fn::GetAtt': [templateHelper.startsWithMatch('stacktaskdefcreateruntask0TaskRole'), 'Arn']
                        }
                    }
                })
            },
            {
                key: 'stacktaskdefupdateruntask',
                properties: Match.objectEquals({
                    Type: 'AWS::ECS::TaskDefinition',
                    Properties: {
                        ContainerDefinitions: [
                            {
                                Command: ['artisan', 'migrate', '--force'],
                                Cpu: 256,
                                EntryPoint: ['/usr/local/bin/php'],
                                Environment: [{Name: 'FIZZ', Value: 'buzz'}],
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
                                                                'Fn::GetAtt': [phpfpmContainerRef, 'Arn']
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
                                                                'Fn::GetAtt': [phpfpmContainerRef, 'Arn']
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            '.',
                                            {Ref: 'AWS::URLSuffix'},
                                            '/',
                                            {Ref: phpfpmContainerRef},
                                            ':1'
                                        ]
                                    ]
                                },
                                LogConfiguration: {
                                    LogDriver: 'awslogs',
                                    Options: {
                                        'awslogs-group': {
                                            Ref: templateHelper.startsWithMatch('stackcontainerphpfpmupdateruntaskurot0loggroup')
                                        },
                                        'awslogs-stream-prefix': 'phpfpm',
                                        'awslogs-region': 'us-east-1'
                                    }
                                },
                                Memory: 512,
                                Name: 'stack-container-phpfpm-updateruntask-urot-0',
                                Secrets: [
                                    {
                                        Name: 'FOO',
                                        ValueFrom: {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    'arn:',
                                                    {Ref: 'AWS::Partition'},
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
                                                    {Ref: 'AWS::Partition'},
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
                            'Fn::GetAtt': [templateHelper.startsWithMatch('stacktaskdefupdateruntask0execrole'), 'Arn']
                        },
                        Family: 'stack-task-def-updateruntask-0',
                        Memory: '512',
                        NetworkMode: 'awsvpc',
                        RequiresCompatibilities: ['FARGATE'],
                        TaskRoleArn: {
                            'Fn::GetAtt': [templateHelper.startsWithMatch('stacktaskdefupdateruntask0TaskRole'), 'Arn']
                        }
                    }
                })
            },
            {
                key: 'stacktaskdefweb',
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
                                                            {'Fn::GetAtt': [nginxContainerRef, 'Arn']}
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
                                                            {'Fn::GetAtt': [nginxContainerRef, 'Arn']}
                                                        ]
                                                    }
                                                ]
                                            },
                                            '.',
                                            {Ref: 'AWS::URLSuffix'},
                                            '/',
                                            {Ref: nginxContainerRef},
                                            ':1'
                                        ]
                                    ]
                                },
                                LogConfiguration: {
                                    LogDriver: 'awslogs',
                                    Options: {
                                        'awslogs-group': {Ref: templateHelper.startsWithMatch('stackcontainernginxwebu0loggroup')},
                                        'awslogs-stream-prefix': 'nginx',
                                        'awslogs-region': 'us-east-1'
                                    }
                                },
                                Memory: 64,
                                Name: 'stack-container-nginx-web-u-0',
                                PortMappings: [{ContainerPort: 80, Protocol: 'tcp'}],
                                Secrets: []
                            },
                            {
                                Cpu: 128,
                                Environment: [{Name: 'FIZZ', Value: 'buzz'}],
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
                                                                'Fn::GetAtt': [phpfpmContainerRef, 'Arn']
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
                                                                'Fn::GetAtt': [phpfpmContainerRef, 'Arn']
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            '.',
                                            {Ref: 'AWS::URLSuffix'},
                                            '/',
                                            {Ref: phpfpmContainerRef},
                                            ':1'
                                        ]
                                    ]
                                },
                                LogConfiguration: {
                                    LogDriver: 'awslogs',
                                    Options: {
                                        'awslogs-group': {Ref: templateHelper.startsWithMatch('stackcontainerphpfpmwebu0loggroup')},
                                        'awslogs-stream-prefix': 'phpfpm',
                                        'awslogs-region': 'us-east-1'
                                    }
                                },
                                Memory: 128,
                                Name: 'stack-container-phpfpm-web-u-0',
                                PortMappings: [{ContainerPort: 9000, Protocol: 'tcp'}],
                                Secrets: [
                                    {
                                        Name: 'FOO',
                                        ValueFrom: {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    'arn:',
                                                    {Ref: 'AWS::Partition'},
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
                                                    {Ref: 'AWS::Partition'},
                                                    ':secretsmanager:us-east-1:12344:secret:stack-secrets/environment:BAR::'
                                                ]
                                            ]
                                        }
                                    }
                                ]
                            }
                        ],
                        Cpu: '256',
                        ExecutionRoleArn: {'Fn::GetAtt': [templateHelper.startsWithMatch('stacktaskdefweb0execrole'), 'Arn']},
                        Family: 'stack-task-def-web-0',
                        Memory: '512',
                        NetworkMode: 'awsvpc',
                        RequiresCompatibilities: ['FARGATE'],
                        TaskRoleArn: {'Fn::GetAtt': [templateHelper.startsWithMatch('stacktaskdefweb0TaskRole'), 'Arn']}
                    }
                })
            },
            {
                key: 'stackservicequeue0QueueProcessingTaskDef',
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
                                    {Name: 'FIZZ', Value: 'buzz'},
                                    {
                                        Name: 'QUEUE_NAME',
                                        Value: {
                                            'Fn::GetAtt': [
                                                templateHelper.startsWithMatch('stackservicequeue0EcsProcessingQueue'),
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
                                                                'Fn::GetAtt': [phpfpmContainerRef, 'Arn']
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
                                                                'Fn::GetAtt': [phpfpmContainerRef, 'Arn']
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            '.',
                                            {Ref: 'AWS::URLSuffix'},
                                            '/',
                                            {Ref: phpfpmContainerRef},
                                            ':1'
                                        ]
                                    ]
                                },
                                LogConfiguration: {
                                    LogDriver: 'awslogs',
                                    Options: {
                                        'awslogs-group': {Ref: templateHelper.startsWithMatch('stackservicequeue0loggroup')},
                                        'awslogs-stream-prefix': 'phpfpm',
                                        'awslogs-region': 'us-east-1'
                                    }
                                },
                                Name: 'QueueProcessingContainer',
                                Secrets: [
                                    {
                                        Name: 'FOO',
                                        ValueFrom: {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    'arn:',
                                                    {Ref: 'AWS::Partition'},
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
                                                    {Ref: 'AWS::Partition'},
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
                            'Fn::GetAtt': [
                                templateHelper.startsWithMatch('stackservicequeue0QueueProcessingTaskDefExecutionRole'),
                                'Arn'
                            ]
                        },
                        Family: 'stack-service-queue-0',
                        Memory: '512',
                        NetworkMode: 'awsvpc',
                        RequiresCompatibilities: ['FARGATE'],
                        TaskRoleArn: {
                            'Fn::GetAtt': [
                                templateHelper.startsWithMatch('stackservicequeue0QueueProcessingTaskDefTaskRole'),
                                'Arn'
                            ]
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
                        RepositoryName: 'stack/nginx'
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
                        RepositoryName: 'stack/phpfpm'
                    },
                    UpdateReplacePolicy: 'Retain',
                    DeletionPolicy: 'Retain'
                })
            }
        ]);
        templateHelper.expected('AWS::Logs::LogGroup',  [
            {
                key: 'stackcontainerphpfpmcreateruntaskcrot0loggroup',
                properties: Match.objectEquals({
                    Type: 'AWS::Logs::LogGroup',
                    Properties: {
                        LogGroupName: 'stack-container-phpfpm-createruntask-crot-0-log-group',
                        RetentionInDays: 30
                    },
                    UpdateReplacePolicy: 'Delete',
                    DeletionPolicy: 'Delete'
                })
            },
            {
                key: 'stackcontainerphpfpmupdateruntaskurot0loggroup',
                properties: Match.objectEquals({
                    Type: 'AWS::Logs::LogGroup',
                    Properties: {
                        LogGroupName: 'stack-container-phpfpm-updateruntask-urot-0-log-group',
                        RetentionInDays: 30
                    },
                    UpdateReplacePolicy: 'Delete',
                    DeletionPolicy: 'Delete'
                })
            },
            {
                key: 'stackcontainernginxwebu0loggroup',
                properties: Match.objectEquals({
                    Type: 'AWS::Logs::LogGroup',
                    Properties: {
                        LogGroupName: 'stack-container-nginx-web-u-0-log-group',
                        RetentionInDays: 30
                    },
                    UpdateReplacePolicy: 'Delete',
                    DeletionPolicy: 'Delete'
                })
            },
            {
                key: 'stackcontainerphpfpmwebu0loggroup',
                properties: Match.objectEquals({
                    Type: 'AWS::Logs::LogGroup',
                    Properties: {
                        LogGroupName: 'stack-container-phpfpm-web-u-0-log-group',
                        RetentionInDays: 30
                    },
                    UpdateReplacePolicy: 'Delete',
                    DeletionPolicy: 'Delete'
                })
            },
            {
                key: 'stackservicequeue0loggroup',
                properties: Match.objectEquals({
                    Type: 'AWS::Logs::LogGroup',
                    Properties: {
                        LogGroupName: 'stack-service-queue-0-log-group',
                        RetentionInDays: 30
                    },
                    UpdateReplacePolicy: 'Delete',
                    DeletionPolicy: 'Delete'
                })
            }
        ]);
        templateHelper.expected('AWS::EC2::SecurityGroup',  [
            {
                key: 'stacktaskcreateruntask0SecurityGroup',
                properties: Match.objectEquals({
                    Type: 'AWS::EC2::SecurityGroup',
                    Properties: {
                        GroupDescription: 'stack/stack-task-createruntask-0/SecurityGroup',
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
            },
            {
                key: 'stacktaskupdateruntask0SecurityGroup',
                properties: Match.objectEquals({
                    Type: 'AWS::EC2::SecurityGroup',
                    Properties: {
                        GroupDescription: 'stack/stack-task-updateruntask-0/SecurityGroup',
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
            },
            {
                key: 'stackserviceweb0SecurityGroup',
                properties: Match.objectEquals({
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
                    }
                })
            },
            {
                key: 'stackservicequeue0QueueProcessingFargateServiceSecurityGroup',
                properties: Match.objectEquals({
                    Type: 'AWS::EC2::SecurityGroup',
                    Properties: {
                        GroupDescription: 'stack/stack-service-queue-0/QueueProcessingFargateService/SecurityGroup',
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
                key: 'stacktaskcreateruntask0createfn',
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
                                    {Ref: templateHelper.startsWithMatch('stacktaskdefcreateruntask')},
                                    '"},"parameters":{"cluster":"',
                                    {Ref: templateHelper.startsWithMatch('stackcluster')},
                                    '","taskDefinition":"',
                                    {Ref: templateHelper.startsWithMatch('stacktaskdefcreateruntask')},
                                    '","capacityProviderStrategy":[],"launchType":"FARGATE","platformVersion":"LATEST","networkConfiguration":{"awsvpcConfiguration":{"assignPublicIp":"DISABLED","subnets":["p-12345","p-67890"],"securityGroups":["',
                                    {
                                        'Fn::GetAtt': [
                                            templateHelper.startsWithMatch('stacktaskcreateruntask0SecurityGroup'),
                                            'GroupId'
                                        ]
                                    },
                                    '"]}}}}'
                                ]
                            ]
                        },
                        InstallLatestAwsSdk: true
                    },
                    DependsOn: [templateHelper.startsWithMatch('stacktaskcreateruntask0createfnCustomResourcePolicy')],
                    UpdateReplacePolicy: 'Delete',
                    DeletionPolicy: 'Delete'
                })
            },
            {
                key: 'stacktaskupdateruntask0updatefn',
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
                                    {Ref: templateHelper.startsWithMatch('stacktaskdefupdateruntask')},
                                    '"},"parameters":{"cluster":"',
                                    {Ref: templateHelper.startsWithMatch('stackcluster')},
                                    '","taskDefinition":"',
                                    {Ref: templateHelper.startsWithMatch('stacktaskdefupdateruntask')},
                                    '","capacityProviderStrategy":[],"launchType":"FARGATE","platformVersion":"LATEST","networkConfiguration":{"awsvpcConfiguration":{"assignPublicIp":"DISABLED","subnets":["p-12345","p-67890"],"securityGroups":["',
                                    {
                                        'Fn::GetAtt': [
                                            templateHelper.startsWithMatch('stacktaskupdateruntask0SecurityGroup'),
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
                                    {Ref: templateHelper.startsWithMatch('stacktaskdefupdateruntask')},
                                    '"},"parameters":{"cluster":"',
                                    {Ref: templateHelper.startsWithMatch('stackcluster')},
                                    '","taskDefinition":"',
                                    {Ref: templateHelper.startsWithMatch('stacktaskdefupdateruntask')},
                                    '","capacityProviderStrategy":[],"launchType":"FARGATE","platformVersion":"LATEST","networkConfiguration":{"awsvpcConfiguration":{"assignPublicIp":"DISABLED","subnets":["p-12345","p-67890"],"securityGroups":["',
                                    {
                                        'Fn::GetAtt': [
                                            templateHelper.startsWithMatch('stacktaskupdateruntask0SecurityGroup'),
                                            'GroupId'
                                        ]
                                    },
                                    '"]}}}}'
                                ]
                            ]
                        },
                        InstallLatestAwsSdk: true
                    },
                    DependsOn: [templateHelper.startsWithMatch('stacktaskupdateruntask0updatefnCustomResourcePolicy')],
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
        templateHelper.expected('AWS::ECS::Service',  [
            {
                key: 'stackserviceweb0Service',
                properties: Match.objectEquals({
                    Type: 'AWS::ECS::Service',
                    Properties: {
                        Cluster: {Ref: templateHelper.startsWithMatch('stackcluster')},
                        DeploymentConfiguration: {MaximumPercent: 200, MinimumHealthyPercent: 50},
                        DesiredCount: 1,
                        EnableECSManagedTags: false,
                        EnableExecuteCommand: true,
                        HealthCheckGracePeriodSeconds: 60,
                        LaunchType: 'FARGATE',
                        LoadBalancers: [
                            {
                                ContainerName: 'stack-container-nginx-web-u-0',
                                ContainerPort: 80,
                                TargetGroupArn: {Ref: templateHelper.startsWithMatch('targetgroup')}
                            }
                        ],
                        NetworkConfiguration: {
                            AwsvpcConfiguration: {
                                AssignPublicIp: 'DISABLED',
                                SecurityGroups: [
                                    {
                                        'Fn::GetAtt': [templateHelper.startsWithMatch('stackserviceweb0SecurityGroup'), 'GroupId']
                                    }
                                ],
                                Subnets: ['p-12345', 'p-67890']
                            }
                        },
                        PlatformVersion: 'LATEST',
                        ServiceName: 'stack-service-web-0',
                        TaskDefinition: {Ref: templateHelper.startsWithMatch('stacktaskdefweb')}
                    }
                })
            },
            {
                key: 'stackservicequeue0QueueProcessingFargateService',
                properties: Match.objectEquals({
                    Type: 'AWS::ECS::Service',
                    Properties: {
                        Cluster: {Ref: templateHelper.startsWithMatch('stackcluster')},
                        DeploymentConfiguration: {MaximumPercent: 200, MinimumHealthyPercent: 50},
                        EnableECSManagedTags: false,
                        LaunchType: 'FARGATE',
                        NetworkConfiguration: {
                            AwsvpcConfiguration: {
                                AssignPublicIp: 'DISABLED',
                                SecurityGroups: [
                                    {
                                        'Fn::GetAtt': [
                                            templateHelper.startsWithMatch('stackservicequeue0QueueProcessingFargateServiceSecurityGroup'),
                                            'GroupId'
                                        ]
                                    }
                                ],
                                Subnets: ['p-12345', 'p-67890']
                            }
                        },
                        PlatformVersion: 'LATEST',
                        ServiceName: 'stack-service-queue-0',
                        TaskDefinition: {Ref: templateHelper.startsWithMatch('stackservicequeue0QueueProcessingTaskDef')}
                    }
                })
            }
        ]);
        templateHelper.expected('AWS::ApplicationAutoScaling::ScalableTarget',  [
            {
                key: 'stackserviceweb0TaskCountTarget',
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
                                    {Ref: templateHelper.startsWithMatch('stackcluster')},
                                    '/',
                                    {
                                        'Fn::GetAtt': [templateHelper.startsWithMatch('stackserviceweb0Service'), 'Name']
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
            },
            {
                key: 'stackservicequeue0QueueProcessingFargateServiceTaskCountTarget',
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
                                    {Ref: templateHelper.startsWithMatch('stackcluster')},
                                    '/',
                                    {
                                        'Fn::GetAtt': [
                                            templateHelper.startsWithMatch('stackservicequeue0QueueProcessingFargateService'),
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
                key: 'stackserviceweb0TaskCountTargetstackservicescalecpu',
                properties: Match.objectEquals({
                    Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
                    Properties: {
                        PolicyName: templateHelper.startsWithMatch('stackstackserviceweb0TaskCountTargetstackservicescalecpu'),
                        PolicyType: 'TargetTrackingScaling',
                        ScalingTargetId: {Ref: templateHelper.startsWithMatch('stackserviceweb0TaskCountTarget')},
                        TargetTrackingScalingPolicyConfiguration: {
                            PredefinedMetricSpecification: {PredefinedMetricType: 'ECSServiceAverageCPUUtilization'},
                            TargetValue: 75
                        }
                    }
                })
            },
            {
                key: 'stackserviceweb0TaskCountTargetstackservicescalemem',
                properties: Match.objectEquals({
                    Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
                    Properties: {
                        PolicyName: templateHelper.startsWithMatch('stackstackserviceweb0TaskCountTargetstackservicescalemem'),
                        PolicyType: 'TargetTrackingScaling',
                        ScalingTargetId: {Ref: templateHelper.startsWithMatch('stackserviceweb0TaskCountTarget')},
                        TargetTrackingScalingPolicyConfiguration: {
                            PredefinedMetricSpecification: {PredefinedMetricType: 'ECSServiceAverageMemoryUtilization'},
                            TargetValue: 75
                        }
                    }
                })
            },
            {
                key: 'stackservicequeue0QueueProcessingFargateServiceTaskCountTargetCpuScaling',
                properties: Match.objectEquals({
                    Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
                    Properties: {
                        PolicyName: templateHelper.startsWithMatch('stackstackservicequeue0QueueProcessingFargateServiceTaskCountTargetCpuScaling'),
                        PolicyType: 'TargetTrackingScaling',
                        ScalingTargetId: {
                            Ref: templateHelper.startsWithMatch('stackservicequeue0QueueProcessingFargateServiceTaskCountTarget')
                        },
                        TargetTrackingScalingPolicyConfiguration: {
                            PredefinedMetricSpecification: {PredefinedMetricType: 'ECSServiceAverageCPUUtilization'},
                            TargetValue: 50
                        }
                    }
                })
            },
            {
                key: 'stackservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingLowerPolicy',
                properties: Match.objectEquals({
                    Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
                    Properties: {
                        PolicyName: templateHelper.startsWithMatch('stackstackservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingLowerPolicy'),
                        PolicyType: 'StepScaling',
                        ScalingTargetId: {
                            Ref: templateHelper.startsWithMatch('stackservicequeue0QueueProcessingFargateServiceTaskCountTarget')
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
                key: 'stackservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingUpperPolicy',
                properties: Match.objectEquals({
                    Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
                    Properties: {
                        PolicyName: templateHelper.startsWithMatch('stackstackservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingUpperPolicy'),
                        PolicyType: 'StepScaling',
                        ScalingTargetId: {
                            Ref: templateHelper.startsWithMatch('stackservicequeue0QueueProcessingFargateServiceTaskCountTarget')
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
                key: 'stackservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingLowerAlarm',
                properties: Match.objectEquals({
                    Type: 'AWS::CloudWatch::Alarm',
                    Properties: {
                        ComparisonOperator: 'LessThanOrEqualToThreshold',
                        EvaluationPeriods: 1,
                        AlarmActions: [
                            {
                                Ref: templateHelper.startsWithMatch('stackservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingLowerPolicy')
                            }
                        ],
                        AlarmDescription: 'Lower threshold scaling alarm',
                        Dimensions: [
                            {
                                Name: 'QueueName',
                                Value: {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('stackservicequeue0EcsProcessingQueue'),
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
                key: 'stackservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingUpperAlarm',
                properties: Match.objectEquals({
                    Type: 'AWS::CloudWatch::Alarm',
                    Properties: {
                        ComparisonOperator: 'GreaterThanOrEqualToThreshold',
                        EvaluationPeriods: 1,
                        AlarmActions: [
                            {
                                Ref: templateHelper.startsWithMatch('stackservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingUpperPolicy')
                            }
                        ],
                        AlarmDescription: 'Upper threshold scaling alarm',
                        Dimensions: [
                            {
                                Name: 'QueueName',
                                Value: {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('stackservicequeue0EcsProcessingQueue'),
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
        templateHelper.expected('AWS::SQS::Queue',  [
            {
                key: 'stackservicequeue0EcsProcessingDeadLetterQueue',
                properties: Match.objectEquals({
                    Type: 'AWS::SQS::Queue',
                    Properties: {MessageRetentionPeriod: 1209600},
                    UpdateReplacePolicy: 'Delete',
                    DeletionPolicy: 'Delete'
                })
            },
            {
                key: 'stackservicequeue0EcsProcessingQueue',
                properties: Match.objectEquals({
                    Type: 'AWS::SQS::Queue',
                    Properties: {
                        RedrivePolicy: {
                            deadLetterTargetArn: {
                                'Fn::GetAtt': [
                                    templateHelper.startsWithMatch('stackservicequeue0EcsProcessingDeadLetterQueue'),
                                    'Arn'
                                ]
                            },
                            maxReceiveCount: 3
                        }
                    },
                    UpdateReplacePolicy: 'Delete',
                    DeletionPolicy: 'Delete'
                })
            }
        ]);
    });
});