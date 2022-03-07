import {NonConstruct} from "../core";
import {
    ApplicationListenerRule,
    IApplicationListener,
    IApplicationTargetGroup,
    ListenerCondition
} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import {AlbListenerRuleProps} from "./alb-definitions";
import {Construct} from "constructs";

export class AlbListenerRule extends NonConstruct {
    readonly listener: IApplicationListener;
    readonly props: AlbListenerRuleProps;
    readonly map: Record<string, any> = {
        hostHeaders: ListenerCondition.hostHeaders,
        httpHeader: ListenerCondition.httpHeader,
        httpRequestMethods: ListenerCondition.httpRequestMethods,
        pathPatterns: ListenerCondition.pathPatterns,
        queryStrings: ListenerCondition.queryStrings,
        sourceIps: ListenerCondition.sourceIps
    };

    constructor(scope: Construct, id: string, listener: IApplicationListener, props: AlbListenerRuleProps) {
        super(scope, id);
        this.listener = listener;
        this.props = props;
    }

    createListenerRule(targetGroup: IApplicationTargetGroup): ApplicationListenerRule {
        const name = `${this.id}-${this.props.priority}`;
        return new ApplicationListenerRule(this.scope, name, {
            priority: this.props.priority,
            conditions: this.createConditions(),
            listener: this.listener,
            targetGroups: [targetGroup]
        });
    }

    private createConditions(): ListenerCondition[] {
        const conditions: ListenerCondition[] = [];
        for (const [k, v] of Object.entries(this.props.conditions)) {
            conditions.push(this.getCondition(k, v));
        }
        return conditions;
    }

    private getCondition(type: string, props: any): ListenerCondition {
        return this.map[type](props);
    }
}