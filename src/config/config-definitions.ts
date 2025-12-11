import {StackProps} from "aws-cdk-lib";
import {EnvConfig} from "../env/env-base-stack";
import {EcrRepositoriesProps} from "../ecr/ecr-repositories";
import {IBuildImage} from "aws-cdk-lib/aws-codebuild";
import {BuildEnvironmentProps, BuildImageProps} from "../v2/build/build-step-environment";
import {BuildStepProps} from "../v2/build/build-step";

export enum PhpVersion {
    PHP81 = 'php81',
    PHP82 = 'php82',
    PHP83 = 'php83',
    PHP84 = 'php84'
}

export enum ConfigEnvironments {
    PROD = 'prod',
    SDLC = 'sdlc',
    SHARED = 'shared',
    SANDBOX = 'sandbox',
    BACKUPS = 'backups'
}

export interface BaseConfig extends Record<string, any> {
    readonly Name: string;
    readonly NameSuffix?: string;
    readonly College: string;
    readonly Environment: string;
    readonly Version?: string;
}

export interface StackConfig extends BaseConfig {
    readonly AWSAccountId?: string;
    readonly AWSRegion?: string;
    readonly Parameters?: ConfigParameters;
    readonly Environments?: EnvConfig[];
}

export interface BaseParameters extends Record<string, any> {
    readonly vpcId?: string;
    readonly albArn?: string;
    readonly phpVersion?: PhpVersion;
    readonly buildStep?: BuildStepProps;
}

export interface ConfigParameters extends BaseParameters {
    readonly repositories?: EcrRepositoriesProps;
}

export interface HelperRunProps {
    idSuffix?: string;
    configBase?: string;
    configEnv?: string;
    configSuffix?: string;
    stackProps?: StackProps;
}