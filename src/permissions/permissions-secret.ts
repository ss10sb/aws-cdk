import {IGrantable} from "aws-cdk-lib/aws-iam";
import {ISecret} from "aws-cdk-lib/aws-secretsmanager";
import {IFunction} from "aws-cdk-lib/aws-lambda";
import {Functions, FunctionType, FunctionWrapper} from "../lambda/lambda-definitions";
import {FargateTasksAndServices} from "../ecs/fargate-factory";
import {Wrapper} from "../ecs/task-definitions";
import {TaskDefinition} from "aws-cdk-lib/aws-ecs";

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

    static tasksServicesCanReadSecret(ts: FargateTasksAndServices, secret: ISecret): void {
        this.wrappedCanReadSecret(ts.wrappers, secret);
    }

    static wrappedCanReadSecret(wrapped: Wrapper[], secret: ISecret): void {
        for (const wrap of wrapped) {
            const grantSecrets = wrap.grantSecrets ?? false;
            if (grantSecrets) {
                this.taskRoleCanReadSecret(wrap.taskDefinition, secret);
            }
        }
    }

    static taskRoleCanReadSecret(taskDefinition: TaskDefinition, secret: ISecret): void {
        this.granteeCanReadSecret(taskDefinition.taskRole, secret);
    }
}