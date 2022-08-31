import {StartStopLambdaEventStatus} from "./start-stop-definitions";
import {StartStopFunction, StartStopFunctionProps} from "./start-stop-function";
import {StartStopEvent} from "./start-stop-event";
import {Construct} from "constructs";
import {ICluster} from "aws-cdk-lib/aws-ecs";
import {NonConstruct} from "../core/non-construct";

export interface StartStopFactoryProps {
    readonly start?: string;
    readonly stop: string;
    startStopFunctionProps?: StartStopFunctionProps;
}



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