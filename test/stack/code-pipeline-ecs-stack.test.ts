import {App} from "aws-cdk-lib";
import {Template} from "aws-cdk-lib/assertions";
import {resetStaticProps} from "../../src/utils/reset-static-props";
import {CodePipelineEcsStack} from "../../src/stack/code-pipeline-ecs-stack";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {ConfigStackHelper} from "../../src/utils/config-stack-helper";

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
                    "domainName": "example.edu",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::22222:role/cdk-hnb659fds-lookup-role-22222-us-west-2",
                    "region": "us-west-2"
                },
                "provider": "hosted-zone"
            }
        ]);
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        // templateHelper.inspect();
        const expected = getExpected();
        templateHelper.template.templateMatches(expected);
    });
});

function getConfig(): Record<string, any> {
    return require('../__configLive__/defaults');
}

function getExpected() {
    const template = require('../__templates__/code-pipeline-ecs-stack');
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