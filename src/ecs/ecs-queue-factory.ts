import {BaseServiceAndTaskProps, Wrapper} from "./task-definitions";
import {Cluster, ContainerImage, FargatePlatformVersion, LogDriver, Secret} from "aws-cdk-lib/aws-ecs";
import {Construct} from "constructs";
import {LogGroup, RetentionDays} from "aws-cdk-lib/aws-logs";
import {Duration, RemovalPolicy} from "aws-cdk-lib";
import {QueueProcessingFargateService} from "aws-cdk-lib/aws-ecs-patterns";
import {ContainerCommand, ContainerCommandFactory, ContainerEntryPoint} from "./container-command-factory";
import {Command} from "@aws-sdk/client-ssm";
import {ScalingInterval} from "aws-cdk-lib/aws-applicationautoscaling";
import {Queue} from "aws-cdk-lib/aws-sqs";
import {QueueConfigProps} from "../sqs/sqs-definitions";
import {EcrRepositoryType} from "../ecr/ecr-definitions";
import {EcrRepositoryFactory} from "../ecr/ecr-repository-factory";
import {Secrets} from "../secret/secrets";
import {AbstractFactory} from "../core/abstract-factory";

export interface EcsQueueConfigProps extends BaseServiceAndTaskProps, QueueConfigProps {
    readonly image: EcrRepositoryType | string;
    readonly command?: Command;
    readonly cpu: number;
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

export interface EcsQueueWrapper extends Wrapper {
    readonly wrapper: QueueProcessingFargateService;
}

export class EcsQueueFactory extends AbstractFactory {

    readonly props: EcsQueueFactoryProps;
    readonly defaults: Record<string, any> = {
        assignPublicIp: false,
        platformVersion: FargatePlatformVersion.LATEST,
        command: ContainerCommand.QUEUE_WORK,
        minScalingCapacity: 0,
        maxScalingCapacity: 2
    }

    constructor(scope: Construct, id: string, props: EcsQueueFactoryProps) {
        super(scope, id);
        this.props = props;
    }

    create(props: EcsQueueConfigProps): EcsQueueWrapper {
        const name = this.getIncrementedName(`${this.id}-service-${props.type}`);
        const service = new QueueProcessingFargateService(this.scope, name, {
            image: this.getContainerImage(props.image),
            queue: this.props.queue,
            family: name,
            serviceName: name,
            cluster: this.props.cluster,
            platformVersion: props.platformVersion ?? this.defaults.platformVersion,
            assignPublicIp: this.defaults.assignPublicIp,
            command: this.getCommand(props),
            minScalingCapacity: props.minScalingCapacity ?? this.defaults.minScalingCapacity,
            maxScalingCapacity: props.maxScalingCapacity ?? this.defaults.maxScalingCapacity,
            cpu: props.cpu ?? undefined,
            memoryLimitMiB: props.memoryLimitMiB ?? undefined,
            secrets: this.getEcsSecrets(props.hasSecrets ?? false),
            environment: this.getEnvironment(props.hasEnv ?? false),
            logDriver: this.getLogging(name, props),
            retentionPeriod: props.retentionPeriodInDays ? Duration.days(props.retentionPeriodInDays) : undefined,
            maxReceiveCount: props.maxReceiveCount ?? undefined,
            scalingSteps: props.scalingSteps ?? this.getScalingSteps(),
        });
        return {
            type: props.type,
            taskDefinition: service.taskDefinition,
            wrapper: service,
        };
    }

    private getScalingSteps(): ScalingInterval[] {
        return [
            {upper: 0, change: -1},
            {lower: 1, change: +1},
            {lower: 10, change: +2}
        ];
    }

    private getCommand(props: EcsQueueConfigProps): string[] {
        const cmd = this.props.commandFactory.create(
            ContainerEntryPoint.PHP,
            props.command ?? this.defaults.command
        );
        return [...cmd.entryPoint ?? [], ...cmd.command ?? []];
    }

    private getContainerImage(name: EcrRepositoryType | string): ContainerImage {
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

    private getLogging(name: string, props: EcsQueueConfigProps): LogDriver {
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