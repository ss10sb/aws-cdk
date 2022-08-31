import {mockClient} from "aws-sdk-client-mock";
import {PutSecretValueCommand, SecretsManagerClient} from "@aws-sdk/client-secrets-manager";
import {SecretsManager} from "../../../src/utils/sdk/secrets-manager";

const mock = mockClient(SecretsManagerClient);

beforeEach(() => {
    mock.reset();
});

describe('secrets manager', () => {

    it('should fail on error', async () => {
        const secretsManager = new SecretsManager('arn:abc123', {region: 'us-east-1'});
        mock.on(PutSecretValueCommand).rejectsOnce('error!');
        await expect(secretsManager.put([])).rejects.toThrowError();
    });

    it('should resolve when created', async () => {
        const secretsManager = new SecretsManager('arn:abc123', {region: 'us-east-1'});
        mock.on(PutSecretValueCommand, {SecretId: 'arn:abc123', SecretString: '{"FOO":"BAR"}'}).resolvesOnce({
            $metadata: {},
            ARN: 'arn:abc123'
        });
        const response = await secretsManager.put([{key: 'FOO', value: 'BAR'}]);
        expect(response.ARN).toEqual('arn:abc123');
    });
});