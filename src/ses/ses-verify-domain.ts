import {NonConstruct} from "../core";
import {SesVerifyDomainProps} from "./ses-definitions";
import {VerifySesDomain} from "./verify-ses-domain";

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