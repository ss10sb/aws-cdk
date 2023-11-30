import {TaskDefinition} from "aws-cdk-lib/aws-ecs";
import {PolicyStatement} from "aws-cdk-lib/aws-iam";
import {IFunction} from "aws-cdk-lib/aws-lambda";
import {Functions, FunctionType, FunctionWrapper} from "../lambda/lambda-definitions";
import {FargateTasksAndServices} from "../ecs/fargate-factory";
import {Wrapper} from "../ecs/task-definitions";

export class PermissionsSes {

    static functionsCanSendEmail(functions: Functions): void {
        this.wrappedFunctionsCanSendEmail(functions.functions);
        if (functions.queue) {
            this.wrappedFunctionsCanSendEmail([functions.queue]);
        }
    }

    static wrappedFunctionsCanSendEmail(wrapped: FunctionWrapper[]): void {
        for (const wrap of wrapped) {
            this.functionCanSendEmail(wrap.lambdaFunction, wrap.type);
        }
    }

    static functionCanSendEmail(func: IFunction, type: FunctionType): void {
        const statement = this.getStatement();
        func.addToRolePolicy(statement);
    }

    static tasksServicesCanSendEmail(ts: FargateTasksAndServices): void {
        this.wrappedCanSendEmail(ts.wrappers);
    }

    static wrappedCanSendEmail(wrapped: Wrapper[]): void {
        for (const wrap of wrapped) {
            this.taskRoleCanSendEmail(wrap.taskDefinition);
        }
    }

    static taskRoleCanSendEmail(taskDefinition: TaskDefinition): void {
        const statement = this.getStatement();
        taskDefinition.taskRole.addToPrincipalPolicy(statement);
    }

    static getStatement(): PolicyStatement {
        const statement = new PolicyStatement();
        statement.addResources('*');
        statement.addActions(
            "ses:SendEmail",
            "ses:SendRawEmail"
        );
        return statement;
    }
}