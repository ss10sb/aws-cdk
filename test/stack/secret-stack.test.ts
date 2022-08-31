import {App} from "aws-cdk-lib";
import {Match, Template} from "aws-cdk-lib/assertions";
import {SecretStack} from "../../src/stack/secret-stack";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {ConfigEnvironments} from "../../src/config/config-definitions";

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
        // templateHelper.inspect();
        const expected = {
            Resources: {
                pccprodtestsecret5187B937: {
                    Type: 'AWS::SecretsManager::Secret',
                    Properties: {
                        GenerateSecretString: { GenerateStringKey: 'salt', SecretStringTemplate: '{}' },
                        Name: 'pcc-prod-test-secrets/environment'
                    },
                    UpdateReplacePolicy: 'Delete',
                    DeletionPolicy: 'Delete'
                }
            },
            Outputs: {
                secretArn: {
                    Value: { Ref: 'pccprodtestsecret5187B937' },
                    Export: { Name: 'pcc-prod-test-secret-arn' }
                }
            }
        };
        templateHelper.template.templateMatches(expected);
    });

    it('should create secrets with name suffix', () => {
        const app = new App();
        const secretConfig = {
            Name: 'test',
            College: 'PCC',
            Environment: ConfigEnvironments.PROD,
            NameSuffix: 'sub',
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
        // templateHelper.inspect();
        const expected = {
            Resources: {
                pccprodtestsubsecret0BDA5364: {
                    Type: 'AWS::SecretsManager::Secret',
                    Properties: {
                        GenerateSecretString: { GenerateStringKey: 'salt', SecretStringTemplate: '{}' },
                        Name: 'pcc-prod-test-sub-secrets/environment'
                    },
                    UpdateReplacePolicy: 'Delete',
                    DeletionPolicy: 'Delete'
                }
            },
            Outputs: {
                secretArn: {
                    Value: { Ref: 'pccprodtestsubsecret0BDA5364' },
                    Export: { Name: 'pcc-prod-test-sub-secret-arn' }
                }
            }
        };
        templateHelper.template.templateMatches(expected);
    });
});