import {Construct} from "constructs";
import {IVpc, Vpc, VpcLookupOptions} from "aws-cdk-lib/aws-ec2";
import {NamingHelper} from "./naming-helper";
import {ConfigStackHelper} from "./config-stack-helper";

export class VpcHelper {

    static vpcLookups: Record<string, IVpc> = {};

    public static getVpcFromConfig(scope: Construct, config: Record<string, any>, prefix = 'stack'): IVpc {
        if (config.Parameters.vpcId) {
            return this.getVpcById(scope, config.Parameters.vpcId, prefix);
        }
        return this.getVpcByName(scope, this.getDefaultVpcName(config));
    }

    public static getVpcByName(scope: Construct, vpcName: string, prefix = 'stack'): IVpc {
        return this.getVpcByOptions(scope, vpcName, {
            isDefault: false,
            vpcName: vpcName
        }, prefix);
    }

    public static getVpcById(scope: Construct, vpcId: string, prefix = 'stack'): IVpc {
        return this.getVpcByOptions(scope, vpcId, {
            isDefault: false,
            vpcId: vpcId
        }, prefix);
    }

    public static getVpcByOptions(scope: Construct, lookupKey: string, opts: VpcLookupOptions, prefix = 'stack'): IVpc {
        if (this.vpcLookups[lookupKey]) {
            return this.vpcLookups[lookupKey];
        }
        const vpc = Vpc.fromLookup(scope, `${prefix}-vpc`, opts);
        this.vpcLookups[lookupKey] = vpc;
        return vpc;
    }

    public static getDefaultVpcName(config: Record<string, any>, name = 'vpc01'): string {
        const base = NamingHelper.fromParts([ConfigStackHelper.getBaseName(config), name]);
        return NamingHelper.fromParts([base, 'vpc'], '/');
    }
}