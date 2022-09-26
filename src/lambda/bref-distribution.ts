import {AcmCertificate, DnsValidatedCertificateProps} from "../acm/acm-certificate";
import {FunctionType, PhpApiProps, PhpApiResult} from "./lambda-definitions";
import {IDistribution, SecurityPolicyProtocol} from "aws-cdk-lib/aws-cloudfront";
import {PhpBrefFunction, PhpBrefFunctionProps} from "./php-bref-function";
import {S3Bucket, S3Props} from "../s3/s3-bucket";
import {PhpVersion} from "../config/config-definitions";
import {IFunction} from "aws-cdk-lib/aws-lambda";
import {Bucket, BucketEncryption} from "aws-cdk-lib/aws-s3";
import {ICertificate} from "aws-cdk-lib/aws-certificatemanager";
import {NonConstruct} from "../core/non-construct";
import {ISecret} from "aws-cdk-lib/aws-secretsmanager";
import {Construct} from "constructs";
import {PhpApiFactory} from "./php-api-factory";
import {BucketDeployment, Source} from "aws-cdk-lib/aws-s3-deployment";
import {RetentionDays} from "aws-cdk-lib/aws-logs";
import fs from "fs";
import path from "path";
import {Secrets} from "../secret/secrets";
import {AUTHORIZER_TOKEN} from "./authorizer-base";
import {BrefFactoryDistributionProps} from "./bref-factory";
import {WebDistribution} from "../cloudfront/web-distribution";

export interface BrefDistributionFactoryProps {
    readonly functionFactory: PhpBrefFunction;
    readonly secret?: ISecret;
}

export interface BrefDistributionProps {
    functionProps: PhpBrefFunctionProps;
    assetPath?: string;
    assetPathToCopy?: string;
    assetBucket?: S3Props;
    phpVersion?: PhpVersion;
    certificateProps: DnsValidatedCertificateProps;
    apiProps: PhpApiProps;
    minimumSslProtocol?: SecurityPolicyProtocol;
    enableLogging?: boolean;
    webAclId?: string;
    geoRestrict?: string[];
}

export interface BrefDistributionResult {
    readonly lambdaFunction: IFunction;
    readonly assetBucket?: Bucket;
    readonly certificate: ICertificate;
    readonly apiResult: PhpApiResult;
    readonly distribution: IDistribution;
}

export class BrefDistribution extends NonConstruct {

    readonly props: BrefDistributionFactoryProps;

    constructor(scope: Construct, id: string, props: BrefDistributionFactoryProps) {
        super(scope, id);
        this.props = props;
    }

    create(props: BrefDistributionProps): BrefDistributionResult {
        const token = this.getAuthorizerToken();
        this.addTokenToAuthorizerProps(token, props);
        const certificate = this.createCertificate(props.certificateProps);
        const func = this.createFunction(props.functionProps);
        const distribution = new WebDistribution(this.scope, this.id);
        const apiResult = this.createApi(func, props);
        const bucket = this.createS3Bucket(props.assetBucket);
        if (bucket && props.assetPathToCopy) {
            this.copyAssetsToS3Bucket(this.getAssetPath(props.assetPathToCopy), bucket);
        }
        const dist = distribution.create({
            api: apiResult.api,
            certificate: certificate,
            domainName: props.certificateProps.domainName,
            minimumSslProtocol: props.minimumSslProtocol,
            assetPath: props.assetPath,
            s3AssetBucket: bucket,
            webAclId: props.webAclId,
            enableLogging: props.enableLogging,
            token: token,
            geoRestrict: props.geoRestrict,
        });
        return {
            assetBucket: bucket,
            certificate: certificate,
            distribution: dist,
            apiResult: apiResult,
            lambdaFunction: func
        }
    }

    protected addTokenToAuthorizerProps(token: string, props: BrefFactoryDistributionProps): void {
        if (token) {
            if (props.apiProps.authorizerProps === undefined) {
                props.apiProps.authorizerProps = {token: token}
            } else {
                props.apiProps.authorizerProps.token = token;
            }
        }
    }

    protected createCertificate(props: DnsValidatedCertificateProps): ICertificate {
        const cert = new AcmCertificate(this.scope, this.id);
        return cert.create(props);
    }

    protected createFunction(props: PhpBrefFunctionProps): IFunction {
        props.lambdaTimeout = props.lambdaTimeout ?? this.props.functionFactory.getDefaultTimeout(FunctionType.WEB);
        props.type = props.type ?? FunctionType.WEB;
        return this.props.functionFactory.create(props);
    }

    protected createApi(func: IFunction, props: BrefFactoryDistributionProps): PhpApiResult {
        const localCertificate = this.createCertificate({
            domainName: props.certificateProps.domainName,
            hostedZone: props.certificateProps.hostedZone
        })
        props.apiProps.domainNameOptions = {
            domainName: props.certificateProps.domainName,
            certificate: localCertificate
        };
        ;
        props.apiProps.baseDomainName = props.certificateProps.domainName;
        props.apiProps.hostedZone = props.certificateProps.hostedZone;
        const apiCreator = new PhpApiFactory(this.scope, this.id);
        return apiCreator.create(func, props.apiProps);
    }

    protected createS3Bucket(props?: S3Props): Bucket | undefined {
        if (props !== undefined) {
            if (props.encryption === undefined) {
                props.encryption = BucketEncryption.S3_MANAGED;
            }
            const s3Bucket = new S3Bucket(this.scope, this.id);
            return s3Bucket.create('assets', props);
        }
    }

    protected copyAssetsToS3Bucket(path: string, bucket: Bucket): void {
        new BucketDeployment(this.scope, 's3-assets-copy', {
            sources: [
                Source.asset(path, {exclude: ['index.php', '.htaccess']})
            ],
            destinationBucket: bucket,
            destinationKeyPrefix: 'assets',
            logRetention: RetentionDays.ONE_DAY
        });
    }

    protected getAssetPath(assetPath: string): string {
        if (fs.existsSync(assetPath)) {
            return assetPath;
        }
        return path.join(process.cwd(), assetPath);
    }

    protected getAuthorizerToken(): string {
        if (this.props.secret) {
            const secrets = new Secrets(this.scope, 'secrets');
            return secrets.getReferenceFromSecret(AUTHORIZER_TOKEN, <ISecret>this.props.secret);
        }
        return 'INVALID';
    }
}