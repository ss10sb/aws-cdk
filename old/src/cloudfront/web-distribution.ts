import {
    AllowedMethods,
    BehaviorOptions,
    CachePolicy,
    Distribution,
    Function,
    FunctionAssociation,
    FunctionCode,
    FunctionEventType, GeoRestriction,
    IDistribution,
    OriginBase,
    OriginProps,
    OriginRequestCookieBehavior,
    OriginRequestHeaderBehavior,
    OriginRequestPolicy,
    OriginRequestQueryStringBehavior,
    PriceClass,
    ResponseHeadersPolicy,
    SecurityPolicyProtocol,
    SSLMethod,
    ViewerProtocolPolicy
} from "aws-cdk-lib/aws-cloudfront";
import {HttpApi} from "aws-cdk-lib/aws-apigatewayv2";
import {RestApiOrigin, S3BucketOrigin, S3Origin} from "aws-cdk-lib/aws-cloudfront-origins";
import {IBucket} from "aws-cdk-lib/aws-s3";
import {ICertificate} from "aws-cdk-lib/aws-certificatemanager";
import {NonConstruct} from "../../../src/core/non-construct";
import {RestApi} from "aws-cdk-lib/aws-apigateway";
import {Construct} from "constructs";
import {HttpApiOrigin, HttpApiOriginProps} from "./http-api-origin";
import {aws_cloudfront_origins} from "aws-cdk-lib";

export interface WebDistributionProps {
    readonly api: HttpApi | RestApi;
    readonly s3AssetBucket?: IBucket;
    readonly assetPath?: string;
    readonly certificate: ICertificate;
    readonly domainName: string;
    readonly minimumSslProtocol?: SecurityPolicyProtocol;
    readonly webAclId?: string;
    readonly alarmEmails?: string[];
    readonly enableLogging?: boolean;
    readonly token?: string;
    readonly geoRestrict?: string[];
}

export class WebDistribution extends NonConstruct {

    readonly defaults: Record<string, any> = {
        assetPath: 'assets/*',
        minimumSslProtocol: SecurityPolicyProtocol.TLS_V1_2_2019,
        priceClass: PriceClass.PRICE_CLASS_100
    };

    constructor(scope: Construct, id: string) {
        super(scope, id);
    }


    create(props: WebDistributionProps): IDistribution {
        const name = this.mixNameWithId('cf-dist');
        const dist = new Distribution(this.scope, name, {
            comment: name,
            defaultBehavior: this.getDefaultBehavior(props.api, props),
            domainNames: [props.domainName],
            certificate: props.certificate,
            sslSupportMethod: SSLMethod.SNI,
            minimumProtocolVersion: props.minimumSslProtocol ?? this.defaults.minimumSslProtocol,
            webAclId: props.webAclId,
            priceClass: this.defaults.priceClass,
            enableLogging: props.enableLogging,
            geoRestriction: this.getGeoRestriction(props.geoRestrict ?? [])
        });
        this.addAlarms(dist, props.alarmEmails ?? []);
        this.addS3AssetBucket(dist, props);
        return dist;
    }

    protected getGeoRestriction(countries: string[]): GeoRestriction | undefined {
        if (countries && countries.length > 0) {
            return GeoRestriction.denylist(...countries);
        }
    }

    protected addAlarms(distribution: IDistribution, emails: string[]): void {
        //TODO
    }

    protected addS3AssetBucket(distribution: Distribution, props: WebDistributionProps): void {
        if (props.s3AssetBucket) {
            const origin = aws_cloudfront_origins.S3BucketOrigin.withOriginAccessControl(props.s3AssetBucket);
            const originWithPath = aws_cloudfront_origins.S3BucketOrigin.withOriginAccessControl(props.s3AssetBucket, {
                originPath: '/assets',
            });
            const behaviorProps = {
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                cachePolicy: CachePolicy.CACHING_OPTIMIZED
            };
            distribution.addBehavior(props.assetPath ?? this.defaults.assetPath, origin, behaviorProps);
            distribution.addBehavior('/favicon.ico', originWithPath, behaviorProps);
            distribution.addBehavior('/robots.txt', originWithPath, behaviorProps);
        }
    }

    protected getDefaultBehavior(api: HttpApi | RestApi, props: WebDistributionProps): BehaviorOptions {

        return {
            origin: this.getOrigin(api, props),
            allowedMethods: AllowedMethods.ALLOW_ALL,
            viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            cachePolicy: CachePolicy.CACHING_DISABLED,
            originRequestPolicy: this.getOriginRequestPolicy(),//OriginRequestPolicy.ALL_VIEWER,
            responseHeadersPolicy: ResponseHeadersPolicy.SECURITY_HEADERS,
            functionAssociations: this.getCloudFrontFunctionAssociations(),
        }
    }

    protected getCloudFrontFunctionAssociations(): FunctionAssociation[] {
        return [];
        // const name = this.mixNameWithId('cf-header-fn');
        // const headerFunc = new Function(this.scope, name, {
        //     code: FunctionCode.fromFile({filePath: path.join(__dirname, 'functions', 'headers.js')}),
        //     functionName: name
        // });
        // return [
        //     {
        //         function: headerFunc,
        //         eventType: FunctionEventType.VIEWER_REQUEST
        //     }
        // ]
    }

    protected getResponseHeadersPolicy(props: WebDistributionProps): ResponseHeadersPolicy | undefined {
        if (props.token) {
            const name = this.mixNameWithId('response-headers-policy');
            return new ResponseHeadersPolicy(this.scope, name, {
                // responseHeadersPolicyName: name,
                // customHeadersBehavior: {
                //     customHeaders: [
                //         {header: 'x-auth-token', value: props.token, override: true},
                //     ]
                // }
            });
        }
    }

    protected getOriginRequestPolicy(): OriginRequestPolicy {
        const name = this.mixNameWithId('origin-request-policy');
        return new OriginRequestPolicy(this.scope, name, {
            originRequestPolicyName: name,
            cookieBehavior: OriginRequestCookieBehavior.all(),
            headerBehavior: OriginRequestHeaderBehavior.all('CloudFront-Viewer-Address'),
            queryStringBehavior: OriginRequestQueryStringBehavior.all(),
        });
    }

    protected getOrigin(api: HttpApi | RestApi, props: WebDistributionProps): OriginBase {
        if (api instanceof HttpApi) {
            return new HttpApiOrigin(api, <HttpApiOriginProps>this.getOriginProps(props));
            // const fromHttpApi = new HttpFromHttpApi(this.scope, this.mixNameWithId('http-origin'));
            // return fromHttpApi.create(api, this.getOriginProps(props));
        }
        return new RestApiOrigin(api, this.getOriginProps(props));
    }

    protected getOriginProps(props: WebDistributionProps): OriginProps {
        let originProps: Record<string, any> = {
            connectionAttempts: 1,
        };
        if (props.token) {
            originProps.customHeaders = {
                'x-auth-token': props.token
            };
        }
        return originProps;
    }
}