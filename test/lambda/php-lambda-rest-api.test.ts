import {App, Stack} from "aws-cdk-lib";
import {PhpBrefFunction} from "../../src/lambda/php-bref-function";
import path from "path";
import {BrefRuntime} from "../../src/lambda/bref-definitions";
import {PhpLambdaRestApi} from "../../src/lambda/php-lambda-rest-api";
import {Template} from "aws-cdk-lib/assertions";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {AcmCertificate} from "../../src/acm/acm-certificate";

describe('php lambda rest api', () => {

    it('should create default rest api', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const phpbrefFun = new PhpBrefFunction(stack, 'function', {environment: {}, secretKeys: []});
        const func = phpbrefFun.create('f1', {
            appPath: path.join(__dirname, '..', '__codebase__'),
            brefRuntime: BrefRuntime.PHP81FPM
        });
        const restApi = new PhpLambdaRestApi(stack,  'lambda-rest-api');
        const cert = new AcmCertificate(stack, 'cert');
        const certificate = cert.create({
            domainName: 'test.foo.edu',
            hostedZone: 'foo.edu',
        });
        restApi.create({
            lambdaFunction: func,
            authorizerProps: {token: 'abc123'},
            domainNameOptions: {
                domainName: 'test.foo.edu',
                certificate: certificate
            }
        });
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        templateHelper.inspect();
    });

    it('should create default rest api with logging', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const phpbrefFun = new PhpBrefFunction(stack, 'function', {environment: {}, secretKeys: []});
        const func = phpbrefFun.create('f1', {
            appPath: path.join(__dirname, '..', '__codebase__'),
            brefRuntime: BrefRuntime.PHP81FPM
        });
        const restApi = new PhpLambdaRestApi(stack,  'lambda-rest-api');
        restApi.create({
            lambdaFunction: func,
            logProps: {}
        });
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        templateHelper.inspect();
    });
});