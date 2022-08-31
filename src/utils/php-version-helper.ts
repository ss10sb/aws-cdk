import {IBuildImage, LinuxBuildImage} from "aws-cdk-lib/aws-codebuild";
import {PhpVersion} from "../config/config-definitions";
import {BrefRuntime} from "../lambda/bref-definitions";

export class PhpVersionHelper {

    static forBrefRuntime(version: PhpVersion, fpm: boolean = true): BrefRuntime {
        const map = {
            [PhpVersion.PHP80]: {
                fpm: BrefRuntime.PHP80FPM,
                base: BrefRuntime.PHP80
            },
            [PhpVersion.PHP81]: {
                fpm: BrefRuntime.PHP81FPM,
                base: BrefRuntime.PHP81,
            },
            [PhpVersion.PHP82]: {
                fpm: BrefRuntime.PHP82FPM,
                base: BrefRuntime.PHP82,
            }
        };
        const brefs = map[version] ?? {};
        return fpm ? brefs.fpm : brefs.base;
    }

    static forAwsImage(version: PhpVersion): IBuildImage {
        const map = {
            [PhpVersion.PHP80]: LinuxBuildImage.STANDARD_5_0,
            [PhpVersion.PHP81]: LinuxBuildImage.STANDARD_5_0,
            [PhpVersion.PHP82]: LinuxBuildImage.STANDARD_6_0
        };
        return map[version];
    }

    static awsImageFromProps(props: Record<string, any>): IBuildImage {
        if (props.phpVersion) {
            return this.forAwsImage(props.phpVersion);
        }
        return LinuxBuildImage.STANDARD_6_0;
    }
}