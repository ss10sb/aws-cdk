import {App, Stack} from "aws-cdk-lib";
import {Match, Template} from "aws-cdk-lib/assertions";
import path from "path";
import {PhpHttpApi} from "../../src/lambda/php-http-api";
import {TemplateHelper} from "../../../src/utils/testing/template-helper";
import {PhpBrefFunction} from "../../../src/lambda/php-bref-function";
import {BrefRuntime} from "../../../src/lambda/bref-definitions";
import {MatchHelper} from "../../../src/utils/testing/match-helper";
import {resetStaticProps} from "../../../src/utils/reset-static-props";

describe('php http api create', () => {

    beforeEach(() => {
        resetStaticProps();
    });

    it('should create the default http api endpoint', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const phpbrefFun = new PhpBrefFunction(stack, 'function', {environment: {}, secretKeys: []});
        const func = phpbrefFun.create({
            appPath: path.join(__dirname, '..', '__codebase__'),
            brefRuntime: BrefRuntime.PHP81FPM
        });
        const phpHttpApi = new PhpHttpApi(stack, 'http-api');
        phpHttpApi.create({lambdaFunction: func});
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        // templateHelper.inspect();
        const expected = require('../__templates__/lambda-http-api.defaults');
        templateHelper.template.templateMatches(expected);
    });

    it('should create http api endpoint that can log', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const phpbrefFun = new PhpBrefFunction(stack, 'function', {environment: {}, secretKeys: []});
        const func = phpbrefFun.create({
            appPath: path.join(__dirname, '..', '__codebase__'),
            brefRuntime: BrefRuntime.PHP81FPM
        });
        const phpHttpApi = new PhpHttpApi(stack, 'http-api');
        phpHttpApi.create({lambdaFunction: func, logProps: {}});
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        // templateHelper.inspect();
        const expected = require('../__templates__/lambda-http-api.logging');
        templateHelper.template.templateMatches(expected);
    });
});