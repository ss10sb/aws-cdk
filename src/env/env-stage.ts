import {StackProps, Stage} from "aws-cdk-lib";
import {EnvBuildType} from "./env-definitions";
import {EnvEcsProps, EnvEcsStack} from "./env-ecs-stack";
import {EnvLambdaProps, EnvLambdaStack} from "./env-lambda-stack";
import {EnvConfig} from "./env-base-stack";
import {ConfigStackHelper} from "../utils/config-stack-helper";
import {ConfigStackProps} from "../config/config-stack";
import {EnvBuildTypeHelper} from "../utils/env-build-type-helper";

export class EnvStage extends Stage {

    stack!: EnvEcsStack<EnvConfig> | EnvLambdaStack<EnvConfig> | undefined;

    build(config: EnvConfig, envProps: Record<string, any>) {
        const env = {
            account: this.getAccountId(config),
            region: this.getRegion(config)
        }
        const name = ConfigStackHelper.getMainStackName(config);
        this.stack = this.buildStack(name, config, {}, {env: env, stackName: name}, envProps);
    }

    protected buildStack(name: string, config: EnvConfig, configStackProps: ConfigStackProps, stackProps: StackProps, envProps: Record<string, any>) {
        const buildType = this.getBuildType(config);
        if (buildType === EnvBuildType.ECS) {
            const stack = new EnvEcsStack(this, name, config, configStackProps, stackProps, <EnvEcsProps>envProps);
            stack.build();
            return stack;
        }
        if (buildType === EnvBuildType.LAMBDA) {
            const stack = new EnvLambdaStack(this, name, config, configStackProps, stackProps, <EnvLambdaProps>envProps);
            stack.build();
            return stack;
        }
    }

    protected getBuildType(envConfig: EnvConfig): EnvBuildType {
        return EnvBuildTypeHelper.getType(envConfig);
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