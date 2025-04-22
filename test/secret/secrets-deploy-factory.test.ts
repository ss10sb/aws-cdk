import {mockClient} from "aws-sdk-client-mock";
import {PutSecretValueCommand, SecretsManagerClient} from "@aws-sdk/client-secrets-manager";
import path from "path";
import {SecretsDeployFactory} from "../../src/secret/secrets-deploy-factory";

const configDir = path.join(__dirname, '/../__configLive__');

const mock = mockClient(SecretsManagerClient);

describe('secrets deploy factory', () => {

    beforeEach(() => {
        mock.reset();
    });

    it('should return null in result when no arn found', async () => {
        const factory = new SecretsDeployFactory({
            outputFile: path.resolve(__dirname, 'secrets-output.json'),
            configDir: configDir
        });
        const results = await factory.deploy();
        expect(results[0].stackName).toEqual('pcc-sdlc-test');
        expect(results[1].stackName).toEqual('pcc-prod-test');
        expect(results[0].result).toEqual(null);
        expect(results[1].result).toEqual(null);
    });

    it('should add id suffix to stack name', async () => {
        const factory = new SecretsDeployFactory({
            outputFile: path.resolve(__dirname, 'secrets-output.json'),
            configDir: configDir
        });
        const results = await factory.deploy({idSuffix: 'secrets'});
        expect(results[0].stackName).toEqual('pcc-sdlc-test-secrets');
        expect(results[1].stackName).toEqual('pcc-prod-test-secrets');
        expect(results[0].result).toEqual(null);
        expect(results[1].result).toEqual(null);
    });

    it('should add name suffix to stack name', async () => {
        const suffixConfigDir = path.join(__dirname, '/../__configSuffixLive__');
        const factory = new SecretsDeployFactory({
            outputFile: path.resolve(__dirname, 'secrets-output-suffix.json'),
            configDir: suffixConfigDir
        });
        mock.on(PutSecretValueCommand, {
            SecretId: 'arn:abc123',
        }).resolvesOnce({
            $metadata: {},
            ARN: 'arn:abc123'
        });
        const results = await factory.deploy({idSuffix: 'secrets'});
        const expectedKeys = [
            'ADMIN_USER_ID',
            'APP_NAME',
            'APP_KEY',
            'APP_URL'
        ];
        expect(results[0].stackName).toEqual('pcc-prod-test-abc-secrets');
        expect(results[1].stackName).toEqual('pcc-prod-test-def-secrets');
        expect(results[0].keys).toEqual(expectedKeys);
        expect(results[1].result).toEqual(null);
        expect(results[0].result?.ARN).toEqual('arn:abc123');
    });

    it('should deploy secrets', async () => {
        const factory = new SecretsDeployFactory({
            outputFile: path.resolve(__dirname, 'secrets-output-valid.json'),
            configDir: configDir
        });
        mock.on(PutSecretValueCommand, {
            SecretId: 'arn:abc123',
        }).resolvesOnce({
            $metadata: {},
            ARN: 'arn:abc123'
        });
        mock.on(PutSecretValueCommand, {
            SecretId: 'arn:abc456',
        }).resolvesOnce({
            $metadata: {},
            ARN: 'arn:abc456'
        });
        const results = await factory.deploy({idSuffix: 'secrets'});
        const expectedKeys = [
            'ADMIN_USER_ID',
            'APP_NAME',
            'APP_KEY',
            'APP_URL'
        ];
        expect(results[0].keys).toEqual(expectedKeys);
        expect(results[1].keys).toEqual(expectedKeys);
        expect(results[0].result?.ARN).toEqual('arn:abc123');
        expect(results[1].result?.ARN).toEqual('arn:abc456');
    });
});