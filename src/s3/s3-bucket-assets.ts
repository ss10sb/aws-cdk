import {S3Bucket, S3Props} from "./s3-bucket";
import {BucketProps, HttpMethods} from "aws-cdk-lib/aws-s3";

export class S3BucketAssets extends S3Bucket {

    protected getBucketProps(bucketName: string, props: S3Props): BucketProps {
        return {
            bucketName: bucketName,
            publicReadAccess: true,
            blockPublicAccess: {
                blockPublicAcls: false,
                blockPublicPolicy: false,
                ignorePublicAcls: false,
                restrictPublicBuckets: false
            },
            removalPolicy: props.removalPolicy ?? this.defaults.removalPolicy,
            autoDeleteObjects: props.autoDeleteObjects ?? this.defaults.autoDeleteObjects,
            enforceSSL: this.defaults.enforceSSL,
            cors: props.cors ?? [{
                allowedOrigins: [
                    '*',
                ],
                allowedMethods: [HttpMethods.GET, HttpMethods.HEAD],
                allowedHeaders: ['*'],
                maxAge: 3000
            }]
        }
    }
}