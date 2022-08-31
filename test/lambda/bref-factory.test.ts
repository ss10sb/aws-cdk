import {App, Stack} from "aws-cdk-lib";
import {Template} from "aws-cdk-lib/assertions";
import {resetStaticProps} from "../../src/utils/reset-static-props";
import path from "path";
import {SecurityPolicyProtocol} from "aws-cdk-lib/aws-cloudfront";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {BrefRuntime} from "../../src/lambda/bref-definitions";
import {BrefFactory} from "../../src/lambda/bref-factory";
import {PhpBrefFunction} from "../../src/lambda/php-bref-function";

describe('bref factory', () => {

    beforeEach(() => {
        resetStaticProps();
    });

    it('should create distribution defaults', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-west-2', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const factory = new BrefFactory(stack, 'my-app', new PhpBrefFunction(stack, 'func', {environment: {}, secretKeys: []}));
        factory.forDistribution({
            assetPath: '/assets/*',
            minimumSslProtocol: SecurityPolicyProtocol.TLS_V1_2_2019,
            certificateProps: {
                domainName: 'foo.bar.com', hostedZone: 'bar.com', region: 'us-east-1'
            },
            apiProps: {},
            functionProps: {
                appPath: path.join(__dirname, '..', '__codebase__'),
                brefRuntime: BrefRuntime.PHP81FPM
            }
        });
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        templateHelper.inspect();
        // const expected = require('../__templates__/lambda-bref-factory');
        // templateHelper.template.templateMatches(expected);
    });

    it('should create distribution defaults with s3', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-west-2', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const factory = new BrefFactory(stack, 'my-app', new PhpBrefFunction(stack, 'func', {environment: {}, secretKeys: []}));
        factory.forDistribution({
            assetPath: '/assets/*',
            assetPathToCopy: path.join(__dirname, '..', '__codebase__', 'public'),
            minimumSslProtocol: SecurityPolicyProtocol.TLS_V1_2_2019,
            certificateProps: {
                domainName: 'foo.bar.com', hostedZone: 'bar.com', region: 'us-east-1'
            },
            apiProps: {},
            functionProps: {
                appPath: path.join(__dirname, '..', '__codebase__'),
                brefRuntime: BrefRuntime.PHP81FPM
            },
            assetBucket: {}
        });
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        // templateHelper.inspect();
        const expected = require('../__templates__/lambda-bref-factory-s3');
        templateHelper.template.templateMatches(expected);
    });
});