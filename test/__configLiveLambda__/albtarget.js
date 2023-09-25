const common = require('./_common');
const {ConfigEnvironments} = require("../../src/config/config-definitions");
const {PipelineNotificationEvents} = require("aws-cdk-lib/aws-codepipeline");
const {DetailType} = require("aws-cdk-lib/aws-codestarnotifications");
const path = require("path");
const {EnvBuildType, EnvEndpointType} = require("../../src/env/env-definitions");
const {BrefRuntime} = require("../../src/lambda/bref-definitions");
const {ApiType} = require("../../src/lambda/lambda-definitions");

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
                listenerRule: {
                    priority: common.priority,
                    conditions: {
                        hostHeaders: [`${common.subdomain}.sdlc.${common.domain}`]
                    }
                },
                targetGroup: {},
                buildType: EnvBuildType.LAMBDA,
                endpointType: EnvEndpointType.LOADBALANCER,
                alarmEmails: ['sdlc@example.edu'],
                hostedZoneDomain: `sdlc.${common.domain}`,
                dynamoDb: {},
                subdomain: common.subdomain,
                asAlbTarget: {
                    assetPrefix: 'assets',
                    assetPathToCopy: path.resolve(__dirname, '..', '__codebase__', 'public'),
                    functionProps: {
                        appPath: path.resolve(__dirname, '..', '__codebase__'),
                        brefRuntime: BrefRuntime.PHP81FPM
                    }
                }
            }
        }
    ]
}
