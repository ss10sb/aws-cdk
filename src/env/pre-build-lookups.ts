import {Construct} from "constructs";
import {EnvBuildType} from "./env-definitions";
import {resetStaticProps} from "../utils/reset-static-props";
import {IVpc} from "aws-cdk-lib/aws-ec2";
import {IApplicationListener, IApplicationLoadBalancer} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import {IDistribution} from "aws-cdk-lib/aws-cloudfront";
import {ISecret} from "aws-cdk-lib/aws-secretsmanager";
import {EnvConfig} from "./env-base-stack";
import {NonConstruct} from "../core/non-construct";
import {AlbHelper} from "../utils/alb-helper";
import {VpcHelper} from "../utils/vpc-helper";
import {Secrets} from "../secret/secrets";

export class PreBuildLookups extends NonConstruct {

    vpc: IVpc;
    alb: IApplicationLoadBalancer;
    albListener: IApplicationListener;
    distribution?: IDistribution;
    secret?: ISecret;
    buildType: EnvBuildType;

    constructor(scope: Construct, id: string, config: EnvConfig, buildType: EnvBuildType) {
        super(scope, id);
        resetStaticProps();
        this.buildType = buildType;
        const albArn = AlbHelper.getAlbArnFromConfigOrParam(this.scope, config);
        this.albListener = AlbHelper.getApplicationListener(this.scope, config, albArn);
        this.alb = AlbHelper.getAlbByArn(this.scope, albArn);
        if (this.alb?.vpc) {
            this.vpc = this.alb.vpc;
        } else {
            this.vpc = VpcHelper.getVpcFromConfig(this.scope, config);
        }
        if (config.Parameters.secretArn) {
            this.secret = this.getSecretByArn(config.Parameters.secretArn);
        } else {
            this.secret = this.getSecretByName();
        }
    }

    setDistribution(distribution: IDistribution): void {
        this.distribution = distribution;
    }

    getSecretByArn(arn: string): ISecret | undefined {
        const secrets = new Secrets(this.scope, this.id);
        return secrets.fetchByArn(arn);
    }

    getSecretByName(): ISecret | undefined {
        const secrets = new Secrets(this.scope, this.id);
        return secrets.fetch();
    }

    getAliasTarget(): IApplicationLoadBalancer | IDistribution {
        if (this.distribution !== undefined) {
            return this.distribution;
        }
        return this.alb;
    }

}