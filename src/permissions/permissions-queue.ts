import {Queue} from "aws-cdk-lib/aws-sqs";
import {TaskDefinition} from "aws-cdk-lib/aws-ecs";
import {IFunction} from "aws-cdk-lib/aws-lambda";
import {Functions, FunctionType, FunctionWrapper} from "../lambda/lambda-definitions";
import {FargateTasksAndServices} from "../ecs/fargate-factory";
import {TaskServiceType, Wrapper} from "../ecs/task-definitions";

export class PermissionsQueue {

    static functionsCanUseQueue(functions: Functions, queue: Queue): void {
        this.wrappedFunctionsCanUseQueue(functions.functions, queue);
        if (functions.queue) {
            this.wrappedFunctionsCanUseQueue([functions.queue], queue);
        }
    }

    static wrappedFunctionsCanUseQueue(wrapped: FunctionWrapper[], queue: Queue): void {
        for (const funcWrap of wrapped) {
            this.functionCanUseQueue(funcWrap.lambdaFunction, queue, funcWrap.type);
        }
    }

    static functionCanUseQueue(func: IFunction, queue: Queue, type: FunctionType): void {
        // the queue function needs "sendmessages"
        const senders: FunctionType[] = [FunctionType.EVENT, FunctionType.QUEUE, FunctionType.SCHEDULED, FunctionType.WEB];
        const consumers: FunctionType[] = [FunctionType.QUEUE];
        if (senders.includes(type)) {
            queue.grantSendMessages(func.grantPrincipal);
        }
        if (consumers.includes(type)) {
            queue.grantPurge(func.grantPrincipal);
            queue.grantConsumeMessages(func.grantPrincipal);
        }
    }

    static tasksServicesCanUseQueue(ts: FargateTasksAndServices, queue: Queue): void {
        this.wrappedCanUseQueue(ts.services, queue);
        this.wrappedCanUseQueue(ts.tasks, queue);
        if (ts.queue) {
            this.wrappedCanUseQueue([ts.queue], queue);
        }
    }

    static wrappedCanUseQueue(wrapped: Wrapper[], queue: Queue): void {
        for (const wrap of wrapped) {
            this.taskRoleCanUseQueue(wrap.taskDefinition, queue, wrap.type);
        }
    }

    static taskRoleCanUseQueue(taskDefinition: TaskDefinition, queue: Queue, type: TaskServiceType = TaskServiceType.TASK): void {
        const senders: TaskServiceType[] = [
            TaskServiceType.TASK,
            TaskServiceType.SCHEDULED_TASK,
            TaskServiceType.WEB_SERVICE,
            TaskServiceType.RUN_ONCE_TASK,
            TaskServiceType.CREATE_RUN_ONCE_TASK,
            TaskServiceType.UPDATE_RUN_ONCE_TASK
        ];
        const consumers: TaskServiceType[] = [TaskServiceType.QUEUE_SERVICE];
        if (senders.includes(type)) {
            queue.grantSendMessages(taskDefinition.taskRole);
        }
        if (consumers.includes(type)) {
            queue.grantPurge(taskDefinition.taskRole);
            queue.grantConsumeMessages(taskDefinition.taskRole);
        }
    }
}