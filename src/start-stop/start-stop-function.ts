import {NonConstruct} from "../core";
import {StartStopFunctionProps} from "./start-stop-definitions";
import {aws_lambda, Duration} from "aws-cdk-lib";
import {Code, Runtime} from "aws-cdk-lib/aws-lambda";
import {Construct} from "constructs";
import {RetentionDays} from "aws-cdk-lib/aws-logs";
import * as path from "path";

export class StartStopFunction extends NonConstruct {

    readonly props: StartStopFunctionProps;
    readonly function: aws_lambda.Function;
    readonly defaults: Record<string, any> = {
        memorySize: 128,
        timeout: 5,
        runtime: Runtime.NODEJS_14_X,
        handler: 'index.handler',
        code: Code.fromAsset(path.join(__dirname, '/lambda'))
    }

    constructor(scope: Construct, id: string, props: StartStopFunctionProps) {
        super(scope, id);
        this.props = props;
        this.function = this.create();
    }

    protected create(): aws_lambda.Function {
        const name = this.mixNameWithId('start-stop-fn');
        return new aws_lambda.Function(this.scope, name, {
            memorySize: this.props.memorySize ?? this.defaults.memorySize,
            timeout: Duration.seconds(this.props.timeout ?? this.defaults.timeout),
            runtime: this.props.runtime ?? this.defaults.runtime,
            handler: this.props.handler ?? this.defaults.handler,
            code: this.props.code ?? this.defaults.code,
            logRetention: RetentionDays.ONE_MONTH,
            functionName: name,
            environment: {
                CLUSTER: this.props.cluster?.clusterArn ?? ''
            }
        });
    }
}