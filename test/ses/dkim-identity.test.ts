import {App, Stack} from "aws-cdk-lib";
import {Match, Template} from "aws-cdk-lib/assertions";
import {resetStaticProps} from "../../src/utils/reset-static-props";
import {DkimIdentity} from "../../src/ses/dkim-identity";
import {TemplateHelper} from "../../src/utils/testing/template-helper";

describe('dkim email domain verify', () => {

    beforeEach(() => {
        resetStaticProps();
    });

    it ('should verify a domain', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const identity = new DkimIdentity(stack, 'stack', 'example.edu');
        const i = identity.createForDomain('test.example.edu');
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        // templateHelper.inspect();
        const expected = {
            Resources: {
                stacktestexampleedudkim599ECBB6: {
                    Type: 'AWS::SES::EmailIdentity',
                    Properties: { EmailIdentity: 'test.example.edu' }
                }
            }
        };
        templateHelper.template.templateMatches(expected);
    });
});