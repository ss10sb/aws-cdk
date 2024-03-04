import {MakeBase} from "./make-base";
import {ARecord} from "aws-cdk-lib/aws-route53";
import {Route53ARecord} from "../../../route53/route53-a-record";
import {EnvTasksAndServicesProps} from "../../../env/env-ecs-stack";
import {Cluster, ICluster} from "aws-cdk-lib/aws-ecs";
import {ClusterFactory} from "../../../ecs/cluster-factory";
import {Secrets} from "../../../secret/secrets";
import {FargateFactory, FargateTasksAndServices} from "../../../ecs/fargate-factory";
import {EcrRepositoryFactory} from "../../../ecr/ecr-repository-factory";
import {HealthCheck} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import {AlbListenerRuleProps} from "../../../alb/alb-listener-rule";
import {AlbTargetGroupProps} from "../../../alb/alb-target-group";
import {EcsStandardServiceConfigProps} from "../../../ecs/ecs-standard-service-factory";
import {EcsTaskConfigProps} from "../../../ecs/ecs-task-factory";
import {StartStopFactory, StartStopFactoryProps} from "../../../start-stop/start-stop-factory";
import {EcsQueueConfigProps} from "../../../ecs/ecs-queue-factory";
import {PermissionsEnvEcsStack} from "../../../permissions/permissions-env-ecs-stack";
import {MakeConfig, MakeParameters} from "../make-definitions";
import {AlbResources, MakeAlbResources} from "./make-alb-resources";
import {CoreMakeResources} from "./make-core-resources";
import {EnvEnvironmentProps} from "../../../env/env-definitions";

export interface MakeEcsParameters extends MakeParameters {
    repositoryFactory: EcrRepositoryFactory;
    ecs: EcsParameters;
}

export interface EcsParameters {
    readonly healthCheck?: HealthCheck;
    readonly listenerRule?: AlbListenerRuleProps;
    readonly targetGroup?: AlbTargetGroupProps;
    readonly services: EcsStandardServiceConfigProps[];
    readonly tasks: EcsTaskConfigProps[];
    readonly startStop?: StartStopFactoryProps;
    readonly queue?: EcsQueueConfigProps;
    readonly containerInsights?: boolean;
}

export class MakeEcs<T extends MakeEcsParameters> extends MakeBase<T> {

    public make(services: CoreMakeResources) {
        this.createARecordsForCertificates();
        let albServices: AlbResources | Record<string, any> = {};
        if (this.parameters.ecs.targetGroup) {
            const makeAlbServices = new MakeAlbResources(this.scope, this.scope.node.id, this.lookups, {
                targetGroup: this.getTargetGroupProps(),
                listenerRule: <AlbListenerRuleProps>this.parameters.ecs.listenerRule,
                healthCheck: this.parameters.ecs.healthCheck,
                alarmEmails: this.parameters.alarmEmails ?? [],
            });
            albServices = makeAlbServices.make();
        }
        const cluster = this.createCluster();
        const tasksAndServices = this.createTasksAndServices({
            cluster: cluster,
            targetGroup: albServices.targetGroup,
            queue: services.queue,
            repositoryFactory: this.parameters.repositoryFactory,
            environment: this.getBaseEnvironmentFromCoreServices(services),
        }, this.lookups.secrets);
        const startStopFactory = this.createStartStopFactory(cluster);
        new PermissionsEnvEcsStack(this.scope, this.scope.node.id, {
            repositoryFactory: this.parameters.repositoryFactory,
            cluster: cluster,
            tasksAndServices: tasksAndServices,
            startStop: startStopFactory,
            listenerRule: albServices.listenerRule,
            targetGroup: albServices.targetGroup,
            aRecord: services.aRecord,
            queue: services.queue,
            s3: services.s3,
            sesVerify: services.sesVerify,
            table: services.table,
            secrets: services.secret,
            sharedSecrets: services.sharedSecret
        });
    }

    protected addEnvironmentForThis(envProps: EnvEnvironmentProps, environment: Record<string, string>) {
        environment['APP_BASE_PATH'] = '/app';
    }

    private getTargetGroupProps(): AlbTargetGroupProps {
        return <AlbTargetGroupProps>this.parameters.ecs.targetGroup;
    }

    private createARecordsForCertificates(): ARecord[] {
        const aRecords: ARecord[] = [];
        const aRecordFactory = new Route53ARecord(this.scope, this.scope.node.id, this.lookups.getAliasTarget(), this.parameters?.hostedZoneDomain);
        for (const certProps of this.parameters.certificates ?? []) {
            if (certProps.domainName !== this.getDefaultDomainName()) {
                const r = aRecordFactory.createARecordForDomain(certProps.domainName);
                if (r) {
                    aRecords.push(r);
                }
            }
        }
        return aRecords;
    }

    private createCluster(): Cluster {
        const clusterFactory = new ClusterFactory(this.scope, this.scope.node.id, {
            vpc: this.lookups.vpc,
            alarmEmails: this.parameters.alarmEmails ?? [],
            containerInsights: this.parameters.ecs.containerInsights ?? false,
        });
        return clusterFactory.create();
    }

    private createStartStopFactory(cluster: ICluster): StartStopFactory | undefined {
        if (this.config.Parameters?.startStop) {
            const startStopProps = this.config.Parameters?.startStop ?? {};
            const startStopFunctionProps = startStopProps.stopStartFunctionProps ?? {};
            startStopFunctionProps.clusterName = cluster.clusterName;
            startStopProps.stopStartFunctionProps = startStopFunctionProps;
            const factory = new StartStopFactory(this.scope, this.scope.node.id, startStopProps);
            factory.createRules(cluster);
            return factory;
        }
    }

    private createTasksAndServices(props: EnvTasksAndServicesProps, secrets: Secrets): FargateTasksAndServices {
        const factory = new FargateFactory(this.scope, this.scope.node.id, {
            commandFactoryProps: {},
            containerFactoryProps: {
                repositoryFactory: props.repositoryFactory,
                secretKeys: this.parameters.secretKeys,
                sharedSecretKeys: this.parameters.sharedSecretKeys,
                environment: props.environment,
                secrets: secrets
            },
            queueFactoryProps: {
                cluster: props.cluster,
                repositoryFactory: props.repositoryFactory,
                secretKeys: this.parameters.secretKeys,
                sharedSecretKeys: this.parameters.sharedSecretKeys,
                environment: props.environment,
                secrets: secrets,
                queue: props.queue
            },
            standardServiceFactoryProps: {
                cluster: props.cluster,
                targetGroup: props.targetGroup
            },
            taskDefinitionFactoryProps: {},
            taskFactoryProps: {
                cluster: props.cluster
            }
        });
        return factory.create(this.parameters.ecs.tasks ?? [], this.parameters.ecs.services ?? [], this.parameters.ecs.queue);
    }

    protected createParametersFromConfigAndProps(config: MakeConfig, props: Record<string, any>): Record<string, any> {
        const parameters = config.Parameters ?? {};
        parameters.repositoryFactory = props.repositoryFactory;
        return parameters;
    }
}