import {AlbHelper} from "./alb-helper";
import {Route53Helper} from "./route53-helper";
import {VpcHelper} from "./vpc-helper";
import {Secrets} from "../secret/secrets";

export function resetStaticProps(): void {
    AlbHelper.albLookups = {};
    AlbHelper.listenerLookups = {};
    Route53Helper.hostedZoneLookups = {};
    VpcHelper.vpcLookups = {};
    Secrets.secret = undefined;
}