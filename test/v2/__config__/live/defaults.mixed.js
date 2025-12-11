const common = require('./_common');
const {ConfigEnvironments} = require("../../../../src/config/config-definitions");
const {PipelineNotificationEvents} = require("aws-cdk-lib/aws-codepipeline");
const {DetailType} = require("aws-cdk-lib/aws-codestarnotifications");
const {Protocol} = require("aws-cdk-lib/aws-elasticloadbalancingv2");
const {EcrRepositoryType} = require("../../../../src/ecr/ecr-definitions");
const {TaskServiceType, ScalableTypes, SchedulableTypes} = require("../../../../src/ecs/task-definitions");
const {ContainerType} = require("../../../../src/ecs/container-definitions");
const {ContainerEntryPoint, ContainerCommand} = require("../../../../src/ecs/container-command-factory");
const {BrefRuntime, LaravelHandler} = require("../../../../src/lambda/bref-definitions");
const {FunctionType} = require("../../../../src/lambda/lambda-definitions");
const path = require("path");

module.exports = {
    Name: common.Name,
    College: common.College,
    Environment: ConfigEnvironments.SHARED,
    Version: "0.0.0",
    Parameters: {
        repositories: {
            repositories: [EcrRepositoryType.NGINX, EcrRepositoryType.PHPFPM]
        },
        sourceProps: {
            "owner": "repoOwner",
            "repo": "repoName",
            "connectionArn": "arn:aws:codestar-connections:us-west-2:accountId:connection/randomUUID"
        },
        pipelineNotification: {
            detailType: DetailType.FULL,
            events: [
                PipelineNotificationEvents.PIPELINE_EXECUTION_FAILED,
                PipelineNotificationEvents.PIPELINE_EXECUTION_SUCCEEDED,
                PipelineNotificationEvents.MANUAL_APPROVAL_NEEDED
            ],
            emails: ['admin@example.edu']
        },
        runPipelineSchedule: 'cron(0 8 ? * 2#1 *)',
        buildStep: {}
    },
    Environments: [
        {
            AWSAccountId: '11111',
            AWSRegion: 'us-west-2',
            Name: common.Name,
            College: common.College,
            Environment: ConfigEnvironments.SDLC,
            Version: "0.0.0",
            Parameters: {
                alarmEmails: ['sdlc@example.edu'],
                hostedZoneDomain: `sdlc.${common.domain}`,
                dynamoDb: {},
                subdomain: common.subdomain,
                startStop: {
                    stop: 'cron(0 5 * * ? *)',
                },
                queue: {},
                lambda: {
                    queue: {
                        functionProps: {
                            brefRuntime: BrefRuntime.PHP82,
                            type: FunctionType.QUEUE,
                            appPath: path.join(__dirname, '..', '..', '__codebase__'),
                            lambdaTimeout: 120
                        }
                    },
                    functions: [
                        {
                            appPath: path.join(__dirname, '..', '..', '__codebase__'),
                            lambdaHandler: LaravelHandler.ARTISAN,
                            type: FunctionType.ARTISAN,
                            brefRuntime: [BrefRuntime.PHP82, BrefRuntime.CONSOLE]
                        },
                        {
                            appPath: path.join(__dirname, '..', '..', '__codebase__'),
                            lambdaHandler: LaravelHandler.ARTISAN,
                            brefRuntime: [BrefRuntime.PHP82, BrefRuntime.CONSOLE],
                            scheduledEvents: [
                                {
                                    schedule: 'rate(5 minutes)',
                                    eventInput: {cli: 'schedule:run'}
                                }
                            ]
                        }
                    ]
                },
                ecs: {
                    targetGroup: {},
                    healthCheck: {
                        path: '/api/healthz',
                        protocol: Protocol.HTTP
                    },
                    listenerRule: {
                        priority: common.priority,
                        conditions: {
                            hostHeaders: [`${common.subdomain}.sdlc.${common.domain}`]
                        }
                    },
                    tasks: [
                        {
                            type: TaskServiceType.RUN_ONCE_TASK,
                            taskDefinition: {
                                cpu: '256',
                                memoryMiB: '512',
                                containers: [
                                    {
                                        type: ContainerType.RUN_ONCE_TASK,
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
                    ],
                    services: [
                        {
                            type: TaskServiceType.WEB_SERVICE,
                            attachToTargetGroup: true,
                            enableExecuteCommand: true,
                            scalable: {
                                types: [ScalableTypes.CPU, ScalableTypes.MEMORY],
                                scaleAt: 75,
                                minCapacity: 1,
                                maxCapacity: 3
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
                                        }],
                                        entryPoint: ContainerEntryPoint.SH,
                                        command: ContainerCommand.UNDEFINED,
                                        additionalCommand: ['/entrypoint.sh']
                                    }
                                ]
                            }
                        }
                    ],
                },
            }
        },
        {
            AWSAccountId: '22222',
            AWSRegion: 'us-west-2',
            Name: common.Name,
            College: common.College,
            Environment: ConfigEnvironments.PROD,
            Version: "0.0.0",
            Parameters: {
                alarmEmails: ['prod@example.edu'],
                hostedZoneDomain: common.domain,
                dynamoDb: {},
                subdomain: common.subdomain,
                steps: {
                    manualApproval: {}
                },
                queue: {},
                lambda: {
                    queue: {
                        functionProps: {
                            brefRuntime: BrefRuntime.PHP82,
                            type: FunctionType.QUEUE,
                            appPath: path.join(__dirname, '..', '..', '__codebase__'),
                            lambdaTimeout: 120
                        }
                    },
                    functions: [
                        {
                            appPath: path.join(__dirname, '..', '..', '__codebase__'),
                            lambdaHandler: LaravelHandler.ARTISAN,
                            type: FunctionType.ARTISAN,
                            brefRuntime: [BrefRuntime.PHP82, BrefRuntime.CONSOLE]
                        },
                        {
                            appPath: path.join(__dirname, '..', '..', '__codebase__'),
                            lambdaHandler: LaravelHandler.ARTISAN,
                            brefRuntime: [BrefRuntime.PHP82, BrefRuntime.CONSOLE],
                            scheduledEvents: [
                                {
                                    schedule: 'rate(5 minutes)',
                                    eventInput: {cli: 'schedule:run'}
                                }
                            ]
                        }
                    ]
                },
                ecs: {
                    targetGroup: {},
                    healthCheck: {
                        path: '/api/healthz',
                        protocol: Protocol.HTTP
                    },
                    listenerRule: {
                        priority: common.priority,
                        conditions: {
                            hostHeaders: [`${common.subdomain}.${common.domain}`]
                        }
                    },
                    tasks: [
                        {
                            type: TaskServiceType.RUN_ONCE_TASK,
                            taskDefinition: {
                                cpu: '256',
                                memoryMiB: '512',
                                containers: [
                                    {
                                        type: ContainerType.RUN_ONCE_TASK,
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
                        },
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
                                        additionalCommand: ['something:daily']
                                    }
                                ]
                            }
                        }
                    ],
                    services: [
                        {
                            type: TaskServiceType.WEB_SERVICE,
                            attachToTargetGroup: true,
                            enableExecuteCommand: true,
                            scalable: {
                                types: [ScalableTypes.CPU, ScalableTypes.MEMORY],
                                scaleAt: 75,
                                minCapacity: 1,
                                maxCapacity: 3
                            },
                            taskDefinition: {
                                cpu: '512',
                                memoryMiB: '1024',
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
                                        }],
                                        entryPoint: ContainerEntryPoint.SH,
                                        command: ContainerCommand.UNDEFINED,
                                        additionalCommand: ['/entrypoint.sh']
                                    }
                                ]
                            }
                        }
                    ],
                }
            }
        }
    ]
}
