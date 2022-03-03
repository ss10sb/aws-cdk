import {NonConstruct} from "../core";
import {Construct} from "constructs";
import {PipelineNotificationRuleProps} from "./pipeline-definitions";
import {
    INotificationRule,
    INotificationRuleTarget,
    NotificationRule as NotificationRuleAws
} from "aws-cdk-lib/aws-codestarnotifications";
import {PipelineNotificationTargets} from "./pipeline-notification-targets";

export class PipelineNotificationRule extends NonConstruct {

    readonly props: PipelineNotificationRuleProps;
    readonly targets: INotificationRuleTarget[];
    readonly notificationRule: INotificationRule;

    constructor(scope: Construct, id: string, props: PipelineNotificationRuleProps) {
        super(scope, id);
        this.props = props;
        this.targets = this.createTargets();
        this.notificationRule = this.createNotificationRule();
    }

    protected createTargets(): INotificationRuleTarget[] {
        const notificationTargets = new PipelineNotificationTargets(this.scope, this.id, this.props);
        return notificationTargets.targets;
    }

    protected createNotificationRule(): INotificationRule {
        return new NotificationRuleAws(this.scope, this.mixNameWithId('notification-rule'), {
            source: this.props.source,
            events: this.props.events,
            detailType: this.props.detailType ?? undefined,
            targets: this.targets
        });
    }
}