import {App} from "aws-cdk-lib/core";
import {ConfigEnvironments} from "../../src/config";
import {SecretStack} from "../../src/stack";
import {TemplateHelper} from "../../src/utils/testing";
import {Match, Template} from "aws-cdk-lib/assertions";

describe('secret stack', () => {

    it('should create secrets', () => {
        const app = new App();
        const secretConfig = {
            Name: 'test',
            College: 'PCC',
            Environment: ConfigEnvironments.PROD,
            Parameters: {
                secrets: [
                    {
                        key: 'FOO',
                        value: 'bar'
                    },
                    {
                        key: 'FIZZ',
                        value: 'buzz'
                    }
                ]
            }
        }
        const stack = new SecretStack(app, 'secret-stack', secretConfig);
        stack.build();
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        templateHelper.expected('AWS::SecretsManager::Secret',  [
            {
                key: 'pccprodtestsecret',
                properties: Match.objectEquals({
                    Type: 'AWS::SecretsManager::Secret',
                    Properties: {
                        GenerateSecretString: {
                            GenerateStringKey: 'salt',
                            SecretStringTemplate: '{"FOO":"bar","FIZZ":"buzz"}'
                        },
                        Name: 'pcc-prod-test-secrets/environment'
                    },
                    UpdateReplacePolicy: 'Delete',
                    DeletionPolicy: 'Delete'
                })
            }
        ]);
    });
});