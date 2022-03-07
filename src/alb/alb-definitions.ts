import {
    ApplicationProtocol,
    ApplicationTargetGroup,
    HealthCheck,
    TargetType
} from "aws-cdk-lib/aws-elasticloadbalancingv2";

export interface AlbListenerRuleProps {
    priority: number;
    conditions: { [key: string]: any }
}

export interface AlbTargetGroupProps {
    readonly port?: number;
    readonly protocol?: ApplicationProtocol;
    readonly targetType?: TargetType;
}

export interface AlbTargetGroupHealthCheckProps {
    readonly targetGroup: ApplicationTargetGroup;
    readonly healthCheck?: HealthCheck;
    readonly alarmEmails?: string[];
}