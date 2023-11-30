import {FargateTasksAndServices} from "../ecs/fargate-factory";
import {TaskServiceType, Wrapper} from "../ecs/task-definitions";
import {TaskDefinition} from "aws-cdk-lib/aws-ecs";
import {Effect, PolicyStatement} from "aws-cdk-lib/aws-iam";

export class PermissionsExecuteCommand {

    static tasksServicesCanExecuteCommands(ts: FargateTasksAndServices): void {
        this.wrappedCanExecuteCommands(ts.wrappers);
    }

    static wrappedCanExecuteCommands(wrapped: Wrapper[]): void {
        for (const wrap of wrapped) {
            if (this.canExecuteCommand(wrap)) {
                this.taskRoleCanExecuteCommands(wrap.taskDefinition, wrap.type);
            }
        }
    }

    static canExecuteCommand(wrapper: Wrapper): boolean {
        return (wrapper.enableExecuteCommand ?? false);
    }

    static taskRoleCanExecuteCommands(taskDefinition: TaskDefinition, type: TaskServiceType = TaskServiceType.TASK): void {
        const statement = new PolicyStatement({
            effect: Effect.ALLOW,
            actions: [
                "ssmmessages:CreateControlChannel",
                "ssmmessages:CreateDataChannel",
                "ssmmessages:OpenControlChannel",
                "ssmmessages:OpenDataChannel"
            ],
            resources: ['*']
        });
        taskDefinition.taskRole.addToPrincipalPolicy(statement);
    }
}