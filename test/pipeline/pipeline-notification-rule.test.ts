import {App, Stack} from "aws-cdk-lib";
import {CodePipeline, ShellStep} from "aws-cdk-lib/pipelines";
import {Match, Template} from "aws-cdk-lib/assertions";
import {PipelineNotificationEvents} from "aws-cdk-lib/aws-codepipeline";
import {CodePipelineCodestarSource} from "../../src/pipeline/code-pipeline-codestar-source";
import {PipelineNotificationRule} from "../../src/pipeline/pipeline-notification-rule";
import {TemplateHelper} from "../../src/utils/testing/template-helper";

describe('pipeline notification rule', () => {

    it('should create notification rules', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-pipeline', account: '123pipeline'}};
        const stack = new Stack(app, 'stack', stackProps);
        const codeStarSource = new CodePipelineCodestarSource(stack, 'source', {
            connectionArn: "arn:...",
            owner: "repoOwner",
            repo: "repoName"
        });
        const pipeline = new CodePipeline(stack, 'pipeline', {
            synth: new ShellStep('synth', {
                input: codeStarSource.source,
                commands: ['npm']
            })
        });
        pipeline.buildPipeline();
        new PipelineNotificationRule(stack, stack.node.id, {
            events: [
                PipelineNotificationEvents.PIPELINE_EXECUTION_FAILED,
                PipelineNotificationEvents.PIPELINE_EXECUTION_SUCCEEDED,
            ],
            source: pipeline.pipeline,
            emails: ['test@example.edu']
        });
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        templateHelper.expected('AWS::SNS::Topic',  [
            {
                key: 'stacknotificationruletopic',
                properties: {}
            }
        ]);
        templateHelper.expected('AWS::SNS::Subscription',  [
            {
                key: 'stacknotificationruletopictestexampleedu',
                properties: Match.objectEquals({
                    Type: 'AWS::SNS::Subscription',
                    Properties: {
                        Protocol: 'email',
                        TopicArn: {Ref: templateHelper.startsWithMatch('stacknotificationruletopic')},
                        Endpoint: 'test@example.edu'
                    }
                })
            }
        ]);
        templateHelper.expected('AWS::SNS::TopicPolicy',  [
            {
                key: 'stacknotificationruletopicPolicy',
                properties: Match.objectEquals({
                    Type: 'AWS::SNS::TopicPolicy',
                    Properties: {
                        PolicyDocument: {
                            Statement: [
                                {
                                    Action: 'sns:Publish',
                                    Effect: 'Allow',
                                    Principal: {Service: 'codestar-notifications.amazonaws.com'},
                                    Resource: {Ref: templateHelper.startsWithMatch('stacknotificationruletopic')},
                                    Sid: '0'
                                }
                            ],
                            Version: '2012-10-17'
                        },
                        Topics: [{Ref: templateHelper.startsWithMatch('stacknotificationruletopic')}]
                    }
                })
            }
        ]);
        templateHelper.expected('AWS::CodeStarNotifications::NotificationRule',  [
            {
                key: 'stacknotificationrule',
                properties: Match.objectEquals({
                    Type: 'AWS::CodeStarNotifications::NotificationRule',
                    Properties: {
                        DetailType: 'FULL',
                        EventTypeIds: [
                            'codepipeline-pipeline-pipeline-execution-failed',
                            'codepipeline-pipeline-pipeline-execution-succeeded'
                        ],
                        Name: templateHelper.startsWithMatch('stackstacknotificationrule'),
                        Resource: {
                            'Fn::Join': [
                                '',
                                [
                                    'arn:',
                                    {Ref: 'AWS::Partition'},
                                    ':codepipeline:us-pipeline:123pipeline:',
                                    {Ref: templateHelper.startsWithMatch('pipelinePipeline')}
                                ]
                            ]
                        },
                        Targets: [
                            {
                                TargetAddress: {Ref: templateHelper.startsWithMatch('stacknotificationruletopic')},
                                TargetType: 'SNS'
                            }
                        ]
                    }
                })
            }
        ]);
    });
});