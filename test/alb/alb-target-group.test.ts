import {App} from "aws-cdk-lib";
import {ConfigEnvironments, ConfigStack, StackConfig} from "../../src/config";
import {AlbTargetGroup} from "../../src/alb";
import {VpcHelper} from "../../src/utils";
import {EnvConfig} from "../../src/env";
import {Template} from "aws-cdk-lib/assertions";
import {resetStaticProps} from "../../src/utils/reset-static-props";
import {TemplateHelper} from "../../dist/utils/testing";

describe('alb target group', () => {

    beforeEach(() => {
        resetStaticProps();
    });

    it('can create base alb target group', () => {
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
        const albTargetGroup = new AlbTargetGroup(stack, 'target-group', vpc, envConfig);
        albTargetGroup.createApplicationTargetGroup();
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
            }
        ]);
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        const expected = {
            Resources: {
                targetgroup897B0682: {
                    Type: 'AWS::ElasticLoadBalancingV2::TargetGroup',
                    Properties: {
                        Name: 'target-group',
                        Port: 80,
                        Protocol: 'HTTP',
                        TargetGroupAttributes: [{Key: 'stickiness.enabled', Value: 'false'}],
                        TargetType: 'ip',
                        VpcId: 'vpc-12345'
                    }
                }
            },
            Parameters: {
                BootstrapVersion: {
                    Type: 'AWS::SSM::Parameter::Value<String>',
                    Default: '/cdk-bootstrap/hnb659fds/version',
                    Description: 'Version of the CDK Bootstrap resources in this environment, automatically retrieved from SSM Parameter Store. [cdk:skip]'
                }
            },
            Rules: {
                CheckBootstrapVersion: {
                    Assertions: [
                        {
                            Assert: {
                                'Fn::Not': [
                                    {
                                        'Fn::Contains': [
                                            ['1', '2', '3', '4', '5'],
                                            {Ref: 'BootstrapVersion'}
                                        ]
                                    }
                                ]
                            },
                            AssertDescription: "CDK bootstrap stack version 6 required. Please run 'cdk bootstrap' with a recent version of the CDK CLI."
                        }
                    ]
                }
            }
        };
        templateHelper.template.templateMatches(expected);
    });
});