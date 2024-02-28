import {App, Stack} from "aws-cdk-lib";
import {Cluster} from "aws-cdk-lib/aws-ecs";
import {resetStaticProps} from "../../src/utils/reset-static-props";
import {Match, Template} from "aws-cdk-lib/assertions";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {VpcHelper} from "../../src/utils/vpc-helper";
import {StartStopFactory} from "../../src/start-stop/start-stop-factory";
import {MatchHelper} from "../../src/utils/testing/match-helper";

describe('start stop factory', () => {

    beforeEach(() => {
        resetStaticProps();
    });

    it('should create start stop events', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const vpc = VpcHelper.getVpcById(stack, 'vpcId');
        const cluster = new Cluster(stack, 'cluster', {vpc: vpc});
        const startStopFactory = new StartStopFactory(stack, stack.node.id, {
            start: 'cron(0 13 ? * MON-FRI *)',
            stop: 'cron(0 5 ? * TUE-SAT *)',
            startStopFunctionProps: {}
        });
        startStopFactory.createRules(cluster);
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        // templateHelper.inspect();
        templateHelper.template.templateMatches(getExpectedStartStopEvents());

    });

    it('should create only stop event', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const vpc = VpcHelper.getVpcById(stack, 'vpcId');
        const cluster = new Cluster(stack, 'cluster', {vpc: vpc});
        const startStopFactory = new StartStopFactory(stack, stack.node.id, {
            stop: 'cron(0 5 ? * * *)',
            startStopFunctionProps: {}
        });
        startStopFactory.createRules(cluster);
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        // templateHelper.inspect();
        templateHelper.template.templateMatches(getExpectedStopEvent());
    });

    function getExpectedStopEvent() {
        return {
            Resources: {
                cluster611F8AFF: {Type: 'AWS::ECS::Cluster'},
                stackstartstopfnlg4F1C28AC: {
                    Type: 'AWS::Logs::LogGroup',
                    Properties: {RetentionInDays: 14},
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
                },
                stackstartstopfnC4BDD24D: {
                    Type: 'AWS::Lambda::Function',
                    Properties: {
                        Code: {
                            S3Bucket: 'cdk-hnb659fds-assets-12344-us-east-1',
                            S3Key: MatchHelper.endsWith('zip')
                        },
                        Environment: {Variables: {CLUSTER: {Ref: 'cluster611F8AFF'}}},
                        FunctionName: 'stack-start-stop-fn',
                        Handler: 'index.handler',
                        LoggingConfig: {LogGroup: {Ref: 'stackstartstopfnlg4F1C28AC'}},
                        MemorySize: 128,
                        Role: {
                            'Fn::GetAtt': ['stackstartstopfnServiceRole6999680C', 'Arn']
                        },
                        Runtime: 'nodejs20.x',
                        Timeout: 5
                    },
                    DependsOn: ['stackstartstopfnServiceRole6999680C']
                },
                stackstartstopstoprule234F78F9: {
                    Type: 'AWS::Events::Rule',
                    Properties: {
                        ScheduleExpression: 'cron(0 5 ? * * *)',
                        State: 'ENABLED',
                        Targets: [
                            {
                                Arn: {'Fn::GetAtt': ['stackstartstopfnC4BDD24D', 'Arn']},
                                Id: 'Target0',
                                Input: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            '{"cluster":"',
                                            {'Fn::GetAtt': ['cluster611F8AFF', 'Arn']},
                                            '","status":"stop"}'
                                        ]
                                    ]
                                }
                            }
                        ]
                    }
                },
                stackstartstopstopruleAllowEventRulestackstackstartstopfn2326BACE5DDD2F04: {
                    Type: 'AWS::Lambda::Permission',
                    Properties: {
                        Action: 'lambda:InvokeFunction',
                        FunctionName: {'Fn::GetAtt': ['stackstartstopfnC4BDD24D', 'Arn']},
                        Principal: 'events.amazonaws.com',
                        SourceArn: {'Fn::GetAtt': ['stackstartstopstoprule234F78F9', 'Arn']}
                    }
                }
            }
        }
    }

    function getExpectedStartStopEvents() {
        return {
            Resources: {
                cluster611F8AFF: {Type: 'AWS::ECS::Cluster'},
                stackstartstopfnlg4F1C28AC: {
                    Type: 'AWS::Logs::LogGroup',
                    Properties: {RetentionInDays: 14},
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
                },
                stackstartstopfnC4BDD24D: {
                    Type: 'AWS::Lambda::Function',
                    Properties: {
                        Code: {
                            S3Bucket: 'cdk-hnb659fds-assets-12344-us-east-1',
                            S3Key: MatchHelper.endsWith('zip')
                        },
                        Environment: {Variables: {CLUSTER: {Ref: 'cluster611F8AFF'}}},
                        FunctionName: 'stack-start-stop-fn',
                        Handler: 'index.handler',
                        LoggingConfig: {LogGroup: {Ref: 'stackstartstopfnlg4F1C28AC'}},
                        MemorySize: 128,
                        Role: {
                            'Fn::GetAtt': ['stackstartstopfnServiceRole6999680C', 'Arn']
                        },
                        Runtime: 'nodejs20.x',
                        Timeout: 5
                    },
                    DependsOn: ['stackstartstopfnServiceRole6999680C']
                },
                stackstartstopstartruleBBF090B5: {
                    Type: 'AWS::Events::Rule',
                    Properties: {
                        ScheduleExpression: 'cron(0 13 ? * MON-FRI *)',
                        State: 'ENABLED',
                        Targets: [
                            {
                                Arn: {'Fn::GetAtt': ['stackstartstopfnC4BDD24D', 'Arn']},
                                Id: 'Target0',
                                Input: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            '{"cluster":"',
                                            {'Fn::GetAtt': ['cluster611F8AFF', 'Arn']},
                                            '","status":"start"}'
                                        ]
                                    ]
                                }
                            }
                        ]
                    }
                },
                stackstartstopstartruleAllowEventRulestackstackstartstopfn2326BACE6776CFAD: {
                    Type: 'AWS::Lambda::Permission',
                    Properties: {
                        Action: 'lambda:InvokeFunction',
                        FunctionName: {'Fn::GetAtt': ['stackstartstopfnC4BDD24D', 'Arn']},
                        Principal: 'events.amazonaws.com',
                        SourceArn: {
                            'Fn::GetAtt': ['stackstartstopstartruleBBF090B5', 'Arn']
                        }
                    }
                },
                stackstartstopstoprule234F78F9: {
                    Type: 'AWS::Events::Rule',
                    Properties: {
                        ScheduleExpression: 'cron(0 5 ? * TUE-SAT *)',
                        State: 'ENABLED',
                        Targets: [
                            {
                                Arn: {'Fn::GetAtt': ['stackstartstopfnC4BDD24D', 'Arn']},
                                Id: 'Target0',
                                Input: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            '{"cluster":"',
                                            {'Fn::GetAtt': ['cluster611F8AFF', 'Arn']},
                                            '","status":"stop"}'
                                        ]
                                    ]
                                }
                            }
                        ]
                    }
                },
                stackstartstopstopruleAllowEventRulestackstackstartstopfn2326BACE5DDD2F04: {
                    Type: 'AWS::Lambda::Permission',
                    Properties: {
                        Action: 'lambda:InvokeFunction',
                        FunctionName: {'Fn::GetAtt': ['stackstartstopfnC4BDD24D', 'Arn']},
                        Principal: 'events.amazonaws.com',
                        SourceArn: {'Fn::GetAtt': ['stackstartstopstoprule234F78F9', 'Arn']}
                    }
                }
            }
        }
    }
});