import {Bucket} from "aws-cdk-lib/aws-s3";
import {IRole, PolicyStatement, Role, ServicePrincipal} from "aws-cdk-lib/aws-iam";
import {CfnFileSystem, CfnMountTarget} from "aws-cdk-lib/aws-s3files";
import {IpAddressType, ISecurityGroup, IVpc, Peer, Port, SecurityGroup} from "aws-cdk-lib/aws-ec2";
import {NonConstruct} from "../core/non-construct";
import {BaseBucket, S3Bucket, S3Props} from "./s3-bucket";
import {Aws, CfnResource} from "aws-cdk-lib";
import {NameIncrementer} from "../utils/name-incrementer";
import {Construct} from "constructs";

export interface S3FilesProps extends S3Props {
    vpc: IVpc;
}

export interface FilesBucket extends BaseBucket {
    filesystem: CfnFileSystem;
    securityGroup: SecurityGroup;
}

export class S3Files extends NonConstruct {

    readonly nameIncrementer: NameIncrementer;

    constructor(scope: Construct, id: string) {
        super(scope, id);
        this.nameIncrementer = new NameIncrementer();
    }

    create(props: S3FilesProps): FilesBucket {
        const s3 = new S3Bucket(this.scope, this.id);
        const baseBucket = s3.create('s3-files', props);
        this.id = baseBucket.name;
        const name = baseBucket.name;
        const bucket = baseBucket.bucket;
        const role = this.createFilesRole(bucket);
        bucket.grantReadWrite(role);
        const fs = this.createFileSystem(name, bucket, role);
        if (!props.vpc) {
            throw Error('VPC is required for S3 Files');
        }
        const sg = this.addSecurityGroup(name, props.vpc, fs);
        this.addMountTargets(props.vpc, fs, sg);
        return {
            name: name,
            bucket: bucket,
            filesystem: fs,
            securityGroup: sg,
        };
    }

    fileSystemPolicy(s3: FilesBucket, role: IRole): void {
        this.id = s3.name;
        const fileSystemId = s3.filesystem.getAtt('FileSystemId').toString();
        const fileSystemArn = s3.filesystem.getAtt('FileSystemArn').toString();
        const baseName = this.mixNameWithId('fs-policy');
        new CfnResource(this.scope, this.nameIncrementer.next(baseName), {
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
                                's3files:ClientRootAccess',
                            ],
                            Resource: fileSystemArn,
                        },
                    ],
                },
            },
        })
    }

    protected addSecurityGroup(bucketName: string, vpc: IVpc, fs: CfnFileSystem): SecurityGroup {
        const sg = new SecurityGroup(this.scope, this.mixNameWithId('nfs-sg'), {
            vpc: vpc,
            description: 'S3 Files traffic',
            allowAllOutbound: true
        });
        sg.addIngressRule(Peer.ipv4(vpc.vpcCidrBlock), Port.tcp(2049), 'Allow NFS from VPC');
        return sg;
    }

    protected addMountTargets(vpc: IVpc, fs: CfnFileSystem, sg: ISecurityGroup) {
        const fileSystemId = fs.getAtt('FileSystemId').toString();
        vpc.privateSubnets.forEach((subnet, index) => {
            const name = this.mixNameWithId('nfs-mt-' + index);
            new CfnMountTarget(this.scope, name, {
                fileSystemId: fileSystemId,
                subnetId: subnet.subnetId,
                securityGroups: [sg.securityGroupId],
                ipAddressType: IpAddressType.IPV4
            })
        })
    }

    protected createFileSystem(bucketName: string, bucket: Bucket, role: Role): CfnFileSystem {
        return new CfnFileSystem(this.scope, this.mixNameWithId('nfs'), {
            bucket: bucket.bucketArn,
            roleArn: role.roleArn
        });
    }

    protected createFilesRole(bucket: Bucket): Role {
        const role = new Role(this.scope, this.mixNameWithId('nfs-role'), {
            assumedBy: new ServicePrincipal('elasticfilesystem.amazonaws.com')
        });
        role.addToPolicy(new PolicyStatement({
            actions: ['s3:ListBucket*'],
            resources: [bucket.bucketArn],
        }));
        role.addToPolicy(new PolicyStatement({
            actions: ['s3:AbortMultipartUpload', 's3:DeleteObject', 's3:GetObject*', 's3:List*', 's3:PutObject*'],
            resources: [bucket.arnForObjects('*')],
        }));
        // EventBridge permissions: S3 Files creates rules prefixed "DO-NOT-DELETE-S3-Files"
        // to detect S3 object changes and trigger data synchronization.
        role.addToPolicy(new PolicyStatement({
            actions: [
                'events:DeleteRule', 'events:DisableRule', 'events:EnableRule',
                'events:PutRule', 'events:PutTargets', 'events:RemoveTargets',
            ],
            resources: [`arn:${Aws.PARTITION}:events:*:*:rule/DO-NOT-DELETE-S3-Files*`],
            conditions: {StringEquals: {'events:ManagedBy': 'elasticfilesystem.amazonaws.com'}},
        }));
        role.addToPolicy(new PolicyStatement({
            actions: ['events:DescribeRule', 'events:ListRuleNamesByTarget', 'events:ListRules', 'events:ListTargetsByRule'],
            resources: [`arn:${Aws.PARTITION}:events:*:*:rule/*`],
        }));
        return role;
    }
}