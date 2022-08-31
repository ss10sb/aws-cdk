import {Rule, Schedule} from "aws-cdk-lib/aws-events";
import {Construct} from "constructs";
import {CodePipeline as CodePipelineTarget} from "aws-cdk-lib/aws-events-targets";
import {CodePipelinePipeline} from "./code-pipeline-pipeline";
import {NonConstruct} from "../core/non-construct";

export interface CodePipelineRunProps {
    pipeline: CodePipelinePipeline;
    schedule: string;
}

export class CodePipelineRun extends NonConstruct {

    readonly props: CodePipelineRunProps;
    readonly rule: Rule;

    constructor(scope: Construct, id: string, props: CodePipelineRunProps) {
        super(scope, id);
        this.props = props;
        this.rule = this.createRunScheduleRule();
    }

    private createRunScheduleRule(): Rule {
        const target = new CodePipelineTarget(this.props.pipeline.getBuiltPipeline());
        return new Rule(this.scope, `${this.id}-run-schedule`, {
            schedule: this.getSchedule(),
            targets: [target]
        });
    }

    private getSchedule(): Schedule {
        return Schedule.expression(this.props.schedule);
    }
}