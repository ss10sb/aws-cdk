import {resetStaticProps} from "../../src/utils/reset-static-props";
import {App, Stack} from "aws-cdk-lib";
import {Secrets} from "../../src/secret/secrets";
import {BrefAsAlbTarget} from "../../src/lambda/bref-as-alb-target";
import {PhpBrefFunction} from "../../src/lambda/php-bref-function";
import {VpcHelper} from "../../src/utils/vpc-helper";
import {AlbTargetGroup} from "../../src/alb/alb-target-group";
import path from "path";
import {BrefRuntime} from "../../src/lambda/bref-definitions";
import {Template} from "aws-cdk-lib/assertions";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {TargetType} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import { AsAlbTarget } from "../../src/lambda/as-alb-target";

describe('bref as alb target', () => {
    beforeEach(() => {
        resetStaticProps();
    });

    it('should create default function', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-west-2', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const secrets = new Secrets(stack, 'secrets');
        const vpc = VpcHelper.getVpcById(stack, 'vpcId');
        const albTargetGroup = new AlbTargetGroup(stack, 'target-group', vpc);
        const targetGroup = albTargetGroup.create({
            targetType: TargetType.LAMBDA
        });
        const bref = new AsAlbTarget(stack, 'my-app', {
            functionFactoryProps: {
                environment: {},
                secretKeys: [],
                vpc: vpc,
                secret: secrets.fetch()
            },
            targetGroup: targetGroup
        });
        bref.create({
            assetPrefix: 'assets',
            certificateProps: {
                domainName: 'foo.bar.com', hostedZone: 'bar.com'
            },
            assetBucket: {},
            functionProps: {
                appPath: path.join(__dirname, '..', '__codebase__'),
                brefRuntime: BrefRuntime.PHP81FPM
            }
        });
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        // templateHelper.inspect();
        templateHelper.template.templateMatches(getExpected('as-alb-defaults'));
    });

    it('should prefix secrets', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-west-2', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const secretKeys = ['FOO', 'BAR'];
        const secrets = new Secrets(stack, 'secrets');
        const vpc = VpcHelper.getVpcById(stack, 'vpcId');
        const albTargetGroup = new AlbTargetGroup(stack, 'target-group', vpc);
        const targetGroup = albTargetGroup.create({
            targetType: TargetType.LAMBDA
        });
        const bref = new BrefAsAlbTarget(stack, 'my-app', {
            functionFactory: new PhpBrefFunction(stack, 'func', {
                environment: {},
                secretKeys: secretKeys,
                vpc: vpc,
                secret: secrets.fetch()
            }),
            targetGroup: targetGroup
        });
        bref.create({
            assetPrefix: 'assets',
            certificateProps: {
                domainName: 'foo.bar.com', hostedZone: 'bar.com'
            },
            assetBucket: {},
            functionProps: {
                appPath: path.join(__dirname, '..', '__codebase__'),
                brefRuntime: BrefRuntime.PHP81FPM
            }
        });
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        // templateHelper.inspect();
        templateHelper.template.templateMatches(getExpected('as-alb-prefixed-secrets'));
    });

    function getExpected(name: string) {
        return require('../__templates__/'+name);
    }
})