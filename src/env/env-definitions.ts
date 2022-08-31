import {Queue} from "aws-cdk-lib/aws-sqs";
import {Table} from "aws-cdk-lib/aws-dynamodb";
import {Bucket} from "aws-cdk-lib/aws-s3";
import {ARecord} from "aws-cdk-lib/aws-route53";
import {VerifySesDomain} from "../ses/verify-ses-domain";

export enum EnvBuildType {
    ECS,
    LAMBDA
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
    readonly sesVerify?: VerifySesDomain;
    readonly table?: Table;
}

export interface EnvEnvironmentProps {
    readonly table?: Table;
    readonly queue?: Queue;
    readonly s3?: Bucket;
}
