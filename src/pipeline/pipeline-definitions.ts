/* eslint @typescript-eslint/no-empty-interface: "off" */
import {DetailType, INotificationRuleTarget} from "aws-cdk-lib/aws-codestarnotifications";
import {Pipeline, PipelineNotificationEvents} from "aws-cdk-lib/aws-codepipeline";
import {CodePipeline} from "aws-cdk-lib/pipelines";

export interface PipelineNotificationRuleConfig {
    detailType?: DetailType;
    events: PipelineNotificationEvents[];
    targets?: INotificationRuleTarget[];
    emails?: string[];
}

export interface PipelineNotificationTargetProps extends PipelineNotificationRuleConfig {

}

export interface PipelineNotificationRuleProps extends PipelineNotificationTargetProps {
    source: CodePipeline | Pipeline;
}