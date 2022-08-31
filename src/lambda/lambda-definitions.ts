import {IFunction} from "aws-cdk-lib/aws-lambda";
import {PhpBrefFunctionProps} from "./php-bref-function";
import {QueueConfigProps} from "../sqs/sqs-definitions";
import {LogGroupProps} from "aws-cdk-lib/aws-logs";

export enum ApiType {
    HTTP,
    LAMBDAREST
}

export enum FunctionType {
    WEB = 'web',
    SCHEDULED = 'scheduled',
    EVENT = 'event',
    QUEUE = 'queue'
}

export interface FunctionWrapper {
    lambdaFunction: IFunction;
    type: FunctionType;
}

export interface Functions {
    functions: FunctionWrapper[];
    queue?: FunctionWrapper;
}

export interface LambdaQueueConfigProps extends QueueConfigProps {
    readonly queueFunction: PhpBrefFunctionProps;
}

export interface PhpApiProps {
    readonly name?: string;
    lambdaFunction?: IFunction;
    readonly disableExecuteApiEndpoint?: boolean;
    readonly alarmEmails?: string[];
    readonly logProps?: LogGroupProps;
    readonly binaryMediaTypes?: string[];
}