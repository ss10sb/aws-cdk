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
        // templateHelper.inspect();
        const expected = {
            Resources: {
                cluster611F8AFF: { Type: 'AWS::ECS::Cluster' },
                taskdeftaskdefscheduledtask0execrole985383EA: {
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
                taskdeftaskdefscheduledtask0execroleDefaultPolicyF6944E67: {
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
                                        'Fn::GetAtt': [
                                            'containercontainerphpfpmscheduledtaskst0loggroup9954A4D2',
                                            'Arn'
                                        ]
                                    }
                                }
                            ],
                            Version: '2012-10-17'
                        },
                        PolicyName: 'taskdeftaskdefscheduledtask0execroleDefaultPolicyF6944E67',
                        Roles: [ { Ref: 'taskdeftaskdefscheduledtask0execrole985383EA' } ]
                    }
                },
                taskdeftaskdefscheduledtask0TaskRole8CF98154: {
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
                taskdeftaskdefscheduledtask02C837920: {
                    Type: 'AWS::ECS::TaskDefinition',
                    Properties: {
                        ContainerDefinitions: [
                            {
                                Command: [ 'artisan', 'import:all' ],
                                Cpu: 256,
                                EntryPoint: [ '/usr/local/bin/php' ],
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
                                        'awslogs-group': {
                                            Ref: 'containercontainerphpfpmscheduledtaskst0loggroup9954A4D2'
                                        },
                                        'awslogs-stream-prefix': 'phpfpm',
                                        'awslogs-region': 'us-east-1'
                                    }
                                },
                                Memory: 512,
                                Name: 'container-container-phpfpm-scheduledtask-st-0'
                            }
                        ],
                        Cpu: '256',
                        ExecutionRoleArn: {
                            'Fn::GetAtt': [ 'taskdeftaskdefscheduledtask0execrole985383EA', 'Arn' ]
                        },
                        Family: 'task-def-task-def-scheduledtask-0',
                        Memory: '512',
                        NetworkMode: 'awsvpc',
                        RequiresCompatibilities: [ 'FARGATE' ],
                        TaskRoleArn: {
                            'Fn::GetAtt': [ 'taskdeftaskdefscheduledtask0TaskRole8CF98154', 'Arn' ]
                        }
                    }
                },
                taskdeftaskdefscheduledtask0EventsRole74C5B51F: {
                    Type: 'AWS::IAM::Role',
                    Properties: {
                        AssumeRolePolicyDocument: {
                            Statement: [
                                {
                                    Action: 'sts:AssumeRole',
                                    Effect: 'Allow',
                                    Principal: { Service: 'events.amazonaws.com' }
                                }
                            ],
                            Version: '2012-10-17'
                        }
                    }
                },
                taskdeftaskdefscheduledtask0EventsRoleDefaultPolicy703A2F3C: {
                    Type: 'AWS::IAM::Policy',
                    Properties: {
                        PolicyDocument: {
                            Statement: [
                                {
                                    Action: 'ecs:RunTask',
                                    Condition: {
                                        ArnEquals: {
                                            'ecs:cluster': { 'Fn::GetAtt': [ 'cluster611F8AFF', 'Arn' ] }
                                        }
                                    },
                                    Effect: 'Allow',
                                    Resource: { Ref: 'taskdeftaskdefscheduledtask02C837920' }
                                },
                                {
                                    Action: 'iam:PassRole',
                                    Effect: 'Allow',
                                    Resource: {
                                        'Fn::GetAtt': [
                                            'taskdeftaskdefscheduledtask0execrole985383EA',
                                            'Arn'
                                        ]
                                    }
                                },
                                {
                                    Action: 'iam:PassRole',
                                    Effect: 'Allow',
                                    Resource: {
                                        'Fn::GetAtt': [
                                            'taskdeftaskdefscheduledtask0TaskRole8CF98154',
                                            'Arn'
                                        ]
                                    }
                                }
                            ],
                            Version: '2012-10-17'
                        },
                        PolicyName: 'taskdeftaskdefscheduledtask0EventsRoleDefaultPolicy703A2F3C',
                        Roles: [ { Ref: 'taskdeftaskdefscheduledtask0EventsRole74C5B51F' } ]
                    }
                },
                taskdeftaskdefscheduledtask0SecurityGroup82793FEA: {
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
                },
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
                containercontainerphpfpmscheduledtaskst0loggroup9954A4D2: {
                    Type: 'AWS::Logs::LogGroup',
                    Properties: {
                        LogGroupName: 'container-container-phpfpm-scheduledtask-st-0-log-group',
                        RetentionInDays: 30
                    },
                    UpdateReplacePolicy: 'Delete',
                    DeletionPolicy: 'Delete'
                },
                tasktaskscheduledtask0ScheduledEventRuleA62BBC20: {
                    Type: 'AWS::Events::Rule',
                    Properties: {
                        Name: 'task-task-scheduledtask-0',
                        ScheduleExpression: 'cron(0 12 * * ? *)',
                        State: 'ENABLED',
                        Targets: [
                            {
                                Arn: { 'Fn::GetAtt': [ 'cluster611F8AFF', 'Arn' ] },
                                EcsParameters: {
                                    LaunchType: 'FARGATE',
                                    NetworkConfiguration: {
                                        AwsVpcConfiguration: {
                                            AssignPublicIp: 'DISABLED',
                                            SecurityGroups: [
                                                {
                                                    'Fn::GetAtt': [
                                                        'taskdeftaskdefscheduledtask0SecurityGroup82793FEA',
                                                        'GroupId'
                                                    ]
                                                }
                                            ],
                                            Subnets: [ 'p-12345', 'p-67890' ]
                                        }
                                    },
                                    PlatformVersion: 'LATEST',
                                    TaskCount: 1,
                                    TaskDefinitionArn: { Ref: 'taskdeftaskdefscheduledtask02C837920' }
                                },
                                Id: 'Target0',
                                Input: '{}',
                                RoleArn: {
                                    'Fn::GetAtt': [
                                        'taskdeftaskdefscheduledtask0EventsRole74C5B51F',
                                        'Arn'
                                    ]
                                }
                            }
                        ]
                    }
                }
            }
        };
        templateHelper.template.templateMatches(expected);
    });
});