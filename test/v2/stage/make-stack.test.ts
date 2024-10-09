import {App, Stack} from "aws-cdk-lib";
import {ConfigEnvironments} from "../../../src/config/config-definitions";
import {ConfigStackHelper} from "../../../src/utils/config-stack-helper";
import {MakeStack} from "../../../src/v2/stage/make-stack";
import {TemplateHelper} from "../../../src/utils/testing/template-helper";
import {Template} from "aws-cdk-lib/assertions";
import {ScalableTypes, SchedulableTypes, TaskServiceType} from "../../../src/ecs/task-definitions";
import {EcrRepositoryType} from "../../../src/ecr/ecr-definitions";
import {EcrRepositories} from "../../../src/ecr/ecr-repositories";
import {EcrRepositoryFactory} from "../../../src/ecr/ecr-repository-factory";
import {ContainerType} from "../../../src/ecs/container-definitions";
import {ContainerCommand, ContainerEntryPoint} from "../../../src/ecs/container-command-factory";
import {BrefRuntime, LaravelHandler} from "../../../src/lambda/bref-definitions";
import {FunctionType} from "../../../src/lambda/lambda-definitions";
import path from "path";

describe('make stack test', () => {

    it('creates a default stack without lambda or ecs', () => {
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const envStackProps = {env: {region: 'us-west-2', account: '2222'}};
        const config = getMinConfig();
        const app = new App();
        const baseStack = new Stack(app, 'pcc-min-stack', stackProps);
        const name = ConfigStackHelper.getMainStackName(config);
        const stack = new MakeStack(baseStack, name, config, {}, envStackProps, {});
        stack.build();
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        // templateHelper.inspect();
        const expected = require('../__expected__/env/make-stack.min');
        templateHelper.template.templateMatches(expected);
    });

    it('creates an ecs only stack with only a queue', () => {
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const envStackProps = {env: {region: 'us-west-2', account: '2222'}};
        const config = getEcsConfigWithQueue();
        const app = new App();
        const baseStack = new Stack(app, 'pcc-shared-stack', stackProps);
        const ecrRepositories = new EcrRepositories(ConfigStackHelper.getAppName(config), {
            repositories: [EcrRepositoryType.NGINX, EcrRepositoryType.PHPFPM]
        });
        const factory = new EcrRepositoryFactory(baseStack, ConfigStackHelper.getAppName(config), ecrRepositories);
        factory.create();
        const name = ConfigStackHelper.getMainStackName(config);
        const stack = new MakeStack(baseStack, name, config, {}, envStackProps, {
            repositoryFactory: factory
        });
        stack.build();
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        // templateHelper.inspect();
        const expected = require('../__expected__/env/make-stack.ecs.queue');
        templateHelper.template.templateMatches(expected);
    });

    it('creates a full ecs only stack', () => {
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const envStackProps = {env: {region: 'us-west-2', account: '2222'}};
        const config = getFullEcsConfig();
        const app = new App();
        const baseStack = new Stack(app, 'pcc-shared-stack', stackProps);
        const ecrRepositories = new EcrRepositories(ConfigStackHelper.getAppName(config), {
            repositories: [EcrRepositoryType.NGINX, EcrRepositoryType.PHPFPM]
        });
        const factory = new EcrRepositoryFactory(baseStack, ConfigStackHelper.getAppName(config), ecrRepositories);
        factory.create();
        const name = ConfigStackHelper.getMainStackName(config);
        const stack = new MakeStack(baseStack, name, config, {}, envStackProps, {
            repositoryFactory: factory
        });
        stack.build();
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        // templateHelper.inspect();
        const expected = require('../__expected__/env/make-stack.ecs.queue');
        templateHelper.template.templateMatches(expected);
    });

    it('creates a lambda only stack with only a queue', () => {
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const envStackProps = {env: {region: 'us-west-2', account: '2222'}};
        const config = getLambdaConfigWithQueue();
        const app = new App();
        const baseStack = new Stack(app, 'pcc-shared-stack', stackProps);
        const name = ConfigStackHelper.getMainStackName(config);
        const stack = new MakeStack(baseStack, name, config, {}, envStackProps, {});
        stack.build();
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        // templateHelper.inspect();
        const expected = require('../__expected__/env/make-stack.lambda.queue');
        templateHelper.template.templateMatches(expected);
    });

    it('creates a full lambda only stack', () => {
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const envStackProps = {env: {region: 'us-west-2', account: '2222'}};
        const config = getFullLambdaConfig();
        const app = new App();
        const baseStack = new Stack(app, 'pcc-shared-stack', stackProps);
        const name = ConfigStackHelper.getMainStackName(config);
        const stack = new MakeStack(baseStack, name, config, {}, envStackProps, {});
        stack.build();
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        // templateHelper.inspect();
        const expected = require('../__expected__/env/make-stack.lambda.full');
        templateHelper.template.templateMatches(expected);
    });

    it('creates a default stack without dkim', () => {
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const envStackProps = {env: {region: 'us-west-2', account: '2222'}};
        const config = getMinConfigWithoutDkim();
        const app = new App();
        const baseStack = new Stack(app, 'pcc-shared-stack', stackProps);
        const name = ConfigStackHelper.getMainStackName(config);
        const stack = new MakeStack(baseStack, name, config, {}, envStackProps, {});
        stack.build();
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        // templateHelper.inspect();
        const expected = require('../__expected__/env/make-stack.min.without-dkim');
        templateHelper.template.templateMatches(expected);
    });

    it('creates a mixed stack using lambda for queue and scheduled and ecs for web and scheduled', () => {
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const envStackProps = {env: {region: 'us-west-2', account: '2222'}};
        const config = getFullConfig();
        const app = new App();
        const baseStack = new Stack(app, 'pcc-shared-stack', stackProps);
        const ecrRepositories = new EcrRepositories(ConfigStackHelper.getAppName(config), {
            repositories: [EcrRepositoryType.NGINX, EcrRepositoryType.PHPFPM]
        });
        const factory = new EcrRepositoryFactory(baseStack, ConfigStackHelper.getAppName(config), ecrRepositories);
        factory.create();
        const name = ConfigStackHelper.getMainStackName(config);
        const stack = new MakeStack(baseStack, name, config, {}, envStackProps, {
            repositoryFactory: factory
        });
        stack.build();
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        // templateHelper.inspect();
        const expected = require('../__expected__/env/make-stack.mixed');
        templateHelper.template.templateMatches(expected);
    });

    function getMinConfig() {
        return {
            AWSAccountId: '2222',
            AWSRegion: 'us-west-2',
            Name: 'myapp',
            College: 'PCC',
            Environment: ConfigEnvironments.SDLC,
            Version: "0.0.0",
            Parameters: {
                hostedZoneDomain: 'sdlc.example.edu',
                dynamoDb: {},
                subdomain: 'foo',
                s3: {},
                queue: {}
            }
        }
    }

    function getMinConfigWithoutDkim() {
        return {
            AWSAccountId: '2222',
            AWSRegion: 'us-west-2',
            Name: 'myapp',
            College: 'PCC',
            Environment: ConfigEnvironments.SDLC,
            Version: "0.0.0",
            Parameters: {
                createDkim: false,
                hostedZoneDomain: 'sdlc.example.edu',
                dynamoDb: {},
                subdomain: 'foo',
                s3: {},
                queue: {}
            }
        }
    }

    function getEcsConfigWithQueue() {
        return {
            AWSAccountId: '2222',
            AWSRegion: 'us-west-2',
            Name: 'myapp',
            College: 'PCC',
            Environment: ConfigEnvironments.SDLC,
            Version: "0.0.0",
            Parameters: {
                hostedZoneDomain: 'sdlc.example.edu',
                dynamoDb: {},
                subdomain: 'foo',
                s3: {},
                queue: {
                    hasDeadLetterQueue: true
                },
                ecs: {
                    listenerRule: {
                        priority: 100,
                        conditions: {
                            hostHeaders: ['test.dev.example.edu']
                        }
                    },
                    targetGroup: {},
                    queue: {
                        type: TaskServiceType.QUEUE_SERVICE,
                        image: EcrRepositoryType.PHPFPM,
                        cpu: 256
                    },
                    services: [],
                    tasks: []
                }
            }
        }
    }

    function getLambdaConfigWithQueue() {
        return {
            AWSAccountId: '2222',
            AWSRegion: 'us-west-2',
            Name: 'myapp',
            College: 'PCC',
            Environment: ConfigEnvironments.SDLC,
            Version: "0.0.0",
            Parameters: {
                hostedZoneDomain: 'sdlc.example.edu',
                dynamoDb: {},
                subdomain: 'foo',
                s3: {},
                queue: {
                    hasDeadLetterQueue: true
                },
                lambda: {
                    queue: {
                        functionProps: {
                            brefRuntime: BrefRuntime.PHP82,
                            type: FunctionType.QUEUE,
                            appPath: path.join(__dirname, '..', '__codebase__'),
                            lambdaTimeout: 120
                        }
                    }
                }
            }
        }
    }

    function getFullEcsConfig() {
        return {
            AWSAccountId: '2222',
            AWSRegion: 'us-west-2',
            Name: 'myapp',
            College: 'PCC',
            Environment: ConfigEnvironments.SDLC,
            Version: "0.0.0",
            Parameters: {
                sharedSecretArn: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-shared-secrets/environment-DEF456',
                sharedSecretKeys: ['FOO', 'BAR'],
                hostedZoneDomain: 'sdlc.example.edu',
                dynamoDb: {},
                subdomain: 'foo',
                s3: {},
                queue: {
                    hasDeadLetterQueue: true
                },
                ecs: {
                    listenerRule: {
                        priority: 100,
                        conditions: {
                            hostHeaders: ['test.dev.example.edu']
                        }
                    },
                    targetGroup: {},
                    queue: {
                        type: TaskServiceType.QUEUE_SERVICE,
                        image: EcrRepositoryType.PHPFPM,
                        cpu: 256
                    },
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
                    tasks: [
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
                    ]
                }
            }
        }
    }

    function getFullLambdaConfig() {
        return {
            AWSAccountId: '2222',
            AWSRegion: 'us-west-2',
            Name: 'myapp',
            College: 'PCC',
            Environment: ConfigEnvironments.SDLC,
            Version: "0.0.0",
            Parameters: {
                secretArn: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-test-secrets/environment-ABC123',
                sharedSecretArn: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-shared-secrets/environment-DEF456',
                alarmEmails: ['test@example.edu'],
                secretKeys: ['FOO', 'BAR'],
                sharedSecretKeys: ['FIZ'],
                hostedZoneDomain: 'sdlc.example.edu',
                dynamoDb: {},
                subdomain: 'foo',
                s3: {},
                queue: {
                    hasDeadLetterQueue: true
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
                        assetPathToCopy: path.join(__dirname, '..', '__codebase__', 'public'),
                        functionProps: {
                            appPath: path.join(__dirname, '..', '__codebase__'),
                            brefRuntime: BrefRuntime.PHP82FPM,
                        }
                    },
                    queue: {
                        functionProps: {
                            brefRuntime: BrefRuntime.PHP82,
                            type: FunctionType.QUEUE,
                            appPath: path.join(__dirname, '..', '__codebase__'),
                            lambdaTimeout: 120
                        }
                    },
                    functions: [
                        {
                            appPath: path.join(__dirname, '..', '__codebase__'),
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
    }

    function getFullConfig() {
        return {
            AWSAccountId: '2222',
            AWSRegion: 'us-west-2',
            Name: 'myapp',
            College: 'PCC',
            Environment: ConfigEnvironments.SDLC,
            Version: "0.0.0",
            Parameters: {
                secretArn: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-test-secrets/environment-ABC123',
                sharedSecretArn: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-shared-secrets/environment-DEF456',
                alarmEmails: ['test@example.edu'],
                secretKeys: ['FOO', 'BAR'],
                sharedSecretKeys: ['FIZ'],
                hostedZoneDomain: 'sdlc.example.edu',
                dynamoDb: {},
                subdomain: 'foo',
                s3: {},
                queue: {
                    hasDeadLetterQueue: true
                },
                lambda: {
                    queue: {
                        functionProps: {
                            brefRuntime: BrefRuntime.PHP82,
                            type: FunctionType.QUEUE,
                            appPath: path.join(__dirname, '..', '__codebase__'),
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
                            appPath: path.join(__dirname, '..', '__codebase__'),
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
                    listenerRule: {
                        priority: 100,
                        conditions: {
                            hostHeaders: ['foo.sdlc.example.edu']
                        }
                    },
                    targetGroup: {},
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
                    tasks: [
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
                    ]
                }
            }
        }
    }
});