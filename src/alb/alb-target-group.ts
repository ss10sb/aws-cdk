import {IVpc} from "aws-cdk-lib/aws-ec2";
import {Construct} from "constructs";
import {ApplicationProtocol, ApplicationTargetGroup, TargetType} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import {NonConstruct} from "../core/non-construct";

export interface AlbTargetGroupProps {
    readonly port?: number;
    readonly protocol?: ApplicationProtocol;
    readonly targetType?: TargetType;
}

export class AlbTargetGroup extends NonConstruct {

    readonly vpc: IVpc;

    constructor(scope: Construct, id: string, vpc: IVpc) {
        super(scope, id);
        this.vpc = vpc;
    }

    create(props: AlbTargetGroupProps): ApplicationTargetGroup {
        return new ApplicationTargetGroup(this.scope, this.id, {
            port: props.port ?? 80,
            vpc: this.vpc,
            protocol: props.protocol ?? ApplicationProtocol.HTTP,
            targetType: props.targetType ?? TargetType.IP,
            targetGroupName: this.id
        });
    }
}