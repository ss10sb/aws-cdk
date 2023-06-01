import path from "path";
import {mockClient} from "aws-sdk-client-mock";
import {GetParameterCommand, SSMClient} from "@aws-sdk/client-ssm";
import {DescribeImagesCommand, ECRClient, TagStatus} from "@aws-sdk/client-ecr";
import {EcrRepositoryType} from "../../src/ecr/ecr-definitions";
import {PreSynthHelper} from "../../src/utils/pre-synth-helper";
import {StaticFileProvider} from "../../src/utils/static-file-provider";
import {ConfigEnvironments} from "../../src/config/config-definitions";

const configDir = path.join(__dirname, '/../__config__');
const clientConfig = {region: 'us-east-1'};

const mockSsm = mockClient(SSMClient);
const mockEcr = mockClient(ECRClient);

describe('pre synth helper', () => {

    beforeEach(() => {
        const staticProvider = new StaticFileProvider();
        staticProvider.cleanup();
        mockSsm.reset();
        mockEcr.reset();
    });

    it('should reject when no config can be loaded from ssm', async () => {
        const preSynthHelper = new PreSynthHelper({
            configDir: configDir,
            clientConfig: clientConfig
        });
        mockSsm.rejects('error!');
        await expect(preSynthHelper.run()).rejects.toThrowError('error!');
    });

    it('should provision config and ecr tags no existing repositories', async () => {
        const config = {
            Name: 'Stack',
            College: 'PCC',
            Environment: ConfigEnvironments.SHARED,
            Parameters: {
                repositories: {
                    repositories: [
                        EcrRepositoryType.PHPFPM
                    ]
                }
            }
        }
        const preSynthHelper = new PreSynthHelper({
            configDir: configDir,
            clientConfig: clientConfig
        });
        mockSsm.on(GetParameterCommand, {
            Name: '/pcc-shared-stack/config'
        }).resolves({
            Parameter: {
                Value: JSON.stringify(config),
                Name: '/pcc-shared-stack/config'
            }
        });
        mockEcr.onAnyCommand().resolves({});
        const response = await preSynthHelper.run();
        expect(response.config).toEqual(config);
        expect(response.ecrRepositories?.id).toEqual('pcc-stack');
        expect(response.ecrRepositories?.getEcrRepositories().length).toEqual(1);
        expect(response.tagResponses?.length).toEqual(1);
        // @ts-ignore
        expect(response.tagResponses[0].repositoryName).toEqual('pcc-stack/phpfpm');
        // @ts-ignore
        expect(response.tagResponses[0].imageTag).toEqual('1');
        // @ts-ignore
        expect(response.tagResponses[0].exists).toEqual(false);
    });

    it('should provision config and ecr tags with existing repositories', async () => {
        const config = {
            Name: 'Stack',
            College: 'PCC',
            Environment: ConfigEnvironments.SHARED,
            Parameters: {
                repositories: {
                    repositories: [
                        EcrRepositoryType.PHPFPM
                    ]
                }
            }
        }
        const preSynthHelper = new PreSynthHelper({
            configDir: configDir,
            clientConfig: clientConfig
        });
        mockSsm.on(GetParameterCommand, {
            Name: '/pcc-shared-stack/config'
        }).resolves({
            Parameter: {
                Value: JSON.stringify(config),
                Name: '/pcc-shared-stack/config'
            }
        });
        mockEcr.on(DescribeImagesCommand, {
            filter: {
                tagStatus: TagStatus.TAGGED
            },
            repositoryName: 'pcc-stack/phpfpm'
        }).resolves({
            imageDetails: [
                {
                    registryId: "abc123",
                    repositoryName: "pcc-stack/phpfpm",
                    imageTags: ['5', '3', 'foo'],
                }
            ]
        });
        const response = await preSynthHelper.run();
        expect(response.config).toEqual(config);
        expect(response.ecrRepositories?.id).toEqual('pcc-stack');
        expect(response.ecrRepositories?.getEcrRepositories().length).toEqual(1);
        expect(response.tagResponses?.length).toEqual(1);
        // @ts-ignore
        expect(response.tagResponses[0].repositoryName).toEqual('pcc-stack/phpfpm');
        // @ts-ignore
        expect(response.tagResponses[0].imageTag).toEqual('6');
        // @ts-ignore
        expect(response.tagResponses[0].exists).toEqual(true);
    });
});