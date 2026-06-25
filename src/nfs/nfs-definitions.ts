export enum NfsType {
    S3Files = 's3-files',
}

export interface NfsMount {
    readonly mountPath: string;
    readonly type?: NfsType;
    readonly uid?: string;
    readonly gid?: string;
}