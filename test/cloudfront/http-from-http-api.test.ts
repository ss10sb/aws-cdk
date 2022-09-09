import {App, Stack} from "aws-cdk-lib";
import {HttpFromHttpApi} from "../../src/cloudfront/http-from-http-api";
import {PhpBrefFunction} from "../../src/lambda/php-bref-function";
import path from "path";
import {BrefRuntime} from "../../src/lambda/bref-definitions";
import {PhpHttpApi} from "../../src/lambda/php-http-api";
import util from "util";
import {Template} from "aws-cdk-lib/assertions";
import {TemplateHelper} from "../../src/utils/testing/template-helper";

describe('http from http api', () => {
    it('should create http origin from defaults', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-west-2', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const phpbrefFun = new PhpBrefFunction(stack, 'function', {environment: {}, secretKeys: []});
        const func = phpbrefFun.create('f1', {
            appPath: path.join(__dirname, '..', '__codebase__'),
            brefRuntime: BrefRuntime.PHP81FPM
        });
        const phpHttpApi = new PhpHttpApi(stack, 'http-api');
        const httpApi = phpHttpApi.create({lambdaFunction: func, logProps: {}});
        const fromHttpApi = new HttpFromHttpApi(stack, 'origin');
        const origin = fromHttpApi.create(httpApi);
        console.log('origin', util.inspect(origin, {depth: null, colors: true}));
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        templateHelper.inspect();
    });
});