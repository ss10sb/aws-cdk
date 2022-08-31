import {NonConstruct} from "../core/non-construct";
import {IFunction} from "aws-cdk-lib/aws-lambda";
import {LogGroup, LogGroupProps, RetentionDays} from "aws-cdk-lib/aws-logs";
import {
    AccessLogFormat,
    LambdaRestApi,
    LogGroupLogDestination, StageOptions
} from "aws-cdk-lib/aws-apigateway";
import {RemovalPolicy} from "aws-cdk-lib";
import {Alarm} from "aws-cdk-lib/aws-cloudwatch";
import {AlarmSubscriptionHelper} from "../utils/alarm-subscription-helper";
import {PhpApiProps} from "./lambda-definitions";

export interface PhpRestApiProps extends PhpApiProps {
}

export class PhpLambdaRestApi extends NonConstruct {

    create(props: PhpRestApiProps): LambdaRestApi {
        const name = this.mixNameWithId('rest-api');
        const restApi = new LambdaRestApi(this.scope, name, {
            handler: <IFunction>props.lambdaFunction,
            restApiName: name,
            disableExecuteApiEndpoint: props.disableExecuteApiEndpoint ?? false,
            deployOptions: this.getDeployOptions(this.getLogGroup(props.logProps)),
            binaryMediaTypes: props.binaryMediaTypes
        });
        this.addAlarms(restApi, props.alarmEmails ?? []);
        return restApi;
    }

    protected addAlarms(api: LambdaRestApi, emails: string[]): void {
        if (emails.length) {
            const alarmSubHelper = new AlarmSubscriptionHelper(this.scope, this.mixNameWithId('rest-api-alarm-topic'));
            alarmSubHelper.addSubscriptions(emails);
            const alarms: Alarm[] = [];
            alarms.push(api.metricServerError().createAlarm(this.scope, this.mixNameWithId('rest-api-server-error-alarm'), {
                threshold: 5,
                evaluationPeriods: 1
            }));
            alarms.push(api.metricClientError().createAlarm(this.scope, this.mixNameWithId('rest-api-client-error-alarm'), {
                threshold: 5,
                evaluationPeriods: 1
            }));
            alarms.push(api.metricCount().createAlarm(this.scope, this.mixNameWithId('rest-api-count-alarm'), {
                threshold: 500,
                evaluationPeriods: 1
            }));
            alarmSubHelper.addActions(alarms);
        }
    }

    protected getDeployOptions(logGroup?: LogGroup): StageOptions {
        if (logGroup) {
            return {
                accessLogDestination: new LogGroupLogDestination(logGroup),
                accessLogFormat: AccessLogFormat.jsonWithStandardFields()
            }
        }
        return {};
    }

    protected getLogGroup(logProps?: LogGroupProps): LogGroup | undefined {
        if (logProps) {
            const name = this.mixNameWithId('rest-api-lg')
            return new LogGroup(this.scope, name, {
                removalPolicy: logProps.removalPolicy ?? RemovalPolicy.DESTROY,
                retention: logProps.retention ?? RetentionDays.ONE_WEEK,
                logGroupName: name
            });
        }
    }
}