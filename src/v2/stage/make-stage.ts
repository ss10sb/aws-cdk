import {StackProps, Stage} from "aws-cdk-lib";
import {MakeStack} from "./make-stack";
import {MakeConfig} from "./make-definitions";
import {ConfigStackHelper} from "../../utils/config-stack-helper";
import {ConfigStackProps} from "../../config/config-stack";

export class MakeStage extends Stage {

    stack!: MakeStack<MakeConfig> | undefined;

    build(config: MakeConfig, envProps: Record<string, any>) {
        const env = {
            account: this.getAccountId(config),
            region: this.getRegion(config)
        }
        const name = ConfigStackHelper.getMainStackName(config);
        this.stack = this.buildStack(name, config, {}, {env: env, stackName: name}, envProps);
    }

    protected buildStack(name: string, config: MakeConfig, configStackProps: ConfigStackProps, stackProps: StackProps, envProps: Record<string, any>) {
        const stack = new MakeStack(this, name, config, configStackProps, stackProps, envProps);
        stack.build();
        return stack;
    }

    protected getRegion(config: MakeConfig): string {
        if (config.AWSRegion) {
            return config.AWSRegion;
        }
        if (this.region) {
            return this.region;
        }
        return process.env.CDK_DEFAULT_REGION ?? '';
    }

    protected getAccountId(config: MakeConfig): string {
        if (config.AWSAccountId) {
            return config.AWSAccountId;
        }
        if (this.account) {
            return this.account;
        }
        return process.env.CDK_DEFAULT_ACCOUNT ?? '';
    }
}