import {DeadLetterQueue, QueueEncryption} from "aws-cdk-lib/aws-sqs";
import {Duration} from "aws-cdk-lib";

export interface SqsProps {
    queueName?: string;
    encryption?: QueueEncryption;
    deadLetterQueue?: DeadLetterQueue;
    retentionPeriod?: Duration;
}