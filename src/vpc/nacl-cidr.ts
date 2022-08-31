import {AclCidr, AclCidrConfig} from "aws-cdk-lib/aws-ec2";
import {VpcCidr} from "./vpc-cidr";

export abstract class NaclCidr extends AclCidr {

    static vpcCidr(): AclCidr {
        return NaclCidr.ipv4(VpcCidr.getInstance().get());
    }
}

class NAclCidrImpl extends NaclCidr {
    constructor(private readonly config: AclCidrConfig) {
        super();
    }

    public toCidrConfig(): AclCidrConfig {
        return this.config;
    }
}
