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
});