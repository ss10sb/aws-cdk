export class VpcCidr {

    vpcCidr?: string;

    private static instance: VpcCidr;

    private constructor() {
    }

    static getInstance(): VpcCidr {
        if (!VpcCidr.instance) {
            VpcCidr.instance = new VpcCidr();
        }
        return VpcCidr.instance;
    }

    set(vpcCidr: string): void {
        this.vpcCidr = vpcCidr;
    }

    get(): string {
        if (this.vpcCidr === undefined) {
            throw new Error('Set the VPC CIDR before using NaclCidr.vpcCidr()');
        }
        return this.vpcCidr;
    }
}
