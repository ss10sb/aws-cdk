import {
    EcsServiceAndTaskConfigProps,
    Schedulable,
    SchedulableTypes,
    TaskServiceType,
    Wrapper
} from "./task-definitions";
import {Cluster, FargatePlatformVersion, FargateTaskDefinition, TaskDefinition} from "aws-cdk-lib/aws-ecs";
import {Construct} from "constructs";
import {CronOptions, Schedule} from "aws-cdk-lib/aws-events";
import {ScheduledFargateTask} from "aws-cdk-lib/aws-ecs-patterns";
import {TaskDefinitionFactory} from "./task-definition-factory";
import {EcsRunTask, EcsRunTaskProps} from "../task/ecs-run-task";
import {AbstractFactory} from "../core/abstract-factory";
import {FilesBucket} from "../s3/s3-files";
import {EcsS3FilesHelper} from "../nfs/ecs-s3-files-helper";
import {SecurityGroup} from "aws-cdk-lib/aws-ec2";

export interface EcsTaskFactoryProps {
    readonly cluster: Cluster;
    readonly taskDefinitionFactory: TaskDefinitionFactory;
    readonly s3Files?: FilesBucket;
}

export interface EcsTaskConfigProps extends EcsServiceAndTaskConfigProps {
    readonly schedule?: Schedulable;
    readonly enabled?: boolean;
}

export class EcsTaskFactory extends AbstractFactory {

    readonly s3FilesHelper: EcsS3FilesHelper;
    readonly props: EcsTaskFactoryProps;
    readonly defaults: Record<string, any> = {
        platformVersion: FargatePlatformVersion.LATEST
    }

    constructor(scope: Construct, id: string, props: EcsTaskFactoryProps) {
        super(scope, id);
        this.props = props;
        this.s3FilesHelper = new EcsS3FilesHelper();
    }

    create(tasks: EcsTaskConfigProps[]): Wrapper[] {
        const taskWrappers: Wrapper[] = [];
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

    private createFromTask(task: EcsTaskConfigProps): Wrapper | null {
        const taskDefinition = this.getTaskDefinitionFactory().create(task.type, task.taskDefinition);
        if (task.type === TaskServiceType.SCHEDULED_TASK) {
            return {
                type: task.type,
                taskDefinition: taskDefinition,
                resource: this.createScheduledTask(task, <FargateTaskDefinition>taskDefinition)
            };
        }
        if (task.type === TaskServiceType.UPDATE_RUN_ONCE_TASK) {
            return {
                type: task.type,
                taskDefinition: taskDefinition,
                resource: this.createRunOnceOnUpdate(task, <FargateTaskDefinition>taskDefinition)
            };
        }
        if (task.type === TaskServiceType.RUN_ONCE_TASK) {
            return this.createRunOnceNoEvent(task, taskDefinition);
        }
        return null;
    }

    private createRunOnceNoEvent(task: EcsTaskConfigProps, taskDefinition: TaskDefinition): Wrapper {
        return {
            taskDefinition: taskDefinition,
            type: task.type,
            grantSecrets: true
        }
    }

    private createRunOnceOnCreate(task: EcsTaskConfigProps, taskDefinition: FargateTaskDefinition): EcsRunTask {
        return this.createRunOnce(task, {
            cluster: this.props.cluster,
            taskDefinition: taskDefinition,
            runOnCreate: true,
            runOnUpdate: false,
            fargatePlatformVersion: this.defaults.platformVersion
        });
    }

    private createRunOnceOnUpdate(task: EcsTaskConfigProps, taskDefinition: FargateTaskDefinition): EcsRunTask {
        return this.createRunOnce(task, {
            cluster: this.props.cluster,
            taskDefinition: taskDefinition,
            runOnCreate: false,
            runOnUpdate: true,
            fargatePlatformVersion: this.defaults.platformVersion
        });
    }

    private createRunOnceOnCreateAndUpdate(task: EcsTaskConfigProps, taskDefinition: FargateTaskDefinition): EcsRunTask {
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
        const service = new EcsRunTask(this.scope, name, runTaskProps);
        this.s3FilesHelper.addIngressToService(service, this.props.s3Files);
        return service;
    }

    private createScheduledTask(task: EcsTaskConfigProps, taskDefinition: FargateTaskDefinition): ScheduledFargateTask {
        const name = this.getTaskName(task);
        const securityGroup = new SecurityGroup(this.scope, `${name}-sg`, {
            vpc: this.props.cluster.vpc,
            allowAllOutbound: true
        });
        const service = new ScheduledFargateTask(this.scope, name, {
            scheduledFargateTaskDefinitionOptions: {
                taskDefinition: taskDefinition
            },
            schedule: this.getSchedule(task),
            cluster: this.props.cluster,
            platformVersion: this.defaults.platformVersion,
            ruleName: name,
            enabled: task.enabled ?? true,
            securityGroups: [securityGroup]
        });
        this.s3FilesHelper.addIngressToService(securityGroup, this.props.s3Files);

        return service;
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