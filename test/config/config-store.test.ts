import {App} from "aws-cdk-lib";
import {BaseConfig, ConfigStack, ConfigStore} from "../../src/config";
import {Match, Template} from "aws-cdk-lib/assertions";
import {ParameterTier, ParameterType} from "aws-cdk-lib/aws-ssm";

describe('config store', () => {

    it('can store params', () => {
        const app = new App();
        const buildConfig = <BaseConfig>{
            Name: 'test',
        }
        const stack = new ConfigStack(app, 'test', buildConfig);
        const configStore = new ConfigStore(stack);
        configStore.store(stack.config);
        Template.fromStack(stack).hasResourceProperties('AWS::SSM::Parameter',
            Match.objectEquals({
                Type: ParameterType.STRING,
                Value: "{\"Name\":\"test\",\"College\":\"PCC\",\"Environment\":\"sdlc\",\"Parameters\":{},\"Environments\":[]}",
                Name: "/test/config",
                Tier: ParameterTier.STANDARD
            })
        );
    });
});