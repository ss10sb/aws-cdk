import {App} from "aws-cdk-lib";
import {Match, Template} from "aws-cdk-lib/assertions";
import {ConfigParamStack} from "../../src/stack/config-param-stack";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {ConfigEnvironments} from "../../src/config/config-definitions";
import {ConfigStackHelper} from "../../src/utils/config-stack-helper";

describe('config param stack', () => {

    it('should store config to param store', () => {
        const app = new App();
        const buildConfig = {
            Name: 'test',
            College: 'PCC',
            Environment: ConfigEnvironments.SHARED
        }
        const name = ConfigStackHelper.getMainStackName(buildConfig);
        const stack = new ConfigParamStack(app, name, buildConfig);
        stack.build();
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        templateHelper.expected('AWS::SSM::Parameter',  [
            {
                key: 'pccsharedtestpccsharedtestconfigparam',
                properties: Match.objectEquals({
                    Type: 'AWS::SSM::Parameter',
                    Properties: {
                        Type: 'String',
                        Value: '{"Name":"test","College":"PCC","Environment":"shared","Parameters":{},"Environments":[]}',
                        Name: '/pcc-shared-test/config',
                        Tier: 'Standard'
                    }
                })
            }
        ]);
    });
});