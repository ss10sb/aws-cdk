import {ConfigStack} from "../../config/config-stack";
import {EnvBuildType} from "../../env/env-definitions";
import {EcrRepositories} from "../../ecr/ecr-repositories";
import {EnvBuildTypeHelper} from "../utils/env-build-type-helper";
import {CoreCodePipelineResources, MakeCoreResources} from "./support/make-core-resources";
import {EcsResources, MakeEcsResources} from "./support/make-ecs-resources";
import {MakeNotificationResources, NotificationResources} from "./support/make-notification-resources";
import {MakeCodePipelineStages, MakeCodePipelineStagesProps} from "./make-code-pipeline-stages";
import {
    CodePipelineEcsStackServicesProps,
    CodePipelineLambdaStackServicesProps
} from "../../pipeline/code-pipeline-definitions";
import {PermissionsCodePipelineEcsStack} from "../../permissions/permissions-code-pipeline-ecs-stack";
import {PermissionsCodePipelineLambdaStack} from "../../permissions/permissions-code-pipeline-lambda-stack";

export class CodePipelineStack extends ConfigStack {

    ecrRepositories?: EcrRepositories;
    envStages?: MakeCodePipelineStages;

    exec() {
        const ecsServiceProps: Record<string, any> = {
            needsSharedSynthStepPermissions: true
        };
        const lambdaServiceProps: Record<string, any> = {
            needsSharedSynthStepPermissions: true
        };
        const buildType = this.getBuildType();
        const makeCoreResources = new MakeCoreResources(this, this.node.id, this.config, {
            buildType: this.getBuildType(),
            ecrRepositories: this.ecrRepositories
        });
        const coreResources = makeCoreResources.make();
        this.addEcsServicePropsFromCoreResources(coreResources, ecsServiceProps);
        this.addLambdaServicePropsFromCoreResources(coreResources, lambdaServiceProps);
        if (EnvBuildTypeHelper.isEcs(buildType)) {
            lambdaServiceProps.needsSharedSynthStepPermissions = false;
            const ecsMaker = new MakeEcsResources(this, this.node.id, this.config);
            const ecsResources = ecsMaker.make(coreResources);
            this.addEcsServicePropsFromEcsResources(ecsResources, ecsServiceProps);
        }
        if (EnvBuildTypeHelper.isLambda(buildType)) {

        }
        const envStages = this.createStagesFromEnvironments({
            pipeline: coreResources.pipeline,
            repositoryFactory: coreResources.repositoryFactory,
            environments: this.config.Environments ?? []
        });
        this.envStages = envStages; // so tests can access stages
        ecsServiceProps.envStages = envStages;
        lambdaServiceProps.envStages = envStages;
        const makeNotificationResources = new MakeNotificationResources(this, this.node.id, this.config);
        const notificationResources = makeNotificationResources.make(coreResources);
        this.addEcsServicePropsFromNotificationResources(notificationResources, ecsServiceProps);
        this.addLambdaServicePropsFromNotificationResources(notificationResources, lambdaServiceProps);
        if (EnvBuildTypeHelper.isEcs(buildType)) {
            new PermissionsCodePipelineEcsStack(this, this.node.id, <CodePipelineEcsStackServicesProps>ecsServiceProps, this.config.Environments ?? []);
        }
        if (EnvBuildTypeHelper.isLambda(buildType)) {
            new PermissionsCodePipelineLambdaStack(this, this.node.id, <CodePipelineLambdaStackServicesProps>lambdaServiceProps, this.config.Environments ?? []);
        }
    }

    public setEcrRepositories(ecrRepositories?: EcrRepositories) {
        this.ecrRepositories = ecrRepositories;
    }

    private createStagesFromEnvironments(props: MakeCodePipelineStagesProps): MakeCodePipelineStages {
        return new MakeCodePipelineStages(this, this.node.id, props);
    }

    private getBuildType(): EnvBuildType {
        return EnvBuildTypeHelper.get(this.config);
    }

    private addEcsServicePropsFromCoreResources(coreResources: CoreCodePipelineResources, props: Record<string, any>): void {
        props.repositoryFactory = coreResources.repositoryFactory;
        props.pipelineSource = coreResources.source;
        props.synthStep = coreResources.synthStep;
    }

    private addLambdaServicePropsFromCoreResources(coreResources: CoreCodePipelineResources, props: Record<string, any>): void {
        props.pipelineSource = coreResources.source;
        props.synthStep = coreResources.synthStep;
    }

    private addEcsServicePropsFromEcsResources(ecsResources: EcsResources, props: Record<string, any>): void {
        props.ecrSteps = ecsResources.ecrSteps;
    }

    private addEcsServicePropsFromNotificationResources(notificationResources: NotificationResources, props: Record<string, any>) {
        props.notificationRule = notificationResources.notificationRule;
        props.runSchedule = notificationResources.runSchedule;
    }

    private addLambdaServicePropsFromNotificationResources(notificationResources: NotificationResources, props: Record<string, any>) {
        props.notificationRule = notificationResources.notificationRule;
        props.runSchedule = notificationResources.runSchedule;
    }
}