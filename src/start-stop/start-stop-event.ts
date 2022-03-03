import {NonConstruct} from "../core";
import {StartStopEventProps, StartStopLambdaEventProps} from "./start-stop-definitions";
import {Rule, RuleTargetInput, Schedule} from "aws-cdk-lib/aws-events";
import {Construct} from "constructs";
import {LambdaFunction} from "aws-cdk-lib/aws-events-targets";

export class StartStopEvent extends NonConstruct {

    readonly props: StartStopEventProps;

    constructor(scope: Construct, id: string, props: StartStopEventProps) {
        super(scope, id);
        this.props = props;
    }

    public create(props: StartStopLambdaEventProps): Rule {
        const rule: Rule = new Rule(this.scope, this.mixNameWithId(`start-stop-${props.status}-rule`), {
            schedule: Schedule.expression(props.schedule),
        });
        rule.addTarget(new LambdaFunction(this.props.lambdaFunction, {
            event: RuleTargetInput.fromObject({
                cluster: props.clusterArn,
                status: props.status
            })
        }));
        return rule;
    }
}