import {StackProps} from "aws-cdk-lib";
import {EnvConfig} from "../env/env-base-stack";
import {EcrRepositoriesProps} from "../ecr/ecr-repositories";

export enum PhpVersion {
    PHP80 = 'php80',
    PHP81 = 'php81',
    PHP82 = 'php82',
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