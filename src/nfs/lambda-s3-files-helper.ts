import {CfnFunction, IFunction} from "aws-cdk-lib/aws-lambda";
import {FilesBucket} from "../s3/s3-files";
import {NfsMount} from "./nfs-definitions";
import {Port} from "aws-cdk-lib/aws-ec2";

export interface LambdaS3FilesProps {
    func: IFunction;
    filesBucket?: FilesBucket;
    nfsMount?: NfsMount;
}

export class LambdaS3FilesHelper {
    handle(props: LambdaS3FilesProps): void {
        if (props.filesBucket && props.nfsMount) {
            this.addFilesystemToLambda(props.func, props.filesBucket, props.nfsMount);
            props.filesBucket.securityGroup.addIngressRule(props.func.connections.securityGroups[0], Port.tcp(2049), 'NFS');
        }
    }

    protected addFilesystemToLambda(func: IFunction, filesBucket: FilesBucket, nfsMount: NfsMount): void {
        const cfnLamdba = func.node.defaultChild as CfnFunction;
        cfnLamdba.fileSystemConfigs = [
            {
                arn: filesBucket.filesystem.ref,
                localMountPath: nfsMount.mountPath
            }
        ];
        func.node.addDependency(filesBucket.filesystem);
    }
}