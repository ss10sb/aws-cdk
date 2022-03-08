import {NonConstruct} from "../core";
import {PipelineNotificationRuleProps} from "./pipeline-definitions";
import {INotificationRule, INotificationRuleTarget} from "aws-cdk-lib/aws-codestarnotifications";
import {Construct} from "constructs";
import {PipelineNotificationTargets} from "./pipeline-notification-targets";
import {IPipeline} from "aws-cdk-lib/aws-codepipeline";
import {CodePipeline} from "aws-cdk-lib/pipelines";

export class PipelineNotifyOn extends NonConstruct {

    readonly props: PipelineNotificationRuleProps;
    readonly targets: INotificationRuleTarget[];
    notificationRules: INotificationRule[] = [];

    constructor(scope: Construct, id: string, props: PipelineNotificationRuleProps) {
        super(scope, id);
        this.props = props;
        this.targets = this.createTargets();
        this.createNotifyOnRules();
    }

    protected createTargets(): INotificationRuleTarget[] {
        const notificationTargets = new PipelineNotificationTargets(this.scope, this.id, this.props);
        return notificationTargets.targets;
    }

    protected createNotifyOnRules(): void {
        for (const target of this.targets) {
            this.notificationRules.push(this.getSource().notifyOn(this.id, target, {
                detailType: this.props.detailType,
                events: this.props.events
            }));
        }
    }

    protected getSource(): IPipeline {
        if (this.props.source instanceof CodePipeline) {
            return this.props.source.pipeline;
        }
        return this.props.source;
    }
}