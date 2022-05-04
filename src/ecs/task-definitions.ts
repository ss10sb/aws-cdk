import {ContainerFactory} from "./container-factory";
import {Queue} from "aws-cdk-lib/aws-sqs";
import {
    BaseService,
    Cluster,
    Compatibility,
    FargatePlatformVersion,
    NetworkMode,
    TaskDefinition
} from "aws-cdk-lib/aws-ecs";
import {ContainerProps} from "./container-definitions";
import {QueueProcessingFargateService, ScheduledFargateTask} from "aws-cdk-lib/aws-ecs-patterns";
import {EcsRunTask} from "../task";
import {Command} from "@aws-sdk/client-ssm";
import {EcrRepositoryFactory, EcrRepositoryType} from "../ecr";
import {CronOptions} from "aws-cdk-lib/aws-events";
import {Secrets} from "../secret";
import {ContainerCommandFactory} from "./container-command-factory";
import {IApplicationTargetGroup} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import {TaskDefinitionFactory} from "./task-definition-factory";
import {ScalingInterval} from "aws-cdk-lib/aws-applicationautoscaling";

export enum TaskServiceType {
    WEB_SERVICE = 'web',
    TASK = 'task',
    SCHEDULED_TASK = 'scheduledtask',
    RUN_ONCE_TASK = 'runtask',
    CREATE_RUN_ONCE_TASK = 'createruntask',
    UPDATE_RUN_ONCE_TASK = 'updateruntask',
    QUEUE_SERVICE = 'queue'
}

export interface TaskDefinitionFactoryProps {
    readonly containerFactory: ContainerFactory;
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

export interface EcsQueueConfigProps extends BaseServiceAndTaskProps {
    readonly image: EcrRepositoryType | string;
    readonly command?: Command;
    readonly cpu: number;
    readonly hasSecrets?: boolean;
    readonly hasEnv?: boolean;
    readonly hasDeadLetterQueue?: boolean;
    readonly retentionPeriodInDays?: number;
    readonly maxReceiveCount?: number;
    readonly memoryLimitMiB?: number;
    readonly minScalingCapacity?: number;
    readonly maxScalingCapacity?: number;
    readonly scalingSteps?: ScalingInterval[];
}

export interface EcsQueueFactoryProps {
    readonly cluster: Cluster;
    readonly repositoryFactory: EcrRepositoryFactory;
    readonly secretKeys?: string[];
    readonly environment?: Record<string, string>;
    readonly secrets: Secrets;
    readonly commandFactory: ContainerCommandFactory;
    readonly queue?: Queue;
}

export interface EcsStandardServiceBaseProps {
    readonly name: string;
    readonly cluster: Cluster;
    readonly taskDefinition: TaskDefinition;
    readonly serviceProps: EcsStandardServiceConfigProps;
}

export interface EcsStandardServiceProps extends EcsStandardServiceBaseProps {
    readonly targetGroup: IApplicationTargetGroup;
}

export interface EcsStandardServiceFactoryProps {
    readonly cluster: Cluster;
    readonly targetGroup: IApplicationTargetGroup;
    readonly taskDefinitionFactory: TaskDefinitionFactory;
}

export interface EcsServiceAndTaskConfigProps extends BaseServiceAndTaskProps {
    readonly desiredCount?: number;
    readonly taskDefinition: TaskDefinitionProps;
}

export interface EcsStandardServiceConfigProps extends EcsServiceAndTaskConfigProps {
    readonly assignPublicIp?: boolean;
    readonly scalable?: ScalableProps;
    readonly attachToTargetGroup: boolean;
}

export interface EcsTaskConfigProps extends EcsServiceAndTaskConfigProps {
    readonly skipCreateTask?: boolean;
    readonly schedule?: Schedulable;
    readonly enabled?: boolean;
}

export interface EcsTaskFactoryProps {
    readonly cluster: Cluster;
    readonly taskDefinitionFactory: TaskDefinitionFactory;
}

export interface TaskDefinitionProps {
    readonly compatibility?: Compatibility;
    readonly networkMode?: NetworkMode;
    readonly cpu: string;
    readonly memoryMiB: string;
    readonly containers: ContainerProps[];
}

export interface Wrapper {
    readonly taskDefinition: TaskDefinition;
    readonly type: TaskServiceType;
}

export interface EcsStandardServiceWrapper extends Wrapper {
    readonly wrapper: BaseService;
}

export interface EcsTaskWrapper extends Wrapper {
    readonly wrapper: ScheduledFargateTask | EcsRunTask;
}

export interface EcsQueueWrapper extends Wrapper {
    readonly wrapper: QueueProcessingFargateService;
}
