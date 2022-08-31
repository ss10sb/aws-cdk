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
        const arn = brefLayerArn.layerArn(BrefRuntime.PHP81, '2');
        expect(arn.toString()).toMatch(/arn:\$\{Token\[AWS.Partition\.[0-9]*\]\}:lambda:us-east-1:209497400698:layer:php-81:2/);
    });

    it('should create arn with latest version', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const brefLayerArn = new BrefLayerArn(stack, 'layer-arn', path.join(__dirname, '..', '__codebase__'));
        const arn = brefLayerArn.layerArn(BrefRuntime.PHP81, 'latest');
        expect(arn.toString()).toMatch(/arn:\$\{Token\[AWS.Partition\.[0-9]*\]\}:lambda:us-east-1:209497400698:layer:php-81:28/);
    });
});