import {resetStaticProps} from "../../src/utils/reset-static-props";
import {mockClient} from "aws-sdk-client-mock";
import {GetParameterCommand, SSMClient} from "@aws-sdk/client-ssm";
import {PreSynthHelper, StaticProvider} from "../../src/utils";
import {ConfigEnvironments} from "../../src/config";
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
import {DescribeImagesCommand, ECRClient, TagStatus} from "@aws-sdk/client-ecr";
import {CodePipelineEcsStackFactory} from "../../src/stack-factory";
import path from "node:path";
import {TemplateHelper} from "../../src/utils/testing";
import {Match, Template} from "aws-cdk-lib/assertions";
import {buildCodePipelineCdsStack} from "../../src";

const configDir = path.join(__dirname, '/../__config__');

const mockSsm = mockClient(SSMClient);
const mockEcr = mockClient(ECRClient);

describe('code pipeline ecs stack factory', () => {

    afterEach(() => {
        mockSsm.reset();
        mockEcr.reset();
        resetStaticProps();
        const staticProvider = new StaticProvider();
        staticProvider.cleanup();
    });

    it('should throw error if not initialized', () => {
        const preSynthHelper = new PreSynthHelper({
            configDir: configDir,
            clientConfig: {}
        });
        const stackFactory = new CodePipelineEcsStackFactory({
            preSynthHelper: preSynthHelper
        });
        expect(() => stackFactory.buildStack()).toThrowError('Not initialized.');
    });

    it('should throw error if no live config loaded', () => {
        mockSsm.onAnyCommand().resolves({});
        mockEcr.onAnyCommand().resolves({});
        const preSynthHelper = new PreSynthHelper({
            configDir: configDir,
            clientConfig: {}
        });
        const stackFactory = new CodePipelineEcsStackFactory({
            preSynthHelper: preSynthHelper
        });
        return expect(stackFactory.initialize()).rejects.toThrowError('Missing config keys: College Name');
    });

    it('should create a pipeline stack', async () => {
        mockSsm.on(GetParameterCommand, {
            Name: '/pcc-shared-stack/config'
        }).resolves({
            Parameter: {
                Value: JSON.stringify(getConfig()),
                Name: '/pcc-shared-stack/config'
            }
        });
        mockEcr.on(DescribeImagesCommand, {
            filter: {
                tagStatus: TagStatus.TAGGED
            },
            repositoryName: 'pcc-shared-stack/nginx'
        }).rejects('error!');
        mockEcr.on(DescribeImagesCommand, {
            filter: {
                tagStatus: TagStatus.TAGGED
            },
            repositoryName: 'pcc-shared-stack/phpfpm'
        }).resolves({
            imageDetails: [
                {
                    registryId: "abc123",
                    repositoryName: "pcc-shared-stack/phpfpm",
                    imageTags: ['5', '3', 'foo'],
                }
            ]
        });
        const preSynthHelper = new PreSynthHelper({
            configDir: configDir,
            clientConfig: {}
        });
        const stackFactory = new CodePipelineEcsStackFactory({
            preSynthHelper: preSynthHelper
        });
        await stackFactory.initialize();
        const stack = stackFactory.buildStack({
            stackProps: {
                env: {
                    account: '12344',
                    region: 'us-west-2'
                }
            }
        });
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        const expected = getExpected(templateHelper);
        for (const resource of Object.values(expected)) {
            templateHelper.expectResource(resource.Type, {
                properties: Match.objectEquals(resource)
            });
        }
    });

    it('should create a pipeline stack from helper function', async () => {
        mockSsm.on(GetParameterCommand, {
            Name: '/pcc-shared-stack/config'
        }).resolves({
            Parameter: {
                Value: JSON.stringify(getConfig()),
                Name: '/pcc-shared-stack/config'
            }
        });
        mockEcr.on(DescribeImagesCommand, {
            filter: {
                tagStatus: TagStatus.TAGGED
            },
            repositoryName: 'pcc-shared-stack/nginx'
        }).rejects('error!');
        mockEcr.on(DescribeImagesCommand, {
            filter: {
                tagStatus: TagStatus.TAGGED
            },
            repositoryName: 'pcc-shared-stack/phpfpm'
        }).resolves({
            imageDetails: [
                {
                    registryId: "abc123",
                    repositoryName: "pcc-shared-stack/phpfpm",
                    imageTags: ['5', '3', 'foo'],
                }
            ]
        });
        const preSynthHelper = new PreSynthHelper({
            configDir: configDir,
            clientConfig: {}
        });
        const stack = await buildCodePipelineCdsStack({
            preSynthHelper: preSynthHelper
        }, {
            stackProps: {
                env: {
                    account: '12344',
                    region: 'us-west-2'
                }
            }
        });
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        const expected = getExpected(templateHelper);
        for (const resource of Object.values(expected)) {
            templateHelper.expectResource(resource.Type, {
                properties: Match.objectEquals(resource)
            });
        }
    });
});

function getConfig(): Record<string, any> {
    const common = {
        Name: 'Stack',
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

function getExpected(templateHelper: TemplateHelper) {
    return {
        pccsharedstacksynthsteprole19ECCDAB: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: {Service: 'codebuild.amazonaws.com'}
                        }
                    ],
                    Version: '2012-10-17'
                },
                Tags: [
                    {Key: 'App', Value: 'Stack'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            }
        },
        pccsharedstacksynthsteproleDefaultPolicy04F578CF: {
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
                                            {Ref: 'AWS::Partition'},
                                            ':logs:us-west-2:12344:log-group:/aws/codebuild/',
                                            {
                                                Ref: templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineBuildpccsharedstacksynthstepCdkBuildProject')
                                            }
                                        ]
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':logs:us-west-2:12344:log-group:/aws/codebuild/',
                                            {
                                                Ref: templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineBuildpccsharedstacksynthstepCdkBuildProject')
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
                                        {Ref: 'AWS::Partition'},
                                        ':codebuild:us-west-2:12344:report-group/',
                                        {
                                            Ref: templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineBuildpccsharedstacksynthstepCdkBuildProject')
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
                                        templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineArtifactsBucket'),
                                        'Arn'
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [
                                                    templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineArtifactsBucket'),
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
                                    templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineArtifactsBucketEncryptionKey'),
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
                                    templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineArtifactsBucketEncryptionKey'),
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
                                        {Ref: 'AWS::Partition'},
                                        ':ssm:us-west-2:12344:parameter/pcc-shared-stack/config'
                                    ]
                                ]
                            }
                        },
                        {
                            Action: 'ecr:DescribeImages',
                            Effect: 'Allow',
                            Resource: {'Fn::GetAtt': [templateHelper.startsWithMatch('nginxecr'), 'Arn']}
                        },
                        {
                            Action: 'ecr:DescribeImages',
                            Effect: 'Allow',
                            Resource: {'Fn::GetAtt': [templateHelper.startsWithMatch('phpfpmecr'), 'Arn']}
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
                PolicyName: templateHelper.startsWithMatch('pccsharedstacksynthsteproleDefaultPolicy'),
                Roles: [{Ref: templateHelper.startsWithMatch('pccsharedstacksynthsteprole')}]
            }
        },
        pccsharedstackcodepipelinePipelineArtifactsBucketEncryptionKey9282A8FA: {
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
                                            {Ref: 'AWS::Partition'},
                                            ':iam::12344:root'
                                        ]
                                    ]
                                }
                            },
                            Resource: '*'
                        },
                        {
                            Action: ['kms:Decrypt', 'kms:DescribeKey'],
                            Effect: 'Allow',
                            Principal: {
                                AWS: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':iam::11111:role/cdk-hnb659fds-deploy-role-11111-us-west-2'
                                        ]
                                    ]
                                }
                            },
                            Resource: '*'
                        },
                        {
                            Action: ['kms:Decrypt', 'kms:DescribeKey'],
                            Effect: 'Allow',
                            Principal: {
                                AWS: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':iam::22222:role/cdk-hnb659fds-deploy-role-22222-us-west-2'
                                        ]
                                    ]
                                }
                            },
                            Resource: '*'
                        }
                    ],
                    Version: '2012-10-17'
                },
                Tags: [
                    {Key: 'App', Value: 'Stack'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsharedstackcodepipelinePipelineArtifactsBucketEncryptionKeyAlias59622D93: {
            Type: 'AWS::KMS::Alias',
            Properties: {
                AliasName: 'alias/codepipeline-pccsharedstackpccsharedstackcodepipelinepipeline87d580da',
                TargetKeyId: {
                    'Fn::GetAtt': [
                        templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineArtifactsBucketEncryptionKey'),
                        'Arn'
                    ]
                }
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        pccsharedstackcodepipelinePipelineArtifactsBucket952A0E6F: {
            Type: 'AWS::S3::Bucket',
            Properties: {
                BucketEncryption: {
                    ServerSideEncryptionConfiguration: [
                        {
                            ServerSideEncryptionByDefault: {
                                KMSMasterKeyID: {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineArtifactsBucketEncryptionKey'),
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
                },
                Tags: [
                    {Key: 'App', Value: 'Stack'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            },
            UpdateReplacePolicy: 'Retain',
            DeletionPolicy: 'Retain'
        },
        pccsharedstackcodepipelinePipelineArtifactsBucketPolicy4C6D534D: {
            Type: 'AWS::S3::BucketPolicy',
            Properties: {
                Bucket: {
                    Ref: templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineArtifactsBucket')
                },
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 's3:*',
                            Condition: {Bool: {'aws:SecureTransport': 'false'}},
                            Effect: 'Deny',
                            Principal: {AWS: '*'},
                            Resource: [
                                {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineArtifactsBucket'),
                                        'Arn'
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [
                                                    templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineArtifactsBucket'),
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
                            Action: ['s3:GetObject*', 's3:GetBucket*', 's3:List*'],
                            Effect: 'Allow',
                            Principal: {
                                AWS: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':iam::11111:role/cdk-hnb659fds-deploy-role-11111-us-west-2'
                                        ]
                                    ]
                                }
                            },
                            Resource: [
                                {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineArtifactsBucket'),
                                        'Arn'
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [
                                                    templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineArtifactsBucket'),
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
                            Action: ['s3:GetObject*', 's3:GetBucket*', 's3:List*'],
                            Effect: 'Allow',
                            Principal: {
                                AWS: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':iam::22222:role/cdk-hnb659fds-deploy-role-22222-us-west-2'
                                        ]
                                    ]
                                }
                            },
                            Resource: [
                                {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineArtifactsBucket'),
                                        'Arn'
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [
                                                    templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineArtifactsBucket'),
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
        pccsharedstackcodepipelinePipelineRole6AA47D6D: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: {Service: 'codepipeline.amazonaws.com'}
                        }
                    ],
                    Version: '2012-10-17'
                },
                Tags: [
                    {Key: 'App', Value: 'Stack'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            }
        },
        pccsharedstackcodepipelinePipelineRoleDefaultPolicyE56D1019: {
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
                                        templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineArtifactsBucket'),
                                        'Arn'
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [
                                                    templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineArtifactsBucket'),
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
                                    templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineArtifactsBucketEncryptionKey'),
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRole'),
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineBuildpccsharedstacksynthstepCodePipelineActionRole'),
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineUpdatePipelineSelfMutateCodePipelineActionRole'),
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineAssetsFileAsset1CodePipelineActionRole'),
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineAssetsFileAsset2CodePipelineActionRole'),
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineAssetsFileAsset3CodePipelineActionRole'),
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
                                        {Ref: 'AWS::Partition'},
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
                                        {Ref: 'AWS::Partition'},
                                        ':iam::22222:role/cdk-hnb659fds-deploy-role-22222-us-west-2'
                                    ]
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineRoleDefaultPolicy'),
                Roles: [{Ref: templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineRole')}]
            }
        },
        pccsharedstackcodepipelinePipeline15A29D36: {
            Type: 'AWS::CodePipeline::Pipeline',
            Properties: {
                RoleArn: {
                    'Fn::GetAtt': [templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineRole'), 'Arn']
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
                                OutputArtifacts: [{Name: 'repoOwner_repoName_Source'}],
                                RoleArn: {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRole'),
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
                                        Ref: templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineBuildpccsharedstacksynthstepCdkBuildProject')
                                    },
                                    EnvironmentVariables: '[{"name":"_PROJECT_CONFIG_HASH","type":"PLAINTEXT","value":"3b6a035bb04bf76cf2c0f21ec4bf82e37ec46d46f87dd4f6ae4957c2a9e2f549"}]'
                                },
                                InputArtifacts: [{Name: 'repoOwner_repoName_Source'}],
                                Name: 'pcc-shared-stack-synth-step',
                                OutputArtifacts: [{Name: 'pcc_shared_stack_synth_step_Output'}],
                                RoleArn: {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineBuildpccsharedstacksynthstepCodePipelineActionRole'),
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
                                        Ref: templateHelper.startsWithMatch('pccsharedstackcodepipelineUpdatePipelineSelfMutation')
                                    },
                                    EnvironmentVariables: '[{"name":"_PROJECT_CONFIG_HASH","type":"PLAINTEXT","value":"36ae2490fb0cdaadc9bff71f971202307d44f09fe95e564103e7377a96b2e0f6"}]'
                                },
                                InputArtifacts: [{Name: 'pcc_shared_stack_synth_step_Output'}],
                                Name: 'SelfMutate',
                                RoleArn: {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineUpdatePipelineSelfMutateCodePipelineActionRole'),
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
                                        Ref: templateHelper.startsWithMatch('pccsharedstackcodepipelineAssetsFileAsset1')
                                    }
                                },
                                InputArtifacts: [{Name: 'pcc_shared_stack_synth_step_Output'}],
                                Name: 'FileAsset1',
                                RoleArn: {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineAssetsFileAsset1CodePipelineActionRole'),
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
                                        Ref: templateHelper.startsWithMatch('pccsharedstackcodepipelineAssetsFileAsset2')
                                    }
                                },
                                InputArtifacts: [{Name: 'pcc_shared_stack_synth_step_Output'}],
                                Name: 'FileAsset2',
                                RoleArn: {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineAssetsFileAsset2CodePipelineActionRole'),
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
                                        Ref: templateHelper.startsWithMatch('pccsharedstackcodepipelineAssetsFileAsset3')
                                    }
                                },
                                InputArtifacts: [{Name: 'pcc_shared_stack_synth_step_Output'}],
                                Name: 'FileAsset3',
                                RoleArn: {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineAssetsFileAsset3CodePipelineActionRole'),
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
                                    StackName: 'pcc-sdlc-stack-stack',
                                    Capabilities: 'CAPABILITY_NAMED_IAM,CAPABILITY_AUTO_EXPAND',
                                    RoleArn: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                {Ref: 'AWS::Partition'},
                                                ':iam::11111:role/cdk-hnb659fds-cfn-exec-role-11111-us-west-2'
                                            ]
                                        ]
                                    },
                                    TemplateConfiguration: 'pcc_shared_stack_synth_step_Output::assembly-pcc-shared-stack-pcc-sdlc-stack/pccsharedstackpccsdlcstack938AA6CF.template.json.config.json',
                                    ActionMode: 'CHANGE_SET_REPLACE',
                                    ChangeSetName: 'PipelineChange',
                                    TemplatePath: 'pcc_shared_stack_synth_step_Output::assembly-pcc-shared-stack-pcc-sdlc-stack/pccsharedstackpccsdlcstack938AA6CF.template.json'
                                },
                                InputArtifacts: [{Name: 'pcc_shared_stack_synth_step_Output'}],
                                Name: 'Prepare',
                                RoleArn: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
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
                                    StackName: 'pcc-sdlc-stack-stack',
                                    ActionMode: 'CHANGE_SET_EXECUTE',
                                    ChangeSetName: 'PipelineChange'
                                },
                                Name: 'Deploy',
                                RoleArn: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':iam::11111:role/cdk-hnb659fds-deploy-role-11111-us-west-2'
                                        ]
                                    ]
                                },
                                RunOrder: 2
                            }
                        ],
                        Name: 'pcc-sdlc-stack'
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
                                    StackName: 'pcc-prod-stack-stack',
                                    Capabilities: 'CAPABILITY_NAMED_IAM,CAPABILITY_AUTO_EXPAND',
                                    RoleArn: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                {Ref: 'AWS::Partition'},
                                                ':iam::22222:role/cdk-hnb659fds-cfn-exec-role-22222-us-west-2'
                                            ]
                                        ]
                                    },
                                    TemplateConfiguration: 'pcc_shared_stack_synth_step_Output::assembly-pcc-shared-stack-pcc-prod-stack/pccsharedstackpccprodstack7595D11C.template.json.config.json',
                                    ActionMode: 'CHANGE_SET_REPLACE',
                                    ChangeSetName: 'PipelineChange',
                                    TemplatePath: 'pcc_shared_stack_synth_step_Output::assembly-pcc-shared-stack-pcc-prod-stack/pccsharedstackpccprodstack7595D11C.template.json'
                                },
                                InputArtifacts: [{Name: 'pcc_shared_stack_synth_step_Output'}],
                                Name: 'Prepare',
                                RoleArn: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
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
                                    StackName: 'pcc-prod-stack-stack',
                                    ActionMode: 'CHANGE_SET_EXECUTE',
                                    ChangeSetName: 'PipelineChange'
                                },
                                Name: 'Deploy',
                                RoleArn: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':iam::22222:role/cdk-hnb659fds-deploy-role-22222-us-west-2'
                                        ]
                                    ]
                                },
                                RunOrder: 2
                            }
                        ],
                        Name: 'pcc-prod-stack'
                    }
                ],
                ArtifactStore: {
                    EncryptionKey: {
                        Id: {
                            'Fn::GetAtt': [
                                templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineArtifactsBucketEncryptionKey'),
                                'Arn'
                            ]
                        },
                        Type: 'KMS'
                    },
                    Location: {
                        Ref: templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineArtifactsBucket')
                    },
                    Type: 'S3'
                },
                Name: 'pcc-shared-stack-code-pipeline',
                RestartExecutionOnUpdate: true,
                Tags: [
                    {Key: 'App', Value: 'Stack'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            },
            DependsOn: [
                templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineRoleDefaultPolicy'),
                templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineRole')
            ]
        },
        pccsharedstackcodepipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRole3FAE0847: {
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
                                            {Ref: 'AWS::Partition'},
                                            ':iam::12344:root'
                                        ]
                                    ]
                                }
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                Tags: [
                    {Key: 'App', Value: 'Stack'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            }
        },
        pccsharedstackcodepipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRoleDefaultPolicyB9DD91CF: {
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
                                        templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineArtifactsBucket'),
                                        'Arn'
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [
                                                    templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineArtifactsBucket'),
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
                                    templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineArtifactsBucketEncryptionKey'),
                                    'Arn'
                                ]
                            }
                        },
                        {
                            Action: ['s3:PutObjectAcl', 's3:PutObjectVersionAcl'],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        {
                                            'Fn::GetAtt': [
                                                templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineArtifactsBucket'),
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
                PolicyName: templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRoleDefaultPolicy'),
                Roles: [
                    {
                        Ref: templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineSourcerepoOwnerrepoNameCodePipelineActionRole')
                    }
                ]
            }
        },
        pccsharedstackcodepipelinePipelineBuildpccsharedstacksynthstepCdkBuildProject6558945F: {
            Type: 'AWS::CodeBuild::Project',
            Properties: {
                Artifacts: {Type: 'CODEPIPELINE'},
                Environment: {
                    ComputeType: 'BUILD_GENERAL1_SMALL',
                    Image: 'aws/codebuild/standard:5.0',
                    ImagePullCredentialsType: 'CODEBUILD',
                    PrivilegedMode: false,
                    Type: 'LINUX_CONTAINER'
                },
                ServiceRole: {
                    'Fn::GetAtt': [templateHelper.startsWithMatch('pccsharedstacksynthsteprole'), 'Arn']
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
                Cache: {Type: 'NO_CACHE'},
                Description: 'Pipeline step pcc-shared-stack/Pipeline/Build/pcc-shared-stack-synth-step',
                EncryptionKey: {
                    'Fn::GetAtt': [
                        templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineArtifactsBucketEncryptionKey'),
                        'Arn'
                    ]
                },
                Tags: [
                    {Key: 'App', Value: 'Stack'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            }
        },
        pccsharedstackcodepipelinePipelineBuildpccsharedstacksynthstepCodePipelineActionRole5E4F76C1: {
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
                                            {Ref: 'AWS::Partition'},
                                            ':iam::12344:root'
                                        ]
                                    ]
                                }
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                Tags: [
                    {Key: 'App', Value: 'Stack'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            }
        },
        pccsharedstackcodepipelinePipelineBuildpccsharedstacksynthstepCodePipelineActionRoleDefaultPolicy3DB6A1CE: {
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
                                    templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineBuildpccsharedstacksynthstepCdkBuildProject'),
                                    'Arn'
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineBuildpccsharedstacksynthstepCodePipelineActionRoleDefaultPolicy'),
                Roles: [
                    {
                        Ref: templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineBuildpccsharedstacksynthstepCodePipelineActionRole')
                    }
                ]
            }
        },
        pccsharedstackcodepipelinePipelineUpdatePipelineSelfMutateCodePipelineActionRoleF10741FB: {
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
                                            {Ref: 'AWS::Partition'},
                                            ':iam::12344:root'
                                        ]
                                    ]
                                }
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                Tags: [
                    {Key: 'App', Value: 'Stack'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            }
        },
        pccsharedstackcodepipelinePipelineUpdatePipelineSelfMutateCodePipelineActionRoleDefaultPolicy96C5B1A4: {
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
                                    templateHelper.startsWithMatch('pccsharedstackcodepipelineUpdatePipelineSelfMutation'),
                                    'Arn'
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineUpdatePipelineSelfMutateCodePipelineActionRoleDefaultPolicy'),
                Roles: [
                    {
                        Ref: templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineUpdatePipelineSelfMutateCodePipelineActionRole')
                    }
                ]
            }
        },
        pccsharedstackcodepipelinePipelineAssetsFileAsset1CodePipelineActionRole3706623F: {
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
                                            {Ref: 'AWS::Partition'},
                                            ':iam::12344:root'
                                        ]
                                    ]
                                }
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                Tags: [
                    {Key: 'App', Value: 'Stack'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            }
        },
        pccsharedstackcodepipelinePipelineAssetsFileAsset1CodePipelineActionRoleDefaultPolicyE63BF2A5: {
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
                                    templateHelper.startsWithMatch('pccsharedstackcodepipelineAssetsFileAsset1'),
                                    'Arn'
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineAssetsFileAsset1CodePipelineActionRoleDefaultPolicy'),
                Roles: [
                    {
                        Ref: templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineAssetsFileAsset1CodePipelineActionRole')
                    }
                ]
            }
        },
        pccsharedstackcodepipelinePipelineAssetsFileAsset2CodePipelineActionRoleFBB96BA7: {
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
                                            {Ref: 'AWS::Partition'},
                                            ':iam::12344:root'
                                        ]
                                    ]
                                }
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                Tags: [
                    {Key: 'App', Value: 'Stack'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            }
        },
        pccsharedstackcodepipelinePipelineAssetsFileAsset2CodePipelineActionRoleDefaultPolicy7F12F097: {
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
                                    templateHelper.startsWithMatch('pccsharedstackcodepipelineAssetsFileAsset2'),
                                    'Arn'
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineAssetsFileAsset2CodePipelineActionRoleDefaultPolicy'),
                Roles: [
                    {
                        Ref: templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineAssetsFileAsset2CodePipelineActionRole')
                    }
                ]
            }
        },
        pccsharedstackcodepipelinePipelineAssetsFileAsset3CodePipelineActionRole38F2D519: {
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
                                            {Ref: 'AWS::Partition'},
                                            ':iam::12344:root'
                                        ]
                                    ]
                                }
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                Tags: [
                    {Key: 'App', Value: 'Stack'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            }
        },
        pccsharedstackcodepipelinePipelineAssetsFileAsset3CodePipelineActionRoleDefaultPolicy995D46A1: {
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
                                    templateHelper.startsWithMatch('pccsharedstackcodepipelineAssetsFileAsset3'),
                                    'Arn'
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineAssetsFileAsset3CodePipelineActionRoleDefaultPolicy'),
                Roles: [
                    {
                        Ref: templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineAssetsFileAsset3CodePipelineActionRole')
                    }
                ]
            }
        },
        pccsharedstackcodepipelineUpdatePipelineSelfMutationRole6E62A02F: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: {Service: 'codebuild.amazonaws.com'}
                        }
                    ],
                    Version: '2012-10-17'
                },
                Tags: [
                    {Key: 'App', Value: 'Stack'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            }
        },
        pccsharedstackcodepipelineUpdatePipelineSelfMutationRoleDefaultPolicy773522C4: {
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
                                            {Ref: 'AWS::Partition'},
                                            ':logs:us-west-2:12344:log-group:/aws/codebuild/',
                                            {
                                                Ref: templateHelper.startsWithMatch('pccsharedstackcodepipelineUpdatePipelineSelfMutation')
                                            }
                                        ]
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':logs:us-west-2:12344:log-group:/aws/codebuild/',
                                            {
                                                Ref: templateHelper.startsWithMatch('pccsharedstackcodepipelineUpdatePipelineSelfMutation')
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
                                        {Ref: 'AWS::Partition'},
                                        ':codebuild:us-west-2:12344:report-group/',
                                        {
                                            Ref: templateHelper.startsWithMatch('pccsharedstackcodepipelineUpdatePipelineSelfMutation')
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
                                    'iam:ResourceTag/aws-cdk:bootstrap-role': ['image-publishing', 'file-publishing', 'deploy']
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
                            Action: ['s3:GetObject*', 's3:GetBucket*', 's3:List*'],
                            Effect: 'Allow',
                            Resource: [
                                {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineArtifactsBucket'),
                                        'Arn'
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [
                                                    templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineArtifactsBucket'),
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
                            Action: ['kms:Decrypt', 'kms:DescribeKey'],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineArtifactsBucketEncryptionKey'),
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
                                    templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineArtifactsBucketEncryptionKey'),
                                    'Arn'
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: templateHelper.startsWithMatch('pccsharedstackcodepipelineUpdatePipelineSelfMutationRoleDefaultPolicy'),
                Roles: [
                    {
                        Ref: templateHelper.startsWithMatch('pccsharedstackcodepipelineUpdatePipelineSelfMutationRole')
                    }
                ]
            }
        },
        pccsharedstackcodepipelineUpdatePipelineSelfMutation05A4EE97: {
            Type: 'AWS::CodeBuild::Project',
            Properties: {
                Artifacts: {Type: 'CODEPIPELINE'},
                Environment: {
                    ComputeType: 'BUILD_GENERAL1_SMALL',
                    Image: 'aws/codebuild/standard:5.0',
                    ImagePullCredentialsType: 'CODEBUILD',
                    PrivilegedMode: false,
                    Type: 'LINUX_CONTAINER'
                },
                ServiceRole: {
                    'Fn::GetAtt': [
                        templateHelper.startsWithMatch('pccsharedstackcodepipelineUpdatePipelineSelfMutationRole'),
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
                        '        "cdk -a . deploy pcc-shared-stack --require-approval=never --verbose"\n' +
                        '      ]\n' +
                        '    }\n' +
                        '  }\n' +
                        '}',
                    Type: 'CODEPIPELINE'
                },
                Cache: {Type: 'NO_CACHE'},
                Description: 'Pipeline step pcc-shared-stack/Pipeline/UpdatePipeline/SelfMutate',
                EncryptionKey: {
                    'Fn::GetAtt': [
                        templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineArtifactsBucketEncryptionKey'),
                        'Arn'
                    ]
                },
                Name: 'pcc-shared-stack-code-pipeline-selfupdate',
                Tags: [
                    {Key: 'App', Value: 'Stack'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            }
        },
        pccsharedstackcodepipelineAssetsFileRoleB7E42EB8: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: {Service: 'codebuild.amazonaws.com'}
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
                                            {Ref: 'AWS::Partition'},
                                            ':iam::12344:root'
                                        ]
                                    ]
                                }
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                Tags: [
                    {Key: 'App', Value: 'Stack'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            }
        },
        pccsharedstackcodepipelineAssetsFileRoleDefaultPolicy1E6A11BC: {
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
                                        {Ref: 'AWS::Partition'},
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
                                        {Ref: 'AWS::Partition'},
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
                            Action: ['s3:GetObject*', 's3:GetBucket*', 's3:List*'],
                            Effect: 'Allow',
                            Resource: [
                                {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineArtifactsBucket'),
                                        'Arn'
                                    ]
                                },
                                {
                                    'Fn::Join': [
                                        '',
                                        [
                                            {
                                                'Fn::GetAtt': [
                                                    templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineArtifactsBucket'),
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
                            Action: ['kms:Decrypt', 'kms:DescribeKey'],
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineArtifactsBucketEncryptionKey'),
                                    'Arn'
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: templateHelper.startsWithMatch('pccsharedstackcodepipelineAssetsFileRoleDefaultPolicy'),
                Roles: [
                    {Ref: templateHelper.startsWithMatch('pccsharedstackcodepipelineAssetsFileRole')}
                ]
            }
        },
        pccsharedstackcodepipelineAssetsFileAsset1F1F9D63F: {
            Type: 'AWS::CodeBuild::Project',
            Properties: {
                Artifacts: {Type: 'CODEPIPELINE'},
                Environment: {
                    ComputeType: 'BUILD_GENERAL1_SMALL',
                    Image: 'aws/codebuild/standard:5.0',
                    ImagePullCredentialsType: 'CODEBUILD',
                    PrivilegedMode: false,
                    Type: 'LINUX_CONTAINER'
                },
                ServiceRole: {
                    'Fn::GetAtt': [
                        templateHelper.startsWithMatch('pccsharedstackcodepipelineAssetsFileRole'),
                        'Arn'
                    ]
                },
                Source: {
                    BuildSpec: Match.stringLikeRegexp('^[\\s\\S]*assembly-pcc-shared-stack-pcc-sdlc-stack/pccsharedstackpccsdlcstack[\\s\\S]*assembly-pcc-shared-stack-pcc-prod-stack/pccsharedstackpccprodstack[\\s\\S]*'),
                    Type: 'CODEPIPELINE'
                },
                Cache: {Type: 'NO_CACHE'},
                Description: 'Pipeline step pcc-shared-stack/Pipeline/Assets/FileAsset1',
                EncryptionKey: {
                    'Fn::GetAtt': [
                        templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineArtifactsBucketEncryptionKey'),
                        'Arn'
                    ]
                },
                Tags: [
                    {Key: 'App', Value: 'Stack'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            }
        },
        pccsharedstackcodepipelineAssetsFileAsset20F265423: {
            Type: 'AWS::CodeBuild::Project',
            Properties: {
                Artifacts: {Type: 'CODEPIPELINE'},
                Environment: {
                    ComputeType: 'BUILD_GENERAL1_SMALL',
                    Image: 'aws/codebuild/standard:5.0',
                    ImagePullCredentialsType: 'CODEBUILD',
                    PrivilegedMode: false,
                    Type: 'LINUX_CONTAINER'
                },
                ServiceRole: {
                    'Fn::GetAtt': [
                        templateHelper.startsWithMatch('pccsharedstackcodepipelineAssetsFileRole'),
                        'Arn'
                    ]
                },
                Source: {
                    BuildSpec: Match.stringLikeRegexp('^[\\s\\S]*assembly-pcc-shared-stack-pcc-sdlc-stack/pccsharedstackpccsdlcstack[\\s\\S]*'),
                    Type: 'CODEPIPELINE'
                },
                Cache: {Type: 'NO_CACHE'},
                Description: 'Pipeline step pcc-shared-stack/Pipeline/Assets/FileAsset2',
                EncryptionKey: {
                    'Fn::GetAtt': [
                        templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineArtifactsBucketEncryptionKey'),
                        'Arn'
                    ]
                },
                Tags: [
                    {Key: 'App', Value: 'Stack'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            }
        },
        pccsharedstackcodepipelineAssetsFileAsset3FCBE4DD1: {
            Type: 'AWS::CodeBuild::Project',
            Properties: {
                Artifacts: {Type: 'CODEPIPELINE'},
                Environment: {
                    ComputeType: 'BUILD_GENERAL1_SMALL',
                    Image: 'aws/codebuild/standard:5.0',
                    ImagePullCredentialsType: 'CODEBUILD',
                    PrivilegedMode: false,
                    Type: 'LINUX_CONTAINER'
                },
                ServiceRole: {
                    'Fn::GetAtt': [
                        templateHelper.startsWithMatch('pccsharedstackcodepipelineAssetsFileRole'),
                        'Arn'
                    ]
                },
                Source: {
                    BuildSpec: Match.stringLikeRegexp('^[\\s\\S]*assembly-pcc-shared-stack-pcc-sdlc-stack/pccsharedstackpccsdlcstack[\\s\\S]*'),
                    Type: 'CODEPIPELINE'
                },
                Cache: {Type: 'NO_CACHE'},
                Description: 'Pipeline step pcc-shared-stack/Pipeline/Assets/FileAsset3',
                EncryptionKey: {
                    'Fn::GetAtt': [
                        templateHelper.startsWithMatch('pccsharedstackcodepipelinePipelineArtifactsBucketEncryptionKey'),
                        'Arn'
                    ]
                },
                Tags: [
                    {Key: 'App', Value: 'Stack'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            }
        },
        pccsharedstackecrsteproleB07EE72A: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: {Service: 'codebuild.amazonaws.com'}
                        }
                    ],
                    Version: '2012-10-17'
                },
                Tags: [
                    {Key: 'App', Value: 'Stack'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            }
        },
        pccsharedstackecrsteproleDefaultPolicyE6B0E793: {
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
                            Resource: {'Fn::GetAtt': [templateHelper.startsWithMatch('nginxecr'), 'Arn']}
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
                            Resource: {'Fn::GetAtt': [templateHelper.startsWithMatch('nginxecr'), 'Arn']}
                        },
                        {
                            Action: [
                                'ecr:BatchCheckLayerAvailability',
                                'ecr:GetDownloadUrlForLayer',
                                'ecr:BatchGetImage'
                            ],
                            Effect: 'Allow',
                            Resource: {'Fn::GetAtt': [templateHelper.startsWithMatch('phpfpmecr'), 'Arn']}
                        },
                        {
                            Action: [
                                'ecr:PutImage',
                                'ecr:InitiateLayerUpload',
                                'ecr:UploadLayerPart',
                                'ecr:CompleteLayerUpload'
                            ],
                            Effect: 'Allow',
                            Resource: {'Fn::GetAtt': [templateHelper.startsWithMatch('phpfpmecr'), 'Arn']}
                        }
                    ],
                    Version: '2012-10-17'
                },
                PolicyName: templateHelper.startsWithMatch('pccsharedstackecrsteproleDefaultPolicy'),
                Roles: [{Ref: templateHelper.startsWithMatch('pccsharedstackecrsteprole')}]
            }
        },
        nginxecrC430EE7B: {
            Type: 'AWS::ECR::Repository',
            Properties: {
                ImageScanningConfiguration: {ScanOnPush: true},
                LifecyclePolicy: {
                    LifecyclePolicyText: '{"rules":[{"rulePriority":1,"selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":3},"action":{"type":"expire"}}]}'
                },
                RepositoryName: 'pcc-stack/nginx',
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
                                            {Ref: 'AWS::Partition'},
                                            templateHelper.startsWithMatch(':iam::11111:role/pcc-sdlc-stack-stackkdefweb0execrole')
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
                                            {Ref: 'AWS::Partition'},
                                            templateHelper.startsWithMatch(':iam::22222:role/pcc-prod-stack-stackkdefweb0execrole')
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
                                            {Ref: 'AWS::Partition'},
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
                                                {Ref: 'AWS::Partition'},
                                                ':iam::11111:root'
                                            ]
                                        ]
                                    },
                                    {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                {Ref: 'AWS::Partition'},
                                                ':iam::22222:root'
                                            ]
                                        ]
                                    }
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                Tags: [
                    {Key: 'App', Value: 'Stack'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            },
            UpdateReplacePolicy: 'Retain',
            DeletionPolicy: 'Retain'
        },
        phpfpmecr3C5F411B: {
            Type: 'AWS::ECR::Repository',
            Properties: {
                ImageScanningConfiguration: {ScanOnPush: true},
                LifecyclePolicy: {
                    LifecyclePolicyText: '{"rules":[{"rulePriority":1,"selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":3},"action":{"type":"expire"}}]}'
                },
                RepositoryName: 'pcc-stack/phpfpm',
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
                                            {Ref: 'AWS::Partition'},
                                            templateHelper.startsWithMatch(':iam::11111:role/pcc-sdlc-stack-stackruntask0execrolee')
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
                                            {Ref: 'AWS::Partition'},
                                            templateHelper.startsWithMatch(':iam::11111:role/pcc-sdlc-stack-stackruntask0execrole')
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
                                            {Ref: 'AWS::Partition'},
                                            templateHelper.startsWithMatch(':iam::11111:role/pcc-sdlc-stack-stackkdefweb0execrole')
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
                                            {Ref: 'AWS::Partition'},
                                            templateHelper.startsWithMatch(':iam::22222:role/pcc-prod-stack-stackruntask0execrole')
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
                                            {Ref: 'AWS::Partition'},
                                            templateHelper.startsWithMatch(':iam::22222:role/pcc-prod-stack-stackruntask0execrole')
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
                                            {Ref: 'AWS::Partition'},
                                            templateHelper.startsWithMatch(':iam::22222:role/pcc-prod-stack-stackledtask0execrole')
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
                                            {Ref: 'AWS::Partition'},
                                            templateHelper.startsWithMatch(':iam::22222:role/pcc-prod-stack-stackkdefweb0execrole')
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
                                            {Ref: 'AWS::Partition'},
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
                                                {Ref: 'AWS::Partition'},
                                                ':iam::11111:root'
                                            ]
                                        ]
                                    },
                                    {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                {Ref: 'AWS::Partition'},
                                                ':iam::22222:root'
                                            ]
                                        ]
                                    }
                                ]
                            }
                        }
                    ],
                    Version: '2012-10-17'
                },
                Tags: [
                    {Key: 'App', Value: 'Stack'},
                    {Key: 'College', Value: 'PCC'},
                    {Key: 'Environment', Value: 'shared'}
                ]
            },
            UpdateReplacePolicy: 'Retain',
            DeletionPolicy: 'Retain'
        }
    };
}