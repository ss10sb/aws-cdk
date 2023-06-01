import {App, Stack} from "aws-cdk-lib";
import {Match, Template} from "aws-cdk-lib/assertions";
import path from "path";
import {FunctionType} from "../../src/lambda/lambda-definitions";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {PhpBrefFunction} from "../../src/lambda/php-bref-function";
import {BrefRuntime} from "../../src/lambda/bref-definitions";
import {VpcHelper} from "../../src/utils/vpc-helper";
import {MatchHelper} from "../../src/utils/testing/match-helper";

describe('php bref function create', () => {

    it('should create the default function', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const vpc = VpcHelper.getVpcById(stack, 'vpc123');
        const phpbrefFun = new PhpBrefFunction(stack, 'function', {vpc: vpc, secretKeys: [], environment: {}});
        phpbrefFun.create({
            appPath: path.join(__dirname, '..', '__codebase__'),
            brefRuntime: BrefRuntime.PHP81FPM,
            type: FunctionType.WEB,
            version: '27'
        });
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        // templateHelper.inspect();
        const expected = {
            Resources: {
                functionwebfn0ServiceRole21C72759: {
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
                            },
                            {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {Ref: 'AWS::Partition'},
                                        ':iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole'
                                    ]
                                ]
                            }
                        ]
                    }
                },
                functionwebfn0SecurityGroupCFD2651F: {
                    Type: 'AWS::EC2::SecurityGroup',
                    Properties: {
                        GroupDescription: 'Automatic security group for Lambda Function stackfunctionwebfn0A4DC51CC',
                        SecurityGroupEgress: [
                            {
                                CidrIp: '0.0.0.0/0',
                                Description: 'Allow all outbound traffic by default',
                                IpProtocol: '-1'
                            }
                        ],
                        VpcId: 'vpc-12345'
                    }
                },
                functionwebfn0DF20C809: {
                    Type: 'AWS::Lambda::Function',
                    Properties: {
                        Code: {
                            S3Bucket: 'cdk-hnb659fds-assets-12344-us-east-1',
                            S3Key: MatchHelper.endsWith('zip')
                        },
                        Role: {
                            'Fn::GetAtt': ['functionwebfn0ServiceRole21C72759', 'Arn']
                        },
                        FunctionName: 'function-web-fn-0',
                        Handler: 'public/index.php',
                        Layers: [
                            {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {Ref: 'AWS::Partition'},
                                        ':lambda:us-east-1:209497400698:layer:php-81-fpm:27'
                                    ]
                                ]
                            }
                        ],
                        MemorySize: 512,
                        Runtime: 'provided.al2',
                        Timeout: 28,
                        VpcConfig: {
                            SecurityGroupIds: [
                                {
                                    'Fn::GetAtt': ['functionwebfn0SecurityGroupCFD2651F', 'GroupId']
                                }
                            ],
                            SubnetIds: ['p-12345', 'p-67890']
                        }
                    },
                    DependsOn: ['functionwebfn0ServiceRole21C72759']
                },
                functionwebfn0LogRetention760A77D0: {
                    Type: 'Custom::LogRetention',
                    Properties: {
                        ServiceToken: {
                            'Fn::GetAtt': [
                                'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aFD4BFC8A',
                                'Arn'
                            ]
                        },
                        LogGroupName: {
                            'Fn::Join': [
                                '',
                                ['/aws/lambda/', {Ref: 'functionwebfn0DF20C809'}]
                            ]
                        },
                        RetentionInDays: 30
                    }
                },
                LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB: {
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
                LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRoleDefaultPolicyADDA7DEB: {
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
                        PolicyName: 'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRoleDefaultPolicyADDA7DEB',
                        Roles: [
                            {
                                Ref: 'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB'
                            }
                        ]
                    }
                },
                LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aFD4BFC8A: {
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
                                'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB',
                                'Arn'
                            ]
                        }
                    },
                    DependsOn: [
                        'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRoleDefaultPolicyADDA7DEB',
                        'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB'
                    ]
                }
            }
        };
        templateHelper.template.templateMatches(expected);
    });

    it('should create the function with scheduled events', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const vpc = VpcHelper.getVpcById(stack, 'vpc123');
        const phpbrefFun = new PhpBrefFunction(stack, 'function', {vpc: vpc, secretKeys: [], environment: {}});
        phpbrefFun.create({
            appPath: path.join(__dirname, '..', '__codebase__'),
            brefRuntime: BrefRuntime.PHP81FPM,
            type: FunctionType.WEB,
            scheduledEvents: [
                {
                    schedule: 'rate(1 minute)',
                    eventInput: {cli: 'schedule:run'}
                }
            ]
        });
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        const expected = {
            Resources: {
                functionwebfn0ServiceRole21C72759: {
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
                            },
                            {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {Ref: 'AWS::Partition'},
                                        ':iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole'
                                    ]
                                ]
                            }
                        ]
                    }
                },
                functionwebfn0SecurityGroupCFD2651F: {
                    Type: 'AWS::EC2::SecurityGroup',
                    Properties: {
                        GroupDescription: 'Automatic security group for Lambda Function stackfunctionwebfn0A4DC51CC',
                        SecurityGroupEgress: [
                            {
                                CidrIp: '0.0.0.0/0',
                                Description: 'Allow all outbound traffic by default',
                                IpProtocol: '-1'
                            }
                        ],
                        VpcId: 'vpc-12345'
                    }
                },
                functionwebfn0DF20C809: {
                    Type: 'AWS::Lambda::Function',
                    Properties: {
                        Code: {
                            S3Bucket: 'cdk-hnb659fds-assets-12344-us-east-1',
                            S3Key: MatchHelper.endsWith('zip')
                        },
                        Role: {
                            'Fn::GetAtt': ['functionwebfn0ServiceRole21C72759', 'Arn']
                        },
                        FunctionName: 'function-web-fn-0',
                        Handler: 'public/index.php',
                        Layers: [
                            {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {Ref: 'AWS::Partition'},
                                        ':lambda:us-east-1:209497400698:layer:php-81-fpm:28'
                                    ]
                                ]
                            }
                        ],
                        MemorySize: 512,
                        Runtime: 'provided.al2',
                        Timeout: 28,
                        VpcConfig: {
                            SecurityGroupIds: [
                                {
                                    'Fn::GetAtt': ['functionwebfn0SecurityGroupCFD2651F', 'GroupId']
                                }
                            ],
                            SubnetIds: ['p-12345', 'p-67890']
                        }
                    },
                    DependsOn: ['functionwebfn0ServiceRole21C72759']
                },
                functionwebfn0LogRetention760A77D0: {
                    Type: 'Custom::LogRetention',
                    Properties: {
                        ServiceToken: {
                            'Fn::GetAtt': [
                                'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aFD4BFC8A',
                                'Arn'
                            ]
                        },
                        LogGroupName: {
                            'Fn::Join': [
                                '',
                                ['/aws/lambda/', {Ref: 'functionwebfn0DF20C809'}]
                            ]
                        },
                        RetentionInDays: 30
                    }
                },
                LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB: {
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
                LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRoleDefaultPolicyADDA7DEB: {
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
                        PolicyName: 'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRoleDefaultPolicyADDA7DEB',
                        Roles: [
                            {
                                Ref: 'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB'
                            }
                        ]
                    }
                },
                LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aFD4BFC8A: {
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
                                'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB',
                                'Arn'
                            ]
                        }
                    },
                    DependsOn: [
                        'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRoleDefaultPolicyADDA7DEB',
                        'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB'
                    ]
                },
                functionwebfn0scheduledevent0F79BB987: {
                    Type: 'AWS::Events::Rule',
                    Properties: {
                        Name: 'function-web-fn-0-scheduled-event-0',
                        ScheduleExpression: 'rate(1 minute)',
                        State: 'ENABLED',
                        Targets: [
                            {
                                Arn: {'Fn::GetAtt': ['functionwebfn0DF20C809', 'Arn']},
                                Id: 'Target0',
                                Input: '{"cli":"schedule:run"}'
                            }
                        ]
                    }
                },
                functionwebfn0scheduledevent0AllowEventRulestackfunctionwebfn0A4DC51CCA901EF07: {
                    Type: 'AWS::Lambda::Permission',
                    Properties: {
                        Action: 'lambda:InvokeFunction',
                        FunctionName: {'Fn::GetAtt': ['functionwebfn0DF20C809', 'Arn']},
                        Principal: 'events.amazonaws.com',
                        SourceArn: {
                            'Fn::GetAtt': ['functionwebfn0scheduledevent0F79BB987', 'Arn']
                        }
                    }
                }
            }
        };
        templateHelper.template.templateMatches(expected);
    });

    it('should create the default function with latest version', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const vpc = VpcHelper.getVpcById(stack, 'vpc123');
        const phpbrefFun = new PhpBrefFunction(stack, 'function', {vpc: vpc, secretKeys: [], environment: {}});
        phpbrefFun.create({
            appPath: path.join(__dirname, '..', '__codebase__'),
            brefRuntime: BrefRuntime.PHP81FPM,
            type: FunctionType.EVENT
        });
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        // templateHelper.inspect();
        const expected = {
            Resources: {
                functioneventfn0ServiceRole30E080B7: {
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
                            },
                            {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {Ref: 'AWS::Partition'},
                                        ':iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole'
                                    ]
                                ]
                            }
                        ]
                    }
                },
                functioneventfn0SecurityGroup03393729: {
                    Type: 'AWS::EC2::SecurityGroup',
                    Properties: {
                        GroupDescription: 'Automatic security group for Lambda Function stackfunctioneventfn0A614FAB1',
                        SecurityGroupEgress: [
                            {
                                CidrIp: '0.0.0.0/0',
                                Description: 'Allow all outbound traffic by default',
                                IpProtocol: '-1'
                            }
                        ],
                        VpcId: 'vpc-12345'
                    }
                },
                functioneventfn01CDA78AF: {
                    Type: 'AWS::Lambda::Function',
                    Properties: {
                        Code: {
                            S3Bucket: 'cdk-hnb659fds-assets-12344-us-east-1',
                            S3Key: MatchHelper.endsWith('zip')
                        },
                        Role: {
                            'Fn::GetAtt': ['functioneventfn0ServiceRole30E080B7', 'Arn']
                        },
                        FunctionName: 'function-event-fn-0',
                        Handler: 'artisan',
                        Layers: [
                            {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        {Ref: 'AWS::Partition'},
                                        ':lambda:us-east-1:209497400698:layer:php-81-fpm:28'
                                    ]
                                ]
                            }
                        ],
                        MemorySize: 512,
                        Runtime: 'provided.al2',
                        Timeout: 120,
                        VpcConfig: {
                            SecurityGroupIds: [
                                {
                                    'Fn::GetAtt': ['functioneventfn0SecurityGroup03393729', 'GroupId']
                                }
                            ],
                            SubnetIds: ['p-12345', 'p-67890']
                        }
                    },
                    DependsOn: ['functioneventfn0ServiceRole30E080B7']
                },
                functioneventfn0LogRetention13B86148: {
                    Type: 'Custom::LogRetention',
                    Properties: {
                        ServiceToken: {
                            'Fn::GetAtt': [
                                'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aFD4BFC8A',
                                'Arn'
                            ]
                        },
                        LogGroupName: {
                            'Fn::Join': [
                                '',
                                ['/aws/lambda/', {Ref: 'functioneventfn01CDA78AF'}]
                            ]
                        },
                        RetentionInDays: 30
                    }
                },
                LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB: {
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
                LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRoleDefaultPolicyADDA7DEB: {
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
                        PolicyName: 'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRoleDefaultPolicyADDA7DEB',
                        Roles: [
                            {
                                Ref: 'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB'
                            }
                        ]
                    }
                },
                LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aFD4BFC8A: {
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
                                'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB',
                                'Arn'
                            ]
                        }
                    },
                    DependsOn: [
                        'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRoleDefaultPolicyADDA7DEB',
                        'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB'
                    ]
                }
            }
        };
        templateHelper.template.templateMatches(expected);
    });

    it('should create multiple layers with latest version', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const vpc = VpcHelper.getVpcById(stack, 'vpc123');
        const phpbrefFun = new PhpBrefFunction(stack, 'function', {vpc: vpc, secretKeys: [], environment: {}});
        phpbrefFun.create({
            appPath: path.join(__dirname, '..', '__codebase__'),
            brefRuntime: [BrefRuntime.PHP81FPM, BrefRuntime.CONSOLE],
            type: FunctionType.EVENT
        });
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        // templateHelper.inspect();
        const expected = {
            Resources: {
                functioneventfn0ServiceRole30E080B7: {
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
                            },
                            {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        { Ref: 'AWS::Partition' },
                                        ':iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole'
                                    ]
                                ]
                            }
                        ]
                    }
                },
                functioneventfn0SecurityGroup03393729: {
                    Type: 'AWS::EC2::SecurityGroup',
                    Properties: {
                        GroupDescription: 'Automatic security group for Lambda Function stackfunctioneventfn0A614FAB1',
                        SecurityGroupEgress: [
                            {
                                CidrIp: '0.0.0.0/0',
                                Description: 'Allow all outbound traffic by default',
                                IpProtocol: '-1'
                            }
                        ],
                        VpcId: 'vpc-12345'
                    }
                },
                functioneventfn01CDA78AF: {
                    Type: 'AWS::Lambda::Function',
                    Properties: {
                        Code: {
                            S3Bucket: 'cdk-hnb659fds-assets-12344-us-east-1',
                            S3Key: MatchHelper.endsWith('zip')
                        },
                        Role: {
                            'Fn::GetAtt': [ 'functioneventfn0ServiceRole30E080B7', 'Arn' ]
                        },
                        FunctionName: 'function-event-fn-0',
                        Handler: 'artisan',
                        Layers: [
                            {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        { Ref: 'AWS::Partition' },
                                        ':lambda:us-east-1:209497400698:layer:php-81-fpm:28'
                                    ]
                                ]
                            },
                            {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        { Ref: 'AWS::Partition' },
                                        ':lambda:us-east-1:209497400698:layer:console:67'
                                    ]
                                ]
                            }
                        ],
                        MemorySize: 512,
                        Runtime: 'provided.al2',
                        Timeout: 120,
                        VpcConfig: {
                            SecurityGroupIds: [
                                {
                                    'Fn::GetAtt': [ 'functioneventfn0SecurityGroup03393729', 'GroupId' ]
                                }
                            ],
                            SubnetIds: [ 'p-12345', 'p-67890' ]
                        }
                    },
                    DependsOn: [ 'functioneventfn0ServiceRole30E080B7' ]
                },
                functioneventfn0LogRetention13B86148: {
                    Type: 'Custom::LogRetention',
                    Properties: {
                        ServiceToken: {
                            'Fn::GetAtt': [
                                'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aFD4BFC8A',
                                'Arn'
                            ]
                        },
                        LogGroupName: {
                            'Fn::Join': [
                                '',
                                [ '/aws/lambda/', { Ref: 'functioneventfn01CDA78AF' } ]
                            ]
                        },
                        RetentionInDays: 30
                    }
                },
                LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB: {
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
                LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRoleDefaultPolicyADDA7DEB: {
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
                        PolicyName: 'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRoleDefaultPolicyADDA7DEB',
                        Roles: [
                            {
                                Ref: 'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB'
                            }
                        ]
                    }
                },
                LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aFD4BFC8A: {
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
                                'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB',
                                'Arn'
                            ]
                        }
                    },
                    DependsOn: [
                        'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRoleDefaultPolicyADDA7DEB',
                        'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB'
                    ]
                }
            }
        };
        templateHelper.template.templateMatches(expected);
    });

    it('should create the function with auto scaling', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const vpc = VpcHelper.getVpcById(stack, 'vpc123');
        const phpbrefFun = new PhpBrefFunction(stack, 'function', {vpc: vpc, secretKeys: [], environment: {}});
        phpbrefFun.create({
            appPath: path.join(__dirname, '..', '__codebase__'),
            brefRuntime: BrefRuntime.PHP81FPM,
            type: FunctionType.WEB,
            provisionedConcurrency: {
                maxCapacity: 5,
                utilization: {}
            }
        });
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        // templateHelper.inspect();
        const expected = {
            Resources: {
                functionwebfn0ServiceRole21C72759: {
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
                            },
                            {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        { Ref: 'AWS::Partition' },
                                        ':iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole'
                                    ]
                                ]
                            }
                        ]
                    }
                },
                functionwebfn0SecurityGroupCFD2651F: {
                    Type: 'AWS::EC2::SecurityGroup',
                    Properties: {
                        GroupDescription: 'Automatic security group for Lambda Function stackfunctionwebfn0A4DC51CC',
                        SecurityGroupEgress: [
                            {
                                CidrIp: '0.0.0.0/0',
                                Description: 'Allow all outbound traffic by default',
                                IpProtocol: '-1'
                            }
                        ],
                        VpcId: 'vpc-12345'
                    }
                },
                functionwebfn0DF20C809: {
                    Type: 'AWS::Lambda::Function',
                    Properties: {
                        Code: {
                            S3Bucket: 'cdk-hnb659fds-assets-12344-us-east-1',
                            S3Key: MatchHelper.endsWith('zip')
                        },
                        Role: {
                            'Fn::GetAtt': [ 'functionwebfn0ServiceRole21C72759', 'Arn' ]
                        },
                        FunctionName: 'function-web-fn-0',
                        Handler: 'public/index.php',
                        Layers: [
                            {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        { Ref: 'AWS::Partition' },
                                        ':lambda:us-east-1:209497400698:layer:php-81-fpm:28'
                                    ]
                                ]
                            }
                        ],
                        MemorySize: 512,
                        Runtime: 'provided.al2',
                        Timeout: 28,
                        VpcConfig: {
                            SecurityGroupIds: [
                                {
                                    'Fn::GetAtt': [ 'functionwebfn0SecurityGroupCFD2651F', 'GroupId' ]
                                }
                            ],
                            SubnetIds: [ 'p-12345', 'p-67890' ]
                        }
                    },
                    DependsOn: [ 'functionwebfn0ServiceRole21C72759' ]
                },
                functionwebfn0LogRetention760A77D0: {
                    Type: 'Custom::LogRetention',
                    Properties: {
                        ServiceToken: {
                            'Fn::GetAtt': [
                                'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aFD4BFC8A',
                                'Arn'
                            ]
                        },
                        LogGroupName: {
                            'Fn::Join': [
                                '',
                                [ '/aws/lambda/', { Ref: 'functionwebfn0DF20C809' } ]
                            ]
                        },
                        RetentionInDays: 30
                    }
                },
                LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB: {
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
                LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRoleDefaultPolicyADDA7DEB: {
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
                        PolicyName: 'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRoleDefaultPolicyADDA7DEB',
                        Roles: [
                            {
                                Ref: 'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB'
                            }
                        ]
                    }
                },
                LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aFD4BFC8A: {
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
                                'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB',
                                'Arn'
                            ]
                        }
                    },
                    DependsOn: [
                        'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRoleDefaultPolicyADDA7DEB',
                        'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB'
                    ]
                },
                functionalias6A186DE0: {
                    Type: 'AWS::Lambda::Alias',
                    Properties: {
                        FunctionName: { Ref: 'functionwebfn0DF20C809' },
                        FunctionVersion: '$LATEST',
                        Name: 'current'
                    }
                },
                functionscalabletargetRole9FFA4E8C: {
                    Type: 'AWS::IAM::Role',
                    Properties: {
                        AssumeRolePolicyDocument: {
                            Statement: [
                                {
                                    Action: 'sts:AssumeRole',
                                    Effect: 'Allow',
                                    Principal: { Service: 'application-autoscaling.amazonaws.com' }
                                }
                            ],
                            Version: '2012-10-17'
                        }
                    }
                },
                functionscalabletarget047671AB: {
                    Type: 'AWS::ApplicationAutoScaling::ScalableTarget',
                    Properties: {
                        MaxCapacity: 5,
                        MinCapacity: 0,
                        ResourceId: {
                            'Fn::Join': [
                                '',
                                [
                                    'function:',
                                    { Ref: 'functionwebfn0DF20C809' },
                                    ':current'
                                ]
                            ]
                        },
                        RoleARN: {
                            'Fn::GetAtt': [ 'functionscalabletargetRole9FFA4E8C', 'Arn' ]
                        },
                        ScalableDimension: 'lambda:function:ProvisionedConcurrency',
                        ServiceNamespace: 'lambda'
                    }
                },
                functionscalabletargetpcuautoscale06758DB1: {
                    Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
                    Properties: {
                        PolicyName: 'stackfunctionscalabletargetpcuautoscale69752A33',
                        PolicyType: 'TargetTrackingScaling',
                        ScalingTargetId: { Ref: 'functionscalabletarget047671AB' },
                        TargetTrackingScalingPolicyConfiguration: {
                            PredefinedMetricSpecification: {
                                PredefinedMetricType: 'LambdaProvisionedConcurrencyUtilization'
                            },
                            TargetValue: 0.9
                        }
                    }
                }
            }
        };
        templateHelper.template.templateMatches(expected);
    });
});