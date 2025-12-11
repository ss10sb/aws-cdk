import {mockClient} from "aws-sdk-client-mock";
import {GetParameterCommand, SSMClient} from "@aws-sdk/client-ssm";
import {DescribeImagesCommand, ECRClient, TagStatus} from "@aws-sdk/client-ecr";
import {resetStaticProps} from "../../../src/utils/reset-static-props";
import {StaticFileProvider} from "../../../src/utils/static-file-provider";
import {PreSynthHelper} from "../../../src/utils/pre-synth-helper";
import {TemplateHelper} from "../../../src/utils/testing/template-helper";
import {Template} from "aws-cdk-lib/assertions";
import path from "path";
import {CodePipelineStackFactory} from "../../../src/v2/stack-factory/code-pipeline-stack-factory";
import {buildCodePipelineMixedStack} from "../../../src/stack-functions";

const configDir = path.join(__dirname, '/../__config__/base');

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
describe('code pipeline stack factory test', () => {

    it('should create a pipeline stack', async () => {
        mockSsm.on(GetParameterCommand, {
            Name: '/pcc-shared-test/config'
        }).resolves({
            Parameter: {
                Value: JSON.stringify(getConfig()),
                Name: '/pcc-shared-test/config'
            }
        });
        mockEcr.on(DescribeImagesCommand, {
            filter: {
                tagStatus: TagStatus.TAGGED
            },
            repositoryName: 'pcc-test/nginx'
        }).rejects('error!');
        mockEcr.on(DescribeImagesCommand, {
            filter: {
                tagStatus: TagStatus.TAGGED
            },
            repositoryName: 'pcc-test/phpfpm'
        }).resolves({
            imageDetails: [
                {
                    registryId: "abc123",
                    repositoryName: "pcc-test/phpfpm",
                    imageTags: ['5', '3', 'foo'],
                }
            ]
        });
        const preSynthHelper = new PreSynthHelper({
            configDir: configDir,
            clientConfig: {}
        });
        const stackFactory = new CodePipelineStackFactory({
            preSynthHelper: preSynthHelper
        });
        await stackFactory.initialize();
        // console.log(mockSsm.call(0));
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
        const expected = require('../__expected__/stack-factory/code-pipeline-stack-factory.mixed')
        templateHelper.template.templateMatches(expected);
    });

    it('should create a pipeline stack with a custom image', async () => {
        mockSsm.on(GetParameterCommand, {
            Name: '/pcc-shared-test/config'
        }).resolves({
            Parameter: {
                Value: JSON.stringify(getConfig('defaults.mixed.customimage')),
                Name: '/pcc-shared-test/config'
            }
        });
        mockEcr.on(DescribeImagesCommand, {
            filter: {
                tagStatus: TagStatus.TAGGED
            },
            repositoryName: 'pcc-test/nginx'
        }).rejects('error!');
        mockEcr.on(DescribeImagesCommand, {
            filter: {
                tagStatus: TagStatus.TAGGED
            },
            repositoryName: 'pcc-test/phpfpm'
        }).resolves({
            imageDetails: [
                {
                    registryId: "abc123",
                    repositoryName: "pcc-test/phpfpm",
                    imageTags: ['5', '3', 'foo'],
                }
            ]
        });
        const preSynthHelper = new PreSynthHelper({
            configDir: configDir,
            clientConfig: {}
        });
        const stackFactory = new CodePipelineStackFactory({
            preSynthHelper: preSynthHelper
        });
        await stackFactory.initialize();
        // console.log(mockSsm.call(0));
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
        const expected = require('../__expected__/stack-factory/code-pipeline-stack-factory.mixed.customimage')
        templateHelper.template.templateMatches(expected);
    });

    it('should create a pipeline stack from helper function', async () => {
        mockSsm.on(GetParameterCommand, {
            Name: '/pcc-shared-test/config'
        }).resolves({
            Parameter: {
                Value: JSON.stringify(getConfig()),
                Name: '/pcc-shared-test/config'
            }
        });
        mockEcr.on(DescribeImagesCommand, {
            filter: {
                tagStatus: TagStatus.TAGGED
            },
            repositoryName: 'pcc-test/nginx'
        }).rejects('error!');
        mockEcr.on(DescribeImagesCommand, {
            filter: {
                tagStatus: TagStatus.TAGGED
            },
            repositoryName: 'pcc-test/phpfpm'
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
        const stack = await buildCodePipelineMixedStack({
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
        // templateHelper.inspect();
        const expected = require('../__expected__/stack-factory/code-pipeline-stack-factory.mixed')
        templateHelper.template.templateMatches(expected);
    });

    function getConfig(name: string = 'defaults.mixed'): Record<string, any> {
        return require(`../__config__/live/${name}`);
    }
})