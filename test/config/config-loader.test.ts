import {ConfigLoader} from "../../src/config";
import * as path from 'node:path';

const configDir = path.join(__dirname, '/../__config__');

const loader = new ConfigLoader(configDir);

describe('config loader', () => {

    it('should return an empty object with a non-existent env', () => {
        const l = new ConfigLoader(path.join(__dirname));
        const config = l.load('none');
        expect(config).toEqual({});
    });

    it('should use default config for sdlc', () => {
        const defaultEnv = {
            AWSAccountId: "100",
            AWSRegion: 'us-west-2',
            Name: 'Stack',
            College: 'PCC',
            Environment: 'sdlc',
            Version: '0.0.0',
            Parameters: {},
            Environments: []
        };
        const config = loader.load('sdlc');
        expect(config).toEqual(defaultEnv);
    });

    it('should override default config for prod', () => {
        const defaultEnv = {
            AWSAccountId: "200",
            AWSRegion: 'us-west-2',
            Name: 'Stack',
            College: 'PCC',
            Environment: 'prod',
            Version: '0.0.0',
            Parameters: {},
            Environments: []
        };
        const config = loader.load('prod');
        expect(config).toEqual(defaultEnv);
    });

    it('should override default config for shared', () => {
        const defaultEnv = {
            AWSAccountId: "300",
            AWSRegion: 'us-west-2',
            Name: 'Stack',
            College: 'PCC',
            Environment: 'shared',
            Version: '0.0.0',
            Parameters: {},
            Environments: []
        };

        expect(loader.load('shared')).toEqual(defaultEnv);
    });

    it('should use different config object', () => {
        const defaultEnv = {
            AWSAccountId: "100",
            AWSRegion: 'us-west-2',
            Name: 'Stack',
            College: 'PCC',
            Environment: 'sdlc',
            Version: '0.0.0',
            Parameters: {
                otherParam: 'foo'
            },
            Environments: []
        };
        const typedLoader = new ConfigLoader(configDir);
        expect(typedLoader.load('other')).toEqual(defaultEnv);
    });

    it('should use js file when available', () => {
        const defaultEnv = {
            AWSAccountId: "100",
            AWSRegion: 'us-west-2',
            Name: 'Stack',
            College: 'PCC',
            Environment: 'sdlc',
            Version: '0.0.0',
            Parameters: {
                jsOnlyParam: 'foo'
            },
            Environments: []
        };
        const typedLoader = new ConfigLoader(configDir);
        expect(typedLoader.load('jsonly')).toEqual(defaultEnv);
    });

    it('should use function from js file', () => {
        const defaultEnv = {
            AWSAccountId: "100",
            AWSRegion: 'us-west-2',
            Name: 'Stack',
            College: 'PCC',
            Environment: 'sdlc',
            Version: '0.0.0',
            Parameters: {
                testFuncParam: 'foobar'
            },
            Environments: []
        };
        const typedLoader = new ConfigLoader(configDir);
        expect(typedLoader.load('testfunc')).toEqual(defaultEnv);
    });

    it('should use aws from js file', () => {
        const defaultEnv = {
            AWSAccountId: "100",
            AWSRegion: 'us-west-2',
            Name: 'Stack',
            College: 'PCC',
            Environment: 'sdlc',
            Version: '0.0.0',
            Parameters: {
                awsParam: 'Isolated'
            },
            Environments: []
        };
        const typedLoader = new ConfigLoader(configDir);
        expect(typedLoader.load('aws')).toEqual(defaultEnv);
    });

    it('should use base instead of defaults when set', () => {
        const defaultEnv = {
            Name: 'secrets',
            College: 'PCC',
            Environment: 'sdlc',
            Version: '0.0.0',
            Parameters: {
                secrets: [
                    {
                        key: 'FOO',
                        value: 'sdlc'
                    }
                ]
            }
        };
        const typedLoader = new ConfigLoader(configDir, 'secrets');
        expect(typedLoader.load('sdlc')).toEqual(defaultEnv);
    });

    it('should use base and mixin overrides instead of defaults when set', () => {
        const defaultEnv = {
            Name: 'secrets',
            College: 'PCC',
            Environment: 'prod',
            Version: '0.0.0',
            Parameters: {
                secrets: [
                    {
                        key: 'FOO',
                        value: 'prod'
                    }
                ]
            }
        };
        const typedLoader = new ConfigLoader(configDir, 'secrets');
        expect(typedLoader.load('prod')).toEqual(defaultEnv);
    });

    it('should load multiple configs when multiple envs are requested', () => {
        const envProd = {
            Name: 'secrets',
            College: 'PCC',
            Environment: 'prod',
            Version: '0.0.0',
            Parameters: {
                secrets: [
                    {
                        key: 'FOO',
                        value: 'prod'
                    }
                ]
            }
        };
        const envSdlc = {
            Name: 'secrets',
            College: 'PCC',
            Environment: 'sdlc',
            Version: '0.0.0',
            Parameters: {
                secrets: [
                    {
                        key: 'FOO',
                        value: 'sdlc'
                    }
                ]
            }
        };
        const typedLoader = new ConfigLoader(configDir, 'secrets');
        const prod = typedLoader.load('prod');
        const sdlc = typedLoader.load('sdlc');
        expect(prod).toEqual(envProd);
        expect(sdlc).toEqual(envSdlc);
    });
});