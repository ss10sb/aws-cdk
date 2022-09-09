import {App, Stack} from "aws-cdk-lib";
import {Authorizer} from "../../src/lambda/authorizer";
import {Template} from "aws-cdk-lib/assertions";
import {TemplateHelper} from "../../src/utils/testing/template-helper";

describe('authorizer v1', () => {
    it('should create authorizer', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const authorizer = new Authorizer(stack, 'authorizer');
        const a = authorizer.create({
            token: 'abc123'
        });
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        templateHelper.inspect();
    });
});