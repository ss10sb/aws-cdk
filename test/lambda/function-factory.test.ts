import {App, Stack} from "aws-cdk-lib";
import {VpcHelper} from "../../src/utils/vpc-helper";
import {CoreFunction} from "../../src/lambda/core-function";
import {FunctionFactory} from "../../src/lambda/function-factory";
import {PhpBrefFunction, PhpBrefFunctionProps} from "../../src/lambda/php-bref-function";
import {Runtime} from "aws-cdk-lib/aws-lambda";

describe('function factory create', () => {

    it('should create the core function factory', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const vpc = VpcHelper.getVpcById(stack, 'vpc123');
        const factory = FunctionFactory.create(CoreFunction, stack, 'function', {
            vpc: vpc,
            secretKeys: [],
            environment: {}
        });
        expect(factory).toBeInstanceOf(CoreFunction);
    });

    it('should create the bref function factory', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const vpc = VpcHelper.getVpcById(stack, 'vpc123');
        const factory = FunctionFactory.create<PhpBrefFunctionProps, PhpBrefFunction>(PhpBrefFunction, stack, 'function', {
            vpc: vpc,
            secretKeys: [],
            environment: {}
        });
        expect(factory).toBeInstanceOf(PhpBrefFunction);
    });

    it('wants bref when no lambda runtime is set', () => {
        expect(FunctionFactory.wantsBref({})).toBe(true);
    });

    it('wants bref when non-bref runtime is set and useBref is true', () => {
        expect(FunctionFactory.wantsBref({lambdaRuntime: Runtime.NODEJS_LATEST, useBref: true})).toBe(true);
    });

    it('does not want bref when no runtime is set and useBref is false', () => {
        expect(FunctionFactory.wantsBref({useBref: false})).toBe(false);
    });

    [
        Runtime.NODEJS_LATEST,
        Runtime.DOTNET_8,
        Runtime.JAVA_21,
        Runtime.PYTHON_3_12,
        Runtime.RUBY_3_2,
    ].forEach(runtime => {
       it(`does not want bref when using ${runtime}`, () => {
           expect(FunctionFactory.wantsBref({lambdaRuntime: runtime})).toBe(false);
       })
    });

    [
        Runtime.PROVIDED_AL2,
        Runtime.PROVIDED_AL2023,
        Runtime.FROM_IMAGE,
    ].forEach(runtime => {
       it(`wants bref when using ${runtime}`, () => {
           expect(FunctionFactory.wantsBref({lambdaRuntime: runtime})).toBe(true);
       })
    });
});