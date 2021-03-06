import {NonConstruct} from "../core";
import {CodeBuildStep, IFileSetProducer} from "aws-cdk-lib/pipelines";
import {CodePipelineSynthStepProps} from "./code-pipeline-definitions";
import {Role, ServicePrincipal} from "aws-cdk-lib/aws-iam";
import {Construct} from "constructs";

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
            input: this.props.source,
            commands: this.getCommands(),
            role: this.role
        });
    }

    protected getCommands(): string[] {
        return [
            this.getCopyCommand(),
            'npm ci',
            'npm run build',
            'npx cdk synth',
        ];
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