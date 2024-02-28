import {App, Stack} from "aws-cdk-lib";
import {Match, Template} from "aws-cdk-lib/assertions";
import {StartStopFunction} from "../../src/start-stop/start-stop-function";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {MatchHelper} from "../../src/utils/testing/match-helper";

describe('start stop function', () => {
    it('should create lambda function with defaults', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const ssfunc = new StartStopFunction(stack, stack.node.id, {});
        ssfunc.create('cluster-name');
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        // templateHelper.inspect();
        templateHelper.template.templateMatches(getExpectedForStartStop());
    });

    function getExpectedForStartStop() {
        return {
            Resources: {
                stackstartstopfnlg4F1C28AC: {
                    Type: 'AWS::Logs::LogGroup',
                    Properties: { RetentionInDays: 14 },
                    UpdateReplacePolicy: 'Delete',
                    DeletionPolicy: 'Delete'
                },
                stackstartstopfnServiceRole6999680C: {
                    Type: 'AWS::IAM::Role',
                    Properties: {
                        AssumeRolePolicyDocument: {
                            Statement: [
                                {
                                    Action: 'sts:AssumeRole',
                                    Effect: 'Allow',
                                    Principal: { Service: 'lambda.amazonaws.com' }
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
                                        { Ref: 'AWS::Partition' },
                                        ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole'
                                    ]
                                ]
                            }
                        ]
                    }
                },
                stackstartstopfnC4BDD24D: {
                    Type: 'AWS::Lambda::Function',
                    Properties: {
                        Code: {
                            S3Bucket: 'cdk-hnb659fds-assets-12344-us-east-1',
                            S3Key: MatchHelper.endsWith('zip')
                        },
                        Environment: { Variables: { CLUSTER: 'cluster-name' } },
                        FunctionName: 'stack-start-stop-fn',
                        Handler: 'index.handler',
                        LoggingConfig: { LogGroup: { Ref: 'stackstartstopfnlg4F1C28AC' } },
                        MemorySize: 128,
                        Role: {
                            'Fn::GetAtt': [ 'stackstartstopfnServiceRole6999680C', 'Arn' ]
                        },
                        Runtime: 'nodejs20.x',
                        Timeout: 5
                    },
                    DependsOn: [ 'stackstartstopfnServiceRole6999680C' ]
                }
            }
        }
    }
});