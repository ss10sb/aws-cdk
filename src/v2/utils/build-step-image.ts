import {IBuildImage, LinuxBuildImage} from "aws-cdk-lib/aws-codebuild";
import {PhpVersionHelper} from "../../utils/php-version-helper";
import {Repository} from "aws-cdk-lib/aws-ecr";
import {Construct} from "constructs";

export interface BuildStepImageProps {
    dockerImage?: string;
    ecrImage?: string;
    ecrArn?: string;
    tag?: string;
}

export class BuildStepImage {
    static isCustom = false;

    static fromProps(scope: Construct, id: string, props: Record<string, any>): IBuildImage {
        if (props.buildStepImage) {
            BuildStepImage.isCustom = true;
            return BuildStepImage.fromBuildStepImageProps(scope, id, props.buildStepImage);
        }
        BuildStepImage.isCustom = false;
        return PhpVersionHelper.awsImageFromProps(props);
    }

    static fromBuildStepImageProps(scope: Construct, id: string, props: BuildStepImageProps): IBuildImage {
        if (props.ecrImage) {
            return LinuxBuildImage.fromEcrRepository(Repository.fromRepositoryName(
                scope,
                `${id}-ecr-build-step-image`,
                props.ecrImage
            ), props.tag);
        }
        if (props.ecrArn) {
            return LinuxBuildImage.fromEcrRepository(Repository.fromRepositoryArn(
                scope,
                `${id}-ecr-build-step-image`,
                props.ecrArn
            ), props.tag);
        }
        if (props.dockerImage) {
            return LinuxBuildImage.fromDockerRegistry(props.dockerImage);
        }
        throw Error('No build step image provided');
    }
}