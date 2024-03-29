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
                authorizerauthorizerfnlgDF5C9AE3: {
                    Type: 'AWS::Logs::LogGroup',
                    Properties: { RetentionInDays: 7 },
                    UpdateReplacePolicy: 'Delete',
                    DeletionPolicy: 'Delete'
                },
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
                            S3Key: 'c53d3eefd84eda81ec21cae72089e12b7729368cb85e86fc9fb8b2031b76415b.zip'
                        },
                        Environment: { Variables: { AUTHORIZER_TOKEN: 'abc123' } },
                        FunctionName: 'authorizer-authorizer-fn',
                        Handler: 'token.handler',
                        LoggingConfig: { LogGroup: { Ref: 'authorizerauthorizerfnlgDF5C9AE3' } },
                        Role: {
                            'Fn::GetAtt': [ 'authorizerauthorizerfnServiceRole5010DDC1', 'Arn' ]
                        },
                        Runtime: 'nodejs18.x',
                        Timeout: 5
                    },
                    DependsOn: [ 'authorizerauthorizerfnServiceRole5010DDC1' ]
                }
            }
        };
        templateHelper.template.templateMatches(expected);
    });
});