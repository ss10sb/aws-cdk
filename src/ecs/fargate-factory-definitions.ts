import {EcsQueueWrapper, EcsStandardServiceWrapper, EcsTaskWrapper} from "../../src/ecs";

export enum FargateFactories {
    COMMANDS = 'commands',
    CONTAINERS = 'containers',
    QUEUES = 'queues',
    SERVICES = 'services',
    TASKDEFINITIONS = 'taskdefinitions',
    TASKS = 'tasks'
}

// these are generic record sets so that they can be modified in the fargate factory
export interface FargateFactoryProps {
    commandFactoryProps: Record<string, any>;
    containerFactoryProps: Record<string, any>;
    queueFactoryProps: Record<string, any>;
    standardServiceFactoryProps: Record<string, any>;
    taskDefinitionFactoryProps: Record<string, any>;
    taskFactoryProps: Record<string, any>;
}

export interface FargateTasksAndServices {
    tasks: EcsTaskWrapper[];
    services: EcsStandardServiceWrapper[];
    queue?: EcsQueueWrapper;
}