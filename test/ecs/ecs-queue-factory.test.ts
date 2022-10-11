import {App, Stack} from "aws-cdk-lib";
import {Cluster} from "aws-cdk-lib/aws-ecs";
import {Match, Template} from "aws-cdk-lib/assertions";
import {resetStaticProps} from "../../src/utils/reset-static-props";
import {EcrRepositoryType} from "../../src/ecr/ecr-definitions";
import {EcsQueueFactory} from "../../src/ecs/ecs-queue-factory";
import {Secrets} from "../../src/secret/secrets";
import {Sqs} from "../../src/sqs/sqs";
import {EcrRepositories} from "../../src/ecr/ecr-repositories";
import {TaskServiceType} from "../../src/ecs/task-definitions";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {EcrRepositoryFactory} from "../../src/ecr/ecr-repository-factory";
import {ContainerCommandFactory} from "../../src/ecs/container-command-factory";
import {VpcHelper} from "../../src/utils/vpc-helper";

const ecrRepoProps = {
    repositories: [EcrRepositoryType.NGINX, EcrRepositoryType.PHPFPM]
};

describe('ecs queue factory', () => {

    beforeEach(() => {
        resetStaticProps();
    });

    it('should create queue factory with defaults', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const cluster = new Cluster(stack, 'cluster', {
            vpc: VpcHelper.getVpcById(stack, 'vpcId')
        });
        const ecrRepositories = new EcrRepositories('my-repos', ecrRepoProps);
        const ecsQueueFactory = new EcsQueueFactory(stack, 'queue', {
            cluster: cluster,
            repositoryFactory: new EcrRepositoryFactory(stack, 'ecr-repos', ecrRepositories),
            secrets: new Secrets(stack, 'stack'),
            commandFactory: new ContainerCommandFactory(stack, 'commands', {})
        });
        ecsQueueFactory.create({
            type: TaskServiceType.QUEUE_SERVICE,
            image: EcrRepositoryType.PHPFPM,
            cpu: 256
        });
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        // templateHelper.inspect();
        const expected = require('../__templates__/ecs-queue-factory.defaults');
        templateHelper.template.templateMatches(expected);
    });

    it('should create queue factory with premade queue', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const cluster = new Cluster(stack, 'cluster', {
            vpc: VpcHelper.getVpcById(stack, 'vpcId')
        });
        const ecrRepositories = new EcrRepositories('my-repos', ecrRepoProps);
        const sqs = new Sqs(stack, 'sqs');
        const queue = sqs.create({});
        const ecsQueueFactory = new EcsQueueFactory(stack, 'queue', {
            cluster: cluster,
            queue: queue,
            repositoryFactory: new EcrRepositoryFactory(stack, 'ecr-repos', ecrRepositories),
            secrets: new Secrets(stack, 'stack'),
            commandFactory: new ContainerCommandFactory(stack, 'commands', {})
        });
        ecsQueueFactory.create({
            type: TaskServiceType.QUEUE_SERVICE,
            image: EcrRepositoryType.PHPFPM,
            cpu: 256
        });
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
//        templateHelper.inspect();
        const expected = require('../__templates__/ecs-queue-factory.queue');
        templateHelper.template.templateMatches(expected);
    });
});