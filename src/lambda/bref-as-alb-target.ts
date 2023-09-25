import {NonConstruct} from "../core/non-construct";
import {PhpBrefFunction, PhpBrefFunctionProps} from "./php-bref-function";
import {ISecret} from "aws-cdk-lib/aws-secretsmanager";
import {IFunction} from "aws-cdk-lib/aws-lambda";
import {Bucket, BucketEncryption, HttpMethods} from "aws-cdk-lib/aws-s3";
import {S3Bucket, S3Props} from "../s3/s3-bucket";
import {PhpVersion} from "../config/config-definitions";
import {Construct} from "constructs";
import {FunctionType} from "./lambda-definitions";
import {BucketDeployment, Source} from "aws-cdk-lib/aws-s3-deployment";
import {RetentionDays} from "aws-cdk-lib/aws-logs";
import fs from "fs";
import path from "path";
import {ApplicationTargetGroup} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import {LambdaTarget} from "aws-cdk-lib/aws-elasticloadbalancingv2-targets";
import {RemovalPolicy} from "aws-cdk-lib";
import {S3BucketAssets} from "../s3/s3-bucket-assets";
import {AcmCertificate, DnsValidatedCertificateProps} from "../acm/acm-certificate";

export interface BrefAsAlbTargetFactoryProps {
    readonly targetGroup: ApplicationTargetGroup;
    readonly functionFactory: PhpBrefFunction;
}

export interface BrefAsAlbTargetProps {
    functionProps: PhpBrefFunctionProps;
    assetPrefix?: string;
    assetPathToCopy?: string;
    assetBucket?: S3Props;
    phpVersion?: PhpVersion;
    enableLogging?: boolean;
    certificateProps?: DnsValidatedCertificateProps;
}

export interface BrefAsAlbTargetResult {
    readonly lambdaFunction: IFunction;
    readonly assetBucket?: Bucket;
}

export class BrefAsAlbTarget extends NonConstruct {

    readonly props: BrefAsAlbTargetFactoryProps;

    constructor(scope: Construct, id: string, props: BrefAsAlbTargetFactoryProps) {
        super(scope, id);
        this.props = props;
    }

    create(props: BrefAsAlbTargetProps): BrefAsAlbTargetResult {
        const bucket = this.createS3Bucket(props);
        if (props.assetPathToCopy) {
            this.copyAssetsToS3Bucket(this.getAssetPath(props.assetPathToCopy), bucket);
        }
        this.addBucketPathToEnvironment(bucket, props.functionProps);
        const func = this.createFunction(props.functionProps);
        this.addFunctionToTargetGroup(func);

        return {
            lambdaFunction: func,
            assetBucket: bucket
        };
    }

    protected addBucketPathToEnvironment(bucket: Bucket, props: PhpBrefFunctionProps): void {
        if (props.environment === undefined) {
            props.environment = {};
        }
        props.environment['S3_ASSET_URL'] = `https://${bucket.bucketDomainName}`;
    }

    protected addFunctionToTargetGroup(func: IFunction): void {
        this.props.targetGroup.addTarget(new LambdaTarget(func));
    }

    protected createFunction(props: PhpBrefFunctionProps): IFunction {
        props.lambdaTimeout = props.lambdaTimeout ?? this.props.functionFactory.getDefaultTimeout(FunctionType.WEB, false);
        props.type = props.type ?? FunctionType.WEB;
        return this.props.functionFactory.create(props);
    }

    protected createS3Bucket(props: BrefAsAlbTargetProps): Bucket {
        const bucketProps = props.assetBucket ?? {};
        bucketProps.bucketName = this.getS3AssetsBucketDomain(props).replaceAll('.', '-');
        bucketProps.cors = bucketProps.cors ?? [{
            allowedOrigins: [
                `https://${props.certificateProps?.domainName}`,
            ],
            allowedMethods: [HttpMethods.GET],
            allowedHeaders: ['*'],
            maxAge: 3000
        }];
        const s3Bucket = new S3BucketAssets(this.scope, this.id);
        return s3Bucket.create('assets', bucketProps);
    }

    protected getS3AssetsBucketDomain(props: BrefAsAlbTargetProps): string {
        return `${props.assetPrefix}.${props.certificateProps?.domainName}`;
    }

    protected copyAssetsToS3Bucket(path: string, bucket: Bucket): void {
        new BucketDeployment(this.scope, 's3-assets-copy', {
            sources: [
                Source.asset(path, {exclude: ['index.php', '.htaccess']})
            ],
            destinationBucket: bucket,
            logRetention: RetentionDays.ONE_DAY
        });
    }

    protected getAssetPath(assetPath: string): string {
        if (fs.existsSync(assetPath)) {
            return assetPath;
        }
        return path.join(process.cwd(), assetPath);
    }
}