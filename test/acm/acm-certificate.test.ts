import {App, Stack} from "aws-cdk-lib";
import {Template} from "aws-cdk-lib/assertions";
import {resetStaticProps} from "../../src/utils/reset-static-props";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {AcmCertificate} from "../../src/acm/acm-certificate";

describe('dns validated certificate', () => {

    beforeEach(() => {
        resetStaticProps();
    });
    it('should create certificate in us-east-1', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-west-2', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const cert = new AcmCertificate(stack, 'cert');
        cert.create({domainName: 'foo.bar.com', hostedZone: 'bar.com', region: 'us-east-1'});
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        // templateHelper.inspect();
        const expected = require('../__templates__/acm-certificate');
        templateHelper.template.templateMatches(expected);
    });
});