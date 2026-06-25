import {CfnTaskDefinition, ContainerDefinition, TaskDefinition} from "aws-cdk-lib/aws-ecs";
import {FilesBucket} from "../s3/s3-files";
import {IConnectable, ISecurityGroup, Port, SecurityGroup} from "aws-cdk-lib/aws-ec2";
import {NfsMount} from "./nfs-definitions";
import assert from "node:assert";
import {S3AccessPoint} from "./s3-access-point";
import {NonConstruct} from "../core/non-construct";
import {CfnAccessPoint, CfnFileSystem} from "aws-cdk-lib/aws-s3files";

export interface EcsS3FilesProps {
    readonly taskDef: TaskDefinition;
    readonly containerDef: ContainerDefinition;
    readonly filesBucket?: FilesBucket;
    readonly nfsMount?: NfsMount;
}

export class EcsS3FilesHelper extends NonConstruct {

    addIngressToService(service: IConnectable | ISecurityGroup, filesBucket?: FilesBucket): void {
        if (filesBucket) {
            const sg = this.getSecurityGroupFrom(service);
            filesBucket.securityGroup.addIngressRule(sg, Port.tcp(2049), 'NFS');
        }
    }

    handle(props: EcsS3FilesProps): void {
        if (props.filesBucket && props.nfsMount) {
            assert(props.nfsMount.mountPath.startsWith('/mnt/'), 'mountPath must start with /mnt/');
            const accessPoint = this.createAccessPoint(props.filesBucket.filesystem, props.nfsMount);
            const volumeName = this.addVolume(props.taskDef, props.filesBucket, accessPoint);
            props.containerDef.addMountPoints({
                    containerPath: props.nfsMount.mountPath,
                    sourceVolume: volumeName,
                    readOnly: false
                }
            )
        }
    }

    protected createAccessPoint(filesystem: CfnFileSystem, props: NfsMount): CfnAccessPoint {
        return new S3AccessPoint(this.scope, this.id).create(filesystem, props);
    }

    protected getSecurityGroupFrom(service: IConnectable | ISecurityGroup): ISecurityGroup {
        if (service instanceof SecurityGroup) {
            return service;
        } else {
            return service.connections.securityGroups[0];
        }
    }

    protected addVolume(taskDef: TaskDefinition, filesBucket: FilesBucket, accessPoint: CfnAccessPoint): string {
        const volumeName = filesBucket.name + '-volume';
        const fileSystemArn = filesBucket.filesystem.getAtt('FileSystemArn').toString();
        const accessPointArn = accessPoint.getAtt('AccessPointArn').toString();
        const cfnTaskDef = taskDef.node.defaultChild as CfnTaskDefinition;
        const existingVolumes = Array.isArray(cfnTaskDef.volumes)
            ? cfnTaskDef.volumes
            : [];
        cfnTaskDef.volumes = [
            ...existingVolumes,
            {
                name: volumeName,
                s3FilesVolumeConfiguration: {
                    accessPointArn: accessPointArn,
                    fileSystemArn: fileSystemArn,
                    rootDirectory: '/',
                }
            }
        ];
        return volumeName;
    }
}