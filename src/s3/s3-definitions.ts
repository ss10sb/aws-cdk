import {RemovalPolicy} from "aws-cdk-lib";
import {BlockPublicAccess, BucketEncryption} from "aws-cdk-lib/aws-s3";
import {Key} from "aws-cdk-lib/aws-kms";

export interface S3Props {
    removalPolicy?: RemovalPolicy;
    blockPublicAccess?: BlockPublicAccess;
    autoDeleteObjects?: boolean;
    encryption?: BucketEncryption;
    encryptionKey?: Key;
    bucketKeyEnabled?: boolean;
}