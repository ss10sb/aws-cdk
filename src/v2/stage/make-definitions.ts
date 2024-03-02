import {BaseParameters, StackConfig} from "../../config/config-definitions";
import {DynamoDbProps} from "../../dynamodb/dynamodb";
import {S3Props} from "../../s3/s3-bucket";
import {DnsValidatedCertificateProps} from "../../acm/acm-certificate";
import {EcsParameters} from "./support/make-ecs";
import {LambdaParameters} from "./support/make-lambda";
import {QueueConfigProps} from "../../sqs/sqs-definitions";

export interface MakeConfig extends StackConfig {
    readonly Parameters: MakeParameters;
}

export interface MakeParameters extends BaseParameters {
    readonly hostedZoneDomain?: string;
    readonly dynamoDb?: DynamoDbProps;
    readonly subdomain?: string;
    readonly alarmEmails?: string[];
    readonly queue?: QueueConfigProps;
    readonly s3?: S3Props;
    readonly secretKeys?: string[];
    readonly sharedSecretKeys?: string[];
    readonly steps?: Record<string, object>;
    readonly certificates?: DnsValidatedCertificateProps[];
    readonly sharedSecretArn?: string;
    ecs?: EcsParameters;
    lambda?: LambdaParameters;
}

