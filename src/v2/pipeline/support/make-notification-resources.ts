import {NonConstruct} from "../../../core/non-construct";
import {PipelineNotificationRule, PipelineNotificationRuleProps} from "../../../pipeline/pipeline-notification-rule";
import {CodePipelineRun} from "../../../pipeline/code-pipeline-run";
import {CodePipelinePipeline} from "../../../pipeline/code-pipeline-pipeline";
import {CoreCodePipelineResources} from "./make-core-resources";
import {Construct} from "constructs";

export interface NotificationResources {
    notificationRule?: PipelineNotificationRule;
    runSchedule?: CodePipelineRun;
}

export class MakeNotificationResources extends NonConstruct {

    config: Record<string, any>;

    constructor(scope: Construct, id: string, config: Record<string, any>) {
        super(scope, id);
        this.config = config;
    }

    make(coreResources: CoreCodePipelineResources): NotificationResources {
        return {
            notificationRule: this.createPipelineNotifications(coreResources.pipeline),
            runSchedule: this.createPipelineRunSchedule(coreResources.pipeline)
        }
    }

    private createPipelineNotifications(pipeline: CodePipelinePipeline): PipelineNotificationRule | undefined {
        if (this.config.Parameters?.pipelineNotification) {
            const props: PipelineNotificationRuleProps = {
                source: pipeline.getBuiltPipeline(),
                detailType: this.config.Parameters.pipelineNotification?.detailType,
                events: this.config.Parameters.pipelineNotification?.events ?? [],
                emails: this.config.Parameters.pipelineNotification?.emails ?? []
            };
            return new PipelineNotificationRule(this.scope, this.scope.node.id, props);
        }
    }

    private createPipelineRunSchedule(pipeline: CodePipelinePipeline): CodePipelineRun | undefined {
        if (this.config.Parameters?.runPipelineSchedule) {
            return new CodePipelineRun(this.scope, this.scope.node.id, {
                pipeline: pipeline,
                schedule: this.config.Parameters.runPipelineSchedule
            });
        }
    }
}