import {Runtime} from "aws-cdk-lib/aws-lambda";
import {ICluster} from "aws-cdk-lib/aws-ecs";
import {aws_lambda} from "aws-cdk-lib";

export interface StartStopFactoryProps {
    readonly start?: string;
    readonly stop: string;
    startStopFunctionProps?: StartStopFunctionProps;
}

export interface StartStopFunctionProps {
    readonly memorySize?: number;
    readonly timeout?: number;
    readonly runtime?: Runtime;
    readonly handler?: string;
    readonly code?: string;
    cluster?: ICluster;
}

export interface StartStopEventProps {
    readonly lambdaFunction: aws_lambda.Function;
}

export interface StartStopLambdaEventProps {
    readonly clusterArn: string;
    readonly status: StartStopLambdaEventStatus;
    readonly schedule: string;
}

export enum StartStopLambdaEventStatus {
    START = 'start',
    STOP = 'stop'
}