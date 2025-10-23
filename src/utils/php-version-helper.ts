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
            },
            [PhpVersion.PHP84]: {
                fpm: BrefRuntime.PHP84FPM,
                base: BrefRuntime.PHP84,
            }
        };
        const brefs = map[version] ?? {};
        return fpm ? brefs.fpm : brefs.base;
    }

    static forAwsImage(version: PhpVersion): IBuildImage {
        const map = {
            [PhpVersion.PHP81]: LinuxBuildImage.STANDARD_6_0,
            [PhpVersion.PHP82]: LinuxBuildImage.STANDARD_7_0,
            [PhpVersion.PHP83]: LinuxBuildImage.STANDARD_7_0,
            [PhpVersion.PHP84]: LinuxBuildImage.STANDARD_7_0 // does not currently have 8.4
        };
        return map[version];
    }

    static awsImageFromProps(props: Record<string, any>): IBuildImage {
        if (props.phpVersion) {
            return this.forAwsImage(props.phpVersion);
        }
        return LinuxBuildImage.STANDARD_7_0;
    }

    static runtimeVersionFromProps(props: Record<string, any>): string {
        return this.runtimeVersion(props.phpVersion);
    }

    static runtimeVersion(version?: PhpVersion): string {
        const map = {
            [PhpVersion.PHP81]: '8.1',
            [PhpVersion.PHP82]: '8.2',
            [PhpVersion.PHP83]: '8.3',
            [PhpVersion.PHP84]: '8.4',
        }
        if (version) {
            return map[version];
        }

        return map[PhpVersion.PHP83];
    }
}