import {
    AllowedMethods,
    BehaviorOptions,
    CachePolicy,
    Distribution,
    IDistribution, OriginBase,
    PriceClass,
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
import {HttpApiOrigin} from "./http-api-origin";

export interface WebDistributionProps {
    readonly api: HttpApi | RestApi;
    readonly s3AssetBucket?: IBucket;
    readonly assetPath?: string;
    readonly certificate: ICertificate;
    readonly domainName: string;
    readonly minimumSslProtocol?: SecurityPolicyProtocol;
    readonly webAclId?: string;
    readonly alarmEmails?: string[];
}

export class WebDistribution extends NonConstruct {

    readonly defaults: Record<string, any> = {
        assetPath: 'assets/*',
        minimumSslProtocol: SecurityPolicyProtocol.TLS_V1_2_2019,
        priceClass: PriceClass.PRICE_CLASS_100
    };

    create(props: WebDistributionProps): IDistribution {
        const name = this.mixNameWithId('cf-dist');
        const dist = new Distribution(this.scope, name, {
            comment: name,
            defaultBehavior: this.getDefaultBehavior(props.api),
            domainNames: [props.domainName],
            certificate: props.certificate,
            sslSupportMethod: SSLMethod.SNI,
            minimumProtocolVersion: props.minimumSslProtocol ?? this.defaults.minimumSslProtocol,
            webAclId: props.webAclId,
            priceClass: this.defaults.priceClass
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
            distribution.addBehavior(props.assetPath ?? this.defaults.assetPath, new S3Origin(props.s3AssetBucket), {
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                cachePolicy: CachePolicy.CACHING_OPTIMIZED
            });
        }
    }

    protected getDefaultBehavior(api: HttpApi | RestApi): BehaviorOptions {

        return {
            origin: this.getOrigin(api),
            allowedMethods: AllowedMethods.ALLOW_ALL,
            viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            cachePolicy: CachePolicy.CACHING_DISABLED
        }
    }

    protected getOrigin(api: HttpApi | RestApi): OriginBase {
        if (api instanceof HttpApi) {
            return new HttpApiOrigin(api);
        }
        return new RestApiOrigin(api);
    }
}