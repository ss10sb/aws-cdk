import {Bucket} from "aws-cdk-lib/aws-s3";
import {IRole, Role, ServicePrincipal} from "aws-cdk-lib/aws-iam";
import {CfnFileSystem, CfnMountTarget} from "aws-cdk-lib/aws-s3files";
import {IpAddressType, IVpc, Peer, Port, SecurityGroup} from "aws-cdk-lib/aws-ec2";
import {NonConstruct} from "../core/non-construct";
import {BaseBucket, S3Bucket, S3Props} from "./s3-bucket";
import {CfnResource} from "aws-cdk-lib";
import {NameIncrementer} from "../utils/name-incrementer";

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

    static fileSystemPolicy(s3: FilesBucket, role: IRole): void {
        const fileSystemId = s3.filesystem.getAtt('FileSystemId').toString();
        const fileSystemArn = s3.filesystem.getAtt('FileSystemArn').toString();
        const baseName = s3.name + '-fs-policy';
        const incrementer = new NameIncrementer();
        new CfnResource(s3.filesystem.stack, incrementer.next(baseName), {
            type: 'AWS::S3Files::FileSystemPolicy',
            properties: {
                FileSystemId: fileSystemId,
                Policy: {
                    Version: '2012-10-17',
                    Statement: [
                        {
                            Effect: 'Allow',
                            Principal: {
                                AWS: role.roleArn,
                            },
                            Action: [
                                's3files:ClientMount',
                                's3files:ClientWrite',
                            ],
                            Resource: fileSystemArn,
                        },
                    ],
                },
            },
        })
    }

    protected addSecurityGroup(bucketName: string, vpc: IVpc, fs: CfnFileSystem): SecurityGroup {
        const sg = new SecurityGroup(this.scope, bucketName + '-nfs-sg', {
            vpc: vpc,
            description: 'S3 Files traffic',
            allowAllOutbound: true
        });
        sg.addIngressRule(Peer.ipv4(vpc.vpcCidrBlock), Port.tcp(2049), 'Allow NFS from VPC');
        const fileSystemId = fs.getAtt('FileSystemId').toString();
        vpc.privateSubnets.forEach((subnet, index) => {
            new CfnMountTarget(this.scope, bucketName + '-nfs-mt-' + index, {
                fileSystemId: fileSystemId,
                subnetId: subnet.subnetId,
                securityGroups: [sg.securityGroupId],
                ipAddressType: IpAddressType.IPV4
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