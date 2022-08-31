import {App, Stack} from "aws-cdk-lib";
import {Match, Template} from "aws-cdk-lib/assertions";
import {resetStaticProps} from "../../src/utils/reset-static-props";
import path from "path";
import {AlbHelper} from "../../src/utils/alb-helper";
import {WebDistribution} from "../../src/cloudfront/web-distribution";
import {Route53ARecord} from "../../src/route53/route53-a-record";
import {PhpHttpApi} from "../../src/lambda/php-http-api";
import {PhpBrefFunction} from "../../src/lambda/php-bref-function";
import {BrefRuntime} from "../../src/lambda/bref-definitions";
import {AcmCertificate} from "../../src/acm/acm-certificate";

const stackProps = {env: {region: 'us-east-1', account: '12344'}};

describe('route53 a record', () => {

    beforeEach(() => {
        resetStaticProps();
    });

    it('should create a record for alb', () => {
        const app = new App();
        const stack = new Stack(app, 'stack', stackProps);
        const alb = AlbHelper.getAlbByArn(stack, 'arn:alb');
        const route53ARecord = new Route53ARecord(stack, 'route53', alb, 'example.edu');
        route53ARecord.createARecord('foo');
        const template = Template.fromStack(stack);
        expect(app.synth().manifest.missing).toEqual([
            {
                "key": "load-balancer:account=12344:loadBalancerArn=arn$:alb:loadBalancerType=application:region=us-east-1",
                "props": {
                    "account": "12344",
                    "loadBalancerArn": "arn:alb",
                    "loadBalancerType": "application",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    "region": "us-east-1"
                },
                "provider": "load-balancer"
            },
            {
                "key": "vpc-provider:account=12344:filter.vpc-id=vpc-12345:region=us-east-1:returnAsymmetricSubnets=true",
                "props": {
                    "account": "12344",
                    "filter": {
                        "vpc-id": "vpc-12345"
                    },
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    "region": "us-east-1",
                    "returnAsymmetricSubnets": true
                },
                "provider": "vpc-provider"
            },
            {
                "key": "security-group:account=12344:region=us-east-1:securityGroupId=sg-1234",
                "props": {
                    "account": "12344",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    "region": "us-east-1",
                    "securityGroupId": "sg-1234"
                },
                "provider": "security-group"
            },
            {
                "key": "hosted-zone:account=12344:domainName=example.edu:region=us-east-1",
                "props": {
                    "account": "12344",
                    "domainName": "example.edu",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    "region": "us-east-1"
                },
                "provider": "hosted-zone"
            }
        ]);
        template.hasResourceProperties('AWS::Route53::RecordSet', Match.objectEquals({
            "Name": "foo.example.edu.",
            "Type": "A",
            "AliasTarget": {
                "DNSName": "dualstack.my-load-balancer-1234567890.us-west-2.elb.amazonaws.com",
                "HostedZoneId": Match.stringLikeRegexp("^.*EXAMPLE")
            },
            "Comment": "route53: foo.example.edu",
            "HostedZoneId": "DUMMY"
        }));
    });

    it('should create a record for cf distribution', () => {
        const app = new App();
        const stack = new Stack(app, 'stack', stackProps);
        const cert = new AcmCertificate(stack, 'cert');
        const c = cert.create({domainName: 'foo.bar.com', hostedZone: 'bar.com', region: 'us-east-1'});
        const phpbrefFun = new PhpBrefFunction(stack, 'function', {environment: {}, secretKeys: []});
        const func = phpbrefFun.create('f1', {
            appPath: path.join(__dirname, '..', '__codebase__'),
            brefRuntime: BrefRuntime.PHP81FPM
        });
        const phpHttpApi = new PhpHttpApi(stack, 'http-api');
        const api = phpHttpApi.create({lambdaFunction: func});
        const webDistribution = new WebDistribution(stack, 'distribution');
        const dist = webDistribution.create({
            httpApi: api,
            domainName: 'foo.bar.com',
            certificate: c,
            webAclId: 'arn:aws:wafv2:us-east-1:123456789012:global/webacl/pccprodwafcf-arn-random-characters'
        });
        const route53ARecord = new Route53ARecord(stack, 'route53', dist, 'example.edu');
        route53ARecord.createARecord('foo');
        const template = Template.fromStack(stack);
        template.hasResourceProperties('AWS::Route53::RecordSet', Match.objectEquals({
            "Name": "foo.example.edu.",
            "Type": "A",
            "AliasTarget": {
                "DNSName": {
                    "Fn::GetAtt": [
                        "distributioncfwdED870F34",
                        "DomainName"
                    ]
                },
                "HostedZoneId": {
                    "Fn::FindInMap": [
                        "AWSCloudFrontPartitionHostedZoneIdMap",
                        {
                            "Ref": "AWS::Partition"
                        },
                        "zoneId"
                    ]
                }
            },
            "Comment": "route53: foo.example.edu",
            "HostedZoneId": "DUMMY"
        }));
    });

    it('should create multiple a records', () => {
        const app = new App();
        const stack = new Stack(app, 'stack', stackProps);
        const alb = AlbHelper.getAlbByArn(stack, 'arn:alb');
        const route53ARecord = new Route53ARecord(stack, 'route53', alb, 'example.edu');
        route53ARecord.createARecord('foo');
        route53ARecord.createARecord('bar');
        const template = Template.fromStack(stack);
        expect(app.synth().manifest.missing).toEqual([
            {
                "key": "load-balancer:account=12344:loadBalancerArn=arn$:alb:loadBalancerType=application:region=us-east-1",
                "props": {
                    "account": "12344",
                    "loadBalancerArn": "arn:alb",
                    "loadBalancerType": "application",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    "region": "us-east-1"
                },
                "provider": "load-balancer"
            },
            {
                "key": "vpc-provider:account=12344:filter.vpc-id=vpc-12345:region=us-east-1:returnAsymmetricSubnets=true",
                "props": {
                    "account": "12344",
                    "filter": {
                        "vpc-id": "vpc-12345"
                    },
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    "region": "us-east-1",
                    "returnAsymmetricSubnets": true
                },
                "provider": "vpc-provider"
            },
            {
                "key": "security-group:account=12344:region=us-east-1:securityGroupId=sg-1234",
                "props": {
                    "account": "12344",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    "region": "us-east-1",
                    "securityGroupId": "sg-1234"
                },
                "provider": "security-group"
            },
            {
                "key": "hosted-zone:account=12344:domainName=example.edu:region=us-east-1",
                "props": {
                    "account": "12344",
                    "domainName": "example.edu",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    "region": "us-east-1"
                },
                "provider": "hosted-zone"
            }
        ]);
        template.hasResourceProperties('AWS::Route53::RecordSet', Match.objectEquals({
            "Name": "foo.example.edu.",
            "Type": "A",
            "AliasTarget": {
                "DNSName": "dualstack.my-load-balancer-1234567890.us-west-2.elb.amazonaws.com",
                "HostedZoneId": Match.stringLikeRegexp("^.*EXAMPLE")
            },
            "Comment": "route53: foo.example.edu",
            "HostedZoneId": "DUMMY"
        }));
        template.hasResourceProperties('AWS::Route53::RecordSet', Match.objectEquals({
            "Name": "bar.example.edu.",
            "Type": "A",
            "AliasTarget": {
                "DNSName": "dualstack.my-load-balancer-1234567890.us-west-2.elb.amazonaws.com",
                "HostedZoneId": Match.stringLikeRegexp("^.*EXAMPLE")
            },
            "Comment": "route53: bar.example.edu",
            "HostedZoneId": "DUMMY"
        }));
    });

    it('should be undefined with no subdomain', () => {
        const app = new App();
        const stack = new Stack(app, 'stack', stackProps);
        const alb = AlbHelper.getAlbByArn(stack, 'arn:alb');
        const route53ARecord = new Route53ARecord(stack, 'route53', alb, 'example.edu');
        expect(route53ARecord.createARecord()).toEqual(undefined);
    });

    it('should be undefined with no hosted zone', () => {
        const app = new App();
        const stack = new Stack(app, 'stack', stackProps);
        const alb = AlbHelper.getAlbByArn(stack, 'arn:alb');
        const route53ARecord = new Route53ARecord(stack, 'route53', alb);
        expect(route53ARecord.createARecord('foo')).toEqual(undefined);
    });
});