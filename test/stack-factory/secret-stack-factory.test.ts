import path from "path";
import {Match, Template} from "aws-cdk-lib/assertions";
import {SecretStackFactory} from "../../src/stack-factory/secret-stack-factory";
import {buildSecretStacks} from "../../src/stack-functions";

const configDir = path.join(__dirname, '/../__configLive__');

describe('secret test factory', () => {

    it('should throw error if not initialized', () => {

        const stackFactory = new SecretStackFactory({
            configDir: configDir
        });
        expect(() => stackFactory.buildStacks()).toThrow('Not initialized.');
    });

    it('should throw error if no live config loaded', () => {

        const stackFactory = new SecretStackFactory({
            configDir: '/foo/bar'
        });
        expect(() => stackFactory.initialize()).toThrow('Missing config keys: College Name');
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

    it('should create secret for each environment with suffix', () => {
        const stackFactory = new SecretStackFactory({
            configDir: path.join(__dirname, '/../__configSuffixLive__')
        });
        stackFactory.initialize();
        const stacks = stackFactory.buildStacks();
        const expectedSecrets = getExpectedSecretsWithSuffix();
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
                    SecretStringTemplate: '{}'
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
                    SecretStringTemplate: '{}'
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

function getExpectedSecretsWithSuffix() {
    return [
        {
            Type: 'AWS::SecretsManager::Secret',
            Properties: {
                GenerateSecretString: {
                    GenerateStringKey: 'salt',
                    SecretStringTemplate: '{}'
                },
                Name: 'pcc-prod-test-abc-secrets/environment',
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
                    SecretStringTemplate: '{}'
                },
                Name: 'pcc-prod-test-def-secrets/environment',
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