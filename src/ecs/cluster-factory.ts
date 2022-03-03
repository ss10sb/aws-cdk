import {AbstractFactory} from "../core";
import {ClusterFactoryProps} from "./cluster-definitions";
import {Construct} from "constructs";
import {Cluster} from "aws-cdk-lib/aws-ecs";
import {Alarm} from "aws-cdk-lib/aws-cloudwatch";
import {Topic} from "aws-cdk-lib/aws-sns";
import {SnsAction} from "aws-cdk-lib/aws-cloudwatch-actions";
import {EmailSubscription} from "aws-cdk-lib/aws-sns-subscriptions";

export class ClusterFactory extends AbstractFactory {

    readonly props: ClusterFactoryProps;

    constructor(scope: Construct, id: string, props: ClusterFactoryProps) {
        super(scope, id);
        this.props = props;
    }

    create(name = 'cluster'): Cluster {
        const clusterName = this.mixNameWithId(name);
        const cluster = new Cluster(this.scope, clusterName, {
            vpc: this.props.vpc,
            containerInsights: this.props.containerInsights ?? false,
            clusterName: clusterName
        });
        this.createAlarms(cluster);
        return cluster;
    }

    private createAlarms(cluster: Cluster): void {
        if (this.props.alarmEmails && this.props.alarmEmails.length) {
            const alarms: Alarm[] = []
            const topic = new Topic(this.scope, this.mixNameWithId('cluster-alarm-topic'));
            this.addSubscriptions(topic, this.props.alarmEmails);
            alarms.push(cluster.metricCpuUtilization().createAlarm(this.scope, this.mixNameWithId('cluster-cpu-alarm'), {
                threshold: 90,
                evaluationPeriods: 1
            }));
            alarms.push(cluster.metricMemoryUtilization().createAlarm(this.scope, this.mixNameWithId('cluster-memory-alarm'), {
                threshold: 90,
                evaluationPeriods: 1
            }));
            this.addActions(alarms, topic);
        }
    }

    private addActions(alarms: Alarm[], topic: Topic): void {
        for (const alarm of alarms) {
            alarm.addAlarmAction(new SnsAction(topic));
            alarm.addOkAction(new SnsAction(topic));
        }
    }

    private addSubscriptions(topic: Topic, emails: string[]): void {
        for (const email of emails) {
            topic.addSubscription(new EmailSubscription(email));
        }
    }
}