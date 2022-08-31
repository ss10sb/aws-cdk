import {Construct} from "constructs";
import {
    INotificationRule,
    INotificationRuleTarget,
    NotificationRule as NotificationRuleAws
} from "aws-cdk-lib/aws-codestarnotifications";
import {PipelineNotificationTargets} from "./pipeline-notification-targets";
import {CodePipeline} from "aws-cdk-lib/pipelines";
import {IPipeline, Pipeline} from "aws-cdk-lib/aws-codepipeline";
import {PipelineNotificationRuleConfig} from "./pipeline-definitions";
import {NonConstruct} from "../core/non-construct";


export interface PipelineNotificationRuleProps extends PipelineNotificationRuleConfig {
    source: CodePipeline | Pipeline;
}

export class PipelineNotificationRule extends NonConstruct {

    readonly props: PipelineNotificationRuleProps;
    readonly targets: INotificationRuleTarget[];
    readonly notificationRule: INotificationRule;

    constructor(scope: Construct, id: string, props: PipelineNotificationRuleProps) {
        super(scope, id);
        this.props = props;
        this.targets = this.createTargets();
        this.notificationRule = this.createNotificationRule();
    }

    protected createTargets(): INotificationRuleTarget[] {
        const notificationTargets = new PipelineNotificationTargets(this.scope, this.id, this.props);
        return notificationTargets.targets;
    }

    protected createNotificationRule(): INotificationRule {
        return new NotificationRuleAws(this.scope, this.mixNameWithId('notification-rule'), {
            source: this.getSource(),
            events: this.props.events,
            detailType: this.props.detailType ?? undefined,
            targets: this.targets
        });
    }

    protected getSource(): IPipeline {
        if (this.props.source instanceof CodePipeline) {
            return this.props.source.pipeline;
        }
        return this.props.source;
    }
}