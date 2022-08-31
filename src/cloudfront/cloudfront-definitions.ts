import {SecurityPolicyProtocol} from "aws-cdk-lib/aws-cloudfront";
import {S3Props} from "../s3/s3-bucket";
import {PhpBrefFunctionProps} from "../lambda/php-bref-function";
import {PhpHttpApiProps} from "../lambda/php-http-api";

export interface DistributionConfigProps {
    readonly assetBucket?: S3Props;
    readonly assetPath?: string;
    readonly assetPathToCopy?: string;
    readonly functionProps: PhpBrefFunctionProps;
    readonly httpApiProps: PhpHttpApiProps;
    readonly minimumSslProtocol?: SecurityPolicyProtocol;
    readonly webAclId?: string;
}



