import {AbstractFactory} from "../core";
import {TaskDefinitionFactoryProps, TaskDefinitionProps, TaskServiceType} from "./task-definitions";
import {Compatibility, NetworkMode, TaskDefinition} from "aws-cdk-lib/aws-ecs";
import {Construct} from "constructs";
import {Role, ServicePrincipal} from "aws-cdk-lib/aws-iam";
import {PhysicalName} from "aws-cdk-lib";
import {ContainerFactory} from "./container-factory";

export class TaskDefinitionFactory extends AbstractFactory {

    readonly props: TaskDefinitionFactoryProps;
    readonly defaults: Record<string, any> = {
        compatibility: Compatibility.FARGATE,
        networkMode: NetworkMode.AWS_VPC
    }

    constructor(scope: Construct, id: string, props: TaskDefinitionFactoryProps) {
        super(scope, id);
        this.props = props;
    }

    create(type: TaskServiceType, props: TaskDefinitionProps): TaskDefinition {
        const name = this.getIncrementedName(this.mixNameWithId(`task-def-${type}`));
        const td = new TaskDefinition(this.scope, name, {
            family: name,
            compatibility: props.compatibility ?? this.defaults.compatibility,
            cpu: props.cpu,
            memoryMiB: props.memoryMiB,
            networkMode: props.networkMode ?? this.defaults.networkMode,
            executionRole: new Role(this.scope, `${name}-exec-role`, {
                assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
                roleName: PhysicalName.GENERATE_IF_NEEDED
            })
        });
        this.getContainerFactory().create(type, td, props.containers);
        return td;
    }

    getContainerFactory(): ContainerFactory {
        return this.props.containerFactory;
    }
}