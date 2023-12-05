import {IFunction} from "aws-cdk-lib/aws-lambda";
import {IdentitySource, RequestAuthorizer} from "aws-cdk-lib/aws-apigateway";
import {AuthorizerProps} from "./lambda-definitions";
import {AuthorizerBase} from "./authorizer-base";
import {HttpLambdaAuthorizer} from "aws-cdk-lib/aws-apigatewayv2-authorizers";


export class Authorizer extends AuthorizerBase {

    protected getAuthorizer(func: IFunction, props: AuthorizerProps): HttpLambdaAuthorizer | RequestAuthorizer {
        const name = this.mixNameWithId('authorizer');
        return new RequestAuthorizer(this.scope, name, {
            handler: func,
            authorizerName: name,
            identitySources: [
                IdentitySource.header('x-auth-token'),
                IdentitySource.context('identity.sourceIp')
            ],
        });
    }
}