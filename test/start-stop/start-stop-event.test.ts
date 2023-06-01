import {App, aws_lambda, Stack} from "aws-cdk-lib";
import {Cluster} from "aws-cdk-lib/aws-ecs";
import {Match, Template} from "aws-cdk-lib/assertions";
import {StartStopEvent} from "../../src/start-stop/start-stop-event";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {StartStopLambdaEventStatus} from "../../src/start-stop/start-stop-definitions";
import {MatchHelper} from "../../src/utils/testing/match-helper";

describe('start stop event', () => {
    it('should create an event', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const fn = new aws_lambda.Function(stack, 'fn', {
            runtime: aws_lambda.Runtime.NODEJS_14_X,
            handler: 'index.handler',
            code: aws_lambda.Code.fromInline(`exports.handler = handler.toString()`)
        });
        const startStopEvent = new StartStopEvent(stack, stack.node.id, {
            lambdaFunction: fn
        });
        const cluster = new Cluster(stack, 'cluster');
        startStopEvent.create({
            clusterArn: cluster.clusterArn,
            status: StartStopLambdaEventStatus.STOP,
            schedule: 'cron(0 5 * * ? *)'
        });
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        templateHelper.expected('AWS::IAM::Role',  [
            {
                key: 'fnServiceRole',
                properties: Match.objectEquals({
                    Type: 'AWS::IAM::Role',
                    Properties: {
                        AssumeRolePolicyDocument: {
                            Statement: [
                                {
                                    Action: 'sts:AssumeRole',
                                    Effect: 'Allow',
                                    Principal: {Service: 'lambda.amazonaws.com'}
                                }
                            ],
                            Version: '2012-10-17'
                        },
                        ManagedPolicyArns: [
                            {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {Ref: 'AWS::Partition'},
                                        ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole'
                                    ]
                                ]
                            }
                        ]
                    }
                })
            }
        ]);
        templateHelper.expected('AWS::Lambda::Function',  [
            {
                key: 'fn',
                properties: Match.objectEquals({
                    Type: 'AWS::Lambda::Function',
                    Properties: {
                        Code: {ZipFile: 'exports.handler = handler.toString()'},
                        Role: {'Fn::GetAtt': [templateHelper.startsWithMatch('fnServiceRole'), 'Arn']},
                        Handler: 'index.handler',
                        Runtime: MatchHelper.startsWith('nodejs')
                    },
                    DependsOn: [templateHelper.startsWithMatch('fnServiceRole')]
                })
            }
        ]);
        templateHelper.expected('AWS::ECS::Cluster',  [
            {
                key: 'cluster',
                properties: {}
            }
        ]);
        templateHelper.expected('AWS::Events::Rule',  [
            {
                key: 'stackstartstopstoprule',
                properties: Match.objectEquals({
                    Type: 'AWS::Events::Rule',
                    Properties: {
                        ScheduleExpression: 'cron(0 5 * * ? *)',
                        State: 'ENABLED',
                        Targets: [
                            {
                                Arn: {'Fn::GetAtt': [templateHelper.startsWithMatch('fn'), 'Arn']},
                                Id: 'Target0',
                                Input: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            '{"cluster":"',
                                            {'Fn::GetAtt': [templateHelper.startsWithMatch('cluster'), 'Arn']},
                                            '","status":"stop"}'
                                        ]
                                    ]
                                }
                            }
                        ]
                    }
                })
            }
        ]);
        templateHelper.expected('AWS::Lambda::Permission',  [
            {
                key: 'stackstartstopstopruleAllowEventRulestackfn',
                properties: Match.objectEquals({
                    Type: 'AWS::Lambda::Permission',
                    Properties: {
                        Action: 'lambda:InvokeFunction',
                        FunctionName: {'Fn::GetAtt': [templateHelper.startsWithMatch('fn'), 'Arn']},
                        Principal: 'events.amazonaws.com',
                        SourceArn: {'Fn::GetAtt': [templateHelper.startsWithMatch('stackstartstopstoprule'), 'Arn']}
                    }
                })
            }
        ]);
    });
});