import {Construct} from "constructs";
import {AbstractFactory} from "../core/abstract-factory";

export interface ContainerCommandFactoryProps {

}

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

export class ContainerCommandFactory extends AbstractFactory {

    readonly entryPoints: Record<ContainerEntryPoint, string[] | undefined> = ContainerEntryPointDefaults;
    readonly commands: Record<ContainerCommand, string[]> = ContainerCommandDefaults;
    readonly props: ContainerCommandFactoryProps;

    constructor(scope: Construct, id: string, props: ContainerCommandFactoryProps) {
        super(scope, id);
        this.props = props;
    }

    create(entryPoint: ContainerEntryPoint, command: ContainerCommand, additional: string[] = []): ContainerCommandResponse {
        return {
            entryPoint: this.getEntryPoint(entryPoint),
            command: this.createCommand(command, entryPoint, additional)
        }
    }

    createCommand(command: ContainerCommand, entryPoint: ContainerEntryPoint, additional: string[] = []): string[] {
        const cmds: string[] = [];
        cmds.push(...this.getCommandArray(command, additional));
        return cmds;
    }

    private getEntryPoint(entryPoint: ContainerEntryPoint): string[] | undefined {
        return this.entryPoints[entryPoint];
    }

    private getCommandArray(command: ContainerCommand, additional: string[] = []): string[] {
        const cmds: string[] = [];
        cmds.push(...this.commands[command]);
        if (additional.length > 0) {
            cmds.push(...additional);
        }
        return cmds;
    }
}