import {SecurityPolicyProtocol} from "aws-cdk-lib/aws-cloudfront";
import {S3Props} from "../../../src/s3/s3-bucket";
import {PhpBrefFunctionProps} from "../../../src/lambda/php-bref-function";
import {PhpApiProps} from "../../../src/lambda/lambda-definitions";

export interface DistributionConfigProps {
    readonly assetBucket?: S3Props;
    readonly assetPath?: string;
    readonly assetPathToCopy?: string;
    readonly functionProps: PhpBrefFunctionProps;
    readonly apiProps: PhpApiProps;
    readonly minimumSslProtocol?: SecurityPolicyProtocol;
    readonly webAclId?: string;
    readonly geoRestrict?: string[];
}



