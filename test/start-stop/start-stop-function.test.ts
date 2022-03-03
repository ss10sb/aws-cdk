import {App, Stack} from "aws-cdk-lib";
import {StartStopFunction} from "../../src/start-stop";
import {TemplateHelper} from "../../src/utils/testing";
import {Match, Template} from "aws-cdk-lib/assertions";

describe('start stop function', () => {
    it('should create lambda function with defaults', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        new StartStopFunction(stack, stack.node.id, {});
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        templateHelper.expected('AWS::IAM::Role', [
            {
                key: 'stackstartstopfnServiceRole',
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
            },
            {
                key: '^LogRetention.*ServiceRole.*',
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
        templateHelper.expected('AWS::Lambda::Function', [
            {
                key: 'stackstartstopfn',
                properties: Match.objectEquals({
                    Type: 'AWS::Lambda::Function',
                    Properties: {
                        Code: {
                            S3Bucket: 'cdk-hnb659fds-assets-12344-us-east-1',
                            S3Key: Match.stringLikeRegexp('^.*\.zip')
                        },
                        Role: {
                            'Fn::GetAtt': [templateHelper.startsWithMatch('stackstartstopfnServiceRole'), 'Arn']
                        },
                        Environment: {Variables: {CLUSTER: ''}},
                        FunctionName: 'stack-start-stop-fn',
                        Handler: 'index.handler',
                        MemorySize: 128,
                        Runtime: 'nodejs14.x',
                        Timeout: 5
                    },
                    DependsOn: [templateHelper.startsWithMatch('stackstartstopfnServiceRole')]
                })
            },
            {
                key: 'LogRetention',
                properties: Match.objectEquals({
                    Type: 'AWS::Lambda::Function',
                    Properties: {
                        Handler: 'index.handler',
                        Runtime: 'nodejs14.x',
                        Code: {
                            S3Bucket: 'cdk-hnb659fds-assets-12344-us-east-1',
                            S3Key: Match.stringLikeRegexp('^.*\.zip')
                        },
                        Role: {
                            'Fn::GetAtt': [
                                Match.stringLikeRegexp('^LogRetention.*ServiceRole.*'),
                                'Arn'
                            ]
                        }
                    },
                    DependsOn: [
                        Match.stringLikeRegexp('^LogRetention.*ServiceRoleDefaultPolicy.*'),
                        Match.stringLikeRegexp('^LogRetention.*ServiceRole.*')
                    ]
                })
            }
        ]);
        templateHelper.expected('Custom::LogRetention', [
            {
                key: 'stackstartstopfnLogRetention',
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
                                ['/aws/lambda/', {Ref: templateHelper.startsWithMatch('stackstartstopfn')}]
                            ]
                        },
                        RetentionInDays: 30
                    }
                })
            }
        ]);
        templateHelper.expected('AWS::IAM::Policy', [
            {
                key: '^LogRetention.*ServiceRoleDefaultPolicy.*',
                properties: Match.objectEquals({
                    Type: 'AWS::IAM::Policy',
                    Properties: {
                        PolicyDocument: {
                            Statement: [
                                {
                                    Action: [
                                        'logs:PutRetentionPolicy',
                                        'logs:DeleteRetentionPolicy'
                                    ],
                                    Effect: 'Allow',
                                    Resource: '*'
                                }
                            ],
                            Version: '2012-10-17'
                        },
                        PolicyName: Match.stringLikeRegexp('^LogRetention.*ServiceRoleDefaultPolicy.*'),
                        Roles: [
                            {
                                Ref: Match.stringLikeRegexp('LogRetention.*ServiceRole.*')
                            }
                        ]
                    }
                })
            }
        ]);
    });
});