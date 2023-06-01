import {App, Stack} from "aws-cdk-lib";
import {Authorizer} from "../../src/lambda/authorizer";
import {Template} from "aws-cdk-lib/assertions";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {MatchHelper} from "../../src/utils/testing/match-helper";

describe('authorizer v1', () => {
    it('should create authorizer', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const authorizer = new Authorizer(stack, 'authorizer');
        const a = authorizer.create({
            token: 'abc123'
        });
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        // templateHelper.inspect();
        const expected = {
            Resources: {
                authorizerauthorizerfnServiceRole5010DDC1: {
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
                authorizerauthorizerfn4F0DAFF0: {
                    Type: 'AWS::Lambda::Function',
                    Properties: {
                        Code: {
                            S3Bucket: 'cdk-hnb659fds-assets-12344-us-east-1',
                            S3Key: MatchHelper.endsWith('zip')
                        },
                        Role: {
                            'Fn::GetAtt': [ 'authorizerauthorizerfnServiceRole5010DDC1', 'Arn' ]
                        },
                        Environment: { Variables: { AUTHORIZER_TOKEN: 'abc123' } },
                        FunctionName: 'authorizer-authorizer-fn',
                        Handler: 'token.handler',
                        Runtime: MatchHelper.startsWith('nodejs'),
                        Timeout: 5
                    },
                    DependsOn: [ 'authorizerauthorizerfnServiceRole5010DDC1' ]
                },
                authorizerauthorizerfnLogRetention6CEBB528: {
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
                                    { Ref: 'authorizerauthorizerfn4F0DAFF0' }
                                ]
                            ]
                        },
                        RetentionInDays: 7
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
});