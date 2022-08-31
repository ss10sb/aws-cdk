import {HttpApi} from '@aws-cdk/aws-apigatewayv2-alpha';
import {HttpLambdaIntegration} from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import {NonConstruct} from "../core/non-construct";
import {LogGroup, LogGroupProps, RetentionDays} from "aws-cdk-lib/aws-logs";
import {RemovalPolicy} from "aws-cdk-lib";
import {CfnStage} from "aws-cdk-lib/aws-apigatewayv2";
import {PhpApiProps} from "./lambda-definitions";
import {AlarmSubscriptionHelper} from "../utils/alarm-subscription-helper";
import {Alarm} from "aws-cdk-lib/aws-cloudwatch";
import {Role, ServicePrincipal} from "aws-cdk-lib/aws-iam";
import {PermissionsLoggroup} from "../permissions/permissions-loggroup";

export interface PhpHttpApiProps extends PhpApiProps {
}

export class PhpHttpApi extends NonConstruct {

    create(props: PhpHttpApiProps): HttpApi {
        if (props.lambdaFunction === undefined) {
            throw new Error('Lambda function must be defined to create the Http API.');
        }
        const name = this.mixNameWithId(props.name ?? 'default');
        const httpIntegration = new HttpLambdaIntegration(`${name}-int`, props.lambdaFunction);
        const httpApi = new HttpApi(this.scope, name, {
            apiName: name,
            createDefaultStage: true,
            defaultIntegration: httpIntegration,
            disableExecuteApiEndpoint: props.disableExecuteApiEndpoint ?? false
        });
        this.addAlarms(httpApi, props.alarmEmails ?? []);
        this.addLogging(httpApi, props.logProps);
        return httpApi;
    }

    protected addAlarms(api: HttpApi, emails: string[]): void {
        if (emails.length) {
            const alarmSubHelper = new AlarmSubscriptionHelper(this.scope, this.mixNameWithId('http-api-alarm-topic'));
            alarmSubHelper.addSubscriptions(emails);
            const alarms: Alarm[] = [];
            alarms.push(api.metricServerError().createAlarm(this.scope, this.mixNameWithId('http-api-server-error-alarm'), {
                threshold: 5,
                evaluationPeriods: 1
            }));
            alarms.push(api.metricClientError().createAlarm(this.scope, this.mixNameWithId('http-api-client-error-alarm'), {
                threshold: 5,
                evaluationPeriods: 1
            }));
            alarms.push(api.metricCount().createAlarm(this.scope, this.mixNameWithId('http-api-count-alarm'), {
                threshold: 500,
                evaluationPeriods: 1
            }));
            alarmSubHelper.addActions(alarms);
        }
    }

    protected addLogging(httpApi: HttpApi, logProps?: LogGroupProps): void {
        if (logProps) {
            const name = this.mixNameWithId('lg')
            const log = new LogGroup(this.scope, name, {
                removalPolicy: logProps.removalPolicy ?? RemovalPolicy.DESTROY,
                retention: logProps.retention ?? RetentionDays.ONE_WEEK,
                logGroupName: name
            });
            const stage = httpApi.defaultStage?.node.defaultChild as CfnStage;
            stage.accessLogSettings = {
                destinationArn: log.logGroupArn,
                format: `$context.identity.sourceIp - - [$context.requestTime] "$context.httpMethod $context.routeKey $context.protocol" $context.status $context.responseLength $context.requestId`,
            }
            this.addPermissionsToLog(log);
        }
    }

    protected addPermissionsToLog(logGroup: LogGroup): void {
        const role = new Role(this.scope, this.mixNameWithId('lg-role'), {
            assumedBy: new ServicePrincipal('apigateway.amazonaws.com')
        });
        PermissionsLoggroup.canLog(role, logGroup);
    }
}