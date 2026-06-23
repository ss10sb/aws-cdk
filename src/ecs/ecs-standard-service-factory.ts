import {
    EcsServiceAndTaskConfigProps,
    ScalableProps,
    ScalableTypes, Wrapper
} from "./task-definitions";
import {
    BaseService,
    Cluster,
    FargatePlatformVersion,
    FargateService,
    ScalableTaskCount,
    TaskDefinition
} from "aws-cdk-lib/aws-ecs";
import {Construct} from "constructs";
import {TaskDefinitionFactory} from "./task-definition-factory";
import {IApplicationTargetGroup} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import {AbstractFactory} from "../core/abstract-factory";
import {FilesBucket} from "../s3/s3-files";
import {EcsS3FilesHelper} from "../nfs/ecs-s3-files-helper";

export interface EcsStandardServiceFactoryProps {
    readonly cluster: Cluster;
    readonly targetGroup: IApplicationTargetGroup;
    readonly taskDefinitionFactory: TaskDefinitionFactory;
    readonly s3Files?: FilesBucket;
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

export interface EcsStandardServiceConfigProps extends EcsServiceAndTaskConfigProps {
    readonly assignPublicIp?: boolean;
    readonly scalable?: ScalableProps;
    readonly attachToTargetGroup: boolean;
}

export class EcsStandardServiceFactory extends AbstractFactory {

    readonly s3FilesHelper: EcsS3FilesHelper;
    readonly props: EcsStandardServiceFactoryProps;
    readonly defaults: Record<string, any> = {
        assignPublicIp: false,
        platformVersion: FargatePlatformVersion.LATEST,
        desiredCount: 1
    }

    constructor(scope: Construct, id: string, props: EcsStandardServiceFactoryProps) {
        super(scope, id);
        this.props = props;
        this.s3FilesHelper = new EcsS3FilesHelper();
    }

    create(services: EcsStandardServiceConfigProps[]): Wrapper[] {
        const created: Wrapper[] = [];
        for (const serviceProps of services) {
            created.push(this.createService(this.props.cluster, this.props.targetGroup, serviceProps));
        }
        return created;
    }

    getTaskDefinitionFactory(): TaskDefinitionFactory {
        return this.props.taskDefinitionFactory;
    }

    private createService(cluster: Cluster, targetGroup: IApplicationTargetGroup, serviceProps: EcsStandardServiceConfigProps): Wrapper {
        const name = this.getIncrementedName(`${this.id}-service-${serviceProps.type}`);
        const taskDefinition = this.getTaskDefinitionFactory().create(serviceProps.type, serviceProps.taskDefinition);
        const service = this.createStandardService({
            name: name,
            cluster: cluster,
            taskDefinition: taskDefinition,
            targetGroup: targetGroup,
            serviceProps: serviceProps
        });
        this.s3FilesHelper.addIngressToService(service, this.props.s3Files);
        return {
            type: serviceProps.type,
            taskDefinition: taskDefinition,
            resource: service,
            enableExecuteCommand: (serviceProps.enableExecuteCommand ?? false)
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