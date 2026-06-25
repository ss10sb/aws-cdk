import {TaskDefinition} from "aws-cdk-lib/aws-ecs";
import {IFunction} from "aws-cdk-lib/aws-lambda";
import {Functions, FunctionType, FunctionWrapper} from "../lambda/lambda-definitions";
import {FargateTasksAndServices} from "../ecs/fargate-factory";
import {Wrapper} from "../ecs/task-definitions";
import {FilesBucket, S3Files} from "../s3/s3-files";
import {NonConstruct} from "../core/non-construct";
import {Construct} from "constructs";

export class PermissionsS3Files extends NonConstruct {
    readonly s3Files: S3Files;

    constructor(scope: Construct, id: string) {
        super(scope, id);
        this.s3Files = new S3Files(scope, id);
    }

    functionsCanReadWriteS3(functions: Functions, s3: FilesBucket): void {
        this.wrappedFunctionsCanReadWriteS3(functions.functions, s3);
        if (functions.queue) {
            this.wrappedFunctionsCanReadWriteS3([functions.queue], s3);
        }
    }

    wrappedFunctionsCanReadWriteS3(wrapped: FunctionWrapper[], s3: FilesBucket): void {
        for (const funcWrap of wrapped) {
            this.functionCanReadWriteS3(funcWrap.lambdaFunction, s3, funcWrap.type);
        }
    }

    functionCanReadWriteS3(func: IFunction, s3: FilesBucket, type: FunctionType): void {
        if (!func.role) {
            throw Error('Function role is not defined');
        }
        this.s3Files.fileSystemPolicy(s3, func.role);
        s3.bucket.grantReadWrite(func.role);
    }

    tasksServicesCanReadWriteS3(ts: FargateTasksAndServices, s3: FilesBucket): void {
        this.wrappedCanReadWriteS3(ts.wrappers, s3);
    }

    wrappedCanReadWriteS3(wrapped: Wrapper[], s3: FilesBucket): void {
        for (const wrap of wrapped) {
            this.taskRoleCanReadWriteS3(wrap.taskDefinition, s3);
        }
    }

    taskRoleCanReadWriteS3(taskDefinition: TaskDefinition, s3: FilesBucket): void {
        this.s3Files.fileSystemPolicy(s3, taskDefinition.taskRole);
        s3.bucket.grantReadWrite(taskDefinition.taskRole);
    }
}