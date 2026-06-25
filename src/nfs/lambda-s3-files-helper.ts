import {FileSystem, IFunction} from "aws-cdk-lib/aws-lambda";
import {FilesBucket} from "../s3/s3-files";
import {NfsMount} from "./nfs-definitions";
import assert from "node:assert";
import {NonConstruct} from "../core/non-construct";
import {NameIncrementer} from "../utils/name-incrementer";
import {Construct} from "constructs";
import {CfnAccessPoint} from "aws-cdk-lib/aws-s3files";

export interface LambdaS3FilesProps {
    func: IFunction;
    filesBucket?: FilesBucket;
    nfsMount?: NfsMount;
}

export class LambdaS3FilesHelper extends NonConstruct {

    readonly nameIncrementer: NameIncrementer;

    constructor(scope: Construct, id: string) {
        super(scope, id);
        this.nameIncrementer = new NameIncrementer();
    }

    handle(props: LambdaS3FilesProps): void {
        if (props.filesBucket && props.nfsMount) {
            // not needed when using the fileSystem prop on the function
            // props.filesBucket.securityGroup.addIngressRule(props.func.connections.securityGroups[0], Port.tcp(2049), 'NFS');
            // props.func.node.addDependency(props.filesBucket.filesystem);
        }
    }

    getLambdaFileSystem(accessPoint: CfnAccessPoint, nfsMount: NfsMount): FileSystem {
        assert(nfsMount.mountPath.startsWith('/mnt/'), `mountPath must start with /mnt/ but was ${nfsMount.mountPath}`);
        return FileSystem.fromS3FilesAccessPoint(accessPoint, nfsMount.mountPath);
    }
}