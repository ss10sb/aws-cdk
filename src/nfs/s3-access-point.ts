import {NonConstruct} from "../core/non-construct";
import {NfsMount} from "./nfs-definitions";
import {CfnAccessPoint, CfnFileSystem} from "aws-cdk-lib/aws-s3files";
import {NameIncrementer} from "../utils/name-incrementer";
import {Construct} from "constructs";

export class S3AccessPoint extends NonConstruct {

    readonly nameIncrementer: NameIncrementer;

    constructor(scope: Construct, id: string) {
        super(scope, id);
        this.nameIncrementer = new NameIncrementer();
    }

    create(filesystem: CfnFileSystem, props: NfsMount): CfnAccessPoint {
        const fileSystemId = filesystem.getAtt('FileSystemId').toString();
        return new CfnAccessPoint(filesystem, this.nameIncrementer.next(this.mixNameWithId('ap')), {
            fileSystemId,
            rootDirectory: {
                path: '/',
                creationPermissions: {
                    ownerGid: props.gid ?? '1000',
                    ownerUid: props.uid ?? '1000',
                    permissions: '750'
                }
            },
            posixUser: {
                gid: props.gid ?? '1000',
                uid: props.uid ?? '1000'
            }
        });
    }
}