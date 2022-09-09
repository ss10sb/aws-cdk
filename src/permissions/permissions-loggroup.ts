import {IGrantable} from "aws-cdk-lib/aws-iam";
import {LogGroup} from "aws-cdk-lib/aws-logs";

export class PermissionsLoggroup {

    static canLog(grantee: IGrantable, logGroup: LogGroup): void {
        logGroup.grant(grantee, ...[
            "logs:CreateLogGroup",
            "logs:DescribeLogGroups",
            "logs:DescribeLogStreams",
            "logs:GetLogEvents",
            "logs:FilterLogEvents"
        ]);
        logGroup.grantWrite(grantee);
    }
}