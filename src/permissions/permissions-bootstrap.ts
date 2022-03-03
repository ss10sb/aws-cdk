import {PolicyStatement} from "aws-cdk-lib/aws-iam";

export class PermissionsBootstrap {

    static policyStatementForBootstrapRole(role = 'lookup'): PolicyStatement {
        return new PolicyStatement({
            actions: ['sts:AssumeRole'],
            resources: ['*'],
            conditions: {
                StringEquals: {
                    'iam:ResourceTag/aws-cdk:bootstrap-role': role,
                },
            },
        });
    }
}