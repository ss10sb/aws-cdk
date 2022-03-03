import {NonConstruct} from "../core";
import {Construct} from "constructs";
import {Queue, QueueEncryption} from "aws-cdk-lib/aws-sqs";
import {SqsProps} from "./sqs-definitions";

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