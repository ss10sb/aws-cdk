import {Construct} from "constructs";
import {PermissionsQueue} from "./permissions-queue";
import {PermissionsSes} from "./permissions-ses";
import {PermissionsS3} from "./permissions-s3";
import {PermissionsDynamodb} from "./permissions-dynamodb";
import {PermissionsSecret} from "./permissions-secret";
import {NonConstruct} from "../core/non-construct";
import {EnvLambdaStackServicesProps} from "../env/env-lambda-stack";

export class PermissionsEnvLambdaStack extends NonConstruct {

    readonly props: EnvLambdaStackServicesProps;

    constructor(scope: Construct, id: string, props: EnvLambdaStackServicesProps) {
        super(scope, id);
        this.props = props;
        this.handlePermissions();
    }

    private handlePermissions() {
        this.queuePermissions();
        this.s3Permissions();
        this.sesPermissions();
        this.tablePermissions();
        this.secretPermissions();
    }

    private queuePermissions() {
        if (this.props.queue) {
            PermissionsQueue.functionsCanUseQueue(this.props.functions, this.props.queue);
        }
    }

    private s3Permissions() {
        if (this.props.s3) {
            PermissionsS3.functionsCanReadWriteS3(this.props.functions, this.props.s3);
        }
    }

    private tablePermissions() {
        if (this.props.table) {
            PermissionsDynamodb.functionsCanReadWriteDynamoDb({
                functions: this.props.functions,
                dynamodb: this.props.table
            });
        }
    }

    private secretPermissions() {
        if (this.props.secret) {
            PermissionsSecret.functionsCanReadSecret(this.props.functions, this.props.secret);
        }
    }

    private sesPermissions() {
        PermissionsSes.functionsCanSendEmail(this.props.functions);
    }
}