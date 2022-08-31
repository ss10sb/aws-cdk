import {Construct} from "constructs";
import {DeadLetterQueue, Queue, QueueEncryption} from "aws-cdk-lib/aws-sqs";
import {Duration} from "aws-cdk-lib";
import {NonConstruct} from "../core/non-construct";

export interface SqsProps {
    queueName?: string;
    encryption?: QueueEncryption;
    deadLetterQueue?: DeadLetterQueue;
    retentionPeriod?: Duration;
}
export class Sqs extends NonConstruct {

    readonly defaults: Record<string, any> = {};

    constructor(scope: Construct, id: string) {
        super(scope, id);
        this.defaults = {
            queueName: this.mixNameWithId('queue'),
            encryption: QueueEncryption.KMS_MANAGED
        };
    }

    create(props: SqsProps): Queue {
        const queueName = this.getQueueName(props);
        props.queueName = queueName;
        return new Queue(this.scope, queueName, {
            queueName: props.queueName,
            encryption: props.encryption ?? this.defaults.encryption,
            deadLetterQueue: props.deadLetterQueue ?? undefined,
            retentionPeriod: props.retentionPeriod ?? undefined
        });
    }

    private getQueueName(props: SqsProps): string {
        if (props.queueName) {
            return this.mixNameWithId(props.queueName);
        }
        return this.defaults.queueName;
    }
}