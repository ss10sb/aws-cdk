import {FargateTasksAndServices, Wrapper} from "../ecs";
import {Bucket} from "aws-cdk-lib/aws-s3";
import {TaskDefinition} from "aws-cdk-lib/aws-ecs";

export class PermissionsS3 {

    static tasksServicesCanReadWriteS3(ts: FargateTasksAndServices, s3: Bucket): void {
        this.wrappedCanReadWriteS3(ts.services, s3);
        this.wrappedCanReadWriteS3(ts.tasks, s3);
        if (ts.queue) {
            this.wrappedCanReadWriteS3([ts.queue], s3);
        }
    }

    static wrappedCanReadWriteS3(wrapped: Wrapper[], s3: Bucket): void {
        for (const wrap of wrapped) {
            this.taskRoleCanReadWriteS3(wrap.taskDefinition, s3);
        }
    }

    static taskRoleCanReadWriteS3(taskDefinition: TaskDefinition, s3: Bucket): void {
        s3.grantReadWrite(taskDefinition.taskRole);
    }
}