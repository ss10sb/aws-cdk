import {VerifySesDomain} from "./verify-ses-domain";
import {NonConstruct} from "../core/non-construct";

export interface SesVerifyDomainProps {
    subdomain: string;
    hostedZone: string;
}

export class SesVerifyDomain extends NonConstruct {

    public verifyDomain(props: SesVerifyDomainProps): VerifySesDomain {
        return new VerifySesDomain(this.scope, this.mixNameWithId(`ses-verify-${props.subdomain}`), {
            domainName: this.getDomainName(props),
            hostedZoneName: props.hostedZone,
            addMxRecord: false
        });
    }

    protected getDomainName(props: SesVerifyDomainProps): string {
        if (!props.subdomain.endsWith(props.hostedZone)) {
            return `${props.subdomain}.${props.hostedZone}`;
        }
        return props.subdomain;
    }
}