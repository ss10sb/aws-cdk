import {resetStaticProps} from "../../src/utils/reset-static-props";
import {App, Stack} from "aws-cdk-lib";
import {EnvStack} from "../../src/env";
import {ConfigEnvironments} from "../../src/config";
import {EcrRepositories, EcrRepositoryFactory, EcrRepositoryType} from "../../src/ecr";
import {TemplateHelper} from "../../src/utils/testing";
import {Template} from "aws-cdk-lib/assertions";
import {
    ContainerCommand,
    ContainerEntryPoint,
    ContainerType,
    ScalableTypes,
    SchedulableTypes,
    TaskServiceType
} from "../../src/ecs";
import {Protocol} from "aws-cdk-lib/aws-elasticloadbalancingv2";

describe('env stack', () => {

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
        const envStack = new EnvStack(stack, 'sdlc-stack', envConfig, {
            repositoryFactory: factory
        }, {}, stackProps);
        envStack.build();
        expect(app.synth().manifest.missing).toEqual([
            {
                "key": "ssm:account=12344:parameterName=pcc-sdlc-alb01-arn:region=us-east-1",
                "props": {
                    "account": "12344",
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
        const stack = new Stack(app, 'stack', stackProps);
        const ecrRepositories = new EcrRepositories(stack.node.id, {
            repositories: [EcrRepositoryType.NGINX, EcrRepositoryType.PHPFPM]
        });
        const factory = new EcrRepositoryFactory(stack, stack.node.id, ecrRepositories);
        factory.create();
        const envStack = new EnvStack(stack, 'sdlc-stack', envConfig, {
            repositoryFactory: factory
        }, {}, envStackProps);
        envStack.build();
        expect(app.synth().manifest.missing).toEqual([
            {
                "key": "ssm:account=2222:parameterName=pcc-sdlc-alb01-arn:region=us-west-2",
                "props": {
                    "account": "2222",
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
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::2222:role/cdk-hnb659fds-lookup-role-2222-us-west-2",
                    "region": "us-west-2"
                },
                "provider": "hosted-zone"
            }
        ]);
        const templateHelper = new TemplateHelper(Template.fromStack(envStack));
        const expected = require('../__templates__/env-stack');
        templateHelper.template.templateMatches(expected);
    });
});

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
            ]
        }
    };
}