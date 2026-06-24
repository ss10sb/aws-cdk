import {TaskDefinition} from "aws-cdk-lib/aws-ecs";
import {IFunction} from "aws-cdk-lib/aws-lambda";
import {Functions, FunctionType, FunctionWrapper} from "../lambda/lambda-definitions";
import {FargateTasksAndServices} from "../ecs/fargate-factory";
import {Wrapper} from "../ecs/task-definitions";
import {FilesBucket, S3Files} from "../s3/s3-files";

export class PermissionsS3Files {

    static functionsCanReadWriteS3(functions: Functions, s3: FilesBucket): void {
        this.wrappedFunctionsCanReadWriteS3(functions.functions, s3);
        if (functions.queue) {
            this.wrappedFunctionsCanReadWriteS3([functions.queue], s3);
        }
    }

    static wrappedFunctionsCanReadWriteS3(wrapped: FunctionWrapper[], s3: FilesBucket): void {
        for (const funcWrap of wrapped) {
            this.functionCanReadWriteS3(funcWrap.lambdaFunction, s3, funcWrap.type);
        }
    }

    static functionCanReadWriteS3(func: IFunction, s3: FilesBucket, type: FunctionType): void {
        if (!func.role) {
            throw Error('Function role is not defined');
        }
        S3Files.fileSystemPolicy(s3, func.role);
        s3.bucket.grantReadWrite(func.role);
    }

    static tasksServicesCanReadWriteS3(ts: FargateTasksAndServices, s3: FilesBucket): void {
        this.wrappedCanReadWriteS3(ts.wrappers, s3);
    }

    static wrappedCanReadWriteS3(wrapped: Wrapper[], s3: FilesBucket): void {
        for (const wrap of wrapped) {
            this.taskRoleCanReadWriteS3(wrap.taskDefinition, s3);
        }
    }

    static taskRoleCanReadWriteS3(taskDefinition: TaskDefinition, s3: FilesBucket): void {
        S3Files.fileSystemPolicy(s3, taskDefinition.taskRole);
        s3.bucket.grantReadWrite(taskDefinition.taskRole);
    }
}