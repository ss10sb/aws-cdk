import {EnvBuildType} from "../../env/env-definitions";

export class EnvironmentTypeChecker {
    constructor(private envTypes: any[] | null) {
    }

    checkEnvType(type: string): boolean {
        return this.envTypes?.some(parameters => parameters?.[type]) || false;
    }

    hasLambda(): boolean {
        return this.checkEnvType('lambda');
    }

    hasEcs(): boolean {
        return this.checkEnvType('ecs');
    }

    calculateBuildType(): EnvBuildType {
        if (this.hasLambda() && this.hasEcs()) {
            return EnvBuildType.MIXED;
        }
        if (this.hasLambda()) {
            return EnvBuildType.LAMBDA;
        }
        if (this.hasEcs()) {
            return EnvBuildType.ECS;
        }
        return EnvBuildType.MIXED;
    }
}

export class EnvBuildTypeHelper {

    static get(config: Record<string, any>): EnvBuildType {
        const envTypes = config?.Environments
            ?.map((envConfig: Record<string, any>) => envConfig.Parameters)
            .filter(Boolean);
        const environmentTypeChecker = new EnvironmentTypeChecker(envTypes);
        return environmentTypeChecker.calculateBuildType();
    }

    static isLambda(buildType: EnvBuildType): boolean {
        return buildType === EnvBuildType.LAMBDA || buildType === EnvBuildType.MIXED;
    }

    static isEcs(buildType: EnvBuildType): boolean {
        return buildType === EnvBuildType.ECS || buildType === EnvBuildType.MIXED;
    }
}