import {VpcCidr} from "../../src/vpc/vpc-cidr";

describe('vpc cidr test', () => {
    it('should create one instance', () => {
        const v = VpcCidr.getInstance();
        v.set('172.22.0.0/16');
        expect(VpcCidr.getInstance().get()).toEqual('172.22.0.0/16');
    });
});