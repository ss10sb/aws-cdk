import {Construct} from "constructs";
import {ICertificate} from "aws-cdk-lib/aws-certificatemanager";
import {IFunction} from "aws-cdk-lib/aws-lambda";
import {PhpBrefFunction, PhpBrefFunctionProps} from "./php-bref-function";
import {HttpApi} from "@aws-cdk/aws-apigatewayv2-alpha";
import {PhpHttpApi, PhpHttpApiProps} from "./php-http-api";
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
import {WebDistribution} from "../cloudfront/web-distribution";
import fs from "fs";
import path from "path";
import {PhpVersion} from "../config/config-definitions";
import {ApiType, FunctionType, PhpApiProps} from "./lambda-definitions";
import {LambdaRestApi, RestApi} from "aws-cdk-lib/aws-apigateway";
import {PhpLambdaRestApi, PhpRestApiProps} from "./php-lambda-rest-api";

interface BrefFactoryProps {
    functionProps: PhpBrefFunctionProps;
    assetPath?: string;
    assetPathToCopy?: string;
    assetBucket?: S3Props;
    phpVersion?: PhpVersion;
    apiType?: ApiType;
}

export interface BrefFactoryDistributionProps extends BrefFactoryProps {
    certificateProps: DnsValidatedCertificateProps;
    apiProps: PhpApiProps;
    minimumSslProtocol?: SecurityPolicyProtocol;
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
    api: HttpApi | RestApi;
    distribution?: IDistribution;
}

/**
 * Not able to make work.  No way to attach LB to S3?
 */
export interface BrefFactoryLoadBalancerResult extends BrefFactoryResult {
    targetGroup: ApplicationTargetGroup;
    listenerRule: ApplicationListenerRule;
}

export class BrefFactory extends NonConstruct {

    readonly funcFactory: PhpBrefFunction;

    constructor(scope: Construct, id: string, funcFactory: PhpBrefFunction) {
        super(scope, id);
        this.funcFactory = funcFactory;
    }

    forDistribution(props: BrefFactoryDistributionProps): BrefFactoryDistributionResult {
        const certificate = this.createCertificate(props.certificateProps);
        const func = this.createFunction(props.functionProps);
        const api = this.createApi(func, props);
        const distribution = new WebDistribution(this.scope, this.id);
        const bucket = this.createS3Bucket(props.assetBucket);
        if (bucket && props.assetPathToCopy) {
            this.copyAssetsToS3Bucket(this.getAssetPath(props.assetPathToCopy), bucket);
        }
        const dist = distribution.create({
            api: api,
            certificate: certificate,
            domainName: props.certificateProps.domainName,
            minimumSslProtocol: props.minimumSslProtocol,
            assetPath: props.assetPath,
            s3AssetBucket: bucket,
            webAclId: props.webAclId
        });
        return {
            assetBucket: bucket,
            certificate: certificate,
            distribution: dist,
            api: api,
            lambdaFunction: func
        }
    }

    createCertificate(props: DnsValidatedCertificateProps): ICertificate {
        const cert = new AcmCertificate(this.scope, this.id);
        return cert.create(props);
    }

    createFunction(props: PhpBrefFunctionProps): IFunction {
        props.lambdaTimeout = props.lambdaTimeout ?? this.funcFactory.getDefaultTimeout(FunctionType.WEB);
        return this.funcFactory.create('web', props);
    }

    createApi(func: IFunction, props: BrefFactoryProps): HttpApi | RestApi {
        const apiType = this.getApiType(props);
        if (apiType === ApiType.HTTP) {
            return this.createHttpApi(func, <PhpHttpApiProps>props);
        }
        return this.createLambdaRestApi(func, <PhpRestApiProps>props);
    }

    createLambdaRestApi(func: IFunction, props: PhpRestApiProps): LambdaRestApi {
        const lambdaApi = new PhpLambdaRestApi(this.scope, this.id);
        props.lambdaFunction = func;
        return lambdaApi.create(props);
    }

    createHttpApi(func: IFunction, props: PhpHttpApiProps): HttpApi {
        const httpApi = new PhpHttpApi(this.scope, this.id);
        props.lambdaFunction = func;
        return httpApi.create(props);
    }

    createS3Bucket(props?: S3Props): Bucket | undefined {
        if (props !== undefined) {
            if (props.encryption === undefined) {
                props.encryption = BucketEncryption.S3_MANAGED;
            }
            const s3Bucket = new S3Bucket(this.scope, this.id);
            return s3Bucket.create('assets', props);
        }
    }

    copyAssetsToS3Bucket(path: string, bucket: Bucket): void {
        new BucketDeployment(this.scope, 's3-assets-copy', {
            sources: [
                Source.asset(path, {exclude: ['index.php', '.htaccess']})
            ],
            destinationBucket: bucket,
            destinationKeyPrefix: 'assets'
        });
    }

    getAssetPath(assetPath: string): string {
        if (fs.existsSync(assetPath)) {
            return assetPath;
        }
        return path.join(process.cwd(), assetPath);
    }

    getApiType(props: BrefFactoryProps): ApiType {
        if (props.apiType) {
            return props.apiType;
        }
        return ApiType.LAMBDAREST;
    }
}