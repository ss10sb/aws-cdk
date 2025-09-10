import {resetStaticProps} from "../../src/utils/reset-static-props";
import {mockClient} from "aws-sdk-client-mock";
import {GetParameterCommand, SSMClient} from "@aws-sdk/client-ssm";
import {DescribeImagesCommand, ECRClient, TagStatus} from "@aws-sdk/client-ecr";
import path from "path";
import {Template} from "aws-cdk-lib/assertions";
import {PreSynthHelper} from "../../src/utils/pre-synth-helper";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {StaticFileProvider} from "../../src/utils/static-file-provider";
import {buildCodePipelineEcsStack} from "../../src/stack-functions";
import {CodePipelineEcsStackFactory} from "../../src/stack-factory/code-pipeline-ecs-stack-factory";

const configDir = path.join(__dirname, '/../__config__');

const mockSsm = mockClient(SSMClient);
const mockEcr = mockClient(ECRClient);

function cleanup() {
    mockSsm.reset();
    mockEcr.reset();
    resetStaticProps();
    const staticProvider = new StaticFileProvider();
    staticProvider.cleanup();
}

beforeEach(() => {
    cleanup();
});

afterAll(() => {
    cleanup();
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
        expect(() => stackFactory.buildStack()).toThrow('Not initialized.');
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
        return expect(stackFactory.initialize()).rejects.toThrow('Missing config keys: College Name');
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
            repositoryName: 'pcc-stack/nginx'
        }).rejects('error!');
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
            repositoryName: 'pcc-stack/nginx'
        }).rejects('error!');
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

    it('should create a pipeline stack with suffixes', async () => {
        mockSsm.on(GetParameterCommand, {
            Name: '/pcc-shared-test/config'
        }).resolves({
            Parameter: {
                Value: JSON.stringify(require('../__configSuffixLive__/defaults')),
                Name: '/pcc-shared-test/config'
            }
        });
        mockEcr.on(DescribeImagesCommand, {
            filter: {
                tagStatus: TagStatus.TAGGED
            },
            repositoryName: 'pcc-stack/nginx'
        }).rejects('error!');
        mockEcr.on(DescribeImagesCommand, {
            filter: {
                tagStatus: TagStatus.TAGGED
            },
            repositoryName: 'pcc-stack/phpfpm'
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
            configDir: path.join(__dirname, '/../__configSuffixLive__'),
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
        // templateHelper.inspect();
        templateHelper.template.templateMatches(getExpectedWithSuffixes());
    });

});

function getConfig(): Record<string, any> {
    return require('../__configLive__/defaults');
}

function getExpected() {
    return require('../__templates__/code-pipeline-ecs-stack');
}

function getExpectedWithSuffixes() {
    return require('../__templates__/code-pipeline-ecs-stack.suffixed');
}