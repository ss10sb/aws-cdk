import {resetStaticProps} from "../../src/utils/reset-static-props";
import {mockClient} from "aws-sdk-client-mock";
import {GetParameterCommand, SSMClient} from "@aws-sdk/client-ssm";
import {PreSynthHelper, StaticFileProvider} from "../../src/utils";
import {DescribeImagesCommand, ECRClient, TagStatus} from "@aws-sdk/client-ecr";
import {CodePipelineEcsStackFactory} from "../../src/stack-factory";
import path from "path";
import {TemplateHelper} from "../../src/utils/testing";
import {Template} from "aws-cdk-lib/assertions";
import {buildCodePipelineEcsStack} from "../../src";

const configDir = path.join(__dirname, '/../__config__');

const mockSsm = mockClient(SSMClient);
const mockEcr = mockClient(ECRClient);

beforeEach(() => {
    mockSsm.reset();
    mockEcr.reset();
    resetStaticProps();
    const staticProvider = new StaticFileProvider();
    staticProvider.cleanup();
});

describe('code pipeline ecs stack factory', () => {

    it('should throw error if not initialized', () => {
        const preSynthHelper = new PreSynthHelper({
            configDir: configDir,
            clientConfig: {}
        });
        const stackFactory = new CodePipelineEcsStackFactory({
            preSynthHelper: preSynthHelper
        });
        expect(() => stackFactory.buildStack()).toThrowError('Not initialized.');
    });

    it('should throw error if no live config loaded', () => {
        mockSsm.onAnyCommand().resolves({});
        mockEcr.onAnyCommand().resolves({});
        const preSynthHelper = new PreSynthHelper({
            configDir: configDir,
            clientConfig: {}
        });
        const stackFactory = new CodePipelineEcsStackFactory({
            preSynthHelper: preSynthHelper
        });
        return expect(stackFactory.initialize()).rejects.toThrowError('Missing config keys: College Name');
    });

    it('should create a pipeline stack', async () => {
        mockSsm.on(GetParameterCommand, {
            Name: '/pcc-shared-stack/config'
        }).resolves({
            Parameter: {
                Value: JSON.stringify(getConfig()),
                Name: '/pcc-shared-stack/config'
            }
        });
        mockEcr.on(DescribeImagesCommand, {
            filter: {
                tagStatus: TagStatus.TAGGED
            },
            repositoryName: 'pcc-shared-stack/nginx'
        }).rejects('error!');
        mockEcr.on(DescribeImagesCommand, {
            filter: {
                tagStatus: TagStatus.TAGGED
            },
            repositoryName: 'pcc-shared-stack/phpfpm'
        }).resolves({
            imageDetails: [
                {
                    registryId: "abc123",
                    repositoryName: "pcc-shared-stack/phpfpm",
                    imageTags: ['5', '3', 'foo'],
                }
            ]
        });
        const preSynthHelper = new PreSynthHelper({
            configDir: configDir,
            clientConfig: {}
        });
        const stackFactory = new CodePipelineEcsStackFactory({
            preSynthHelper: preSynthHelper
        });
        await stackFactory.initialize();
        const stack = stackFactory.buildStack({
            stackProps: {
                env: {
                    account: '12344',
                    region: 'us-west-2'
                }
            }
        });
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        templateHelper.template.templateMatches(getExpected());
    });

    it('should create a pipeline stack from helper function', async () => {
        mockSsm.on(GetParameterCommand, {
            Name: '/pcc-shared-stack/config'
        }).resolves({
            Parameter: {
                Value: JSON.stringify(getConfig()),
                Name: '/pcc-shared-stack/config'
            }
        });
        mockEcr.on(DescribeImagesCommand, {
            filter: {
                tagStatus: TagStatus.TAGGED
            },
            repositoryName: 'pcc-shared-stack/nginx'
        }).rejects('error!');
        mockEcr.on(DescribeImagesCommand, {
            filter: {
                tagStatus: TagStatus.TAGGED
            },
            repositoryName: 'pcc-shared-stack/phpfpm'
        }).resolves({
            imageDetails: [
                {
                    registryId: "abc123",
                    repositoryName: "pcc-shared-stack/phpfpm",
                    imageTags: ['5', '3', 'foo'],
                }
            ]
        });
        const preSynthHelper = new PreSynthHelper({
            configDir: configDir,
            clientConfig: {}
        });
        const stack = await buildCodePipelineEcsStack({
            preSynthHelper: preSynthHelper
        }, {
            stackProps: {
                env: {
                    account: '12344',
                    region: 'us-west-2'
                }
            }
        });
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        templateHelper.template.templateMatches(getExpected());
    });
});

function getConfig(): Record<string, any> {
    return require('../__configLive__/defaults');
}

function getExpected() {
    return require('../__templates__/code-pipeline-ecs-stack');
}