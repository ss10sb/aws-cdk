import {FargateTasksAndServices, Wrapper} from "../ecs";
import {Table} from "aws-cdk-lib/aws-dynamodb";
import {TaskDefinition} from "aws-cdk-lib/aws-ecs";

export class PermissionsDynamodb {

    static tasksServicesCanReadWriteDynamoDb(ts: FargateTasksAndServices, dynamodb: Table): void {
        this.wrappedCanReadWriteDynamoDb(ts.services, dynamodb);
        this.wrappedCanReadWriteDynamoDb(ts.tasks, dynamodb);
        if (ts.queue) {
            this.wrappedCanReadWriteDynamoDb([ts.queue], dynamodb);
        }
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