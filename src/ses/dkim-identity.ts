import {NonConstruct} from "../core/non-construct";
import {Construct} from "constructs";
import {HostedZone, IHostedZone} from "aws-cdk-lib/aws-route53";
import {Route53Helper} from "../utils/route53-helper";
import {EmailIdentity, Identity} from "aws-cdk-lib/aws-ses";

export class DkimIdentity extends NonConstruct {

    readonly hostedZone?: string | IHostedZone;

    constructor(scope: Construct, id: string, hostedZone?: string | IHostedZone) {
        super(scope, id);
        this.hostedZone = hostedZone;
    }

    createForDomain(domain: string): EmailIdentity | undefined {
        const hostedZone = this.getHostedZone();
        if (hostedZone) {
            return new EmailIdentity(this.scope, this.mixNameWithId(`${domain}-dkim`), {
                identity: {
                    value: domain,
                    hostedZone: hostedZone
                },
                mailFromDomain: domain
            });
        }
    }

    getHostedZone(): IHostedZone | undefined {
        if (this.hostedZone) {
            if (this.hostedZone instanceof HostedZone) {
                return this.hostedZone;
            }
            return Route53Helper.getHostedZoneFromDomain(this.scope, <string>this.hostedZone);
        }
    }
}