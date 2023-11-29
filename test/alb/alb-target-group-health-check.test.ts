import {resetStaticProps} from "../../src/utils/reset-static-props";
import {App, Stack} from "aws-cdk-lib";
import {ApplicationTargetGroup, Protocol} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import {Template} from "aws-cdk-lib/assertions";
import {AlbListenerRule} from "../../src/alb/alb-listener-rule";
import {AlbTargetGroupHealthCheck} from "../../src/alb/alb-target-group-health-check";
import {AlbHelper} from "../../src/utils/alb-helper";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {VpcHelper} from "../../src/utils/vpc-helper";

describe('alb target group health check', () => {

    beforeEach(() => {
        resetStaticProps();
    });

    it('should create alarms', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const vpc = VpcHelper.getVpcById(stack, 'vpcId');
        const targetGroup = new ApplicationTargetGroup(stack, 'tg', {
            vpc: vpc
        });
        const albListener = AlbHelper.getApplicationListener(stack, {}, 'arn');
        const albListenerRule = new AlbListenerRule(stack, 'listener-rule', albListener);
        albListenerRule.create(targetGroup, {
            priority: 999,
            conditions: {
                hostHeaders: ['test.example.edu']
            }
        });
        const healthCheck = new AlbTargetGroupHealthCheck(stack, 'tg', {
            healthCheck: {
                path: '/healthy',
                protocol: Protocol.HTTP
            },
            alarmEmails: ['test@example.com']
        });
        healthCheck.addHealthCheck(targetGroup);
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        const expected = {
            Resources: {
                tg2DCFFD86: {
                    Type: 'AWS::ElasticLoadBalancingV2::TargetGroup',
                    Properties: {
                        HealthCheckPath: '/healthy',
                        HealthCheckProtocol: 'HTTP',
                        TargetGroupAttributes: [{Key: 'stickiness.enabled', Value: 'false'}],
                        VpcId: 'vpc-12345'
                    }
                },
                listenerrule9992D8A67A6: {
                    Type: 'AWS::ElasticLoadBalancingV2::ListenerRule',
                    Properties: {
                        Actions: [
                            {TargetGroupArn: {Ref: 'tg2DCFFD86'}, Type: 'forward'}
                        ],
                        Conditions: [
                            {
                                Field: 'host-header',
                                HostHeaderConfig: {Values: ['test.example.edu']}
                            }
                        ],
                        ListenerArn: 'arn:aws:elasticloadbalancing:us-west-2:123456789012:listener/application/my-load-balancer/50dc6c495c0c9188/f2f7dc8efc522ab2',
                        Priority: 999
                    }
                },
                tghealthtopic71EA6D4D: {Type: 'AWS::SNS::Topic'},
                tghealthtopictestexamplecomFD3574A2: {
                    Type: 'AWS::SNS::Subscription',
                    Properties: {
                        Protocol: 'email',
                        TopicArn: {Ref: 'tghealthtopic71EA6D4D'},
                        Endpoint: 'test@example.com'
                    }
                },
                tghealthalarm311789ED: {
                    Type: 'AWS::CloudWatch::Alarm',
                    Properties: {
                        ComparisonOperator: 'GreaterThanOrEqualToThreshold',
                        EvaluationPeriods: 3,
                        AlarmActions: [{Ref: 'tghealthtopic71EA6D4D'}],
                        Dimensions: [
                            {
                                Name: 'LoadBalancer',
                                Value: 'application/my-load-balancer/50dc6c495c0c9188'
                            },
                            {
                                Name: 'TargetGroup',
                                Value: {'Fn::GetAtt': ['tg2DCFFD86', 'TargetGroupFullName']}
                            }
                        ],
                        MetricName: 'UnHealthyHostCount',
                        Namespace: 'AWS/ApplicationELB',
                        OKActions: [{Ref: 'tghealthtopic71EA6D4D'}],
                        Period: 60,
                        Statistic: 'Maximum',
                        Threshold: 1
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