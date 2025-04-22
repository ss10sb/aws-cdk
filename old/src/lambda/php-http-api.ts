import {
    DomainMappingOptions,
    DomainName,
    HttpApi,
    IHttpRouteAuthorizer, MappingValue,
    ParameterMapping
} from 'aws-cdk-lib/aws-apigatewayv2';
import {HttpLambdaIntegration} from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import {NonConstruct} from "../../../src/core/non-construct";
import {LogGroup, LogGroupProps, RetentionDays} from "aws-cdk-lib/aws-logs";
import {RemovalPolicy} from "aws-cdk-lib";
import {CfnStage} from "aws-cdk-lib/aws-apigatewayv2";
import {AuthorizerResult, PhpApiProps, PhpApiResult} from "../../../src/lambda/lambda-definitions";
import {AlarmSubscriptionHelper} from "../../../src/utils/alarm-subscription-helper";
import {Alarm, TreatMissingData} from "aws-cdk-lib/aws-cloudwatch";
import {AuthorizerV2} from "./authorizer-v2";

export interface PhpHttpApiProps extends PhpApiProps {
}

export class PhpHttpApi extends NonConstruct {

    baseName?: string;

    create(props: PhpHttpApiProps): PhpApiResult {
        if (props.lambdaFunction === undefined) {
            throw new Error('Lambda function must be defined to create the Http API.');
        }
        this.baseName = this.mixNameWithId(props.name ?? 'http-api');
        const httpIntegration = new HttpLambdaIntegration(`${this.baseName}-int`, props.lambdaFunction, {
            parameterMapping: new ParameterMapping().appendHeader('x-cf-source-ip', MappingValue.requestHeader('x-cf-source-ip'))
        });
        const authorizerResult = this.getAuthorizer(props);
        const apiProps = {
            apiName: this.baseName,
            defaultIntegration: httpIntegration,
            disableExecuteApiEndpoint: this.shouldDisableExecuteEndpoint(props),
            defaultAuthorizer: <IHttpRouteAuthorizer>authorizerResult?.authorizer,
            defaultDomainMapping: this.getDefaultDomainMapping(props)
        }

        const httpApi = new HttpApi(this.scope, this.baseName, apiProps);
        this.addAlarms(httpApi, props.alarmEmails ?? [], props.addOkAlarms ?? true);
        this.addLogging(httpApi, props.logProps);
        return {
            api: httpApi,
            authorizer: authorizerResult
        };
    }

    protected getDefaultDomainMapping(props: PhpHttpApiProps): DomainMappingOptions | undefined {
        if (props.domainNameOptions) {
            const name = this.mixNameWithId(`domain-name-${props.domainNameOptions.domainName}`);
            const domain = new DomainName(this.scope, name, {
                domainName: props.domainNameOptions.domainName,
                certificate: props.domainNameOptions.certificate
            });
            return {
                domainName: domain
            }
        }
    }

    protected shouldDisableExecuteEndpoint(props: PhpHttpApiProps): boolean {
        if (props.disableExecuteApiEndpoint !== undefined) {
            return props.disableExecuteApiEndpoint;
        }
        return false;//props.domainNameOptions !== undefined;
    }

    protected getAuthorizer(props: PhpHttpApiProps): AuthorizerResult | undefined {
        if (props.authorizerProps) {
            const authorizer = new AuthorizerV2(this.scope, this.id);
            return authorizer.create(props.authorizerProps);
        }
    }

    protected addAlarms(api: HttpApi, emails: string[], addOkAlarms: boolean): void {
        if (emails.length) {
            const alarmSubHelper = new AlarmSubscriptionHelper(this.scope, this.mixNameWithId('http-api-alarm-topic'));
            alarmSubHelper.addSubscriptions(emails);
            const alarms: Alarm[] = [];
            alarms.push(api.metricServerError().createAlarm(this.scope, this.mixNameWithId('http-api-server-error-alarm'), {
                threshold: 5,
                evaluationPeriods: 1,
                treatMissingData: TreatMissingData.NOT_BREACHING
            }));
            alarms.push(api.metricClientError().createAlarm(this.scope, this.mixNameWithId('http-api-client-error-alarm'), {
                threshold: 5,
                evaluationPeriods: 1,
                treatMissingData: TreatMissingData.NOT_BREACHING
            }));
            alarms.push(api.metricCount().createAlarm(this.scope, this.mixNameWithId('http-api-count-alarm'), {
                threshold: 500,
                evaluationPeriods: 1,
                treatMissingData: TreatMissingData.NOT_BREACHING
            }));
            alarmSubHelper.addActions(alarms, true, addOkAlarms);
        }
    }

    protected addLogging(httpApi: HttpApi, logProps?: LogGroupProps): void {
        if (logProps) {
            const name = this.mixNameWithId(`${this.baseName}-lg`);
            const log = new LogGroup(this.scope, name, {
                removalPolicy: logProps.removalPolicy ?? RemovalPolicy.DESTROY,
                retention: logProps.retention ?? RetentionDays.ONE_WEEK,
                logGroupName: name
            });
            const stage = httpApi.defaultStage?.node.defaultChild as CfnStage;
            stage.accessLogSettings = {
                destinationArn: log.logGroupArn,
                format: '{"requestTime":"$context.requestTime","requestId":"$context.requestId","httpMethod":"$context.httpMethod","path":"$context.path","resourcePath":"$context.resourcePath","status":$context.status,"responseLatency":$context.responseLatency,"integrationRequestId":"$context.integration.requestId","functionResponseStatus":"$context.integration.status","integrationLatency":"$context.integration.latency","integrationServiceStatus":"$context.integration.integrationStatus","integrationErrorMessage":"$context.integrationErrorMessage","authorizerStatus":"$context.authorizer.status","authorizerLatency":"$context.authorizer.latency","authorizerRequestId":"$context.authorizer.requestId","authorizerError":"$context.authorizer.error","ip":"$context.identity.sourceIp","userAgent":"$context.identity.userAgent","principalId":"$context.authorizer.principalId"}',
            }
        }
    }
}