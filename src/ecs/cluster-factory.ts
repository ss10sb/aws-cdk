import {Construct} from "constructs";
import {Cluster} from "aws-cdk-lib/aws-ecs";
import {Alarm} from "aws-cdk-lib/aws-cloudwatch";
import {IVpc} from "aws-cdk-lib/aws-ec2";
import {AbstractFactory} from "../core/abstract-factory";
import {AlarmSubscriptionHelper} from "../utils/alarm-subscription-helper";

export interface ClusterFactoryProps {
    alarmEmails?: string[];
    vpc: IVpc;
    securityGroupIds?: string[];
    containerInsights?: boolean;
}

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
            const alarmSubHelper = new AlarmSubscriptionHelper(this.scope, this.mixNameWithId('cluster-alarm-topic'));
            alarmSubHelper.addSubscriptions(this.props.alarmEmails);
            const alarms: Alarm[] = []
            alarms.push(cluster.metricCpuUtilization().createAlarm(this.scope, this.mixNameWithId('cluster-cpu-alarm'), {
                threshold: 90,
                evaluationPeriods: 1
            }));
            alarms.push(cluster.metricMemoryUtilization().createAlarm(this.scope, this.mixNameWithId('cluster-memory-alarm'), {
                threshold: 90,
                evaluationPeriods: 1
            }));
            alarmSubHelper.addActions(alarms);
        }
    }
}