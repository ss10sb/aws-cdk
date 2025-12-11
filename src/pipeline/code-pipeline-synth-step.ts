import {CodeBuildStep, CodePipelineSource, IFileSetProducer} from "aws-cdk-lib/pipelines";
import {Role, ServicePrincipal} from "aws-cdk-lib/aws-iam";
import {Construct} from "constructs";
import {EnvBuildType} from "../env/env-definitions";
import {NonConstruct} from "../core/non-construct";
import {BuildStepEnvironment} from "../v2/build/build-step-environment";

export interface CodePipelineSynthStepProps {
    input: CodePipelineSource | CodeBuildStep;
    type?: EnvBuildType;
}

export class CodePipelineSynthStep extends NonConstruct {

    readonly synth: IFileSetProducer | CodeBuildStep;
    readonly props: CodePipelineSynthStepProps;
    readonly role: Role;

    constructor(scope: Construct, id: string, props: CodePipelineSynthStepProps) {
        super(scope, id);
        this.props = props;
        this.role = new Role(this.scope, this.mixNameWithId('synth-step-role'), {
            assumedBy: new ServicePrincipal('codebuild.amazonaws.com')
        });
        this.synth = this.createSynth();
    }

    protected createSynth(): IFileSetProducer | CodeBuildStep {
        return new CodeBuildStep(this.mixNameWithId('synth-step'), {
            input: this.props.input,
            installCommands: this.getInstallCommands(),
            commands: this.getCommands(),
            role: this.role,
            buildEnvironment: {
                buildImage: BuildStepEnvironment.defaultBuildImage()
            }
        });
    }

    protected getCommands(): string[] {
        const commands: string[] = [];
        commands.push(...this.getCommandsForBuildType(this.getBuildType()));
        commands.push(...[
            this.getCopyCommand(),
            'npm ci',
            'npm run build',
            'npx cdk synth',
        ]);
        return commands;
    }

    protected getInstallCommands(): string[] {
        const commands: string[] = [];
        commands.push(...this.getInstallCommandsForBuildType(this.getBuildType()));
        return commands;
    }

    protected getInstallCommandsForBuildType(type: EnvBuildType): string[] {
        if (type === EnvBuildType.ECS) {
            return [];
        }
        if (type === EnvBuildType.LAMBDA) {
            return [];
        }
        return [];
    }

    protected getCommandsForBuildType(type: EnvBuildType): string[] {
        if (type === EnvBuildType.ECS) {
            return [];
        }
        if (type === EnvBuildType.LAMBDA) {
            return [];
        }
        return [];
    }

    protected getBuildType(): EnvBuildType {
        if (this.props.type) {
            return this.props.type;
        }
        return EnvBuildType.ECS;
    }

    protected getCopyCommand(): string {
        const files: string[] = ['_common.js', 'defaults.js'];
        const parts: string[] = [];
        for (const file of files) {
            parts.push(`cp config/${file}.copy config/${file}`);
        }
        return parts.join(' && ');
    }
}