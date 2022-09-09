import {
    AllowedMethods,
    BehaviorOptions, CacheCookieBehavior, CacheHeaderBehavior,
    CachePolicy, CacheQueryStringBehavior,
    Distribution,
    IDistribution,
    OriginBase, OriginProps,
    OriginRequestCookieBehavior,
    OriginRequestHeaderBehavior,
    OriginRequestPolicy,
    OriginRequestQueryStringBehavior,
    PriceClass, ResponseHeadersPolicy,
    SecurityPolicyProtocol,
    SSLMethod,
    ViewerProtocolPolicy
} from "aws-cdk-lib/aws-cloudfront";
import {HttpApi} from "@aws-cdk/aws-apigatewayv2-alpha";
import {RestApiOrigin, S3Origin} from "aws-cdk-lib/aws-cloudfront-origins";
import {IBucket} from "aws-cdk-lib/aws-s3";
import {ICertificate} from "aws-cdk-lib/aws-certificatemanager";
import {NonConstruct} from "../core/non-construct";
import {RestApi} from "aws-cdk-lib/aws-apigateway";
import {HttpFromHttpApi} from "./http-from-http-api";
import {Construct} from "constructs";
import {Duration} from "aws-cdk-lib";
import {HttpApiOrigin, HttpApiOriginProps} from "./http-api-origin";

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
            enableLogging: props.enableLogging
        });
        this.addAlarms(dist, props.alarmEmails ?? []);
        this.addS3AssetBucket(dist, props);
        return dist;
    }

    protected addAlarms(distribution: IDistribution, emails: string[]): void {
        //TODO
    }

    protected addS3AssetBucket(distribution: Distribution, props: WebDistributionProps): void {
        if (props.s3AssetBucket) {
            const origin = new S3Origin(props.s3AssetBucket);
            const originWithPath = new S3Origin(props.s3AssetBucket, {
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
            originRequestPolicy: OriginRequestPolicy.ALL_VIEWER,
            responseHeadersPolicy: ResponseHeadersPolicy.SECURITY_HEADERS
        }
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
            headerBehavior: OriginRequestHeaderBehavior.all(),
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