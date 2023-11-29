import {BlockPublicAccess, Bucket, BucketEncryption, BucketProps, CorsRule, ObjectOwnership} from "aws-cdk-lib/aws-s3";
import {RemovalPolicy} from "aws-cdk-lib";
import {Key} from "aws-cdk-lib/aws-kms";
import {NonConstruct} from "../core/non-construct";

export interface S3Props {
    removalPolicy?: RemovalPolicy;
    blockPublicAccess?: BlockPublicAccess;
    autoDeleteObjects?: boolean;
    encryption?: BucketEncryption;
    encryptionKey?: Key;
    bucketKeyEnabled?: boolean;
    bucketName?: string;
    cors?: CorsRule[];
    objectOwnership?: ObjectOwnership;
}

export class S3Bucket extends NonConstruct {

    readonly defaults: Record<string, any> = {
        autoDeleteObjects: false,
        objectOwnership: ObjectOwnership.BUCKET_OWNER_ENFORCED,
        blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
        removalPolicy: RemovalPolicy.RETAIN,
        enforceSSL: true,
        encryption: BucketEncryption.KMS_MANAGED
    }

    public create(name: string, props: S3Props = {}): Bucket {
        const bucketName = props.bucketName ?? this.mixNameWithId(name);
        return new Bucket(this.scope, bucketName, this.getBucketProps(bucketName, props));
    }

    protected getBucketProps(bucketName: string, props: S3Props): BucketProps {
        return {
            bucketName: bucketName,
            blockPublicAccess: props.blockPublicAccess ?? this.defaults.blockPublicAccess,
            removalPolicy: props.removalPolicy ?? this.defaults.removalPolicy,
            autoDeleteObjects: props.autoDeleteObjects ?? this.defaults.autoDeleteObjects,
            encryption: props.encryption ?? this.defaults.encryption,
            encryptionKey: props.encryptionKey ?? undefined,
            enforceSSL: this.defaults.enforceSSL,
            bucketKeyEnabled: props.bucketKeyEnabled ?? undefined,
            cors: props.cors ?? undefined,
            objectOwnership: props.objectOwnership ?? this.defaults.objectOwnership,
        }
    }
}