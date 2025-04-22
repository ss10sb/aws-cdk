import {IFunction} from "aws-cdk-lib/aws-lambda";
import {Duration} from "aws-cdk-lib";
import {HttpLambdaAuthorizer} from "aws-cdk-lib/aws-apigatewayv2-authorizers";
import {AuthorizerProps, AuthorizerResult} from "../../../src/lambda/lambda-definitions";
import {AuthorizerBase} from "./authorizer-base";
import {RequestAuthorizer} from "aws-cdk-lib/aws-apigateway";

export class AuthorizerV2 extends AuthorizerBase {

    protected getAuthorizer(func: IFunction, props: AuthorizerProps): HttpLambdaAuthorizer | RequestAuthorizer {
        return new HttpLambdaAuthorizer('authorizer', func, {
            authorizerName: this.mixNameWithId('http-lambda-authorizer'),
            resultsCacheTtl: Duration.seconds(300),
            identitySource: [
                '$request.header.x-auth-token',
                '$context.identity.sourceIp',
            ],
        });
    }
}