import {IBuildImage, LinuxBuildImage} from "aws-cdk-lib/aws-codebuild";
import {PhpVersion} from "../config/config-definitions";
import {BrefRuntime} from "../lambda/bref-definitions";

export class PhpVersionHelper {

    static forBrefRuntime(version: PhpVersion, fpm: boolean = true): BrefRuntime {
        const map = {
            [PhpVersion.PHP81]: {
                fpm: BrefRuntime.PHP81FPM,
                base: BrefRuntime.PHP81,
            },
            [PhpVersion.PHP82]: {
                fpm: BrefRuntime.PHP82FPM,
                base: BrefRuntime.PHP82,
            },
            [PhpVersion.PHP83]: {
                fpm: BrefRuntime.PHP83FPM,
                base: BrefRuntime.PHP83,
            }
        };
        const brefs = map[version] ?? {};
        return fpm ? brefs.fpm : brefs.base;
    }

    static forAwsImage(version: PhpVersion): IBuildImage {
        const map = {
            [PhpVersion.PHP81]: LinuxBuildImage.STANDARD_6_0,
            [PhpVersion.PHP82]: LinuxBuildImage.STANDARD_7_0,
            [PhpVersion.PHP83]: LinuxBuildImage.STANDARD_7_0
        };
        return map[version];
    }

    static awsImageFromProps(props: Record<string, any>): IBuildImage {
        if (props.phpVersion) {
            return this.forAwsImage(props.phpVersion);
        }
        return LinuxBuildImage.STANDARD_7_0;
    }
}