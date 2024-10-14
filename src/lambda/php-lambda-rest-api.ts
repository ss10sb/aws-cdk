import {NonConstruct} from "../core/non-construct";
import {IFunction} from "aws-cdk-lib/aws-lambda";
import {LogGroup, LogGroupProps, RetentionDays} from "aws-cdk-lib/aws-logs";
import {
    AccessLogFormat,
    AuthorizationType,
    DomainNameOptions,
    EndpointType,
    IAuthorizer,
    LambdaIntegrationOptions,
    LambdaRestApi,
    LogGroupLogDestination,
    MethodLoggingLevel, MethodOptions,
    StageOptions
} from "aws-cdk-lib/aws-apigateway";
import {RemovalPolicy} from "aws-cdk-lib";
import {Alarm, TreatMissingData} from "aws-cdk-lib/aws-cloudwatch";
import {AlarmSubscriptionHelper} from "../utils/alarm-subscription-helper";
import {AuthorizerResult, PhpApiProps, PhpApiResult} from "./lambda-definitions";
import {Authorizer} from "./authorizer";

export interface PhpRestApiProps extends PhpApiProps {
    endpointTypes?: EndpointType[];
}

export class PhpLambdaRestApi extends NonConstruct {

    baseName!: string;

    create(props: PhpRestApiProps): PhpApiResult {
        this.baseName = this.mixNameWithId(props.name ?? 'rest-api');
        const authorizer = this.addAuthorizer(props);
        const restApi = new LambdaRestApi(this.scope, this.baseName, {
            handler: <IFunction>props.lambdaFunction,
            restApiName: this.baseName,
            disableExecuteApiEndpoint: this.shouldDisableExecuteEndpoint(props),
            deployOptions: this.getDeployOptions(this.getLogGroup(props.logProps)),
            binaryMediaTypes: props.binaryMediaTypes,
            domainName: this.getDomainName(props),
            defaultMethodOptions: this.getDefaultMethodOptions(<IAuthorizer>authorizer?.authorizer),
            integrationOptions: this.getIntegrationOptions(props),
            proxy: true,
            endpointTypes: props.endpointTypes ?? [EndpointType.REGIONAL],
        });
        this.addAlarms(restApi, props.alarmEmails ?? [], props.addOkAlarms ?? true);
        return {
            api: restApi,
            authorizer: authorizer
        }
    }

    protected getDomainName(props: PhpRestApiProps): DomainNameOptions | undefined {
        if (props.domainNameOptions) {
            return {
                domainName: props.domainNameOptions?.domainName,
                certificate: props.domainNameOptions?.certificate,
            }
        }
    }

    protected getIntegrationOptions(props: PhpRestApiProps): LambdaIntegrationOptions {
        return {};
    }

    protected getDefaultMethodOptions(authorizer?: IAuthorizer): MethodOptions {
        const options: Record<string, any> = {};
        if (authorizer) {
            options['authorizer'] = authorizer;
            options['authorizationType'] = AuthorizationType.CUSTOM;
        }
        return options;
    }

    protected addAuthorizer(props: PhpRestApiProps): AuthorizerResult | undefined {
        if (props.authorizerProps) {
            const authorizer = new Authorizer(this.scope, this.id);
            return authorizer.create(props.authorizerProps);
        }
    }

    protected shouldDisableExecuteEndpoint(props: PhpRestApiProps): boolean {
        if (props.disableExecuteApiEndpoint !== undefined) {
            return props.disableExecuteApiEndpoint;
        }
        return false;//props.domainNameOptions !== undefined;
    }

    protected addAlarms(api: LambdaRestApi, emails: string[], addOkAlarms: boolean): void {
        if (emails.length) {
            const alarmSubHelper = new AlarmSubscriptionHelper(this.scope, this.mixNameWithId('rest-api-alarm-topic'));
            alarmSubHelper.addSubscriptions(emails);
            const alarms: Alarm[] = [];
            alarms.push(api.metricServerError().createAlarm(this.scope, this.mixNameWithId('rest-api-server-error-alarm'), {
                threshold: 5,
                evaluationPeriods: 1,
                treatMissingData: TreatMissingData.NOT_BREACHING,
            }));
            alarms.push(api.metricClientError().createAlarm(this.scope, this.mixNameWithId('rest-api-client-error-alarm'), {
                threshold: 5,
                evaluationPeriods: 1,
                treatMissingData: TreatMissingData.NOT_BREACHING,
            }));
            alarms.push(api.metricCount().createAlarm(this.scope, this.mixNameWithId('rest-api-count-alarm'), {
                threshold: 500,
                evaluationPeriods: 1,
                treatMissingData: TreatMissingData.NOT_BREACHING,
            }));
            alarmSubHelper.addActions(alarms, true, addOkAlarms);
        }
    }

    protected getDeployOptions(logGroup?: LogGroup): StageOptions {
        if (logGroup) {
            return {
                accessLogDestination: new LogGroupLogDestination(logGroup),
                accessLogFormat: AccessLogFormat.custom(
                    '{"requestTime":"$context.requestTime","requestId":"$context.requestId","httpMethod":"$context.httpMethod","path":"$context.path","resourcePath":"$context.resourcePath","status":$context.status,"responseLatency":$context.responseLatency,"xrayTraceId":"$context.xrayTraceId","integrationRequestId":"$context.integration.requestId","functionResponseStatus":"$context.integration.status","integrationLatency":"$context.integration.latency","integrationServiceStatus":"$context.integration.integrationStatus","authorizeStatus":"$context.authorize.status","authorizerStatus":"$context.authorizer.status","authorizerLatency":"$context.authorizer.latency","authorizerRequestId":"$context.authorizer.requestId","ip":"$context.identity.sourceIp","userAgent":"$context.identity.userAgent","principalId":"$context.authorizer.principalId"}'
                ),
                metricsEnabled: true,
                loggingLevel: MethodLoggingLevel.INFO,
                dataTraceEnabled: true,
            }
        }
        return {};
    }

    protected getLogGroup(logProps?: LogGroupProps): LogGroup | undefined {
        if (logProps) {
            const name = `${this.baseName}-lg`;
            return new LogGroup(this.scope, name, {
                removalPolicy: logProps.removalPolicy ?? RemovalPolicy.DESTROY,
                retention: logProps.retention ?? RetentionDays.ONE_WEEK,
                logGroupName: name
            });
        }
    }
}