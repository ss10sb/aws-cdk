import {FargateTasksAndServices, TaskServiceType, Wrapper} from "../ecs";
import {Queue} from "aws-cdk-lib/aws-sqs";
import {TaskDefinition} from "aws-cdk-lib/aws-ecs";

export class PermissionsQueue {

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
        const senders: TaskServiceType[] = [TaskServiceType.TASK, TaskServiceType.SCHEDULED_TASK, TaskServiceType.WEB_SERVICE];
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