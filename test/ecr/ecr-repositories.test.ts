import {EcrRepositoryType} from "../../src/ecr/ecr-definitions";
import {EcrRepositories, EcrRepositoriesProps} from "../../src/ecr/ecr-repositories";
import {ConfigEnvironments} from "../../src/config/config-definitions";

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

    it('can init new golang repository', () => {
        const repositories = new EcrRepositories('my-repos', {
            repositories: [EcrRepositoryType.GOLANG]
        });
        expect(repositories.ecrRepositories.length).toEqual(1);
        expect(repositories.getTagByName(EcrRepositoryType.GOLANG)).toEqual('1');
        expect(repositories.getByName(EcrRepositoryType.GOLANG).exists).toEqual(false);
    });

    it('can init new repositories', () => {
        const repositories = new EcrRepositories('my-repos', baseBuildConfig.Parameters.repositories);
        expect(repositories.ecrRepositories.length).toEqual(2);
        expect(repositories.getTagByName(EcrRepositoryType.PHPFPM)).toEqual('1');
        expect(repositories.getByName(EcrRepositoryType.PHPFPM).exists).toEqual(false);
        expect(repositories.getTagByName(EcrRepositoryType.NGINX)).toEqual('1');
        expect(repositories.getByName(EcrRepositoryType.NGINX).exists).toEqual(false);
    });

    it('can init new repositories with existing tag', () => {
        const repositories = new EcrRepositories('my-repos', baseBuildConfig.Parameters.repositories);
        repositories.applyTagResponses([
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
        expect(repositories.ecrRepositories.length).toEqual(2);
        expect(repositories.getTagByName(EcrRepositoryType.PHPFPM)).toEqual('6');
        expect(repositories.getByName(EcrRepositoryType.PHPFPM).exists).toEqual(false);
        expect(repositories.getTagByName(EcrRepositoryType.NGINX)).toEqual('1');
        expect(repositories.getByName(EcrRepositoryType.NGINX).exists).toEqual(false);
    });

    it('can init existing and new', () => {
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
        const repositories = new EcrRepositories('my-repos', <EcrRepositoriesProps>buildConfig.Parameters.repositories);
        repositories.applyTagResponses([
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
        expect(repositories.ecrRepositories.length).toEqual(2);
        expect(repositories.getTagByName(EcrRepositoryType.PHPFPM)).toEqual('2');
        expect(repositories.getByName(EcrRepositoryType.PHPFPM).exists).toEqual(true);
        expect(repositories.getTagByName(EcrRepositoryType.NGINX)).toEqual('1');
        expect(repositories.getByName(EcrRepositoryType.NGINX).exists).toEqual(false);
    });

    it('can init new repositories with existing tag', () => {
        const repositories = new EcrRepositories('my-repos', baseBuildConfig.Parameters.repositories);
        repositories.applyTagResponses([
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
        expect(repositories.ecrRepositories.length).toEqual(2);
        expect(repositories.getTagByName(EcrRepositoryType.PHPFPM)).toEqual('6');
        expect(repositories.getByName(EcrRepositoryType.PHPFPM).exists).toEqual(false);
        expect(repositories.getTagByName(EcrRepositoryType.NGINX)).toEqual('1');
        expect(repositories.getByName(EcrRepositoryType.NGINX).exists).toEqual(false);
    });
});