/* eslint @typescript-eslint/no-empty-interface: "off" */
import {DetailType, INotificationRuleTarget} from "aws-cdk-lib/aws-codestarnotifications";
import {Pipeline, PipelineNotificationEvents} from "aws-cdk-lib/aws-codepipeline";

export interface PipelineNotificationRuleConfig {
    detailType?: DetailType;
    events: PipelineNotificationEvents[];
    targets?: INotificationRuleTarget[];
    emails?: string[];
}



