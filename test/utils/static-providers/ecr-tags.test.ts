import {mockClient} from "aws-sdk-client-mock";
import {DescribeImagesCommand, ECRClient, TagStatus} from "@aws-sdk/client-ecr";
import {EcrTag} from "../../../src/utils/sdk";
import {ConfigEnvironments} from "../../../src/config";
import {EcrRepositories, EcrRepositoryType} from "../../../src/ecr";
import {StaticFileProvider} from "../../../src/utils";
import {EcrTags} from "../../../src/utils/static-providers";

const baseBuildConfig = {
    Name: 'test',
    College: 'PCC',
    Environment: ConfigEnvironments.PROD,
    Parameters: {
        repositories: {
            repositories: [EcrRepositoryType.NGINX, EcrRepositoryType.PHPFPM]
        },
    }
}

const mock = mockClient(ECRClient);

beforeEach(() => {
    const staticProvider = new StaticFileProvider();
    staticProvider.cleanup();
    mock.reset();
});

describe('ecr tags static provider', () => {

    it('should fetch empty array when no data', () => {
        const ecrTag = new EcrTag({region: 'us-east-1'});
        const repositories = new EcrRepositories('my-repos', baseBuildConfig.Parameters.repositories);
        const staticProvider = new StaticFileProvider();
        const ecrTags = new EcrTags(staticProvider, repositories, ecrTag);
        const tagResponses = ecrTags.fetch();
        expect(tagResponses).toBeInstanceOf(Array);
        expect(tagResponses.length).toEqual(0);
        staticProvider.remove(ecrTags.getName());
    });

    it('should put data from ecr tags provider when repos not found', async () => {
        const ecrTag = new EcrTag({region: 'us-east-1'});
        mock.on(DescribeImagesCommand).rejects('error!');
        const repositories = new EcrRepositories('my-repos', baseBuildConfig.Parameters.repositories);
        const staticProvider = new StaticFileProvider();
        const ecrTags = new EcrTags(staticProvider, repositories, ecrTag);
        await ecrTags.put();
        const tagResponses = ecrTags.fetch();
        expect(tagResponses).toEqual([
            {
                repositoryName: 'my-repos/nginx',
                imageTag: '1',
                cached: false,
                exists: false
            },
            {
                repositoryName: 'my-repos/phpfpm',
                imageTag: '1',
                cached: false,
                exists: false
            }
        ]);
        expect(repositories.getEcrRepositoryByRepositoryName('my-repos/phpfpm')?.imageTag).toEqual('1');
        expect(repositories.getEcrRepositoryByRepositoryName('my-repos/nginx')?.imageTag).toEqual('1');
        staticProvider.remove(ecrTags.getName());
    });

    it('should put data from ecr tags provider with next tags', async () => {
        const ecrTag = new EcrTag({region: 'us-east-1'});
        mock.on(DescribeImagesCommand, {
            filter: {
                tagStatus: TagStatus.TAGGED
            },
            repositoryName: 'my-repos/nginx'
        }).rejects('error!');
        mock.on(DescribeImagesCommand, {
            filter: {
                tagStatus: TagStatus.TAGGED
            },
            repositoryName: 'my-repos/phpfpm'
        }).resolves({
            imageDetails: [
                {
                    registryId: "abc123",
                    repositoryName: "ecr-image/phpfpm",
                    imageTags: ['5', '3', 'foo'],
                }
            ]
        });
        const repositories = new EcrRepositories('my-repos', baseBuildConfig.Parameters.repositories);
        const staticProvider = new StaticFileProvider();
        const ecrTags = new EcrTags(staticProvider, repositories, ecrTag);
        await ecrTags.put();
        const tagResponses = ecrTags.fetch();
        expect(tagResponses).toEqual([
            {
                repositoryName: 'my-repos/nginx',
                imageTag: '1',
                cached: false,
                exists: false
            },
            {
                repositoryName: 'my-repos/phpfpm',
                imageTag: '6',
                cached: false,
                exists: true
            }
        ]);
        expect(repositories.getEcrRepositoryByRepositoryName('my-repos/phpfpm')?.imageTag).toEqual('6');
        expect(repositories.getEcrRepositoryByRepositoryName('my-repos/nginx')?.imageTag).toEqual('1');
        staticProvider.remove(ecrTags.getName());
    });
});