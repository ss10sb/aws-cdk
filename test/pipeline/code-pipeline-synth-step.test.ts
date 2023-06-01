import {App, Stack} from "aws-cdk-lib";
import {CodePipeline} from "aws-cdk-lib/pipelines";
import {Match, Template} from "aws-cdk-lib/assertions";
import {CodePipelineSynthStep} from "../../src/pipeline/code-pipeline-synth-step";
import {CodePipelineCodestarSource} from "../../src/pipeline/code-pipeline-codestar-source";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {EnvBuildType} from "../../src/env/env-definitions";

describe('code pipeline synth step', () => {

    it('should create ecs synth step', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-pipeline', account: '123pipeline'}};
        const stack = new Stack(app, 'stack', stackProps);
        const codeStarSource = new CodePipelineCodestarSource(stack, 'source', {
            connectionArn: "arn:...",
            owner: "repoOwner",
            repo: "repoName"
        });
        const synthStep = new CodePipelineSynthStep(stack, stack.node.id, {
            input: codeStarSource.source
        });
        new CodePipeline(stack, 'pipeline', {
            synth: synthStep.synth
        });
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        // templateHelper.inspect();
        const expected = require('../__templates__/code-pipeline-ecs-synth-step');
        templateHelper.template.templateMatches(expected);
    });

    it('should create lambda synth step', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-pipeline', account: '123pipeline'}};
        const stack = new Stack(app, 'stack', stackProps);
        const codeStarSource = new CodePipelineCodestarSource(stack, 'source', {
            connectionArn: "arn:...",
            owner: "repoOwner",
            repo: "repoName"
        });
        const synthStep = new CodePipelineSynthStep(stack, stack.node.id, {
            input: codeStarSource.source,
            type: EnvBuildType.LAMBDA
        });
        new CodePipeline(stack, 'pipeline', {
            synth: synthStep.synth
        });
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        // templateHelper.inspect();
        const expected = require('../__templates__/code-pipeline-lambda-synth-step');
        templateHelper.template.templateMatches(expected);
    });
});