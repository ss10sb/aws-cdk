import {App, Stack} from "aws-cdk-lib";
import {CodePipelineCodestarSource, CodePipelineEcrStep} from "../../src/pipeline";
import {Role, ServicePrincipal} from "aws-cdk-lib/aws-iam";
import {TemplateHelper} from "../../src/utils/testing";
import {Match, Template} from "aws-cdk-lib/assertions";
import {Repository} from "aws-cdk-lib/aws-ecr";
import {CodePipeline, ShellStep} from "aws-cdk-lib/pipelines";

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
                                                            'Fn::GetAtt': [ templateHelper.startsWithMatch('repo'), 'Arn' ]
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
                                                            'Fn::GetAtt': [ templateHelper.startsWithMatch('repo'), 'Arn' ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        '.',
                                        { Ref: 'AWS::URLSuffix' },
                                        '/',
                                        { Ref: templateHelper.startsWithMatch('repo') }
                                    ]
                                ]
                            }
                        },
                        {
                            Name: 'DOCKER_NAME',
                            Type: 'PLAINTEXT',
                            Value: 'build-something'
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
                Description: 'Pipeline step stack/Pipeline/ecr/build-something-ecr-step',
                EncryptionKey: 'alias/aws/s3'
            }
        }));
        templateHelper.template.hasResource('AWS::IAM::Policy', Match.objectEquals({
            Type: 'AWS::IAM::Policy',
            Properties: {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: [
                                'codebuild:BatchGetBuilds',
                                'codebuild:StartBuild',
                                'codebuild:StopBuild'
                            ],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    templateHelper.startsWithMatch('pipelinePipelineecrbuildsomethingecrstep'),
                                    'Arn'
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: templateHelper.startsWithMatch('pipelinePipelineecrbuildsomethingecrstepCodePipelineActionRoleDefaultPolicy'),
                Roles: [
                    {
                        Ref: templateHelper.startsWithMatch('pipelinePipelineecrbuildsomethingecrstepCodePipelineActionRole')
                    }
                ]
            }
        }));
    });
});