import {IGrantable} from "aws-cdk-lib/aws-iam";
import {IStringParameter} from "aws-cdk-lib/aws-ssm";

export class PermissionsParameter {

    static granteeCanReadParam(grantee: IGrantable, param: IStringParameter): void {
        param.grantRead(grantee);
    }
}