import {Construct} from "constructs";
import {ICertificate} from "aws-cdk-lib/aws-certificatemanager";
import {IFunction} from "aws-cdk-lib/aws-lambda";
import {PhpBrefFunction, PhpBrefFunctionProps} from "./php-bref-function";
import {Bucket, BucketEncryption} from "aws-cdk-lib/aws-s3";
import {BucketDeployment, Source} from "aws-cdk-lib/aws-s3-deployment";
import {IDistribution, SecurityPolicyProtocol} from "aws-cdk-lib/aws-cloudfront";
import {ApplicationListenerRule, ApplicationTargetGroup, HealthCheck} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import {S3Bucket, S3Props} from "../s3/s3-bucket";
import {AcmCertificate, DnsValidatedCertificateProps} from "../acm/acm-certificate";
import {PreBuildLookups} from "../env/pre-build-lookups";
import {AlbTargetGroupProps} from "../alb/alb-target-group";
import {AlbListenerRuleProps} from "../alb/alb-listener-rule";
import {NonConstruct} from "../core/non-construct";
import {WebDistribution} from "../../old/src/cloudfront/web-distribution";
import fs from "fs";
import path from "path";
import {PhpVersion} from "../config/config-definitions";
import {FunctionType, PhpApiProps, PhpApiResult} from "./lambda-definitions";
import {ISecret} from "aws-cdk-lib/aws-secretsmanager";
import {Secrets} from "../secret/secrets";
import {AUTHORIZER_TOKEN} from "../../old/src/lambda/authorizer-base";
import {ILogGroup, LogGroup, RetentionDays} from "aws-cdk-lib/aws-logs";
import {PhpApiFactory} from "../../old/src/lambda/php-api-factory";
import {RemovalPolicy} from "aws-cdk-lib";

interface BrefFactoryProps {
    functionProps: PhpBrefFunctionProps;
    assetPath?: string;
    assetPathToCopy?: string;
    assetBucket?: S3Props;
    phpVersion?: PhpVersion;
}

export interface BrefFactoryDistributionProps extends BrefFactoryProps {
    certificateProps: DnsValidatedCertificateProps;
    apiProps: PhpApiProps;
    minimumSslProtocol?: SecurityPolicyProtocol;
    enableLogging?: boolean;
    webAclId?: string;
}

/**
 * Not able to make work.  No way to attach LB to S3?
 */
export interface BrefFactoryLoadBalancerProps extends BrefFactoryProps {
    lookups: PreBuildLookups;
    targetGroupProps: AlbTargetGroupProps;
    listenerRuleProps: AlbListenerRuleProps;
    healthCheckProps: {
        alarmEmails?: string[];
        healthCheck?: HealthCheck;
    }
}

interface BrefFactoryResult {
    lambdaFunction: IFunction;
    assetBucket?: Bucket;
}

export interface BrefFactoryDistributionResult extends BrefFactoryResult {
    certificate: ICertificate;
    apiResult: PhpApiResult;
    distribution?: IDistribution;
}

/**
 * Not able to make work.  No way to attach LB to S3?
 */
export interface BrefFactoryLoadBalancerResult extends BrefFactoryResult {
    targetGroup: ApplicationTargetGroup;
    listenerRule: ApplicationListenerRule;
}

/**
 * @deprecated
 * Historical purposes only. Don't use.
 */
export class BrefFactory extends NonConstruct {

    readonly funcFactory: PhpBrefFunction;
    readonly secret?: ISecret;

    constructor(scope: Construct, id: string, funcFactory: PhpBrefFunction, secret?: ISecret) {
        super(scope, id);
        this.funcFactory = funcFactory;
        this.secret = secret;
    }

    forDistribution(props: BrefFactoryDistributionProps): BrefFactoryDistributionResult {
        const token = this.getAuthorizerToken();
        this.addTokenToAuthorizerProps(token, props);
        const certificate = this.createCertificate(props.certificateProps);
        const func = this.createFunction(props.functionProps);
        const distribution = new WebDistribution(this.scope, this.id);
        props.apiProps.domainNameOptions = {
            domainName: props.certificateProps.domainName,
            certificate: certificate
        };
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
            token: token
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
        if (props.apiProps.authorizerProps === undefined) {
            props.apiProps.authorizerProps = {token: token};
        }
    }

    protected createCertificate(props: DnsValidatedCertificateProps): ICertificate {
        const cert = new AcmCertificate(this.scope, this.id);
        return cert.create(props);
    }

    protected createFunction(props: PhpBrefFunctionProps): IFunction {
        props.lambdaTimeout = props.lambdaTimeout ?? this.funcFactory.getDefaultTimeout(FunctionType.WEB);
        props.type = props.type ?? FunctionType.WEB;
        return this.funcFactory.create(props);
    }

    protected createApi(func: IFunction, props: BrefFactoryDistributionProps): PhpApiResult {
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
            logGroup: this.createLogGroup('s3-assets-copy')
        });
    }

    createLogGroup(funcName: string): ILogGroup {
        return new LogGroup(this.scope, `${funcName}-lg`, {
            removalPolicy: RemovalPolicy.DESTROY,
            retention: RetentionDays.ONE_MONTH
        });
    }

    protected getAssetPath(assetPath: string): string {
        if (fs.existsSync(assetPath)) {
            return assetPath;
        }
        return path.join(process.cwd(), assetPath);
    }

    protected getAuthorizerToken(): string {
        if (this.secret) {
            return Secrets.getReferenceFromSecret(AUTHORIZER_TOKEN, <ISecret>this.secret);
        }
        return 'INVALID';
    }
}