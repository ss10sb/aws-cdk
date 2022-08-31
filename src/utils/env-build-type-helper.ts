import {EnvConfig} from "../env/env-base-stack";
import {EnvBuildType} from "../env/env-definitions";

export class EnvBuildTypeHelper {

    static getType(envConfig: EnvConfig): EnvBuildType {
        if (envConfig.Parameters.buildType) {
            return envConfig.Parameters.buildType;
        }
        return this.guessType(envConfig);
    }

    private static guessType(envConfig: EnvConfig): EnvBuildType {
        if (envConfig.Parameters.distribution) {
            return EnvBuildType.LAMBDA;
        }
        return EnvBuildType.ECS;
    }
}