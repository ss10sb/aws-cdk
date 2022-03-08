import {ConfigEnvironments} from "../../src/config";
import {EcrRepositories, EcrRepositoryFactory, EcrRepositoryType} from "../../src/ecr";
import {App, Stack} from "aws-cdk-lib";
import {Template} from "aws-cdk-lib/assertions";
import {TemplateHelper} from "../../src/utils/testing";
import {PermissionsEcr} from "../../src/permissions";

const stackProps = {env: {region: 'us-east-1', account: '12344'}};

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

describe('permissions ecr', () => {

    it('should add account root permissions to repository policy text', () => {
        const app = new App();
        const stack = new Stack(app, 'stack', stackProps);
        const ecrRepositories = new EcrRepositories(stack.node.id, baseBuildConfig.Parameters.repositories);
        const factory = new EcrRepositoryFactory(stack, stack.node.id, ecrRepositories);
        factory.create();
        PermissionsEcr.replacePolicyTextForAccountIds(['11111', '22222'], factory.ecrRepositories);
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        const expected = {
            Resources: {
                nginxecrC430EE7B: {
                    Type: 'AWS::ECR::Repository',
                    Properties: {
                        ImageScanningConfiguration: { ScanOnPush: true },
                        LifecyclePolicy: {
                            LifecyclePolicyText: '{"rules":[{"rulePriority":1,"selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":3},"action":{"type":"expire"}}]}'
                        },
                        RepositoryName: 'stack/nginx',
                        RepositoryPolicyText: {
                            Version: '2012-10-17',
                            Statement: [
                                {
                                    Effect: 'Allow',
                                    Principal: {
                                        AWS: [
                                            'arn:aws:iam::11111:root',
                                            'arn:aws:iam::22222:root'
                                        ]
                                    },
                                    Action: [
                                        'ecr:BatchCheckLayerAvailability',
                                        'ecr:BatchGetImage',
                                        'ecr:GetDownloadUrlForLayer',
                                        'ecr:DescribeImages'
                                    ]
                                }
                            ]
                        }
                    },
                    UpdateReplacePolicy: 'Retain',
                    DeletionPolicy: 'Retain'
                },
                phpfpmecr3C5F411B: {
                    Type: 'AWS::ECR::Repository',
                    Properties: {
                        ImageScanningConfiguration: { ScanOnPush: true },
                        LifecyclePolicy: {
                            LifecyclePolicyText: '{"rules":[{"rulePriority":1,"selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":3},"action":{"type":"expire"}}]}'
                        },
                        RepositoryName: 'stack/phpfpm',
                        RepositoryPolicyText: {
                            Version: '2012-10-17',
                            Statement: [
                                {
                                    Effect: 'Allow',
                                    Principal: {
                                        AWS: [
                                            'arn:aws:iam::11111:root',
                                            'arn:aws:iam::22222:root'
                                        ]
                                    },
                                    Action: [
                                        'ecr:BatchCheckLayerAvailability',
                                        'ecr:BatchGetImage',
                                        'ecr:GetDownloadUrlForLayer',
                                        'ecr:DescribeImages'
                                    ]
                                }
                            ]
                        }
                    },
                    UpdateReplacePolicy: 'Retain',
                    DeletionPolicy: 'Retain'
                }
            },
            Parameters: {
                BootstrapVersion: {
                    Type: 'AWS::SSM::Parameter::Value<String>',
                    Default: '/cdk-bootstrap/hnb659fds/version',
                    Description: 'Version of the CDK Bootstrap resources in this environment, automatically retrieved from SSM Parameter Store. [cdk:skip]'
                }
            },
            Rules: {
                CheckBootstrapVersion: {
                    Assertions: [
                        {
                            Assert: {
                                'Fn::Not': [
                                    {
                                        'Fn::Contains': [
                                            [ '1', '2', '3', '4', '5' ],
                                            { Ref: 'BootstrapVersion' }
                                        ]
                                    }
                                ]
                            },
                            AssertDescription: "CDK bootstrap stack version 6 required. Please run 'cdk bootstrap' with a recent version of the CDK CLI."
                        }
                    ]
                }
            }
        };
        templateHelper.template.templateMatches(expected);
    });
});