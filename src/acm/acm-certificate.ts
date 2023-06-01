import {Certificate, CertificateValidation} from "aws-cdk-lib/aws-certificatemanager";
import {HostedZone, IHostedZone} from "aws-cdk-lib/aws-route53";
import {NonConstruct} from "../core/non-construct";
import {Route53Helper} from "../utils/route53-helper";
import {RemovalPolicy} from "aws-cdk-lib";

export interface DnsValidatedCertificateProps {
    domainName: string;
    hostedZone: string | IHostedZone;
}

export class AcmCertificate extends NonConstruct {

    create(props: DnsValidatedCertificateProps): Certificate {
        const name = this.mixNameWithId(`${props.domainName}`);
        const hostedZone = this.getHostedZone(props.hostedZone);
        const cert = new Certificate(this.scope, name, {
            domainName: props.domainName,
            validation: CertificateValidation.fromDns(hostedZone),
        });
        cert.applyRemovalPolicy(RemovalPolicy.DESTROY);
        return cert;
    }

    protected getHostedZone(hostedZone: string | IHostedZone): IHostedZone {
        if (hostedZone instanceof HostedZone) {
            return hostedZone;
        }
        return Route53Helper.getHostedZoneFromDomain(this.scope, <string>hostedZone);
    }
}