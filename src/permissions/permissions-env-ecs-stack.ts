import {Construct} from "constructs";
import {PermissionsQueue} from "./permissions-queue";
import {PermissionsSes} from "./permissions-ses";
import {PermissionsS3} from "./permissions-s3";
import {PermissionsEcs} from "./permissions-ecs";
import {PermissionsDynamodb} from "./permissions-dynamodb";
import {NonConstruct} from "../core/non-construct";
import {EnvEcsStackServicesProps} from "../env/env-ecs-stack";
import {PermissionsExecuteCommand} from "./permissions-execute-command";
import {PermissionsSecret} from "./permissions-secret";

export class PermissionsEnvEcsStack extends NonConstruct {

    readonly props: EnvEcsStackServicesProps;

    constructor(scope: Construct, id: string, props: EnvEcsStackServicesProps) {
        super(scope, id);
        this.props = props;
        this.handlePermissions();
    }

    private handlePermissions() {
        this.sharedSecretPermissions();
        this.secretPermissions();
        this.queuePermissions();
        this.s3Permissions();
        this.sesPermissions();
        this.startStopPermissions();
        this.tablePermissions();
        this.executeCommandPermissions();
    }

    private sharedSecretPermissions() {
        if (this.props.sharedSecrets) {
            PermissionsSecret.tasksServicesCanReadSecret(this.props.tasksAndServices, this.props.sharedSecrets);
        }
    }

    private secretPermissions() {
        if (this.props.secrets) {
            PermissionsSecret.tasksServicesCanReadSecret(this.props.tasksAndServices, this.props.secrets);
        }
    }

    private queuePermissions() {
        if (this.props.queue) {
            PermissionsQueue.tasksServicesCanUseQueue(this.props.tasksAndServices, this.props.queue);
        }
    }

    private s3Permissions() {
        if (this.props.s3) {
            PermissionsS3.tasksServicesCanReadWriteS3(this.props.tasksAndServices, this.props.s3);
        }
    }

    private startStopPermissions() {
        if (this.props.startStop) {
            PermissionsEcs.lambdaCanUpdateCluster(this.props.startStop.startStopFunc.function, this.props.cluster);
        }
    }

    private tablePermissions() {
        if (this.props.table) {
            PermissionsDynamodb.tasksServicesCanReadWriteDynamoDb(this.props.tasksAndServices, this.props.table);
        }
    }

    private sesPermissions() {
        PermissionsSes.tasksServicesCanSendEmail(this.props.tasksAndServices);
    }

    private executeCommandPermissions() {
        PermissionsExecuteCommand.tasksServicesCanExecuteCommands(this.props.tasksAndServices);
    }
}