const common = require('./_common');
const {ConfigEnvironments} = require("../../../../src/config/config-definitions");
const {PipelineNotificationEvents} = require("aws-cdk-lib/aws-codepipeline");
const {DetailType} = require("aws-cdk-lib/aws-codestarnotifications");
const {BrefRuntime, LaravelHandler} = require("../../../../src/lambda/bref-definitions");
const {FunctionType} = require("../../../../src/lambda/lambda-definitions");
const path = require("path");

module.exports = {
    Name: common.Name,
    College: common.College,
    Environment: ConfigEnvironments.SHARED,
    Version: "0.0.0",
    Parameters: {
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
        buildStep: {},
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
                queue: {},
                startStop: {
                    stop: 'cron(0 5 * * ? *)',
                },
                lambda: {
                    listenerRule: {
                        priority: 100,
                        conditions: {
                            hostHeaders: ['foo.sdlc.example.edu']
                        }
                    },
                    targetGroup: {},
                    asAlbTarget: {
                        assetPrefix: 'assets',
                        assetPathToCopy: path.join(__dirname, '..', '..', '__codebase__', 'public'),
                        functionProps: {
                            appPath: path.join(__dirname, '..', '..', '__codebase__'),
                            brefRuntime: BrefRuntime.PHP82FPM,
                        }
                    },
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
                            brefRuntime: [BrefRuntime.PHP82, BrefRuntime.CONSOLE],
                            scheduledEvents: [
                                {
                                    schedule: 'rate(5 minutes)',
                                    eventInput: {cli: 'schedule:run'}
                                }
                            ]
                        }
                    ]
                }
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
                queue: {},
                steps: {
                    manualApproval: {}
                },
                lambda: {
                    listenerRule: {
                        priority: 100,
                        conditions: {
                            hostHeaders: ['foo.sdlc.example.edu']
                        }
                    },
                    targetGroup: {},
                    asAlbTarget: {
                        assetPrefix: 'assets',
                        assetPathToCopy: path.join(__dirname, '..', '..', '__codebase__', 'public'),
                        functionProps: {
                            appPath: path.join(__dirname, '..', '..', '__codebase__'),
                            brefRuntime: BrefRuntime.PHP82FPM,
                        }
                    },
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
                            brefRuntime: [BrefRuntime.PHP82, BrefRuntime.CONSOLE],
                            scheduledEvents: [
                                {
                                    schedule: 'rate(5 minutes)',
                                    eventInput: {cli: 'schedule:run'}
                                }
                            ]
                        }
                    ]
                }
            }
        }
    ]
}
