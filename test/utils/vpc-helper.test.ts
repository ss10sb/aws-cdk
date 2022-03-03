import {ConfigEnvironments, ConfigStack} from "../../src/config";
import {VpcHelper} from "../../src/utils";
import {App} from "aws-cdk-lib";
import {resetStaticProps} from "../../src/utils/reset-static-props";

describe('vpc helper', () => {

    afterEach(() => {
        resetStaticProps();
    });

    it('can get default vpc name', () => {
        const buildConfig = {
            Name: 'test',
            College: 'PCC',
            Environment: ConfigEnvironments.PROD
        }
        const name = VpcHelper.getDefaultVpcName(buildConfig);
        expect(name).toBe('pcc-prod-vpc01/vpc');
    });

    it('can get vpc by name', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const buildConfig = {
            Name: 'test',
            College: 'PCC',
            Environment: ConfigEnvironments.PROD
        }
        const stack = new ConfigStack(app, 'test', buildConfig, {}, stackProps);
        VpcHelper.getVpcByName(stack, VpcHelper.getDefaultVpcName(buildConfig));
        expect(app.synth().manifest.missing).toEqual([
            {
                "key": "vpc-provider:account=12344:filter.isDefault=false:filter.tag:Name=pcc-prod-vpc01/vpc:region=us-east-1:returnAsymmetricSubnets=true",
                "props": {
                    "account": "12344",
                    "filter": {
                        "isDefault": "false",
                        "tag:Name": "pcc-prod-vpc01/vpc"
                    },
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    "region": "us-east-1",
                    "returnAsymmetricSubnets": true
                },
                "provider": "vpc-provider"
            }
        ]);
    });

    it('can get vpc by id', () => {
        const app = new App();
        const buildConfig = {
            Name: 'test',
            College: 'PCC',
            Environment: ConfigEnvironments.PROD
        }
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new ConfigStack(app, 'test', buildConfig, {}, stackProps);
        VpcHelper.getVpcById(stack, 'vpcId');
        expect(app.synth().manifest.missing).toEqual([
            {
                "key": "vpc-provider:account=12344:filter.isDefault=false:filter.vpc-id=vpcId:region=us-east-1:returnAsymmetricSubnets=true",
                "props": {
                    "account": "12344",
                    "filter": {
                        "isDefault": "false",
                        "vpc-id": "vpcId"
                    },
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    "region": "us-east-1",
                    "returnAsymmetricSubnets": true
                },
                "provider": "vpc-provider"
            }
        ]);
    });

    it('can get vpc by id when config has vpcId', () => {
        const app = new App();
        const buildConfig = {
            Name: 'test',
            College: 'PCC',
            Environment: ConfigEnvironments.PROD,
            Parameters: {
                vpcId: 'vpcId'
            }
        }
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new ConfigStack(app, 'test', buildConfig, {}, stackProps);
        VpcHelper.getVpcFromConfig(stack, buildConfig);
        expect(app.synth().manifest.missing).toEqual([
            {
                "key": "vpc-provider:account=12344:filter.isDefault=false:filter.vpc-id=vpcId:region=us-east-1:returnAsymmetricSubnets=true",
                "props": {
                    "account": "12344",
                    "filter": {
                        "isDefault": "false",
                        "vpc-id": "vpcId"
                    },
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    "region": "us-east-1",
                    "returnAsymmetricSubnets": true
                },
                "provider": "vpc-provider"
            }
        ]);
    });

    it('can get vpc by name when config missing vpcId', () => {
        const app = new App();
        const buildConfig = {
            Name: 'test',
            College: 'PCC',
            Environment: ConfigEnvironments.PROD,
            Parameters: {}
        }
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new ConfigStack(app, 'test', buildConfig, {}, stackProps);
        VpcHelper.getVpcFromConfig(stack, buildConfig);
        expect(app.synth().manifest.missing).toEqual([
            {
                "key": "vpc-provider:account=12344:filter.isDefault=false:filter.tag:Name=pcc-prod-vpc01/vpc:region=us-east-1:returnAsymmetricSubnets=true",
                "props": {
                    "account": "12344",
                    "filter": {
                        "isDefault": "false",
                        "tag:Name": "pcc-prod-vpc01/vpc"
                    },
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    "region": "us-east-1",
                    "returnAsymmetricSubnets": true
                },
                "provider": "vpc-provider"
            }
        ]);
    });
});