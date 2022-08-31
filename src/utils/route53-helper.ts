import {HostedZone, IHostedZone} from "aws-cdk-lib/aws-route53";
import {Construct} from "constructs";

export class Route53Helper {

    static hostedZoneLookups: Record<string, IHostedZone> = {};

    public static getHostedZoneFromDomain(scope: Construct, domain: string): IHostedZone {
        if (this.hostedZoneLookups[domain]) {
            return this.hostedZoneLookups[domain];
        }
        const hostedZone = HostedZone.fromLookup(scope, `lookup-${domain}`, {
            domainName: domain
        });
        this.hostedZoneLookups[domain] = hostedZone;
        return hostedZone;
    }

    public static getDomainFromConfig(config: Record<string, any>): string | undefined {
        if (config.Parameters?.subdomain && config.Parameters?.hostedZoneDomain) {
            return `${config.Parameters.subdomain}.${config.Parameters.hostedZoneDomain}`;
        }
    }
}