import {VpcCidr} from "../../src/vpc/vpc-cidr";
import {NaclCidr} from "../../src/vpc/nacl-cidr";

describe('nacl cidr', () => {
    it('should create nacl cidr instance for ipv4', () => {
        const result = NaclCidr.ipv4('10.0.0.0/8');
        expect(result.toCidrConfig().cidrBlock).toEqual('10.0.0.0/8');
    });
    it('should create nacl cidr instance for vpc cidr', () => {
        VpcCidr.getInstance().set('172.20.0.0/16');
        const result = NaclCidr.vpcCidr();
        expect(result.toCidrConfig().cidrBlock).toEqual('172.20.0.0/16');
    });
});