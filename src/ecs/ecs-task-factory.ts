import {
    EcsServiceAndTaskConfigProps,
    Schedulable,
    SchedulableTypes,
    TaskServiceType, Wrapper
} from "./task-definitions";
import {Cluster, FargatePlatformVersion, TaskDefinition} from "aws-cdk-lib/aws-ecs";
import {Construct} from "constructs";
import {CronOptions, Schedule} from "aws-cdk-lib/aws-events";
import {ScheduledFargateTask} from "aws-cdk-lib/aws-ecs-patterns";
import {TaskDefinitionFactory} from "./task-definition-factory";
import {EcsRunTask, EcsRunTaskProps} from "../task/ecs-run-task";
import {AbstractFactory} from "../core/abstract-factory";

export interface EcsTaskFactoryProps {
    readonly cluster: Cluster;
    readonly taskDefinitionFactory: TaskDefinitionFactory;
}

export interface EcsTaskConfigProps extends EcsServiceAndTaskConfigProps {
    readonly skipCreateTask?: boolean;
    readonly schedule?: Schedulable;
    readonly enabled?: boolean;
}

export interface EcsTaskWrapper extends Wrapper {
    readonly wrapper: ScheduledFargateTask | EcsRunTask;
}

export class EcsTaskFactory extends AbstractFactory {

    readonly props: EcsTaskFactoryProps;
    readonly defaults: Record<string, any> = {
        platformVersion: FargatePlatformVersion.LATEST
    }

    constructor(scope: Construct, id: string, props: EcsTaskFactoryProps) {
        super(scope, id);
        this.props = props;
    }

    create(tasks: EcsTaskConfigProps[]): EcsTaskWrapper[] {
        const taskWrappers: EcsTaskWrapper[] = [];
        for (const task of tasks) {
            const created = this.createFromTask(task);
            if (created) {
                taskWrappers.push(created);
            }
        }
        return taskWrappers;
    }

    getTaskDefinitionFactory(): TaskDefinitionFactory {
        return this.props.taskDefinitionFactory;
    }

    private createFromTask(task: EcsTaskConfigProps): EcsTaskWrapper | null {
        const taskDefinition = this.getTaskDefinitionFactory().create(task.type, task.taskDefinition);
        let resource: ScheduledFargateTask | EcsRunTask | undefined;
        if (task.type === TaskServiceType.SCHEDULED_TASK) {
            resource = this.createScheduledTask(task, taskDefinition);
        } else if (task.type === TaskServiceType.CREATE_RUN_ONCE_TASK) {
            resource = this.createRunOnceOnCreate(task, taskDefinition);

        } else if (task.type === TaskServiceType.UPDATE_RUN_ONCE_TASK) {
            resource = this.createRunOnceOnUpdate(task, taskDefinition);
        }
        return resource ? {
            type: task.type,
            taskDefinition: taskDefinition,
            wrapper: resource
        } : null;
    }

    private createRunOnceOnCreate(task: EcsTaskConfigProps, taskDefinition: TaskDefinition): EcsRunTask {
        return this.createRunOnce(task, {
            cluster: this.props.cluster,
            taskDefinition: taskDefinition,
            runOnCreate: true,
            runOnUpdate: false,
            fargatePlatformVersion: this.defaults.platformVersion
        });
    }

    private createRunOnceOnUpdate(task: EcsTaskConfigProps, taskDefinition: TaskDefinition): EcsRunTask {
        return this.createRunOnce(task, {
            cluster: this.props.cluster,
            taskDefinition: taskDefinition,
            runOnCreate: false,
            runOnUpdate: true,
            fargatePlatformVersion: this.defaults.platformVersion
        });
    }

    private createRunOnceOnCreateAndUpdate(task: EcsTaskConfigProps, taskDefinition: TaskDefinition): EcsRunTask {
        return this.createRunOnce(task, {
            cluster: this.props.cluster,
            taskDefinition: taskDefinition,
            runOnCreate: true,
            runOnUpdate: true,
            fargatePlatformVersion: this.defaults.platformVersion
        });
    }

    private createRunOnce(task: EcsTaskConfigProps, runTaskProps: EcsRunTaskProps): EcsRunTask {
        const name = this.getTaskName(task);
        return new EcsRunTask(this.scope, name, runTaskProps);
    }

    private createScheduledTask(task: EcsTaskConfigProps, taskDefinition: TaskDefinition): ScheduledFargateTask {
        const name = this.getTaskName(task);
        return new ScheduledFargateTask(this.scope, name, {
            scheduledFargateTaskDefinitionOptions: {
                taskDefinition: taskDefinition
            },
            schedule: this.getSchedule(task),
            cluster: this.props.cluster,
            platformVersion: this.defaults.platformVersion,
            ruleName: name,
            enabled: task.enabled ?? true
        });
    }

    private getSchedule(task: EcsTaskConfigProps): Schedule {
        let schedule = Schedule.expression('rate(1 minute)');
        if (task.schedule) {
            if (task.schedule.type === SchedulableTypes.EXPRESSION) {
                schedule = Schedule.expression(<string>task.schedule.value);
            }
            if (task.schedule.type === SchedulableTypes.CRON) {
                schedule = Schedule.cron(<CronOptions>task.schedule.value);
            }
        }
        return schedule;
    }

    private getTaskName(task: EcsTaskConfigProps): string {
        return this.getIncrementedName(this.mixNameWithId(`task-${task.type}`));
    }
}