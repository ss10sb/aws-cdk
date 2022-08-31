import {App, Stack} from "aws-cdk-lib";
import {Match, Template} from "aws-cdk-lib/assertions";
import path from "path";
import {Secret} from "aws-cdk-lib/aws-secretsmanager";
import {FunctionType} from "../../src/lambda/lambda-definitions";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {PhpBrefFunction} from "../../src/lambda/php-bref-function";
import {BrefRuntime} from "../../src/lambda/bref-definitions";

describe('php bref function create', () => {

    it('should create the default function', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const phpbrefFun = new PhpBrefFunction(stack, 'function', {secretKeys: [], environment: {}});
        phpbrefFun.create('f1', {
            appPath: path.join(__dirname, '..', '__codebase__'),
            brefRuntime: BrefRuntime.PHP81FPM,
            type: FunctionType.WEB,
            version: '27'
        });
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
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
                            S3Key: Match.stringLikeRegexp('.*\.zip')
                        },
                        Role: {
                            'Fn::GetAtt': [templateHelper.startsWithMatch('functionf1fn0ServiceRole'), 'Arn']
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
                                        ':lambda:us-east-1:209497400698:layer/php-81-fpm:27'
                                    ]
                                ]
                            }
                        ],
                        Runtime: 'provided.al2',
                        Timeout: 28
                    },
                    DependsOn: [templateHelper.startsWithMatch('functionf1fn0ServiceRole')]
                }
            }
        };
        templateHelper.template.templateMatches(expected);
    });

    it('should create the default function with latest version', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const phpbrefFun = new PhpBrefFunction(stack, 'function', {secretKeys: [], environment: {}});
        phpbrefFun.create('f1', {
            appPath: path.join(__dirname, '..', '__codebase__'),
            brefRuntime: BrefRuntime.PHP81FPM,
            type: FunctionType.EVENT
        });
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
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
                functionf1fn040096078: {
                    Type: 'AWS::Lambda::Function',
                    Properties: {
                        Code: {
                            S3Bucket: 'cdk-hnb659fds-assets-12344-us-east-1',
                            S3Key: 'ce9adb4fda6fdc569b2bd894a02aa2f273695def9558c5ad237cedf56562f55e.zip'
                        },
                        Role: {
                            'Fn::GetAtt': [ 'functionf1fn0ServiceRole4BCEC8F9', 'Arn' ]
                        },
                        FunctionName: 'function-f1-fn-0',
                        Handler: 'public/index.php',
                        Layers: [
                            {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        { Ref: 'AWS::Partition' },
                                        ':lambda:us-east-1:209497400698:layer/php-81-fpm:28'
                                    ]
                                ]
                            }
                        ],
                        Runtime: 'provided.al2',
                        Timeout: 120
                    },
                    DependsOn: [ 'functionf1fn0ServiceRole4BCEC8F9' ]
                }
            }
        };
        templateHelper.template.templateMatches(expected);
    });

    it('should create multiple layers with latest version', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const phpbrefFun = new PhpBrefFunction(stack, 'function', {secretKeys: [], environment: {}});
        phpbrefFun.create('f1', {
            appPath: path.join(__dirname, '..', '__codebase__'),
            brefRuntime: [BrefRuntime.PHP81FPM, BrefRuntime.CONSOLE],
            type: FunctionType.EVENT
        });
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
                functionf1fn040096078: {
                    Type: 'AWS::Lambda::Function',
                    Properties: {
                        Code: {
                            S3Bucket: 'cdk-hnb659fds-assets-12344-us-east-1',
                            S3Key: 'ce9adb4fda6fdc569b2bd894a02aa2f273695def9558c5ad237cedf56562f55e.zip'
                        },
                        Role: {
                            'Fn::GetAtt': [ 'functionf1fn0ServiceRole4BCEC8F9', 'Arn' ]
                        },
                        FunctionName: 'function-f1-fn-0',
                        Handler: 'public/index.php',
                        Layers: [
                            {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        { Ref: 'AWS::Partition' },
                                        ':lambda:us-east-1:209497400698:layer/php-81-fpm:28'
                                    ]
                                ]
                            },
                            {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        { Ref: 'AWS::Partition' },
                                        ':lambda:us-east-1:209497400698:layer/console:67'
                                    ]
                                ]
                            }
                        ],
                        Runtime: 'provided.al2',
                        Timeout: 120
                    },
                    DependsOn: [ 'functionf1fn0ServiceRole4BCEC8F9' ]
                }
            }
        };
        templateHelper.template.templateMatches(expected);
    });

    it('should add environment and secret references', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const phpbrefFun = new PhpBrefFunction(stack, 'function', {
            secret: new Secret(stack, 'secret'),
            secretKeys: ['BIZ'],
            environment: {
                'FOO': 'BAR'
            }
        });
        phpbrefFun.create('f1', {
            appPath: path.join(__dirname, '..', '__codebase__'),
            brefRuntime: BrefRuntime.PHP81FPM,
            type: FunctionType.EVENT,
            hasEnvironment: true,
            hasSecrets: true
        });
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
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
                functionf1fn040096078: {
                    Type: 'AWS::Lambda::Function',
                    Properties: {
                        Code: {
                            S3Bucket: 'cdk-hnb659fds-assets-12344-us-east-1',
                            S3Key: 'ce9adb4fda6fdc569b2bd894a02aa2f273695def9558c5ad237cedf56562f55e.zip'
                        },
                        Role: {
                            'Fn::GetAtt': [ 'functionf1fn0ServiceRole4BCEC8F9', 'Arn' ]
                        },
                        Environment: {
                            Variables: {
                                FOO: 'BAR',
                                BIZ: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            '{{resolve:secretsmanager:',
                                            { Ref: 'secret4DA88516' },
                                            ':SecretString:BIZ::}}'
                                        ]
                                    ]
                                }
                            }
                        },
                        FunctionName: 'function-f1-fn-0',
                        Handler: 'public/index.php',
                        Layers: [
                            {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        { Ref: 'AWS::Partition' },
                                        ':lambda:us-east-1:209497400698:layer/php-81-fpm:28'
                                    ]
                                ]
                            }
                        ],
                        Runtime: 'provided.al2',
                        Timeout: 120
                    },
                    DependsOn: [ 'functionf1fn0ServiceRole4BCEC8F9' ]
                }
            }
        };
        templateHelper.template.templateMatches(expected);
    });
});