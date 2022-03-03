import {NonConstruct} from "../core";
import {CodePipelineEcrStepsProps} from "./code-pipeline-definitions";
import {CodeBuildStep} from "aws-cdk-lib/pipelines";
import {IRole, Role, ServicePrincipal} from "aws-cdk-lib/aws-iam";
import {Construct} from "constructs";
import {CodePipelineEcrStep} from "./code-pipeline-ecr-step";

export class CodePipelineEcrSteps extends NonConstruct {

    readonly props: CodePipelineEcrStepsProps;
    readonly steps: CodeBuildStep[];
    readonly role: IRole;

    constructor(scope: Construct, id: string, props: CodePipelineEcrStepsProps) {
        super(scope, id);
        this.props = props;
        this.role = new Role(this.scope, `${this.scope.node.id}-ecr-step-role`, {
            assumedBy: new ServicePrincipal('codebuild.amazonaws.com')
        });
        this.steps = this.createEcrSteps();
    }

    private createEcrSteps(): CodeBuildStep[] {
        const steps: CodeBuildStep[] = [];
        for (const ecrRepo of this.props.repositories.getEcrRepositories()) {
            if (!ecrRepo.repository) {
                continue;
            }
            const name = ecrRepo.name;
            const ecrStep = new CodePipelineEcrStep(this.scope, `${this.scope.node.id}-${name}-step`, {
                role: this.role,
                source: this.props.source,
                imageTag: ecrRepo.imageTag ?? '1',
                name: name,
                repository: ecrRepo.repository
            });
            steps.push(ecrStep.step);
        }
        return steps;
    }
}