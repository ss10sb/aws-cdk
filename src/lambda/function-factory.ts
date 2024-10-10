import {CoreFunction, CoreFunctionFactoryProps, CoreFunctionProps} from "./core-function";
import {Construct} from "constructs";
import {IFunction, Runtime, RuntimeFamily} from "aws-cdk-lib/aws-lambda";
import {PhpBrefFunction, PhpBrefFunctionProps} from "./php-bref-function";

export class FunctionFactory {

    public static create<
        PropsType extends CoreFunctionProps,
        A extends CoreFunction<PropsType>>(c: {
        new(scope: Construct, id: string, props: CoreFunctionFactoryProps): A
    }, scope: Construct, id: string, props: CoreFunctionFactoryProps): A {
        return new c(scope, id, props);
    }

    public static createBref(scope: Construct, id: string, factoryProps: CoreFunctionFactoryProps): PhpBrefFunction {
        return FunctionFactory.create<PhpBrefFunctionProps, PhpBrefFunction>(PhpBrefFunction, scope, id, factoryProps);
    }

    public static createFromProps(scope: Construct, id: string, factoryProps: CoreFunctionFactoryProps, props: Record<string, any>): IFunction {
        if (FunctionFactory.wantsBref(props)) {
            return FunctionFactory.create<PhpBrefFunctionProps, PhpBrefFunction>(PhpBrefFunction, scope, id, factoryProps).create(<PhpBrefFunctionProps>props);
        }
        return FunctionFactory.create(CoreFunction, scope, id, factoryProps).create(<CoreFunctionProps>props);
    }

    public static wantsBref(props: Record<string, any>): boolean {
        const useBref = props?.useBref ?? null;
        if (useBref === false) {
            return false;
        }
        if (useBref === true) {
            return true;
        }
        if (props.brefRuntime) {
            return true;
        }
        if (props.lambdaRuntime instanceof Runtime) {
            const family = props.lambdaRuntime?.family;
            return family === RuntimeFamily.OTHER || family === undefined;
        }
        return true;
    }
}