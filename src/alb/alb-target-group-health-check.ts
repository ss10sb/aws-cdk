import {Construct} from "constructs";
import {Topic} from "aws-cdk-lib/aws-sns";
import {EmailSubscription} from "aws-cdk-lib/aws-sns-subscriptions";
import {Alarm} from "aws-cdk-lib/aws-cloudwatch";
import {Duration} from "aws-cdk-lib";
import {SnsAction} from "aws-cdk-lib/aws-cloudwatch-actions";
import {ApplicationTargetGroup, HealthCheck} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import {NonConstruct} from "../core/non-construct";

export interface AlbTargetGroupHealthCheckProps {
    readonly targetGroup: ApplicationTargetGroup;
    readonly healthCheck?: HealthCheck;
    readonly alarmEmails?: string[];
}

export class AlbTargetGroupHealthCheck extends NonConstruct {

    readonly props: AlbTargetGroupHealthCheckProps;

    constructor(scope: Construct, id: string, props: AlbTargetGroupHealthCheckProps) {
        super(scope, id);
        this.props = props;
        this.configureHealthCheck();
    }

    private configureHealthCheck() {
        if (this.props.healthCheck) {
            this.props.targetGroup.configureHealthCheck(this.props.healthCheck);
            const topic = this.getTopic();
            this.addSubscriptionsToTopic(topic);
            const alarm = this.getAlarm();
            this.addAlarmActions(alarm, topic);
        }
    }

    private addAlarmActions(alarm: Alarm, topic: Topic) {
        const snsAction = new SnsAction(topic);
        alarm.addAlarmAction(snsAction);
        alarm.addOkAction(snsAction);
    }

    private getAlarm(): Alarm {
        const metric = this.props.targetGroup.metricUnhealthyHostCount({
            period: Duration.minutes(1),
            statistic: 'Maximum',
        });
        return metric.createAlarm(this.scope, `${this.id}-health-alarm`, {
            threshold: 1,
            evaluationPeriods: 3
        });
    }

    private getTopic(): Topic {
        return new Topic(this.scope, `${this.id}-health-topic`);
    }

    private addSubscriptionsToTopic(topic: Topic) {
        for (const email of this.props.alarmEmails ?? []) {
            topic.addSubscription(new EmailSubscription(email));
        }
    }
}