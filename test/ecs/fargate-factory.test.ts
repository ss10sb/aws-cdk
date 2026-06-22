import {resetStaticProps} from "../../src/utils/reset-static-props";
import {Match, Template} from "aws-cdk-lib/assertions";
import {App, Stack} from "aws-cdk-lib";
import {ClusterFactory} from "../../src/ecs/cluster-factory";
import {ContainerCommand, ContainerEntryPoint} from "../../src/ecs/container-command-factory";
import {ScalableTypes, TaskServiceType} from "../../src/ecs/task-definitions";
import {Secrets} from "../../src/secret/secrets";
import {ContainerType} from "../../src/ecs/container-definitions";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {ConfigEnvironments} from "../../src/config/config-definitions";
import {EcrRepositoryType} from "../../src/ecr/ecr-definitions";
import {FargateFactory} from "../../src/ecs/fargate-factory";
import {EcrRepositories} from "../../src/ecr/ecr-repositories";
import {EnvConfig} from "../../src/env/env-base-stack";
import {EcrRepositoryFactory} from "../../src/ecr/ecr-repository-factory";
import {AlbTargetGroup} from "../../src/alb/alb-target-group";
import {VpcHelper} from "../../src/utils/vpc-helper";

const ecrRepoProps = {
    repositories: [EcrRepositoryType.NGINX, EcrRepositoryType.PHPFPM]
};

describe('fargate factory', () => {

    beforeEach(() => {
        resetStaticProps();
    });

    it('should create fargate deployment', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const secretKeys = ['FOO', 'BAR'];
        const environment = {
            FIZZ: 'buzz'
        };
        const envConfig = <EnvConfig>{
            Name: 'test',
            College: 'PCC',
            Environment: ConfigEnvironments.PROD,
            Parameters: {
                targetGroup: {},
                listenerRule: {
                    priority: 100,
                    conditions: {
                        hostHeaders: ['test.example.edu']
                    }
                },
                services: [],
                tasks: []
            }
        }
        const ecrRepositories = new EcrRepositories('stack', ecrRepoProps);
        const ecrRepositoryFactory = new EcrRepositoryFactory(stack, 'stack', ecrRepositories);
        const secrets = new Secrets(stack, 'stack');
        const vpc = VpcHelper.getVpcById(stack, 'vpcId');
        const clusterFactory = new ClusterFactory(stack, 'stack', {
            vpc: vpc
        });
        const cluster = clusterFactory.create();
        const albTargetGroup = new AlbTargetGroup(stack, 'target-group', vpc);
        const targetGroup = albTargetGroup.create(envConfig.Parameters.targetGroup ?? {});
        const fargateFactory = new FargateFactory(stack, 'stack', {
            commandFactoryProps: {},
            containerFactoryProps: {
                repositoryFactory: ecrRepositoryFactory,
                secretKeys: secretKeys,
                environment: environment,
                secrets: secrets
            },
            queueFactoryProps: {
                cluster: cluster,
                repositoryFactory: ecrRepositoryFactory,
                secretKeys: secretKeys,
                environment: environment,
                secrets: secrets
            },
            standardServiceFactoryProps: {
                cluster: cluster,
                targetGroup: targetGroup
            },
            taskDefinitionFactoryProps: {},
            taskFactoryProps: {
                cluster: cluster,
                skipCreateTask: false
            }
        });
        const tasks = [
            {
                type: TaskServiceType.RUN_ONCE_TASK,
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
            }
        ];
        const services = [
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
        ];
        const queue = {
            type: TaskServiceType.QUEUE_SERVICE,
            image: 'phpfpm',
            hasSecrets: true,
            hasEnv: true,
            cpu: 256,
            memoryLimitMiB: 512,
            hasDeadLetterQueue: true,
        };
        fargateFactory.create(tasks, services, queue);
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        // templateHelper.inspect();
        const expected = require('../__templates__/fargate-factory.defaults');
        templateHelper.template.templateMatches(expected);
    });
});