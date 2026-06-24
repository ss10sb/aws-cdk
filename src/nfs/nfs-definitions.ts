export enum NfsType {
    S3Files = 's3-files',
}

export interface NfsMount {
    readonly type?: NfsType;
    readonly mountPath: string;
}