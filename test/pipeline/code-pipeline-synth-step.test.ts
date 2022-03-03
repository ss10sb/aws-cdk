import {App, Stack} from "aws-cdk-lib";
import {CodePipelineCodestarSource, CodePipelineSynthStep} from "../../src/pipeline";
import {CodePipeline} from "aws-cdk-lib/pipelines";
import {TemplateHelper} from "../../src/utils/testing";
import {Match, Template} from "aws-cdk-lib/assertions";

describe('code pipeline synth step', () => {

    it('should create synth step', () => {
        const app = new App();
        const stackProps = {env: {region: 'us-pipeline', account: '123pipeline'}};
        const stack = new Stack(app, 'stack', stackProps);
        const codeStarSource = new CodePipelineCodestarSource(stack, 'source', {
            connectionArn: "arn:...",
            owner: "repoOwner",
            repo: "repoName"
        });
        const synthStep = new CodePipelineSynthStep(stack, stack.node.id, {
            source: codeStarSource.source
        });
        new CodePipeline(stack, 'pipeline', {
            synth: synthStep.synth
        });
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        templateHelper.expected('AWS::CodeBuild::Project',  [
            {
                key: 'pipelinePipelineBuildstacksynthstepCdkBuildProject',
                properties: Match.objectEquals({
                    Type: 'AWS::CodeBuild::Project',
                    Properties: {
                        Artifacts: {Type: 'CODEPIPELINE'},
                        Environment: {
                            ComputeType: 'BUILD_GENERAL1_SMALL',
                            Image: 'aws/codebuild/standard:5.0',
                            ImagePullCredentialsType: 'CODEBUILD',
                            PrivilegedMode: false,
                            Type: 'LINUX_CONTAINER'
                        },
                        ServiceRole: {'Fn::GetAtt': [templateHelper.startsWithMatch('stacksynthsteprole'), 'Arn']},
                        Source: {
                            BuildSpec: '{\n' +
                                '  "version": "0.2",\n' +
                                '  "phases": {\n' +
                                '    "build": {\n' +
                                '      "commands": [\n' +
                                '        "cp config/_common.js.copy config/_common.js && cp config/defaults.js.copy config/defaults.js",\n' +
                                '        "npm ci",\n' +
                                '        "npm run build",\n' +
                                '        "npx cdk synth"\n' +
                                '      ]\n' +
                                '    }\n' +
                                '  },\n' +
                                '  "artifacts": {\n' +
                                '    "base-directory": "cdk.out",\n' +
                                '    "files": "**/*"\n' +
                                '  }\n' +
                                '}',
                            Type: 'CODEPIPELINE'
                        },
                        Cache: {Type: 'NO_CACHE'},
                        Description: 'Pipeline step stack/Pipeline/Build/stack-synth-step',
                        EncryptionKey: 'alias/aws/s3'
                    }
                })
            },
            {
                key: 'pipelineUpdatePipelineSelfMutation',
                properties: Match.objectEquals({
                    Type: 'AWS::CodeBuild::Project',
                    Properties: {
                        Artifacts: {Type: 'CODEPIPELINE'},
                        Environment: {
                            ComputeType: 'BUILD_GENERAL1_SMALL',
                            Image: 'aws/codebuild/standard:5.0',
                            ImagePullCredentialsType: 'CODEBUILD',
                            PrivilegedMode: false,
                            Type: 'LINUX_CONTAINER'
                        },
                        ServiceRole: {
                            'Fn::GetAtt': [templateHelper.startsWithMatch('pipelineUpdatePipelineSelfMutationRole'), 'Arn']
                        },
                        Source: {
                            BuildSpec: '{\n' +
                                '  "version": "0.2",\n' +
                                '  "phases": {\n' +
                                '    "install": {\n' +
                                '      "commands": [\n' +
                                '        "npm install -g aws-cdk@2"\n' +
                                '      ]\n' +
                                '    },\n' +
                                '    "build": {\n' +
                                '      "commands": [\n' +
                                '        "cdk -a . deploy stack --require-approval=never --verbose"\n' +
                                '      ]\n' +
                                '    }\n' +
                                '  }\n' +
                                '}',
                            Type: 'CODEPIPELINE'
                        },
                        Cache: {Type: 'NO_CACHE'},
                        Description: 'Pipeline step stack/Pipeline/UpdatePipeline/SelfMutate',
                        EncryptionKey: 'alias/aws/s3'
                    }
                })
            }
        ]);
    });
});