import {Newable} from "../utils";
import {ManualApprovalStep, StageDeployment, Step} from "aws-cdk-lib/pipelines";
import {EnvConfig} from "../env";
import deepmerge from "deepmerge";

interface Actionable {
    stepClass: Newable<Step>,
    stepProps?: Record<string, any>
}

export class CodePipelineStageSteps {

    readonly stageDeployment: StageDeployment;
    readonly map: Record<string, Actionable> = {
        manualApproval: {
            stepClass: ManualApprovalStep,
            stepProps: {
                runOrder: 1
            }
        }
    };

    constructor(stageDeployment: StageDeployment) {
        this.stageDeployment = stageDeployment;
    }

    fromEnvConfig(envConfig: EnvConfig): void {
        this.addSteps(envConfig.Parameters.steps ?? {});
    }

    addSteps(steps: Record<string, any>): void {
        const stageSteps: Step[] = this.getSteps(steps);
        this.stageDeployment.addPre(...stageSteps);
    }

    getSteps(steps: Record<string, any>): Step[] {
        const stageSteps: Step[] = [];
        for (const [k, v] of Object.entries(steps)) {
            const step = this.getStep(k, v);
            if (step) {
                stageSteps.push(step);
            }
        }
        return stageSteps;
    }

    getStep(name: string, props: { [key: string]: any }): Step | null {
        const mappedObj = this.map[name];
        if (mappedObj) {
            props = this.getStepProps(name, mappedObj.stepProps ?? {}, props);
            return new mappedObj.stepClass(`${name}-step`, props);
        }
        return null;
    }

    getStepProps(name: string, defaultProps: Record<string, any>, props: Record<string, any>): Record<string, any> {
        return deepmerge.all([
            defaultProps,
            props
        ]);
    }
}