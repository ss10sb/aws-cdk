import {ConfigEnvironments, StackConfig} from "../../src/config";
import {EcrRepositoryType} from "../../src/ecr";
import {DetailType} from "aws-cdk-lib/aws-codestarnotifications";
import {PipelineNotificationEvents} from "aws-cdk-lib/aws-codepipeline";
import {Protocol} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import {
    ContainerCommand,
    ContainerEntryPoint,
    ContainerType,
    ScalableTypes,
    SchedulableTypes,
    TaskServiceType
} from "../../src/ecs";
import {App} from "aws-cdk-lib";
import {CodePipelineEcsStack} from "../../src/stack";
import {ConfigStackHelper} from "../../src/utils";
import {TemplateHelper} from "../../src/utils/testing";
import {Match, Template} from "aws-cdk-lib/assertions";
import {resetStaticProps} from "../../src/utils/reset-static-props";

describe('code pipeline ecs stack', () => {

    afterEach(() => {
        resetStaticProps();
    });

    it('should create pipeline from config', () => {
        const config = <StackConfig>getConfig();
        const app = new App();
        const name = ConfigStackHelper.getMainStackName(config);
        const stack = new CodePipelineEcsStack(app, name, config, {}, {
            env: {
                account: '12344',
                region: 'us-west-2'
            }
        });
        stack.build();
        expect(app.synth().manifest.missing).toEqual([
            {
                "key": "ssm:account=11111:parameterName=pcc-sdlc-alb01-arn:region=us-west-2",
                "props": {
                    "account": "11111",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::11111:role/cdk-hnb659fds-lookup-role-11111-us-west-2",
                    "parameterName": "pcc-sdlc-alb01-arn",
                    "region": "us-west-2"
                },
                "provider": "ssm"
            },
            {
                "key": "load-balancer-listener:account=11111:listenerPort=443:listenerProtocol=HTTPS:loadBalancerArn=dummy-value-for-pcc-sdlc-alb01-arn:loadBalancerType=application:region=us-west-2",
                "props": {
                    "account": "11111",
                    "listenerPort": 443,
                    "listenerProtocol": "HTTPS",
                    "loadBalancerArn": "dummy-value-for-pcc-sdlc-alb01-arn",
                    "loadBalancerType": "application",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::11111:role/cdk-hnb659fds-lookup-role-11111-us-west-2",
                    "region": "us-west-2"
                },
                "provider": "load-balancer-listener"
            },
            {
                "key": "security-group:account=11111:region=us-west-2:securityGroupId=sg-123456789012",
                "props": {
                    "account": "11111",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::11111:role/cdk-hnb659fds-lookup-role-11111-us-west-2",
                    "region": "us-west-2",
                    "securityGroupId": "sg-123456789012"
                },
                "provider": "security-group"
            },
            {
                "key": "load-balancer:account=11111:loadBalancerArn=dummy-value-for-pcc-sdlc-alb01-arn:loadBalancerType=application:region=us-west-2",
                "props": {
                    "account": "11111",
                    "loadBalancerArn": "dummy-value-for-pcc-sdlc-alb01-arn",
                    "loadBalancerType": "application",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::11111:role/cdk-hnb659fds-lookup-role-11111-us-west-2",
                    "region": "us-west-2"
                },
                "provider": "load-balancer"
            },
            {
                "key": "vpc-provider:account=11111:filter.vpc-id=vpc-12345:region=us-west-2:returnAsymmetricSubnets=true",
                "props": {
                    "account": "11111",
                    "filter": {
                        "vpc-id": "vpc-12345"
                    },
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::11111:role/cdk-hnb659fds-lookup-role-11111-us-west-2",
                    "region": "us-west-2",
                    "returnAsymmetricSubnets": true
                },
                "provider": "vpc-provider"
            },
            {
                "key": "security-group:account=11111:region=us-west-2:securityGroupId=sg-1234",
                "props": {
                    "account": "11111",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::11111:role/cdk-hnb659fds-lookup-role-11111-us-west-2",
                    "region": "us-west-2",
                    "securityGroupId": "sg-1234"
                },
                "provider": "security-group"
            },
            {
                "key": "hosted-zone:account=11111:domainName=sdlc.example.edu:region=us-west-2",
                "props": {
                    "account": "11111",
                    "domainName": "sdlc.example.edu",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::11111:role/cdk-hnb659fds-lookup-role-11111-us-west-2",
                    "region": "us-west-2"
                },
                "provider": "hosted-zone"
            },
            {
                "key": "ssm:account=22222:parameterName=pcc-prod-alb01-arn:region=us-west-2",
                "props": {
                    "account": "22222",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::22222:role/cdk-hnb659fds-lookup-role-22222-us-west-2",
                    "parameterName": "pcc-prod-alb01-arn",
                    "region": "us-west-2"
                },
                "provider": "ssm"
            },
            {
                "key": "load-balancer-listener:account=22222:listenerPort=443:listenerProtocol=HTTPS:loadBalancerArn=dummy-value-for-pcc-prod-alb01-arn:loadBalancerType=application:region=us-west-2",
                "props": {
                    "account": "22222",
                    "listenerPort": 443,
                    "listenerProtocol": "HTTPS",
                    "loadBalancerArn": "dummy-value-for-pcc-prod-alb01-arn",
                    "loadBalancerType": "application",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::22222:role/cdk-hnb659fds-lookup-role-22222-us-west-2",
                    "region": "us-west-2"
                },
                "provider": "load-balancer-listener"
            },
            {
                "key": "security-group:account=22222:region=us-west-2:securityGroupId=sg-123456789012",
                "props": {
                    "account": "22222",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::22222:role/cdk-hnb659fds-lookup-role-22222-us-west-2",
                    "region": "us-west-2",
                    "securityGroupId": "sg-123456789012"
                },
                "provider": "security-group"
            },
            {
                "key": "load-balancer:account=22222:loadBalancerArn=dummy-value-for-pcc-prod-alb01-arn:loadBalancerType=application:region=us-west-2",
                "props": {
                    "account": "22222",
                    "loadBalancerArn": "dummy-value-for-pcc-prod-alb01-arn",
                    "loadBalancerType": "application",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::22222:role/cdk-hnb659fds-lookup-role-22222-us-west-2",
                    "region": "us-west-2"
                },
                "provider": "load-balancer"
            },
            {
                "key": "vpc-provider:account=22222:filter.vpc-id=vpc-12345:region=us-west-2:returnAsymmetricSubnets=true",
                "props": {
                    "account": "22222",
                    "filter": {
                        "vpc-id": "vpc-12345"
                    },
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::22222:role/cdk-hnb659fds-lookup-role-22222-us-west-2",
                    "region": "us-west-2",
                    "returnAsymmetricSubnets": true
                },
                "provider": "vpc-provider"
            },
            {
                "key": "security-group:account=22222:region=us-west-2:securityGroupId=sg-1234",
                "props": {
                    "account": "22222",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::22222:role/cdk-hnb659fds-lookup-role-22222-us-west-2",
                    "region": "us-west-2",
                    "securityGroupId": "sg-1234"
                },
                "provider": "security-group"
            },
            {
                "key": "hosted-zone:account=22222:domainName=example.edu:region=us-west-2",
                "props": {
                    "account": "22222",
                    "domainName": "example.edu",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::22222:role/cdk-hnb659fds-lookup-role-22222-us-west-2",
                    "region": "us-west-2"
                },
                "provider": "hosted-zone"
            }
        ]);
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        const expected = {
            pccsharedappsynthsteprole794F6D03: {
                Type: 'AWS::IAM::Role',
                Properties: {
                    AssumeRolePolicyDocument: {
                        Statement: [
                            {
                                Action: 'sts:AssumeRole',
                                Effect: 'Allow',
                                Principal: { Service: 'codebuild.amazonaws.com' }
                            }
                        ],
                        Version: '2012-10-17'
                    }
                }
            },
            pccsharedappsynthsteproleDefaultPolicy044CC79A: {
                Type: 'AWS::IAM::Policy',
                Properties: {
                    PolicyDocument: {
                        Statement: [
                            {
                                Action: [
                                    'logs:CreateLogGroup',
                                    'logs:CreateLogStream',
                                    'logs:PutLogEvents'
                                ],
                                Effect: 'Allow',
                                Resource: [
                                    {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                { Ref: 'AWS::Partition' },
                                                ':logs:us-west-2:12344:log-group:/aws/codebuild/',
                                                {
                                                    Ref: templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineBuildpccsharedappsynthstepCdkBuildProject')
                                                }
                                            ]
                                        ]
                                    },
                                    {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                { Ref: 'AWS::Partition' },
                                                ':logs:us-west-2:12344:log-group:/aws/codebuild/',
                                                {
                                                    Ref: templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineBuildpccsharedappsynthstepCdkBuildProject')
                                                },
                                                ':*'
                                            ]
                                        ]
                                    }
                                ]
                            },
                            {
                                Action: [
                                    'codebuild:CreateReportGroup',
                                    'codebuild:CreateReport',
                                    'codebuild:UpdateReport',
                                    'codebuild:BatchPutTestCases',
                                    'codebuild:BatchPutCodeCoverages'
                                ],
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            { Ref: 'AWS::Partition' },
                                            ':codebuild:us-west-2:12344:report-group/',
                                            {
                                                Ref: templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineBuildpccsharedappsynthstepCdkBuildProject')
                                            },
                                            '-*'
                                        ]
                                    ]
                                }
                            },
                            {
                                Action: [
                                    's3:GetObject*',
                                    's3:GetBucket*',
                                    's3:List*',
                                    's3:DeleteObject*',
                                    's3:PutObject',
                                    's3:PutObjectLegalHold',
                                    's3:PutObjectRetention',
                                    's3:PutObjectTagging',
                                    's3:PutObjectVersionTagging',
                                    's3:Abort*'
                                ],
                                Effect: 'Allow',
                                Resource: [
                                    {
                                        'Fn::GetAtt': [
                                            templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineArtifactsBucket'),
                                            'Arn'
                                        ]
                                    },
                                    {
                                        'Fn::Join': [
                                            '',
                                            [
                                                {
                                                    'Fn::GetAtt': [
                                                        templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineArtifactsBucket'),
                                                        'Arn'
                                                    ]
                                                },
                                                '/*'
                                            ]
                                        ]
                                    }
                                ]
                            },
                            {
                                Action: [
                                    'kms:Decrypt',
                                    'kms:DescribeKey',
                                    'kms:Encrypt',
                                    'kms:ReEncrypt*',
                                    'kms:GenerateDataKey*'
                                ],
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineArtifactsBucketEncryptionKey'),
                                        'Arn'
                                    ]
                                }
                            },
                            {
                                Action: [
                                    'kms:Decrypt',
                                    'kms:Encrypt',
                                    'kms:ReEncrypt*',
                                    'kms:GenerateDataKey*'
                                ],
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineArtifactsBucketEncryptionKey'),
                                        'Arn'
                                    ]
                                }
                            },
                            {
                                Action: [
                                    'ssm:DescribeParameters',
                                    'ssm:GetParameters',
                                    'ssm:GetParameter',
                                    'ssm:GetParameterHistory'
                                ],
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            { Ref: 'AWS::Partition' },
                                            ':ssm:us-west-2:12344:parameter/pcc-shared-app/config'
                                        ]
                                    ]
                                }
                            },
                            {
                                Action: 'ecr:DescribeImages',
                                Effect: 'Allow',
                                Resource: { 'Fn::GetAtt': [ templateHelper.startsWithMatch('nginxecr'), 'Arn' ] }
                            },
                            {
                                Action: 'ecr:DescribeImages',
                                Effect: 'Allow',
                                Resource: { 'Fn::GetAtt': [ templateHelper.startsWithMatch('phpfpmecr'), 'Arn' ] }
                            },
                            {
                                Action: 'sts:AssumeRole',
                                Condition: {
                                    StringEquals: {
                                        'iam:ResourceTag/aws-cdk:bootstrap-role': 'lookup'
                                    }
                                },
                                Effect: 'Allow',
                                Resource: '*'
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    PolicyName: templateHelper.startsWithMatch('pccsharedappsynthsteproleDefaultPolicy'),
                    Roles: [ { Ref: templateHelper.startsWithMatch('pccsharedappsynthsteprole') } ]
                }
            },
            pccsharedappcodepipelinePipelineArtifactsBucketEncryptionKeyA9814D36: {
                Type: 'AWS::KMS::Key',
                Properties: {
                    KeyPolicy: {
                        Statement: [
                            {
                                Action: 'kms:*',
                                Effect: 'Allow',
                                Principal: {
                                    AWS: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                { Ref: 'AWS::Partition' },
                                                ':iam::12344:root'
                                            ]
                                        ]
                                    }
                                },
                                Resource: '*'
                            },
                            {
                                Action: [ 'kms:Decrypt', 'kms:DescribeKey' ],
                                Effect: 'Allow',
                                Principal: {
                                    AWS: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                { Ref: 'AWS::Partition' },
                                                ':iam::11111:role/cdk-hnb659fds-deploy-role-11111-us-west-2'
                                            ]
                                        ]
                                    }
                                },
                                Resource: '*'
                            },
                            {
                                Action: [ 'kms:Decrypt', 'kms:DescribeKey' ],
                                Effect: 'Allow',
                                Principal: {
                                    AWS: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                { Ref: 'AWS::Partition' },
                                                ':iam::22222:role/cdk-hnb659fds-deploy-role-22222-us-west-2'
                                            ]
                                        ]
                                    }
                                },
                                Resource: '*'
                            }
                        ],
                        Version: '2012-10-17'
                    }
                },
                UpdateReplacePolicy: 'Delete',
                DeletionPolicy: 'Delete'
            },
            pccsharedappcodepipelinePipelineArtifactsBucketEncryptionKeyAliasFD9F38FB: {
                Type: 'AWS::KMS::Alias',
                Properties: {
                    AliasName: templateHelper.startsWithMatch('alias/codepipeline-pccsharedapppccsharedappcodepipelinepipeline'),
                    TargetKeyId: {
                        'Fn::GetAtt': [
                            templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineArtifactsBucketEncryptionKey'),
                            'Arn'
                        ]
                    }
                },
                UpdateReplacePolicy: 'Delete',
                DeletionPolicy: 'Delete'
            },
            pccsharedappcodepipelinePipelineArtifactsBucketE1237014: {
                Type: 'AWS::S3::Bucket',
                Properties: {
                    BucketEncryption: {
                        ServerSideEncryptionConfiguration: [
                            {
                                ServerSideEncryptionByDefault: {
                                    KMSMasterKeyID: {
                                        'Fn::GetAtt': [
                                            templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineArtifactsBucketEncryptionKey'),
                                            'Arn'
                                        ]
                                    },
                                    SSEAlgorithm: 'aws:kms'
                                }
                            }
                        ]
                    },
                    PublicAccessBlockConfiguration: {
                        BlockPublicAcls: true,
                        BlockPublicPolicy: true,
                        IgnorePublicAcls: true,
                        RestrictPublicBuckets: true
                    }
                },
                UpdateReplacePolicy: 'Retain',
                DeletionPolicy: 'Retain'
            },
            pccsharedappcodepipelinePipelineArtifactsBucketPolicyED685AA0: {
                Type: 'AWS::S3::BucketPolicy',
                Properties: {
                    Bucket: {
                        Ref: templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineArtifactsBucket')
                    },
                    PolicyDocument: {
                        Statement: [
                            {
                                Action: 's3:*',
                                Condition: { Bool: { 'aws:SecureTransport': 'false' } },
                                Effect: 'Deny',
                                Principal: { AWS: '*' },
                                Resource: [
                                    {
                                        'Fn::GetAtt': [
                                            templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineArtifactsBucket'),
                                            'Arn'
                                        ]
                                    },
                                    {
                                        'Fn::Join': [
                                            '',
                                            [
                                                {
                                                    'Fn::GetAtt': [
                                                        templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineArtifactsBucket'),
                                                        'Arn'
                                                    ]
                                                },
                                                '/*'
                                            ]
                                        ]
                                    }
                                ]
                            },
                            {
                                Action: [ 's3:GetObject*', 's3:GetBucket*', 's3:List*' ],
                                Effect: 'Allow',
                                Principal: {
                                    AWS: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                { Ref: 'AWS::Partition' },
                                                ':iam::11111:role/cdk-hnb659fds-deploy-role-11111-us-west-2'
                                            ]
                                        ]
                                    }
                                },
                                Resource: [
                                    {
                                        'Fn::GetAtt': [
                                            templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineArtifactsBucket'),
                                            'Arn'
                                        ]
                                    },
                                    {
                                        'Fn::Join': [
                                            '',
                                            [
                                                {
                                                    'Fn::GetAtt': [
                                                        templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineArtifactsBucket'),
                                                        'Arn'
                                                    ]
                                                },
                                                '/*'
                                            ]
                                        ]
                                    }
                                ]
                            },
                            {
                                Action: [ 's3:GetObject*', 's3:GetBucket*', 's3:List*' ],
                                Effect: 'Allow',
                                Principal: {
                                    AWS: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                { Ref: 'AWS::Partition' },
                                                ':iam::22222:role/cdk-hnb659fds-deploy-role-22222-us-west-2'
                                            ]
                                        ]
                                    }
                                },
                                Resource: [
                                    {
                                        'Fn::GetAtt': [
                                            templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineArtifactsBucket'),
                                            'Arn'
                                        ]
                                    },
                                    {
                                        'Fn::Join': [
                                            '',
                                            [
                                                {
                                                    'Fn::GetAtt': [
                                                        templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineArtifactsBucket'),
                                                        'Arn'
                                                    ]
                                                },
                                                '/*'
                                            ]
                                        ]
                                    }
                                ]
                            }
                        ],
                        Version: '2012-10-17'
                    }
                }
            },
            pccsharedappcodepipelinePipelineRoleDC07C781: {
                Type: 'AWS::IAM::Role',
                Properties: {
                    AssumeRolePolicyDocument: {
                        Statement: [
                            {
                                Action: 'sts:AssumeRole',
                                Effect: 'Allow',
                                Principal: { Service: 'codepipeline.amazonaws.com' }
                            }
                        ],
                        Version: '2012-10-17'
                    }
                }
            },
            pccsharedappcodepipelinePipelineRoleDefaultPolicy72D5DE4B: {
                Type: 'AWS::IAM::Policy',
                Properties: {
                    PolicyDocument: {
                        Statement: [
                            {
                                Action: [
                                    's3:GetObject*',
                                    's3:GetBucket*',
                                    's3:List*',
                                    's3:DeleteObject*',
                                    's3:PutObject',
                                    's3:PutObjectLegalHold',
                                    's3:PutObjectRetention',
                                    's3:PutObjectTagging',
                                    's3:PutObjectVersionTagging',
                                    's3:Abort*'
                                ],
                                Effect: 'Allow',
                                Resource: [
                                    {
                                        'Fn::GetAtt': [
                                            templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineArtifactsBucket'),
                                            'Arn'
                                        ]
                                    },
                                    {
                                        'Fn::Join': [
                                            '',
                                            [
                                                {
                                                    'Fn::GetAtt': [
                                                        templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineArtifactsBucket'),
                                                        'Arn'
                                                    ]
                                                },
                                                '/*'
                                            ]
                                        ]
                                    }
                                ]
                            },
                            {
                                Action: [
                                    'kms:Decrypt',
                                    'kms:DescribeKey',
                                    'kms:Encrypt',
                                    'kms:ReEncrypt*',
                                    'kms:GenerateDataKey*'
                                ],
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineArtifactsBucketEncryptionKey'),
                                        'Arn'
                                    ]
                                }
                            },
                            {
                                Action: 'sts:AssumeRole',
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRole'),
                                        'Arn'
                                    ]
                                }
                            },
                            {
                                Action: 'sts:AssumeRole',
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineBuildpccsharedappsynthstepCodePipelineActionRole'),
                                        'Arn'
                                    ]
                                }
                            },
                            {
                                Action: 'sts:AssumeRole',
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineUpdatePipelineSelfMutateCodePipelineActionRole'),
                                        'Arn'
                                    ]
                                }
                            },
                            {
                                Action: 'sts:AssumeRole',
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineAssetsFileAsset1CodePipelineActionRole'),
                                        'Arn'
                                    ]
                                }
                            },
                            {
                                Action: 'sts:AssumeRole',
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineAssetsFileAsset2CodePipelineActionRole'),
                                        'Arn'
                                    ]
                                }
                            },
                            {
                                Action: 'sts:AssumeRole',
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineAssetsFileAsset3CodePipelineActionRole'),
                                        'Arn'
                                    ]
                                }
                            },
                            {
                                Action: 'sts:AssumeRole',
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            { Ref: 'AWS::Partition' },
                                            ':iam::11111:role/cdk-hnb659fds-deploy-role-11111-us-west-2'
                                        ]
                                    ]
                                }
                            },
                            {
                                Action: 'sts:AssumeRole',
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            { Ref: 'AWS::Partition' },
                                            ':iam::22222:role/cdk-hnb659fds-deploy-role-22222-us-west-2'
                                        ]
                                    ]
                                }
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    PolicyName: templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineRoleDefaultPolicy'),
                    Roles: [ { Ref: templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineRole') } ]
                }
            },
            pccsharedappcodepipelinePipelineB0467702: {
                Type: 'AWS::CodePipeline::Pipeline',
                Properties: {
                    RoleArn: {
                        'Fn::GetAtt': [ templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineRole'), 'Arn' ]
                    },
                    Stages: [
                        {
                            Actions: [
                                {
                                    ActionTypeId: {
                                        Category: 'Source',
                                        Owner: 'AWS',
                                        Provider: 'CodeStarSourceConnection',
                                        Version: '1'
                                    },
                                    Configuration: {
                                        ConnectionArn: 'arn:aws:codestar-connections:...:connection/...',
                                        FullRepositoryId: 'repoOwner/repoName',
                                        BranchName: 'main'
                                    },
                                    Name: 'repoOwner_repoName',
                                    OutputArtifacts: [ { Name: 'repoOwner_repoName_Source' } ],
                                    RoleArn: {
                                        'Fn::GetAtt': [
                                            templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRole'),
                                            'Arn'
                                        ]
                                    },
                                    RunOrder: 1
                                }
                            ],
                            Name: 'Source'
                        },
                        {
                            Actions: [
                                {
                                    ActionTypeId: {
                                        Category: 'Build',
                                        Owner: 'AWS',
                                        Provider: 'CodeBuild',
                                        Version: '1'
                                    },
                                    Configuration: {
                                        ProjectName: {
                                            Ref: templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineBuildpccsharedappsynthstepCdkBuildProject')
                                        },
                                        EnvironmentVariables: '[{"name":"_PROJECT_CONFIG_HASH","type":"PLAINTEXT","value":"3b6a035bb04bf76cf2c0f21ec4bf82e37ec46d46f87dd4f6ae4957c2a9e2f549"}]'
                                    },
                                    InputArtifacts: [ { Name: 'repoOwner_repoName_Source' } ],
                                    Name: 'pcc-shared-app-synth-step',
                                    OutputArtifacts: [ { Name: 'pcc_shared_app_synth_step_Output' } ],
                                    RoleArn: {
                                        'Fn::GetAtt': [
                                            templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineBuildpccsharedappsynthstepCodePipelineActionRole'),
                                            'Arn'
                                        ]
                                    },
                                    RunOrder: 1
                                }
                            ],
                            Name: 'Build'
                        },
                        {
                            Actions: [
                                {
                                    ActionTypeId: {
                                        Category: 'Build',
                                        Owner: 'AWS',
                                        Provider: 'CodeBuild',
                                        Version: '1'
                                    },
                                    Configuration: {
                                        ProjectName: {
                                            Ref: templateHelper.startsWithMatch('pccsharedappcodepipelineUpdatePipelineSelfMutation')
                                        },
                                        EnvironmentVariables: '[{"name":"_PROJECT_CONFIG_HASH","type":"PLAINTEXT","value":"7c76f8fd39c1c80e01bf5ad04f7005671121a38dc39f338186162452a9808e9d"}]'
                                    },
                                    InputArtifacts: [ { Name: 'pcc_shared_app_synth_step_Output' } ],
                                    Name: 'SelfMutate',
                                    RoleArn: {
                                        'Fn::GetAtt': [
                                            templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineUpdatePipelineSelfMutateCodePipelineActionRole'),
                                            'Arn'
                                        ]
                                    },
                                    RunOrder: 1
                                }
                            ],
                            Name: 'UpdatePipeline'
                        },
                        {
                            Actions: [
                                {
                                    ActionTypeId: {
                                        Category: 'Build',
                                        Owner: 'AWS',
                                        Provider: 'CodeBuild',
                                        Version: '1'
                                    },
                                    Configuration: {
                                        ProjectName: {
                                            Ref: templateHelper.startsWithMatch('pccsharedappcodepipelineAssetsFileAsset1')
                                        }
                                    },
                                    InputArtifacts: [ { Name: 'pcc_shared_app_synth_step_Output' } ],
                                    Name: 'FileAsset1',
                                    RoleArn: {
                                        'Fn::GetAtt': [
                                            templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineAssetsFileAsset1CodePipelineActionRole'),
                                            'Arn'
                                        ]
                                    },
                                    RunOrder: 1
                                },
                                {
                                    ActionTypeId: {
                                        Category: 'Build',
                                        Owner: 'AWS',
                                        Provider: 'CodeBuild',
                                        Version: '1'
                                    },
                                    Configuration: {
                                        ProjectName: {
                                            Ref: templateHelper.startsWithMatch('pccsharedappcodepipelineAssetsFileAsset2')
                                        }
                                    },
                                    InputArtifacts: [ { Name: 'pcc_shared_app_synth_step_Output' } ],
                                    Name: 'FileAsset2',
                                    RoleArn: {
                                        'Fn::GetAtt': [
                                            templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineAssetsFileAsset2CodePipelineActionRole'),
                                            'Arn'
                                        ]
                                    },
                                    RunOrder: 1
                                },
                                {
                                    ActionTypeId: {
                                        Category: 'Build',
                                        Owner: 'AWS',
                                        Provider: 'CodeBuild',
                                        Version: '1'
                                    },
                                    Configuration: {
                                        ProjectName: {
                                            Ref: templateHelper.startsWithMatch('pccsharedappcodepipelineAssetsFileAsset3')
                                        }
                                    },
                                    InputArtifacts: [ { Name: 'pcc_shared_app_synth_step_Output' } ],
                                    Name: 'FileAsset3',
                                    RoleArn: {
                                        'Fn::GetAtt': [
                                            templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineAssetsFileAsset3CodePipelineActionRole'),
                                            'Arn'
                                        ]
                                    },
                                    RunOrder: 1
                                }
                            ],
                            Name: 'Assets'
                        },
                        {
                            Actions: [
                                {
                                    ActionTypeId: {
                                        Category: 'Deploy',
                                        Owner: 'AWS',
                                        Provider: 'CloudFormation',
                                        Version: '1'
                                    },
                                    Configuration: {
                                        StackName: 'pcc-sdlc-app-stack',
                                        Capabilities: 'CAPABILITY_NAMED_IAM,CAPABILITY_AUTO_EXPAND',
                                        RoleArn: {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    'arn:',
                                                    { Ref: 'AWS::Partition' },
                                                    ':iam::11111:role/cdk-hnb659fds-cfn-exec-role-11111-us-west-2'
                                                ]
                                            ]
                                        },
                                        TemplateConfiguration: 'pcc_shared_app_synth_step_Output::assembly-pcc-shared-app-pcc-sdlc-app/pccsharedapppccsdlcappstackA81C237C.template.json.config.json',
                                        ActionMode: 'CHANGE_SET_REPLACE',
                                        ChangeSetName: 'PipelineChange',
                                        TemplatePath: 'pcc_shared_app_synth_step_Output::assembly-pcc-shared-app-pcc-sdlc-app/pccsharedapppccsdlcappstackA81C237C.template.json'
                                    },
                                    InputArtifacts: [ { Name: 'pcc_shared_app_synth_step_Output' } ],
                                    Name: 'Prepare',
                                    RoleArn: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                { Ref: 'AWS::Partition' },
                                                ':iam::11111:role/cdk-hnb659fds-deploy-role-11111-us-west-2'
                                            ]
                                        ]
                                    },
                                    RunOrder: 1
                                },
                                {
                                    ActionTypeId: {
                                        Category: 'Deploy',
                                        Owner: 'AWS',
                                        Provider: 'CloudFormation',
                                        Version: '1'
                                    },
                                    Configuration: {
                                        StackName: 'pcc-sdlc-app-stack',
                                        ActionMode: 'CHANGE_SET_EXECUTE',
                                        ChangeSetName: 'PipelineChange'
                                    },
                                    Name: 'Deploy',
                                    RoleArn: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                { Ref: 'AWS::Partition' },
                                                ':iam::11111:role/cdk-hnb659fds-deploy-role-11111-us-west-2'
                                            ]
                                        ]
                                    },
                                    RunOrder: 2
                                }
                            ],
                            Name: 'pcc-sdlc-app'
                        },
                        {
                            Actions: [
                                {
                                    ActionTypeId: {
                                        Category: 'Deploy',
                                        Owner: 'AWS',
                                        Provider: 'CloudFormation',
                                        Version: '1'
                                    },
                                    Configuration: {
                                        StackName: 'pcc-prod-app-stack',
                                        Capabilities: 'CAPABILITY_NAMED_IAM,CAPABILITY_AUTO_EXPAND',
                                        RoleArn: {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    'arn:',
                                                    { Ref: 'AWS::Partition' },
                                                    ':iam::22222:role/cdk-hnb659fds-cfn-exec-role-22222-us-west-2'
                                                ]
                                            ]
                                        },
                                        TemplateConfiguration: 'pcc_shared_app_synth_step_Output::assembly-pcc-shared-app-pcc-prod-app/pccsharedapppccprodappstack84FBA10E.template.json.config.json',
                                        ActionMode: 'CHANGE_SET_REPLACE',
                                        ChangeSetName: 'PipelineChange',
                                        TemplatePath: 'pcc_shared_app_synth_step_Output::assembly-pcc-shared-app-pcc-prod-app/pccsharedapppccprodappstack84FBA10E.template.json'
                                    },
                                    InputArtifacts: [ { Name: 'pcc_shared_app_synth_step_Output' } ],
                                    Name: 'Prepare',
                                    RoleArn: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                { Ref: 'AWS::Partition' },
                                                ':iam::22222:role/cdk-hnb659fds-deploy-role-22222-us-west-2'
                                            ]
                                        ]
                                    },
                                    RunOrder: 1
                                },
                                {
                                    ActionTypeId: {
                                        Category: 'Deploy',
                                        Owner: 'AWS',
                                        Provider: 'CloudFormation',
                                        Version: '1'
                                    },
                                    Configuration: {
                                        StackName: 'pcc-prod-app-stack',
                                        ActionMode: 'CHANGE_SET_EXECUTE',
                                        ChangeSetName: 'PipelineChange'
                                    },
                                    Name: 'Deploy',
                                    RoleArn: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                { Ref: 'AWS::Partition' },
                                                ':iam::22222:role/cdk-hnb659fds-deploy-role-22222-us-west-2'
                                            ]
                                        ]
                                    },
                                    RunOrder: 2
                                }
                            ],
                            Name: 'pcc-prod-app'
                        }
                    ],
                    ArtifactStore: {
                        EncryptionKey: {
                            Id: {
                                'Fn::GetAtt': [
                                    templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineArtifactsBucketEncryptionKey'),
                                    'Arn'
                                ]
                            },
                            Type: 'KMS'
                        },
                        Location: {
                            Ref: templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineArtifactsBucket')
                        },
                        Type: 'S3'
                    },
                    Name: 'pcc-shared-app-code-pipeline',
                    RestartExecutionOnUpdate: true
                },
                DependsOn: [
                    templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineRoleDefaultPolicy'),
                    templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineRole')
                ]
            },
            pccsharedappcodepipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRoleCB06F77D: {
                Type: 'AWS::IAM::Role',
                Properties: {
                    AssumeRolePolicyDocument: {
                        Statement: [
                            {
                                Action: 'sts:AssumeRole',
                                Effect: 'Allow',
                                Principal: {
                                    AWS: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                { Ref: 'AWS::Partition' },
                                                ':iam::12344:root'
                                            ]
                                        ]
                                    }
                                }
                            }
                        ],
                        Version: '2012-10-17'
                    }
                }
            },
            pccsharedappcodepipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRoleDefaultPolicy310FD160: {
                Type: 'AWS::IAM::Policy',
                Properties: {
                    PolicyDocument: {
                        Statement: [
                            {
                                Action: 'codestar-connections:UseConnection',
                                Effect: 'Allow',
                                Resource: 'arn:aws:codestar-connections:...:connection/...'
                            },
                            {
                                Action: [
                                    's3:GetObject*',
                                    's3:GetBucket*',
                                    's3:List*',
                                    's3:DeleteObject*',
                                    's3:PutObject',
                                    's3:PutObjectLegalHold',
                                    's3:PutObjectRetention',
                                    's3:PutObjectTagging',
                                    's3:PutObjectVersionTagging',
                                    's3:Abort*'
                                ],
                                Effect: 'Allow',
                                Resource: [
                                    {
                                        'Fn::GetAtt': [
                                            templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineArtifactsBucket'),
                                            'Arn'
                                        ]
                                    },
                                    {
                                        'Fn::Join': [
                                            '',
                                            [
                                                {
                                                    'Fn::GetAtt': [
                                                        templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineArtifactsBucket'),
                                                        'Arn'
                                                    ]
                                                },
                                                '/*'
                                            ]
                                        ]
                                    }
                                ]
                            },
                            {
                                Action: [
                                    'kms:Decrypt',
                                    'kms:DescribeKey',
                                    'kms:Encrypt',
                                    'kms:ReEncrypt*',
                                    'kms:GenerateDataKey*'
                                ],
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineArtifactsBucketEncryptionKey'),
                                        'Arn'
                                    ]
                                }
                            },
                            {
                                Action: [ 's3:PutObjectAcl', 's3:PutObjectVersionAcl' ],
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [
                                                    templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineArtifactsBucket'),
                                                    'Arn'
                                                ]
                                            },
                                            '/*'
                                        ]
                                    ]
                                }
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    PolicyName: templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRoleDefaultPolicy'),
                    Roles: [
                        {
                            Ref: templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRole')
                        }
                    ]
                }
            },
            pccsharedappcodepipelinePipelineBuildpccsharedappsynthstepCdkBuildProject0D2470D6: {
                Type: 'AWS::CodeBuild::Project',
                Properties: {
                    Artifacts: { Type: 'CODEPIPELINE' },
                    Environment: {
                        ComputeType: 'BUILD_GENERAL1_SMALL',
                        Image: 'aws/codebuild/standard:5.0',
                        ImagePullCredentialsType: 'CODEBUILD',
                        PrivilegedMode: false,
                        Type: 'LINUX_CONTAINER'
                    },
                    ServiceRole: {
                        'Fn::GetAtt': [ templateHelper.startsWithMatch('pccsharedappsynthsteprole'), 'Arn' ]
                    },
                    Source: {
                        BuildSpec: '{\n' +
                            '  "version": "0.2",\n' +
                            '  "phases": {\n' +
                            '    "build": {\n' +
                            '      "commands": [\n' +
                            '        "cp config/_common.js.copy config/_common.js && cp config/defaults.js.copy config/defaults.js",\n' +
                            '        "npm ci",\n' +
                            '        "npm run build",\n' +
                            '        "npx cdk synth"\n' +
                            '      ]\n' +
                            '    }\n' +
                            '  },\n' +
                            '  "artifacts": {\n' +
                            '    "base-directory": "cdk.out",\n' +
                            '    "files": "**/*"\n' +
                            '  }\n' +
                            '}',
                        Type: 'CODEPIPELINE'
                    },
                    Cache: { Type: 'NO_CACHE' },
                    Description: 'Pipeline step pcc-shared-app/Pipeline/Build/pcc-shared-app-synth-step',
                    EncryptionKey: {
                        'Fn::GetAtt': [
                            templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineArtifactsBucketEncryptionKey'),
                            'Arn'
                        ]
                    }
                }
            },
            pccsharedappcodepipelinePipelineBuildpccsharedappsynthstepCodePipelineActionRoleF4AE514F: {
                Type: 'AWS::IAM::Role',
                Properties: {
                    AssumeRolePolicyDocument: {
                        Statement: [
                            {
                                Action: 'sts:AssumeRole',
                                Effect: 'Allow',
                                Principal: {
                                    AWS: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                { Ref: 'AWS::Partition' },
                                                ':iam::12344:root'
                                            ]
                                        ]
                                    }
                                }
                            }
                        ],
                        Version: '2012-10-17'
                    }
                }
            },
            pccsharedappcodepipelinePipelineBuildpccsharedappsynthstepCodePipelineActionRoleDefaultPolicy1EE5440B: {
                Type: 'AWS::IAM::Policy',
                Properties: {
                    PolicyDocument: {
                        Statement: [
                            {
                                Action: [
                                    'codebuild:BatchGetBuilds',
                                    'codebuild:StartBuild',
                                    'codebuild:StopBuild'
                                ],
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineBuildpccsharedappsynthstepCdkBuildProject'),
                                        'Arn'
                                    ]
                                }
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    PolicyName: templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineBuildpccsharedappsynthstepCodePipelineActionRoleDefaultPolicy'),
                    Roles: [
                        {
                            Ref: templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineBuildpccsharedappsynthstepCodePipelineActionRole')
                        }
                    ]
                }
            },
            pccsharedappcodepipelinePipelineUpdatePipelineSelfMutateCodePipelineActionRole70028644: {
                Type: 'AWS::IAM::Role',
                Properties: {
                    AssumeRolePolicyDocument: {
                        Statement: [
                            {
                                Action: 'sts:AssumeRole',
                                Effect: 'Allow',
                                Principal: {
                                    AWS: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                { Ref: 'AWS::Partition' },
                                                ':iam::12344:root'
                                            ]
                                        ]
                                    }
                                }
                            }
                        ],
                        Version: '2012-10-17'
                    }
                }
            },
            pccsharedappcodepipelinePipelineUpdatePipelineSelfMutateCodePipelineActionRoleDefaultPolicy533CCAD7: {
                Type: 'AWS::IAM::Policy',
                Properties: {
                    PolicyDocument: {
                        Statement: [
                            {
                                Action: [
                                    'codebuild:BatchGetBuilds',
                                    'codebuild:StartBuild',
                                    'codebuild:StopBuild'
                                ],
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('pccsharedappcodepipelineUpdatePipelineSelfMutation'),
                                        'Arn'
                                    ]
                                }
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    PolicyName: templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineUpdatePipelineSelfMutateCodePipelineActionRoleDefaultPolicy'),
                    Roles: [
                        {
                            Ref: templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineUpdatePipelineSelfMutateCodePipelineActionRole')
                        }
                    ]
                }
            },
            pccsharedappcodepipelinePipelineAssetsFileAsset1CodePipelineActionRoleE6AE2499: {
                Type: 'AWS::IAM::Role',
                Properties: {
                    AssumeRolePolicyDocument: {
                        Statement: [
                            {
                                Action: 'sts:AssumeRole',
                                Effect: 'Allow',
                                Principal: {
                                    AWS: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                { Ref: 'AWS::Partition' },
                                                ':iam::12344:root'
                                            ]
                                        ]
                                    }
                                }
                            }
                        ],
                        Version: '2012-10-17'
                    }
                }
            },
            pccsharedappcodepipelinePipelineAssetsFileAsset1CodePipelineActionRoleDefaultPolicy3543016B: {
                Type: 'AWS::IAM::Policy',
                Properties: {
                    PolicyDocument: {
                        Statement: [
                            {
                                Action: [
                                    'codebuild:BatchGetBuilds',
                                    'codebuild:StartBuild',
                                    'codebuild:StopBuild'
                                ],
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('pccsharedappcodepipelineAssetsFileAsset1'),
                                        'Arn'
                                    ]
                                }
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    PolicyName: templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineAssetsFileAsset1CodePipelineActionRoleDefaultPolicy'),
                    Roles: [
                        {
                            Ref: templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineAssetsFileAsset1CodePipelineActionRole')
                        }
                    ]
                }
            },
            pccsharedappcodepipelinePipelineAssetsFileAsset2CodePipelineActionRoleEA47BC15: {
                Type: 'AWS::IAM::Role',
                Properties: {
                    AssumeRolePolicyDocument: {
                        Statement: [
                            {
                                Action: 'sts:AssumeRole',
                                Effect: 'Allow',
                                Principal: {
                                    AWS: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                { Ref: 'AWS::Partition' },
                                                ':iam::12344:root'
                                            ]
                                        ]
                                    }
                                }
                            }
                        ],
                        Version: '2012-10-17'
                    }
                }
            },
            pccsharedappcodepipelinePipelineAssetsFileAsset2CodePipelineActionRoleDefaultPolicyFBFBE192: {
                Type: 'AWS::IAM::Policy',
                Properties: {
                    PolicyDocument: {
                        Statement: [
                            {
                                Action: [
                                    'codebuild:BatchGetBuilds',
                                    'codebuild:StartBuild',
                                    'codebuild:StopBuild'
                                ],
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('pccsharedappcodepipelineAssetsFileAsset2'),
                                        'Arn'
                                    ]
                                }
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    PolicyName: templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineAssetsFileAsset2CodePipelineActionRoleDefaultPolicy'),
                    Roles: [
                        {
                            Ref: templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineAssetsFileAsset2CodePipelineActionRole')
                        }
                    ]
                }
            },
            pccsharedappcodepipelinePipelineAssetsFileAsset3CodePipelineActionRoleEAF67163: {
                Type: 'AWS::IAM::Role',
                Properties: {
                    AssumeRolePolicyDocument: {
                        Statement: [
                            {
                                Action: 'sts:AssumeRole',
                                Effect: 'Allow',
                                Principal: {
                                    AWS: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                { Ref: 'AWS::Partition' },
                                                ':iam::12344:root'
                                            ]
                                        ]
                                    }
                                }
                            }
                        ],
                        Version: '2012-10-17'
                    }
                }
            },
            pccsharedappcodepipelinePipelineAssetsFileAsset3CodePipelineActionRoleDefaultPolicy16A6A459: {
                Type: 'AWS::IAM::Policy',
                Properties: {
                    PolicyDocument: {
                        Statement: [
                            {
                                Action: [
                                    'codebuild:BatchGetBuilds',
                                    'codebuild:StartBuild',
                                    'codebuild:StopBuild'
                                ],
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('pccsharedappcodepipelineAssetsFileAsset3'),
                                        'Arn'
                                    ]
                                }
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    PolicyName: templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineAssetsFileAsset3CodePipelineActionRoleDefaultPolicy'),
                    Roles: [
                        {
                            Ref: templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineAssetsFileAsset3CodePipelineActionRole')
                        }
                    ]
                }
            },
            pccsharedappcodepipelineUpdatePipelineSelfMutationRoleF76D59FA: {
                Type: 'AWS::IAM::Role',
                Properties: {
                    AssumeRolePolicyDocument: {
                        Statement: [
                            {
                                Action: 'sts:AssumeRole',
                                Effect: 'Allow',
                                Principal: { Service: 'codebuild.amazonaws.com' }
                            }
                        ],
                        Version: '2012-10-17'
                    }
                }
            },
            pccsharedappcodepipelineUpdatePipelineSelfMutationRoleDefaultPolicyCD284E5E: {
                Type: 'AWS::IAM::Policy',
                Properties: {
                    PolicyDocument: {
                        Statement: [
                            {
                                Action: [
                                    'logs:CreateLogGroup',
                                    'logs:CreateLogStream',
                                    'logs:PutLogEvents'
                                ],
                                Effect: 'Allow',
                                Resource: [
                                    {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                { Ref: 'AWS::Partition' },
                                                ':logs:us-west-2:12344:log-group:/aws/codebuild/',
                                                {
                                                    Ref: templateHelper.startsWithMatch('pccsharedappcodepipelineUpdatePipelineSelfMutation')
                                                }
                                            ]
                                        ]
                                    },
                                    {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                { Ref: 'AWS::Partition' },
                                                ':logs:us-west-2:12344:log-group:/aws/codebuild/',
                                                {
                                                    Ref: templateHelper.startsWithMatch('pccsharedappcodepipelineUpdatePipelineSelfMutation')
                                                },
                                                ':*'
                                            ]
                                        ]
                                    }
                                ]
                            },
                            {
                                Action: [
                                    'codebuild:CreateReportGroup',
                                    'codebuild:CreateReport',
                                    'codebuild:UpdateReport',
                                    'codebuild:BatchPutTestCases',
                                    'codebuild:BatchPutCodeCoverages'
                                ],
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            { Ref: 'AWS::Partition' },
                                            ':codebuild:us-west-2:12344:report-group/',
                                            {
                                                Ref: templateHelper.startsWithMatch('pccsharedappcodepipelineUpdatePipelineSelfMutation')
                                            },
                                            '-*'
                                        ]
                                    ]
                                }
                            },
                            {
                                Action: 'sts:AssumeRole',
                                Condition: {
                                    'ForAnyValue:StringEquals': {
                                        'iam:ResourceTag/aws-cdk:bootstrap-role': [ 'image-publishing', 'file-publishing', 'deploy' ]
                                    }
                                },
                                Effect: 'Allow',
                                Resource: 'arn:*:iam::12344:role/*'
                            },
                            {
                                Action: 'cloudformation:DescribeStacks',
                                Effect: 'Allow',
                                Resource: '*'
                            },
                            {
                                Action: 's3:ListBucket',
                                Effect: 'Allow',
                                Resource: '*'
                            },
                            {
                                Action: [ 's3:GetObject*', 's3:GetBucket*', 's3:List*' ],
                                Effect: 'Allow',
                                Resource: [
                                    {
                                        'Fn::GetAtt': [
                                            templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineArtifactsBucket'),
                                            'Arn'
                                        ]
                                    },
                                    {
                                        'Fn::Join': [
                                            '',
                                            [
                                                {
                                                    'Fn::GetAtt': [
                                                        templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineArtifactsBucket'),
                                                        'Arn'
                                                    ]
                                                },
                                                '/*'
                                            ]
                                        ]
                                    }
                                ]
                            },
                            {
                                Action: [ 'kms:Decrypt', 'kms:DescribeKey' ],
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineArtifactsBucketEncryptionKey'),
                                        'Arn'
                                    ]
                                }
                            },
                            {
                                Action: [
                                    'kms:Decrypt',
                                    'kms:Encrypt',
                                    'kms:ReEncrypt*',
                                    'kms:GenerateDataKey*'
                                ],
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineArtifactsBucketEncryptionKey'),
                                        'Arn'
                                    ]
                                }
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    PolicyName: templateHelper.startsWithMatch('pccsharedappcodepipelineUpdatePipelineSelfMutationRoleDefaultPolicy'),
                    Roles: [
                        {
                            Ref: templateHelper.startsWithMatch('pccsharedappcodepipelineUpdatePipelineSelfMutationRole')
                        }
                    ]
                }
            },
            pccsharedappcodepipelineUpdatePipelineSelfMutationBF165C07: {
                Type: 'AWS::CodeBuild::Project',
                Properties: {
                    Artifacts: { Type: 'CODEPIPELINE' },
                    Environment: {
                        ComputeType: 'BUILD_GENERAL1_SMALL',
                        Image: 'aws/codebuild/standard:5.0',
                        ImagePullCredentialsType: 'CODEBUILD',
                        PrivilegedMode: false,
                        Type: 'LINUX_CONTAINER'
                    },
                    ServiceRole: {
                        'Fn::GetAtt': [
                            templateHelper.startsWithMatch('pccsharedappcodepipelineUpdatePipelineSelfMutationRole'),
                            'Arn'
                        ]
                    },
                    Source: {
                        BuildSpec: '{\n' +
                            '  "version": "0.2",\n' +
                            '  "phases": {\n' +
                            '    "install": {\n' +
                            '      "commands": [\n' +
                            '        "npm install -g aws-cdk@2"\n' +
                            '      ]\n' +
                            '    },\n' +
                            '    "build": {\n' +
                            '      "commands": [\n' +
                            '        "cdk -a . deploy pcc-shared-app --require-approval=never --verbose"\n' +
                            '      ]\n' +
                            '    }\n' +
                            '  }\n' +
                            '}',
                        Type: 'CODEPIPELINE'
                    },
                    Cache: { Type: 'NO_CACHE' },
                    Description: 'Pipeline step pcc-shared-app/Pipeline/UpdatePipeline/SelfMutate',
                    EncryptionKey: {
                        'Fn::GetAtt': [
                            templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineArtifactsBucketEncryptionKey'),
                            'Arn'
                        ]
                    },
                    Name: 'pcc-shared-app-code-pipeline-selfupdate'
                }
            },
            pccsharedappcodepipelineAssetsFileRoleBBAFC6B6: {
                Type: 'AWS::IAM::Role',
                Properties: {
                    AssumeRolePolicyDocument: {
                        Statement: [
                            {
                                Action: 'sts:AssumeRole',
                                Effect: 'Allow',
                                Principal: { Service: 'codebuild.amazonaws.com' }
                            },
                            {
                                Action: 'sts:AssumeRole',
                                Effect: 'Allow',
                                Principal: {
                                    AWS: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                { Ref: 'AWS::Partition' },
                                                ':iam::12344:root'
                                            ]
                                        ]
                                    }
                                }
                            }
                        ],
                        Version: '2012-10-17'
                    }
                }
            },
            pccsharedappcodepipelineAssetsFileRoleDefaultPolicy2956D9CB: {
                Type: 'AWS::IAM::Policy',
                Properties: {
                    PolicyDocument: {
                        Statement: [
                            {
                                Action: [
                                    'logs:CreateLogGroup',
                                    'logs:CreateLogStream',
                                    'logs:PutLogEvents'
                                ],
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            { Ref: 'AWS::Partition' },
                                            ':logs:us-west-2:12344:log-group:/aws/codebuild/*'
                                        ]
                                    ]
                                }
                            },
                            {
                                Action: [
                                    'codebuild:CreateReportGroup',
                                    'codebuild:CreateReport',
                                    'codebuild:UpdateReport',
                                    'codebuild:BatchPutTestCases',
                                    'codebuild:BatchPutCodeCoverages'
                                ],
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            { Ref: 'AWS::Partition' },
                                            ':codebuild:us-west-2:12344:report-group/*'
                                        ]
                                    ]
                                }
                            },
                            {
                                Action: [
                                    'codebuild:BatchGetBuilds',
                                    'codebuild:StartBuild',
                                    'codebuild:StopBuild'
                                ],
                                Effect: 'Allow',
                                Resource: '*'
                            },
                            {
                                Action: 'sts:AssumeRole',
                                Effect: 'Allow',
                                Resource: [
                                    {
                                        'Fn::Sub': 'arn:${AWS::Partition}:iam::11111:role/cdk-hnb659fds-file-publishing-role-11111-us-west-2'
                                    },
                                    {
                                        'Fn::Sub': 'arn:${AWS::Partition}:iam::22222:role/cdk-hnb659fds-file-publishing-role-22222-us-west-2'
                                    }
                                ]
                            },
                            {
                                Action: [ 's3:GetObject*', 's3:GetBucket*', 's3:List*' ],
                                Effect: 'Allow',
                                Resource: [
                                    {
                                        'Fn::GetAtt': [
                                            templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineArtifactsBucket'),
                                            'Arn'
                                        ]
                                    },
                                    {
                                        'Fn::Join': [
                                            '',
                                            [
                                                {
                                                    'Fn::GetAtt': [
                                                        templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineArtifactsBucket'),
                                                        'Arn'
                                                    ]
                                                },
                                                '/*'
                                            ]
                                        ]
                                    }
                                ]
                            },
                            {
                                Action: [ 'kms:Decrypt', 'kms:DescribeKey' ],
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineArtifactsBucketEncryptionKey'),
                                        'Arn'
                                    ]
                                }
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    PolicyName: templateHelper.startsWithMatch('pccsharedappcodepipelineAssetsFileRoleDefaultPolicy'),
                    Roles: [ { Ref: templateHelper.startsWithMatch('pccsharedappcodepipelineAssetsFileRole') } ]
                }
            },
            pccsharedappcodepipelineAssetsFileAsset11086D95A: {
                Type: 'AWS::CodeBuild::Project',
                Properties: {
                    Artifacts: { Type: 'CODEPIPELINE' },
                    Environment: {
                        ComputeType: 'BUILD_GENERAL1_SMALL',
                        Image: 'aws/codebuild/standard:5.0',
                        ImagePullCredentialsType: 'CODEBUILD',
                        PrivilegedMode: false,
                        Type: 'LINUX_CONTAINER'
                    },
                    ServiceRole: {
                        'Fn::GetAtt': [ templateHelper.startsWithMatch('pccsharedappcodepipelineAssetsFileRole'), 'Arn' ]
                    },
                    Source: {
                        BuildSpec: Match.stringLikeRegexp('^[\\s\\S]*assembly-pcc-shared-app-pcc-sdlc-app/pccsharedapppccsdlcappstack[\\s\\S]*assembly-pcc-shared-app-pcc-prod-app/pccsharedapppccprodappstack[\\s\\S]*'),
                        Type: 'CODEPIPELINE'
                    },
                    Cache: { Type: 'NO_CACHE' },
                    Description: 'Pipeline step pcc-shared-app/Pipeline/Assets/FileAsset1',
                    EncryptionKey: {
                        'Fn::GetAtt': [
                            templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineArtifactsBucketEncryptionKey'),
                            'Arn'
                        ]
                    }
                }
            },
            pccsharedappcodepipelineAssetsFileAsset242B664F7: {
                Type: 'AWS::CodeBuild::Project',
                Properties: {
                    Artifacts: { Type: 'CODEPIPELINE' },
                    Environment: {
                        ComputeType: 'BUILD_GENERAL1_SMALL',
                        Image: 'aws/codebuild/standard:5.0',
                        ImagePullCredentialsType: 'CODEBUILD',
                        PrivilegedMode: false,
                        Type: 'LINUX_CONTAINER'
                    },
                    ServiceRole: {
                        'Fn::GetAtt': [ templateHelper.startsWithMatch('pccsharedappcodepipelineAssetsFileRole'), 'Arn' ]
                    },
                    Source: {
                        BuildSpec: Match.stringLikeRegexp('^[\\s\\S]*assembly-pcc-shared-app-pcc-sdlc-app/pccsharedapppccsdlcappstack[\\s\\S]*'),
                        Type: 'CODEPIPELINE'
                    },
                    Cache: { Type: 'NO_CACHE' },
                    Description: 'Pipeline step pcc-shared-app/Pipeline/Assets/FileAsset2',
                    EncryptionKey: {
                        'Fn::GetAtt': [
                            templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineArtifactsBucketEncryptionKey'),
                            'Arn'
                        ]
                    }
                }
            },
            pccsharedappcodepipelineAssetsFileAsset30A9B0A79: {
                Type: 'AWS::CodeBuild::Project',
                Properties: {
                    Artifacts: { Type: 'CODEPIPELINE' },
                    Environment: {
                        ComputeType: 'BUILD_GENERAL1_SMALL',
                        Image: 'aws/codebuild/standard:5.0',
                        ImagePullCredentialsType: 'CODEBUILD',
                        PrivilegedMode: false,
                        Type: 'LINUX_CONTAINER'
                    },
                    ServiceRole: {
                        'Fn::GetAtt': [ templateHelper.startsWithMatch('pccsharedappcodepipelineAssetsFileRole'), 'Arn' ]
                    },
                    Source: {
                        BuildSpec: Match.stringLikeRegexp('^[\\s\\S]*assembly-pcc-shared-app-pcc-sdlc-app/pccsharedapppccsdlcappstack[\\s\\S]*'),
                        Type: 'CODEPIPELINE'
                    },
                    Cache: { Type: 'NO_CACHE' },
                    Description: 'Pipeline step pcc-shared-app/Pipeline/Assets/FileAsset3',
                    EncryptionKey: {
                        'Fn::GetAtt': [
                            templateHelper.startsWithMatch('pccsharedappcodepipelinePipelineArtifactsBucketEncryptionKey'),
                            'Arn'
                        ]
                    }
                }
            },
            pccsharedappecrsteprole2E40018C: {
                Type: 'AWS::IAM::Role',
                Properties: {
                    AssumeRolePolicyDocument: {
                        Statement: [
                            {
                                Action: 'sts:AssumeRole',
                                Effect: 'Allow',
                                Principal: { Service: 'codebuild.amazonaws.com' }
                            }
                        ],
                        Version: '2012-10-17'
                    }
                }
            },
            pccsharedappecrsteproleDefaultPolicy88A8742A: {
                Type: 'AWS::IAM::Policy',
                Properties: {
                    PolicyDocument: {
                        Statement: [
                            {
                                Action: [
                                    'ecr:BatchCheckLayerAvailability',
                                    'ecr:GetDownloadUrlForLayer',
                                    'ecr:BatchGetImage'
                                ],
                                Effect: 'Allow',
                                Resource: { 'Fn::GetAtt': [ templateHelper.startsWithMatch('nginxecr'), 'Arn' ] }
                            },
                            {
                                Action: 'ecr:GetAuthorizationToken',
                                Effect: 'Allow',
                                Resource: '*'
                            },
                            {
                                Action: [
                                    'ecr:PutImage',
                                    'ecr:InitiateLayerUpload',
                                    'ecr:UploadLayerPart',
                                    'ecr:CompleteLayerUpload'
                                ],
                                Effect: 'Allow',
                                Resource: { 'Fn::GetAtt': [ templateHelper.startsWithMatch('nginxecr'), 'Arn' ] }
                            },
                            {
                                Action: [
                                    'ecr:BatchCheckLayerAvailability',
                                    'ecr:GetDownloadUrlForLayer',
                                    'ecr:BatchGetImage'
                                ],
                                Effect: 'Allow',
                                Resource: { 'Fn::GetAtt': [ templateHelper.startsWithMatch('phpfpmecr'), 'Arn' ] }
                            },
                            {
                                Action: [
                                    'ecr:PutImage',
                                    'ecr:InitiateLayerUpload',
                                    'ecr:UploadLayerPart',
                                    'ecr:CompleteLayerUpload'
                                ],
                                Effect: 'Allow',
                                Resource: { 'Fn::GetAtt': [ templateHelper.startsWithMatch('phpfpmecr'), 'Arn' ] }
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    PolicyName: templateHelper.startsWithMatch('pccsharedappecrsteproleDefaultPolicy'),
                    Roles: [ { Ref: templateHelper.startsWithMatch('pccsharedappecrsteprole') } ]
                }
            },
            nginxecrC430EE7B: {
                Type: 'AWS::ECR::Repository',
                Properties: {
                    ImageScanningConfiguration: { ScanOnPush: true },
                    LifecyclePolicy: {
                        LifecyclePolicyText: '{"rules":[{"rulePriority":1,"selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":3},"action":{"type":"expire"}}]}'
                    },
                    RepositoryName: 'pcc-app/nginx',
                    RepositoryPolicyText: {
                        Statement: [
                            {
                                Action: [
                                    'ecr:BatchCheckLayerAvailability',
                                    'ecr:GetDownloadUrlForLayer',
                                    'ecr:BatchGetImage'
                                ],
                                Effect: 'Allow',
                                Principal: {
                                    AWS: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                { Ref: 'AWS::Partition' },
                                                templateHelper.startsWithMatch(':iam::11111:role/pcc-sdlc-app-stackkdefweb0execrole')
                                            ]
                                        ]
                                    }
                                }
                            },
                            {
                                Action: [
                                    'ecr:BatchCheckLayerAvailability',
                                    'ecr:GetDownloadUrlForLayer',
                                    'ecr:BatchGetImage'
                                ],
                                Effect: 'Allow',
                                Principal: {
                                    AWS: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                { Ref: 'AWS::Partition' },
                                                templateHelper.startsWithMatch(':iam::22222:role/pcc-prod-app-stackkdefweb0execrole')
                                            ]
                                        ]
                                    }
                                }
                            },
                            {
                                Action: 'ecr:DescribeImages',
                                Effect: 'Allow',
                                Principal: {
                                    AWS: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                { Ref: 'AWS::Partition' },
                                                ':iam::12344:root'
                                            ]
                                        ]
                                    }
                                }
                            },
                            {
                                Action: [
                                    'ecr:BatchCheckLayerAvailability',
                                    'ecr:BatchGetImage',
                                    'ecr:GetDownloadUrlForLayer',
                                    'ecr:DescribeImages'
                                ],
                                Effect: 'Allow',
                                Principal: {
                                    AWS: [
                                        {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    'arn:',
                                                    { Ref: 'AWS::Partition' },
                                                    ':iam::11111:root'
                                                ]
                                            ]
                                        },
                                        {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    'arn:',
                                                    { Ref: 'AWS::Partition' },
                                                    ':iam::22222:root'
                                                ]
                                            ]
                                        }
                                    ]
                                }
                            }
                        ],
                        Version: '2012-10-17'
                    }
                },
                UpdateReplacePolicy: 'Retain',
                DeletionPolicy: 'Retain'
            },
            phpfpmecr3C5F411B: {
                Type: 'AWS::ECR::Repository',
                Properties: {
                    ImageScanningConfiguration: { ScanOnPush: true },
                    LifecyclePolicy: {
                        LifecyclePolicyText: '{"rules":[{"rulePriority":1,"selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":3},"action":{"type":"expire"}}]}'
                    },
                    RepositoryName: 'pcc-app/phpfpm',
                    RepositoryPolicyText: {
                        Statement: [
                            {
                                Action: [
                                    'ecr:BatchCheckLayerAvailability',
                                    'ecr:GetDownloadUrlForLayer',
                                    'ecr:BatchGetImage'
                                ],
                                Effect: 'Allow',
                                Principal: {
                                    AWS: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                { Ref: 'AWS::Partition' },
                                                templateHelper.startsWithMatch(':iam::11111:role/pcc-sdlc-app-stackruntask0execrole')
                                            ]
                                        ]
                                    }
                                }
                            },
                            {
                                Action: [
                                    'ecr:BatchCheckLayerAvailability',
                                    'ecr:GetDownloadUrlForLayer',
                                    'ecr:BatchGetImage'
                                ],
                                Effect: 'Allow',
                                Principal: {
                                    AWS: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                { Ref: 'AWS::Partition' },
                                                templateHelper.startsWithMatch(':iam::11111:role/pcc-sdlc-app-stackruntask0execrole')
                                            ]
                                        ]
                                    }
                                }
                            },
                            {
                                Action: [
                                    'ecr:BatchCheckLayerAvailability',
                                    'ecr:GetDownloadUrlForLayer',
                                    'ecr:BatchGetImage'
                                ],
                                Effect: 'Allow',
                                Principal: {
                                    AWS: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                { Ref: 'AWS::Partition' },
                                                templateHelper.startsWithMatch(':iam::11111:role/pcc-sdlc-app-stackkdefweb0execrole')
                                            ]
                                        ]
                                    }
                                }
                            },
                            {
                                Action: [
                                    'ecr:BatchCheckLayerAvailability',
                                    'ecr:GetDownloadUrlForLayer',
                                    'ecr:BatchGetImage'
                                ],
                                Effect: 'Allow',
                                Principal: {
                                    AWS: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                { Ref: 'AWS::Partition' },
                                                templateHelper.startsWithMatch(':iam::22222:role/pcc-prod-app-stackruntask0execrole')
                                            ]
                                        ]
                                    }
                                }
                            },
                            {
                                Action: [
                                    'ecr:BatchCheckLayerAvailability',
                                    'ecr:GetDownloadUrlForLayer',
                                    'ecr:BatchGetImage'
                                ],
                                Effect: 'Allow',
                                Principal: {
                                    AWS: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                { Ref: 'AWS::Partition' },
                                                templateHelper.startsWithMatch(':iam::22222:role/pcc-prod-app-stackruntask0execrole')
                                            ]
                                        ]
                                    }
                                }
                            },
                            {
                                Action: [
                                    'ecr:BatchCheckLayerAvailability',
                                    'ecr:GetDownloadUrlForLayer',
                                    'ecr:BatchGetImage'
                                ],
                                Effect: 'Allow',
                                Principal: {
                                    AWS: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                { Ref: 'AWS::Partition' },
                                                templateHelper.startsWithMatch(':iam::22222:role/pcc-prod-app-stackledtask0execrole')
                                            ]
                                        ]
                                    }
                                }
                            },
                            {
                                Action: [
                                    'ecr:BatchCheckLayerAvailability',
                                    'ecr:GetDownloadUrlForLayer',
                                    'ecr:BatchGetImage'
                                ],
                                Effect: 'Allow',
                                Principal: {
                                    AWS: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                { Ref: 'AWS::Partition' },
                                                templateHelper.startsWithMatch(':iam::22222:role/pcc-prod-app-stackkdefweb0execrole')
                                            ]
                                        ]
                                    }
                                }
                            },
                            {
                                Action: 'ecr:DescribeImages',
                                Effect: 'Allow',
                                Principal: {
                                    AWS: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                { Ref: 'AWS::Partition' },
                                                ':iam::12344:root'
                                            ]
                                        ]
                                    }
                                }
                            },
                            {
                                Action: [
                                    'ecr:BatchCheckLayerAvailability',
                                    'ecr:BatchGetImage',
                                    'ecr:GetDownloadUrlForLayer',
                                    'ecr:DescribeImages'
                                ],
                                Effect: 'Allow',
                                Principal: {
                                    AWS: [
                                        {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    'arn:',
                                                    { Ref: 'AWS::Partition' },
                                                    ':iam::11111:root'
                                                ]
                                            ]
                                        },
                                        {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    'arn:',
                                                    { Ref: 'AWS::Partition' },
                                                    ':iam::22222:root'
                                                ]
                                            ]
                                        }
                                    ]
                                }
                            }
                        ],
                        Version: '2012-10-17'
                    }
                },
                UpdateReplacePolicy: 'Retain',
                DeletionPolicy: 'Retain'
            }
        };
        for (const resource of Object.values(expected)) {
            templateHelper.expectResource(resource.Type, {
                properties: Match.objectEquals(resource)
            });
        }
    });
});

function getConfig(): Record<string, any> {
    const common = {
        Name: 'app',
        College: 'PCC',
        canCreateTask: true,
        domain: 'example.edu',
        subdomain: 'test',
        priority: 100
    };
    return {
        Name: common.Name,
        College: common.College,
        Environment: ConfigEnvironments.SHARED,
        Version: "0.0.0",
        Parameters: {
            repositories: {
                repositories: [EcrRepositoryType.NGINX, EcrRepositoryType.PHPFPM]
            },
            sourceProps: {
                "owner": "repoOwner",
                "repo": "repoName",
                "connectionArn": "arn:aws:codestar-connections:...:connection/..."
            },
            pipelineNotification: {
                detailType: DetailType.FULL,
                events: [
                    PipelineNotificationEvents.PIPELINE_EXECUTION_FAILED,
                    PipelineNotificationEvents.PIPELINE_EXECUTION_SUCCEEDED,
                    PipelineNotificationEvents.MANUAL_APPROVAL_NEEDED
                ],
                emails: ['test@example.edu']
            },
        },
        Environments: [
            {
                AWSAccountId: '11111',
                AWSRegion: 'us-west-2',
                Name: common.Name,
                College: common.College,
                Environment: ConfigEnvironments.SDLC,
                Version: "0.0.0",
                Parameters: {
                    canCreateTask: common.canCreateTask,
                    alarmEmails: ['sdlc@example.edu'],
                    hostedZoneDomain: `sdlc.${common.domain}`,
                    dynamoDb: {},
                    healthCheck: {
                        path: '/api/healthz',
                        protocol: Protocol.HTTP
                    },
                    listenerRule: {
                        priority: common.priority,
                        conditions: {
                            hostHeaders: [`${common.subdomain}.sdlc.${common.domain}`]
                        }
                    },
                    subdomain: common.subdomain,
                    targetGroup: {},
                    startStop: {
                        stop: 'cron(0 5 * * ? *)',
                    },
                    secretKeys: ['FOO', 'BAR'],
                    tasks: [
                        {
                            type: TaskServiceType.CREATE_RUN_ONCE_TASK,
                            taskDefinition: {
                                cpu: '256',
                                memoryMiB: '512',
                                containers: [
                                    {
                                        type: ContainerType.CREATE_RUN_ONCE_TASK,
                                        image: 'phpfpm',
                                        hasSecrets: true,
                                        hasEnv: true,
                                        cpu: 256,
                                        memoryLimitMiB: 512,
                                        essential: true,
                                        dependency: true,
                                        entryPoint: ContainerEntryPoint.SH,
                                        command: ContainerCommand.ON_CREATE
                                    }
                                ]
                            }
                        },
                        {
                            type: TaskServiceType.UPDATE_RUN_ONCE_TASK,
                            taskDefinition: {
                                cpu: '256',
                                memoryMiB: '512',
                                containers: [
                                    {
                                        type: ContainerType.UPDATE_RUN_ONCE_TASK,
                                        image: 'phpfpm',
                                        hasSecrets: true,
                                        hasEnv: true,
                                        cpu: 256,
                                        memoryLimitMiB: 512,
                                        essential: true,
                                        dependsOn: true,
                                        entryPoint: ContainerEntryPoint.PHP,
                                        command: ContainerCommand.MIGRATE,
                                    }
                                ]
                            }
                        }
                    ],
                    services: [
                        {
                            type: TaskServiceType.WEB_SERVICE,
                            attachToTargetGroup: true,
                            enableExecuteCommand: true,
                            scalable: {
                                types: [ScalableTypes.CPU, ScalableTypes.MEMORY],
                                scaleAt: 75,
                                minCapacity: 1,
                                maxCapacity: 3
                            },
                            taskDefinition: {
                                cpu: '256',
                                memoryMiB: '512',
                                containers: [
                                    {
                                        image: 'nginx',
                                        cpu: 64,
                                        memoryLimitMiB: 64,
                                        portMappings: [{
                                            containerPort: 80
                                        }]
                                    },
                                    {
                                        image: 'phpfpm',
                                        hasSecrets: true,
                                        hasEnv: true,
                                        cpu: 128,
                                        memoryLimitMiB: 128,
                                        portMappings: [{
                                            containerPort: 9000
                                        }]
                                    }
                                ]
                            }
                        }
                    ],
                }
            },
            {
                AWSAccountId: '22222',
                AWSRegion: 'us-west-2',
                Name: common.Name,
                College: common.College,
                Environment: ConfigEnvironments.PROD,
                Version: "0.0.0",
                Parameters: {
                    canCreateTask: common.canCreateTask,
                    alarmEmails: ['prod@example.edu'],
                    hostedZoneDomain: common.domain,
                    dynamoDb: {},
                    healthCheck: {
                        path: '/api/healthz',
                        protocol: Protocol.HTTP
                    },
                    listenerRule: {
                        priority: common.priority,
                        conditions: {
                            hostHeaders: [`${common.subdomain}.${common.domain}`]
                        }
                    },
                    subdomain: common.subdomain,
                    targetGroup: {},
                    steps: {
                        ManualApprovalStep: {}
                    },
                    secretKeys: ['FOO', 'BAR'],
                    tasks: [
                        {
                            type: TaskServiceType.CREATE_RUN_ONCE_TASK,
                            taskDefinition: {
                                cpu: '256',
                                memoryMiB: '512',
                                containers: [
                                    {
                                        type: ContainerType.CREATE_RUN_ONCE_TASK,
                                        image: 'phpfpm',
                                        hasSecrets: true,
                                        hasEnv: true,
                                        cpu: 256,
                                        memoryLimitMiB: 512,
                                        essential: true,
                                        dependency: true,
                                        entryPoint: ContainerEntryPoint.SH,
                                        command: ContainerCommand.ON_CREATE
                                    }
                                ]
                            }
                        },
                        {
                            type: TaskServiceType.UPDATE_RUN_ONCE_TASK,
                            taskDefinition: {
                                cpu: '256',
                                memoryMiB: '512',
                                containers: [
                                    {
                                        type: ContainerType.UPDATE_RUN_ONCE_TASK,
                                        image: 'phpfpm',
                                        hasSecrets: true,
                                        hasEnv: true,
                                        cpu: 256,
                                        memoryLimitMiB: 512,
                                        essential: true,
                                        dependsOn: true,
                                        entryPoint: ContainerEntryPoint.PHP,
                                        command: ContainerCommand.MIGRATE,
                                    }
                                ]
                            }
                        },
                        {
                            type: TaskServiceType.SCHEDULED_TASK,
                            schedule: {
                                type: SchedulableTypes.EXPRESSION,
                                value: 'cron(0 12 * * ? *)'
                            },
                            taskDefinition: {
                                cpu: '256',
                                memoryMiB: '512',
                                containers: [
                                    {
                                        type: ContainerType.SCHEDULED_TASK,
                                        image: 'phpfpm',
                                        hasSecrets: true,
                                        hasEnv: true,
                                        cpu: 256,
                                        memoryLimitMiB: 512,
                                        essential: true,
                                        dependsOn: true,
                                        entryPoint: ContainerEntryPoint.PHP,
                                        command: ContainerCommand.ARTISAN,
                                        additionalCommand: ['catalyst:daily']
                                    }
                                ]
                            }
                        }
                    ],
                    services: [
                        {
                            type: TaskServiceType.WEB_SERVICE,
                            attachToTargetGroup: true,
                            enableExecuteCommand: true,
                            scalable: {
                                types: [ScalableTypes.CPU, ScalableTypes.MEMORY],
                                scaleAt: 75,
                                minCapacity: 1,
                                maxCapacity: 3
                            },
                            taskDefinition: {
                                cpu: '512',
                                memoryMiB: '1024',
                                containers: [
                                    {
                                        image: 'nginx',
                                        cpu: 64,
                                        memoryLimitMiB: 64,
                                        portMappings: [{
                                            containerPort: 80
                                        }]
                                    },
                                    {
                                        image: 'phpfpm',
                                        hasSecrets: true,
                                        hasEnv: true,
                                        cpu: 128,
                                        memoryLimitMiB: 128,
                                        portMappings: [{
                                            containerPort: 9000
                                        }]
                                    }
                                ]
                            }
                        }
                    ],
                }
            }
        ]
    }
}