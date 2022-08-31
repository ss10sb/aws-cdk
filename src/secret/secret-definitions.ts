
export interface SecretsConfig extends Record<string, any> {
    readonly Parameters: SecretsParameters;
}

export interface SecretItem {
    key: string;
    value: string | number | boolean;
}

export interface SecretsParameters {
    readonly secrets: SecretItem[];
}