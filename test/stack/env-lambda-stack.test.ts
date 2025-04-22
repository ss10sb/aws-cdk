import {resetStaticProps} from "../../src/utils/reset-static-props";
import {App, Stack} from "aws-cdk-lib";
import path from "path";
import {Template} from "aws-cdk-lib/assertions";
import {EnvEndpointType} from "../../src/env/env-definitions";
import {EnvLambdaStack} from "../../src/env/env-lambda-stack";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {FunctionType} from "../../src/lambda/lambda-definitions";
import {BrefRuntime} from "../../src/lambda/bref-definitions";
import {ConfigEnvironments} from "../../src/config/config-definitions";
import {ConfigStackHelper} from "../../src/utils/config-stack-helper";

describe('env lamdba stack', () => {

    beforeEach(() => {
        resetStaticProps();
    });

    it('should create env stack for alb target', () => {
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const envStackProps = {env: {region: 'us-west-2', account: '2222'}};
        const envConfig = getEnvConfigForAlbTarget();
        const app = new App();
        const stack = new Stack(app, 'pcc-shared-stack', stackProps);
        const name = ConfigStackHelper.getMainStackName(envConfig);
        const envStack = new EnvLambdaStack(stack, name, envConfig, {}, envStackProps, {});
        envStack.build();
        const templateHelper = new TemplateHelper(Template.fromStack(envStack));
        // templateHelper.inspect();
        const expected = require('../__templates__/env-lambda-stack-alb-target');
        templateHelper.template.templateMatches(expected);
    });

    it('should create env stack for alb target without dkim', () => {
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const envStackProps = {env: {region: 'us-west-2', account: '2222'}};
        const envConfig = getEnvConfigForAlbTargetWithoutDkim();
        const app = new App();
        const stack = new Stack(app, 'pcc-shared-stack', stackProps);
        const name = ConfigStackHelper.getMainStackName(envConfig);
        const envStack = new EnvLambdaStack(stack, name, envConfig, {}, envStackProps, {});
        envStack.build();
        const templateHelper = new TemplateHelper(Template.fromStack(envStack));
        // templateHelper.inspect();
        const expected = require('../__templates__/env-lambda-stack-alb-target-without-dkim');
        templateHelper.template.templateMatches(expected);
    });

    it('should create env stack for alb target with shared secrets', () => {
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const envStackProps = {env: {region: 'us-west-2', account: '2222'}};
        const envConfig = getEnvConfigForAlbTargetWithSharedSecrets();
        const app = new App();
        const stack = new Stack(app, 'pcc-shared-stack', stackProps);
        const name = ConfigStackHelper.getMainStackName(envConfig);
        const envStack = new EnvLambdaStack(stack, name, envConfig, {}, envStackProps, {});
        envStack.build();
        const templateHelper = new TemplateHelper(Template.fromStack(envStack));
        // templateHelper.inspect();
        const expected = require('../__templates__/env-lambda-stack-alb-target-shared-secrets');
        templateHelper.template.templateMatches(expected);
    });

    function getEnvConfigForAlbTarget() {
        return {
            AWSAccountId: '2222',
            AWSRegion: 'us-west-2',
            Name: 'myapp',
            College: 'PCC',
            Environment: ConfigEnvironments.SDLC,
            Version: "0.0.0",
            Parameters: {
                listenerRule: {
                    priority: 100,
                    conditions: {
                        hostHeaders: ['test.dev.example.edu']
                    }
                },
                targetGroup: {},
                endpointType: EnvEndpointType.LOADBALANCER,
                secretArn: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-test-secrets/environment-ABC123',
                alarmEmails: ['test@example.edu'],
                secretKeys: ['FOO', 'BAR'],
                hostedZoneDomain: 'dev.example.edu',
                subdomain: 'test',
                dynamoDb: {},
                asAlbTarget: {
                    assetPrefix: 'assets',
                    assetPathToCopy: path.join(__dirname, '..', '__codebase__', 'public'),
                    functionProps: {
                        appPath: path.join(__dirname, '..', '__codebase__'),
                        brefRuntime: BrefRuntime.PHP81FPM,
                    }
                },
                queue: {
                    hasDeadLetterQueue: true,
                    functionProps: {
                        brefRuntime: BrefRuntime.PHP81,
                        type: FunctionType.QUEUE,
                        appPath: path.join(__dirname, '..', '__codebase__'),
                        lambdaTimeout: 120,
                        lambdaHandler: 'worker.php'
                    }
                },
                functions: []
            }
        };
    }

    function getEnvConfigForAlbTargetWithoutDkim() {
        return {
            AWSAccountId: '2222',
            AWSRegion: 'us-west-2',
            Name: 'myapp',
            College: 'PCC',
            Environment: ConfigEnvironments.SDLC,
            Version: "0.0.0",
            Parameters: {
                createDkim: false,
                listenerRule: {
                    priority: 100,
                    conditions: {
                        hostHeaders: ['test.dev.example.edu']
                    }
                },
                targetGroup: {},
                endpointType: EnvEndpointType.LOADBALANCER,
                secretArn: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-test-secrets/environment-ABC123',
                alarmEmails: ['test@example.edu'],
                secretKeys: ['FOO', 'BAR'],
                hostedZoneDomain: 'dev.example.edu',
                subdomain: 'test',
                dynamoDb: {},
                asAlbTarget: {
                    assetPrefix: 'assets',
                    assetPathToCopy: path.join(__dirname, '..', '__codebase__', 'public'),
                    functionProps: {
                        appPath: path.join(__dirname, '..', '__codebase__'),
                        brefRuntime: BrefRuntime.PHP81FPM,
                    }
                },
                queue: {
                    hasDeadLetterQueue: true,
                    functionProps: {
                        brefRuntime: BrefRuntime.PHP81,
                        type: FunctionType.QUEUE,
                        appPath: path.join(__dirname, '..', '__codebase__'),
                        lambdaTimeout: 120,
                        lambdaHandler: 'worker.php'
                    }
                },
                functions: []
            }
        };
    }

    function getEnvConfigForAlbTargetWithSharedSecrets() {
        return {
            AWSAccountId: '2222',
            AWSRegion: 'us-west-2',
            Name: 'myapp',
            College: 'PCC',
            Environment: ConfigEnvironments.SDLC,
            Version: "0.0.0",
            Parameters: {
                listenerRule: {
                    priority: 100,
                    conditions: {
                        hostHeaders: ['test.dev.example.edu']
                    }
                },
                targetGroup: {},
                endpointType: EnvEndpointType.LOADBALANCER,
                secretArn: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-test-secrets/environment-ABC123',
                sharedSecretArn: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-shared-secrets/environment-DEF456',
                alarmEmails: ['test@example.edu'],
                secretKeys: ['FOO', 'BAR'],
                sharedSecretKeys: ['FIZ'],
                hostedZoneDomain: 'dev.example.edu',
                subdomain: 'test',
                dynamoDb: {},
                asAlbTarget: {
                    assetPrefix: 'assets',
                    assetPathToCopy: path.join(__dirname, '..', '__codebase__', 'public'),
                    functionProps: {
                        appPath: path.join(__dirname, '..', '__codebase__'),
                        brefRuntime: BrefRuntime.PHP81FPM,
                    }
                },
                queue: {
                    hasDeadLetterQueue: true,
                    functionProps: {
                        brefRuntime: BrefRuntime.PHP81,
                        type: FunctionType.QUEUE,
                        appPath: path.join(__dirname, '..', '__codebase__'),
                        lambdaTimeout: 120,
                        lambdaHandler: 'worker.php'
                    }
                },
                functions: []
            }
        };
    }

    function getEnvConfigForDistribution() {
        return {
            AWSAccountId: '2222',
            AWSRegion: 'us-west-2',
            Name: 'myapp',
            College: 'PCC',
            Environment: ConfigEnvironments.SDLC,
            Version: "0.0.0",
            Parameters: {
                endpointType: EnvEndpointType.CLOUDFRONT,
                secretArn: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-test-secrets/environment-ABC123',
                alarmEmails: ['test@example.edu'],
                secretKeys: ['FOO', 'BAR'],
                hostedZoneDomain: 'dev.example.edu',
                subdomain: 'test',
                dynamoDb: {},
                distribution: {
                    assetBucket: {},
                    assetPath: '/assets/*',
                    assetPathToCopy: path.join(__dirname, '..', '__codebase__', 'public'),
                    functionProps: {
                        appPath: path.join(__dirname, '..', '__codebase__'),
                        brefRuntime: BrefRuntime.PHP81FPM,
                    },
                    apiProps: {},
                    webAclId: 'arn:aws:wafv2:us-east-1:123456789012:global/webacl/pccprodwafcf-arn-random-characters',
                },
                queue: {
                    hasDeadLetterQueue: true,
                    functionProps: {
                        brefRuntime: BrefRuntime.PHP81,
                        type: FunctionType.QUEUE,
                        appPath: path.join(__dirname, '..', '__codebase__'),
                        lambdaTimeout: 120,
                        lambdaHandler: 'worker.php'
                    }
                },
                functions: []
            }
        };
    }
});