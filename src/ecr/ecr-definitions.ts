import {IRepository} from "aws-cdk-lib/aws-ecr";
import {ContainerImage} from "aws-cdk-lib/aws-ecs";

export enum EcrRepositoryType {
    NGINX = 'nginx',
    PHPFPM = 'phpfpm',
    CLI = 'cli'
}

export interface EcrRepository {
    name: string | EcrRepositoryType;
    repositoryName: string;
    exists: boolean;
    imageTag?: string;
    repository?: IRepository;
    containerImage?: ContainerImage;
}

export interface EcrRepositoriesProps {
    repositories: EcrRepository[] | string[];
}
