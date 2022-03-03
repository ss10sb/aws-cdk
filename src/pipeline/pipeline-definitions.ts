/* eslint @typescript-eslint/no-empty-interface: "off" */
import {DetailType, INotificationRuleSource, INotificationRuleTarget} from "aws-cdk-lib/aws-codestarnotifications";
import {PipelineNotificationEvents} from "aws-cdk-lib/aws-codepipeline";

export interface PipelineNotificationRuleConfig {
    detailType?: DetailType;
    events: PipelineNotificationEvents[];
    targets?: INotificationRuleTarget[];
    emails?: string[];
}

export interface PipelineNotificationTargetProps extends PipelineNotificationRuleConfig {

}

export interface PipelineNotificationRuleProps extends PipelineNotificationTargetProps {
    source: INotificationRuleSource;
}