import {App, Stack} from "aws-cdk-lib";
import {Match, Template} from "aws-cdk-lib/assertions";
import {resetStaticProps} from "../../src/utils/reset-static-props";
import {SesVerifyDomain} from "../../src/ses/ses-verify-domain";

describe('ses verify domain', () => {

    beforeEach(() => {
        resetStaticProps();
    });

    it('should verify', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const sesVerifyDomain = new SesVerifyDomain(stack, 'ses-verify-domain');
        sesVerifyDomain.verifyDomain({
            subdomain: 'test.example.edu',
            hostedZone: 'example.edu'
        });
        const template = Template.fromStack(stack);
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
        const verifyDomainMatch = Match.stringLikeRegexp("^sesverifydomainsesverifytestexampleeduVerifyDomainIdentity.*");
        const serviceRoleMatch = Match.stringLikeRegexp("^AWS.*ServiceRole.*");
        template.hasResourceProperties('AWS::IAM::Policy', Match.objectEquals({
            "PolicyDocument": {
                "Statement": [
                    {
                        "Action": [
                            "ses:VerifyDomainIdentity",
                            "ses:DeleteIdentity"
                        ],
                        "Effect": "Allow",
                        "Resource": "*"
                    }
                ],
                "Version": "2012-10-17"
            },
            "PolicyName": Match.stringLikeRegexp("^sesverifydomainsesverifytestexampleeduVerifyDomainIdentityCustomResourcePolicy.*"),
            "Roles": [
                {
                    "Ref": serviceRoleMatch
                }
            ]
        }));
        template.hasResourceProperties('Custom::AWS', Match.objectEquals({
            "ServiceToken": {
                "Fn::GetAtt": [
                    Match.stringLikeRegexp("^AWS.*"),
                    "Arn"
                ]
            },
            "Create": "{\"service\":\"SES\",\"action\":\"verifyDomainDkim\",\"parameters\":{\"Domain\":\"test.example.edu\"},\"physicalResourceId\":{\"id\":\"test.example.edu-verify-domain-dkim\"}}",
            "Update": "{\"service\":\"SES\",\"action\":\"verifyDomainDkim\",\"parameters\":{\"Domain\":\"test.example.edu\"},\"physicalResourceId\":{\"id\":\"test.example.edu-verify-domain-dkim\"}}",
            "InstallLatestAwsSdk": true
        }));
        template.hasResourceProperties('AWS::Route53::RecordSet', Match.objectEquals({
            "Name": "_amazonses.test.example.edu.",
            "Type": "TXT",
            "HostedZoneId": "DUMMY",
            "ResourceRecords": [
                {
                    "Fn::Join": [
                        "",
                        [
                            "\"",
                            {
                                "Fn::GetAtt": [
                                    verifyDomainMatch,
                                    "VerificationToken"
                                ]
                            },
                            "\""
                        ]
                    ]
                }
            ],
            "TTL": "1800"
        }));
        template.hasResourceProperties('AWS::IAM::Policy', Match.objectEquals({
            "PolicyDocument": {
                "Statement": [
                    {
                        "Action": [
                            "ses:VerifyDomainIdentity",
                            "ses:DeleteIdentity"
                        ],
                        "Effect": "Allow",
                        "Resource": "*"
                    }
                ],
                "Version": "2012-10-17"
            },
            "PolicyName": Match.stringLikeRegexp("^sesverifydomainsesverifytestexampleeduVerifyDomainIdentityCustomResourcePolicy.*"),
            "Roles": [
                {
                    "Ref": serviceRoleMatch
                }
            ]
        }));
        template.hasResourceProperties('Custom::AWS', Match.objectEquals({
            "ServiceToken": {
                "Fn::GetAtt": [
                    Match.stringLikeRegexp("^AWS.*"),
                    "Arn"
                ]
            },
            "Create": "{\"service\":\"SES\",\"action\":\"verifyDomainDkim\",\"parameters\":{\"Domain\":\"test.example.edu\"},\"physicalResourceId\":{\"id\":\"test.example.edu-verify-domain-dkim\"}}",
            "Update": "{\"service\":\"SES\",\"action\":\"verifyDomainDkim\",\"parameters\":{\"Domain\":\"test.example.edu\"},\"physicalResourceId\":{\"id\":\"test.example.edu-verify-domain-dkim\"}}",
            "InstallLatestAwsSdk": true
        }));
        template.hasResourceProperties('AWS::Route53::RecordSet', Match.objectEquals({
            "Name": "_amazonses.test.example.edu.",
            "Type": "TXT",
            "HostedZoneId": "DUMMY",
            "ResourceRecords": [
                {
                    "Fn::Join": [
                        "",
                        [
                            "\"",
                            {
                                "Fn::GetAtt": [
                                    verifyDomainMatch,
                                    "VerificationToken"
                                ]
                            },
                            "\""
                        ]
                    ]
                }
            ],
            "TTL": "1800"
        }));
        template.hasResourceProperties('AWS::Route53::RecordSet', Match.objectEquals({
            "Name": "_amazonses.test.example.edu.",
            "Type": "TXT",
            "HostedZoneId": "DUMMY",
            "ResourceRecords": [
                {
                    "Fn::Join": [
                        "",
                        [
                            "\"",
                            {
                                "Fn::GetAtt": [
                                    verifyDomainMatch,
                                    "VerificationToken"
                                ]
                            },
                            "\""
                        ]
                    ]
                }
            ],
            "TTL": "1800"
        }));
        template.hasResourceProperties('AWS::Route53::RecordSet', Match.objectEquals({
            "Name": "_amazonses.test.example.edu.",
            "Type": "TXT",
            "HostedZoneId": "DUMMY",
            "ResourceRecords": [
                {
                    "Fn::Join": [
                        "",
                        [
                            "\"",
                            {
                                "Fn::GetAtt": [
                                    verifyDomainMatch,
                                    "VerificationToken"
                                ]
                            },
                            "\""
                        ]
                    ]
                }
            ],
            "TTL": "1800"
        }));
        template.hasResourceProperties('AWS::Lambda::Function', Match.objectEquals({
            "Code": {
                "S3Bucket": "cdk-hnb659fds-assets-12344-us-east-1",
                "S3Key": Match.stringLikeRegexp("^.*\.zip")
            },
            "Role": {
                "Fn::GetAtt": [
                    serviceRoleMatch,
                    "Arn"
                ]
            },
            "Handler": "index.handler",
            "Runtime": "nodejs14.x",
            "Timeout": 120
        }));
    });
});