import {Bucket} from "aws-cdk-lib/aws-s3";
import {TaskDefinition} from "aws-cdk-lib/aws-ecs";
import {IFunction} from "aws-cdk-lib/aws-lambda";
import {Functions, FunctionType, FunctionWrapper} from "../lambda/lambda-definitions";
import {FargateTasksAndServices} from "../ecs/fargate-factory";
import {Wrapper} from "../ecs/task-definitions";

export class PermissionsS3 {

    static functionsCanReadWriteS3(functions: Functions, s3: Bucket): void {
        this.wrappedFunctionsCanReadWriteS3(functions.functions, s3);
        if (functions.queue) {
            this.wrappedFunctionsCanReadWriteS3([functions.queue], s3);
        }
    }

    static wrappedFunctionsCanReadWriteS3(wrapped: FunctionWrapper[], s3: Bucket): void {
        for (const funcWrap of wrapped) {
            this.functionCanReadWriteS3(funcWrap.lambdaFunction, s3, funcWrap.type);
        }
    }

    static functionCanReadWriteS3(func: IFunction, s3: Bucket, type: FunctionType): void {
        s3.grantReadWrite(func.grantPrincipal);
    }

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