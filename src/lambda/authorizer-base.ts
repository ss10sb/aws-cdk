import {NonConstruct} from "../core/non-construct";
import {AuthorizerProps, AuthorizerResult} from "./lambda-definitions";
import {HttpLambdaAuthorizer} from "aws-cdk-lib/aws-apigatewayv2-authorizers";
import {Duration, RemovalPolicy} from "aws-cdk-lib";
import {Code, Function, IFunction, Runtime} from "aws-cdk-lib/aws-lambda";
import path from "path";
import {ILogGroup, LogGroup, RetentionDays} from "aws-cdk-lib/aws-logs";
import {RequestAuthorizer} from "aws-cdk-lib/aws-apigateway";

export const AUTHORIZER_TOKEN = 'AUTHORIZER_TOKEN';

export abstract class AuthorizerBase extends NonConstruct {

    create(props: AuthorizerProps): AuthorizerResult | undefined {
        if (props.token) {
            const func = this.getFunction(props);
            const authorizer = new HttpLambdaAuthorizer('authorizer', func, {
                authorizerName: this.mixNameWithId('http-lambda-authorizer'),
                resultsCacheTtl: Duration.seconds(300),
                identitySource: [
                    '$request.header.x-auth-token',
                    '$context.identity.sourceIp',
                ],
            });
            return {
                authorizer: authorizer,
                lambdaFunction: func
            }
        }
    }

    protected abstract getAuthorizer(func: IFunction, props: AuthorizerProps): HttpLambdaAuthorizer | RequestAuthorizer;

    protected getFunction(props: AuthorizerProps): IFunction {
        const name = this.mixNameWithId('authorizer-fn');
        return new Function(this.scope, name, {
            functionName: name,
            runtime: Runtime.NODEJS_18_X,
            handler: "token.handler",
            timeout: Duration.seconds(5),
            code: Code.fromAsset(path.join(__dirname, 'authorizers/')),
            environment: this.getEnvironment(props),
            logGroup: this.createLogGroup(name)
        });
    }

    protected getEnvironment(props: AuthorizerProps): Record<string, string> {
        let env: Record<string, string> = {
            [AUTHORIZER_TOKEN]: props.token ?? 'INVALID'
        };
        if (props.subnets) {
            env['AUTHORIZER_SUBNETS'] = props.subnets.join(',');
        }
        if (props.debug) {
            env['AUTHORIZER_LOG_LEVEL'] = 'DEBUG';
        }
        return env;
    }

    createLogGroup(funcName: string): ILogGroup {
        return new LogGroup(this.scope, `${funcName}-lg`, {
            removalPolicy: RemovalPolicy.DESTROY,
            retention: RetentionDays.ONE_WEEK
        });
    }
}