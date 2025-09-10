import {Construct} from "constructs";
import {Connections, IConnectable, ISecurityGroup, IVpc, SecurityGroup, SubnetType} from "aws-cdk-lib/aws-ec2";
import {AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId} from "aws-cdk-lib/custom-resources";
import {FargatePlatformVersion, FargateTaskDefinition, ICluster, LaunchType} from "aws-cdk-lib/aws-ecs";
import {LogGroup, RetentionDays} from "aws-cdk-lib/aws-logs";
import {NamingHelper} from "../utils/naming-helper";

export interface EcsRunTaskProps {
    readonly vpc?: IVpc;
    readonly cluster: ICluster;
    readonly taskDefinition: FargateTaskDefinition;
    readonly securityGroup?: ISecurityGroup;
    readonly fargatePlatformVersion?: FargatePlatformVersion;
    readonly runOnUpdate?: boolean;
    readonly runOnCreate?: boolean;
}

export class EcsRunTask extends Construct implements IConnectable {

    readonly resource?: AwsCustomResource;
    readonly connections: Connections;
    readonly vpc: IVpc;
    readonly securityGroup: ISecurityGroup;
    readonly cluster: ICluster;
    readonly taskDefinition: FargateTaskDefinition;

    constructor(scope: Construct, id: string, props: EcsRunTaskProps) {
        super(scope, id);
        this.vpc = props.vpc ?? props.cluster.vpc;
        this.cluster = props.cluster;
        this.taskDefinition = props.taskDefinition;
        this.securityGroup = props.securityGroup ?? new SecurityGroup(this, 'SecurityGroup', {vpc: this.vpc});
        this.connections = new Connections({securityGroups: [this.securityGroup]});
        const onEvent = {
            service: 'ECS',
            action: 'runTask',
            physicalResourceId: PhysicalResourceId.of(this.taskDefinition.taskDefinitionArn),
            parameters: {
                cluster: this.cluster.clusterName,
                taskDefinition: this.taskDefinition.taskDefinitionArn,
                capacityProviderStrategy: [],
                launchType: LaunchType.FARGATE,
                platformVersion: props.fargatePlatformVersion,
                networkConfiguration: {
                    awsvpcConfiguration: {
                        assignPublicIp: 'DISABLED',
                        subnets: this.vpc.selectSubnets({
                            subnetType: SubnetType.PRIVATE_WITH_EGRESS
                        }).subnetIds,
                        securityGroups: [this.securityGroup.securityGroupId]
                    }
                }
            }
        }
        const name = this.getName(props);
        const logGroup = new LogGroup(this, `${name}-log-group`, {
            retention: RetentionDays.ONE_WEEK,
        });
        this.resource = new AwsCustomResource(this, name, {
            onCreate: props.runOnCreate ? onEvent : undefined,
            onUpdate: props.runOnUpdate ? onEvent : undefined,
            policy: AwsCustomResourcePolicy.fromSdkCalls({resources: [this.taskDefinition.taskDefinitionArn]}),
            logGroup: logGroup,
            functionName: name
        });
        this.taskDefinition.taskRole.grantPassRole(this.resource.grantPrincipal);
        this.taskDefinition.obtainExecutionRole().grantPassRole(this.resource.grantPrincipal);
    }

    protected getName(props: EcsRunTaskProps): string {
        const parts = [
            props.runOnCreate ? 'create' : '',
            props.runOnUpdate ? 'update' : '',
            'fn'
        ];
        return NamingHelper.fromParts(parts);
    }
}