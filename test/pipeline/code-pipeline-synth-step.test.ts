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
        templateHelper.expected('AWS::CodeBuild::Project', [
            {
                key: 'pipelinePipelineBuildstacksynthstepCdkBuildProject',
                properties: Match.objectEquals({
                    Type: 'AWS::CodeBuild::Project',
                    Properties: {
                        Artifacts: {Type: 'CODEPIPELINE'},
                        Environment: {
                            ComputeType: 'BUILD_GENERAL1_SMALL',
                            Image: 'aws/codebuild/standard:6.0',
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
                            Image: 'aws/codebuild/standard:6.0',
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
        templateHelper.expected('AWS::CodeBuild::Project', [
            {
                key: 'pipelinePipelineBuildstacksynthstepCdkBuildProject',
                properties: Match.objectEquals({
                    Type: 'AWS::CodeBuild::Project',
                    Properties: {
                        Artifacts: {Type: 'CODEPIPELINE'},
                        Environment: {
                            ComputeType: 'BUILD_GENERAL1_SMALL',
                            Image: 'aws/codebuild/standard:6.0',
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
                                '        "cd codebase",\n' +
                                '        "mv resources.copy resources && mv config.copy config && mv public.copy public",\n' +
                                '        "npm ci",\n' +
                                '        "npm run prod",\n' +
                                '        "rm -rf node_modules",\n' +
                                '        "cd ..",\n' +
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