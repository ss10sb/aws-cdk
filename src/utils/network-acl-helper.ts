import {AclCidr, CommonNetworkAclEntryOptions} from "aws-cdk-lib/aws-ec2";
import {VpcCidr} from "../vpc/vpc-cidr";
import {NaclProps, NaclRuleProps, NaclRulesProps} from "../vpc/vpc-definitions";
import {NaclCidr} from "../vpc/nacl-cidr";

export class NetworkAclHelper {

    readonly max: number = 20;

    constructor(vpcCidr: string) {
        VpcCidr.getInstance().set(vpcCidr);
    }

    create(rules: NaclRulesProps[]): NaclProps[] {
        const naclProps: NaclProps[] = [];
        for (const groupRules of rules) {
            const nacl: NaclProps = {
                name: groupRules.groupName,
                subnetSelection: groupRules.subnetSelection,
                rules: this.getRulesFromRuleProps(groupRules.rules)
            };
            naclProps.push(nacl);
        }
        if (naclProps.length > this.max) {
            throw new Error(`Rule count ${naclProps.length} is greater than ${this.max}`);
        }
        return naclProps;
    }

    getRulesFromRuleProps(rules: NaclRuleProps[]): CommonNetworkAclEntryOptions[] {
        const entries: CommonNetworkAclEntryOptions[] = [];
        let count: number = 1;
        for (const rule of rules) {
            for (const cidr of rule.cidrs) {
                entries.push({
                    cidr: this.getCidr(cidr),
                    ruleNumber: count * 5,
                    traffic: rule.traffic,
                    ruleAction: rule.action,
                    direction: rule.direction
                });
                count++;
            }
        }
        return entries;
    }

    protected getCidr(cidr: NaclCidr | AclCidr | string | Function): AclCidr {
        if (typeof cidr === "function") {
            return cidr();
        }
        if (typeof cidr === "string") {
            return AclCidr.ipv4(cidr);
        }
        return cidr;
    }
}