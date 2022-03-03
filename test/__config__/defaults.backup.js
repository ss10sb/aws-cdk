const common = require('./_common');
const {
    Command,
    EntryPoint,
    ContainerType,
    RepositoryType,
    ScalableTypes,
    SchedulableTypes,
    TaskServiceType
} = require("@smorken/cdk-pipeline");
const {ConfigEnvironments} = require("@smorken/cdk-utils");
const {PipelineNotificationEvents} = require("@aws-cdk/aws-codepipeline");
const {Protocol} = require("@aws-cdk/aws-elasticloadbalancingv2");
const {DetailType} = require("@aws-cdk/aws-codestarnotifications");

module.exports = {
    Name: common.Name,
    College: common.College,
    Environment: ConfigEnvironments.SHARED,
    Version: "0.0.0",
    Parameters: {
        repositories: {
            repositories: [RepositoryType.NGINX, RepositoryType.PHPFPM]
        },
        sourceProps: {
            "owner": "ownername",
            "repo": "reponame",
            "connectionArn": "arn:abc123"
        },
        pipelineNotification: {
            detailType: DetailType.FULL,
            events: [
                PipelineNotificationEvents.MANUAL_APPROVAL_NEEDED,
                PipelineNotificationEvents.PIPELINE_EXECUTION_FAILED,
                PipelineNotificationEvents.PIPELINE_EXECUTION_SUCCEEDED
            ],
            emails: ['me@example.edu']
        },
    },
    Environments: [
        {
            AWSAccountId: '2222',
            AWSRegion: 'us-west-2',
            Name: common.Name,
            College: common.College,
            Environment: ConfigEnvironments.SDLC,
            Version: "0.0.0",
            Parameters: {
                canCreateTask: common.canCreateTask,
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
                                    entryPoint: EntryPoint.SH,
                                    command: Command.ON_CREATE
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
                                    entryPoint: EntryPoint.PHP,
                                    command: Command.MIGRATE,
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
                ],
            }
        },
        {
            AWSAccountId: '3333',
            AWSRegion: 'us-west-2',
            Name: common.Name,
            College: common.College,
            Environment: ConfigEnvironments.PROD,
            Version: "0.0.0",
            Parameters: {
                canCreateTask: common.canCreateTask,
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
                                    entryPoint: EntryPoint.SH,
                                    command: Command.ON_CREATE
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
                                    entryPoint: EntryPoint.PHP,
                                    command: Command.MIGRATE,
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
