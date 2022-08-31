import {App, Stack} from "aws-cdk-lib";
import {CodePipeline, ShellStep} from "aws-cdk-lib/pipelines";
import {PipelineNotificationEvents} from "aws-cdk-lib/aws-codepipeline";
import {Match, Template} from "aws-cdk-lib/assertions";
import {CodePipelineCodestarSource} from "../../src/pipeline/code-pipeline-codestar-source";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {PipelineNotifyOn} from "../../src/pipeline/pipeline-notify-on";

describe('pipeline notify on', () => {

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
        new PipelineNotifyOn(stack, stack.node.id, {
            events: [
                PipelineNotificationEvents.PIPELINE_EXECUTION_FAILED,
                PipelineNotificationEvents.PIPELINE_EXECUTION_SUCCEEDED,
            ],
            source: pipeline.pipeline,
            emails: ['test@example.edu']
        });
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        const expected = {
            pipelinePipelinestackFC55AA27: {
                Type: 'AWS::CodeStarNotifications::NotificationRule',
                Properties: {
                    DetailType: 'FULL',
                    EventTypeIds: [
                        'codepipeline-pipeline-pipeline-execution-failed',
                        'codepipeline-pipeline-pipeline-execution-succeeded'
                    ],
                    Name: 'stackpipelinePipelinestack576352AD',
                    Resource: {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                {Ref: 'AWS::Partition'},
                                ':codepipeline:us-pipeline:123pipeline:',
                                {Ref: 'pipelinePipeline4163A4B1'}
                            ]
                        ]
                    },
                    Targets: [
                        {
                            TargetAddress: {Ref: 'stacknotificationruletopic71B33350'},
                            TargetType: 'SNS'
                        }
                    ]
                }
            },
            stacknotificationruletopic71B33350: {Type: 'AWS::SNS::Topic'},
            stacknotificationruletopictestexampleedu3AF652F5: {
                Type: 'AWS::SNS::Subscription',
                Properties: {
                    Protocol: 'email',
                    TopicArn: {Ref: 'stacknotificationruletopic71B33350'},
                    Endpoint: 'test@example.edu'
                }
            },
            stacknotificationruletopicPolicy6BDEEFC5: {
                Type: 'AWS::SNS::TopicPolicy',
                Properties: {
                    PolicyDocument: {
                        Statement: [
                            {
                                Action: 'sns:Publish',
                                Effect: 'Allow',
                                Principal: {Service: 'codestar-notifications.amazonaws.com'},
                                Resource: {Ref: 'stacknotificationruletopic71B33350'},
                                Sid: '0'
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    Topics: [{Ref: 'stacknotificationruletopic71B33350'}]
                }
            }
        };
        for (const resource of Object.values(expected)) {
            templateHelper.expectResource(resource.Type, {
                properties: Match.objectEquals(resource)
            });
        }
    });
});