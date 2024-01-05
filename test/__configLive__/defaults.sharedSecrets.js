const common = require('./_common');
const {ConfigEnvironments} = require("../../src/config/config-definitions");
const {PipelineNotificationEvents} = require("aws-cdk-lib/aws-codepipeline");
const {DetailType} = require("aws-cdk-lib/aws-codestarnotifications");
const {Protocol} = require("aws-cdk-lib/aws-elasticloadbalancingv2");
const {EcrRepositoryType} = require("../../src/ecr/ecr-definitions");
const {TaskServiceType, ScalableTypes, SchedulableTypes} = require("../../src/ecs/task-definitions");
const {ContainerType} = require("../../src/ecs/container-definitions");
const {ContainerEntryPoint, ContainerCommand} = require("../../src/ecs/container-command-factory");

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
                sharedSecretArn: 'arn:aws:secretsmanager:us-west-2:11111:secret:pcc-sdlc-shared-secrets/environment-abc123',
                sharedSecretKeys: ['AZURE_CLIENT_ID', 'AZURE_CLIENT_SECRET', 'AZURE_TENANT_ID'],
                tasks: [],
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
                sharedSecretArn: 'arn:aws:secretsmanager:us-west-2:22222:secret:pcc-prod-shared-secrets/environment-abc123',
                sharedSecretKeys: ['AZURE_CLIENT_ID', 'AZURE_CLIENT_SECRET', 'AZURE_TENANT_ID', 'AZURE_FOO'],
                tasks: [],
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
