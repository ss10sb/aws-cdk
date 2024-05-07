import {Match, Template} from "aws-cdk-lib/assertions";
import {resetStaticProps} from "../../src/utils/reset-static-props";
import {App, Stack} from "aws-cdk-lib";
import {Cluster} from "aws-cdk-lib/aws-ecs";
import {ContainerCommand, ContainerCommandFactory, ContainerEntryPoint} from "../../src/ecs/container-command-factory";
import {TaskDefinitionFactory} from "../../src/ecs/task-definition-factory";
import {Secrets} from "../../src/secret/secrets";
import {ContainerType} from "../../src/ecs/container-definitions";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {EcsTaskFactory} from "../../src/ecs/ecs-task-factory";
import {EcrRepositoryType} from "../../src/ecr/ecr-definitions";
import {EcrRepositories} from "../../src/ecr/ecr-repositories";
import {SchedulableTypes, TaskServiceType} from "../../src/ecs/task-definitions";
import {ContainerFactory} from "../../src/ecs/container-factory";
import {EcrRepositoryFactory} from "../../src/ecr/ecr-repository-factory";
import {VpcHelper} from "../../src/utils/vpc-helper";

const ecrRepoProps = {
    repositories: [EcrRepositoryType.NGINX, EcrRepositoryType.PHPFPM]
};

describe('ecs task factory', () => {

    beforeEach(() => {
        resetStaticProps();
    });

    it('should create scheduled task from defaults', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const vpc = VpcHelper.getVpcById(stack, 'vpcId');
        const cluster = new Cluster(stack, 'cluster', {
            vpc: vpc
        });
        const ecrRepositories = new EcrRepositories('my-repos', ecrRepoProps);
        const taskFactory = new EcsTaskFactory(stack, 'task', {
            cluster: cluster,
            taskDefinitionFactory: new TaskDefinitionFactory(stack, 'task-def', {
                containerFactory: new ContainerFactory(stack, 'container', {
                    repositoryFactory: new EcrRepositoryFactory(stack, 'ecr-repos', ecrRepositories),
                    secrets: new Secrets(stack, 'stack'),
                    commandFactory: new ContainerCommandFactory(stack, 'commands', {})
                })
            })
        });
        const tasks = [
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
                            additionalCommand: ['import:all']
                        }
                    ]
                }
            }
        ];
        taskFactory.create(tasks);
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        // templateHelper.inspect();
        const expected = require('../__templates__/ecs-task-factory.scheduled-task');
        templateHelper.template.templateMatches(expected);
    });
});