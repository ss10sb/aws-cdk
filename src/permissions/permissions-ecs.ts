import {aws_lambda} from "aws-cdk-lib";
import {ICluster} from "aws-cdk-lib/aws-ecs";
import {PolicyStatement} from "aws-cdk-lib/aws-iam";

export class PermissionsEcs {

    static lambdaCanUpdateCluster(fn: aws_lambda.Function, cluster: ICluster): void {
        fn.addToRolePolicy(new PolicyStatement({
            actions: [
                'ecs:ListServices'
            ],
            resources: ['*']
        }));
        fn.addToRolePolicy(new PolicyStatement({
            actions: [
                'ecs:DescribeServices',
                'ecs:UpdateService',
            ],
            resources: ['*'],
            conditions: {
                'ArnEquals': {
                    'ecs:cluster': cluster.clusterArn
                }
            }
        }));
    }
}