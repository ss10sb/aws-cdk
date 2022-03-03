import {BaseParameters, StackConfig} from '../config';
import {AlbListenerRuleProps, AlbTargetGroupProps} from "../alb";
import {ApplicationListenerRule, HealthCheck, IApplicationTargetGroup} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import {EcrRepositoryFactory} from "../ecr";
import {Queue} from "aws-cdk-lib/aws-sqs";
import {Table} from "aws-cdk-lib/aws-dynamodb";
import {Bucket} from "aws-cdk-lib/aws-s3";
import {EcsQueueConfigProps, EcsStandardServiceConfigProps, EcsTaskConfigProps, FargateTasksAndServices} from "../ecs";
import {DynamoDbProps} from "../dynamodb";
import {S3Props} from "../s3";
import {ARecord} from "aws-cdk-lib/aws-route53";
import {VerifySesDomain} from "../ses";
import {Cluster} from "aws-cdk-lib/aws-ecs";
import {StartStopFactory, StartStopFactoryProps} from "../start-stop";

export interface EnvConfig extends StackConfig {
    readonly Parameters: EnvParameters;
}

export interface EnvParameters extends BaseParameters {
    readonly deploy?: boolean;
    readonly canCreateTask?: boolean;
    readonly hostedZoneDomain?: string;
    readonly dynamoDb?: DynamoDbProps;
    readonly subdomain?: string;
    readonly steps?: Record<string, object>;
    readonly healthCheck?: HealthCheck;
    readonly listenerRule: AlbListenerRuleProps;
    readonly targetGroup: AlbTargetGroupProps;
    readonly services: EcsStandardServiceConfigProps[];
    readonly tasks: EcsTaskConfigProps[];
    readonly queue?: EcsQueueConfigProps;
    readonly alarmEmails?: string[];
    readonly s3?: S3Props;
    readonly startStop?: StartStopFactoryProps;
    readonly containerInsights?: boolean;
    readonly secretKeys?: string[];
}

export interface EnvProps {
    readonly repositoryFactory: EcrRepositoryFactory;
}

export interface EnvTasksAndServicesProps {
    readonly cluster: Cluster;
    readonly targetGroup: IApplicationTargetGroup;
    readonly repositoryFactory: EcrRepositoryFactory;
    readonly environment?: Record<string, any>;
    readonly queue?: Queue;
}

export interface EnvStackServicesProps {
    readonly cluster: Cluster;
    readonly listenerRule: ApplicationListenerRule;
    readonly repositoryFactory: EcrRepositoryFactory;
    readonly targetGroup: IApplicationTargetGroup;
    readonly tasksAndServices: FargateTasksAndServices;
    readonly aRecord?: ARecord;
    readonly queue?: Queue;
    readonly s3?: Bucket;
    readonly sesVerify?: VerifySesDomain;
    readonly startStop?: StartStopFactory;
    readonly table?: Table;
}

export interface EnvEnvironmentProps {
    readonly table?: Table;
    readonly queue?: Queue;
    readonly s3?: Bucket;
}
