import {Construct} from "constructs";
import {ContainerCommandFactory, ContainerCommandFactoryProps} from "./container-command-factory";
import {ContainerFactory, ContainerFactoryProps} from "./container-factory";
import {EcsQueueConfigProps, EcsQueueFactory, EcsQueueFactoryProps, EcsQueueWrapper} from "./ecs-queue-factory";
import {TaskDefinitionFactory, TaskDefinitionFactoryProps} from "./task-definition-factory";
import {
    EcsStandardServiceConfigProps,
    EcsStandardServiceFactory,
    EcsStandardServiceFactoryProps, EcsStandardServiceWrapper
} from "./ecs-standard-service-factory";
import {EcsTaskConfigProps, EcsTaskFactory, EcsTaskFactoryProps, EcsTaskWrapper} from "./ecs-task-factory";
import {AbstractFactory} from "../core/abstract-factory";

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

export class FargateFactory extends AbstractFactory {

    readonly props: FargateFactoryProps;
    factories: Record<FargateFactories, AbstractFactory>;

    constructor(scope: Construct, id: string, props: FargateFactoryProps) {
        super(scope, id);
        this.props = props;
        this.factories = this.initFactories();
    }

    create(tasks: EcsTaskConfigProps[], services: EcsStandardServiceConfigProps[], queueProps?: EcsQueueConfigProps): FargateTasksAndServices {
        const allServices: FargateTasksAndServices = {
            tasks: this.getEcsTaskFactory().create(tasks),
            services: this.getEcsStandardServiceFactory().create(services),
            queue: undefined
        };
        if (queueProps) {
            allServices.queue = this.getEcsQueueFactory().create(queueProps);
        }
        return allServices;
    }

    getFactory(factory: FargateFactories): AbstractFactory {
        return this.factories[factory];
    }

    getEcsQueueFactory(): EcsQueueFactory {
        return <EcsQueueFactory>this.getFactory(FargateFactories.QUEUES);
    }

    getEcsStandardServiceFactory(): EcsStandardServiceFactory {
        return <EcsStandardServiceFactory>this.getFactory(FargateFactories.SERVICES);
    }

    getEcsTaskFactory(): EcsTaskFactory {
        return <EcsTaskFactory>this.getFactory(FargateFactories.TASKS);
    }

    private initFactories(): Record<FargateFactories, AbstractFactory> {
        return {
            [FargateFactories.COMMANDS]: this.initCommandFactory(),
            [FargateFactories.CONTAINERS]: this.initContainerFactory(),
            [FargateFactories.QUEUES]: this.initQueryFactory(),
            [FargateFactories.TASKDEFINITIONS]: this.initTaskDefinitionFactory(),
            [FargateFactories.SERVICES]: this.initStandardServiceFactory(),
            [FargateFactories.TASKS]: this.initTaskFactory()
        }
    }

    private initCommandFactory(): ContainerCommandFactory {
        const factory = new ContainerCommandFactory(this.scope, this.id, <ContainerCommandFactoryProps>this.props.commandFactoryProps);
        this.props.containerFactoryProps.commandFactory = factory;
        this.props.queueFactoryProps.commandFactory = factory;
        return factory;
    }

    private initContainerFactory(): ContainerFactory {
        const factory = new ContainerFactory(this.scope, this.id, <ContainerFactoryProps>this.props.containerFactoryProps);
        this.props.taskDefinitionFactoryProps.containerFactory = factory;
        return factory;
    }

    private initQueryFactory(): EcsQueueFactory {
        return new EcsQueueFactory(this.scope, this.id, <EcsQueueFactoryProps>this.props.queueFactoryProps);
    }

    private initTaskDefinitionFactory(): TaskDefinitionFactory {
        const factory = new TaskDefinitionFactory(this.scope, this.id, <TaskDefinitionFactoryProps>this.props.taskDefinitionFactoryProps);
        this.props.standardServiceFactoryProps.taskDefinitionFactory = factory;
        this.props.taskFactoryProps.taskDefinitionFactory = factory;
        return factory;
    }

    private initStandardServiceFactory(): EcsStandardServiceFactory {
        return new EcsStandardServiceFactory(this.scope, this.id, <EcsStandardServiceFactoryProps>this.props.standardServiceFactoryProps);
    }

    private initTaskFactory(): EcsTaskFactory {
        return new EcsTaskFactory(this.scope, this.id, <EcsTaskFactoryProps>this.props.taskFactoryProps);
    }
}