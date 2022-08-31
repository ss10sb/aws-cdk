import {SecretConfigHelper} from "../../src/utils/secret-config-helper";
import {ConfigEnvironments} from "../../src/config/config-definitions";

describe('secret config helper', () => {

    it('should limit to last key in secrets', () => {
        const config = {
            Name: 'secrets',
            NameSuffix: 'foo',
            College: 'PCC',
            Environment: ConfigEnvironments.SDLC,
            Version: "0.0.0",
            Parameters: {
                secrets: [
                    {
                        key: 'FOO',
                        value: 'sdlc'
                    },
                    {
                        key: 'FOO',
                        value: 'sdlc.foo'
                    }
                ]
            }
        };
        const limitedConfig = SecretConfigHelper.ensureLimited(config);
        expect(limitedConfig.Parameters.secrets.length).toEqual(1);
        expect(limitedConfig.Parameters.secrets[0].value).toEqual('sdlc.foo');
    });
});