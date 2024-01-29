import {aws_lambda, Duration} from "aws-cdk-lib";
import {Code, Runtime} from "aws-cdk-lib/aws-lambda";
import {Construct} from "constructs";
import {RetentionDays} from "aws-cdk-lib/aws-logs";
import * as path from "path";
import {NonConstruct} from "../core/non-construct";

export interface StartStopFunctionProps {
    readonly memorySize?: number;
    readonly timeout?: number;
    readonly runtime?: Runtime;
    readonly handler?: string;
    readonly code?: string;
}

export class StartStopFunction extends NonConstruct {

    readonly props: StartStopFunctionProps;
    readonly defaults: Record<string, any> = {
        memorySize: 128,
        timeout: 5,
        runtime: Runtime.NODEJS_20_X,
        handler: 'index.handler',
        code: Code.fromAsset(path.join(__dirname, '/lambda'))
    }

    constructor(scope: Construct, id: string, props: StartStopFunctionProps) {
        super(scope, id);
        this.props = props;
    }

    create(clusterName: string): aws_lambda.Function {
        const name = this.mixNameWithId('start-stop-fn');
        return new aws_lambda.Function(this.scope, name, {
            memorySize: this.props.memorySize ?? this.defaults.memorySize,
            timeout: Duration.seconds(this.props.timeout ?? this.defaults.timeout),
            runtime: this.props.runtime ?? this.defaults.runtime,
            handler: this.props.handler ?? this.defaults.handler,
            code: this.props.code ?? this.defaults.code,
            logRetention: RetentionDays.ONE_WEEK,
            functionName: name,
            environment: {
                CLUSTER: clusterName
            }
        });
    }
}