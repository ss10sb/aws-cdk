import {
    ApplicationListenerRule,
    IApplicationListener,
    IApplicationTargetGroup,
    ListenerCondition
} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import {Construct} from "constructs";
import {NonConstruct} from "../core/non-construct";

export interface AlbListenerRuleProps {
    priority: number;
    conditions: { [key: string]: any }
}

export class AlbListenerRule extends NonConstruct {
    readonly listener: IApplicationListener;
    readonly map: Record<string, any> = {
        hostHeaders: ListenerCondition.hostHeaders,
        httpHeader: ListenerCondition.httpHeader,
        httpRequestMethods: ListenerCondition.httpRequestMethods,
        pathPatterns: ListenerCondition.pathPatterns,
        queryStrings: ListenerCondition.queryStrings,
        sourceIps: ListenerCondition.sourceIps
    };

    constructor(scope: Construct, id: string, listener: IApplicationListener) {
        super(scope, id);
        this.listener = listener;
    }

    create(targetGroup: IApplicationTargetGroup, props: AlbListenerRuleProps): ApplicationListenerRule {
        const name = `${this.id}-${props.priority}`;
        return new ApplicationListenerRule(this.scope, name, {
            priority: props.priority,
            conditions: this.createConditions(props),
            listener: this.listener,
            targetGroups: [targetGroup]
        });
    }

    private createConditions(props: AlbListenerRuleProps): ListenerCondition[] {
        const conditions: ListenerCondition[] = [];
        for (const [k, v] of Object.entries(props.conditions)) {
            conditions.push(this.getCondition(k, v));
        }
        return conditions;
    }

    private getCondition(type: string, props: any): ListenerCondition {
        return this.map[type](props);
    }
}