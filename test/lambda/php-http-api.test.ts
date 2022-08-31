import {App, Stack} from "aws-cdk-lib";
import {Match, Template} from "aws-cdk-lib/assertions";
import path from "path";
import {PhpHttpApi} from "../../src/lambda/php-http-api";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {PhpBrefFunction} from "../../src/lambda/php-bref-function";
import {BrefRuntime} from "../../src/lambda/bref-definitions";

describe('php http api create', () => {

    it('should create the default http api endpoint', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const phpbrefFun = new PhpBrefFunction(stack, 'function', {environment: {}, secretKeys: []});
        const func = phpbrefFun.create('f1', {
            appPath: path.join(__dirname, '..', '__codebase__'),
            brefRuntime: BrefRuntime.PHP81FPM
        });
        const phpHttpApi = new PhpHttpApi(stack, 'http-api');
        phpHttpApi.create({lambdaFunction: func});
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        //templateHelper.inspect();
        templateHelper.expected('AWS::ApiGatewayV2::Api', [
            {
                key: 'httpapidefault',
                properties: Match.objectEquals({
                    Type: 'AWS::ApiGatewayV2::Api',
                    Properties: {
                        DisableExecuteApiEndpoint: true,
                        Name: 'http-api-default',
                        ProtocolType: 'HTTP'
                    }
                })
            }
        ]);
        templateHelper.expected('AWS::ApiGatewayV2::Integration', [
            {
                key: 'httpapidefaultDefaultRoutehttpapidefaultint',
                properties: Match.objectEquals({
                    Type: 'AWS::ApiGatewayV2::Integration',
                    Properties: {
                        ApiId: {Ref: templateHelper.startsWithMatch('httpapidefault')},
                        IntegrationType: 'AWS_PROXY',
                        IntegrationUri: {'Fn::GetAtt': [templateHelper.startsWithMatch('functionf1'), 'Arn']},
                        PayloadFormatVersion: '2.0'
                    }
                })
            }
        ]);
        templateHelper.expected('AWS::Lambda::Permission', [
            {
                key: 'httpapidefaultDefaultRoutehttpapidefaultintPermission',
                properties: Match.objectEquals({
                    Type: 'AWS::Lambda::Permission',
                    Properties: {
                        Action: 'lambda:InvokeFunction',
                        FunctionName: {'Fn::GetAtt': [templateHelper.startsWithMatch('functionf1'), 'Arn']},
                        Principal: 'apigateway.amazonaws.com',
                        SourceArn: {
                            'Fn::Join': [
                                '',
                                [
                                    'arn:',
                                    {Ref: 'AWS::Partition'},
                                    ':execute-api:us-east-1:12344:',
                                    {Ref: templateHelper.startsWithMatch('httpapidefault')},
                                    '/*/*'
                                ]
                            ]
                        }
                    }
                })
            }
        ]);
        templateHelper.expected('AWS::ApiGatewayV2::Route', [
            {
                key: 'httpapidefaultDefaultRoute',
                properties: Match.objectEquals({
                    Type: 'AWS::ApiGatewayV2::Route',
                    Properties: {
                        ApiId: {Ref: templateHelper.startsWithMatch('httpapidefault')},
                        RouteKey: '$default',
                        AuthorizationType: 'NONE',
                        Target: {
                            'Fn::Join': [
                                '',
                                [
                                    'integrations/',
                                    {
                                        Ref: templateHelper.startsWithMatch('httpapidefaultDefaultRoutehttpapidefaultint')
                                    }
                                ]
                            ]
                        }
                    }
                })
            }
        ]);
        templateHelper.expected('AWS::ApiGatewayV2::Stage', [
            {
                key: 'httpapidefaultDefaultStage',
                properties: Match.objectEquals({
                    Type: 'AWS::ApiGatewayV2::Stage',
                    Properties: {
                        ApiId: {Ref: templateHelper.startsWithMatch('httpapidefault')},
                        StageName: '$default',
                        AutoDeploy: true
                    }
                })
            }
        ]);
    });

    it('should create http api endpoint that can log', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const phpbrefFun = new PhpBrefFunction(stack, 'function', {environment: {}, secretKeys: []});
        const func = phpbrefFun.create('f1', {
            appPath: path.join(__dirname, '..', '__codebase__'),
            brefRuntime: BrefRuntime.PHP81FPM
        });
        const phpHttpApi = new PhpHttpApi(stack, 'http-api');
        phpHttpApi.create({lambdaFunction: func, logProps: {}});
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        // templateHelper.inspect();
        const expected = {
            Resources: {
                functionf1fn0ServiceRole4BCEC8F9: {
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
                functionf1fn040096078: {
                    Type: 'AWS::Lambda::Function',
                    Properties: {
                        Code: {
                            S3Bucket: 'cdk-hnb659fds-assets-12344-us-east-1',
                            S3Key: 'ce9adb4fda6fdc569b2bd894a02aa2f273695def9558c5ad237cedf56562f55e.zip'
                        },
                        Role: {
                            'Fn::GetAtt': ['functionf1fn0ServiceRole4BCEC8F9', 'Arn']
                        },
                        FunctionName: 'function-f1-fn-0',
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
                        Runtime: 'provided.al2',
                        Timeout: 120
                    },
                    DependsOn: ['functionf1fn0ServiceRole4BCEC8F9']
                },
                functionf1fn0LogRetentionC0108424: {
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
                                ['/aws/lambda/', {Ref: 'functionf1fn040096078'}]
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
                        Runtime: 'nodejs14.x',
                        Code: {
                            S3Bucket: 'cdk-hnb659fds-assets-12344-us-east-1',
                            S3Key: 'eb5b005c858404ea0c8f68098ed5dcdf5340e02461f149751d10f59c210d5ef8.zip'
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
                httpapidefault82B88600: {
                    Type: 'AWS::ApiGatewayV2::Api',
                    Properties: {
                        DisableExecuteApiEndpoint: false,
                        Name: 'http-api-default',
                        ProtocolType: 'HTTP'
                    }
                },
                httpapidefaultDefaultRoutehttpapidefaultint45B9E6A0: {
                    Type: 'AWS::ApiGatewayV2::Integration',
                    Properties: {
                        ApiId: {Ref: 'httpapidefault82B88600'},
                        IntegrationType: 'AWS_PROXY',
                        IntegrationUri: {'Fn::GetAtt': ['functionf1fn040096078', 'Arn']},
                        PayloadFormatVersion: '2.0'
                    }
                },
                httpapidefaultDefaultRoutehttpapidefaultintPermissionDA9959D5: {
                    Type: 'AWS::Lambda::Permission',
                    Properties: {
                        Action: 'lambda:InvokeFunction',
                        FunctionName: {'Fn::GetAtt': ['functionf1fn040096078', 'Arn']},
                        Principal: 'apigateway.amazonaws.com',
                        SourceArn: {
                            'Fn::Join': [
                                '',
                                [
                                    'arn:',
                                    {Ref: 'AWS::Partition'},
                                    ':execute-api:us-east-1:12344:',
                                    {Ref: 'httpapidefault82B88600'},
                                    '/*/*'
                                ]
                            ]
                        }
                    }
                },
                httpapidefaultDefaultRouteF470BAE3: {
                    Type: 'AWS::ApiGatewayV2::Route',
                    Properties: {
                        ApiId: {Ref: 'httpapidefault82B88600'},
                        RouteKey: '$default',
                        AuthorizationType: 'NONE',
                        Target: {
                            'Fn::Join': [
                                '',
                                [
                                    'integrations/',
                                    {
                                        Ref: 'httpapidefaultDefaultRoutehttpapidefaultint45B9E6A0'
                                    }
                                ]
                            ]
                        }
                    }
                },
                httpapidefaultDefaultStage5BE3BAB2: {
                    Type: 'AWS::ApiGatewayV2::Stage',
                    Properties: {
                        ApiId: {Ref: 'httpapidefault82B88600'},
                        StageName: '$default',
                        AccessLogSettings: {
                            DestinationArn: {'Fn::GetAtt': ['httpapilg8DEB7745', 'Arn']},
                            Format: '$context.identity.sourceIp - - [$context.requestTime] "$context.httpMethod $context.routeKey $context.protocol" $context.status $context.responseLength $context.requestId'
                        },
                        AutoDeploy: true
                    }
                },
                httpapilg8DEB7745: {
                    Type: 'AWS::Logs::LogGroup',
                    Properties: {LogGroupName: 'http-api-lg', RetentionInDays: 7},
                    UpdateReplacePolicy: 'Delete',
                    DeletionPolicy: 'Delete'
                },
                httpapilgrole6989B7DF: {
                    Type: 'AWS::IAM::Role',
                    Properties: {
                        AssumeRolePolicyDocument: {
                            Statement: [
                                {
                                    Action: 'sts:AssumeRole',
                                    Effect: 'Allow',
                                    Principal: {Service: 'apigateway.amazonaws.com'}
                                }
                            ],
                            Version: '2012-10-17'
                        }
                    }
                },
                httpapilgroleDefaultPolicyF92B05F4: {
                    Type: 'AWS::IAM::Policy',
                    Properties: {
                        PolicyDocument: {
                            Statement: [
                                {
                                    Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
                                    Effect: 'Allow',
                                    Resource: {'Fn::GetAtt': ['httpapilg8DEB7745', 'Arn']}
                                }
                            ],
                            Version: '2012-10-17'
                        },
                        PolicyName: 'httpapilgroleDefaultPolicyF92B05F4',
                        Roles: [{Ref: 'httpapilgrole6989B7DF'}]
                    }
                }
            }
        };
        templateHelper.template.templateMatches(expected);
    });
});