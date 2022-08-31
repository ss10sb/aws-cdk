import {
    ContainerDefinition,
    ContainerDefinitionOptions,
    ContainerDependency,
    ContainerDependencyCondition,
    ContainerImage,
    LogDriver, PortMapping,
    Secret,
    TaskDefinition
} from "aws-cdk-lib/aws-ecs";
import {
    ContainerType
} from "./container-definitions";
import {Construct} from "constructs";
import {LogGroup, RetentionDays} from "aws-cdk-lib/aws-logs";
import {RemovalPolicy} from "aws-cdk-lib";
import {ContainerCommand, ContainerCommandFactory, ContainerEntryPoint} from "./container-command-factory";
import {EcrRepositoryFactory} from "../ecr/ecr-repository-factory";
import {Secrets} from "../secret/secrets";
import {EcrRepositoryType} from "../ecr/ecr-definitions";
import {AbstractFactory} from "../core/abstract-factory";
import {TaskServiceType} from "./task-definitions";

interface ContainerDependencies {
    dependencies: ContainerDependency[];
    dependsOn: ContainerDefinition[];
}

class ContainerDependencyFactory {
    containerDependencies: ContainerDependencies;

    constructor() {
        this.containerDependencies = {
            dependencies: [],
            dependsOn: [],
        }
    }

    add(container: ContainerDefinition, isDependency: boolean, dependsOn: boolean, condition: ContainerDependencyCondition = ContainerDependencyCondition.COMPLETE): void {
        if (isDependency) {
            this.addDependency(container, condition);
        }
        if (!isDependency && dependsOn) {
            this.addDependsOn(container);
        }
    }

    handle(): void {
        if (this.containerDependencies.dependencies.length > 0) {
            for (const dependsOnContainer of this.containerDependencies.dependsOn) {
                dependsOnContainer.addContainerDependencies(...this.containerDependencies.dependencies);
            }
        }
    }

    addDependency(container: ContainerDefinition, condition: ContainerDependencyCondition = ContainerDependencyCondition.COMPLETE): void {
        this.containerDependencies.dependencies.push({
            container: container,
            condition: condition
        });
    }

    addDependsOn(container: ContainerDefinition): void {
        this.containerDependencies.dependsOn.push(container);
    }
}

export interface ContainerFactoryProps {
    readonly repositoryFactory: EcrRepositoryFactory;
    readonly secretKeys?: string[];
    readonly environment?: Record<string, string>;
    readonly commandFactory: ContainerCommandFactory;
    readonly secrets: Secrets;
}

export interface ContainerProps {
    readonly type?: ContainerType;
    readonly image: EcrRepositoryType | string;
    readonly entryPoint?: ContainerEntryPoint;
    readonly command?: ContainerCommand;
    readonly additionalCommand?: string[];
    readonly cpu: number;
    readonly memoryLimitMiB: number;
    readonly portMappings?: PortMapping[];
    readonly hasSecrets?: boolean;
    readonly hasEnv?: boolean;
    readonly essential?: boolean;
    readonly dependency?: boolean;
    readonly dependsOn?: boolean;
}

export class ContainerFactory extends AbstractFactory {

    readonly props: ContainerFactoryProps;
    readonly defaults: Record<string, any> = {
        essential: true
    };

    constructor(scope: Construct, id: string, props: ContainerFactoryProps) {
        super(scope, id);
        this.props = props;
    }

    create(type: TaskServiceType, taskDefinition: TaskDefinition, props: ContainerProps[]): ContainerDefinition[] {
        const defs: ContainerDefinition[] = [];
        const depFactory = this.newDependencyFactory();
        for (const containerProps of props) {
            const containerType = this.getType(containerProps);
            if (!this.canCreate(type, containerType)) {
                continue;
            }
            const name = this.getIncrementedName(
                this.mixNameWithId(`container-${containerProps.image}-${type}-${containerType}`)
            );
            const c = taskDefinition.addContainer(name, this.getContainerOptions(name, containerProps));
            depFactory.add(
                c,
                containerProps.dependency ?? false,
                containerProps.dependsOn ?? false
            );
            defs.push(c);
        }
        depFactory.handle();
        return defs;
    }

    canCreate(taskServiceType: TaskServiceType, containerType: ContainerType): boolean {
        const tasks = [
            TaskServiceType.TASK,
            TaskServiceType.SCHEDULED_TASK,
            TaskServiceType.CREATE_RUN_ONCE_TASK,
            TaskServiceType.RUN_ONCE_TASK,
            TaskServiceType.UPDATE_RUN_ONCE_TASK
        ];
        const services = [TaskServiceType.WEB_SERVICE];
        const allowedTasks = [
            ContainerType.UNDEFINED,
            ContainerType.CREATE_RUN_ONCE_TASK,
            ContainerType.UPDATE_RUN_ONCE_TASK,
            ContainerType.RUN_ONCE_TASK,
            ContainerType.SCHEDULED_TASK
        ];
        const allowedServices = [ContainerType.UNDEFINED, ContainerType.SERVICE]
        const msg = `Task/Service type '${taskServiceType}' does not allow '${containerType}'.`;
        if (tasks.includes(taskServiceType) && !allowedTasks.includes(containerType)) {
            console.log(msg);
            return false;
        }
        if (services.includes(taskServiceType) && !allowedServices.includes(containerType)) {
            console.log(msg);
            return false;
        }
        return true;
    }

    newDependencyFactory(): ContainerDependencyFactory {
        return new ContainerDependencyFactory();
    }

    getCommandFactory(): ContainerCommandFactory {
        return this.props.commandFactory;
    }

    private getType(props: ContainerProps): ContainerType {
        if (props.type) {
            return props.type;
        }
        return ContainerType.UNDEFINED;
    }

    private getContainerOptions(name: string, containerProps: ContainerProps): ContainerDefinitionOptions {
        const options: { [key: string]: any } = {
            image: this.getContainerImage(containerProps.image),
            cpu: containerProps.cpu,
            memoryLimitMiB: containerProps.memoryLimitMiB,
            essential: containerProps.essential ?? this.defaults.essential,
            logging: this.getLogging(name, containerProps),
            secrets: this.getEcsSecrets(containerProps.hasSecrets ?? false),
            environment: this.getEnvironment(containerProps.hasEnv ?? false),
        };
        this.setEntryPointAndCommandProperties(containerProps, options);
        if (containerProps.portMappings) {
            options['portMappings'] = containerProps.portMappings;
        }
        return <ContainerDefinitionOptions>options;
    }

    private setEntryPointAndCommandProperties(props: ContainerProps, options: Record<string, any>): void {
        if (props.entryPoint !== undefined || props.command !== undefined) {
            const cmd = this.getCommandFactory().create(
                props.entryPoint ?? ContainerEntryPoint.UNDEFINED,
                props.command ?? ContainerCommand.UNDEFINED,
                props.additionalCommand ?? []
            );
            if (cmd.entryPoint) {
                options['entryPoint'] = cmd.entryPoint;
            }
            if (cmd.command) {
                options['command'] = cmd.command;
            }
        }
    }

    private getContainerImage(name: string): ContainerImage {
        return this.props.repositoryFactory.getContainerImageByName(name);
    }

    private getEcsSecrets(hasSecrets: boolean): Record<string, Secret> {
        if (hasSecrets) {
            return this.getSecrets().getEcsSecrets(this.props.secretKeys ?? []);
        }
        return {};
    }

    private getSecrets(): Secrets {
        return this.props.secrets;
    }

    private getEnvironment(hasEnvironment: boolean): Record<string, string> {
        if (hasEnvironment && this.props.environment) {
            return this.props.environment;
        }
        return {};
    }

    private getLogging(name: string, props: ContainerProps): LogDriver {
        const lgName = `${name}-log-group`;
        return LogDriver.awsLogs({
            streamPrefix: props.image,
            logGroup: new LogGroup(this.scope, lgName, {
                logGroupName: lgName,
                removalPolicy: RemovalPolicy.DESTROY,
                retention: RetentionDays.ONE_MONTH
            })
        });
    }
}