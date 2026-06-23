import {CfnTaskDefinition, ContainerDefinition, TaskDefinition} from "aws-cdk-lib/aws-ecs";
import {FilesBucket} from "../s3/s3-files";
import {IConnectable, ISecurityGroup, Port, SecurityGroup} from "aws-cdk-lib/aws-ec2";
import {NfsMount} from "./nfs-definitions";

export interface EcsS3FilesProps {
    readonly taskDef: TaskDefinition;
    readonly containerDef: ContainerDefinition;
    readonly filesBucket?: FilesBucket;
    readonly nfsMount?: NfsMount;
}

export class EcsS3FilesHelper {

    addIngressToService(service: IConnectable | ISecurityGroup, filesBucket?: FilesBucket): void {
        if (filesBucket) {
            const sg = this.getSecurityGroupFrom(service);
            filesBucket.securityGroup.addIngressRule(sg, Port.tcp(2049), 'NFS');
        }
    }

    handle(props: EcsS3FilesProps): void {
        if (props.filesBucket && props.nfsMount) {
            const volumeName = this.addVolume(props.taskDef, props.filesBucket);
            props.containerDef.addMountPoints({
                    containerPath: props.nfsMount.mountPath,
                    sourceVolume: volumeName,
                    readOnly: false
                }
            )
        }
    }

    protected getSecurityGroupFrom(service: IConnectable | ISecurityGroup): ISecurityGroup {
        if (service instanceof SecurityGroup) {
            return service;
        } else {
            return service.connections.securityGroups[0];
        }
    }

    protected addVolume(taskDef: TaskDefinition, filesBucket: FilesBucket): string {
        const volumeName = filesBucket.name + '-volume';
        const cfnTaskDef = taskDef.node.defaultChild as CfnTaskDefinition;
        cfnTaskDef.volumes = [{
            name: volumeName,
            s3FilesVolumeConfiguration: {
                fileSystemArn: filesBucket.filesystem.ref,
                rootDirectory: '/'
            }
        }];
        return volumeName;
    }
}