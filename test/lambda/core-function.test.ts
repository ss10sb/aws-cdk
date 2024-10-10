import {App, Stack} from "aws-cdk-lib";
import {VpcHelper} from "../../src/utils/vpc-helper";
import path from "path";
import {FunctionType} from "../../src/lambda/lambda-definitions";
import {Template} from "aws-cdk-lib/assertions";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {CoreFunction} from "../../src/lambda/core-function";
import {Runtime} from "aws-cdk-lib/aws-lambda";

describe('core function create', () => {

    it('should create the default function', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const vpc = VpcHelper.getVpcById(stack, 'vpc123');
        const coreFun = new CoreFunction(stack, 'function', {vpc: vpc, secretKeys: [], environment: {}});
        coreFun.create({
            appPath: path.join(__dirname, '..', '__codebase__'),
            type: FunctionType.WEB,
        });
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        // templateHelper.inspect();
        const expected = getExpected('core-function-defaults');
        templateHelper.template.templateMatches(expected);
    });

    it('should create the a nodejs function', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const vpc = VpcHelper.getVpcById(stack, 'vpc123');
        const coreFun = new CoreFunction(stack, 'function', {vpc: vpc, secretKeys: [], environment: {}});
        coreFun.create({
            appPath: path.join(__dirname, '..', '__codebase__'),
            type: FunctionType.WEB,
            lambdaRuntime: Runtime.NODEJS_LATEST,
            lambdaHandler: 'lambda/index.js'
        });
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        // templateHelper.inspect();
        const expected = getExpected('core-function-defaults.nodejs');
        templateHelper.template.templateMatches(expected);
    });

    function getExpected(name: string) {
        return require('../__templates__/' + name + '.js');
    }
});