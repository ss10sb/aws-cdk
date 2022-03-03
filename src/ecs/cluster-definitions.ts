import {IVpc} from "aws-cdk-lib/aws-ec2";

export interface ClusterFactoryProps {
    alarmEmails?: string[];
    vpc: IVpc;
    securityGroupIds?: string[];
    containerInsights?: boolean;
}