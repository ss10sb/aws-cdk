import {Construct} from "constructs";
import {IApplicationLoadBalancer} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import {ARecord, IAliasRecordTarget, IHostedZone, RecordTarget} from "aws-cdk-lib/aws-route53";
import {CloudFrontTarget, LoadBalancerTarget} from "aws-cdk-lib/aws-route53-targets";
import {Duration} from "aws-cdk-lib";
import {Distribution, IDistribution} from "aws-cdk-lib/aws-cloudfront";
import {NonConstruct} from "../core/non-construct";
import {Route53Helper} from "../utils/route53-helper";

export class Route53ARecord extends NonConstruct {

    readonly target: IApplicationLoadBalancer | IDistribution;
    readonly hostedZone?: string;

    constructor(scope: Construct, id: string, target: IApplicationLoadBalancer | IDistribution, hostedZone?: string) {
        super(scope, id);
        this.target = target;
        this.hostedZone = hostedZone;
    }

    createARecord(subdomain?: string): ARecord | undefined {
        const hostedZone = this.getHostedZone();
        const target = this.getTarget();
        if (hostedZone && subdomain) {
            const domain = `${subdomain}.${this.hostedZone}`;
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
        if (this.target instanceof Distribution) {
            return new CloudFrontTarget(this.target);
        }
        return new LoadBalancerTarget(<IApplicationLoadBalancer>this.target);
    }

    getHostedZone(): IHostedZone | undefined {
        if (this.hostedZone) {
            return Route53Helper.getHostedZoneFromDomain(this.scope, this.hostedZone);
        }
    }
}