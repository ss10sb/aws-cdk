import {App, Stack} from "aws-cdk-lib";
import {Role, ServicePrincipal} from "aws-cdk-lib/aws-iam";
import {Match, Template} from "aws-cdk-lib/assertions";
import {Repository} from "aws-cdk-lib/aws-ecr";
import {CodePipeline, ShellStep} from "aws-cdk-lib/pipelines";
import {CodePipelineCodestarSource} from "../../src/pipeline/code-pipeline-codestar-source";
import {CodePipelineEcrStep} from "../../src/pipeline/code-pipeline-ecr-step";
import {TemplateHelper} from "../../src/utils/testing/template-helper";

describe('code pipeline ecr step', () => {

    it('should create ecr step', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-pipeline', account: '123pipeline'}};
        const stack = new Stack(app, 'stack', stackProps);
        const codeStarSource = new CodePipelineCodestarSource(stack, 'source', {
            connectionArn: "arn:...",
            owner: "repoOwner",
            repo: "repoName"
        });
        const repository = new Repository(stack, 'repo');
        const ecrStep = new CodePipelineEcrStep(stack, stack.node.id, {
            imageTag: "1",
            name: "build-something",
            repository: repository,
            role: new Role(stack, `${stack.node.id}-ecr-step-role`, {
                assumedBy: new ServicePrincipal('codebuild.amazonaws.com')
            }),
            source: codeStarSource
        });
        const pipeline = new CodePipeline(stack, 'pipeline', {
            synth: new ShellStep('synth', {
                input: codeStarSource.source,
                commands: ['npm']
            })
        });
        pipeline.addWave('ecr', {
            post: [ecrStep.step]
        });
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        // templateHelper.inspect();
        templateHelper.template.templateMatches(getExpected());
    });

    function getExpected() {
        return require('../__templates__/code-pipeline-ecr-step');
    }
});