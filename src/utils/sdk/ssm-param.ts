import {ClientDefaults, GetParameterCommand, SSMClient} from "@aws-sdk/client-ssm";

export interface SsmParamResponse {
    key: string;
    cached: boolean;
    value?: string;
}

export class SsmParam {

    readonly client: SSMClient;
    cached: SsmParamResponse[] = [];

    constructor(clientConfig: ClientDefaults) {
        this.client = this.createClient(clientConfig);
    }

    async fetch(key: string): Promise<SsmParamResponse> {
        const cached = this.getCached(key);
        if (cached) {
            return cached;
        }
        const command = new GetParameterCommand({Name: key});
        const response = await this.client.send(command);
        const paramResponse = {
            key: key,
            cached: false,
            value: response?.Parameter?.Value
        };
        this.cached.push(paramResponse);
        return paramResponse;
    }

    private getCached(key: string): SsmParamResponse | undefined {
        for (const paramResponse of this.cached) {
            if (paramResponse.key === key) {
                paramResponse.cached = true;
                return paramResponse;
            }
        }
    }

    private createClient(config: ClientDefaults): SSMClient {
        return new SSMClient(config);
    }
}