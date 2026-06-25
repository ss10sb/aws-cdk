import {App, Stack} from "aws-cdk-lib";
import {Template} from "aws-cdk-lib/assertions";
import {S3Files} from "../../src/s3/s3-files";
import {VpcHelper} from "../../src/utils/vpc-helper";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {Role, ServicePrincipal} from "aws-cdk-lib/aws-iam";

describe('s3', () => {

    it('should create a bucket', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const vpc = VpcHelper.getVpcById(stack, 'vpcId');
        const s3 = new S3Files(stack, 'stack-bucket');
        const filesBucket = s3.create({vpc});
        const testRole = new Role(stack, 'test-role', {
            assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
            roleName: 'test-role'
        });
        s3.fileSystemPolicy(filesBucket, testRole);
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        // templateHelper.inspect();
        const expected = require('../__templates__/s3-files');
        templateHelper.template.templateMatches(expected);
    });
})