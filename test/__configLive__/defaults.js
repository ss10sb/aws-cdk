const common = require('./_common');
const {ConfigEnvironments} = require("../../src/config");
const {EcrRepositoryType} = require("../../src/ecr");
const {PipelineNotificationEvents} = require("aws-cdk-lib/aws-codepipeline");
const {DetailType} = require("aws-cdk-lib/aws-codestarnotifications");
const {Protocol} = require("aws-cdk-lib/aws-elasticloadbalancingv2");
const {
    TaskServiceType,
    ContainerType,
    ContainerEntryPoint,
    ContainerCommand,
    ScalableTypes,
    SchedulableTypes
} = require("../../src/ecs");

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
        runPipelineSchedule: 'cron(0 8 ? * 2#1 *)'
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
                canCreateTask: common.canCreateTask ?? true,
                alarmEmails: ['sdlc@example.edu'],
                hostedZoneDomain: `sdlc.${common.domain}`,
                dynamoDb: {},
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
                subdomain: common.subdomain,
                targetGroup: {},
                startStop: {
                    stop: 'cron(0 5 * * ? *)',
                },
                tasks: [
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
                                    }]
                                }
                            ]
                        }
                    }
                ],
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
                canCreateTask: common.canCreateTask ?? true,
                alarmEmails: ['prod@example.edu'],
                hostedZoneDomain: common.domain,
                dynamoDb: {},
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
                subdomain: common.subdomain,
                targetGroup: {},
                steps: {
                    manualApproval: {}
                },
                tasks: [
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
                                    additionalCommand: ['catalyst:daily']
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
                                    }]
                                }
                            ]
                        }
                    }
                ],
            }
        }
    ]
}
