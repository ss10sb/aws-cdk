import {App} from "aws-cdk-lib";
import {BaseConfig, ConfigEnvironments, ConfigParameters, StackConfig} from "../../src/config/config-definitions";
import {ConfigStack} from "../../src/config/config-stack";

export interface OtherConfig extends StackConfig {
    readonly Parameters: OtherParameters;
}

export interface OtherParameters extends ConfigParameters {
    readonly otherProp: string;
}

describe('config stack', () => {

    it('should not be prod when env is not set', () => {
        const app = new App();
        const buildConfig = <BaseConfig>{
            Name: 'test'
        }
        const stack = new ConfigStack(app, 'test', buildConfig);
        expect(stack.isProd).toBe(false);
    });

    it('should be prod when env is prod', () => {
        const app = new App();
        const buildConfig = <BaseConfig>{
            Name: 'test',
            Environment: ConfigEnvironments.PROD
        }
        const stack = new ConfigStack(app, 'test', buildConfig);
        expect(stack.isProd).toBe(true);
    });

    it('should mix id with name', () => {
        const app = new App();
        const buildConfig = <BaseConfig>{
            Name: 'test'
        }
        const stack = new ConfigStack(app, 'test', buildConfig);
        expect(stack.mixNameWithId('foo')).toBe('test-foo');
    });

    it('should use typed config', () => {
        const app = new App();
        const buildConfig = <OtherConfig>{
            Name: 'test',
            Parameters: {
                otherProp: 'foo'
            }
        }
        const stack = new ConfigStack(app, 'test', buildConfig);
        expect(stack.config.Parameters.otherProp).toBe('foo');
    });

    it('should use suffix to create id', () => {
        const app = new App();
        const buildConfig = {
            Name: 'test',
            Parameters: {}
        }
        const stack = new ConfigStack(app, 'test', buildConfig, {suffix: 'bar'});
        expect(stack.node.id).toBe('test-bar');
        expect(stack.internalId).toBe('test');
    });
});