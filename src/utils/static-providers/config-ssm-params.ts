import {UsesStaticProvider} from "./uses-static-provider";
import {StaticFileProvider} from "../static-file-provider";
import {BaseConfig} from "../../config/config-definitions";
import {SsmParam, SsmParamResponse} from "../sdk/ssm-param";

export class ConfigSsmParams<T extends BaseConfig> implements UsesStaticProvider<T> {

    readonly staticProvider: StaticFileProvider;
    readonly paramName: string;
    readonly ssmParam: SsmParam;

    constructor(staticProvider: StaticFileProvider, paramName: string, ssmParam: SsmParam) {
        this.staticProvider = staticProvider;
        this.paramName = paramName;
        this.ssmParam = ssmParam;
    }

    fetch(): T {
        return <T>(this.staticProvider.fetch(this.getName()) ?? {});
    }

    getName(): string {
        return 'configSsmParams';
    }

    async put(): Promise<void> {
        const data = await this.getDataFromSsm();
        this.staticProvider.putString(this.getName(), data?.value ?? '{}');
    }

    exists(): boolean {
        return this.staticProvider.exists(this.getName());
    }

    clear() {
        this.staticProvider.remove(this.getName());
    }

    private async getDataFromSsm(): Promise<SsmParamResponse> {
        return this.ssmParam.fetch(this.paramName);
    }
}