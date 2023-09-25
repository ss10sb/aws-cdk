import {App, Stack} from "aws-cdk-lib";
import {Match, Template} from "aws-cdk-lib/assertions";
import {S3BucketAssets} from "../../src/s3/s3-bucket-assets";
import {TemplateHelper} from "../../src/utils/testing/template-helper";

describe('s3 assets', () => {

    it('should create a bucket', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const s3 = new S3BucketAssets(stack, 'stack-bucket');
        s3.create('foo', {});
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        // templateHelper.inspect();
        const expected = {
            Resources: {
                stackbucketfoo69FBD112: {
                    Type: 'AWS::S3::Bucket',
                    Properties: {
                        BucketName: 'stack-bucket-foo',
                        CorsConfiguration: {
                            CorsRules: [
                                {
                                    AllowedHeaders: [ '*' ],
                                    AllowedMethods: [ 'GET' ],
                                    AllowedOrigins: [ '*' ],
                                    MaxAge: 3000
                                }
                            ]
                        }
                    },
                    UpdateReplacePolicy: 'Retain',
                    DeletionPolicy: 'Retain'
                },
                stackbucketfooPolicy2C77779B: {
                    Type: 'AWS::S3::BucketPolicy',
                    Properties: {
                        Bucket: { Ref: 'stackbucketfoo69FBD112' },
                        PolicyDocument: {
                            Statement: [
                                {
                                    Action: 's3:*',
                                    Condition: { Bool: { 'aws:SecureTransport': 'false' } },
                                    Effect: 'Deny',
                                    Principal: { AWS: '*' },
                                    Resource: [
                                        { 'Fn::GetAtt': [ 'stackbucketfoo69FBD112', 'Arn' ] },
                                        {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    {
                                                        'Fn::GetAtt': [ 'stackbucketfoo69FBD112', 'Arn' ]
                                                    },
                                                    '/*'
                                                ]
                                            ]
                                        }
                                    ]
                                },
                                {
                                    Action: 's3:GetObject',
                                    Effect: 'Allow',
                                    Principal: { AWS: '*' },
                                    Resource: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                {
                                                    'Fn::GetAtt': [ 'stackbucketfoo69FBD112', 'Arn' ]
                                                },
                                                '/*'
                                            ]
                                        ]
                                    }
                                }
                            ],
                            Version: '2012-10-17'
                        }
                    }
                }
            }
        };
        templateHelper.template.templateMatches(expected);
    });
})