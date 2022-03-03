import {ApplicationProtocol, TargetType} from "aws-cdk-lib/aws-elasticloadbalancingv2";

export interface AlbListenerRuleProps {
    priority: number;
    conditions: { [key: string]: any }
}

export interface AlbTargetGroupProps {
    readonly port?: number;
    readonly protocol?: ApplicationProtocol;
    readonly targetType?: TargetType;
}