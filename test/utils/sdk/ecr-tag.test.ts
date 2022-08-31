import {mockClient} from "aws-sdk-client-mock";
import {DescribeImagesCommand, ECRClient} from "@aws-sdk/client-ecr";
import {EcrTag} from "../../../src/utils/sdk/ecr-tag";

const mock = mockClient(ECRClient);

beforeEach(() => {
    mock.reset();
})

describe('ecr tag', () => {

    it('should return 1 when error', async () => {
        const ecrTag = new EcrTag({region: 'us-east-1'});
        mock.on(DescribeImagesCommand).rejects('error!');
        const tag = await ecrTag.fetch('ecr-image/phpfpm');
        expect(tag.imageTag).toEqual('1');
        expect(tag.exists).toEqual(false);
    });

    it('should return 1 when no tags are set', async () => {
        const ecrTag = new EcrTag({region: 'us-east-1'});
        mock.on(DescribeImagesCommand).resolves({
            imageDetails: [
                {
                    registryId: "abc123",
                    repositoryName: "ecr-image/phpfpm",
                    imageTags: [],
                }
            ]
        });
        const tag = await ecrTag.fetch('ecr-image/phpfpm');
        expect(tag.imageTag).toEqual('1');
        expect(tag.exists).toEqual(true);
    });

    it('should increment existing tag', async () => {
        const ecrTag = new EcrTag({region: 'us-east-1'});
        mock.on(DescribeImagesCommand).resolves({
            imageDetails: [
                {
                    registryId: "abc123",
                    repositoryName: "ecr-image/phpfpm",
                    imageTags: ['1'],
                }
            ]
        });
        const tag = await ecrTag.fetch('ecr-image/phpfpm');
        expect(tag.imageTag).toEqual('2');
        expect(tag.exists).toEqual(true);
    });

    it('should increment existing tag with multiple tags', async () => {
        const ecrTag = new EcrTag({region: 'us-east-1'});
        mock.on(DescribeImagesCommand).resolves({
            imageDetails: [
                {
                    registryId: "abc123",
                    repositoryName: "ecr-image/phpfpm",
                    imageTags: ['5', '3', 'foo'],
                }
            ]
        });
        const tag = await ecrTag.fetch('ecr-image/phpfpm');
        expect(tag.imageTag).toEqual('6');
        expect(tag.exists).toEqual(true);
    });
});