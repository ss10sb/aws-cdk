import {IBuildImage} from "aws-cdk-lib/aws-codebuild";
import {PhpVersionHelper} from "../../utils/php-version-helper";

export class BuildStepImage {
    static isCustom = false;

    static fromProps(props: Record<string, any>): IBuildImage {
        if (props.buildStepImage) {
            BuildStepImage.isCustom = true;
            return props.buildStepImage;
        }
        BuildStepImage.isCustom = false;
        return PhpVersionHelper.awsImageFromProps(props);
    }
}