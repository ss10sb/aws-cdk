import {App, Stack} from "aws-cdk-lib";
import {Match, Template} from "aws-cdk-lib/assertions";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {Dynamodb} from "../../src/dynamodb/dynamodb";

describe('dynamodb table create', () => {

    it('should create a table', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const dynamodb = new Dynamodb(stack, 'dynamodb');
        dynamodb.create('foo', {});
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        templateHelper.expected('AWS::DynamoDB::Table', [
            {
                key: 'dynamodbfoo',
                properties: Match.objectEquals({
                    Type: 'AWS::DynamoDB::Table',
                    Properties: {
                        KeySchema: [{AttributeName: 'key', KeyType: 'HASH'}],
                        AttributeDefinitions: [{AttributeName: 'key', AttributeType: 'S'}],
                        BillingMode: 'PAY_PER_REQUEST',
                        SSESpecification: {SSEEnabled: true},
                        TableName: 'dynamodb-foo',
                        TimeToLiveSpecification: {
                            AttributeName: 'expires_at',
                            Enabled: true
                        }
                    },
                    UpdateReplacePolicy: 'Delete',
                    DeletionPolicy: 'Delete'
                })
            }
        ]);
    });
});