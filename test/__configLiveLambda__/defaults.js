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
                buildType: EnvBuildType.LAMBDA,
                endpointType: EnvEndpointType.CLOUDFRONT,
                alarmEmails: ['sdlc@example.edu'],
                hostedZoneDomain: `sdlc.${common.domain}`,
                dynamoDb: {},
                subdomain: common.subdomain,
                asAlbTarget: {
                    assetPrefix: 'assets',
                    assetPathToCopy: path.resolve(__dirname, '..', '__codebase__', 'public'),
                    functionProps: {
                        appPath: path.resolve(__dirname, '..', '__codebase__'),
                        brefRuntime: BrefRuntime.PHP83FPM
                    }
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
                buildType: EnvBuildType.LAMBDA,
                endpointType: EnvEndpointType.CLOUDFRONT,
                secretArn: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-prod-test-secrets/environment-ABC123',
                alarmEmails: ['prod@example.edu'],
                hostedZoneDomain: common.domain,
                dynamoDb: {},
                subdomain: common.subdomain,
                steps: {
                    manualApproval: {}
                },
                asAlbTarget: {
                    assetPrefix: 'assets',
                    assetPathToCopy: path.resolve(__dirname, '..', '__codebase__', 'public'),
                    functionProps: {
                        appPath: path.resolve(__dirname, '..', '__codebase__'),
                        brefRuntime: BrefRuntime.PHP83FPM
                    }
                }
            }
        }
    ]
}
