import {App, Stack} from "aws-cdk-lib";
import {CodePipelineCodestarSource, CodePipelineEcrSteps} from "../../src/pipeline";
import {CodePipeline, ShellStep} from "aws-cdk-lib/pipelines";
import {ConfigEnvironments} from "../../src/config";
import {EcrRepositories, EcrRepositoryFactory, EcrRepositoryType} from "../../src/ecr";
import {TemplateHelper} from "../../src/utils/testing";
import {Match, Template} from "aws-cdk-lib/assertions";

describe('code pipeline ecr steps', () => {

    it('should create a step for each repository', () => {
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
        const app = new App();
        const stackProps = {env: {region: 'us-pipeline', account: '123pipeline'}};
        const stack = new Stack(app, 'stack', stackProps);
        const codeStarSource = new CodePipelineCodestarSource(stack, 'source', {
            connectionArn: "arn:...",
            owner: "repoOwner",
            repo: "repoName"
        });
        const pipeline = new CodePipeline(stack, 'pipeline', {
            synth: new ShellStep('synth', {
                input: codeStarSource.source,
                commands: ['npm']
            })
        });
        const ecrRepositories = new EcrRepositories(stack.node.id, baseBuildConfig.Parameters.repositories);
        const factory = new EcrRepositoryFactory(stack, stack.node.id, ecrRepositories);
        factory.create();
        const ecrSteps = new CodePipelineEcrSteps(stack, stack.node.id, {
            source: codeStarSource,
            repositories: ecrRepositories
        });
        pipeline.addWave('ecr', {
            post: ecrSteps.steps
        });
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        templateHelper.template.hasResource('AWS::CodeBuild::Project', Match.objectEquals({
            Type: 'AWS::CodeBuild::Project',
            Properties: {
                Artifacts: { Type: 'CODEPIPELINE' },
                Environment: {
                    ComputeType: 'BUILD_GENERAL1_SMALL',
                    EnvironmentVariables: [
                        {
                            Name: 'ECR_URI',
                            Type: 'PLAINTEXT',
                            Value: {
                                'Fn::Join': [
                                    '',
                                    [
                                        {
                                            'Fn::Select': [
                                                4,
                                                {
                                                    'Fn::Split': [
                                                        ':',
                                                        {
                                                            'Fn::GetAtt': [ templateHelper.startsWithMatch('nginxecr'), 'Arn' ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        '.dkr.ecr.',
                                        {
                                            'Fn::Select': [
                                                3,
                                                {
                                                    'Fn::Split': [
                                                        ':',
                                                        {
                                                            'Fn::GetAtt': [ templateHelper.startsWithMatch('nginxecr'), 'Arn' ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        '.',
                                        { Ref: 'AWS::URLSuffix' },
                                        '/',
                                        { Ref: templateHelper.startsWithMatch('nginxecr') }
                                    ]
                                ]
                            }
                        },
                        {
                            Name: 'DOCKER_NAME',
                            Type: 'PLAINTEXT',
                            Value: 'nginx'
                        },
                        { Name: 'IMAGE_TAG', Type: 'PLAINTEXT', Value: '1' },
                        {
                            Name: 'ECR_REGION',
                            Type: 'PLAINTEXT',
                            Value: 'us-pipeline'
                        }
                    ],
                    Image: 'aws/codebuild/standard:5.0',
                    ImagePullCredentialsType: 'CODEBUILD',
                    PrivilegedMode: true,
                    Type: 'LINUX_CONTAINER'
                },
                ServiceRole: { 'Fn::GetAtt': [ templateHelper.startsWithMatch('stackecrsteprole'), 'Arn' ] },
                Source: {
                    BuildSpec: '{\n' +
                        '  "version": "0.2",\n' +
                        '  "phases": {\n' +
                        '    "build": {\n' +
                        '      "commands": [\n' +
                        '        "echo Login to AWS ECR",\n' +
                        '        "aws ecr get-login-password --region $ECR_REGION | docker login --username AWS --password-stdin $ECR_URI",\n' +
                        '        "echo Build started on `date`",\n' +
                        '        "echo \\"Building the Docker image: $ECR_URI:$IMAGE_TAG\\"",\n' +
                        '        "docker build -t $ECR_URI:latest -t $ECR_URI:$IMAGE_TAG -f docker/Dockerfile.$DOCKER_NAME .",\n' +
                        '        "echo Pushing the Docker image...",\n' +
                        '        "docker push $ECR_URI:$IMAGE_TAG",\n' +
                        '        "docker push $ECR_URI:latest",\n' +
                        '        "echo Build completed on `date`"\n' +
                        '      ]\n' +
                        '    }\n' +
                        '  }\n' +
                        '}',
                    Type: 'CODEPIPELINE'
                },
                Cache: { Type: 'NO_CACHE' },
                Description: 'Pipeline step stack/Pipeline/ecr/nginx-ecr-step',
                EncryptionKey: 'alias/aws/s3'
            }
        }));
        templateHelper.template.hasResource('AWS::CodeBuild::Project', Match.objectEquals({
            Type: 'AWS::CodeBuild::Project',
            Properties: {
                Artifacts: { Type: 'CODEPIPELINE' },
                Environment: {
                    ComputeType: 'BUILD_GENERAL1_SMALL',
                    EnvironmentVariables: [
                        {
                            Name: 'ECR_URI',
                            Type: 'PLAINTEXT',
                            Value: {
                                'Fn::Join': [
                                    '',
                                    [
                                        {
                                            'Fn::Select': [
                                                4,
                                                {
                                                    'Fn::Split': [
                                                        ':',
                                                        {
                                                            'Fn::GetAtt': [ templateHelper.startsWithMatch('phpfpmecr'), 'Arn' ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        '.dkr.ecr.',
                                        {
                                            'Fn::Select': [
                                                3,
                                                {
                                                    'Fn::Split': [
                                                        ':',
                                                        {
                                                            'Fn::GetAtt': [ templateHelper.startsWithMatch('phpfpmecr'), 'Arn' ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        '.',
                                        { Ref: 'AWS::URLSuffix' },
                                        '/',
                                        { Ref: templateHelper.startsWithMatch('phpfpmecr') }
                                    ]
                                ]
                            }
                        },
                        {
                            Name: 'DOCKER_NAME',
                            Type: 'PLAINTEXT',
                            Value: 'phpfpm'
                        },
                        { Name: 'IMAGE_TAG', Type: 'PLAINTEXT', Value: '1' },
                        {
                            Name: 'ECR_REGION',
                            Type: 'PLAINTEXT',
                            Value: 'us-pipeline'
                        }
                    ],
                    Image: 'aws/codebuild/standard:5.0',
                    ImagePullCredentialsType: 'CODEBUILD',
                    PrivilegedMode: true,
                    Type: 'LINUX_CONTAINER'
                },
                ServiceRole: { 'Fn::GetAtt': [ templateHelper.startsWithMatch('stackecrsteprole'), 'Arn' ] },
                Source: {
                    BuildSpec: '{\n' +
                        '  "version": "0.2",\n' +
                        '  "phases": {\n' +
                        '    "build": {\n' +
                        '      "commands": [\n' +
                        '        "echo Login to AWS ECR",\n' +
                        '        "aws ecr get-login-password --region $ECR_REGION | docker login --username AWS --password-stdin $ECR_URI",\n' +
                        '        "echo Build started on `date`",\n' +
                        '        "echo \\"Building the Docker image: $ECR_URI:$IMAGE_TAG\\"",\n' +
                        '        "docker build -t $ECR_URI:latest -t $ECR_URI:$IMAGE_TAG -f docker/Dockerfile.$DOCKER_NAME .",\n' +
                        '        "echo Pushing the Docker image...",\n' +
                        '        "docker push $ECR_URI:$IMAGE_TAG",\n' +
                        '        "docker push $ECR_URI:latest",\n' +
                        '        "echo Build completed on `date`"\n' +
                        '      ]\n' +
                        '    }\n' +
                        '  }\n' +
                        '}',
                    Type: 'CODEPIPELINE'
                },
                Cache: { Type: 'NO_CACHE' },
                Description: 'Pipeline step stack/Pipeline/ecr/phpfpm-ecr-step',
                EncryptionKey: 'alias/aws/s3'
            }
        }));
    });
});