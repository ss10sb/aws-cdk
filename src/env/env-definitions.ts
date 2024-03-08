import {Queue} from "aws-cdk-lib/aws-sqs";
import {Table} from "aws-cdk-lib/aws-dynamodb";
import {Bucket} from "aws-cdk-lib/aws-s3";
import {ARecord} from "aws-cdk-lib/aws-route53";
import {EmailIdentity} from "aws-cdk-lib/aws-ses";
import {Secrets} from "../secret/secrets";
import {ISecret} from "aws-cdk-lib/aws-secretsmanager";
import {VerifySesDomain as OldVerify} from "../ses/verify-ses-domain";
import {VerifySesDomain} from "@seeebiii/ses-verify-identities";

export enum EnvBuildType {
    ECS,
    LAMBDA,
    MIXED
}

export enum EnvEndpointType {
    LOADBALANCER,
    CLOUDFRONT,
    NONE
}

export interface EnvProps {
}

export interface EnvStackServicesProps {
    readonly aRecord?: ARecord;
    readonly queue?: Queue;
    readonly s3?: Bucket;
    readonly sesVerify?: VerifySesDomain | OldVerify;
    readonly dkimIdentity?: EmailIdentity;
    readonly table?: Table;
    readonly secrets?: ISecret;
    readonly sharedSecrets?: ISecret;
}

export interface EnvEnvironmentProps {
    readonly table?: Table;
    readonly queue?: Queue;
    readonly s3?: Bucket;
}
