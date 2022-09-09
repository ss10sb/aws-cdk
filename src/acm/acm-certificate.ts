import {CertificateValidation, DnsValidatedCertificate} from "aws-cdk-lib/aws-certificatemanager";
import {HostedZone, IHostedZone} from "aws-cdk-lib/aws-route53";
import {NonConstruct} from "../core/non-construct";
import {Route53Helper} from "../utils/route53-helper";

export interface DnsValidatedCertificateProps {
    domainName: string;
    hostedZone: string | IHostedZone;
    region?: string;
}

export class AcmCertificate extends NonConstruct {

    create(props: DnsValidatedCertificateProps) {
        const name = this.mixNameWithId(`${props.domainName}-${props.region ?? 'default'}`);
        const hostedZone = this.getHostedZone(props.hostedZone);
        return new DnsValidatedCertificate(this.scope, name, {
            domainName: props.domainName,
            hostedZone: hostedZone,
            region: props.region,
            validation: CertificateValidation.fromDns(hostedZone),
            cleanupRoute53Records: true
        });
    }

    protected getHostedZone(hostedZone: string | IHostedZone): IHostedZone {
        if (hostedZone instanceof HostedZone) {
            return hostedZone;
        }
        return Route53Helper.getHostedZoneFromDomain(this.scope, <string>hostedZone);
    }
}