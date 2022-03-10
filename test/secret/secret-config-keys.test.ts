import {ConfigEnvironments} from "../../src/config";
import {SecretConfigKeys} from "../../src/secret";
import path from "path";

const configDir = path.join(__dirname, '/../__config__');

describe('secret config keys', () => {

    it('should add secret keys to config', () => {
        const config: Record<string, any> = {
            Name: 'test',
            College: 'PCC',
            Environment: ConfigEnvironments.PROD,
            Parameters: {},
            Environments: [
                {
                    Name: 'test',
                    College: 'PCC',
                    Environment: ConfigEnvironments.PROD,
                    Parameters: {
                        targetGroup: {},
                        listenerRule: {
                            priority: 100,
                            conditions: {
                                hostHeaders: ['test.example.edu']
                            }
                        },
                    },
                }
            ]
        };
        const secretKeys = new SecretConfigKeys(configDir);
        secretKeys.addSecretKeys(config);
        expect(config.Environments[0].Parameters.secretKeys.length).toEqual(1);
        expect(config.Environments[0].Parameters.secretKeys[0]).toEqual('FOO');
    });

    it('should add secret keys to config with suffix', () => {
        const config = require('../__configSuffixLive__/defaults');
        const secretKeys = new SecretConfigKeys(path.join(__dirname, '/../__configSuffixLive__'));
        secretKeys.addSecretKeys(config);
        const expected = ['ADMIN_USER_ID', 'APP_NAME', 'APP_KEY', 'APP_URL'];
        expect(config.Environments[0].Parameters.secretKeys).toEqual(expected);
        expect(config.Environments[1].Parameters.secretKeys).toEqual(expected);
    });
});