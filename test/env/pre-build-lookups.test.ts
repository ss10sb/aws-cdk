import {App, Stack} from "aws-cdk-lib";
import {PreBuildLookups} from "../../src/env/pre-build-lookups";
import {EnvBuildType} from "../../src/env/env-definitions";
import {ConfigEnvironments} from "../../src/config/config-definitions";

describe('pre build lookups with secret arn', () => {

    it('should do lookups', () => {
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const envConfig = {
            AWSAccountId: '2222',
            AWSRegion: 'us-west-2',
            Name: 'myapp',
            College: 'PCC',
            Environment: ConfigEnvironments.SDLC,
            Version: "0.0.0",
            Parameters: {
                secretArn: 'arn:aws:secretsmanager:us-east-1:12344:secret:pcc-prod-test-secrets/environment-ABC123',
                listenerRule: {
                    priority: 100,
                    conditions: {
                        hostHeaders: ['test.dev.example.edu']
                    }
                },
                targetGroup: {},
                services: [],
                tasks: []
            }
        };
        const app = new App();
        const stack = new Stack(app, 'stack', stackProps);
        new PreBuildLookups(stack, 'stack', envConfig);
        expect(app.synth().manifest.missing).toEqual([
            {
                "key": "ssm:account=12344:parameterName=pcc-sdlc-alb01-arn:region=us-east-1",
                "props": {
                    "account": "12344",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    "parameterName": "pcc-sdlc-alb01-arn",
                    "region": "us-east-1"
                },
                "provider": "ssm"
            },
            {
                "key": "load-balancer-listener:account=12344:listenerPort=443:listenerProtocol=HTTPS:loadBalancerArn=dummy-value-for-pcc-sdlc-alb01-arn:loadBalancerType=application:region=us-east-1",
                "props": {
                    "account": "12344",
                    "listenerPort": 443,
                    "listenerProtocol": "HTTPS",
                    "loadBalancerArn": "dummy-value-for-pcc-sdlc-alb01-arn",
                    "loadBalancerType": "application",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    "region": "us-east-1"
                },
                "provider": "load-balancer-listener"
            },
            {
                "key": "security-group:account=12344:region=us-east-1:securityGroupId=sg-123456789012",
                "props": {
                    "account": "12344",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    "region": "us-east-1",
                    "securityGroupId": "sg-123456789012"
                },
                "provider": "security-group"
            },
            {
                "key": "load-balancer:account=12344:loadBalancerArn=dummy-value-for-pcc-sdlc-alb01-arn:loadBalancerType=application:region=us-east-1",
                "props": {
                    "account": "12344",
                    "loadBalancerArn": "dummy-value-for-pcc-sdlc-alb01-arn",
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
            }
        ]);
    });

    it('should do lookups by secret name', () => {
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const envConfig = {
            AWSAccountId: '2222',
            AWSRegion: 'us-west-2',
            Name: 'myapp',
            College: 'PCC',
            Environment: ConfigEnvironments.SDLC,
            Version: "0.0.0",
            Parameters: {
                listenerRule: {
                    priority: 100,
                    conditions: {
                        hostHeaders: ['test.dev.example.edu']
                    }
                },
                targetGroup: {},
                services: [],
                tasks: []
            }
        };
        const app = new App();
        const stack = new Stack(app, 'stack', stackProps);
        new PreBuildLookups(stack, 'stack', envConfig);
        expect(app.synth().manifest.missing).toEqual([
            {
                "key": "ssm:account=12344:parameterName=pcc-sdlc-alb01-arn:region=us-east-1",
                "props": {
                    "account": "12344",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    "parameterName": "pcc-sdlc-alb01-arn",
                    "region": "us-east-1"
                },
                "provider": "ssm"
            },
            {
                "key": "load-balancer-listener:account=12344:listenerPort=443:listenerProtocol=HTTPS:loadBalancerArn=dummy-value-for-pcc-sdlc-alb01-arn:loadBalancerType=application:region=us-east-1",
                "props": {
                    "account": "12344",
                    "listenerPort": 443,
                    "listenerProtocol": "HTTPS",
                    "loadBalancerArn": "dummy-value-for-pcc-sdlc-alb01-arn",
                    "loadBalancerType": "application",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    "region": "us-east-1"
                },
                "provider": "load-balancer-listener"
            },
            {
                "key": "security-group:account=12344:region=us-east-1:securityGroupId=sg-123456789012",
                "props": {
                    "account": "12344",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    "region": "us-east-1",
                    "securityGroupId": "sg-123456789012"
                },
                "provider": "security-group"
            },
            {
                "key": "load-balancer:account=12344:loadBalancerArn=dummy-value-for-pcc-sdlc-alb01-arn:loadBalancerType=application:region=us-east-1",
                "props": {
                    "account": "12344",
                    "loadBalancerArn": "dummy-value-for-pcc-sdlc-alb01-arn",
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
            }
        ]);
    });
})