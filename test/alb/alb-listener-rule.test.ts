import {App} from "aws-cdk-lib";
import {Match, Template} from "aws-cdk-lib/assertions";
import {resetStaticProps} from "../../src/utils/reset-static-props";
import {ConfigEnvironments, StackConfig} from "../../src/config/config-definitions";
import {EnvConfig} from "../../src/env/env-base-stack";
import {ConfigStack} from "../../src/config/config-stack";
import {VpcHelper} from "../../src/utils/vpc-helper";
import {AlbTargetGroup} from "../../src/alb/alb-target-group";
import {AlbHelper} from "../../src/utils/alb-helper";
import {AlbListenerRule} from "../../src/alb/alb-listener-rule";
import {TemplateHelper} from "../../src/utils/testing/template-helper";

describe('alb listener rule', () => {

    beforeEach(() => {
        resetStaticProps();
    });

    it('can create listener rule', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const buildConfig = <StackConfig>{
            Name: 'test',
            College: 'PCC',
            Environment: ConfigEnvironments.PROD,
            Parameters: {}
        }
        const envConfig = <EnvConfig>{
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
                services: [],
                tasks: []
            }
        }
        const stack = new ConfigStack(app, 'test', buildConfig, {}, stackProps);
        const vpc = VpcHelper.getVpcFromConfig(stack, buildConfig);
        if (envConfig.Parameters.targetGroup && envConfig.Parameters.listenerRule) {
            const albTargetGroup = new AlbTargetGroup(stack, 'target-group', vpc);
            const targetGroup = albTargetGroup.create(envConfig.Parameters.targetGroup);
            const albListener = AlbHelper.getApplicationListener(stack, buildConfig, 'arn');
            const albListenerRule = new AlbListenerRule(stack, 'listener-rule', albListener);
            albListenerRule.create(targetGroup, envConfig.Parameters.listenerRule);
        }
        expect(app.synth().manifest.missing).toEqual([
            {
                "key": "vpc-provider:account=12344:filter.isDefault=false:filter.tag:Name=pcc-prod-vpc01/vpc:region=us-east-1:returnAsymmetricSubnets=true",
                "props": {
                    "account": "12344",
                    "filter": {
                        "isDefault": "false",
                        "tag:Name": "pcc-prod-vpc01/vpc"
                    },
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    "region": "us-east-1",
                    "returnAsymmetricSubnets": true
                },
                "provider": "vpc-provider"
            },
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
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        templateHelper.expected('AWS::ElasticLoadBalancingV2::TargetGroup',  [
            {
                key: 'targetgroup',
                properties: Match.objectEquals({
                    Type: 'AWS::ElasticLoadBalancingV2::TargetGroup',
                    Properties: {
                        Name: 'target-group',
                        Port: 80,
                        Protocol: 'HTTP',
                        TargetGroupAttributes: [{Key: 'stickiness.enabled', Value: 'false'}],
                        TargetType: 'ip',
                        VpcId: 'vpc-12345'
                    }
                })
            }
        ]);
        templateHelper.expected('AWS::ElasticLoadBalancingV2::ListenerRule',  [
            {
                key: 'listenerrule',
                properties: Match.objectEquals({
                    Type: 'AWS::ElasticLoadBalancingV2::ListenerRule',
                    Properties: {
                        Actions: [
                            {
                                TargetGroupArn: {Ref: templateHelper.startsWithMatch('targetgroup')},
                                Type: 'forward'
                            }
                        ],
                        Conditions: [
                            {
                                Field: 'host-header',
                                HostHeaderConfig: {Values: ['test.example.edu']}
                            }
                        ],
                        ListenerArn: templateHelper.startsWithMatch('arn:aws:elasticloadbalancing:us-west-2:123456789012:listener/application/my-load-balancer/.*/.*'),
                        Priority: 100
                    }
                })
            }
        ]);
    });
});