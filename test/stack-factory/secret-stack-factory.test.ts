import {SecretStackFactory} from "../../src/stack-factory";
import path from "path";
import {Match, Template} from "aws-cdk-lib/assertions";
import {buildSecretStacks} from "../../src";

const configDir = path.join(__dirname, '/../__configLive__');

describe('secret test factory', () => {

    it('should throw error if not initialized', () => {

        const stackFactory = new SecretStackFactory({
            configDir: configDir
        });
        expect(() => stackFactory.buildStacks()).toThrowError('Not initialized.');
    });

    it('should throw error if no live config loaded', () => {

        const stackFactory = new SecretStackFactory({
            configDir: '/foo/bar'
        });
        expect(() => stackFactory.initialize()).toThrowError('Missing config keys: College Name');
    });

    it('should create secret for each environment', () => {
        const stackFactory = new SecretStackFactory({
            configDir: configDir
        });
        stackFactory.initialize();
        const stacks = stackFactory.buildStacks();
        const expectedSecrets = getExpectedSecrets();
        Template.fromStack(stacks[0]).hasResource('AWS::SecretsManager::Secret', Match.objectEquals(expectedSecrets[0]));
        Template.fromStack(stacks[1]).hasResource('AWS::SecretsManager::Secret', Match.objectEquals(expectedSecrets[1]));
    });

    it('should create secret for each environment from helper function', () => {
        const stacks = buildSecretStacks({
            configDir: configDir
        });
        const expectedSecrets = getExpectedSecrets();
        Template.fromStack(stacks[0]).hasResource('AWS::SecretsManager::Secret', Match.objectEquals(expectedSecrets[0]));
        Template.fromStack(stacks[1]).hasResource('AWS::SecretsManager::Secret', Match.objectEquals(expectedSecrets[1]));
    });
});

function getExpectedSecrets() {
    return [
        {
            Type: 'AWS::SecretsManager::Secret',
            Properties: {
                GenerateSecretString: {
                    GenerateStringKey: 'salt',
                    SecretStringTemplate: '{"ADMIN_USER_ID":"1234567","APP_NAME":"Test App","APP_KEY":"base64:/sdlc","APP_URL":"https://test.sdlc.example.edu"}'
                },
                Name: 'pcc-sdlc-test-secrets/environment',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        {
            Type: 'AWS::SecretsManager::Secret',
            Properties: {
                GenerateSecretString: {
                    GenerateStringKey: 'salt',
                    SecretStringTemplate: '{"ADMIN_USER_ID":"1234567","APP_NAME":"Test App","APP_KEY":"base64:prod","APP_URL":"https://test.example.edu"}'
                },
                Name: 'pcc-prod-test-secrets/environment',
                Tags: [
                    {Key: 'App', Value: 'test'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'prod'}
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        }
    ];
}