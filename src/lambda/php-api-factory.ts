import {NonConstruct} from "../core/non-construct";
import {IFunction} from "aws-cdk-lib/aws-lambda";
import {ApiType, PhpApiProps, PhpApiResult} from "./lambda-definitions";
import {PhpHttpApi, PhpHttpApiProps} from "./php-http-api";
import {PhpLambdaRestApi, PhpRestApiProps} from "./php-lambda-rest-api";

export class PhpApiFactory extends NonConstruct {

    create(func: IFunction, props: PhpApiProps): PhpApiResult {
        const apiType = this.getApiType(props);
        props.lambdaFunction = func;
        if (apiType === ApiType.HTTP) {
            return this.createHttpApi(<PhpHttpApiProps>props);
        }
        return this.createLambdaRestApi(<PhpRestApiProps>props);
    }

    protected createHttpApi(props: PhpHttpApiProps): PhpApiResult {
        const apiCreator = new PhpHttpApi(this.scope, this.id);
        return apiCreator.create(props);
    }

    protected createLambdaRestApi(props: PhpRestApiProps): PhpApiResult {
        const apiCreator = new PhpLambdaRestApi(this.scope, this.id);
        return apiCreator.create(props);
    }

    protected getApiType(props: PhpApiProps): ApiType {
        if (props.apiType) {
            return props.apiType;
        }
        return ApiType.LAMBDAREST;
    }
}