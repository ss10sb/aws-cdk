import {App, Stack} from "aws-cdk-lib";
import {Route53ARecord} from "../../src/route53";
import {AlbHelper} from "../../src/utils";
import {Match, Template} from "aws-cdk-lib/assertions";
import {resetStaticProps} from "../../src/utils/reset-static-props";

const stackProps = {env: {region: 'us-east-1', account: '12344'}};

describe('route53 a record', () => {

    afterEach(() => {
        resetStaticProps();
    });

    it('should create a record', () => {
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