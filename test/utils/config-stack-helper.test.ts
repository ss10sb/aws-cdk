import {App} from "aws-cdk-lib";
import {resolve} from "path";
import {BaseConfig, ConfigEnvironments} from "../../src/config/config-definitions";
import {ConfigStack} from "../../src/config/config-stack";
import {ConfigStackHelper} from "../../src/utils/config-stack-helper";

const configDir = resolve(__dirname, './../__config__/');

interface ExtendedConfig extends BaseConfig {
    readonly foo: string;
}

class ExtendedStack extends ConfigStack {

}

describe('utils', () => {

    it('should create base name from config', () => {
        const config = {
            College: 'PCC',
            Environment: ConfigEnvironments.PROD,
            Name: 'test'
        }
        expect(ConfigStackHelper.getBaseName(config)).toEqual('pcc-prod');
    });

    it('should create stack name from config', () => {
        const config = {
            College: 'PCC',
            Environment: ConfigEnvironments.PROD,
            Name: 'test'
        }
        expect(ConfigStackHelper.getMainStackName(config)).toEqual('pcc-prod-test');
    });

    it('can add NameSuffix from config', () => {
        const config = {
            College: 'PCC',
            Environment: ConfigEnvironments.PROD,
            Name: 'test',
            NameSuffix: 'foo'
        }
        expect(ConfigStackHelper.getMainStackName(config)).toEqual('pcc-prod-test-foo');
    });

    it('should create stack name from config and suffix', () => {
        const app = new App();
        const stack = ConfigStackHelper.run(app, configDir, ConfigStack, {idSuffix: 'suffix'});
        expect(stack.node.id).toEqual('pcc-shared-stack-suffix');
        expect(stack.internalId).toEqual('pcc-shared-stack');
    })

    it('should load config stack', () => {
        const app = new App();
        expect(ConfigStackHelper.run(app, configDir, ConfigStack)).toBeInstanceOf(ConfigStack);
    });

    it('should load extended config stack', () => {
        const app = new App();
        expect(ConfigStackHelper.run<ExtendedStack, ExtendedConfig>(app, configDir, ExtendedStack)).toBeInstanceOf(ExtendedStack);
    });

    it('should execute extended config stack', () => {
        const app = new App();
        const config: ExtendedConfig = {
            AWSAccountId: "100",
            AWSRegion: 'us-west-2',
            Name: 'Stack',
            College: 'PCC',
            Environment: ConfigEnvironments.SDLC,
            Version: "0.0.0",
            foo: 'bar',
            Parameters: {}
        };
        const stack = ConfigStackHelper.executeStack(app, ExtendedStack, config);
        expect(stack).toBeInstanceOf(ExtendedStack);
        expect(stack.config.foo).toBe('bar');
    });

    it('should load default config', () => {
        const expected = {
            AWSAccountId: "300",
            AWSRegion: 'us-west-2',
            Name: 'Stack',
            College: 'PCC',
            Environment: ConfigEnvironments.SHARED,
            Version: "0.0.0",
            Parameters: {},
            Environments: []
        };
        const app = new App();
        const stack = ConfigStackHelper.run(app, configDir, ConfigStack);
        expect(stack.node.id).toEqual('pcc-shared-stack');
        expect(stack.config).toEqual(expected);
    });

    it('should override default config', () => {
        const expected = {
            AWSAccountId: "200",
            AWSRegion: 'us-west-2',
            Name: 'Stack',
            College: 'PCC',
            Environment: ConfigEnvironments.PROD,
            Version: "0.0.0",
            Parameters: {},
            Environments: []
        };
        const app = new App();
        const stack = ConfigStackHelper.run(app, configDir, ConfigStack, {configEnv: ConfigEnvironments.PROD});
        expect(stack.node.id).toEqual('pcc-prod-stack');
        expect(stack.config).toEqual(expected);
    });

    it('should accept configBase without env', () => {
        const expected = {
            Name: 'secrets',
            College: 'PCC',
            Environment: 'none',
            Version: "0.0.0",
            Parameters: {
                secrets: {}
            }
        };
        const app = new App();
        const stack = ConfigStackHelper.run(app, configDir, ConfigStack, {configBase: 'secrets'});
        expect(stack.node.id).toEqual('pcc-none-secrets');
        expect(stack.config).toEqual(expected);
    });

    it('should accept configBase and configEnv sdlc', () => {
        const expected = {
            Name: 'secrets',
            College: 'PCC',
            Environment: ConfigEnvironments.SDLC,
            Version: "0.0.0",
            Parameters: {
                secrets: [
                    {
                        key: 'FOO',
                        value: 'sdlc'
                    }
                ]
            }
        };
        const app = new App();
        const stack = ConfigStackHelper.run(app, configDir, ConfigStack, {
            configBase: 'secrets',
            configEnv: ConfigEnvironments.SDLC
        });
        expect(stack.node.id).toEqual('pcc-sdlc-secrets');
        expect(stack.config).toEqual(expected);
    });

    it('should accept configBase and configEnv and configSuffix', () => {
        const expected = {
            Name: 'secrets',
            NameSuffix: 'foo',
            College: 'PCC',
            Environment: ConfigEnvironments.SDLC,
            Version: "0.0.0",
            Parameters: {
                secrets: [
                    {
                        key: 'FOO',
                        value: 'sdlc.foo'
                    },
                    {
                        key: 'BAR',
                        value: 'sdlc.bar'
                    }
                ]
            }
        };
        const app = new App();
        const stack = ConfigStackHelper.run(app, configDir, ConfigStack, {
            configBase: 'secrets',
            configEnv: ConfigEnvironments.SDLC,
            configSuffix: 'foo'
        });
        expect(stack.node.id).toEqual('pcc-sdlc-secrets-foo');
        expect(stack.config).toEqual(expected);
    });

    it('should accept configBase and configEnv prod', () => {
        const expected = {
            Name: 'secrets',
            College: 'PCC',
            Environment: ConfigEnvironments.PROD,
            Version: "0.0.0",
            Parameters: {
                secrets: [
                    {
                        key: 'FOO',
                        value: 'prod'
                    }
                ]
            }
        };
        const app = new App();
        const stack = ConfigStackHelper.run(app, configDir, ConfigStack, {
            configBase: 'secrets',
            configEnv: ConfigEnvironments.PROD
        });
        expect(stack.node.id).toEqual('pcc-prod-secrets');
        expect(stack.config).toEqual(expected);
    });

    it('should accept configBase and multiple configEnvs', () => {
        const expectedProd = {
            Name: 'secrets',
            College: 'PCC',
            Environment: ConfigEnvironments.PROD,
            Version: "0.0.0",
            Parameters: {
                secrets: [
                    {
                        key: 'FOO',
                        value: 'prod'
                    }
                ]
            }
        };
        const expectedSdlc = {
            Name: 'secrets',
            College: 'PCC',
            Environment: ConfigEnvironments.SDLC,
            Version: "0.0.0",
            Parameters: {
                secrets: [
                    {
                        key: 'FOO',
                        value: 'sdlc'
                    }
                ]
            }
        };
        const app = new App();
        const stack = ConfigStackHelper.run(app, configDir, ConfigStack, {
            configBase: 'secrets',
            configEnv: ConfigEnvironments.PROD
        });
        expect(stack.node.id).toEqual('pcc-prod-secrets');
        expect(stack.config).toEqual(expectedProd);
        const stack2 = ConfigStackHelper.run(app, configDir, ConfigStack, {
            configBase: 'secrets',
            configEnv: ConfigEnvironments.SDLC
        });
        expect(stack2.node.id).toEqual('pcc-sdlc-secrets');
        expect(stack2.config).toEqual(expectedSdlc);
    });

    it('should pass idSuffix to stack', () => {
        const app = new App();
        const stack = ConfigStackHelper.run(app, configDir, ConfigStack, {idSuffix: 'bar'});
        expect(stack.node.id).toEqual('pcc-shared-stack-bar');
        expect(stack.internalId).toEqual('pcc-shared-stack');
    });
});