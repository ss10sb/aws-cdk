import {HasHostedZone} from "./has-hosted-zone";
import {Construct} from "constructs";
import {CnameRecord, IHostedZone} from "aws-cdk-lib/aws-route53";
import {Duration} from "aws-cdk-lib";

export class Route53Cname extends HasHostedZone {

    constructor(scope: Construct, id: string, hostedZone?: string | IHostedZone) {
        super(scope, id, hostedZone);
    }

    create(recordName: string, domainName: string): CnameRecord | undefined {
        const hostedZone = this.getHostedZone();
        if (hostedZone) {
            return new CnameRecord(this.scope, this.mixNameWithId(`${recordName}-cname`), {
                zone: hostedZone,
                recordName: recordName,
                domainName: domainName,
                ttl: Duration.minutes(60),
                comment: `${this.id}: ${recordName}`
            })
        }
    }
}