import {App, Stack} from "aws-cdk-lib";
import {Match, Template} from "aws-cdk-lib/assertions";
import {resetStaticProps} from "../../src/utils/reset-static-props";
import {SesVerifyDomain} from "../../src/ses/ses-verify-domain";
import {MatchHelper} from "../../src/utils/testing/match-helper";
import {TemplateHelper} from "../../src/utils/testing/template-helper";

describe('ses verify domain', () => {

    beforeEach(() => {
        resetStaticProps();
    });

    it('should verify', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const sesVerifyDomain = new SesVerifyDomain(stack, 'ses-verify-domain');
        sesVerifyDomain.verifyDomain({
            subdomain: 'test.example.edu',
            hostedZone: 'example.edu'
        });
        const template = Template.fromStack(stack);
        expect(app.synth().manifest.missing).toEqual([
            {
                "key": "hosted-zone:account=12344:domainName=example.edu:region=us-east-1",
                "props": {
                    "account": "12344",
                    "domainName": "example.edu",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    "region": "us-east-1"
                },
                "provider": "hosted-zone"
            }
        ]);
        const templateHelper = new TemplateHelper(template);
        // templateHelper.inspect();
        const expected = require('../__templates__/ses-verify-domain');
        templateHelper.template.templateMatches(expected);
    });
});