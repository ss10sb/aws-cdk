import {NonConstruct} from "../../../core/non-construct";
import {NamingHelper} from "../../../utils/naming-helper";
import {Construct} from "constructs";
import {PreBuildLookups} from "../../../env/pre-build-lookups";
import {AlbTargetGroup, AlbTargetGroupProps} from "../../../alb/alb-target-group";
import {
    ApplicationListenerRule,
    ApplicationTargetGroup, HealthCheck,
    IApplicationTargetGroup
} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import {AlbTargetGroupHealthCheck} from "../../../alb/alb-target-group-health-check";
import {AlbListenerRule, AlbListenerRuleProps} from "../../../alb/alb-listener-rule";

export interface AlbResources {
    targetGroup: ApplicationTargetGroup;
    listenerRule: ApplicationListenerRule;
    healthCheck: AlbTargetGroupHealthCheck;
}

export interface MakeAlbProps {
    readonly targetGroup: AlbTargetGroupProps;
    readonly listenerRule: AlbListenerRuleProps;
    readonly healthCheck?: HealthCheck;
    readonly alarmEmails?: string[];
}

export class MakeAlbResources extends NonConstruct {

    props: MakeAlbProps;
    lookups: PreBuildLookups;

    constructor(scope: Construct, id: string, lookups: PreBuildLookups, props: MakeAlbProps) {
        super(scope, id);
        this.props = props;
        this.lookups = lookups;
    }

    public make(isLambda: boolean): AlbResources {
        const targetGroup = this.createTargetGroup();
        const listenerRule = this.createListenerRule(targetGroup);
        const healthCheck = this.configureTargetGroupHealthCheck(targetGroup, isLambda);
        return {
            targetGroup: targetGroup,
            listenerRule: listenerRule,
            healthCheck: healthCheck
        }
    }

    protected createTargetGroup(): ApplicationTargetGroup {
        const albTargetGroup = new AlbTargetGroup(this.scope, this.getName('tg'), this.lookups.vpc);
        return albTargetGroup.create(this.getTargetGroupParams());
    }

    protected getTargetGroupParams(): AlbTargetGroupProps {
        return this.props.targetGroup ?? {}
    }

    protected createListenerRule(targetGroup: IApplicationTargetGroup): ApplicationListenerRule {
        const albListenerRule = new AlbListenerRule(this.scope, this.getName('listener-rule'), this.lookups.albListener);
        return albListenerRule.create(targetGroup, <AlbListenerRuleProps>this.props.listenerRule);
    }

    protected configureTargetGroupHealthCheck(targetGroup: ApplicationTargetGroup, isLambda: boolean): AlbTargetGroupHealthCheck {
        const healthCheck = new AlbTargetGroupHealthCheck(this.scope, this.getName('tg-health'), {
            healthCheck: this.props.healthCheck,
            alarmEmails: this.props.alarmEmails ?? []
        });
        if (!isLambda) {
            healthCheck.addHealthCheck(targetGroup);
        }
        return healthCheck;
    }

    protected getName(suffix: string): string {
        return NamingHelper.fromParts([this.scope.node.id, suffix]);
    }
}