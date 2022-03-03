import {App, Stack} from "aws-cdk-lib";
import {Secrets} from "../../src/secret";
import {Match, Template} from "aws-cdk-lib/assertions";

describe('secrets', () => {

    it('should create a new secret', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const secrets = new Secrets(stack, 'secrets');
        secrets.create([
            {
                key: 'FOO',
                value: 'fooval',
            },
            {
                key: 'BAR',
                value: 'barval',
            }
        ]);
        const template = Template.fromStack(stack);
        template.hasResourceProperties('AWS::SecretsManager::Secret', Match.objectEquals({
            "GenerateSecretString": {
                "GenerateStringKey": "salt",
                "SecretStringTemplate": "{\"FOO\":\"fooval\",\"BAR\":\"barval\"}"
            },
            "Name": "secrets-secrets/environment"
        }));
    });

    it('should fetch a secret for ecs', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const secrets = new Secrets(stack, 'secrets');
        const ecsSecrets = secrets.getEcsSecrets(['FOO', 'BAR']);
        expect(secrets?.secret?.secretArn).toContain(':secretsmanager:us-east-1:12344:secret:secrets-secrets/environment');
        expect(secrets?.secret?.secretName).toEqual('secrets-secrets/environment');
        expect(stack.resolve(secrets?.secret?.secretValue)).toEqual({
            "Fn::Join": [
                "",
                [
                    "{{resolve:secretsmanager:arn:",
                    {
                        "Ref": "AWS::Partition"
                    },
                    ":secretsmanager:us-east-1:12344:secret:secrets-secrets/environment:SecretString:::}}"
                ]
            ]
        });
        expect(ecsSecrets.FOO.arn).toContain(':secretsmanager:us-east-1:12344:secret:secrets-secrets/environment:FOO::');
        expect(ecsSecrets.FOO.hasField).toEqual(true);
        expect(ecsSecrets.BAR.arn).toContain(':secretsmanager:us-east-1:12344:secret:secrets-secrets/environment:BAR::');
        expect(ecsSecrets.BAR.hasField).toEqual(true);
    });
});