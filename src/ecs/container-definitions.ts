/* eslint @typescript-eslint/no-empty-interface: "off" */
import {EcrRepositoryFactory, EcrRepositoryType} from "../ecr";
import {PortMapping} from "aws-cdk-lib/aws-ecs";
import {ContainerCommandFactory} from "./container-command-factory";
import {Secrets} from "../secret";

export enum ContainerEntryPoint {
    PHP,
    SH,
    BASH,
    UNDEFINED
}

export const ContainerEntryPointDefaults: Record<ContainerEntryPoint, string[] | undefined> = {
    [ContainerEntryPoint.PHP]: ['/usr/local/bin/php'],
    [ContainerEntryPoint.SH]: ['/bin/sh', '-c'],
    [ContainerEntryPoint.BASH]: ['/bin/bash', '-c'],
    [ContainerEntryPoint.UNDEFINED]: undefined
}

export enum ContainerCommand {
    ARTISAN,
    ON_CREATE,
    ON_UPDATE,
    MIGRATE,
    MIGRATE_SEED,
    MIGRATE_REFRESH,
    SEED,
    QUEUE_WORK,
    QUEUE_ONE,
    QUEUE_EXIT,
    ROLE_SET,
    SCHEDULE_ONE,
    SCHEDULE_WORK,
    UNDEFINED
}

export const ContainerCommandDefaults: Record<ContainerCommand, string[]> = {
    [ContainerCommand.ARTISAN]: [
        'artisan'
    ],
    [ContainerCommand.ON_CREATE]: [
        '/on_create.sh'
    ],
    [ContainerCommand.ON_UPDATE]: [
        '/on_update.sh'
    ],
    [ContainerCommand.MIGRATE]: [
        'artisan',
        'migrate',
        '--force'
    ],
    [ContainerCommand.MIGRATE_SEED]: [
        'artisan',
        'migrate',
        '--seed',
        '--force'
    ],
    [ContainerCommand.MIGRATE_REFRESH]: [
        'artisan',
        'migrate:refresh',
        '--force'
    ],
    [ContainerCommand.SEED]: [
        'artisan',
        'db:seed',
        '--force'],
    [ContainerCommand.QUEUE_WORK]: [
        'artisan',
        'queue:work',
        '--tries=3',
        '--delay=3',
        '--sleep=3'
    ],
    [ContainerCommand.QUEUE_ONE]: [
        'artisan',
        'queue:work',
        '--once',
        '--tries=3',
        '--delay=3',
    ],
    [ContainerCommand.QUEUE_EXIT]: [
        'artisan',
        'queue:work',
        '--stop-when-empty',
        '--tries=3',
        '--delay=3',
    ],
    [ContainerCommand.SCHEDULE_ONE]: [
        'artisan',
        'schedule:run'
    ],
    [ContainerCommand.SCHEDULE_WORK]: [
        'artisan',
        'schedule:work'
    ],
    [ContainerCommand.ROLE_SET]: [
        'artisan',
        'role:set'
    ],
    [ContainerCommand.UNDEFINED]: [],
}

export interface ContainerCommandResponse {
    readonly entryPoint?: string[];
    readonly command?: string[];
}

export interface ContainerCommandFactoryProps {

}

export enum ContainerType {
    UNDEFINED = 'u',
    SERVICE = 's',
    RUN_ONCE_TASK = 'rot',
    SCHEDULED_TASK = 'st',
    CREATE_RUN_ONCE_TASK = 'crot',
    UPDATE_RUN_ONCE_TASK = 'urot'
}

export interface ContainerProps {
    readonly type?: ContainerType;
    readonly image: EcrRepositoryType | string;
    readonly entryPoint?: ContainerEntryPoint;
    readonly command?: ContainerCommand;
    readonly additionalCommand?: string[];
    readonly cpu: number;
    readonly memoryLimitMiB: number;
    readonly portMappings?: PortMapping[];
    readonly hasSecrets?: boolean;
    readonly hasEnv?: boolean;
    readonly essential?: boolean;
    readonly dependency?: boolean;
    readonly dependsOn?: boolean;
}

export interface ContainerFactoryProps {
    readonly repositoryFactory: EcrRepositoryFactory;
    readonly secretKeys?: string[];
    readonly environment?: Record<string, string>;
    readonly commandFactory: ContainerCommandFactory;
    readonly secrets: Secrets;
}