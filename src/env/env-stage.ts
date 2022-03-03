import {Stage} from "aws-cdk-lib";
import {EnvConfig, EnvProps} from "./env-definitions";
import {EnvStack} from "./env-stack";

export class EnvStage extends Stage {

    build(config: EnvConfig, envProps: EnvProps) {
        const env = {
            account: this.getAccountId(config),
            region: this.getRegion(config)
        }
        const stack = new EnvStack(this, 'stack', config, envProps, {}, {
            env: env
        });
        stack.build();
    }

    protected getRegion(config: EnvConfig): string {
        if (config.AWSRegion) {
            return config.AWSRegion;
        }
        if (this.region) {
            return this.region;
        }
        return process.env.CDK_DEFAULT_REGION ?? '';
    }

    protected getAccountId(config: EnvConfig): string {
        if (config.AWSAccountId) {
            return config.AWSAccountId;
        }
        if (this.account) {
            return this.account;
        }
        return process.env.CDK_DEFAULT_ACCOUNT ?? '';
    }
}