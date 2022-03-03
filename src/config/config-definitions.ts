import {EcrRepositoriesProps} from "../ecr";
import {EnvConfig} from "../env";
import {StackProps} from "aws-cdk-lib";

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
}

export interface ConfigParameters extends BaseParameters {
    readonly repositories?: EcrRepositoriesProps;
}

export interface ConfigStackProps {
    suffix?: string;
}

export interface HelperRunProps {
    idSuffix?: string;
    configBase?: string;
    configEnv?: string;
    configSuffix?: string;
    stackProps?: StackProps;
}