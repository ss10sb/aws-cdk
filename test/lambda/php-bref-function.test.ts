import {App, Stack} from "aws-cdk-lib";
import {Match, Template} from "aws-cdk-lib/assertions";
import path from "path";
import {FunctionType} from "../../src/lambda/lambda-definitions";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {PhpBrefFunction} from "../../src/lambda/php-bref-function";
import {BrefRuntime} from "../../src/lambda/bref-definitions";
import {VpcHelper} from "../../src/utils/vpc-helper";
import {MatchHelper} from "../../src/utils/testing/match-helper";
import {resetStaticProps} from "../../src/utils/reset-static-props";

describe('php bref function create', () => {

    beforeEach(() => {
        resetStaticProps();
    });

    it('should create the default function', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const vpc = VpcHelper.getVpcById(stack, 'vpc123');
        const phpbrefFun = new PhpBrefFunction(stack, 'function', {vpc: vpc, secretKeys: [], environment: {}});
        phpbrefFun.create({
            appPath: path.join(__dirname, '..', '__codebase__'),
            brefRuntime: BrefRuntime.PHP81FPM,
            type: FunctionType.WEB,
            version: '27'
        });
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        // templateHelper.inspect();
        const expected = getExpected('bref-function-defaults');
        templateHelper.template.templateMatches(expected);
    });

    it('should create the function with scheduled events', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const vpc = VpcHelper.getVpcById(stack, 'vpc123');
        const phpbrefFun = new PhpBrefFunction(stack, 'function', {vpc: vpc, secretKeys: [], environment: {}});
        phpbrefFun.create({
            appPath: path.join(__dirname, '..', '__codebase__'),
            brefRuntime: BrefRuntime.PHP81FPM,
            type: FunctionType.WEB,
            scheduledEvents: [
                {
                    schedule: 'rate(1 minute)',
                    eventInput: {cli: 'schedule:run'}
                }
            ]
        });
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        // templateHelper.inspect();
        const expected = getExpected('bref-function-scheduled-events');
        templateHelper.template.templateMatches(expected);
    });

    it('should create the default function with latest version', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const vpc = VpcHelper.getVpcById(stack, 'vpc123');
        const phpbrefFun = new PhpBrefFunction(stack, 'function', {vpc: vpc, secretKeys: [], environment: {}});
        phpbrefFun.create({
            appPath: path.join(__dirname, '..', '__codebase__'),
            brefRuntime: BrefRuntime.PHP81FPM,
            type: FunctionType.EVENT
        });
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        // templateHelper.inspect();
        const expected = getExpected('bref-function-default-latest');
        templateHelper.template.templateMatches(expected);
    });

    it('should create multiple layers with latest version', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const vpc = VpcHelper.getVpcById(stack, 'vpc123');
        const phpbrefFun = new PhpBrefFunction(stack, 'function', {vpc: vpc, secretKeys: [], environment: {}});
        phpbrefFun.create({
            appPath: path.join(__dirname, '..', '__codebase__'),
            brefRuntime: [BrefRuntime.PHP81FPM, BrefRuntime.CONSOLE],
            type: FunctionType.EVENT
        });
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        // templateHelper.inspect();
        const expected = getExpected('bref-function-multiple-layers-latest');
        templateHelper.template.templateMatches(expected);
    });

    it('should create the function with auto scaling', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const vpc = VpcHelper.getVpcById(stack, 'vpc123');
        const phpbrefFun = new PhpBrefFunction(stack, 'function', {vpc: vpc, secretKeys: [], environment: {}});
        phpbrefFun.create({
            appPath: path.join(__dirname, '..', '__codebase__'),
            brefRuntime: BrefRuntime.PHP81FPM,
            type: FunctionType.WEB,
            provisionedConcurrency: {
                maxCapacity: 5,
                utilization: {}
            }
        });
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        // templateHelper.inspect();
        const expected = getExpected('bref-function-autoscaling');
        templateHelper.template.templateMatches(expected);
    });

    function getExpected(name: string) {
        return require('../__templates__/'+name+'.js');
    }
});