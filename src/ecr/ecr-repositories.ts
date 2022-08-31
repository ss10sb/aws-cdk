import {EcrRepositoryType} from "./ecr-definitions";
import {IRepository} from "aws-cdk-lib/aws-ecr";
import {ContainerImage} from "aws-cdk-lib/aws-ecs";
import {TagResponse} from "../utils/sdk/ecr-tag";
import {NamingHelper} from "../utils/naming-helper";

export interface EcrRepositoriesProps {
    repositories: EcrRepository[] | string[];
}

export interface EcrRepository {
    name: string | EcrRepositoryType;
    repositoryName: string;
    exists: boolean;
    imageTag?: string;
    repository?: IRepository;
    containerImage?: ContainerImage;
}

export class EcrRepositories {

    readonly id: string;
    readonly props: EcrRepositoriesProps;
    ecrRepositories: EcrRepository[] = [];

    constructor(id: string, props: EcrRepositoriesProps) {
        this.id = id;
        this.props = props;
        this.init();
    }

    hasName(name: string): boolean {
        return this.getExistingByName(name) !== undefined;
    }

    getByName(name: string): EcrRepository {
        let repository = this.getExistingByName(name);
        if (repository !== undefined) {
            return repository;
        }
        repository = {
            name: name,
            repositoryName: this.getDefaultRepositoryName(name),
            exists: false,
            imageTag: '1'
        }
        this.ecrRepositories.push(repository);
        return repository;
    }

    getTagByName(name: string): string {
        return this.getByName(name).imageTag ?? '1';
    }

    getByEcrRepository(ecrRepository: EcrRepository): EcrRepository {
        let existingRepository = this.getExistingByName(ecrRepository.name);
        if (!existingRepository) {
            existingRepository = ecrRepository;
        } else {
            existingRepository.repositoryName = ecrRepository.repositoryName;
            existingRepository.exists = ecrRepository.exists;
        }
        this.ecrRepositories.push(existingRepository);
        return existingRepository;
    }

    applyTagResponses(tagResponses: TagResponse[]): void {
        for (const tagResponse of tagResponses) {
            const ecrRepository = this.getEcrRepositoryByRepositoryName(tagResponse.repositoryName);
            if (ecrRepository) {
                ecrRepository.imageTag = tagResponse.imageTag;
                ecrRepository.exists = tagResponse.exists;
            }
        }
    }

    getRepositoryArray(): IRepository[] {
        const repos: IRepository[] = [];
        for (const repository of this.getEcrRepositories()) {
            if (repository.repository) {
                repos.push(repository.repository);
            }
        }
        return repos;
    }

    getEcrRepositoryByRepositoryName(repositoryName: string): EcrRepository | undefined {
        for (const ecrRepository of this.getEcrRepositories()) {
            if (ecrRepository.repositoryName === repositoryName) {
                return ecrRepository;
            }
        }
    }

    getEcrRepositories(): EcrRepository[] {
        return this.ecrRepositories;
    }

    getRepositoryNameFromEcrRepository(ecrRepository: EcrRepository): string {
        if (ecrRepository.repository) {
            return ecrRepository.repository.repositoryName;
        }
        return this.getDefaultRepositoryName(ecrRepository.name);
    }

    getDefaultRepositoryName(name: string): string {
        return NamingHelper.fromParts([this.id, name], '/');
    }

    getRepositoryName(name: string): string {
        const repository = this.getByName(name);
        return this.getRepositoryNameFromEcrRepository(repository);
    }

    private getExistingByName(name: string): EcrRepository | undefined {
        for (const repository of this.getEcrRepositories()) {
            if (repository.name === name) {
                return repository;
            }
        }
    }

    private isString(check: any): boolean {
        return (typeof check === 'string' || check instanceof String);
    }

    private init(): void {
        for (const prop of this.props.repositories) {
            if (this.isString(prop)) {
                this.getByName(<string>prop);
            } else {
                this.getByEcrRepository(<EcrRepository>prop);
            }
        }
    }
}