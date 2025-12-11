import {NonConstruct} from "../../core/non-construct";
import {PhpVersion} from "../../config/config-definitions";
import {BuildEnvironment, ComputeType, IBuildImage, LinuxBuildImage} from "aws-cdk-lib/aws-codebuild";
import {PhpVersionHelper} from "../../utils/php-version-helper";
import {Repository} from "aws-cdk-lib/aws-ecr";

export interface BuildImageProps {
    ecrArn?: string;
    ecrName?: string;
    publicUri?: string;
    tag?: string;
    environment?: Record<string, any>;
}

export interface BuildEnvironmentProps {
    buildImage?: BuildImageProps;
    phpVersion?: PhpVersion;
    computeType?: ComputeType;
    environment?: Record<string, any>;
}

export class BuildStepEnvironment extends NonConstruct {
    props: BuildEnvironmentProps;
    isCustom = false;

    constructor(scope: any, id: string, props: BuildEnvironmentProps) {
        super(scope, id);
        this.props = props;
    }

    buildEnvironment(): BuildEnvironment {
        const buildImage = this.buildImage();
        return {
            buildImage: buildImage,
            computeType: this.props.computeType,
            privileged: this.isCustom,
            environmentVariables: this.props.environment
        }
    }

    static defaultBuildImage(): IBuildImage {
        return LinuxBuildImage.STANDARD_7_0;
    }

    buildImage(): IBuildImage {
        if (this.props.buildImage) {
            return this.buildImageFromBuildImageProps(this.props.buildImage);
        }
        if (this.props.phpVersion) {
            return PhpVersionHelper.awsImageFromProps(this.props);
        }
        return BuildStepEnvironment.defaultBuildImage();
    }

    protected buildImageFromBuildImageProps(props: BuildImageProps): IBuildImage {
        if (props.ecrArn) {
            this.isCustom = true;
            return LinuxBuildImage.fromEcrRepository(
                Repository.fromRepositoryArn(this.scope, 'build-image', props.ecrArn),
                props.tag
            );
        }
        if (props.ecrName) {
            this.isCustom = true;
            return LinuxBuildImage.fromEcrRepository(
                Repository.fromRepositoryName(this.scope, 'build-image', props.ecrName),
                props.tag
            );
        }
        if (props.publicUri) {
            this.isCustom = true;
            return LinuxBuildImage.fromDockerRegistry(
                props.publicUri
            );
        }
        return LinuxBuildImage.STANDARD_7_0;
    }
}