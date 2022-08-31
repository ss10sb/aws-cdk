import {Rule, RuleTargetInput, Schedule} from "aws-cdk-lib/aws-events";
import {Construct} from "constructs";
import {LambdaFunction} from "aws-cdk-lib/aws-events-targets";
import {aws_lambda} from "aws-cdk-lib";
import {StartStopLambdaEventStatus} from "./start-stop-definitions";
import {NonConstruct} from "../core/non-construct";



export interface StartStopEventProps {
    readonly lambdaFunction: aws_lambda.Function;
}

export interface StartStopLambdaEventProps {
    readonly clusterArn: string;
    readonly status: StartStopLambdaEventStatus;
    readonly schedule: string;
}

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