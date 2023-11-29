import {App, Stack} from "aws-cdk-lib";
import {resetStaticProps} from "../../src/utils/reset-static-props";
import {Cluster, FargateTaskDefinition} from "aws-cdk-lib/aws-ecs";
import {Match, Template} from "aws-cdk-lib/assertions";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {VpcHelper} from "../../src/utils/vpc-helper";
import {EcsRunTask} from "../../src/task/ecs-run-task";
import {MatchHelper} from "../../src/utils/testing/match-helper";

beforeEach(() => {
    resetStaticProps();
});

describe('ecs run task', () => {

    it('should create a create ecs run task using defaults', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const vpc = VpcHelper.getVpcById(stack, 'vpcId');
        const cluster = new Cluster(stack, 'cluster', {vpc: vpc});
        const taskDef = new FargateTaskDefinition(stack, 'task-def');
        new EcsRunTask(stack, 'run-task', {
            cluster: cluster,
            taskDefinition: taskDef,
            runOnCreate: true
        });
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        templateHelper.expected('Custom::AWS', [
            {
                key: 'runtaskcreatefn',
                properties: Match.objectEquals({
                    Type: 'Custom::AWS',
                    Properties: {
                        ServiceToken: {
                            'Fn::GetAtt': [Match.stringLikeRegexp('^AWS.*'), 'Arn']
                        },
                        Create: {
                            'Fn::Join': [
                                '',
                                [
                                    '{"service":"ECS","action":"runTask","physicalResourceId":{"id":"',
                                    {Ref: templateHelper.startsWithMatch('taskdef')},
                                    '"},"parameters":{"cluster":"',
                                    {Ref: templateHelper.startsWithMatch('cluster')},
                                    '","taskDefinition":"',
                                    {Ref: templateHelper.startsWithMatch('taskdef')},
                                    '","capacityProviderStrategy":[],"launchType":"FARGATE","networkConfiguration":{"awsvpcConfiguration":{"assignPublicIp":"DISABLED","subnets":["p-12345","p-67890"],"securityGroups":["',
                                    {
                                        'Fn::GetAtt': [templateHelper.startsWithMatch('runtaskSecurityGroup'), 'GroupId']
                                    },
                                    '"]}}}}'
                                ]
                            ]
                        },
                        InstallLatestAwsSdk: true
                    },
                    DependsOn: [templateHelper.startsWithMatch('runtaskcreatefnCustomResourcePolicy')],
                    UpdateReplacePolicy: 'Delete',
                    DeletionPolicy: 'Delete'
                })
            }
        ]);
        templateHelper.expected('Custom::LogRetention', [
            {
                key: '^AWS.*LogRetention.*',
                properties: Match.objectEquals({
                    Type: 'Custom::LogRetention',
                    Properties: {
                        ServiceToken: {
                            'Fn::GetAtt': [
                                templateHelper.startsWithMatch('LogRetention'),
                                'Arn'
                            ]
                        },
                        LogGroupName: {
                            'Fn::Join': [
                                '',
                                [
                                    '/aws/lambda/',
                                    {Ref: templateHelper.startsWithMatch('AWS')}
                                ]
                            ]
                        },
                        RetentionInDays: 7
                    }
                })
            }
        ]);
        templateHelper.expected('AWS::Lambda::Function', [
            {
                key: '^AWS.*',
                properties: Match.objectEquals({
                    Type: 'AWS::Lambda::Function',
                    Properties: {
                        Code: {
                            S3Bucket: 'cdk-hnb659fds-assets-12344-us-east-1',
                            S3Key: MatchHelper.endsWith('zip')
                        },
                        Role: {
                            'Fn::GetAtt': [
                                Match.stringLikeRegexp('^AWS.*ServiceRole.*'),
                                'Arn'
                            ]
                        },
                        FunctionName: 'create-fn',
                        Handler: 'index.handler',
                        Runtime: MatchHelper.startsWith('nodejs'),
                        Timeout: 120
                    },
                    DependsOn: [
                        Match.stringLikeRegexp('^AWS.*ServiceRoleDefaultPolicy.*'),
                        Match.stringLikeRegexp('^AWS.*ServiceRole.*')
                    ]
                })
            },
            {
                key: 'LogRetention',
                properties: Match.objectEquals({
                    Type: 'AWS::Lambda::Function',
                    Properties: {
                        Code: {
                            S3Bucket: 'cdk-hnb659fds-assets-12344-us-east-1',
                            S3Key: MatchHelper.endsWith('zip')
                        },
                        Role: {
                            'Fn::GetAtt': [
                                Match.stringLikeRegexp('^LogRetention.*ServiceRole.*'),
                                'Arn'
                            ]
                        },
                        Handler: 'index.handler',
                        Runtime: MatchHelper.startsWith('nodejs'),
                        Timeout: 900,
                    },
                    DependsOn: [
                        Match.stringLikeRegexp('^LogRetention.*ServiceRoleDefaultPolicy.*'),
                        Match.stringLikeRegexp('^LogRetention.*ServiceRole.*')
                    ]
                })
            }
        ])
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
    });

    it('should create an update ecs run task using defaults also adds create', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const vpc = VpcHelper.getVpcById(stack, 'vpcId');
        const cluster = new Cluster(stack, 'cluster', {vpc: vpc});
        const taskDef = new FargateTaskDefinition(stack, 'task-def');
        new EcsRunTask(stack, 'run-task', {
            cluster: cluster,
            taskDefinition: taskDef,
            runOnUpdate: true
        });
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        templateHelper.expected('Custom::AWS', [
            {
                key: 'runtaskupdatefn',
                properties: Match.objectEquals({
                    Type: 'Custom::AWS',
                    Properties: {
                        ServiceToken: {
                            'Fn::GetAtt': [Match.stringLikeRegexp('^AWS.*'), 'Arn']
                        },
                        Create: {
                            'Fn::Join': [
                                '',
                                [
                                    '{"service":"ECS","action":"runTask","physicalResourceId":{"id":"',
                                    {Ref: templateHelper.startsWithMatch('taskdef')},
                                    '"},"parameters":{"cluster":"',
                                    {Ref: templateHelper.startsWithMatch('cluster')},
                                    '","taskDefinition":"',
                                    {Ref: templateHelper.startsWithMatch('taskdef')},
                                    '","capacityProviderStrategy":[],"launchType":"FARGATE","networkConfiguration":{"awsvpcConfiguration":{"assignPublicIp":"DISABLED","subnets":["p-12345","p-67890"],"securityGroups":["',
                                    {
                                        'Fn::GetAtt': [templateHelper.startsWithMatch('runtaskSecurityGroup'), 'GroupId']
                                    },
                                    '"]}}}}'
                                ]
                            ]
                        },
                        Update: {
                            'Fn::Join': [
                                '',
                                [
                                    '{"service":"ECS","action":"runTask","physicalResourceId":{"id":"',
                                    {Ref: templateHelper.startsWithMatch('taskdef')},
                                    '"},"parameters":{"cluster":"',
                                    {Ref: templateHelper.startsWithMatch('cluster')},
                                    '","taskDefinition":"',
                                    {Ref: templateHelper.startsWithMatch('taskdef')},
                                    '","capacityProviderStrategy":[],"launchType":"FARGATE","networkConfiguration":{"awsvpcConfiguration":{"assignPublicIp":"DISABLED","subnets":["p-12345","p-67890"],"securityGroups":["',
                                    {
                                        'Fn::GetAtt': [templateHelper.startsWithMatch('runtaskSecurityGroup'), 'GroupId']
                                    },
                                    '"]}}}}'
                                ]
                            ]
                        },
                        InstallLatestAwsSdk: true
                    },
                    DependsOn: [templateHelper.startsWithMatch('runtaskupdatefnCustomResourcePolicy')],
                    UpdateReplacePolicy: 'Delete',
                    DeletionPolicy: 'Delete'
                })
            }
        ]);
        templateHelper.expected('Custom::LogRetention', [
            {
                key: '^AWS.*LogRetention.*',
                properties: Match.objectEquals({
                    Type: 'Custom::LogRetention',
                    Properties: {
                        ServiceToken: {
                            'Fn::GetAtt': [
                                templateHelper.startsWithMatch('LogRetention'),
                                'Arn'
                            ]
                        },
                        LogGroupName: {
                            'Fn::Join': [
                                '',
                                [
                                    '/aws/lambda/',
                                    {Ref: templateHelper.startsWithMatch('AWS')}
                                ]
                            ]
                        },
                        RetentionInDays: 7
                    }
                })
            }
        ]);
        templateHelper.expected('AWS::Lambda::Function', [
            {
                key: '^AWS.*',
                properties: Match.objectEquals({
                    Type: 'AWS::Lambda::Function',
                    Properties: {
                        Code: {
                            S3Bucket: 'cdk-hnb659fds-assets-12344-us-east-1',
                            S3Key: MatchHelper.endsWith('zip')
                        },
                        Role: {
                            'Fn::GetAtt': [
                                Match.stringLikeRegexp('^AWS.*ServiceRole.*'),
                                'Arn'
                            ]
                        },
                        FunctionName: 'update-fn',
                        Handler: 'index.handler',
                        Runtime: MatchHelper.startsWith('nodejs'),
                        Timeout: 120
                    },
                    DependsOn: [
                        Match.stringLikeRegexp('^AWS.*ServiceRoleDefaultPolicy.*'),
                        Match.stringLikeRegexp('^AWS.*ServiceRole.*')
                    ]
                })
            },
            {
                key: 'LogRetention',
                properties: Match.objectEquals({
                    Type: 'AWS::Lambda::Function',
                    Properties: {
                        Code: {
                            S3Bucket: 'cdk-hnb659fds-assets-12344-us-east-1',
                            S3Key: MatchHelper.endsWith('zip')
                        },
                        Role: {
                            'Fn::GetAtt': [
                                Match.stringLikeRegexp('^LogRetention.*ServiceRole.*'),
                                'Arn'
                            ]
                        },
                        Handler: 'index.handler',
                        Runtime: MatchHelper.startsWith('nodejs'),
                        Timeout: 900
                    },
                    DependsOn: [
                        Match.stringLikeRegexp('^LogRetention.*ServiceRoleDefaultPolicy.*'),
                        Match.stringLikeRegexp('^LogRetention.*ServiceRole.*')
                    ]
                })
            }
        ])
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
    });
});