import {App, Stack} from "aws-cdk-lib";
import {HttpFromHttpApi} from "../../src/cloudfront/http-from-http-api";
import {PhpBrefFunction} from "../../src/lambda/php-bref-function";
import path from "path";
import {BrefRuntime} from "../../src/lambda/bref-definitions";
import {PhpHttpApi} from "../../src/lambda/php-http-api";
import {Template} from "aws-cdk-lib/assertions";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {HttpApi} from "aws-cdk-lib/aws-apigatewayv2";
import {MatchHelper} from "../../src/utils/testing/match-helper";

describe('http from http api', () => {
    it('should create http origin from defaults', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-west-2', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const phpbrefFun = new PhpBrefFunction(stack, 'function', {environment: {}, secretKeys: []});
        const func = phpbrefFun.create({
            appPath: path.join(__dirname, '..', '__codebase__'),
            brefRuntime: BrefRuntime.PHP81FPM
        });
        const phpHttpApi = new PhpHttpApi(stack, 'http-api');
        const httpApi = phpHttpApi.create({lambdaFunction: func, logProps: {}});
        const fromHttpApi = new HttpFromHttpApi(stack, 'origin');
        fromHttpApi.create(<HttpApi>httpApi.api);
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        // templateHelper.inspect();
        const expected = {
            Resources: {
                functioneventfn0lgD47CFCEB: {
                    Type: 'AWS::Logs::LogGroup',
                    Properties: {RetentionInDays: 30},
                    UpdateReplacePolicy: 'Delete',
                    DeletionPolicy: 'Delete'
                },
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
                            }
                        ]
                    }
                },
                functioneventfn01CDA78AF: {
                    Type: 'AWS::Lambda::Function',
                    Properties: {
                        Code: {
                            S3Bucket: 'cdk-hnb659fds-assets-12344-us-west-2',
                            S3Key: MatchHelper.endsWith('zip')
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
                                        ':lambda:us-west-2:534081306603:layer:php-81-fpm:59'
                                    ]
                                ]
                            }
                        ],
                        LoggingConfig: {LogGroup: {Ref: 'functioneventfn0lgD47CFCEB'}},
                        MemorySize: 512,
                        Role: {
                            'Fn::GetAtt': ['functioneventfn0ServiceRole30E080B7', 'Arn']
                        },
                        Runtime: 'provided.al2',
                        Timeout: 120
                    },
                    DependsOn: ['functioneventfn0ServiceRole30E080B7']
                },
                httpapihttpapi5E89BCFA: {
                    Type: 'AWS::ApiGatewayV2::Api',
                    Properties: {
                        DisableExecuteApiEndpoint: false,
                        Name: 'http-api-http-api',
                        ProtocolType: 'HTTP'
                    }
                },
                httpapihttpapiDefaultRoutehttpapihttpapiint560D1C07: {
                    Type: 'AWS::ApiGatewayV2::Integration',
                    Properties: {
                        ApiId: {Ref: 'httpapihttpapi5E89BCFA'},
                        IntegrationType: 'AWS_PROXY',
                        IntegrationUri: {'Fn::GetAtt': ['functioneventfn01CDA78AF', 'Arn']},
                        PayloadFormatVersion: '2.0',
                        RequestParameters: {
                            'append:header.x-cf-source-ip': '$request.header.x-cf-source-ip'
                        }
                    }
                },
                httpapihttpapiDefaultRoutehttpapihttpapiintPermission5B4ABB59: {
                    Type: 'AWS::Lambda::Permission',
                    Properties: {
                        Action: 'lambda:InvokeFunction',
                        FunctionName: {'Fn::GetAtt': ['functioneventfn01CDA78AF', 'Arn']},
                        Principal: 'apigateway.amazonaws.com',
                        SourceArn: {
                            'Fn::Join': [
                                '',
                                [
                                    'arn:',
                                    {Ref: 'AWS::Partition'},
                                    ':execute-api:us-west-2:12344:',
                                    {Ref: 'httpapihttpapi5E89BCFA'},
                                    '/*/*'
                                ]
                            ]
                        }
                    }
                },
                httpapihttpapiDefaultRouteBFDE9743: {
                    Type: 'AWS::ApiGatewayV2::Route',
                    Properties: {
                        ApiId: {Ref: 'httpapihttpapi5E89BCFA'},
                        AuthorizationType: 'NONE',
                        RouteKey: '$default',
                        Target: {
                            'Fn::Join': [
                                '',
                                [
                                    'integrations/',
                                    {
                                        Ref: 'httpapihttpapiDefaultRoutehttpapihttpapiint560D1C07'
                                    }
                                ]
                            ]
                        }
                    }
                },
                httpapihttpapiDefaultStage2FC5FDEF: {
                    Type: 'AWS::ApiGatewayV2::Stage',
                    Properties: {
                        AccessLogSettings: {
                            DestinationArn: {
                                'Fn::GetAtt': ['httpapihttpapihttpapilg4B355C71', 'Arn']
                            },
                            Format: '{"requestTime":"$context.requestTime","requestId":"$context.requestId","httpMethod":"$context.httpMethod","path":"$context.path","resourcePath":"$context.resourcePath","status":$context.status,"responseLatency":$context.responseLatency,"integrationRequestId":"$context.integration.requestId","functionResponseStatus":"$context.integration.status","integrationLatency":"$context.integration.latency","integrationServiceStatus":"$context.integration.integrationStatus","integrationErrorMessage":"$context.integrationErrorMessage","authorizerStatus":"$context.authorizer.status","authorizerLatency":"$context.authorizer.latency","authorizerRequestId":"$context.authorizer.requestId","authorizerError":"$context.authorizer.error","ip":"$context.identity.sourceIp","userAgent":"$context.identity.userAgent","principalId":"$context.authorizer.principalId"}'
                        },
                        ApiId: {Ref: 'httpapihttpapi5E89BCFA'},
                        AutoDeploy: true,
                        StageName: '$default'
                    }
                },
                httpapihttpapihttpapilg4B355C71: {
                    Type: 'AWS::Logs::LogGroup',
                    Properties: {
                        LogGroupName: 'http-api-http-api-http-api-lg',
                        RetentionInDays: 7
                    },
                    UpdateReplacePolicy: 'Delete',
                    DeletionPolicy: 'Delete'
                }
            }
        };
        templateHelper.template.templateMatches(expected);
    });
});