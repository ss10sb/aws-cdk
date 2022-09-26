import {Construct} from "constructs";
import {ApplicationLoadBalancer, IApplicationLoadBalancer} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import {ARecord, HostedZone, IAliasRecordTarget, IHostedZone, RecordTarget} from "aws-cdk-lib/aws-route53";
import {
    CloudFrontTarget,
    LoadBalancerTarget
} from "aws-cdk-lib/aws-route53-targets";
import {Duration} from "aws-cdk-lib";
import {Distribution, IDistribution} from "aws-cdk-lib/aws-cloudfront";
import {NonConstruct} from "../core/non-construct";
import {Route53Helper} from "../utils/route53-helper";

export class Route53ARecord extends NonConstruct {

    readonly target: IAliasRecordTarget | IDistribution | IApplicationLoadBalancer;
    readonly hostedZone?: string | IHostedZone;

    constructor(scope: Construct, id: string, target: IAliasRecordTarget | IDistribution | IApplicationLoadBalancer, hostedZone?: string | IHostedZone) {
        super(scope, id);
        this.target = target;
        this.hostedZone = hostedZone;
    }

    createARecord(subdomain?: string): ARecord | undefined {
        const hostedZone = this.getHostedZone();
        if (hostedZone && subdomain) {
            const domain = `${subdomain}.${this.hostedZone}`;
            return this.createARecordForDomain(domain);
        }
    }

    createARecordForDomain(domain: string): ARecord | undefined {
        const hostedZone = this.getHostedZone();
        const target = this.getTarget();
        if (hostedZone) {
            return new ARecord(this.scope, this.mixNameWithId(`${domain}-arecord`), {
                zone: hostedZone,
                recordName: domain,
                target: RecordTarget.fromAlias(target),
                ttl: Duration.seconds(300),
                comment: `${this.id}: ${domain}`,
            });
        }
    }

    getTarget(): IAliasRecordTarget {
        if (this.isDistribution(this.target)) {
            return new CloudFrontTarget(this.target);
        }
        if (this.isApplicationLoadBalancer(this.target)) {
            return new LoadBalancerTarget(<IApplicationLoadBalancer>this.target);
        }
        return <IAliasRecordTarget>this.target;
    }

    isApplicationLoadBalancer(target: object): target is IApplicationLoadBalancer {
        return target instanceof ApplicationLoadBalancer || (target as IApplicationLoadBalancer).addListener !== undefined;
    }

    isDistribution(target: object): target is IDistribution {
        return target instanceof Distribution || (target as IDistribution).distributionId !== undefined;
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