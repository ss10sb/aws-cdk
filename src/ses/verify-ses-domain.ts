/**
 * Borrowed from seeebiii/ses-verify-identities
 * needed to override some of the private methods so here it is...
 */
import {CnameRecord, IHostedZone, MxRecord, TxtRecord} from 'aws-cdk-lib/aws-route53';
import {Topic} from 'aws-cdk-lib/aws-sns';
import {CfnOutput, Fn} from 'aws-cdk-lib';
import {AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId} from 'aws-cdk-lib/custom-resources';
import {EnvironmentPlaceholders} from 'aws-cdk-lib/cx-api';
import {Effect, PolicyStatement} from 'aws-cdk-lib/aws-iam';
import {Construct} from "constructs";
import {Route53Helper} from "../utils/route53-helper";
import {RetentionDays} from "aws-cdk-lib/aws-logs";

export function generateSesPolicyForCustomResource(...methods: string[]): AwsCustomResourcePolicy {
    // for some reason the default policy is generated as `email:<method>` which does not work -> hence we need to provide our own
    return AwsCustomResourcePolicy.fromStatements([
        new PolicyStatement({
            actions: methods.map((method) => 'ses:' + method),
            effect: Effect.ALLOW,
            // PolicySim says ses:SetActiveReceiptRuleSet does not allow specifying a resource, hence use '*'
            resources: ['*'],
        }),
    ]);
}

export type NotificationType = 'Bounce' | 'Complaint' | 'Delivery';

export interface IVerifySesDomainProps {
    /**
     * A domain name to be used for the SES domain identity, e.g. 'sub-domain.example.org'
     */
    readonly domainName: string;
    /**
     * A hostedZone name to be matched with Route 53 record. e.g. 'example.org'
     * @default same as domainName
     */
    readonly hostedZoneName?: string;
    /**
     * Whether to automatically add a TXT record to the hosed zone of your domain. This only works if your domain is managed by Route53. Otherwise disable it.
     * @default true
     */
    readonly addTxtRecord?: boolean;
    /**
     * Whether to automatically add a MX record to the hosted zone of your domain. This only works if your domain is managed by Route53. Otherwise disable it.
     * @default true
     */
    readonly addMxRecord?: boolean;
    /**
     * Whether to automatically add DKIM records to the hosted zone of your domain. This only works if your domain is managed by Route53. Otherwise disable it.
     * @default true
     */
    readonly addDkimRecords?: boolean;
    /**
     * An SNS topic where bounces, complaints or delivery notifications can be sent to. If none is provided, a new topic will be created and used for all different notification types.
     * @default new topic will be created
     */
    readonly notificationTopic?: Topic;
    /**
     * Select for which notification types you want to configure a topic.
     * @default [Bounce, Complaint]
     */
    readonly notificationTypes?: NotificationType[];
}

/**
 * A construct to verify a SES domain identity. It initiates a domain verification and can automatically create appropriate records in Route53 to verify the domain. Also, it's possible to attach a notification topic for bounces, complaints or delivery notifications.
 *
 * @example
 *
 * new VerifySesDomain(this, 'SesDomainVerification', {
 *   domainName: 'example.org'
 * });
 *
 */
export class VerifySesDomain extends Construct {

    constructor(parent: Construct, name: string, props: IVerifySesDomainProps) {
        super(parent, name);

        const domainName = props.domainName;
        const verifyDomainIdentity = this.verifyDomainIdentity(domainName);
        if (props.notificationTypes && props.notificationTypes.length > 0) {
            const topic = this.createTopicOrUseExisting(domainName, verifyDomainIdentity, props.notificationTopic);
            this.addTopicToDomainIdentity(domainName, topic, props.notificationTypes);
        }

        const hostedZoneName = props.hostedZoneName ? props.hostedZoneName : domainName;
        const zone = this.getHostedZone(hostedZoneName);

        if (isTrueOrUndefined(props.addTxtRecord)) {
            const txtRecord = this.createTxtRecordLinkingToSes(zone, domainName, verifyDomainIdentity);
            txtRecord.node.addDependency(verifyDomainIdentity);
        }

        if (isTrueOrUndefined(props.addMxRecord)) {
            const mxRecord = this.createMxRecord(zone, domainName);
            mxRecord.node.addDependency(verifyDomainIdentity);
        }

        if (isTrueOrUndefined(props.addDkimRecords)) {
            const verifyDomainDkim = this.initDkimVerification(domainName);
            verifyDomainDkim.node.addDependency(verifyDomainIdentity);
            this.addDkimRecords(verifyDomainDkim, zone, domainName);
        }
    }

    getHostedZone(domainName: string): IHostedZone {
        return Route53Helper.getHostedZoneFromDomain(this, domainName);
    }

    private verifyDomainIdentity(domainName: string): AwsCustomResource {
        return new AwsCustomResource(this, 'VerifyDomainIdentity', {
            onCreate: {
                service: 'SES',
                action: 'verifyDomainIdentity',
                parameters: {
                    Domain: domainName,
                },
                physicalResourceId: PhysicalResourceId.fromResponse('VerificationToken'),
            },
            onUpdate: {
                service: 'SES',
                action: 'verifyDomainIdentity',
                parameters: {
                    Domain: domainName,
                },
                physicalResourceId: PhysicalResourceId.fromResponse('VerificationToken'),
            },
            onDelete: {
                service: 'SES',
                action: 'deleteIdentity',
                parameters: {
                    Identity: domainName,
                },
            },
            policy: generateSesPolicyForCustomResource('VerifyDomainIdentity', 'DeleteIdentity'),
        });
    }

    private createTxtRecordLinkingToSes(zone: IHostedZone, domainName: string, verifyDomainIdentity: AwsCustomResource) {
        return new TxtRecord(this, 'SesVerificationRecord', {
            zone,
            recordName: `_amazonses.${domainName}`,
            values: [verifyDomainIdentity.getResponseField('VerificationToken')],
        });
    }

    private createMxRecord(zone: IHostedZone, domainName: string) {
        return new MxRecord(this, 'SesMxRecord', {
            zone,
            recordName: domainName,
            values: [
                {
                    hostName: Fn.sub(`inbound-smtp.${EnvironmentPlaceholders.CURRENT_REGION}.amazonaws.com`),
                    priority: 10,
                },
            ],
        });
    }

    private initDkimVerification(domainName: string) {
        return new AwsCustomResource(this, 'VerifyDomainDkim', {
            onCreate: {
                service: 'SES',
                action: 'verifyDomainDkim',
                parameters: {
                    Domain: domainName,
                },
                physicalResourceId: PhysicalResourceId.of(domainName + '-verify-domain-dkim'),
            },
            onUpdate: {
                service: 'SES',
                action: 'verifyDomainDkim',
                parameters: {
                    Domain: domainName,
                },
                physicalResourceId: PhysicalResourceId.of(domainName + '-verify-domain-dkim'),
            },
            policy: generateSesPolicyForCustomResource('VerifyDomainDkim'),
            logRetention: RetentionDays.ONE_WEEK,
            functionName: `${this.node.id}-dkim`
        });
    }

    private addDkimRecords(verifyDomainDkim: AwsCustomResource, zone: IHostedZone, domainName: string) {
        [0, 1, 2].forEach((val) => {
            const dkimToken = verifyDomainDkim.getResponseField(`DkimTokens.${val}`);
            const cnameRecord = new CnameRecord(this, 'SesDkimVerificationRecord' + val, {
                zone,
                recordName: `${dkimToken}._domainkey.${domainName}`,
                domainName: `${dkimToken}.dkim.amazonses.com`,
            });
            cnameRecord.node.addDependency(verifyDomainDkim);
        });
    }

    private createTopicOrUseExisting(domainName: string, verifyDomainIdentity: AwsCustomResource, existingTopic?: Topic) {
        const topic = existingTopic ?? new Topic(this, 'SesNotificationTopic');
        new CfnOutput(this, domainName + 'SesNotificationTopic', {
            value: topic.topicArn,
            description: 'SES notification topic for ' + domainName,
        });
        topic.node.addDependency(verifyDomainIdentity);
        return topic;
    }

    private addTopicToDomainIdentity(domainName: string, topic: Topic, notificationTypes: NotificationType[]) {
        notificationTypes.forEach((type) => {
            this.addSesNotificationTopicForIdentity(domainName, type, topic);
        });
    }

    private addSesNotificationTopicForIdentity(
        identity: string,
        notificationType: NotificationType,
        notificationTopic: Topic,
    ): void {
        const addTopic = new AwsCustomResource(this, `Add${notificationType}Topic-${identity}`, {
            onCreate: {
                service: 'SES',
                action: 'setIdentityNotificationTopic',
                parameters: {
                    Identity: identity,
                    NotificationType: notificationType,
                    SnsTopic: notificationTopic.topicArn,
                },
                physicalResourceId: PhysicalResourceId.of(`${identity}-set-${notificationType}-topic`),
            },
            policy: generateSesPolicyForCustomResource('SetIdentityNotificationTopic'),
        });

        addTopic.node.addDependency(notificationTopic);
    }
}

function isTrueOrUndefined(prop?: boolean): boolean {
    return prop === undefined || prop;
}
