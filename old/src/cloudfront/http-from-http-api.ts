import {NonConstruct} from "../../../src/core/non-construct";
import {OriginProtocolPolicy, OriginSslPolicy} from "aws-cdk-lib/aws-cloudfront";
import {HttpApi} from "aws-cdk-lib/aws-apigatewayv2";
import {HttpOrigin, HttpOriginProps} from "aws-cdk-lib/aws-cloudfront-origins";
import {Fn} from "aws-cdk-lib";

export interface HttpFromHttpApiProps {
    httpPort?: number;
    httpsPort?: number;
    keepAliveTimeout?: number;
    originPath?: string;
    originSslProtocols?: OriginSslPolicy[];
    protocolPolicy?: OriginProtocolPolicy;
    readTimeout?: number;
    connectionAttempts?: number;
    customHeaders?: Record<string, string>;
}

export class HttpFromHttpApi extends NonConstruct {

    readonly defaults: Record<string, any> = {
        originSslProtocols: [OriginSslPolicy.TLS_V1_2],
        protocolPolicy: OriginProtocolPolicy.HTTPS_ONLY
    }

    create(httpApi: HttpApi, props: HttpFromHttpApiProps = {}): HttpOrigin {
        this.ensureDefaults(props);
        return new HttpOrigin(this.getDomain(httpApi), this.getProps(httpApi, props));
    }

    private ensureDefaults(props: HttpFromHttpApiProps): void {
        props.originSslProtocols = props.originSslProtocols ?? this.defaults.originSslProtocols;
        props.protocolPolicy = props.protocolPolicy ?? this.defaults.protocolPolicy;
    }

    private getDomain(httpApi: HttpApi): string {
        return Fn.select(2, Fn.split('/', httpApi.url ?? ''));
    }

    private getOriginPath(httpApi: HttpApi, props: HttpFromHttpApiProps): string {
        if (props.originPath) {
            return props.originPath;
        }
        const url = httpApi.defaultStage?.url ?? httpApi.url;
        return this.getSuffixFrom(url ?? '');
    }

    private getSuffixFrom(url: string): string {
        return `/${Fn.select(3, Fn.split('/', url))}`;
    }

    private getProps(httpApi: HttpApi, props: HttpFromHttpApiProps): HttpOriginProps {
        const originPath = this.getOriginPath(httpApi, props);
        if (originPath && originPath !== '/') {
            return {
                originPath: originPath,
                ...<HttpOriginProps>props
            };
        }
        return <HttpOriginProps>props;
    }
}