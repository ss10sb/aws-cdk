import {App, Stack} from "aws-cdk-lib";
import {Route53Helper} from "../../src/utils";
import {resetStaticProps} from "../../src/utils/reset-static-props";

describe('route 53 helper', () => {

    beforeEach(() => {
        resetStaticProps();
    });

    it('should add lookup to stack', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        Route53Helper.getHostedZoneFromDomain(stack, 'example.edu');
        expect(app.synth().manifest.missing).toEqual([
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
    });
});