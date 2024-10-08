import {App} from "aws-cdk-lib";
import {resetStaticProps} from "../../src/utils/reset-static-props";
import {AlbHelper} from "../../src/utils/alb-helper";
import {ConfigEnvironments} from "../../src/config/config-definitions";
import {ConfigStack} from "../../src/config/config-stack";

const stackProps = {env: {region: 'us-east-1', account: '12344'}};

describe('alb helper', () => {

    beforeEach(() => {
        resetStaticProps();
    });

    it('can get alb by arn', () => {
        const app = new App();
        const buildConfig = {
            Name: 'test',
        }
        const stack = new ConfigStack(app, 'test', buildConfig, {}, stackProps);
        AlbHelper.getAlbByArn(stack, 'arn');
        expect(app.synth().manifest.missing).toEqual([
            {
                "key": "load-balancer:account=12344:loadBalancerArn=arn:loadBalancerType=application:region=us-east-1",
                "props": {
                    "account": "12344",
                    "dummyValue": {
                        "ipAddressType": "dualstack",
                        "loadBalancerArn": "arn:aws:elasticloadbalancing:us-west-2:123456789012:loadbalancer/application/my-load-balancer/50dc6c495c0c9188",
                        "loadBalancerCanonicalHostedZoneId": "Z3DZXE0EXAMPLE",
                        "loadBalancerDnsName": "my-load-balancer-1234567890.us-west-2.elb.amazonaws.com",
                        "securityGroupIds": [
                            "sg-1234"
                        ],
                        "vpcId": "vpc-12345"
                    },
                    "loadBalancerArn": "arn",
                    "loadBalancerType": "application",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    "region": "us-east-1"
                },
                "provider": "load-balancer"
            },
            {
                "key": "vpc-provider:account=12344:filter.vpc-id=vpc-12345:region=us-east-1:returnAsymmetricSubnets=true",
                "props": {
                    "account": "12344",
                    "filter": {
                        "vpc-id": "vpc-12345"
                    },
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    "region": "us-east-1",
                    "returnAsymmetricSubnets": true
                },
                "provider": "vpc-provider"
            },
            {
                "key": "security-group:account=12344:region=us-east-1:securityGroupId=sg-1234",
                "props": {
                    "account": "12344",
                    "dummyValue": {
                        "allowAllOutbound": true,
                        "securityGroupId": "sg-12345678"
                    },
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    "region": "us-east-1",
                    "securityGroupId": "sg-1234"
                },
                "provider": "security-group"
            }
        ]);
    });

    it('can get alb arn param key no college no env', () => {
        const buildConfig = {
            Name: 'test',
        }
        const paramKey = AlbHelper.getAlbArnParamKey(buildConfig);
        expect(paramKey).toBe('alb01-arn');
    });

    it('can get alb arn param key', () => {
        const buildConfig = {
            Name: 'test',
            College: 'PCC',
            Environment: ConfigEnvironments.PROD
        }
        const paramKey = AlbHelper.getAlbArnParamKey(buildConfig);
        expect(paramKey).toBe('pcc-prod-alb01-arn');
    });

    it('can get arn from params', () => {
        const app = new App();
        const buildConfig = {
            Name: 'test',
        }
        const stack = new ConfigStack(app, 'test', buildConfig, {}, stackProps);
        const value = AlbHelper.getArnFromParams(stack, 'alb');
        expect(value).toEqual('dummy-value-for-alb');
        expect(app.synth().manifest.missing).toEqual([
            {
                key: 'ssm:account=12344:parameterName=alb:region=us-east-1',
                props: {
                    account: '12344',
                    "dummyValue": "dummy-value-for-alb",
                    "ignoreErrorOnMissingContext": false,
                    lookupRoleArn: "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    region: 'us-east-1',
                    parameterName: 'alb',
                },
                provider: 'ssm',
            },
        ]);
    });

    it('can get default alb name', () => {
        const buildConfig = {
            Name: 'test',
            College: 'PCC',
            Environment: ConfigEnvironments.PROD
        }
        const name = AlbHelper.getDefaultAlbName(buildConfig);
        expect(name).toBe('pcc-prod-alb01/alb');
    });

    it('can get base alb name', () => {
        const buildConfig = {
            Name: 'test',
            College: 'PCC',
            Environment: ConfigEnvironments.PROD
        }
        const name = AlbHelper.getBaseAlbName(buildConfig, 'alb99');
        expect(name).toBe('pcc-prod-alb99');
    });

    it('can get alb https listener', () => {
        const app = new App();
        const buildConfig = {
            Name: 'test',
        }
        const stack = new ConfigStack(app, 'test', buildConfig, {}, stackProps);
        AlbHelper.getApplicationListener(stack, buildConfig, 'arn');
        expect(app.synth().manifest.missing).toEqual([
            {
                "key": "load-balancer-listener:account=12344:listenerPort=443:listenerProtocol=HTTPS:loadBalancerArn=arn:loadBalancerType=application:region=us-east-1",
                "props": {
                    "account": "12344",
                    "dummyValue": {
                        "listenerArn": "arn:aws:elasticloadbalancing:us-west-2:123456789012:listener/application/my-load-balancer/50dc6c495c0c9188/f2f7dc8efc522ab2",
                        "listenerPort": 80,
                        "securityGroupIds": [
                            "sg-123456789012"
                        ]
                    },
                    "listenerPort": 443,
                    "listenerProtocol": "HTTPS",
                    "loadBalancerArn": "arn",
                    "loadBalancerType": "application",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    "region": "us-east-1"
                },
                "provider": "load-balancer-listener"
            },
            {
                "key": "security-group:account=12344:region=us-east-1:securityGroupId=sg-123456789012",
                "props": {
                    "account": "12344",
                    "dummyValue": {
                        "allowAllOutbound": true,
                        "securityGroupId": "sg-12345678"
                    },
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    "region": "us-east-1",
                    "securityGroupId": "sg-123456789012"
                },
                "provider": "security-group"
            }
        ]);
    });
});