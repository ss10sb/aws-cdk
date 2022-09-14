import {NonConstruct} from "../core/non-construct";
import {Alias, IFunction} from "aws-cdk-lib/aws-lambda";
import {
    PredefinedMetric,
    ScalableTarget,
    ServiceNamespace,
    StepScalingPolicy
} from "aws-cdk-lib/aws-applicationautoscaling";
import {Schedule} from "aws-cdk-lib/aws-events";
import {Alarm, CfnAlarm, Metric, TreatMissingData, Unit} from "aws-cdk-lib/aws-cloudwatch";
import {Duration} from "aws-cdk-lib";

export interface ProvisionedConcurrencyProps {
    maxCapacity: number;
    minCapacity?: number;
    scheduled?: {
        scaleUpAction: {
            minCapacity: number;
            schedule: string;
        },
        scaleDownAction: {
            minCapacity?: number;
            maxCapacity?: number;
            schedule: string;
        },
    },
    utilization: {
        targetValue?: number;
    }
}

export class ProvisionedConcurrency extends NonConstruct {

    create(func: IFunction, props: ProvisionedConcurrencyProps): ScalableTarget {
        const alias = new Alias(this.scope, this.mixNameWithId('alias'), {
            aliasName: 'current',
            version: func.latestVersion
        });
        const name = this.mixNameWithId('scalable-target');
        const target = new ScalableTarget(this.scope, name, {
            maxCapacity: props.maxCapacity,
            minCapacity: props.minCapacity ?? 0,
            resourceId: `function:${func.functionName}:${alias.aliasName}`,
            serviceNamespace: ServiceNamespace.LAMBDA,
            scalableDimension: 'lambda:function:ProvisionedConcurrency',
        });
        this.addActions(func, target, props);
        return target;
    }

    protected addActions(func: IFunction, target: ScalableTarget, props: ProvisionedConcurrencyProps): void {
        this.addScheduledActions(target, props);
        this.addMetricActions(func, target, props);
    }

    protected addMetricActions(func: IFunction, target: ScalableTarget, props: ProvisionedConcurrencyProps): void {
        if (props.utilization) {
            /**
             * Note: this will NOT scale in when the lower alarm is in "insufficient data" state (no
             * lambda invocations).  Fail.
             */
            target.scaleToTrackMetric('pcu-auto-scale', {
                targetValue: 0.9,
                predefinedMetric: PredefinedMetric.LAMBDA_PROVISIONED_CONCURRENCY_UTILIZATION
            });
        }
    }

    /**
     * Does not work with Lambda - Account is not authorized error
     * @param func
     * @param target
     * @param props
     * @protected
     */
    protected addStepScalingMetric(func: IFunction, target: ScalableTarget, props: ProvisionedConcurrencyProps): void {
        const metric = new Metric({
            namespace: ServiceNamespace.LAMBDA,
            metricName: 'ProvisionedConcurrencyUtilization',
            statistic: 'Average',
            unit: Unit.COUNT,
            period: Duration.minutes(1),
            dimensionsMap: {
                functionName: func.functionName
            },
        });
        const policy = target.scaleOnMetric('pcu-auto-scale', {
            metric: metric,
            scalingSteps: [
                {change: 1, lower: 0.9},
                {change: -1, upper: 0.1}
            ]
        });
        this.modifyStepScalingPolicy(policy);
    }

    protected addScheduledActions(target: ScalableTarget, props: ProvisionedConcurrencyProps): void {
        if (props.scheduled) {
            target.scaleOnSchedule('scheduled-scale-up', {
                minCapacity: props.scheduled.scaleUpAction.minCapacity,
                schedule: Schedule.expression(props.scheduled.scaleUpAction.schedule)
            });
            target.scaleOnSchedule('scheduled-scale-down', {
                minCapacity: props.scheduled.scaleDownAction.minCapacity ?? 0,
                maxCapacity: props.scheduled.scaleDownAction.maxCapacity ?? 0,
                schedule: Schedule.expression(props.scheduled.scaleDownAction.schedule)
            });
        }
    }

    protected modifyStepScalingPolicy(policy: StepScalingPolicy): void {
        this.handleLowerAlarm(this.getCfnAlarm(policy.lowerAlarm));
        this.handleUpperAlarm(this.getCfnAlarm(policy.upperAlarm));
    }

    protected handleLowerAlarm(alarm?: CfnAlarm): void {
        if (alarm) {
            this.setTreatMissingData(alarm, TreatMissingData.BREACHING);
            this.setEvaluationPeriods(alarm, 5);
            this.setDatapointsToAlarm(alarm, 5);
        }
    }

    protected handleUpperAlarm(alarm?: CfnAlarm): void {
        if (alarm) {
            this.setTreatMissingData(alarm, TreatMissingData.NOT_BREACHING);
            this.setEvaluationPeriods(alarm, 3);
            this.setDatapointsToAlarm(alarm, 3);
        }
    }

    protected setEvaluationPeriods(alarm: CfnAlarm, count: number): void {
        alarm.evaluationPeriods = count;
    }

    protected setDatapointsToAlarm(alarm: CfnAlarm, count: number): void {
        alarm.datapointsToAlarm = count;
    }

    protected setTreatMissingData(alarm: CfnAlarm, type: TreatMissingData = TreatMissingData.NOT_BREACHING): void {
        alarm.treatMissingData = type;
    }

    protected getCfnAlarm(alarm?: Alarm): CfnAlarm | undefined {
        return alarm ? alarm.node.defaultChild as CfnAlarm : undefined;
    }
}