import {FargateTasksAndServices, Wrapper} from "../ecs";
import {TaskDefinition} from "aws-cdk-lib/aws-ecs";
import {PolicyStatement} from "aws-cdk-lib/aws-iam";

export class PermissionsSes {

    static tasksServicesCanSendEmail(ts: FargateTasksAndServices): void {
        this.wrappedCanSendEmail(ts.services);
        this.wrappedCanSendEmail(ts.tasks);
        if (ts.queue) {
            this.wrappedCanSendEmail([ts.queue]);
        }
    }

    static wrappedCanSendEmail(wrapped: Wrapper[]): void {
        for (const wrap of wrapped) {
            this.taskRoleCanSendEmail(wrap.taskDefinition);
        }
    }

    static taskRoleCanSendEmail(taskDefinition: TaskDefinition): void {
        const statement = new PolicyStatement();
        statement.addResources('*');
        statement.addActions(
            "ses:SendEmail",
            "ses:SendRawEmail"
        );
        taskDefinition.taskRole.addToPrincipalPolicy(statement);
    }
}