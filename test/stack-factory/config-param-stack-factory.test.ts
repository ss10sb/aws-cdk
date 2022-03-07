import {ConfigParamStackFactory} from "../../src/stack-factory";
import path from "node:path";
import {TemplateHelper} from "../../src/utils/testing";
import {Match, Template} from "aws-cdk-lib/assertions";
import {buildConfigParamStack} from "../../src";

const configDir = path.join(__dirname, '/../__configLive__');

describe('config param stack factory', () => {

    it('should throw error if not initialized', () => {

        const stackFactory = new ConfigParamStackFactory({
            configDir: configDir
        });
        expect(() => stackFactory.buildStack()).toThrowError('Not initialized.');
    });

    it('should throw error if no live config loaded', () => {

        const stackFactory = new ConfigParamStackFactory({
            configDir: '/foo/bar'
        });
        expect(() => stackFactory.initialize()).toThrowError('Missing config keys: College Name');
    });

    it('should create config param from local config', () => {
        const stackFactory = new ConfigParamStackFactory({
            configDir: configDir
        });
        stackFactory.initialize();
        const stack = stackFactory.buildStack();
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        const expected = getExpected();
        templateHelper.expectResource('AWS::SSM::Parameter', {
            properties: Match.objectEquals({
                Type: 'AWS::SSM::Parameter',
                Properties: {
                    Type: 'String',
                    Value: JSON.stringify(expected),
                    Name: '/pcc-shared-test/config',
                    Tags: {App: 'test', College: 'PCC', Environment: 'shared'},
                    Tier: 'Standard'
                }
            })
        });
    });

    it('should create config param from local config using helper function', () => {
        const stack = buildConfigParamStack({
            configDir: configDir
        });
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        const expected = getExpected();
        templateHelper.expectResource('AWS::SSM::Parameter', {
            properties: Match.objectEquals({
                Type: 'AWS::SSM::Parameter',
                Properties: {
                    Type: 'String',
                    Value: JSON.stringify(expected),
                    Name: '/pcc-shared-test/config',
                    Tags: {App: 'test', College: 'PCC', Environment: 'shared'},
                    Tier: 'Standard'
                }
            })
        });
    });
});

function getExpected() {
    return {
        "Name": "test",
        "College": "PCC",
        "Environment": "shared",
        "Parameters": {
            "repositories": {"repositories": ["nginx", "phpfpm"]},
            "sourceProps": {
                "owner": "repoOwner",
                "repo": "repoName",
                "connectionArn": "arn:aws:codestar-connections:us-west-2:accountId:connection/randomUUID"
            },
            "pipelineNotification": {
                "detailType": "FULL",
                "events": ["codepipeline-pipeline-pipeline-execution-failed", "codepipeline-pipeline-pipeline-execution-succeeded", "codepipeline-pipeline-manual-approval-needed"],
                "emails": ["admin@example.edu"]
            },
            "runPipelineSchedule": "cron(0 8 ? * 2#1 *)"
        },
        "Environments": [{
            "AWSAccountId": "11111",
            "AWSRegion": "us-west-2",
            "Name": "test",
            "College": "PCC",
            "Environment": "sdlc",
            "Version": "0.0.0",
            "Parameters": {
                "canCreateTask": true,
                "alarmEmails": ["sdlc@example.edu"],
                "hostedZoneDomain": "sdlc.example.edu",
                "dynamoDb": {},
                "healthCheck": {"path": "/api/healthz", "protocol": "HTTP"},
                "listenerRule": {"priority": 100, "conditions": {"hostHeaders": ["test.sdlc.example.edu"]}},
                "subdomain": "test",
                "targetGroup": {},
                "startStop": {"stop": "cron(0 5 * * ? *)"},
                "tasks": [{
                    "type": "createruntask",
                    "taskDefinition": {
                        "cpu": "256",
                        "memoryMiB": "512",
                        "containers": [{
                            "type": "crot",
                            "image": "phpfpm",
                            "hasSecrets": true,
                            "hasEnv": true,
                            "cpu": 256,
                            "memoryLimitMiB": 512,
                            "essential": true,
                            "dependency": true,
                            "entryPoint": 1,
                            "command": 1
                        }]
                    }
                }, {
                    "type": "updateruntask",
                    "taskDefinition": {
                        "cpu": "256",
                        "memoryMiB": "512",
                        "containers": [{
                            "type": "urot",
                            "image": "phpfpm",
                            "hasSecrets": true,
                            "hasEnv": true,
                            "cpu": 256,
                            "memoryLimitMiB": 512,
                            "essential": true,
                            "dependsOn": true,
                            "entryPoint": 0,
                            "command": 3
                        }]
                    }
                }],
                "services": [{
                    "type": "web",
                    "attachToTargetGroup": true,
                    "enableExecuteCommand": true,
                    "scalable": {"types": ["cpu", "mem"], "scaleAt": 75, "minCapacity": 1, "maxCapacity": 3},
                    "taskDefinition": {
                        "cpu": "256",
                        "memoryMiB": "512",
                        "containers": [{
                            "image": "nginx",
                            "cpu": 64,
                            "memoryLimitMiB": 64,
                            "portMappings": [{"containerPort": 80}]
                        }, {
                            "image": "phpfpm",
                            "hasSecrets": true,
                            "hasEnv": true,
                            "cpu": 128,
                            "memoryLimitMiB": 128,
                            "portMappings": [{"containerPort": 9000}]
                        }]
                    }
                }],
                "secretKeys": ["ADMIN_USER_ID", "APP_NAME", "APP_KEY", "APP_URL"]
            }
        }, {
            "AWSAccountId": "22222",
            "AWSRegion": "us-west-2",
            "Name": "test",
            "College": "PCC",
            "Environment": "prod",
            "Version": "0.0.0",
            "Parameters": {
                "canCreateTask": true,
                "alarmEmails": ["prod@example.edu"],
                "hostedZoneDomain": "example.edu",
                "dynamoDb": {},
                "healthCheck": {"path": "/api/healthz", "protocol": "HTTP"},
                "listenerRule": {"priority": 100, "conditions": {"hostHeaders": ["test.example.edu"]}},
                "subdomain": "test",
                "targetGroup": {},
                "steps": {"manualApproval": {}},
                "tasks": [{
                    "type": "createruntask",
                    "taskDefinition": {
                        "cpu": "256",
                        "memoryMiB": "512",
                        "containers": [{
                            "type": "crot",
                            "image": "phpfpm",
                            "hasSecrets": true,
                            "hasEnv": true,
                            "cpu": 256,
                            "memoryLimitMiB": 512,
                            "essential": true,
                            "dependency": true,
                            "entryPoint": 1,
                            "command": 1
                        }]
                    }
                }, {
                    "type": "updateruntask",
                    "taskDefinition": {
                        "cpu": "256",
                        "memoryMiB": "512",
                        "containers": [{
                            "type": "urot",
                            "image": "phpfpm",
                            "hasSecrets": true,
                            "hasEnv": true,
                            "cpu": 256,
                            "memoryLimitMiB": 512,
                            "essential": true,
                            "dependsOn": true,
                            "entryPoint": 0,
                            "command": 3
                        }]
                    }
                }, {
                    "type": "scheduledtask",
                    "schedule": {"type": 1, "value": "cron(0 12 * * ? *)"},
                    "taskDefinition": {
                        "cpu": "256",
                        "memoryMiB": "512",
                        "containers": [{
                            "type": "st",
                            "image": "phpfpm",
                            "hasSecrets": true,
                            "hasEnv": true,
                            "cpu": 256,
                            "memoryLimitMiB": 512,
                            "essential": true,
                            "dependsOn": true,
                            "entryPoint": 0,
                            "command": 0,
                            "additionalCommand": ["catalyst:daily"]
                        }]
                    }
                }],
                "services": [{
                    "type": "web",
                    "attachToTargetGroup": true,
                    "enableExecuteCommand": true,
                    "scalable": {"types": ["cpu", "mem"], "scaleAt": 75, "minCapacity": 1, "maxCapacity": 3},
                    "taskDefinition": {
                        "cpu": "512",
                        "memoryMiB": "1024",
                        "containers": [{
                            "image": "nginx",
                            "cpu": 64,
                            "memoryLimitMiB": 64,
                            "portMappings": [{"containerPort": 80}]
                        }, {
                            "image": "phpfpm",
                            "hasSecrets": true,
                            "hasEnv": true,
                            "cpu": 128,
                            "memoryLimitMiB": 128,
                            "portMappings": [{"containerPort": 9000}]
                        }]
                    }
                }],
                "secretKeys": ["ADMIN_USER_ID", "APP_NAME", "APP_KEY", "APP_URL"]
            }
        }]
    };
}