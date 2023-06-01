import {App, Stack} from "aws-cdk-lib";
import {PhpBrefFunction} from "../../src/lambda/php-bref-function";
import path from "path";
import {BrefRuntime} from "../../src/lambda/bref-definitions";
import {PhpLambdaRestApi} from "../../src/lambda/php-lambda-rest-api";
import {Template} from "aws-cdk-lib/assertions";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {AcmCertificate} from "../../src/acm/acm-certificate";
import {MatchHelper} from "../../src/utils/testing/match-helper";

describe('php lambda rest api', () => {

    it('should create default rest api', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const phpbrefFun = new PhpBrefFunction(stack, 'function', {environment: {}, secretKeys: []});
        const func = phpbrefFun.create({
            appPath: path.join(__dirname, '..', '__codebase__'),
            brefRuntime: BrefRuntime.PHP81FPM
        });
        const restApi = new PhpLambdaRestApi(stack,  'lambda-rest-api');
        const cert = new AcmCertificate(stack, 'cert');
        const certificate = cert.create({
            domainName: 'test.foo.edu',
            hostedZone: 'foo.edu',
        });
        restApi.create({
            lambdaFunction: func,
            authorizerProps: {token: 'abc123'},
            domainNameOptions: {
                domainName: 'test.foo.edu',
                certificate: certificate
            }
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
                            }
                        ],
                        MemorySize: 512,
                        Runtime: 'provided.al2',
                        Timeout: 120
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
                },
                certtestfooeduD0B35127: {
                    Type: 'AWS::CertificateManager::Certificate',
                    Properties: {
                        DomainName: 'test.foo.edu',
                        DomainValidationOptions: [ { DomainName: 'test.foo.edu', HostedZoneId: 'DUMMY' } ],
                        Tags: [ { Key: 'Name', Value: 'stack/cert-test.foo.edu' } ],
                        ValidationMethod: 'DNS'
                    },
                    UpdateReplacePolicy: 'Delete',
                    DeletionPolicy: 'Delete'
                },
                lambdarestapiauthorizerfnServiceRoleD60184C8: {
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
                lambdarestapiauthorizerfn50A4BE92: {
                    Type: 'AWS::Lambda::Function',
                    Properties: {
                        Code: {
                            S3Bucket: 'cdk-hnb659fds-assets-12344-us-east-1',
                            S3Key: MatchHelper.endsWith('zip')
                        },
                        Role: {
                            'Fn::GetAtt': [ 'lambdarestapiauthorizerfnServiceRoleD60184C8', 'Arn' ]
                        },
                        Environment: { Variables: { AUTHORIZER_TOKEN: 'abc123' } },
                        FunctionName: 'lambda-rest-api-authorizer-fn',
                        Handler: 'token.handler',
                        Runtime: MatchHelper.startsWith('nodejs'),
                        Timeout: 5
                    },
                    DependsOn: [ 'lambdarestapiauthorizerfnServiceRoleD60184C8' ]
                },
                lambdarestapiauthorizerfnLogRetention8E238AF5: {
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
                                [
                                    '/aws/lambda/',
                                    { Ref: 'lambdarestapiauthorizerfn50A4BE92' }
                                ]
                            ]
                        },
                        RetentionInDays: 7
                    }
                },
                lambdarestapirestapiB0B38C03: {
                    Type: 'AWS::ApiGateway::RestApi',
                    Properties: {
                        DisableExecuteApiEndpoint: false,
                        EndpointConfiguration: { Types: [ 'REGIONAL' ] },
                        Name: 'lambda-rest-api-rest-api'
                    }
                },
                lambdarestapirestapiCloudWatchRole49104EB8: {
                    Type: 'AWS::IAM::Role',
                    Properties: {
                        AssumeRolePolicyDocument: {
                            Statement: [
                                {
                                    Action: 'sts:AssumeRole',
                                    Effect: 'Allow',
                                    Principal: { Service: 'apigateway.amazonaws.com' }
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
                                        ':iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs'
                                    ]
                                ]
                            }
                        ]
                    },
                    UpdateReplacePolicy: 'Retain',
                    DeletionPolicy: 'Retain'
                },
                lambdarestapirestapiAccount1C40998B: {
                    Type: 'AWS::ApiGateway::Account',
                    Properties: {
                        CloudWatchRoleArn: {
                            'Fn::GetAtt': [ 'lambdarestapirestapiCloudWatchRole49104EB8', 'Arn' ]
                        }
                    },
                    DependsOn: [ 'lambdarestapirestapiB0B38C03' ],
                    UpdateReplacePolicy: 'Retain',
                    DeletionPolicy: 'Retain'
                },
                lambdarestapirestapiDeploymentC05A0C9B06fbb04964e28293022f5b2844c95a88: {
                    Type: 'AWS::ApiGateway::Deployment',
                    Properties: {
                        RestApiId: { Ref: 'lambdarestapirestapiB0B38C03' },
                        Description: 'Automatically created by the RestApi construct'
                    },
                    DependsOn: [
                        'lambdarestapirestapiproxyANYE4AA6D7A',
                        'lambdarestapirestapiproxy4B137EDE',
                        'lambdarestapirestapiANY2C46F550'
                    ]
                },
                lambdarestapirestapiDeploymentStageprod8A2EE98F: {
                    Type: 'AWS::ApiGateway::Stage',
                    Properties: {
                        RestApiId: { Ref: 'lambdarestapirestapiB0B38C03' },
                        DeploymentId: {
                            Ref: 'lambdarestapirestapiDeploymentC05A0C9B06fbb04964e28293022f5b2844c95a88'
                        },
                        StageName: 'prod'
                    },
                    DependsOn: [ 'lambdarestapirestapiAccount1C40998B' ]
                },
                lambdarestapirestapiCustomDomainCF580E1E: {
                    Type: 'AWS::ApiGateway::DomainName',
                    Properties: {
                        DomainName: 'test.foo.edu',
                        EndpointConfiguration: { Types: [ 'REGIONAL' ] },
                        RegionalCertificateArn: { Ref: 'certtestfooeduD0B35127' }
                    }
                },
                lambdarestapirestapiCustomDomainMapstacklambdarestapirestapi0757661F11D53B0D: {
                    Type: 'AWS::ApiGateway::BasePathMapping',
                    Properties: {
                        DomainName: { Ref: 'lambdarestapirestapiCustomDomainCF580E1E' },
                        RestApiId: { Ref: 'lambdarestapirestapiB0B38C03' },
                        Stage: { Ref: 'lambdarestapirestapiDeploymentStageprod8A2EE98F' }
                    }
                },
                lambdarestapirestapiproxy4B137EDE: {
                    Type: 'AWS::ApiGateway::Resource',
                    Properties: {
                        ParentId: {
                            'Fn::GetAtt': [ 'lambdarestapirestapiB0B38C03', 'RootResourceId' ]
                        },
                        PathPart: '{proxy+}',
                        RestApiId: { Ref: 'lambdarestapirestapiB0B38C03' }
                    }
                },
                lambdarestapirestapiproxyANYApiPermissionstacklambdarestapirestapi0757661FANYproxy67605D5A: {
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
                                    { Ref: 'lambdarestapirestapiB0B38C03' },
                                    '/',
                                    {
                                        Ref: 'lambdarestapirestapiDeploymentStageprod8A2EE98F'
                                    },
                                    '/*/*'
                                ]
                            ]
                        }
                    }
                },
                lambdarestapirestapiproxyANYApiPermissionTeststacklambdarestapirestapi0757661FANYproxy8B5A9AD0: {
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
                                    { Ref: 'lambdarestapirestapiB0B38C03' },
                                    '/test-invoke-stage/*/*'
                                ]
                            ]
                        }
                    }
                },
                lambdarestapirestapiproxyANYE4AA6D7A: {
                    Type: 'AWS::ApiGateway::Method',
                    Properties: {
                        HttpMethod: 'ANY',
                        ResourceId: { Ref: 'lambdarestapirestapiproxy4B137EDE' },
                        RestApiId: { Ref: 'lambdarestapirestapiB0B38C03' },
                        AuthorizationType: 'CUSTOM',
                        Integration: {
                            IntegrationHttpMethod: 'POST',
                            Type: 'AWS_PROXY',
                            Uri: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        { Ref: 'AWS::Partition' },
                                        ':apigateway:us-east-1:lambda:path/2015-03-31/functions/',
                                        {
                                            'Fn::GetAtt': [ 'functioneventfn01CDA78AF', 'Arn' ]
                                        },
                                        '/invocations'
                                    ]
                                ]
                            }
                        }
                    }
                },
                lambdarestapirestapiANYApiPermissionstacklambdarestapirestapi0757661FANY583C3E4E: {
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
                                    { Ref: 'lambdarestapirestapiB0B38C03' },
                                    '/',
                                    {
                                        Ref: 'lambdarestapirestapiDeploymentStageprod8A2EE98F'
                                    },
                                    '/*/'
                                ]
                            ]
                        }
                    }
                },
                lambdarestapirestapiANYApiPermissionTeststacklambdarestapirestapi0757661FANY42E1BF66: {
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
                                    { Ref: 'lambdarestapirestapiB0B38C03' },
                                    '/test-invoke-stage/*/'
                                ]
                            ]
                        }
                    }
                },
                lambdarestapirestapiANY2C46F550: {
                    Type: 'AWS::ApiGateway::Method',
                    Properties: {
                        HttpMethod: 'ANY',
                        ResourceId: {
                            'Fn::GetAtt': [ 'lambdarestapirestapiB0B38C03', 'RootResourceId' ]
                        },
                        RestApiId: { Ref: 'lambdarestapirestapiB0B38C03' },
                        AuthorizationType: 'CUSTOM',
                        Integration: {
                            IntegrationHttpMethod: 'POST',
                            Type: 'AWS_PROXY',
                            Uri: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        { Ref: 'AWS::Partition' },
                                        ':apigateway:us-east-1:lambda:path/2015-03-31/functions/',
                                        {
                                            'Fn::GetAtt': [ 'functioneventfn01CDA78AF', 'Arn' ]
                                        },
                                        '/invocations'
                                    ]
                                ]
                            }
                        }
                    }
                }
            },
            Outputs: {
                lambdarestapirestapiEndpointF8394473: {
                    Value: {
                        'Fn::Join': [
                            '',
                            [
                                'https://',
                                { Ref: 'lambdarestapirestapiB0B38C03' },
                                '.execute-api.us-east-1.',
                                { Ref: 'AWS::URLSuffix' },
                                '/',
                                {
                                    Ref: 'lambdarestapirestapiDeploymentStageprod8A2EE98F'
                                },
                                '/'
                            ]
                        ]
                    }
                }
            }
        };
        templateHelper.template.templateMatches(expected);
    });

    it('should create default rest api with logging', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const phpbrefFun = new PhpBrefFunction(stack, 'function', {environment: {}, secretKeys: []});
        const func = phpbrefFun.create({
            appPath: path.join(__dirname, '..', '__codebase__'),
            brefRuntime: BrefRuntime.PHP81FPM
        });
        const restApi = new PhpLambdaRestApi(stack,  'lambda-rest-api');
        restApi.create({
            lambdaFunction: func,
            logProps: {}
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
                            }
                        ],
                        MemorySize: 512,
                        Runtime: 'provided.al2',
                        Timeout: 120
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
                },
                lambdarestapirestapilg69A6E551: {
                    Type: 'AWS::Logs::LogGroup',
                    Properties: {
                        LogGroupName: 'lambda-rest-api-rest-api-lg',
                        RetentionInDays: 7
                    },
                    UpdateReplacePolicy: 'Delete',
                    DeletionPolicy: 'Delete'
                },
                lambdarestapirestapiB0B38C03: {
                    Type: 'AWS::ApiGateway::RestApi',
                    Properties: {
                        DisableExecuteApiEndpoint: false,
                        EndpointConfiguration: { Types: [ 'REGIONAL' ] },
                        Name: 'lambda-rest-api-rest-api'
                    }
                },
                lambdarestapirestapiCloudWatchRole49104EB8: {
                    Type: 'AWS::IAM::Role',
                    Properties: {
                        AssumeRolePolicyDocument: {
                            Statement: [
                                {
                                    Action: 'sts:AssumeRole',
                                    Effect: 'Allow',
                                    Principal: { Service: 'apigateway.amazonaws.com' }
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
                                        ':iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs'
                                    ]
                                ]
                            }
                        ]
                    },
                    UpdateReplacePolicy: 'Retain',
                    DeletionPolicy: 'Retain'
                },
                lambdarestapirestapiAccount1C40998B: {
                    Type: 'AWS::ApiGateway::Account',
                    Properties: {
                        CloudWatchRoleArn: {
                            'Fn::GetAtt': [ 'lambdarestapirestapiCloudWatchRole49104EB8', 'Arn' ]
                        }
                    },
                    DependsOn: [ 'lambdarestapirestapiB0B38C03' ],
                    UpdateReplacePolicy: 'Retain',
                    DeletionPolicy: 'Retain'
                },
                lambdarestapirestapiDeploymentC05A0C9Bd178ce410ac793653114173b50e3496b: {
                    Type: 'AWS::ApiGateway::Deployment',
                    Properties: {
                        RestApiId: { Ref: 'lambdarestapirestapiB0B38C03' },
                        Description: 'Automatically created by the RestApi construct'
                    },
                    DependsOn: [
                        'lambdarestapirestapiproxyANYE4AA6D7A',
                        'lambdarestapirestapiproxy4B137EDE',
                        'lambdarestapirestapiANY2C46F550'
                    ]
                },
                lambdarestapirestapiDeploymentStageprod8A2EE98F: {
                    Type: 'AWS::ApiGateway::Stage',
                    Properties: {
                        RestApiId: { Ref: 'lambdarestapirestapiB0B38C03' },
                        AccessLogSetting: {
                            DestinationArn: {
                                'Fn::GetAtt': [ 'lambdarestapirestapilg69A6E551', 'Arn' ]
                            },
                            Format: '{"requestTime":"$context.requestTime","requestId":"$context.requestId","httpMethod":"$context.httpMethod","path":"$context.path","resourcePath":"$context.resourcePath","status":$context.status,"responseLatency":$context.responseLatency,"xrayTraceId":"$context.xrayTraceId","integrationRequestId":"$context.integration.requestId","functionResponseStatus":"$context.integration.status","integrationLatency":"$context.integration.latency","integrationServiceStatus":"$context.integration.integrationStatus","authorizeStatus":"$context.authorize.status","authorizerStatus":"$context.authorizer.status","authorizerLatency":"$context.authorizer.latency","authorizerRequestId":"$context.authorizer.requestId","ip":"$context.identity.sourceIp","userAgent":"$context.identity.userAgent","principalId":"$context.authorizer.principalId"}'
                        },
                        DeploymentId: {
                            Ref: 'lambdarestapirestapiDeploymentC05A0C9Bd178ce410ac793653114173b50e3496b'
                        },
                        MethodSettings: [
                            {
                                DataTraceEnabled: true,
                                HttpMethod: '*',
                                LoggingLevel: 'INFO',
                                MetricsEnabled: true,
                                ResourcePath: '/*'
                            }
                        ],
                        StageName: 'prod'
                    },
                    DependsOn: [ 'lambdarestapirestapiAccount1C40998B' ]
                },
                lambdarestapirestapiproxy4B137EDE: {
                    Type: 'AWS::ApiGateway::Resource',
                    Properties: {
                        ParentId: {
                            'Fn::GetAtt': [ 'lambdarestapirestapiB0B38C03', 'RootResourceId' ]
                        },
                        PathPart: '{proxy+}',
                        RestApiId: { Ref: 'lambdarestapirestapiB0B38C03' }
                    }
                },
                lambdarestapirestapiproxyANYApiPermissionstacklambdarestapirestapi0757661FANYproxy67605D5A: {
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
                                    { Ref: 'lambdarestapirestapiB0B38C03' },
                                    '/',
                                    {
                                        Ref: 'lambdarestapirestapiDeploymentStageprod8A2EE98F'
                                    },
                                    '/*/*'
                                ]
                            ]
                        }
                    }
                },
                lambdarestapirestapiproxyANYApiPermissionTeststacklambdarestapirestapi0757661FANYproxy8B5A9AD0: {
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
                                    { Ref: 'lambdarestapirestapiB0B38C03' },
                                    '/test-invoke-stage/*/*'
                                ]
                            ]
                        }
                    }
                },
                lambdarestapirestapiproxyANYE4AA6D7A: {
                    Type: 'AWS::ApiGateway::Method',
                    Properties: {
                        HttpMethod: 'ANY',
                        ResourceId: { Ref: 'lambdarestapirestapiproxy4B137EDE' },
                        RestApiId: { Ref: 'lambdarestapirestapiB0B38C03' },
                        AuthorizationType: 'NONE',
                        Integration: {
                            IntegrationHttpMethod: 'POST',
                            Type: 'AWS_PROXY',
                            Uri: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        { Ref: 'AWS::Partition' },
                                        ':apigateway:us-east-1:lambda:path/2015-03-31/functions/',
                                        {
                                            'Fn::GetAtt': [ 'functioneventfn01CDA78AF', 'Arn' ]
                                        },
                                        '/invocations'
                                    ]
                                ]
                            }
                        }
                    }
                },
                lambdarestapirestapiANYApiPermissionstacklambdarestapirestapi0757661FANY583C3E4E: {
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
                                    { Ref: 'lambdarestapirestapiB0B38C03' },
                                    '/',
                                    {
                                        Ref: 'lambdarestapirestapiDeploymentStageprod8A2EE98F'
                                    },
                                    '/*/'
                                ]
                            ]
                        }
                    }
                },
                lambdarestapirestapiANYApiPermissionTeststacklambdarestapirestapi0757661FANY42E1BF66: {
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
                                    { Ref: 'lambdarestapirestapiB0B38C03' },
                                    '/test-invoke-stage/*/'
                                ]
                            ]
                        }
                    }
                },
                lambdarestapirestapiANY2C46F550: {
                    Type: 'AWS::ApiGateway::Method',
                    Properties: {
                        HttpMethod: 'ANY',
                        ResourceId: {
                            'Fn::GetAtt': [ 'lambdarestapirestapiB0B38C03', 'RootResourceId' ]
                        },
                        RestApiId: { Ref: 'lambdarestapirestapiB0B38C03' },
                        AuthorizationType: 'NONE',
                        Integration: {
                            IntegrationHttpMethod: 'POST',
                            Type: 'AWS_PROXY',
                            Uri: {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        { Ref: 'AWS::Partition' },
                                        ':apigateway:us-east-1:lambda:path/2015-03-31/functions/',
                                        {
                                            'Fn::GetAtt': [ 'functioneventfn01CDA78AF', 'Arn' ]
                                        },
                                        '/invocations'
                                    ]
                                ]
                            }
                        }
                    }
                }
            },
            Outputs: {
                lambdarestapirestapiEndpointF8394473: {
                    Value: {
                        'Fn::Join': [
                            '',
                            [
                                'https://',
                                { Ref: 'lambdarestapirestapiB0B38C03' },
                                '.execute-api.us-east-1.',
                                { Ref: 'AWS::URLSuffix' },
                                '/',
                                {
                                    Ref: 'lambdarestapirestapiDeploymentStageprod8A2EE98F'
                                },
                                '/'
                            ]
                        ]
                    }
                }
            }
        };
        templateHelper.template.templateMatches(expected);
    });
});