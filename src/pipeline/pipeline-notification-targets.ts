import {INotificationRuleTarget} from "aws-cdk-lib/aws-codestarnotifications";
import {Construct} from "constructs";
import {PipelineNotificationRuleConfig} from "./pipeline-definitions";
import {Topic} from "aws-cdk-lib/aws-sns";
import {EmailSubscription} from "aws-cdk-lib/aws-sns-subscriptions";
import {NonConstruct} from "../core/non-construct";

export interface PipelineNotificationTargetProps extends PipelineNotificationRuleConfig {

}
export class PipelineNotificationTargets extends NonConstruct {

    readonly props: PipelineNotificationTargetProps;
    readonly targets: INotificationRuleTarget[];

    constructor(scope: Construct, id: string, props: PipelineNotificationTargetProps) {
        super(scope, id);
        this.props = props;
        this.targets = this.createTargets();
        if (this.props.emails && this.props.emails.length > 0) {
            this.addEmails(this.props.emails);
        }
    }

    public addEmails(emails: string[]): void {
        for (const target of this.targets) {
            if (target instanceof Topic) {
                this.addEmailSubscriptionsToTopic(target, emails);
            }
        }
    }

    protected addEmailSubscriptionsToTopic(topic: Topic, emails: string[]): void {
        for (const email of emails) {
            topic.addSubscription(new EmailSubscription(email));
        }
    }

    protected createTargets(): INotificationRuleTarget[] {
        if (this.props.targets && this.props.targets.length > 0) {
            return this.props.targets;
        }
        return [
            new Topic(this.scope, this.mixNameWithId('notification-rule-topic'))
        ];
    }
}