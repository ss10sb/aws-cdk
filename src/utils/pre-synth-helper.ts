import {NamingHelper} from "./naming-helper";
import {ConfigStackHelper} from "./config-stack-helper";
import {StaticFileProvider} from "./static-file-provider";
import {ClientDefaults as SSMClientDefaults} from "@aws-sdk/client-ssm";
import {ClientDefaults as ECRClientDefaults} from "@aws-sdk/client-ecr";
import {EcrRepositories, EcrRepositoriesProps} from "../ecr/ecr-repositories";
import {EcrTag, TagResponse} from "./sdk/ecr-tag";
import {ConfigLoader} from "../config/config-loader";
import {ConfigSsmParams} from "./static-providers/config-ssm-params";
import {EcrTags} from "./static-providers/ecr-tags";
import {SsmParam} from "./sdk/ssm-param";

export interface PreSynthHelperResponse {
    config: Record<string, any>;
    ecrRepositories?: EcrRepositories;
    tagResponses?: TagResponse[];
}

export interface PreSynthHelperProps {
    configDir?: string;
    staticProviderBaseDir?: string;
    clientConfig: Record<string, any>;
    env?: string;
}

export interface PreSynthRunProps {
    loadEcr?: boolean;
}

export class PreSynthHelper {

    readonly props: PreSynthHelperProps;
    readonly staticProvider: StaticFileProvider;

    constructor(props: PreSynthHelperProps) {
        this.props = props;
        this.staticProvider = new StaticFileProvider(this.props.staticProviderBaseDir);
    }

    async run(props: PreSynthRunProps = {}): Promise<PreSynthHelperResponse> {
        const preLoadConfig = this.getPreLoadConfig();
        this.validateConfig(preLoadConfig);
        this.ensureClientConfigHasRegion(preLoadConfig);
        const configParam = NamingHelper.configParamName(ConfigStackHelper.getMainStackName(preLoadConfig));
        const config = await this.provisionConfig(configParam);
        this.validateConfig(config);
        let ecrRepositories: EcrRepositories | undefined = undefined;
        let tagResponses: TagResponse[] | undefined = undefined;
        if (props.loadEcr ?? true) {
            ecrRepositories = this.getEcrRepositories(config);
            tagResponses = await this.provisionEcrRepositories(ecrRepositories);
        }
        return {
            config: config,
            ecrRepositories: ecrRepositories,
            tagResponses: tagResponses
        }
    }

    private ensureClientConfigHasRegion(config: Record<string, any>) {
        if (!this.props.clientConfig.region) {
            this.props.clientConfig.region = ConfigStackHelper.getRegion(config);
        }
    }

    private getEcrRepositories(config: Record<string, any>): EcrRepositories {
        const appName = ConfigStackHelper.getAppName(config);
        const props: EcrRepositoriesProps = <EcrRepositoriesProps>(config?.Parameters?.repositories ?? {repositories: []});
        return new EcrRepositories(appName, props);
    }

    private getPreLoadConfig(): Record<string, any> {
        const configLoader = new ConfigLoader(this.props.configDir);
        return configLoader.load(this.props.env);
    }

    private async provisionConfig(configParam: string): Promise<Record<string, any>> {
        const configSsmParams = new ConfigSsmParams(this.staticProvider, configParam, this.getSsmParam());
        if (!configSsmParams.exists()) {
            await configSsmParams.put();
        }
        return configSsmParams.fetch();
    }

    private async provisionEcrRepositories(ecrRepositories: EcrRepositories): Promise<TagResponse[]> {
        const ecrTags = new EcrTags(this.staticProvider, ecrRepositories, this.getEcrTag());
        if (!ecrTags.exists()) {
            await ecrTags.put();
        }
        return ecrTags.fetch();
    }

    private getEcrTag(): EcrTag {
        return new EcrTag(<ECRClientDefaults>this.props.clientConfig);
    }

    private getSsmParam(): SsmParam {
        return new SsmParam(<SSMClientDefaults>this.props.clientConfig);
    }

    private validateConfig(config: Record<string, any>): void {
        ConfigStackHelper.validateMinConfig(config);
    }
}