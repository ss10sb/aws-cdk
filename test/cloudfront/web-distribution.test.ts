import {App, Stack} from "aws-cdk-lib";
import {Template} from "aws-cdk-lib/assertions";
import {resetStaticProps} from "../../src/utils/reset-static-props";
import path from "path";
import {BucketEncryption} from "aws-cdk-lib/aws-s3";
import {PhpBrefFunction} from "../../src/lambda/php-bref-function";
import {S3Bucket} from "../../src/s3/s3-bucket";
import {WebDistribution} from "../../src/cloudfront/web-distribution";
import {PhpHttpApi} from "../../src/lambda/php-http-api";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {BrefRuntime} from "../../src/lambda/bref-definitions";
import {AcmCertificate} from "../../src/acm/acm-certificate";

describe('cloud web distribution', () => {

    beforeEach(() => {
        resetStaticProps();
    });

    it('should create default distribution no s3 bucket', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-west-2', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const cert = new AcmCertificate(stack, 'cert');
        const c = cert.create({domainName: 'foo.bar.com', hostedZone: 'bar.com', region: 'us-east-1'});
        const phpbrefFun = new PhpBrefFunction(stack, 'function', {environment: {}, secretKeys: []});
        const func = phpbrefFun.create('f1', {
            appPath: path.join(__dirname, '..', '__codebase__'),
            brefRuntime: BrefRuntime.PHP81FPM
        });
        const phpHttpApi = new PhpHttpApi(stack, 'http-api');
        const api = phpHttpApi.create({lambdaFunction: func});
        const webDistribution = new WebDistribution(stack, 'distribution');
        webDistribution.create({
            httpApi: api,
            domainName: 'foo.bar.com',
            certificate: c,

        })
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        templateHelper.inspect();
        // const expected = require('../__templates__/cloudfront-distribution-nos3');
        // templateHelper.template.templateMatches(expected);
    });

    it('should create default distribution with web acl no s3 bucket', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-west-2', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const cert = new AcmCertificate(stack, 'cert');
        const c = cert.create({domainName: 'foo.bar.com', hostedZone: 'bar.com', region: 'us-east-1'});
        const phpbrefFun = new PhpBrefFunction(stack, 'function', {environment: {}, secretKeys: []});
        const func = phpbrefFun.create('f1', {
            appPath: path.join(__dirname, '..', '__codebase__'),
            brefRuntime: BrefRuntime.PHP81FPM
        });
        const phpHttpApi = new PhpHttpApi(stack, 'http-api');
        const api = phpHttpApi.create({lambdaFunction: func});
        const webDistribution = new WebDistribution(stack, 'distribution');
        webDistribution.create({
            httpApi: api,
            domainName: 'foo.bar.com',
            certificate: c,
            webAclId: 'arn:aws:wafv2:us-east-1:123456789012:global/webacl/pccprodwafcf-arn-random-characters'
        });
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        // templateHelper.inspect();
        const expected = require('../__templates__/cloudfront-distribution-webacl-nos3');
        templateHelper.template.templateMatches(expected);
    });

    it('should create default distribution with s3 bucket', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-west-2', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const cert = new AcmCertificate(stack, 'cert');
        const c = cert.create({domainName: 'foo.bar.com', hostedZone: 'bar.com', region: 'us-east-1'});
        const phpbrefFun = new PhpBrefFunction(stack, 'function', {environment: {}, secretKeys: []});
        const func = phpbrefFun.create('f1', {
            appPath: path.join(__dirname, '..', '__codebase__'),
            brefRuntime: BrefRuntime.PHP81FPM
        });
        const phpHttpApi = new PhpHttpApi(stack, 'http-api');
        const api = phpHttpApi.create({lambdaFunction: func});
        const s3Bucket = new S3Bucket(stack, 's3');
        const bucket = s3Bucket.create('assets', {
            encryption: BucketEncryption.S3_MANAGED
        });
        const webDistribution = new WebDistribution(stack, 'distribution');
        webDistribution.create({
            httpApi: api,
            domainName: 'foo.bar.com',
            certificate: c,
            s3AssetBucket: bucket
        })
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        // templateHelper.inspect();
        const expected = require('../__templates__/cloudfront-distribution-withs3');
        templateHelper.template.templateMatches(expected);
    });
});