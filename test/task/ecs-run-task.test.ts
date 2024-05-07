import {App, Stack} from "aws-cdk-lib";
import {resetStaticProps} from "../../src/utils/reset-static-props";
import {Cluster, FargateTaskDefinition} from "aws-cdk-lib/aws-ecs";
import {Match, Template} from "aws-cdk-lib/assertions";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {VpcHelper} from "../../src/utils/vpc-helper";
import {EcsRunTask} from "../../src/task/ecs-run-task";
import {MatchHelper} from "../../src/utils/testing/match-helper";

beforeEach(() => {
    resetStaticProps();
});

describe('ecs run task', () => {

    it('should create a create ecs run task using defaults', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const vpc = VpcHelper.getVpcById(stack, 'vpcId');
        const cluster = new Cluster(stack, 'cluster', {vpc: vpc});
        const taskDef = new FargateTaskDefinition(stack, 'task-def');
        new EcsRunTask(stack, 'run-task', {
            cluster: cluster,
            taskDefinition: taskDef,
            runOnCreate: true
        });
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        // templateHelper.inspect();
        const expected = require('../__templates__/ecs-run-task.on-create-task');
        templateHelper.template.templateMatches(expected);
        expect(app.synth().manifest.missing).toEqual([
            {
                "key": "vpc-provider:account=12344:filter.isDefault=false:filter.vpc-id=vpcId:region=us-east-1:returnAsymmetricSubnets=true",
                "props": {
                    "account": "12344",
                    "filter": {
                        "isDefault": "false",
                        "vpc-id": "vpcId"
                    },
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    "region": "us-east-1",
                    "returnAsymmetricSubnets": true
                },
                "provider": "vpc-provider"
            }
        ]);
    });

    it('should create an update ecs run task using defaults', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const vpc = VpcHelper.getVpcById(stack, 'vpcId');
        const cluster = new Cluster(stack, 'cluster', {vpc: vpc});
        const taskDef = new FargateTaskDefinition(stack, 'task-def');
        new EcsRunTask(stack, 'run-task', {
            cluster: cluster,
            taskDefinition: taskDef,
            runOnUpdate: true
        });
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        // templateHelper.inspect();
        const expected = require('../__templates__/ecs-run-task.on-update-task');
        templateHelper.template.templateMatches(expected);
        expect(app.synth().manifest.missing).toEqual([
            {
                "key": "vpc-provider:account=12344:filter.isDefault=false:filter.vpc-id=vpcId:region=us-east-1:returnAsymmetricSubnets=true",
                "props": {
                    "account": "12344",
                    "filter": {
                        "isDefault": "false",
                        "vpc-id": "vpcId"
                    },
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    "region": "us-east-1",
                    "returnAsymmetricSubnets": true
                },
                "provider": "vpc-provider"
            }
        ]);
    });
});