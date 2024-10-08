import {resetStaticProps} from "../../src/utils/reset-static-props";
import {App, Stack} from "aws-cdk-lib";
import {Template} from "aws-cdk-lib/assertions";
import {Protocol} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import {ContainerCommand, ContainerEntryPoint} from "../../src/ecs/container-command-factory";
import {ScalableTypes, SchedulableTypes, TaskServiceType} from "../../src/ecs/task-definitions";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {ContainerType} from "../../src/ecs/container-definitions";
import {ConfigEnvironments} from "../../src/config/config-definitions";
import {ConfigStackHelper} from "../../src/utils/config-stack-helper";
import {EcrRepositoryType} from "../../src/ecr/ecr-definitions";
import {EcrRepositories} from "../../src/ecr/ecr-repositories";
import {EcrRepositoryFactory} from "../../src/ecr/ecr-repository-factory";
import {EnvEcsStack} from "../../src/env/env-ecs-stack";

describe('env ecs stack', () => {

    beforeEach(() => {
        resetStaticProps();
    });

    it('should do lookups', () => {
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const envConfig = {
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
                services: [],
                tasks: []
            }
        };
        const app = new App();
        const stack = new Stack(app, 'stack', stackProps);
        const ecrRepositories = new EcrRepositories(stack.node.id, {
            repositories: [EcrRepositoryType.NGINX, EcrRepositoryType.PHPFPM]
        });
        const factory = new EcrRepositoryFactory(stack, stack.node.id, ecrRepositories);
        factory.create();
        const envStack = new EnvEcsStack(stack, 'sdlc-stack', envConfig, {}, stackProps, {
            repositoryFactory: factory
        });
        envStack.build();
        expect(app.synth().manifest.missing).toEqual([
            {
                "key": "ssm:account=12344:parameterName=pcc-sdlc-alb01-arn:region=us-east-1",
                "props": {
                    "account": "12344",
                    "dummyValue": "dummy-value-for-pcc-sdlc-alb01-arn",
                    "ignoreErrorOnMissingContext": false,
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    "parameterName": "pcc-sdlc-alb01-arn",
                    "region": "us-east-1"
                },
                "provider": "ssm"
            },
            {
                "key": "load-balancer-listener:account=12344:listenerPort=443:listenerProtocol=HTTPS:loadBalancerArn=dummy-value-for-pcc-sdlc-alb01-arn:loadBalancerType=application:region=us-east-1",
                "props": {
                    "account": "12344",
                    "dummyValue": {
                        "listenerArn": "arn:aws:elasticloadbalancing:us-west-2:123456789012:listener/application/my-load-balancer/50dc6c495c0c9188/f2f7dc8efc522ab2",
                        "listenerPort": 80,
                        "securityGroupIds": [
                            "sg-123456789012"
                        ]
                    },
                    "listenerPort": 443,
                    "listenerProtocol": "HTTPS",
                    "loadBalancerArn": "dummy-value-for-pcc-sdlc-alb01-arn",
                    "loadBalancerType": "application",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    "region": "us-east-1"
                },
                "provider": "load-balancer-listener"
            },
            {
                "key": "security-group:account=12344:region=us-east-1:securityGroupId=sg-123456789012",
                "props": {
                    "account": "12344",
                    "dummyValue": {
                        "allowAllOutbound": true,
                        "securityGroupId": "sg-12345678"
                    },
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    "region": "us-east-1",
                    "securityGroupId": "sg-123456789012"
                },
                "provider": "security-group"
            },
            {
                "key": "load-balancer:account=12344:loadBalancerArn=dummy-value-for-pcc-sdlc-alb01-arn:loadBalancerType=application:region=us-east-1",
                "props": {
                    "account": "12344",
                    "dummyValue": {
                        "ipAddressType": "dualstack",
                        "loadBalancerArn": "arn:aws:elasticloadbalancing:us-west-2:123456789012:loadbalancer/application/my-load-balancer/50dc6c495c0c9188",
                        "loadBalancerCanonicalHostedZoneId": "Z3DZXE0EXAMPLE",
                        "loadBalancerDnsName": "my-load-balancer-1234567890.us-west-2.elb.amazonaws.com",
                        "securityGroupIds": [
                            "sg-1234"
                        ],
                        "vpcId": "vpc-12345"
                    },
                    "loadBalancerArn": "dummy-value-for-pcc-sdlc-alb01-arn",
                    "loadBalancerType": "application",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    "region": "us-east-1"
                },
                "provider": "load-balancer"
            },
            {
                "key": "vpc-provider:account=12344:filter.vpc-id=vpc-12345:region=us-east-1:returnAsymmetricSubnets=true",
                "props": {
                    "account": "12344",
                    "filter": {
                        "vpc-id": "vpc-12345"
                    },
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    "region": "us-east-1",
                    "returnAsymmetricSubnets": true
                },
                "provider": "vpc-provider"
            },
            {
                "key": "security-group:account=12344:region=us-east-1:securityGroupId=sg-1234",
                "props": {
                    "account": "12344",
                    "dummyValue": {
                        "allowAllOutbound": true,
                        "securityGroupId": "sg-12345678"
                    },
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    "region": "us-east-1",
                    "securityGroupId": "sg-1234"
                },
                "provider": "security-group"
            }
        ]);
    });

    it('should create env stack', () => {
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const envStackProps = {env: {region: 'us-west-2', account: '2222'}};
        const envConfig = getEnvConfig();
        const app = new App();
        const stack = new Stack(app, 'pcc-shared-stack', stackProps);
        const ecrRepositories = new EcrRepositories(ConfigStackHelper.getAppName(envConfig), {
            repositories: [EcrRepositoryType.NGINX, EcrRepositoryType.PHPFPM]
        });
        const factory = new EcrRepositoryFactory(stack, ConfigStackHelper.getAppName(envConfig), ecrRepositories);
        factory.create();
        const name = ConfigStackHelper.getMainStackName(envConfig);
        const envStack = new EnvEcsStack(stack, name, envConfig, {}, envStackProps, {
            repositoryFactory: factory
        });
        envStack.build();
        expect(app.synth().manifest.missing).toEqual([
            {
                "key": "ssm:account=2222:parameterName=pcc-sdlc-alb01-arn:region=us-west-2",
                "props": {
                    "account": "2222",
                    "dummyValue": "dummy-value-for-pcc-sdlc-alb01-arn",
                    "ignoreErrorOnMissingContext": false,
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::2222:role/cdk-hnb659fds-lookup-role-2222-us-west-2",
                    "parameterName": "pcc-sdlc-alb01-arn",
                    "region": "us-west-2"
                },
                "provider": "ssm"
            },
            {
                "key": "load-balancer-listener:account=2222:listenerPort=443:listenerProtocol=HTTPS:loadBalancerArn=dummy-value-for-pcc-sdlc-alb01-arn:loadBalancerType=application:region=us-west-2",
                "props": {
                    "account": "2222",
                    "dummyValue": {
                        "listenerArn": "arn:aws:elasticloadbalancing:us-west-2:123456789012:listener/application/my-load-balancer/50dc6c495c0c9188/f2f7dc8efc522ab2",
                        "listenerPort": 80,
                        "securityGroupIds": [
                            "sg-123456789012"
                        ]
                    },
                    "listenerPort": 443,
                    "listenerProtocol": "HTTPS",
                    "loadBalancerArn": "dummy-value-for-pcc-sdlc-alb01-arn",
                    "loadBalancerType": "application",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::2222:role/cdk-hnb659fds-lookup-role-2222-us-west-2",
                    "region": "us-west-2"
                },
                "provider": "load-balancer-listener"
            },
            {
                "key": "security-group:account=2222:region=us-west-2:securityGroupId=sg-123456789012",
                "props": {
                    "account": "2222",
                    "dummyValue": {
                        "allowAllOutbound": true,
                        "securityGroupId": "sg-12345678"
                    },
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::2222:role/cdk-hnb659fds-lookup-role-2222-us-west-2",
                    "region": "us-west-2",
                    "securityGroupId": "sg-123456789012"
                },
                "provider": "security-group"
            },
            {
                "key": "load-balancer:account=2222:loadBalancerArn=dummy-value-for-pcc-sdlc-alb01-arn:loadBalancerType=application:region=us-west-2",
                "props": {
                    "account": "2222",
                    "dummyValue": {
                        "ipAddressType": "dualstack",
                        "loadBalancerArn": "arn:aws:elasticloadbalancing:us-west-2:123456789012:loadbalancer/application/my-load-balancer/50dc6c495c0c9188",
                        "loadBalancerCanonicalHostedZoneId": "Z3DZXE0EXAMPLE",
                        "loadBalancerDnsName": "my-load-balancer-1234567890.us-west-2.elb.amazonaws.com",
                        "securityGroupIds": [
                            "sg-1234"
                        ],
                        "vpcId": "vpc-12345"
                    },
                    "loadBalancerArn": "dummy-value-for-pcc-sdlc-alb01-arn",
                    "loadBalancerType": "application",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::2222:role/cdk-hnb659fds-lookup-role-2222-us-west-2",
                    "region": "us-west-2"
                },
                "provider": "load-balancer"
            },
            {
                "key": "vpc-provider:account=2222:filter.vpc-id=vpc-12345:region=us-west-2:returnAsymmetricSubnets=true",
                "props": {
                    "account": "2222",
                    "filter": {
                        "vpc-id": "vpc-12345"
                    },
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::2222:role/cdk-hnb659fds-lookup-role-2222-us-west-2",
                    "region": "us-west-2",
                    "returnAsymmetricSubnets": true
                },
                "provider": "vpc-provider"
            },
            {
                "key": "security-group:account=2222:region=us-west-2:securityGroupId=sg-1234",
                "props": {
                    "account": "2222",
                    "dummyValue": {
                        "allowAllOutbound": true,
                        "securityGroupId": "sg-12345678"
                    },
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::2222:role/cdk-hnb659fds-lookup-role-2222-us-west-2",
                    "region": "us-west-2",
                    "securityGroupId": "sg-1234"
                },
                "provider": "security-group"
            },
            {
                "key": "hosted-zone:account=2222:domainName=dev.example.edu:region=us-west-2",
                "props": {
                    "account": "2222",
                    "domainName": "dev.example.edu",
                    "dummyValue": {
                        "Id": "DUMMY",
                        "Name": "dev.example.edu"
                    },
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::2222:role/cdk-hnb659fds-lookup-role-2222-us-west-2",
                    "region": "us-west-2"
                },
                "provider": "hosted-zone"
            }
        ]);
        const templateHelper = new TemplateHelper(Template.fromStack(envStack));
        // templateHelper.inspect();
        const expected = require('../__templates__/env-stack');
        templateHelper.template.templateMatches(expected);
    });

    it('should create env stack without dkim', () => {
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const envStackProps = {env: {region: 'us-west-2', account: '2222'}};
        const envConfig = getEnvConfigWithoutDkim();
        const app = new App();
        const stack = new Stack(app, 'pcc-shared-stack', stackProps);
        const ecrRepositories = new EcrRepositories(ConfigStackHelper.getAppName(envConfig), {
            repositories: [EcrRepositoryType.NGINX, EcrRepositoryType.PHPFPM]
        });
        const factory = new EcrRepositoryFactory(stack, ConfigStackHelper.getAppName(envConfig), ecrRepositories);
        factory.create();
        const name = ConfigStackHelper.getMainStackName(envConfig);
        const envStack = new EnvEcsStack(stack, name, envConfig, {}, envStackProps, {
            repositoryFactory: factory
        });
        envStack.build();
        const templateHelper = new TemplateHelper(Template.fromStack(envStack));
        // templateHelper.inspect();
        const expected = require('../__templates__/env-stack-without-dkim');
        templateHelper.template.templateMatches(expected);
    });

    it('should create env stack with shared secrets', () => {
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const envStackProps = {env: {region: 'us-west-2', account: '2222'}};
        const envConfig = getEnvConfigWithSharedSecrets();
        const app = new App();
        const stack = new Stack(app, 'pcc-shared-stack', stackProps);
        const ecrRepositories = new EcrRepositories(ConfigStackHelper.getAppName(envConfig), {
            repositories: [EcrRepositoryType.NGINX, EcrRepositoryType.PHPFPM]
        });
        const factory = new EcrRepositoryFactory(stack, ConfigStackHelper.getAppName(envConfig), ecrRepositories);
        factory.create();
        const name = ConfigStackHelper.getMainStackName(envConfig);
        const envStack = new EnvEcsStack(stack, name, envConfig, {}, envStackProps, {
            repositoryFactory: factory
        });
        envStack.build();
        const templateHelper = new TemplateHelper(Template.fromStack(envStack));
        // templateHelper.inspect();
        const expected = require('../__templates__/env-stack-with-shared-secrets');
        templateHelper.template.templateMatches(expected);
    });

    it('should create env stack with certificates', () => {
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const envStackProps = {env: {region: 'us-west-2', account: '2222'}};
        const envConfig = getEnvConfigWithCertificates();
        const app = new App();
        const stack = new Stack(app, 'pcc-shared-stack', stackProps);
        const ecrRepositories = new EcrRepositories(ConfigStackHelper.getAppName(envConfig), {
            repositories: [EcrRepositoryType.NGINX, EcrRepositoryType.PHPFPM]
        });
        const factory = new EcrRepositoryFactory(stack, ConfigStackHelper.getAppName(envConfig), ecrRepositories);
        factory.create();
        const name = ConfigStackHelper.getMainStackName(envConfig);
        const envStack = new EnvEcsStack(stack, name, envConfig, {}, envStackProps, {
            repositoryFactory: factory
        });
        envStack.build();
        const templateHelper = new TemplateHelper(Template.fromStack(envStack));
        // templateHelper.inspect();
        const expected = require('../__templates__/env-ecs-stack-with-certificates');
        templateHelper.template.templateMatches(expected);
    });

    it('should create env stack using premade queue', () => {
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const envStackProps = {env: {region: 'us-west-2', account: '2222'}};
        const envConfig = getEnvConfigForQueue();
        const app = new App();
        const stack = new Stack(app, 'pcc-shared-stack', stackProps);
        const ecrRepositories = new EcrRepositories(ConfigStackHelper.getAppName(envConfig), {
            repositories: [EcrRepositoryType.NGINX, EcrRepositoryType.PHPFPM]
        });
        const factory = new EcrRepositoryFactory(stack, ConfigStackHelper.getAppName(envConfig), ecrRepositories);
        factory.create();
        const name = ConfigStackHelper.getMainStackName(envConfig);
        const envStack = new EnvEcsStack(stack, name, envConfig, {}, envStackProps, {
            repositoryFactory: factory
        });
        envStack.build();
        const templateHelper = new TemplateHelper(Template.fromStack(envStack));
        // templateHelper.inspect();
        const expected = require('../__templates__/env-stack.queue');
        templateHelper.template.templateMatches(expected);
    });
});

function getEnvConfigForQueue() {
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
            queue: {
                type: TaskServiceType.QUEUE_SERVICE,
                image: EcrRepositoryType.PHPFPM,
                cpu: 256,
                hasDeadLetterQueue: true
            },
            services: [],
            tasks: []
        }
    };
}

function getEnvConfigWithCertificates() {
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
            hostedZoneDomain: 'dev.example.edu',
            subdomain: 'test',
            certificates: [
                {
                    domainName: 'test.dev.example.edu',
                    hostedZone: 'dev.example.edu',
                },
                {
                    domainName: 't1.test.dev.example.edu',
                    hostedZone: 'dev.example.edu',
                }
            ],
            services: [],
            tasks: []
        }
    };
}

function getEnvConfigWithSharedSecrets() {
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
            hostedZoneDomain: 'dev.example.edu',
            subdomain: 'test',
            sharedSecretArn: 'arn:aws:secretsmanager:us-west-2:33333:secret:pcc-sdlc-shared-secrets/environment-DEF456',
            sharedSecretKeys: ['FOO', 'BAR'],
            queue: {
                hasSecrets: true,
                type: TaskServiceType.QUEUE_SERVICE,
                image: EcrRepositoryType.PHPFPM,
                cpu: 256,
                hasDeadLetterQueue: true
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
                                additionalCommand: ['catalyst:daily']
                            }
                        ]
                    }
                }
            ]
        }
    };
}


function getEnvConfig() {
    return {
        AWSAccountId: '2222',
        AWSRegion: 'us-west-2',
        Name: 'myapp',
        College: 'PCC',
        Environment: ConfigEnvironments.SDLC,
        Version: "0.0.0",
        Parameters: {
            alarmEmails: ['test@example.edu'],
            secretKeys: ['FOO', 'BAR'],
            listenerRule: {
                priority: 100,
                conditions: {
                    hostHeaders: ['test.dev.example.edu']
                }
            },
            targetGroup: {},
            healthCheck: {
                path: '/api/healthz',
                protocol: Protocol.HTTP
            },
            hostedZoneDomain: 'dev.example.edu',
            subdomain: 'test',
            dynamoDb: {},
            startStop: {
                start: 'cron(0 13 * * ? *)',
                stop: 'cron(0 5 * * ? *)',
            },
            queue: {
                type: TaskServiceType.QUEUE_SERVICE,
                image: EcrRepositoryType.PHPFPM,
                cpu: 256,
                hasDeadLetterQueue: true
            },
            s3: {},
            tasks: [
                {
                    type: TaskServiceType.CREATE_RUN_ONCE_TASK,
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
            ]
        }
    };
}

function getEnvConfigWithoutDkim() {
    return {
        AWSAccountId: '2222',
        AWSRegion: 'us-west-2',
        Name: 'myapp',
        College: 'PCC',
        Environment: ConfigEnvironments.SDLC,
        Version: "0.0.0",
        Parameters: {
            createDkim: false,
            alarmEmails: ['test@example.edu'],
            secretKeys: ['FOO', 'BAR'],
            listenerRule: {
                priority: 100,
                conditions: {
                    hostHeaders: ['test.dev.example.edu']
                }
            },
            targetGroup: {},
            healthCheck: {
                path: '/api/healthz',
                protocol: Protocol.HTTP
            },
            hostedZoneDomain: 'dev.example.edu',
            subdomain: 'test',
            dynamoDb: {},
            startStop: {
                start: 'cron(0 13 * * ? *)',
                stop: 'cron(0 5 * * ? *)',
            },
            queue: {
                type: TaskServiceType.QUEUE_SERVICE,
                image: EcrRepositoryType.PHPFPM,
                cpu: 256,
                hasDeadLetterQueue: true
            },
            s3: {},
            tasks: [
                {
                    type: TaskServiceType.CREATE_RUN_ONCE_TASK,
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
            ]
        }
    };
}