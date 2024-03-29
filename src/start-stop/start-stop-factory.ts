import {StartStopLambdaEventStatus} from "./start-stop-definitions";
import {StartStopFunction, StartStopFunctionProps} from "./start-stop-function";
import {StartStopEvent} from "./start-stop-event";
import {Construct} from "constructs";
import {ICluster} from "aws-cdk-lib/aws-ecs";
import {NonConstruct} from "../core/non-construct";
import {aws_lambda} from "aws-cdk-lib";

export interface StartStopFactoryProps {
    readonly start?: string;
    readonly stop: string;
    startStopFunctionProps?: StartStopFunctionProps;
}



export class StartStopFactory extends NonConstruct {

    readonly props: StartStopFactoryProps;
    startStopFunc!: aws_lambda.Function;

    constructor(scope: Construct, id: string, props: StartStopFactoryProps) {
        super(scope, id);
        this.props = props;
    }

    createRules(cluster: ICluster): StartStopEvent {
        const startStopFunc = this.createStartStopFunction(cluster);
        this.startStopFunc = startStopFunc;
        const event = new StartStopEvent(this.scope, this.id, {
            lambdaFunction: startStopFunc
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

    protected createStartStopFunction(cluster: ICluster): aws_lambda.Function {
        const ssf = new StartStopFunction(this.scope, this.id, this.props.startStopFunctionProps ?? {});
        return ssf.create(cluster.clusterName);
    }
}