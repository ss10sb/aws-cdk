import {App, Stack} from "aws-cdk-lib";
import {Match, Template} from "aws-cdk-lib/assertions";
import {EcrRepositoryType} from "../../src/ecr/ecr-definitions";
import {TaskDefinitionFactory} from "../../src/ecs/task-definition-factory";
import {Secrets} from "../../src/secret/secrets";
import {EcrRepositories} from "../../src/ecr/ecr-repositories";
import {TaskServiceType} from "../../src/ecs/task-definitions";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {ContainerFactory} from "../../src/ecs/container-factory";
import {EcrRepositoryFactory} from "../../src/ecr/ecr-repository-factory";
import {ContainerCommandFactory} from "../../src/ecs/container-command-factory";

const ecrRepoProps = {
    repositories: [EcrRepositoryType.NGINX, EcrRepositoryType.PHPFPM]
};

describe('task definition factory', () => {
    it('should create web stack', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const tdProps = {
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
        };
        const ecrRepositories = new EcrRepositories('my-repos', ecrRepoProps);
        const containerFactory = new ContainerFactory(stack, 'container', {
            commandFactory: new ContainerCommandFactory(stack, 'command', {}),
            repositoryFactory: new EcrRepositoryFactory(stack, 'repos', ecrRepositories),
            secrets: new Secrets(stack, 'secrets')
        });

        const taskDefinitionFactory = new TaskDefinitionFactory(stack, 'td-factory', {
            containerFactory: containerFactory
        });
        taskDefinitionFactory.create(TaskServiceType.WEB_SERVICE, tdProps);
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        templateHelper.expected('AWS::IAM::Role',  [
            {
                key: 'tdfactorytaskdefweb0execrole',
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
                key: 'tdfactorytaskdefweb0TaskRole',
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
                key: 'tdfactorytaskdefweb0execroleDefaultPolicy',
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
                        PolicyName: templateHelper.startsWithMatch('tdfactorytaskdefweb0execroleDefaultPolicy'),
                        Roles: [{Ref: templateHelper.startsWithMatch('tdfactorytaskdefweb0execrole')}]
                    }
                })
            }
        ]);
        templateHelper.expected('AWS::ECS::TaskDefinition',  [
            {
                key: 'tdfactorytaskdefweb',
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
                                ReadonlyRootFilesystem: true,
                                PortMappings: [{ContainerPort: 80, Protocol: 'tcp'}]
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
                                ReadonlyRootFilesystem: true,
                                PortMappings: [{ContainerPort: 9000, Protocol: 'tcp'}]
                            }
                        ],
                        Cpu: '256',
                        ExecutionRoleArn: {'Fn::GetAtt': [templateHelper.startsWithMatch('tdfactorytaskdefweb0execrole'), 'Arn']},
                        Family: 'td-factory-task-def-web-0',
                        Memory: '512',
                        NetworkMode: 'awsvpc',
                        RequiresCompatibilities: ['FARGATE'],
                        TaskRoleArn: {'Fn::GetAtt': [templateHelper.startsWithMatch('tdfactorytaskdefweb0TaskRole'), 'Arn']}
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
    });
});