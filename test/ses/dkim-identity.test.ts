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
        //templateHelper.inspect();
        const expected = {
            Resources: {
                stacktestexampleedudkimDkimDnsToken105936A7B: {
                    Type: 'AWS::Route53::RecordSet',
                    Properties: {
                        Name: {
                            'Fn::GetAtt': ['stacktestexampleedudkim599ECBB6', 'DkimDNSTokenName1']
                        },
                        Type: 'CNAME',
                        HostedZoneId: 'DUMMY',
                        ResourceRecords: [
                            {
                                'Fn::GetAtt': [
                                    'stacktestexampleedudkim599ECBB6',
                                    'DkimDNSTokenValue1'
                                ]
                            }
                        ],
                        TTL: '1800'
                    }
                },
                stacktestexampleedudkimDkimDnsToken24D14CD82: {
                    Type: 'AWS::Route53::RecordSet',
                    Properties: {
                        Name: {
                            'Fn::GetAtt': ['stacktestexampleedudkim599ECBB6', 'DkimDNSTokenName2']
                        },
                        Type: 'CNAME',
                        HostedZoneId: 'DUMMY',
                        ResourceRecords: [
                            {
                                'Fn::GetAtt': [
                                    'stacktestexampleedudkim599ECBB6',
                                    'DkimDNSTokenValue2'
                                ]
                            }
                        ],
                        TTL: '1800'
                    }
                },
                stacktestexampleedudkimDkimDnsToken357F57837: {
                    Type: 'AWS::Route53::RecordSet',
                    Properties: {
                        Name: {
                            'Fn::GetAtt': ['stacktestexampleedudkim599ECBB6', 'DkimDNSTokenName3']
                        },
                        Type: 'CNAME',
                        HostedZoneId: 'DUMMY',
                        ResourceRecords: [
                            {
                                'Fn::GetAtt': [
                                    'stacktestexampleedudkim599ECBB6',
                                    'DkimDNSTokenValue3'
                                ]
                            }
                        ],
                        TTL: '1800'
                    }
                },
                stacktestexampleedudkim599ECBB6: {
                    Type: 'AWS::SES::EmailIdentity',
                    Properties: {
                        EmailIdentity: 'example.edu',
                        MailFromAttributes: {MailFromDomain: 'test.example.edu'}
                    }
                },
                stacktestexampleedudkimMailFromMxRecord9BE996F6: {
                    Type: 'AWS::Route53::RecordSet',
                    Properties: {
                        Name: 'test.example.edu.',
                        Type: 'MX',
                        HostedZoneId: 'DUMMY',
                        ResourceRecords: ['10 feedback-smtp.us-east-1.amazonses.com'],
                        TTL: '1800'
                    }
                },
                stacktestexampleedudkimMailFromTxtRecord9B904AB3: {
                    Type: 'AWS::Route53::RecordSet',
                    Properties: {
                        Name: 'test.example.edu.',
                        Type: 'TXT',
                        HostedZoneId: 'DUMMY',
                        ResourceRecords: ['"v=spf1 include:amazonses.com ~all"'],
                        TTL: '1800'
                    }
                }
            }
        };
        templateHelper.template.templateMatches(expected);
    });
});