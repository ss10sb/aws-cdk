import {mockClient} from "aws-sdk-client-mock";
import {ConfigEnvironments, ConfigStack} from "../../../src/config";
import {App} from "aws-cdk-lib";
import {ConfigStackHelper, NamingHelper, StaticFileProvider} from "../../../src/utils";
import {GetParameterCommand, SSMClient} from "@aws-sdk/client-ssm";
import {SsmParam} from "../../../src/utils/sdk";
import {ConfigSsmParams} from "../../../src/utils/static-providers";

const stackProps = {env: {region: 'us-east-1', account: '12344'}};

const baseBuildConfig = {
    Name: 'test',
    College: 'PCC',
    Environment: ConfigEnvironments.PROD,
    Parameters: {}
}

const mock = mockClient(SSMClient);

beforeEach(() => {
    const staticProvider = new StaticFileProvider();
    staticProvider.cleanup();
    mock.reset();
});

describe('config ssm params static provider', () => {

    it('should put config and fetch', async () => {
        const app = new App();
        const stack = new ConfigStack(app, 'test', baseBuildConfig, {}, stackProps);
        const ssmParam = new SsmParam({region: 'us-east-1'});
        const staticProvider = new StaticFileProvider();
        const paramName = NamingHelper.configParamName(ConfigStackHelper.getMainStackName(stack.config));
        const ssmParams = new ConfigSsmParams(staticProvider, paramName, ssmParam);
        mock.on(GetParameterCommand, {
            Name: '/pcc-prod-test/config'
        }).resolves({
            Parameter: {
                Value: JSON.stringify(baseBuildConfig),
                Name: '/test/config'
            }
        });
        await ssmParams.put();
        const config = ssmParams.fetch();
        expect(config).toEqual(baseBuildConfig);
        staticProvider.remove(ssmParams.getName());
    });

    it('should return empty object when no file exists', () => {
        const app = new App();
        const stack = new ConfigStack(app, 'test', baseBuildConfig, {}, stackProps);
        const ssmParam = new SsmParam({region: 'us-east-1'});
        const staticProvider = new StaticFileProvider();
        const paramName = NamingHelper.configParamName(ConfigStackHelper.getMainStackName(stack.config));
        const ssmParams = new ConfigSsmParams(staticProvider, paramName, ssmParam);
        const config = ssmParams.fetch();
        expect(config).toEqual({});
    });
});