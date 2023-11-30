import {
    BaseService,
    FargatePlatformVersion,
    TaskDefinition
} from "aws-cdk-lib/aws-ecs";
import {CronOptions} from "aws-cdk-lib/aws-events";
import {TaskDefinitionProps} from "./task-definition-factory";
import {QueueProcessingFargateService, ScheduledFargateTask} from "aws-cdk-lib/aws-ecs-patterns";
import {EcsRunTask} from "../task/ecs-run-task";

export enum TaskServiceType {
    WEB_SERVICE = 'web',
    TASK = 'task',
    SCHEDULED_TASK = 'scheduledtask',
    RUN_ONCE_TASK = 'runtask',
    CREATE_RUN_ONCE_TASK = 'createruntask',
    UPDATE_RUN_ONCE_TASK = 'updateruntask',
    QUEUE_SERVICE = 'queue'
}

export enum ScalableTypes {
    CPU = 'cpu',
    MEMORY = 'mem'
}

export interface ScalableProps {
    readonly types: ScalableTypes[];
    readonly scaleAt: number;
    readonly minCapacity: number;
    readonly maxCapacity: number;
}

export enum SchedulableTypes {
    CRON,
    EXPRESSION
}

export interface Schedulable {
    readonly type: SchedulableTypes;
    readonly value: string | CronOptions;
}

export interface BaseServiceAndTaskProps {
    readonly type: TaskServiceType;
    readonly platformVersion?: FargatePlatformVersion;
    readonly enableExecuteCommand?: boolean;
}

export interface EcsServiceAndTaskConfigProps extends BaseServiceAndTaskProps {
    readonly desiredCount?: number;
    readonly taskDefinition: TaskDefinitionProps;
}

export interface Wrapper {
    readonly taskDefinition: TaskDefinition;
    readonly type: TaskServiceType;
    readonly grantSecrets?: boolean;
    readonly enableExecuteCommand?: boolean;
    readonly resource?: ScheduledFargateTask | EcsRunTask | BaseService | QueueProcessingFargateService | undefined;
}