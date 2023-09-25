import {IVpc} from "aws-cdk-lib/aws-ec2";
import {Construct} from "constructs";
import {ApplicationProtocol, ApplicationTargetGroup, TargetType} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import {NonConstruct} from "../core/non-construct";
import {ApplicationTargetGroupProps} from "aws-cdk-lib/aws-elasticloadbalancingv2/lib/alb/application-target-group";

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
        return new ApplicationTargetGroup(this.scope, this.id, this.getProps(props));
    }

    protected getProps(props: AlbTargetGroupProps): ApplicationTargetGroupProps {
        const newProps: Record<string, any> = {
            vpc: this.vpc,
            targetGroupName: this.id
        };
        if (props.targetType === TargetType.LAMBDA) {
            return <ApplicationTargetGroupProps>newProps;
        }
        newProps.port = props.port ?? 80;
        newProps.protocol = props.protocol ?? ApplicationProtocol.HTTP;
        newProps.targetType = props.targetType ?? TargetType.IP;
        return <ApplicationTargetGroupProps>newProps;
    }
}