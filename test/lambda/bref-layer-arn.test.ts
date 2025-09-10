import {App, Stack} from "aws-cdk-lib";
import path from "path";
import {BrefLayerArn} from "../../src/lambda/bref-layer-arn";
import {BrefRuntime} from "../../src/lambda/bref-definitions";

describe('bref layer arn', () => {

    it('should create arn with provided version', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const brefLayerArn = new BrefLayerArn(stack, 'layer-arn', path.join(__dirname, '..', '__codebase__'));
        const arn = brefLayerArn.layerArn(BrefRuntime.PHP82, '2');
        expect(arn.toString()).toMatch(/arn:\$\{Token\[AWS.Partition\.[0-9]*\]\}:lambda:us-east-1:534081306603:layer:php-82:2/);
    });

    it('should create arn with latest version', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const brefLayerArn = new BrefLayerArn(stack, 'layer-arn', path.join(__dirname, '..', '__codebase__'));
        const arn = brefLayerArn.layerArn(BrefRuntime.PHP82, 'latest');
        expect(arn.toString()).toMatch(/arn:\$\{Token\[AWS.Partition\.[0-9]*\]\}:lambda:us-east-1:534081306603:layer:php-82:101/);
    });

    it('should create arn for extra', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const brefLayerArn = new BrefLayerArn(stack, 'layer-arn', path.join(__dirname, '..', '__codebase__'));
        const arn = brefLayerArn.layerArn(BrefRuntime.LDAP82, 'latest');
        expect(arn.toString()).toMatch(/arn:\$\{Token\[AWS.Partition\.[0-9]*\]\}:lambda:us-east-1:403367587399:layer:ldap-php-82:16/);
    });

    it('should fail when invalid layer provided', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const brefLayerArn = new BrefLayerArn(stack, 'layer-arn', path.join(__dirname));
        expect(() => brefLayerArn.layerArn(BrefRuntime.LDAP82, 'latest')).toThrow('[ldap-php-82] no layers.json files found in vendor bref/bref or bref/extra-php-extensions in');
    });
});