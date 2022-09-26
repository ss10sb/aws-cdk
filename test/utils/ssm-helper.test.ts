import {App, Stack} from "aws-cdk-lib";
import {Match, Template} from "aws-cdk-lib/assertions";
import {ParameterTier, ParameterType} from "aws-cdk-lib/aws-ssm";
import {SsmHelper} from "../../src/utils/ssm-helper";

describe('ssm helper utils', () => {

    test('create param', () => {
        const app = new App();
        const stack = new Stack(app, 'TestStack');
        SsmHelper.createParam(stack, 'test-key', 'foo-value');
        Template.fromStack(stack).hasResourceProperties('AWS::SSM::Parameter',
            Match.objectEquals({
                Type: ParameterType.STRING,
                Value: "foo-value",
                Name: "test-key",
                Tier: ParameterTier.STANDARD
            })
        );
    });

    test('get string param', () => {
        const app = new App();
        const stack = new Stack(app, 'TestStack');
        SsmHelper.getStringParam(stack, 'test-key');
        Template.fromStack(stack).hasParameter('testkeylookupParameter', {});
    });

    test('get secret param', () => {
        const app = new App();
        const stack = new Stack(app, 'TestStack');
        const param = SsmHelper.getSecretParam(stack, 'test-secret-key');
        expect(param.parameterName).toEqual('test-secret-key');
        expect(param.parameterType).toEqual('SecureString');
        expect(param.stringValue).toMatch(/^\${Token\[TOKEN.*/);
    });

    test('get string value', () => {
        const app = new App();
        const stack = new Stack(app, 'TestStack', {env: {region: 'us-east-1', account: '12344'}});
        const value = SsmHelper.getStringValue(stack, 'test-key');
        expect(value).toEqual('dummy-value-for-test-key');
        expect(app.synth().manifest.missing).toEqual([
            {
                key: 'ssm:account=12344:parameterName=test-key:region=us-east-1',
                props: {
                    account: '12344',
                    lookupRoleArn: "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    region: 'us-east-1',
                    parameterName: 'test-key',
                },
                provider: 'ssm',
            },
        ]);
    });
});