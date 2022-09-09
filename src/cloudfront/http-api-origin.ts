import {OriginBase, OriginSslPolicy, OriginProtocolPolicy, CfnDistribution} from "aws-cdk-lib/aws-cloudfront";
import {HttpApi} from "@aws-cdk/aws-apigatewayv2-alpha";
import {Fn} from "aws-cdk-lib";

export interface HttpApiOriginProps {
    /**
     * Specifies how long, in seconds, CloudFront waits for a response from the origin, also known as the origin response timeout.
     * The valid range is from 1 to 180 seconds, inclusive.
     *
     * Note that values over 60 seconds are possible only after a limit increase request for the origin response timeout quota
     * has been approved in the target account; otherwise, values over 60 seconds will produce an error at deploy time.
     *
     * @default Duration.seconds(30)
     */
    readonly readTimeout?: number;

    /**
     * Specifies how long, in seconds, CloudFront persists its connection to the origin.
     * The valid range is from 1 to 180 seconds, inclusive.
     *
     * Note that values over 60 seconds are possible only after a limit increase request for the origin response timeout quota
     * has been approved in the target account; otherwise, values over 60 seconds will produce an error at deploy time.
     *
     * @default Duration.seconds(5)
     */
    readonly keepaliveTimeout?: number;
}

function getOriginPath(httpApi: HttpApi): string | undefined {
    const path = httpApi.defaultStage?.stageName;
    if (path && path !== '$default') {
        return `/${path}`;
    }
}

export class HttpApiOrigin extends OriginBase {

    constructor(httpApi: HttpApi, private readonly props: HttpApiOriginProps = {}) {
        // urlForPath() is of the form 'https://<rest-api-id>.execute-api.<region>.amazonaws.com/<stage>'
        // Splitting on '/' gives: ['https', '', '<rest-api-id>.execute-api.<region>.amazonaws.com', '<stage>']
        // The element at index 2 is the domain name, the element at index 3 is the stage name
        super(Fn.select(2, Fn.split('/', httpApi.url ?? '')), {
            originPath: getOriginPath(httpApi),
            ...props,
        });
    }

    protected renderCustomOriginConfig(): CfnDistribution.CustomOriginConfigProperty | undefined {
        return {
            originSslProtocols: [OriginSslPolicy.TLS_V1_2],
            originProtocolPolicy: OriginProtocolPolicy.HTTPS_ONLY,
            originReadTimeout: this.validateSeconds(1, 180, 30, this.props.readTimeout),
            originKeepaliveTimeout: this.validateSeconds(1, 180, 5, this.props.keepaliveTimeout),
        };
    }

    protected validateSeconds(min: number, max: number, defaultValue: number, time?: number): number {
        if (time !== undefined && time >= min && time <= max) {
            return time;
        }
        return defaultValue;
    }
}