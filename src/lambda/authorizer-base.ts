import {NonConstruct} from "../core/non-construct";
import {AuthorizerProps, AuthorizerResult} from "./lambda-definitions";
import {HttpLambdaAuthorizer} from "@aws-cdk/aws-apigatewayv2-authorizers-alpha";
import {Duration} from "aws-cdk-lib";
import {Code, Function, IFunction, Runtime} from "aws-cdk-lib/aws-lambda";
import path from "path";
import {RetentionDays} from "aws-cdk-lib/aws-logs";
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
        const name = this.mixNameWithId('fn-authorizer');
        return new Function(this.scope, name, {
            functionName: name,
            runtime: Runtime.NODEJS_16_X,
            handler: "token.handler",
            timeout: Duration.seconds(5),
            code: Code.fromAsset(path.join(__dirname, 'authorizers/')),
            environment: this.getEnvironment(props),
            logRetention: RetentionDays.ONE_WEEK
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
}