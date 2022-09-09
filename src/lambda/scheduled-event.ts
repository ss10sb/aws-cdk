import {NonConstruct} from "../core/non-construct";
import {IFunction} from "aws-cdk-lib/aws-lambda";
import {Rule, RuleTargetInput, Schedule} from "aws-cdk-lib/aws-events";
import {LambdaFunction, LambdaFunctionProps} from "aws-cdk-lib/aws-events-targets";
import {Construct} from "constructs";
import {NameIncrementer} from "../utils/name-incrementer";

export interface ScheduledEventProps {
    schedule: string;
    eventInput?: Record<string, any>;
}

export class ScheduledEvent extends NonConstruct {

    readonly nameIncrementer: NameIncrementer;

    constructor(scope: Construct, id: string) {
        super(scope, id);
        this.nameIncrementer = new NameIncrementer();
    }

    create(func: IFunction, props: ScheduledEventProps): Rule {
        const name = this.nameIncrementer.next(`${func.node.id}-scheduled-event`);
        const eventRule = new Rule(this.scope, name, {
            schedule: Schedule.expression(props.schedule),
            ruleName: name
        });
        eventRule.addTarget(new LambdaFunction(func, this.getLambdaFunctionProps(props)));
        return eventRule;
    }

    protected getLambdaFunctionProps(props: ScheduledEventProps): LambdaFunctionProps {
        if (props.eventInput) {
            return {
                event: RuleTargetInput.fromObject(props.eventInput)
            }
        }
        return {};
    }
}