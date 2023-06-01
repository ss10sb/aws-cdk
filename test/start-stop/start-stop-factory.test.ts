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
            startStopFunctionProps: {
                cluster: cluster
            }
        });
        startStopFactory.createRules(cluster);
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        templateHelper.expected('AWS::ECS::Cluster',  [
            {
                key: 'cluster',
                properties: {}
            }
        ]);
        templateHelper.expected('AWS::IAM::Role',  [
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
                })
            }
        ]);
        templateHelper.expected('AWS::Lambda::Function',  [
            {
                key: 'stackstartstopfn',
                properties: Match.objectEquals({
                    Type: 'AWS::Lambda::Function',
                    Properties: {
                        Code: {
                            S3Bucket: 'cdk-hnb659fds-assets-12344-us-east-1',
                            S3Key: MatchHelper.endsWith('zip')
                        },
                        Role: {
                            'Fn::GetAtt': [ templateHelper.startsWithMatch('stackstartstopfnServiceRole'), 'Arn' ]
                        },
                        Environment: {
                            Variables: { CLUSTER: { 'Fn::GetAtt': [ templateHelper.startsWithMatch('cluster'), 'Arn' ] } }
                        },
                        FunctionName: 'stack-start-stop-fn',
                        Handler: 'index.handler',
                        MemorySize: 128,
                        Runtime: MatchHelper.startsWith('nodejs'),
                        Timeout: 5
                    },
                    DependsOn: [ templateHelper.startsWithMatch('stackstartstopfnServiceRole') ]
                })
            },
            {
                key: 'LogRetention',
                properties: Match.objectEquals({
                    Type: 'AWS::Lambda::Function',
                    Properties: {
                        Handler: 'index.handler',
                        Runtime: MatchHelper.startsWith('nodejs'),
                        Code: {
                            S3Bucket: 'cdk-hnb659fds-assets-12344-us-east-1',
                            S3Key: MatchHelper.endsWith('zip')
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
        templateHelper.expected('Custom::LogRetention',  [
            {
                key: 'stackstartstopfnLogRetention',
                properties: Match.objectEquals({
                    Type: 'Custom::LogRetention',
                    Properties: {
                        ServiceToken: {
                            'Fn::GetAtt': [
                                Match.stringLikeRegexp('LogRetention.*'),
                                'Arn'
                            ]
                        },
                        LogGroupName: {
                            'Fn::Join': [
                                '',
                                [ '/aws/lambda/', { Ref: templateHelper.startsWithMatch('stackstartstopfn') } ]
                            ]
                        },
                        RetentionInDays: 7
                    }
                })
            }
        ]);
        templateHelper.expected('AWS::IAM::Policy',  [
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
                        PolicyName: Match.stringLikeRegexp('LogRetention.*ServiceRoleDefaultPolicy.*'),
                        Roles: [
                            {
                                Ref: Match.stringLikeRegexp('^LogRetention.*ServiceRole.*')
                            }
                        ]
                    }
                })
            }
        ]);
        templateHelper.expected('AWS::Events::Rule',  [
            {
                key: 'stackstartstopstartrule',
                properties: Match.objectEquals({
                    Type: 'AWS::Events::Rule',
                    Properties: {
                        ScheduleExpression: 'cron(0 13 ? * MON-FRI *)',
                        State: 'ENABLED',
                        Targets: [
                            {
                                Arn: { 'Fn::GetAtt': [ templateHelper.startsWithMatch('stackstartstopfn'), 'Arn' ] },
                                Id: 'Target0',
                                Input: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            '{"cluster":"',
                                            { 'Fn::GetAtt': [ templateHelper.startsWithMatch('cluster'), 'Arn' ] },
                                            '","status":"start"}'
                                        ]
                                    ]
                                }
                            }
                        ]
                    }
                })
            },
            {
                key: 'stackstartstopstoprule',
                properties: Match.objectEquals({
                    Type: 'AWS::Events::Rule',
                    Properties: {
                        ScheduleExpression: 'cron(0 5 ? * TUE-SAT *)',
                        State: 'ENABLED',
                        Targets: [
                            {
                                Arn: { 'Fn::GetAtt': [ templateHelper.startsWithMatch('stackstartstopfn'), 'Arn' ] },
                                Id: 'Target0',
                                Input: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            '{"cluster":"',
                                            { 'Fn::GetAtt': [ templateHelper.startsWithMatch('cluster'), 'Arn' ] },
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
                key: 'stackstartstopstartruleAllowEventRulestackstackstartstopfn',
                properties: Match.objectEquals({
                    Type: 'AWS::Lambda::Permission',
                    Properties: {
                        Action: 'lambda:InvokeFunction',
                        FunctionName: { 'Fn::GetAtt': [ templateHelper.startsWithMatch('stackstartstopfn'), 'Arn' ] },
                        Principal: 'events.amazonaws.com',
                        SourceArn: {
                            'Fn::GetAtt': [ templateHelper.startsWithMatch('stackstartstopstartrule'), 'Arn' ]
                        }
                    }
                })
            },
            {
                key: 'stackstartstopstopruleAllowEventRulestackstackstartstopfn',
                properties: Match.objectEquals({
                    Type: 'AWS::Lambda::Permission',
                    Properties: {
                        Action: 'lambda:InvokeFunction',
                        FunctionName: { 'Fn::GetAtt': [ templateHelper.startsWithMatch('stackstartstopfn'), 'Arn' ] },
                        Principal: 'events.amazonaws.com',
                        SourceArn: {
                            'Fn::GetAtt': [ templateHelper.startsWithMatch('stackstartstopstoprule'), 'Arn' ]
                        }
                    }
                })
            }
        ]);
    });

    it('should create only stop event', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const vpc = VpcHelper.getVpcById(stack, 'vpcId');
        const cluster = new Cluster(stack, 'cluster', {vpc: vpc});
        const startStopFactory = new StartStopFactory(stack, stack.node.id, {
            stop: 'cron(0 5 ? * * *)',
            startStopFunctionProps: {
                cluster: cluster
            }
        });
        startStopFactory.createRules(cluster);
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        templateHelper.expected('AWS::ECS::Cluster',  [
            {
                key: 'cluster',
                properties: {}
            }
        ]);
        templateHelper.expected('AWS::IAM::Role',  [
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
                })
            }
        ]);
        templateHelper.expected('AWS::Lambda::Function',  [
            {
                key: 'stackstartstopfn',
                properties: Match.objectEquals({
                    Type: 'AWS::Lambda::Function',
                    Properties: {
                        Code: {
                            S3Bucket: 'cdk-hnb659fds-assets-12344-us-east-1',
                            S3Key: MatchHelper.endsWith('zip')
                        },
                        Role: {
                            'Fn::GetAtt': [ templateHelper.startsWithMatch('stackstartstopfnServiceRole'), 'Arn' ]
                        },
                        Environment: {
                            Variables: { CLUSTER: { 'Fn::GetAtt': [ templateHelper.startsWithMatch('cluster'), 'Arn' ] } }
                        },
                        FunctionName: 'stack-start-stop-fn',
                        Handler: 'index.handler',
                        MemorySize: 128,
                        Runtime: MatchHelper.startsWith('nodejs'),
                        Timeout: 5
                    },
                    DependsOn: [ templateHelper.startsWithMatch('stackstartstopfnServiceRole') ]
                })
            },
            {
                key: 'LogRetention',
                properties: Match.objectEquals({
                    Type: 'AWS::Lambda::Function',
                    Properties: {
                        Handler: 'index.handler',
                        Runtime: MatchHelper.startsWith('nodejs'),
                        Code: {
                            S3Bucket: 'cdk-hnb659fds-assets-12344-us-east-1',
                            S3Key: MatchHelper.endsWith('zip')
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
        templateHelper.expected('Custom::LogRetention',  [
            {
                key: 'stackstartstopfnLogRetention',
                properties: Match.objectEquals({
                    Type: 'Custom::LogRetention',
                    Properties: {
                        ServiceToken: {
                            'Fn::GetAtt': [
                                Match.stringLikeRegexp('LogRetention.*'),
                                'Arn'
                            ]
                        },
                        LogGroupName: {
                            'Fn::Join': [
                                '',
                                [ '/aws/lambda/', { Ref: templateHelper.startsWithMatch('stackstartstopfn') } ]
                            ]
                        },
                        RetentionInDays: 7
                    }
                })
            }
        ]);
        templateHelper.expected('AWS::IAM::Policy',  [
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
                        PolicyName: Match.stringLikeRegexp('LogRetention.*ServiceRoleDefaultPolicy.*'),
                        Roles: [
                            {
                                Ref: Match.stringLikeRegexp('^LogRetention.*ServiceRole.*')
                            }
                        ]
                    }
                })
            }
        ]);
        templateHelper.expected('AWS::Events::Rule',  [
            {
                key: 'stackstartstopstoprule',
                properties: Match.objectEquals({
                    Type: 'AWS::Events::Rule',
                    Properties: {
                        ScheduleExpression: 'cron(0 5 ? * * *)',
                        State: 'ENABLED',
                        Targets: [
                            {
                                Arn: { 'Fn::GetAtt': [ templateHelper.startsWithMatch('stackstartstopfn'), 'Arn' ] },
                                Id: 'Target0',
                                Input: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            '{"cluster":"',
                                            { 'Fn::GetAtt': [ templateHelper.startsWithMatch('cluster'), 'Arn' ] },
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
                key: 'stackstartstopstopruleAllowEventRulestackstackstartstopfn',
                properties: Match.objectEquals({
                    Type: 'AWS::Lambda::Permission',
                    Properties: {
                        Action: 'lambda:InvokeFunction',
                        FunctionName: { 'Fn::GetAtt': [ templateHelper.startsWithMatch('stackstartstopfn'), 'Arn' ] },
                        Principal: 'events.amazonaws.com',
                        SourceArn: {
                            'Fn::GetAtt': [ templateHelper.startsWithMatch('stackstartstopstoprule'), 'Arn' ]
                        }
                    }
                })
            }
        ]);
    });
});