import {IFunction} from "aws-cdk-lib/aws-lambda";
import {PhpBrefFunctionProps} from "./php-bref-function";
import {QueueConfigProps} from "../sqs/sqs-definitions";
import {LogGroupProps} from "aws-cdk-lib/aws-logs";
import {DomainNameOptions, IAuthorizer as IAuthV1, LambdaRestApi} from "aws-cdk-lib/aws-apigateway";
import {HttpApi, IAuthorizer as IAuthV2, IHttpRouteAuthorizer} from "aws-cdk-lib/aws-apigatewayv2";
import {IHostedZone} from "aws-cdk-lib/aws-route53";

export enum ApiType {
    HTTP = 'http',
    LAMBDAREST = 'rest',
}

export enum FunctionType {
    WEB = 'web',
    SCHEDULED = 'scheduled',
    EVENT = 'event',
    QUEUE = 'queue',
    ARTISAN = 'artisan'
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
    readonly functionProps: PhpBrefFunctionProps;
}

export interface PhpApiProps {
    readonly name?: string;
    readonly disableExecuteApiEndpoint?: boolean;
    readonly logProps?: LogGroupProps;
    readonly binaryMediaTypes?: string[];
    readonly apiType?: ApiType;
    readonly addOkAlarms?: boolean;
    lambdaFunction?: IFunction;
    alarmEmails?: string[];
    authorizerProps?: AuthorizerProps;
    baseDomainName?: string;
    hostedZone?: string | IHostedZone;
    domainNameOptions?: DomainNameOptions;
}

export interface AuthorizerProps {
    token?: string;
    subnets?: string[];
    debug?: boolean;
}

export interface AuthorizerResult {
    authorizer: IAuthV1 | IAuthV2 | IHttpRouteAuthorizer;
    lambdaFunction?: IFunction;
}

export interface PhpApiResult {
    readonly api: HttpApi | LambdaRestApi;
    readonly authorizer?: AuthorizerResult;
}