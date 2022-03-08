import {ConfigEnvironments, ConfigStack} from "../../src/config";
import {EcrRepositories, EcrRepositoriesProps, EcrRepositoryFactory, EcrRepositoryType} from "../../src/ecr";
import {App} from "aws-cdk-lib";
import {Match, Template} from "aws-cdk-lib/assertions";
import {TemplateHelper} from "../../src/utils/testing";
import {EcrImage} from "aws-cdk-lib/aws-ecs";

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

describe('ecr repositories', () => {

    it('can create new repositories', () => {
        const app = new App();
        const stack = new ConfigStack(app, 'test', baseBuildConfig, {}, stackProps);
        const ecrRepositories = new EcrRepositories('my-repos', baseBuildConfig.Parameters.repositories);
        const factory = new EcrRepositoryFactory(stack, 'my-repos', ecrRepositories);
        factory.create();
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        templateHelper.expected('AWS::ECR::Repository', [
            {
                key: 'nginxecr',
                properties: Match.objectEquals({
                    Type: 'AWS::ECR::Repository',
                    Properties: {
                        ImageScanningConfiguration: {ScanOnPush: true},
                        LifecyclePolicy: {
                            LifecyclePolicyText: '{"rules":[{"rulePriority":1,"selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":3},"action":{"type":"expire"}}]}'
                        },
                        RepositoryName: 'my-repos/nginx'
                    },
                    UpdateReplacePolicy: 'Retain',
                    DeletionPolicy: 'Retain'
                })
            },
            {
                key: 'phpfpmecr',
                properties: Match.objectEquals({
                    Type: 'AWS::ECR::Repository',
                    Properties: {
                        ImageScanningConfiguration: {ScanOnPush: true},
                        LifecyclePolicy: {
                            LifecyclePolicyText: '{"rules":[{"rulePriority":1,"selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":3},"action":{"type":"expire"}}]}'
                        },
                        RepositoryName: 'my-repos/phpfpm'
                    },
                    UpdateReplacePolicy: 'Retain',
                    DeletionPolicy: 'Retain'
                })
            }
        ]);
        expect(ecrRepositories.ecrRepositories.length).toEqual(2);
        expect(ecrRepositories.getByName(EcrRepositoryType.PHPFPM).imageTag).toEqual('1');
        expect(ecrRepositories.getByName(EcrRepositoryType.NGINX).imageTag).toEqual('1');
    });

    it('can create new repositories with existing tag', () => {
        const app = new App();
        const stack = new ConfigStack(app, 'test', baseBuildConfig, {}, stackProps);
        const ecrRepositories = new EcrRepositories('my-repos', baseBuildConfig.Parameters.repositories);
        const factory = new EcrRepositoryFactory(stack, 'my-repos', ecrRepositories);
        ecrRepositories.applyTagResponses([
            {
                repositoryName: 'my-repos/nginx',
                imageTag: '1',
                exists: false,
                cached: false
            },
            {
                repositoryName: 'my-repos/phpfpm',
                imageTag: '6',
                exists: false,
                cached: false
            }
        ]);
        factory.create();
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        templateHelper.expected('AWS::ECR::Repository', [
            {
                key: 'nginxecr',
                properties: Match.objectEquals({
                    Type: 'AWS::ECR::Repository',
                    Properties: {
                        ImageScanningConfiguration: {ScanOnPush: true},
                        LifecyclePolicy: {
                            LifecyclePolicyText: '{"rules":[{"rulePriority":1,"selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":3},"action":{"type":"expire"}}]}'
                        },
                        RepositoryName: 'my-repos/nginx'
                    },
                    UpdateReplacePolicy: 'Retain',
                    DeletionPolicy: 'Retain'
                })
            },
            {
                key: 'phpfpmecr',
                properties: Match.objectEquals({
                    Type: 'AWS::ECR::Repository',
                    Properties: {
                        ImageScanningConfiguration: {ScanOnPush: true},
                        LifecyclePolicy: {
                            LifecyclePolicyText: '{"rules":[{"rulePriority":1,"selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":3},"action":{"type":"expire"}}]}'
                        },
                        RepositoryName: 'my-repos/phpfpm'
                    },
                    UpdateReplacePolicy: 'Retain',
                    DeletionPolicy: 'Retain'
                })
            }
        ]);
        expect(ecrRepositories.ecrRepositories.length).toEqual(2);
        expect(ecrRepositories.getByName(EcrRepositoryType.PHPFPM).imageTag).toEqual('6');
        expect(ecrRepositories.getByName(EcrRepositoryType.NGINX).imageTag).toEqual('1');
    });

    it('can mix existing and create', () => {
        const buildConfig = {
            Name: 'test',
            College: 'PCC',
            Environment: ConfigEnvironments.PROD,
            Parameters: {
                repositories: {
                    repositories: [
                        EcrRepositoryType.NGINX,
                        {
                            name: EcrRepositoryType.PHPFPM,
                            repositoryName: 'someother-repo/phpfpm'
                        }
                    ]
                },
            }
        }
        const app = new App();
        const stack = new ConfigStack(app, 'test', buildConfig, {}, stackProps);
        const ecrRepositories = new EcrRepositories('my-repos', <EcrRepositoriesProps>buildConfig.Parameters.repositories);
        const factory = new EcrRepositoryFactory(stack, 'my-repos', ecrRepositories);
        ecrRepositories.applyTagResponses([
            {
                repositoryName: 'my-repos/nginx',
                imageTag: '1',
                exists: false,
                cached: false
            },
            {
                repositoryName: 'someother-repo/phpfpm',
                imageTag: '2',
                exists: true,
                cached: false
            }
        ]);
        factory.create();
        const template = Template.fromStack(stack);
        template.resourceCountIs('AWS::ECR::Repository', 1);
        expect(ecrRepositories.ecrRepositories.length).toEqual(2);
        expect(ecrRepositories.getByName(EcrRepositoryType.PHPFPM).imageTag).toEqual('2');
        expect(ecrRepositories.getByName(EcrRepositoryType.NGINX).imageTag).toEqual('1');
    });

    it('can create new repositories when existing is part of project', () => {
        const app = new App();
        const stack = new ConfigStack(app, 'test', baseBuildConfig, {}, stackProps);
        const ecrRepositories = new EcrRepositories('my-repos', baseBuildConfig.Parameters.repositories);
        const factory = new EcrRepositoryFactory(stack, 'my-repos', ecrRepositories);
        ecrRepositories.applyTagResponses([
            {
                repositoryName: 'my-repos/nginx',
                imageTag: '1',
                exists: false,
                cached: false
            },
            {
                repositoryName: 'my-repos/phpfpm',
                imageTag: '6',
                exists: true,
                cached: false
            }
        ]);
        factory.create();
        const template = Template.fromStack(stack);
        const templateHelper = new TemplateHelper(template);
        templateHelper.expected('AWS::ECR::Repository', [
            {
                key: 'nginxecr',
                properties: Match.objectEquals({
                    Type: 'AWS::ECR::Repository',
                    Properties: {
                        ImageScanningConfiguration: {ScanOnPush: true},
                        LifecyclePolicy: {
                            LifecyclePolicyText: '{"rules":[{"rulePriority":1,"selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":3},"action":{"type":"expire"}}]}'
                        },
                        RepositoryName: 'my-repos/nginx'
                    },
                    UpdateReplacePolicy: 'Retain',
                    DeletionPolicy: 'Retain'
                })
            },
            {
                key: 'phpfpmecr',
                properties: Match.objectEquals({
                    Type: 'AWS::ECR::Repository',
                    Properties: {
                        ImageScanningConfiguration: {ScanOnPush: true},
                        LifecyclePolicy: {
                            LifecyclePolicyText: '{"rules":[{"rulePriority":1,"selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":3},"action":{"type":"expire"}}]}'
                        },
                        RepositoryName: 'my-repos/phpfpm'
                    },
                    UpdateReplacePolicy: 'Retain',
                    DeletionPolicy: 'Retain'
                })
            }
        ]);
        expect(ecrRepositories.ecrRepositories.length).toEqual(2);
        expect(ecrRepositories.getByName(EcrRepositoryType.PHPFPM).imageTag).toEqual('6');
        expect(ecrRepositories.getByName(EcrRepositoryType.NGINX).imageTag).toEqual('1');
    });

    it('should add container image', () => {
        const app = new App();
        const stack = new ConfigStack(app, 'test', baseBuildConfig, {}, stackProps);
        const ecrRepositories = new EcrRepositories('my-repos', baseBuildConfig.Parameters.repositories);
        const factory = new EcrRepositoryFactory(stack, 'my-repos', ecrRepositories);
        factory.create();
        const image = <EcrImage>factory.getContainerImageByName(EcrRepositoryType.PHPFPM);
        expect(image.imageName).toMatch(new RegExp(/^\${Token.*\.dkr\.ecr\.\${Token.*\.\${Token\[AWS\.URLSuffix.*\/\${Token.*:1/));
    });
});