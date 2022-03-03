import {Construct} from "constructs";
import {
    ApplicationListener,
    ApplicationLoadBalancer,
    ApplicationProtocol,
    IApplicationListener,
    IApplicationLoadBalancer
} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import {SsmHelper} from "./ssm-helper";
import {NamingHelper} from "./naming-helper";
import {ConfigStackHelper} from "./config-stack-helper";

export class AlbHelper {

    static albLookups: Record<string, IApplicationLoadBalancer> = {};

    static listenerLookups: Record<string, IApplicationListener> = {};

    public static getAlbFromConfigOrParam(scope: Construct, config: Record<string, any>): IApplicationLoadBalancer {
        return this.getAlbByArn(scope, this.getAlbArnFromConfigOrParam(scope, config));
    }

    public static getAlbArnFromConfigOrParam(scope: Construct, config: Record<string, any>): string {
        if (config?.Parameters?.albArn) {
            return config.Parameters.albArn;
        }
        return this.getArnFromParams(scope, this.getAlbArnParamKey(config));
    }

    public static getAlbByArn(scope: Construct, arn: string, prefix = 'stack'): IApplicationLoadBalancer {
        if (this.albLookups[arn]) {
            return this.albLookups[arn];
        }
        const alb = ApplicationLoadBalancer.fromLookup(scope, `${prefix}-alb`, {
            loadBalancerArn: arn
        });
        this.albLookups[arn] = alb;
        return alb;
    }

    public static getAlbArnParamKey(config: Record<string, any>, name = 'alb01'): string {
        return NamingHelper.fromParts([AlbHelper.getBaseAlbName(config, name), 'arn']);
    }

    public static getArnFromParams(scope: Construct, key: string): string {
        return SsmHelper.getStringValue(scope, key) ?? '';
    }

    public static getDefaultAlbName(config: Record<string, any>, name = 'alb01'): string {
        return NamingHelper.fromParts([AlbHelper.getBaseAlbName(config, name), 'alb'], '/');
    }

    public static getBaseAlbName(config: Record<string, any>, name = 'alb01'): string {
        return NamingHelper.fromParts([ConfigStackHelper.getBaseName(config), name]);
    }

    public static getApplicationListener(scope: Construct, config: Record<string, any>, albArn: string): IApplicationListener {
        if (this.listenerLookups[albArn]) {
            return this.listenerLookups[albArn];
        }
        const lookupOptions = {
            loadBalancerArn: albArn,
            listenerPort: 443,
            listenerProtocol: ApplicationProtocol.HTTPS
        }
        const listener = ApplicationListener.fromLookup(scope, 'lookup-https-listener', lookupOptions);
        this.listenerLookups[albArn] = listener;
        return listener;
    }
}