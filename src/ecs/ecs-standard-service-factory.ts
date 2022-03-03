import {AbstractFactory} from "../core";
import {
    EcsStandardServiceConfigProps,
    EcsStandardServiceFactoryProps,
    EcsStandardServiceProps,
    EcsStandardServiceWrapper,
    ScalableProps,
    ScalableTypes
} from "./task-definitions";
import {BaseService, Cluster, FargatePlatformVersion, FargateService, ScalableTaskCount} from "aws-cdk-lib/aws-ecs";
import {Construct} from "constructs";
import {TaskDefinitionFactory} from "./task-definition-factory";
import {IApplicationTargetGroup} from "aws-cdk-lib/aws-elasticloadbalancingv2";

export class EcsStandardServiceFactory extends AbstractFactory {

    readonly props: EcsStandardServiceFactoryProps;
    readonly defaults: Record<string, any> = {
        assignPublicIp: false,
        platformVersion: FargatePlatformVersion.LATEST,
        desiredCount: 1
    }

    constructor(scope: Construct, id: string, props: EcsStandardServiceFactoryProps) {
        super(scope, id);
        this.props = props;
    }

    create(services: EcsStandardServiceConfigProps[]): EcsStandardServiceWrapper[] {
        const created: EcsStandardServiceWrapper[] = [];
        for (const serviceProps of services) {
            created.push(this.createService(this.props.cluster, this.props.targetGroup, serviceProps));
        }
        return created;
    }

    getTaskDefinitionFactory(): TaskDefinitionFactory {
        return this.props.taskDefinitionFactory;
    }

    private createService(cluster: Cluster, targetGroup: IApplicationTargetGroup, serviceProps: EcsStandardServiceConfigProps): EcsStandardServiceWrapper {
        const name = this.getIncrementedName(`${this.id}-service-${serviceProps.type}`);
        const taskDefinition = this.getTaskDefinitionFactory().create(serviceProps.type, serviceProps.taskDefinition);
        const service = this.createStandardService({
            name: name,
            cluster: cluster,
            taskDefinition: taskDefinition,
            targetGroup: targetGroup,
            serviceProps: serviceProps
        });
        return {
            type: serviceProps.type,
            taskDefinition: taskDefinition,
            wrapper: service
        };
    }

    private createStandardService(props: EcsStandardServiceProps): BaseService {
        const service = new FargateService(this.scope, props.name, {
            cluster: props.cluster,
            serviceName: props.name,
            platformVersion: props.serviceProps.platformVersion ?? this.defaults.platformVersion,
            taskDefinition: props.taskDefinition,
            desiredCount: props.serviceProps.desiredCount ?? this.defaults.desiredCount,
            assignPublicIp: props.serviceProps.assignPublicIp ?? this.defaults.assignPublicIp,
            enableExecuteCommand: props.serviceProps.enableExecuteCommand ?? undefined
        });
        if (props.serviceProps.attachToTargetGroup) {
            service.attachToApplicationTargetGroup(props.targetGroup);
        }
        if (props.serviceProps.scalable) {
            this.scalableTarget(service, props.serviceProps.scalable);
        }
        return service;
    }

    private scalableTarget(service: BaseService, scalableProps: ScalableProps): ScalableTaskCount {
        const scalableTarget = service.autoScaleTaskCount({
            maxCapacity: scalableProps.maxCapacity,
            minCapacity: scalableProps.minCapacity
        });
        this.addScaling(scalableTarget, scalableProps);
        return scalableTarget;
    }

    private addScaling(scalableTarget: ScalableTaskCount, scalableProps: ScalableProps): void {
        for (const type of scalableProps.types) {
            if (type === ScalableTypes.CPU) {
                scalableTarget.scaleOnCpuUtilization(this.mixNameWithId('service-scale-cpu'), {
                    targetUtilizationPercent: scalableProps.scaleAt
                });
            }
            if (type === ScalableTypes.MEMORY) {
                scalableTarget.scaleOnMemoryUtilization(this.mixNameWithId('service-scale-mem'), {
                    targetUtilizationPercent: scalableProps.scaleAt
                });
            }
        }
    }
}