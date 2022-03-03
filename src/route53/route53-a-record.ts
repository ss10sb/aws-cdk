import {Construct} from "constructs";
import {IApplicationLoadBalancer} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import {ARecord, IHostedZone, RecordTarget} from "aws-cdk-lib/aws-route53";
import {Route53Helper} from "../utils";
import {LoadBalancerTarget} from "aws-cdk-lib/aws-route53-targets";
import {Duration} from "aws-cdk-lib";
import {NonConstruct} from "../core";

export class Route53ARecord extends NonConstruct {

    readonly alb: IApplicationLoadBalancer;
    readonly hostedZone?: string;

    constructor(scope: Construct, id: string, alb: IApplicationLoadBalancer, hostedZone?: string) {
        super(scope, id);
        this.alb = alb;
        this.hostedZone = hostedZone;
    }

    createARecord(subdomain?: string): ARecord | undefined {
        const hostedZone = this.getHostedZone();
        if (hostedZone && subdomain) {
            const domain = `${subdomain}.${this.hostedZone}`;
            return new ARecord(this.scope, this.mixNameWithId(`${domain}-arecord`), {
                zone: hostedZone,
                recordName: domain,
                target: RecordTarget.fromAlias(new LoadBalancerTarget(this.alb)),
                ttl: Duration.seconds(300),
                comment: `${this.id}: ${domain}`,
            });
        }
    }

    getHostedZone(): IHostedZone | undefined {
        if (this.hostedZone) {
            return Route53Helper.getHostedZoneFromDomain(this.scope, this.hostedZone);
        }
    }
}