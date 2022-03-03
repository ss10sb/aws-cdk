import {AbstractFactory} from "../core";
import {
    ContainerCommand,
    ContainerCommandDefaults,
    ContainerCommandFactoryProps,
    ContainerCommandResponse,
    ContainerEntryPoint,
    ContainerEntryPointDefaults
} from "./container-definitions";
import {Construct} from "constructs";

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