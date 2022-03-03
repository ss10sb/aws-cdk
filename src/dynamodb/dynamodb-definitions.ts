import {Attribute, BillingMode, TableEncryption} from "aws-cdk-lib/aws-dynamodb";

export interface DynamoDbProps {
    partitionKey?: Attribute;
    billingMode?: BillingMode;
    encryption?: TableEncryption;
}