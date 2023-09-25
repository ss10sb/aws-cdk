import {NonConstruct} from "../core/non-construct";
import {HostedZone, IHostedZone} from "aws-cdk-lib/aws-route53";
import {Construct} from "constructs";
import {Route53Helper} from "../utils/route53-helper";

export class HasHostedZone extends NonConstruct {

    readonly hostedZone?: string | IHostedZone;

    constructor(scope: Construct, id: string, hostedZone?: string | IHostedZone) {
        super(scope, id);
        this.hostedZone = hostedZone;
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