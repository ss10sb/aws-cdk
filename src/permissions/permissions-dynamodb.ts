import {Table} from "aws-cdk-lib/aws-dynamodb";
import {TaskDefinition} from "aws-cdk-lib/aws-ecs";
import {IFunction} from "aws-cdk-lib/aws-lambda";
import {Functions, FunctionType, FunctionWrapper} from "../lambda/lambda-definitions";
import {FargateTasksAndServices} from "../ecs/fargate-factory";
import {Wrapper} from "../ecs/task-definitions";

export class PermissionsDynamodb {

    static functionsCanReadWriteDynamoDb({functions, dynamodb}: { functions: Functions, dynamodb: Table }): void {
        this.wrappedFunctionsCanReadWriteDynamoDb(functions.functions, dynamodb);
        if (functions.queue) {
            this.wrappedFunctionsCanReadWriteDynamoDb([functions.queue], dynamodb);
        }
    }

    static wrappedFunctionsCanReadWriteDynamoDb(wrapped: FunctionWrapper[], dynamodb: Table): void {
        for (const wrap of wrapped) {
            this.functionCanReadWriteDynamoDb(wrap.lambdaFunction, dynamodb, wrap.type)
        }
    }

    static functionCanReadWriteDynamoDb(func: IFunction, dynamodb: Table, type: FunctionType): void {
        dynamodb.grantReadWriteData(func.grantPrincipal);
    }

    static tasksServicesCanReadWriteDynamoDb(ts: FargateTasksAndServices, dynamodb: Table): void {
        this.wrappedCanReadWriteDynamoDb(ts.wrappers, dynamodb);
    }

    static wrappedCanReadWriteDynamoDb(wrapped: Wrapper[], dynamodb: Table): void {
        for (const wrap of wrapped) {
            this.taskRoleCanReadWriteDynamoDb(wrap.taskDefinition, dynamodb);
        }
    }

    static taskRoleCanReadWriteDynamoDb(taskDefinition: TaskDefinition, dynamodb: Table): void {
        dynamodb.grantReadWriteData(taskDefinition.taskRole);
    }
}