import {NonConstruct} from "../core/non-construct";
import {Topic} from "aws-cdk-lib/aws-sns";
import {Construct} from "constructs";
import {EmailSubscription} from "aws-cdk-lib/aws-sns-subscriptions";
import {Alarm} from "aws-cdk-lib/aws-cloudwatch";
import {SnsAction} from "aws-cdk-lib/aws-cloudwatch-actions";

export class AlarmSubscriptionHelper extends NonConstruct {

    readonly topic: Topic;

    constructor(scope: Construct, id: string) {
        super(scope, id);
        this.topic = new Topic(scope, id);
    }

    addSubscriptions(emails: string[]): void {
        for (const email of emails) {
            this.topic.addSubscription(new EmailSubscription(email));
        }
    }

    addActions(alarms: Alarm[], addError: boolean = true, addOk: boolean = true): void {
        for (const alarm of alarms) {
            if (addError) {
                alarm.addAlarmAction(new SnsAction(this.topic));
            }
            if (addOk) {
                alarm.addOkAction(new SnsAction(this.topic));
            }
        }
    }
}