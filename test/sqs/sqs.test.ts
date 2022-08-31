import {App, Stack} from "aws-cdk-lib";
import {Match, Template} from "aws-cdk-lib/assertions";
import {Sqs} from "../../src/sqs/sqs";

describe('sqs', () => {

    it('should create a new queue with default name', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const sqs = new Sqs(stack, 'sqs');
        sqs.create({});
        const template = Template.fromStack(stack);
        template.hasResourceProperties('AWS::SQS::Queue', Match.objectEquals({
            "KmsMasterKeyId": "alias/aws/sqs",
            "QueueName": "sqs-queue"
        }));
    });

    it('should create a new queue with name from props', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const sqs = new Sqs(stack, 'sqs');
        sqs.create({
            queueName: 'my-sqs-queue'
        });
        const template = Template.fromStack(stack);
        template.hasResourceProperties('AWS::SQS::Queue', Match.objectEquals({
            "KmsMasterKeyId": "alias/aws/sqs",
            "QueueName": "sqs-my-sqs-queue"
        }));
    });
});