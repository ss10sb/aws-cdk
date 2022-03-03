import {NonConstruct} from "../core";
import {Construct} from "constructs";
import {EnvStackServicesProps} from "../env";
import {PermissionsQueue} from "./permissions-queue";
import {PermissionsSes} from "./permissions-ses";
import {PermissionsS3} from "./permissions-s3";
import {PermissionsEcs} from "./permissions-ecs";
import {PermissionsDynamodb} from "./permissions-dynamodb";

export class PermissionsEnvStack extends NonConstruct {

    readonly props: EnvStackServicesProps;

    constructor(scope: Construct, id: string, props: EnvStackServicesProps) {
        super(scope, id);
        this.props = props;
        this.handlePermissions();
    }

    private handlePermissions() {
        this.queuePermissions();
        this.s3Permissions();
        this.sesPermissions();
        this.startStopPermissions();
        this.tablePermissions();
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
}