import {ConfigEnvironments, ConfigStackProps} from "./config-definitions";
import {Stack, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";

export class ConfigStack extends Stack {

    public config: Record<string, any>;
    public readonly internalId: string;

    constructor(
        scope: Construct,
        id: string,
        config: Record<string, any>,
        configStackProps: ConfigStackProps = {},
        stackProps: StackProps = {}
    ) {
        const internalId = id;
        if (configStackProps.suffix) {
            id = `${id}-${configStackProps.suffix}`;
        }
        super(scope, id, stackProps);
        this.internalId = internalId;
        this.config = config;
    }

    get isProd(): boolean {
        return this.config.Environment === ConfigEnvironments.PROD;
    }

    mixNameWithId(name: string): string {
        return `${this.internalId}-${name}`;
    }

    build() {
        this.preBuild();
        this.exec();
        this.postBuild();
    }

    exec() {
        return;
    }

    preBuild() {
        return;
    }

    postBuild() {
        return;
    }
}