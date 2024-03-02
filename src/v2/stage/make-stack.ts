import {Construct} from "constructs";
import {ConfigStack, ConfigStackProps} from "../../config/config-stack";
import {StackProps, Tags} from "aws-cdk-lib";
import {PreBuildLookups} from "../../env/pre-build-lookups";
import {MakeEcs, MakeEcsParameters} from "./support/make-ecs";
import {MakeLambda, MakeLambdaParameters} from "./support/make-lambda";
import {EnvConfig} from "../../env/env-base-stack";
import {MakeConfig} from "./make-definitions";
import {MakeCoreResources} from "./support/make-core-resources";

export class MakeStack<T extends MakeConfig> extends ConfigStack {

    lookups!: PreBuildLookups;
    envProps: Record<string, string>;

    constructor(scope: Construct, id: string, config: T, configStackProps: ConfigStackProps, stackProps: StackProps, envProps: Record<string, any>) {
        super(scope, id, config, configStackProps, stackProps);
        this.envProps = envProps;
        Tags.of(scope).add('College', config.College);
        Tags.of(scope).add('Environment', config.Environment);
        Tags.of(scope).add('App', config.Name);
    }

    preBuild() {
        this.lookups = new PreBuildLookups(this, this.node.id, <EnvConfig>this.config);
    }

    exec() {
        const coreServices = new MakeCoreResources(this, this.node.id, <MakeConfig>this.config, this.lookups);
        const services = coreServices.create();
        if (this.config.Parameters?.lambda) {
            const makeLambda = new MakeLambda<MakeLambdaParameters>(
                this,
                this.node.id,
                this.lookups,
                <MakeConfig>this.config,
                {}
            );
            makeLambda.make(services);
        }
        if (this.config.Parameters?.ecs) {
            const makeEcs = new MakeEcs<MakeEcsParameters>(
                this,
                this.node.id,
                this.lookups,
                <MakeConfig>this.config,
                {
                    repositoryFactory: this.envProps.repositoryFactory
                }
            );
            makeEcs.make(services);
        }
    }
}