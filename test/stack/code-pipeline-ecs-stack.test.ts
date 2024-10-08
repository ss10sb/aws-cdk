import {App, Stack} from "aws-cdk-lib";
import {Template} from "aws-cdk-lib/assertions";
import {resetStaticProps} from "../../src/utils/reset-static-props";
import {CodePipelineEcsStack} from "../../src/stack/code-pipeline-ecs-stack";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {ConfigStackHelper} from "../../src/utils/config-stack-helper";
import path from "path";

describe('code pipeline ecs stack', () => {

    beforeEach(() => {
        resetStaticProps();
    });

    it('should create pipeline from config', () => {
        const config = getConfig();
        const app = new App();
        const name = ConfigStackHelper.getMainStackName(config);
        const stack = new CodePipelineEcsStack(app, name, config, {}, {
            env: {
                account: '12344',
                region: 'us-west-2'
            }
        });
        stack.build();
        expect(app.synth().manifest.missing).toEqual([
            {
                "key": "ssm:account=11111:parameterName=pcc-sdlc-alb01-arn:region=us-west-2",
                "props": {
                    "account": "11111",
                    "dummyValue": "dummy-value-for-pcc-sdlc-alb01-arn",
                    "ignoreErrorOnMissingContext": false,
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::11111:role/cdk-hnb659fds-lookup-role-11111-us-west-2",
                    "parameterName": "pcc-sdlc-alb01-arn",
                    "region": "us-west-2"
                },
                "provider": "ssm"
            },
            {
                "key": "load-balancer-listener:account=11111:listenerPort=443:listenerProtocol=HTTPS:loadBalancerArn=dummy-value-for-pcc-sdlc-alb01-arn:loadBalancerType=application:region=us-west-2",
                "props": {
                    "account": "11111",
                    "dummyValue": {
                        "listenerArn": "arn:aws:elasticloadbalancing:us-west-2:123456789012:listener/application/my-load-balancer/50dc6c495c0c9188/f2f7dc8efc522ab2",
                        "listenerPort": 80,
                        "securityGroupIds": [
                            "sg-123456789012"
                        ]
                    },
                    "listenerPort": 443,
                    "listenerProtocol": "HTTPS",
                    "loadBalancerArn": "dummy-value-for-pcc-sdlc-alb01-arn",
                    "loadBalancerType": "application",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::11111:role/cdk-hnb659fds-lookup-role-11111-us-west-2",
                    "region": "us-west-2"
                },
                "provider": "load-balancer-listener"
            },
            {
                "key": "security-group:account=11111:region=us-west-2:securityGroupId=sg-123456789012",
                "props": {
                    "account": "11111",
                    "dummyValue": {
                        "allowAllOutbound": true,
                        "securityGroupId": "sg-12345678"
                    },
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::11111:role/cdk-hnb659fds-lookup-role-11111-us-west-2",
                    "region": "us-west-2",
                    "securityGroupId": "sg-123456789012"
                },
                "provider": "security-group"
            },
            {
                "key": "load-balancer:account=11111:loadBalancerArn=dummy-value-for-pcc-sdlc-alb01-arn:loadBalancerType=application:region=us-west-2",
                "props": {
                    "account": "11111",
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
                    "loadBalancerArn": "dummy-value-for-pcc-sdlc-alb01-arn",
                    "loadBalancerType": "application",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::11111:role/cdk-hnb659fds-lookup-role-11111-us-west-2",
                    "region": "us-west-2"
                },
                "provider": "load-balancer"
            },
            {
                "key": "vpc-provider:account=11111:filter.vpc-id=vpc-12345:region=us-west-2:returnAsymmetricSubnets=true",
                "props": {
                    "account": "11111",
                    "filter": {
                        "vpc-id": "vpc-12345"
                    },
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::11111:role/cdk-hnb659fds-lookup-role-11111-us-west-2",
                    "region": "us-west-2",
                    "returnAsymmetricSubnets": true
                },
                "provider": "vpc-provider"
            },
            {
                "key": "security-group:account=11111:region=us-west-2:securityGroupId=sg-1234",
                "props": {
                    "account": "11111",
                    "dummyValue": {
                        "allowAllOutbound": true,
                        "securityGroupId": "sg-12345678"
                    },
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::11111:role/cdk-hnb659fds-lookup-role-11111-us-west-2",
                    "region": "us-west-2",
                    "securityGroupId": "sg-1234"
                },
                "provider": "security-group"
            },
            {
                "key": "hosted-zone:account=11111:domainName=sdlc.example.edu:region=us-west-2",
                "props": {
                    "account": "11111",
                    "dummyValue": {
                        "Id": "DUMMY",
                        "Name": "sdlc.example.edu"
                    },
                    "domainName": "sdlc.example.edu",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::11111:role/cdk-hnb659fds-lookup-role-11111-us-west-2",
                    "region": "us-west-2"
                },
                "provider": "hosted-zone"
            },
            {
                "key": "ssm:account=22222:parameterName=pcc-prod-alb01-arn:region=us-west-2",
                "props": {
                    "account": "22222",
                    "dummyValue": "dummy-value-for-pcc-prod-alb01-arn",
                    "ignoreErrorOnMissingContext": false,
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::22222:role/cdk-hnb659fds-lookup-role-22222-us-west-2",
                    "parameterName": "pcc-prod-alb01-arn",
                    "region": "us-west-2"
                },
                "provider": "ssm"
            },
            {
                "key": "load-balancer-listener:account=22222:listenerPort=443:listenerProtocol=HTTPS:loadBalancerArn=dummy-value-for-pcc-prod-alb01-arn:loadBalancerType=application:region=us-west-2",
                "props": {
                    "account": "22222",
                    "dummyValue": {
                        "listenerArn": "arn:aws:elasticloadbalancing:us-west-2:123456789012:listener/application/my-load-balancer/50dc6c495c0c9188/f2f7dc8efc522ab2",
                        "listenerPort": 80,
                        "securityGroupIds": [
                            "sg-123456789012"
                        ]
                    },
                    "listenerPort": 443,
                    "listenerProtocol": "HTTPS",
                    "loadBalancerArn": "dummy-value-for-pcc-prod-alb01-arn",
                    "loadBalancerType": "application",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::22222:role/cdk-hnb659fds-lookup-role-22222-us-west-2",
                    "region": "us-west-2"
                },
                "provider": "load-balancer-listener"
            },
            {
                "key": "security-group:account=22222:region=us-west-2:securityGroupId=sg-123456789012",
                "props": {
                    "account": "22222",
                    "dummyValue": {
                        "allowAllOutbound": true,
                        "securityGroupId": "sg-12345678"
                    },
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::22222:role/cdk-hnb659fds-lookup-role-22222-us-west-2",
                    "region": "us-west-2",
                    "securityGroupId": "sg-123456789012"
                },
                "provider": "security-group"
            },
            {
                "key": "load-balancer:account=22222:loadBalancerArn=dummy-value-for-pcc-prod-alb01-arn:loadBalancerType=application:region=us-west-2",
                "props": {
                    "account": "22222",
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
                    "loadBalancerArn": "dummy-value-for-pcc-prod-alb01-arn",
                    "loadBalancerType": "application",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::22222:role/cdk-hnb659fds-lookup-role-22222-us-west-2",
                    "region": "us-west-2"
                },
                "provider": "load-balancer"
            },
            {
                "key": "vpc-provider:account=22222:filter.vpc-id=vpc-12345:region=us-west-2:returnAsymmetricSubnets=true",
                "props": {
                    "account": "22222",
                    "filter": {
                        "vpc-id": "vpc-12345"
                    },
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::22222:role/cdk-hnb659fds-lookup-role-22222-us-west-2",
                    "region": "us-west-2",
                    "returnAsymmetricSubnets": true
                },
                "provider": "vpc-provider"
            },
            {
                "key": "security-group:account=22222:region=us-west-2:securityGroupId=sg-1234",
                "props": {
                    "account": "22222",
                    "dummyValue": {
                        "allowAllOutbound": true,
                        "securityGroupId": "sg-12345678"
                    },
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::22222:role/cdk-hnb659fds-lookup-role-22222-us-west-2",
                    "region": "us-west-2",
                    "securityGroupId": "sg-1234"
                },
                "provider": "security-group"
            },
            {
                "key": "hosted-zone:account=22222:domainName=example.edu:region=us-west-2",
                "props": {
                    "account": "22222",
                    "dummyValue": {
                        "Id": "DUMMY",
                        "Name": "example.edu"
                    },
                    "domainName": "example.edu",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::22222:role/cdk-hnb659fds-lookup-role-22222-us-west-2",
                    "region": "us-west-2"
                },
                "provider": "hosted-zone"
            }
        ]);
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        // templateHelper.inspect();
        const expected = getExpected('code-pipeline-ecs-stack');
        templateHelper.template.templateMatches(expected);
    });

    it('should create pipeline from config with shared secrets', () => {
        const config = getSharedSecretsConfig();
        const app = new App();
        const name = ConfigStackHelper.getMainStackName(config);
        const stack = new CodePipelineEcsStack(app, name, config, {}, {
            env: {
                account: '12344',
                region: 'us-west-2'
            }
        });
        stack.build();
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        // templateHelper.inspect();
        const expected = getExpected('code-pipeline-ecs-stack');
        templateHelper.template.templateMatches(expected);
        let count = 0;
        for (const stage of stack.envStages?.stages ?? []) {
            const templateHelper = new TemplateHelper(Template.fromStack(<Stack>stage.envStage.stack));
            // console.log(count);
            // templateHelper.inspect();
            const file = `code-pipeline-ecs-stack-shared-secrets-stage-${count}`;
            const expected = getExpected(file);
            templateHelper.template.templateMatches(expected);
            count ++;
        }
    });
});

function getConfig(): Record<string, any> {
    return require('../__configLive__/defaults');
}

function getSharedSecretsConfig(): Record<string, any> {
    return require('../__configLive__/defaults.sharedSecrets');
}

function getExpected(file: string) {
    const template = require(path.join('..','__templates__', file));
    // remove "Tags" since they are set in the ConfigStackHelper utility
    let k: keyof typeof template.Resources;
    for (k in template.Resources) {
        const resource = template.Resources[k];
        if (resource.Properties?.Tags) {
            delete resource.Properties.Tags;
        }
    }
    return template;
}