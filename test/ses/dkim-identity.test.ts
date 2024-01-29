import {App, Stack} from "aws-cdk-lib";
import {Match, Template} from "aws-cdk-lib/assertions";
import {resetStaticProps} from "../../src/utils/reset-static-props";
import {DkimIdentity} from "../../src/ses/dkim-identity";
import {TemplateHelper} from "../../src/utils/testing/template-helper";

describe('dkim email domain verify', () => {

    beforeEach(() => {
        resetStaticProps();
    });

    it ('should verify a domain', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const stack = new Stack(app, 'stack', stackProps);
        const identity = new DkimIdentity(stack, 'stack', 'example.edu');
        const i = identity.createForDomain('test.example.edu');
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        // templateHelper.inspect();
        const expected = {
            Resources: {
                stacktestexampleedudkimDkimDnsToken105936A7B: {
                    Type: 'AWS::Route53::RecordSet',
                    Properties: {
                        HostedZoneId: 'DUMMY',
                        Name: {
                            'Fn::GetAtt': [ 'stacktestexampleedudkim599ECBB6', 'DkimDNSTokenName1' ]
                        },
                        ResourceRecords: [
                            {
                                'Fn::GetAtt': [
                                    'stacktestexampleedudkim599ECBB6',
                                    'DkimDNSTokenValue1'
                                ]
                            }
                        ],
                        TTL: '1800',
                        Type: 'CNAME'
                    }
                },
                stacktestexampleedudkimDkimDnsToken24D14CD82: {
                    Type: 'AWS::Route53::RecordSet',
                    Properties: {
                        HostedZoneId: 'DUMMY',
                        Name: {
                            'Fn::GetAtt': [ 'stacktestexampleedudkim599ECBB6', 'DkimDNSTokenName2' ]
                        },
                        ResourceRecords: [
                            {
                                'Fn::GetAtt': [
                                    'stacktestexampleedudkim599ECBB6',
                                    'DkimDNSTokenValue2'
                                ]
                            }
                        ],
                        TTL: '1800',
                        Type: 'CNAME'
                    }
                },
                stacktestexampleedudkimDkimDnsToken357F57837: {
                    Type: 'AWS::Route53::RecordSet',
                    Properties: {
                        HostedZoneId: 'DUMMY',
                        Name: {
                            'Fn::GetAtt': [ 'stacktestexampleedudkim599ECBB6', 'DkimDNSTokenName3' ]
                        },
                        ResourceRecords: [
                            {
                                'Fn::GetAtt': [
                                    'stacktestexampleedudkim599ECBB6',
                                    'DkimDNSTokenValue3'
                                ]
                            }
                        ],
                        TTL: '1800',
                        Type: 'CNAME'
                    }
                },
                stacktestexampleedudkim599ECBB6: {
                    Type: 'AWS::SES::EmailIdentity',
                    Properties: {
                        EmailIdentity: 'example.edu',
                        MailFromAttributes: { MailFromDomain: 'test.example.edu' }
                    }
                },
                stacktestexampleedudkimMailFromMxRecord9BE996F6: {
                    Type: 'AWS::Route53::RecordSet',
                    Properties: {
                        HostedZoneId: 'DUMMY',
                        Name: 'test.example.edu.',
                        ResourceRecords: [ '10 feedback-smtp.us-east-1.amazonses.com' ],
                        TTL: '1800',
                        Type: 'MX'
                    }
                },
                stacktestexampleedudkimMailFromTxtRecord9B904AB3: {
                    Type: 'AWS::Route53::RecordSet',
                    Properties: {
                        HostedZoneId: 'DUMMY',
                        Name: 'test.example.edu.',
                        ResourceRecords: [ '"v=spf1 include:amazonses.com ~all"' ],
                        TTL: '1800',
                        Type: 'TXT'
                    }
                }
            }
        };
        templateHelper.template.templateMatches(expected);
    });
});