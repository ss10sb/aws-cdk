import {IGrantable} from "aws-cdk-lib/aws-iam";
import {ISecret} from "aws-cdk-lib/aws-secretsmanager";
import {IFunction} from "aws-cdk-lib/aws-lambda";
import {Functions, FunctionType, FunctionWrapper} from "../lambda/lambda-definitions";

export class PermissionsSecret {

    static functionsCanReadSecret(functions: Functions, secret: ISecret): void {
        this.wrappedFunctionsCanReadSecret(functions.functions, secret);
        if (functions.queue) {
            this.wrappedFunctionsCanReadSecret([functions.queue], secret);
        }
    }

    static wrappedFunctionsCanReadSecret(wrapped: FunctionWrapper[], secret: ISecret): void {
        for (const wrap of wrapped) {
            this.functionCanReadSecret(wrap.lambdaFunction, secret, wrap.type)
        }
    }

    static functionCanReadSecret(func: IFunction, secret: ISecret, type: FunctionType): void {
        this.granteeCanReadSecret(func.grantPrincipal, secret);
    }

    static granteeCanReadSecret(grantee: IGrantable, secret: ISecret): void {
        secret.grantRead(grantee);
    }
}