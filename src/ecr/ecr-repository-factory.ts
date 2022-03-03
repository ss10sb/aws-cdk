import {EcrRepository} from "./ecr-definitions";
import {Construct} from "constructs";
import {Repository} from "aws-cdk-lib/aws-ecr";
import {ContainerImage} from "aws-cdk-lib/aws-ecs";
import {RemovalPolicy} from "aws-cdk-lib";
import {NonConstruct} from "../core";
import {EcrRepositories} from "./ecr-repositories";

export class EcrRepositoryFactory extends NonConstruct {
    readonly ecrRepositories: EcrRepositories;
    created = false;

    constructor(scope: Construct, id: string, ecrRepositories: EcrRepositories) {
        super(scope, id);
        this.ecrRepositories = ecrRepositories;
    }

    getEcrRepositories(): EcrRepository[] {
        return this.ecrRepositories.getEcrRepositories();
    }

    getContainerImageByName(name: string): ContainerImage {
        this.create();
        const ecrRepo = this.ecrRepositories.getByName(name);
        if (!ecrRepo.containerImage) {
            ecrRepo.containerImage = this.makeContainerImageByEcrRepository(ecrRepo);
        }
        return <ContainerImage>ecrRepo.containerImage;
    }

    create(): void {
        if (!this.created) {
            for (const ecrRepository of this.ecrRepositories.getEcrRepositories()) {
                if (this.existsOutsideProject(ecrRepository)) {
                    this.existingRepositoryFromEcrRepository(ecrRepository);
                } else {
                    this.createNewRepositoryForEcrRepository(ecrRepository);
                }
            }
            this.created = true;
        }
    }

    private createNewRepositoryForEcrRepository(ecrRepository: EcrRepository): void {
        ecrRepository.repository = new Repository(this.scope, `${ecrRepository.name}-ecr`, {
            repositoryName: ecrRepository.repositoryName,
            removalPolicy: RemovalPolicy.RETAIN,
            imageScanOnPush: true,
            lifecycleRules: [
                {
                    maxImageCount: 3
                }
            ]
        });
    }

    private existsOutsideProject(ecrRepository: EcrRepository): boolean {
        if (ecrRepository.exists) {
            return !this.repositoryNameMatchesDefault(ecrRepository);
        }
        return false;
    }

    private repositoryNameMatchesDefault(ecrRepository: EcrRepository): boolean {
        return ecrRepository.repositoryName === this.ecrRepositories.getDefaultRepositoryName(ecrRepository.name);
    }


    private existingRepositoryFromEcrRepository(ecrRepository: EcrRepository): void {
        ecrRepository.repository = Repository.fromRepositoryName(this.scope, `${ecrRepository.name}-ecr`, ecrRepository.repositoryName);
    }

    private makeContainerImageByEcrRepository(ecrRepository: EcrRepository): ContainerImage | undefined {
        if (ecrRepository.repository) {
            return ContainerImage.fromEcrRepository(ecrRepository.repository, ecrRepository.repositoryName);
        }
    }
}