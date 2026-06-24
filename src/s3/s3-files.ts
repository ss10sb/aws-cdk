import {Bucket} from "aws-cdk-lib/aws-s3";
import {Role, ServicePrincipal} from "aws-cdk-lib/aws-iam";
import {CfnFileSystem, CfnMountTarget} from "aws-cdk-lib/aws-s3files";
import {IVpc, Peer, Port, SecurityGroup} from "aws-cdk-lib/aws-ec2";
import {NonConstruct} from "../core/non-construct";
import {BaseBucket, S3Bucket, S3Props} from "./s3-bucket";

export interface S3FilesProps extends S3Props {
    vpc: IVpc;
}

export interface FilesBucket extends BaseBucket {
    filesystem: CfnFileSystem;
    securityGroup: SecurityGroup;
}

export class S3Files extends NonConstruct {

    create(props: S3FilesProps): FilesBucket {
        props.versioned = true;
        const s3 = new S3Bucket(this.scope, this.id);
        const baseBucket = s3.create('s3-files', props);
        const name = baseBucket.name;
        const bucket = baseBucket.bucket;
        const role = this.createFilesRole(name);
        bucket.grantReadWrite(role);
        const fs = this.createFileSystem(name, bucket, role);
        if (!props.vpc) {
            throw Error('VPC is required for S3 Files');
        }
        const sg = this.addSecurityGroup(name, props.vpc, fs);
        return {
            name: name,
            bucket: bucket,
            filesystem: fs,
            securityGroup: sg,
        };
    }

    protected addSecurityGroup(bucketName: string, vpc: IVpc, fs: CfnFileSystem): SecurityGroup {
        const sg = new SecurityGroup(this.scope, bucketName + '-nfs-sg', {
            vpc: vpc,
            description: 'S3 Files traffic',
            allowAllOutbound: true
        });
        sg.addIngressRule(Peer.ipv4(vpc.vpcCidrBlock), Port.tcp(2049), 'Allow NFS from VPC');
        vpc.privateSubnets.forEach((subnet, index) => {
            new CfnMountTarget(this.scope, bucketName + '-nfs-mt-' + index, {
                fileSystemId: fs.ref,
                subnetId: subnet.subnetId,
                securityGroups: [sg.securityGroupId]
            })
        })
        return sg;
    }

    protected createFileSystem(bucketName: string, bucket: Bucket, role: Role): CfnFileSystem {
        return new CfnFileSystem(this.scope, bucketName + '-nfs', {
            bucket: bucket.bucketArn,
            roleArn: role.roleArn
        });
    }

    protected createFilesRole(bucketName: string): Role {
        return new Role(this.scope, bucketName + '-nfs-role', {
            assumedBy: new ServicePrincipal('elasticfilesystem.amazonaws.com')
        });
    }
}