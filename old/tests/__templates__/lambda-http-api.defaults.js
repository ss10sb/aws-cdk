const {MatchHelper} = require("../../../src/utils/testing/match-helper");
module.exports = {
    Resources: {
        functioneventfn0lgD47CFCEB: {
            Type: 'AWS::Logs::LogGroup',
            Properties: { RetentionInDays: 30 },
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
        functioneventfn01CDA78AF: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-12344-us-east-1',
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
                                { Ref: 'AWS::Partition' },
                                ':lambda:us-east-1:534081306603:layer:php-81-fpm:59'
                            ]
                        ]
                    }
                ],
                LoggingConfig: { LogGroup: { Ref: 'functioneventfn0lgD47CFCEB' } },
                MemorySize: 512,
                Role: {
                    'Fn::GetAtt': [ 'functioneventfn0ServiceRole30E080B7', 'Arn' ]
                },
                Runtime: 'provided.al2',
                Timeout: 120
            },
            DependsOn: [ 'functioneventfn0ServiceRole30E080B7' ]
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
                ApiId: { Ref: 'httpapihttpapi5E89BCFA' },
                IntegrationType: 'AWS_PROXY',
                IntegrationUri: { 'Fn::GetAtt': [ 'functioneventfn01CDA78AF', 'Arn' ] },
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
                FunctionName: { 'Fn::GetAtt': [ 'functioneventfn01CDA78AF', 'Arn' ] },
                Principal: 'apigateway.amazonaws.com',
                SourceArn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            { Ref: 'AWS::Partition' },
                            ':execute-api:us-east-1:12344:',
                            { Ref: 'httpapihttpapi5E89BCFA' },
                            '/*/*'
                        ]
                    ]
                }
            }
        },
        httpapihttpapiDefaultRouteBFDE9743: {
            Type: 'AWS::ApiGatewayV2::Route',
            Properties: {
                ApiId: { Ref: 'httpapihttpapi5E89BCFA' },
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
                ApiId: { Ref: 'httpapihttpapi5E89BCFA' },
                AutoDeploy: true,
                StageName: '$default'
            }
        }
    }
}