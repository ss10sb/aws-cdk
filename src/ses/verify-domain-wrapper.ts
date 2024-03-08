import {NonConstruct} from "../core/non-construct";
import {VerifySesDomain} from "@seeebiii/ses-verify-identities";
import {RemovalPolicy} from "aws-cdk-lib";

export interface SesVerifyDomainProps {
    subdomain: string;
    hostedZone: string;
}

export class VerifyDomainWrapper extends NonConstruct {

    public verifyDomain(props: SesVerifyDomainProps): VerifySesDomain {
        return new VerifySesDomain(this.scope, this.mixNameWithId(`ses-verify-${props.subdomain}`), {
            domainName: this.getDomainName(props),
            hostedZoneName: props.hostedZone,
            notificationTypes: ['Complaint'],
            removalPolicy: RemovalPolicy.DESTROY
        });
    }

    protected getDomainName(props: SesVerifyDomainProps): string {
        if (!props.subdomain.endsWith(props.hostedZone)) {
            return `${props.subdomain}.${props.hostedZone}`;
        }
        return props.subdomain;
    }
}