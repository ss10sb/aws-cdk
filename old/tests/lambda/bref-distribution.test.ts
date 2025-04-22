import {App, Stack} from "aws-cdk-lib";
import {Template} from "aws-cdk-lib/assertions";
import {resetStaticProps} from "../../../src/utils/reset-static-props";
import path from "path";
import {SecurityPolicyProtocol} from "aws-cdk-lib/aws-cloudfront";
import {TemplateHelper} from "../../../src/utils/testing/template-helper";
import {BrefRuntime} from "../../../src/lambda/bref-definitions";
import {PhpBrefFunction} from "../../../src/lambda/php-bref-function";
import {ApiType} from "../../../src/lambda/lambda-definitions";
import {Secrets} from "../../../src/secret/secrets";
import {BrefDistribution} from "../../src/lambda/bref-distribution";

describe('bref distribution', () => {

    beforeEach(() => {
        resetStaticProps();
    });

    it('should create distribution defaults', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-west-2', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const secrets = new Secrets(stack, 'secrets');
        const factory = new BrefDistribution(stack, 'my-app', {
            functionFactory: new PhpBrefFunction(stack, 'func', {
                environment: {},
                secretKeys: []
            }),
            secret: secrets.fetch()
        });
        factory.create({
            assetPath: 'assets/*',
            minimumSslProtocol: SecurityPolicyProtocol.TLS_V1_2_2019,
            certificateProps: {
                domainName: 'foo.bar.com', hostedZone: 'bar.com'
            },
            apiProps: {},
            functionProps: {
                appPath: path.join(__dirname, '..', '__codebase__'),
                brefRuntime: BrefRuntime.PHP81FPM
            }
        });
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        // templateHelper.inspect();
        const expected = require('../__templates__/lambda-bref-factory');
        templateHelper.template.templateMatches(expected);
    });

    it('should create distribution defaults and authorizer', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-west-2', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const secrets = new Secrets(stack, 'secrets');
        const factory = new BrefDistribution(stack, 'my-app', {
            functionFactory: new PhpBrefFunction(stack, 'func', {
                environment: {},
                secretKeys: [],
                secret: secrets.fetch(),
            }),
            secret: secrets.fetch()
        });
        factory.create({
            assetPath: 'assets/*',
            minimumSslProtocol: SecurityPolicyProtocol.TLS_V1_2_2019,
            certificateProps: {
                domainName: 'foo.bar.com', hostedZone: 'bar.com'
            },
            apiProps: {
                authorizerProps: {debug: true}
            },
            functionProps: {
                appPath: path.join(__dirname, '..', '__codebase__'),
                brefRuntime: BrefRuntime.PHP81FPM
            }
        });
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        // templateHelper.inspect();
        const expected = require('../__templates__/lambda-bref-factory-authorizer');
        templateHelper.template.templateMatches(expected);
    });

    it('should create distribution defaults with http api', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-west-2', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const factory = new BrefDistribution(stack, 'my-app', {
            functionFactory: new PhpBrefFunction(stack, 'func', {
                environment: {},
                secretKeys: []
            })
        });
        factory.create({
            assetPath: 'assets/*',
            minimumSslProtocol: SecurityPolicyProtocol.TLS_V1_2_2019,
            certificateProps: {
                domainName: 'foo.bar.com', hostedZone: 'bar.com'
            },
            apiProps: {
                apiType: ApiType.HTTP,
            },
            functionProps: {
                appPath: path.join(__dirname, '..', '__codebase__'),
                brefRuntime: BrefRuntime.PHP81FPM
            }
        });
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        // templateHelper.inspect();
        const expected = require('../__templates__/lambda-bref-factory-httpapi');
        templateHelper.template.templateMatches(expected);
    });

    it('should create distribution defaults with s3', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-west-2', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const factory = new BrefDistribution(stack, 'my-app', {
            functionFactory: new PhpBrefFunction(stack, 'func', {
                environment: {},
                secretKeys: []
            })
        });
        factory.create({
            assetPath: 'assets/*',
            assetPathToCopy: path.join(__dirname, '..', '__codebase__', 'public'),
            minimumSslProtocol: SecurityPolicyProtocol.TLS_V1_2_2019,
            certificateProps: {
                domainName: 'foo.bar.com', hostedZone: 'bar.com'
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

    it('should create distribution defaults with http api and geo restrictions', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-west-2', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const factory = new BrefDistribution(stack, 'my-app', {
            functionFactory: new PhpBrefFunction(stack, 'func', {
                environment: {},
                secretKeys: []
            })
        });
        factory.create({
            assetPath: 'assets/*',
            minimumSslProtocol: SecurityPolicyProtocol.TLS_V1_2_2019,
            certificateProps: {
                domainName: 'foo.bar.com', hostedZone: 'bar.com'
            },
            apiProps: {
                apiType: ApiType.HTTP,
            },
            functionProps: {
                appPath: path.join(__dirname, '..', '__codebase__'),
                brefRuntime: BrefRuntime.PHP81FPM
            },
            geoRestrict: ['RU', 'CN', 'BY']
        });
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        // templateHelper.inspect();
        const expected = require('../__templates__/lambda-bref-factory-httpapi-georestricted');
        templateHelper.template.templateMatches(expected);
    });
});