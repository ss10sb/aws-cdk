import {App, Stack} from "aws-cdk-lib";
import {S3Bucket} from "../../src/s3";
import {Match, Template} from "aws-cdk-lib/assertions";

describe('s3', () => {

    it('should create a bucket', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const s3 = new S3Bucket(stack, 'stack-bucket');
        s3.create('foo', {});
        const template = Template.fromStack(stack);
        template.hasResourceProperties('AWS::S3::Bucket', Match.objectEquals({
            "BucketEncryption": {
                "ServerSideEncryptionConfiguration": [
                    {
                        "ServerSideEncryptionByDefault": {
                            "SSEAlgorithm": "aws:kms"
                        }
                    }
                ]
            },
            "BucketName": "stack-bucket-foo",
            "PublicAccessBlockConfiguration": {
                "BlockPublicAcls": true,
                "BlockPublicPolicy": true,
                "IgnorePublicAcls": true,
                "RestrictPublicBuckets": true
            }
        }));
    });
})