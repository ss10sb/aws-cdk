import {NonConstruct} from "../core";
import {AttributeType, BillingMode, Table, TableEncryption} from "aws-cdk-lib/aws-dynamodb";
import {DynamoDbProps} from "./dynamodb-definitions";
import {RemovalPolicy} from "aws-cdk-lib";

export class Dynamodb extends NonConstruct {

    readonly defaults: Record<string, any> = {
        partitionKey: {name: 'key', type: AttributeType.STRING},
        billingMode: BillingMode.PAY_PER_REQUEST,
        encryption: TableEncryption.AWS_MANAGED
    };

    create(name: string, props: DynamoDbProps): Table {
        const tableName = this.mixNameWithId(name);
        return new Table(this.scope, tableName, {
            tableName: tableName,
            partitionKey: props.partitionKey ?? this.defaults.partitionKey,
            billingMode: props.billingMode ?? this.defaults.billingMode,
            encryption: props.encryption ?? this.defaults.encryption,
            removalPolicy: RemovalPolicy.DESTROY
        });
    }
}