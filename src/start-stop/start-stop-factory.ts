import {NonConstruct} from "../core";
import {StartStopFactoryProps, StartStopLambdaEventStatus} from "./start-stop-definitions";
import {StartStopFunction} from "./start-stop-function";
import {StartStopEvent} from "./start-stop-event";
import {Construct} from "constructs";
import {ICluster} from "aws-cdk-lib/aws-ecs";

export class StartStopFactory extends NonConstruct {

    readonly props: StartStopFactoryProps;
    readonly startStopFunc: StartStopFunction;

    constructor(scope: Construct, id: string, props: StartStopFactoryProps) {
        super(scope, id);
        this.props = props;
        this.startStopFunc = this.createStartStopFunction();
    }

    createRules(cluster: ICluster): StartStopEvent {
        const event = new StartStopEvent(this.scope, this.id, {
            lambdaFunction: this.startStopFunc.function
        });
        if (this.props.start) {
            event.create({
                clusterArn: cluster.clusterArn,
                status: StartStopLambdaEventStatus.START,
                schedule: this.props.start
            });
        }
        event.create({
            clusterArn: cluster.clusterArn,
            status: StartStopLambdaEventStatus.STOP,
            schedule: this.props.stop
        });
        return event;
    }

    protected createStartStopFunction(): StartStopFunction {
        return new StartStopFunction(this.scope, this.id, this.props.startStopFunctionProps ?? {});
    }
}