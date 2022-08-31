import {mockClient} from "aws-sdk-client-mock";
import {PutSecretValueCommand, SecretsManagerClient} from "@aws-sdk/client-secrets-manager";
import path from "path";
import {SecretsDeployHelper} from "../../src/secret/secrets-deploy-helper";

const mock = mockClient(SecretsManagerClient);

describe('secrets deploy helper', () => {

    beforeEach(() => {
        mock.reset();
    });

   it('should return null when no output file exists', async () => {
         const secretsDeployHelper = new SecretsDeployHelper(path.resolve(__dirname, 'not-found.json'), {});
         const response = await secretsDeployHelper.deploy("stack-name", [{key: 'foo', value: 'bar'}]);
         expect(response).toEqual(null);
   });

    it('should deploy when output file exists', async () => {
        const secretsDeployHelper = new SecretsDeployHelper(path.resolve(__dirname, 'secrets-output.json'), {});
        mock.on(PutSecretValueCommand, {SecretId: 'arn:abc123', SecretString: '{"FOO":"BAR"}'}).resolves({
            $metadata: {},
            ARN: 'arn:abc123'
        });
        const response = await secretsDeployHelper.deploy("stack-name", [{key: 'FOO', value: 'BAR'}]);
        expect(response?.ARN).toEqual('arn:abc123');
    });
});