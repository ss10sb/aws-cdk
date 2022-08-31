export interface QueueConfigProps {
    readonly hasSecrets?: boolean;
    readonly hasEnv?: boolean;
    readonly hasDeadLetterQueue?: boolean;
    readonly retentionPeriodInDays?: number;
    readonly maxReceiveCount?: number;
}