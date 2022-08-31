import {
    AclTraffic, Action,
    CommonNetworkAclEntryOptions,
    SubnetSelection, TrafficDirection
} from "aws-cdk-lib/aws-ec2";

export interface NaclProps {
    readonly name: string;
    readonly subnetSelection: SubnetSelection;
    rules: CommonNetworkAclEntryOptions[];
}

export interface NaclRulesProps {
    readonly groupName: string;
    readonly subnetSelection: SubnetSelection;
    readonly rules: NaclRuleProps[];
}

export interface NaclRuleProps {
    readonly direction: TrafficDirection;
    readonly traffic: AclTraffic;
    readonly cidrs: any[];
    readonly action?: Action;
}
