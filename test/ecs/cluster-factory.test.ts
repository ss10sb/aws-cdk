import {App, Stack} from "aws-cdk-lib";
import {Match, Template} from "aws-cdk-lib/assertions";
import {resetStaticProps} from "../../src/utils/reset-static-props";
import {ClusterFactory} from "../../src/ecs/cluster-factory";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {VpcHelper} from "../../src/utils/vpc-helper";

describe('cluster factory', () => {

    beforeEach(() => {
        resetStaticProps();
    });

    it('should create cluster with defaults', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const vpc = VpcHelper.getVpcById(stack, 'vpcId');
        const clusterFactory = new ClusterFactory(stack, 'stack', {
            vpc: vpc
        });
        clusterFactory.create();
        expect(app.synth().manifest.missing).toEqual([
            {
                "key": "vpc-provider:account=12344:filter.isDefault=false:filter.vpc-id=vpcId:region=us-east-1:returnAsymmetricSubnets=true",
                "props": {
                    "account": "12344",
                    "filter": {
                        "isDefault": "false",
                        "vpc-id": "vpcId"
                    },
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    "region": "us-east-1",
                    "returnAsymmetricSubnets": true
                },
                "provider": "vpc-provider"
            }
        ]);
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        templateHelper.expected('AWS::ECS::Cluster',  [
            {
                key: 'stackcluster',
                properties: Match.objectEquals({
                    "Type": "AWS::ECS::Cluster",
                    "Properties": {
                        "ClusterName": "stack-cluster",
                        "ClusterSettings": [
                            {
                                "Name": "containerInsights",
                                "Value": "disabled"
                            }
                        ]
                    }
                }),
            }
        ]);
    });

    it('should create cluster with overrides', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const vpc = VpcHelper.getVpcById(stack, 'vpcId');
        const clusterFactory = new ClusterFactory(stack, 'stack', {
            vpc: vpc,
            alarmEmails: ['test@example.edu'],
            containerInsights: true
        });
        clusterFactory.create('footainer');
        expect(app.synth().manifest.missing).toEqual([
            {
                "key": "vpc-provider:account=12344:filter.isDefault=false:filter.vpc-id=vpcId:region=us-east-1:returnAsymmetricSubnets=true",
                "props": {
                    "account": "12344",
                    "filter": {
                        "isDefault": "false",
                        "vpc-id": "vpcId"
                    },
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    "region": "us-east-1",
                    "returnAsymmetricSubnets": true
                },
                "provider": "vpc-provider"
            }
        ]);
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        const alarmTopicRef = templateHelper.startsWithMatch("stackclusteralarmtopic");
        const clusterRef = templateHelper.startsWithMatch("stackfootainer");
        templateHelper.expected('AWS::ECS::Cluster',  [
            {
                key: 'stackfootainer',
                properties: Match.objectEquals({
                    "Type": "AWS::ECS::Cluster",
                    "Properties": {
                        "ClusterName": "stack-footainer",
                        "ClusterSettings": [
                            {
                                "Name": "containerInsights",
                                "Value": "enabled"
                            }
                        ]
                    }
                }),
            }
        ]);
        templateHelper.expected('AWS::SNS::Topic',  [
            {
                key: "stackclusteralarmtopic",
                properties: {}
            }
        ]);
        templateHelper.expected('AWS::SNS::Subscription',  [
            {
                key: "stackclusteralarmtopictestexampleedu",
                properties: Match.objectEquals({
                    "Type": "AWS::SNS::Subscription",
                    "Properties": {
                        "Protocol": "email",
                        "TopicArn": {
                            "Ref": alarmTopicRef
                        },
                        "Endpoint": "test@example.edu"
                    }
                })
            }
        ]);
        templateHelper.expected('AWS::CloudWatch::Alarm',  [
            {
                key: 'stackclustercpualarm',
                properties: Match.objectEquals({
                    "Type": "AWS::CloudWatch::Alarm",
                    "Properties": {
                        "ComparisonOperator": "GreaterThanOrEqualToThreshold",
                        "EvaluationPeriods": 1,
                        "AlarmActions": [
                            {
                                "Ref": alarmTopicRef
                            }
                        ],
                        "Dimensions": [
                            {
                                "Name": "ClusterName",
                                "Value": {
                                    "Ref": clusterRef
                                }
                            }
                        ],
                        "MetricName": "CPUUtilization",
                        "Namespace": "AWS/ECS",
                        "OKActions": [
                            {
                                "Ref": alarmTopicRef
                            }
                        ],
                        "Period": 300,
                        "Statistic": "Average",
                        "Threshold": 90
                    }
                })
            },
            {
                key: 'stackclustermemoryalarm',
                properties: Match.objectEquals({
                    Type: 'AWS::CloudWatch::Alarm',
                    Properties: {
                        ComparisonOperator: 'GreaterThanOrEqualToThreshold',
                        EvaluationPeriods: 1,
                        AlarmActions: [{Ref: alarmTopicRef}],
                        Dimensions: [
                            {Name: 'ClusterName', Value: {Ref: clusterRef}}
                        ],
                        MetricName: 'MemoryUtilization',
                        Namespace: 'AWS/ECS',
                        OKActions: [{Ref: alarmTopicRef}],
                        Period: 300,
                        Statistic: 'Average',
                        Threshold: 90
                    }
                })
            }
        ]);
    });
});