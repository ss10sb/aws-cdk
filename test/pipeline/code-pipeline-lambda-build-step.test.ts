import {App, Stack} from "aws-cdk-lib";
import {CodePipelineCodestarSource} from "../../src/pipeline/code-pipeline-codestar-source";
import {CodePipelineLambdaBuildStep} from "../../src/pipeline/code-pipeline-lambda-build-step";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {Match, Template} from "aws-cdk-lib/assertions";
import {CodePipelineSynthStep} from "../../src/pipeline/code-pipeline-synth-step";
import {EnvBuildType} from "../../src/env/env-definitions";
import {CodePipelinePipeline, CodePipelinePipelineProps} from "../../src/pipeline/code-pipeline-pipeline";
import {BuildStep} from "../../src/v2/build/build-step";

describe('code pipeline lambda build step', () => {

    it('should create lambda build step', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-pipeline', account: '123pipeline'}};
        const stack = new Stack(app, 'stack', stackProps);
        const codeStarSource = new CodePipelineCodestarSource(stack, 'source', {
            connectionArn: "arn:...",
            owner: "repoOwner",
            repo: "repoName",
            branch: 'foo'
        });
        const buildStep = new CodePipelineLambdaBuildStep(stack, 'build', {
            input: codeStarSource.source,
            buildStep: BuildStep.makePropsFromParameters({})
        });
        const synthStep = new CodePipelineSynthStep(stack, 'synth', {
            input: buildStep.step,
            type: EnvBuildType.LAMBDA
        });
        const codePipelineProps: CodePipelinePipelineProps = {
            source: codeStarSource,
            synth: synthStep
        };
        new CodePipelinePipeline(stack, 'pipeline', codePipelineProps);
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        // templateHelper.inspect();
        const expected = require('../__templates__/code-pipeline-lambda-build-step');
        templateHelper.template.templateMatches(expected);
    });
});