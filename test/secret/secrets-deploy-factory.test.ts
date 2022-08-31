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

    it('should add suffix to stack name', async () => {
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

    it('should deploy secrets', async () => {
        const factory = new SecretsDeployFactory({
            outputFile: path.resolve(__dirname, 'secrets-output-valid.json'),
            configDir: configDir
        });
        mock.on(PutSecretValueCommand, {
            SecretId: 'arn:abc123',
            SecretString: '{"ADMIN_USER_ID":"1234567","APP_NAME":"Test App","APP_KEY":"base64:/sdlc","APP_URL":"https://test.sdlc.example.edu"}'
        }).resolvesOnce({
            $metadata: {},
            ARN: 'arn:abc123'
        });
        mock.on(PutSecretValueCommand, {
            SecretId: 'arn:abc456',
            SecretString: '{"ADMIN_USER_ID":"1234567","APP_NAME":"Test App","APP_KEY":"base64:prod","APP_URL":"https://test.example.edu"}'
        }).resolvesOnce({
            $metadata: {},
            ARN: 'arn:abc456'
        });
        const results = await factory.deploy({idSuffix: 'secrets'});
        expect(results[0].result?.ARN).toEqual('arn:abc123');
        expect(results[1].result?.ARN).toEqual('arn:abc456');
    });
});