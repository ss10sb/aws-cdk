import {mockClient} from "aws-sdk-client-mock";
import {GetParameterCommand, SSMClient} from "@aws-sdk/client-ssm";
import {SsmParam} from "../../../src/utils/sdk";

const mock = mockClient(SSMClient);

describe('ssm param', () => {
    beforeEach(() => {
        mock.reset();
    });

    it('should fail on error', async () => {
        const ssmParam = new SsmParam({region: 'us-east-1'});
        mock.on(GetParameterCommand).rejects('error!');
        await expect(ssmParam.fetch('foo')).rejects.toThrowError();
    });

    it('should be undefined if not found', async () => {
        const ssmParam = new SsmParam({region: 'us-east-1'});
        mock.on(GetParameterCommand).resolves({});
        const param = await ssmParam.fetch('foo');
        expect(param.key).toEqual('foo');
        expect(param.value).toEqual(undefined);
    });

    it('should be value if found', async () => {
        const ssmParam = new SsmParam({region: 'us-east-1'});
        mock.on(GetParameterCommand).resolves({
            Parameter: {
                Value: 'bar',
                Name: 'foo'
            }
        });
        const param = await ssmParam.fetch('foo');
        expect(param.key).toEqual('foo');
        expect(param.value).toEqual('bar');
    });
});