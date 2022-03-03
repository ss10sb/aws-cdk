import {ISecurityGroup, IVpc} from "aws-cdk-lib/aws-ec2";
import {FargatePlatformVersion, FargateTaskDefinition, ICluster} from "aws-cdk-lib/aws-ecs";

export interface EcsRunTaskProps {
    readonly vpc?: IVpc;
    readonly cluster: ICluster;
    readonly taskDefinition: FargateTaskDefinition;
    readonly securityGroup?: ISecurityGroup;
    readonly fargatePlatformVersion?: FargatePlatformVersion;
    readonly runOnUpdate?: boolean;
    readonly runOnCreate?: boolean;
}