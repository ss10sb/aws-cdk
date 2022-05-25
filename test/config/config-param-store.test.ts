import {App} from "aws-cdk-lib";
import {BaseConfig, ConfigParamStore, ConfigStack, StackConfig} from "../../src/config";
import {Match, Template} from "aws-cdk-lib/assertions";
import {ParameterTier, ParameterType} from "aws-cdk-lib/aws-ssm";

describe('config param store', () => {

    it('can store params', () => {
        const app = new App();
        const buildConfig = <BaseConfig>{
            Name: 'test'
        }
        const stack = new ConfigStack(app, 'test', buildConfig);
        const configParamStore = new ConfigParamStore(stack, 'test');
        configParamStore.store('test', buildConfig);
        Template.fromStack(stack).hasResourceProperties('AWS::SSM::Parameter',
            Match.objectEquals({
                Type: ParameterType.STRING,
                Value: "{\"Name\":\"test\",\"College\":\"PCC\",\"Environment\":\"sdlc\",\"Parameters\":{},\"Environments\":[]}",
                Name: "/test/test",
                Tier: ParameterTier.STANDARD
            })
        );
    });

    it('can store advanced params', () => {
        const app = new App();
        const val = 'a'.repeat(4100);
        const buildConfig = <BaseConfig>{
            Name: val
        }
        const stack = new ConfigStack(app, 'test', buildConfig);
        const configParamStore = new ConfigParamStore(stack, 'test');
        configParamStore.store('test', buildConfig, false);
        Template.fromStack(stack).hasResourceProperties('AWS::SSM::Parameter',
            Match.objectEquals({
                Type: ParameterType.STRING,
                Value: "{\"Name\":\"" + val + "\"}",
                Name: "/test/test",
                Tier: ParameterTier.ADVANCED
            })
        );
    });

    it('can create arn', () => {
        const app = new App();
        const buildConfig = <StackConfig>{
            College: 'PCC',
            Environment: 'sdlc',
            Name: 'test'
        }
        const stack = new ConfigStack(app, 'test', buildConfig);
        const configParamStore = new ConfigParamStore(stack, 'test');
        const arn = configParamStore.getArn('defaults');
        expect(arn).toContain(':parameter//test/defaults');
    });
});