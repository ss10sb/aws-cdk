import {resetStaticProps} from "../../src/utils/reset-static-props";
import {App, Stack} from "aws-cdk-lib";
import {EnvStack} from "../../src/env";
import {ConfigEnvironments} from "../../src/config";
import {EcrRepositories, EcrRepositoryFactory, EcrRepositoryType} from "../../src/ecr";
import {TemplateHelper} from "../../src/utils/testing";
import {Match, Template} from "aws-cdk-lib/assertions";
import {
    ContainerCommand,
    ContainerEntryPoint,
    ContainerType,
    ScalableTypes,
    SchedulableTypes,
    TaskServiceType
} from "../../src/ecs";
import {Protocol} from "aws-cdk-lib/aws-elasticloadbalancingv2";

describe('env stack', () => {

    afterEach(() => {
        resetStaticProps();
    });

    it('should do lookups', () => {
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const envConfig = {
            AWSAccountId: '2222',
            AWSRegion: 'us-west-2',
            Name: 'myapp',
            College: 'PCC',
            Environment: ConfigEnvironments.SDLC,
            Version: "0.0.0",
            Parameters: {
                listenerRule: {
                    priority: 100,
                    conditions: {
                        hostHeaders: ['test.dev.example.edu']
                    }
                },
                targetGroup: {},
                services: [],
                tasks: []
            }
        };
        const app = new App();
        const stack = new Stack(app, 'stack', stackProps);
        const ecrRepositories = new EcrRepositories(stack.node.id, {
            repositories: [EcrRepositoryType.NGINX, EcrRepositoryType.PHPFPM]
        });
        const factory = new EcrRepositoryFactory(stack, stack.node.id, ecrRepositories);
        factory.create();
        const envStack = new EnvStack(stack, 'sdlc-stack', envConfig, {
            repositoryFactory: factory
        }, {}, stackProps);
        envStack.build();
        expect(app.synth().manifest.missing).toEqual([
            {
                "key": "ssm:account=12344:parameterName=pcc-sdlc-alb01-arn:region=us-east-1",
                "props": {
                    "account": "12344",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    "parameterName": "pcc-sdlc-alb01-arn",
                    "region": "us-east-1"
                },
                "provider": "ssm"
            },
            {
                "key": "load-balancer-listener:account=12344:listenerPort=443:listenerProtocol=HTTPS:loadBalancerArn=dummy-value-for-pcc-sdlc-alb01-arn:loadBalancerType=application:region=us-east-1",
                "props": {
                    "account": "12344",
                    "listenerPort": 443,
                    "listenerProtocol": "HTTPS",
                    "loadBalancerArn": "dummy-value-for-pcc-sdlc-alb01-arn",
                    "loadBalancerType": "application",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    "region": "us-east-1"
                },
                "provider": "load-balancer-listener"
            },
            {
                "key": "security-group:account=12344:region=us-east-1:securityGroupId=sg-123456789012",
                "props": {
                    "account": "12344",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    "region": "us-east-1",
                    "securityGroupId": "sg-123456789012"
                },
                "provider": "security-group"
            },
            {
                "key": "load-balancer:account=12344:loadBalancerArn=dummy-value-for-pcc-sdlc-alb01-arn:loadBalancerType=application:region=us-east-1",
                "props": {
                    "account": "12344",
                    "loadBalancerArn": "dummy-value-for-pcc-sdlc-alb01-arn",
                    "loadBalancerType": "application",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    "region": "us-east-1"
                },
                "provider": "load-balancer"
            },
            {
                "key": "vpc-provider:account=12344:filter.vpc-id=vpc-12345:region=us-east-1:returnAsymmetricSubnets=true",
                "props": {
                    "account": "12344",
                    "filter": {
                        "vpc-id": "vpc-12345"
                    },
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    "region": "us-east-1",
                    "returnAsymmetricSubnets": true
                },
                "provider": "vpc-provider"
            },
            {
                "key": "security-group:account=12344:region=us-east-1:securityGroupId=sg-1234",
                "props": {
                    "account": "12344",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::12344:role/cdk-hnb659fds-lookup-role-12344-us-east-1",
                    "region": "us-east-1",
                    "securityGroupId": "sg-1234"
                },
                "provider": "security-group"
            }
        ]);
    });

    it('should create env stack', () => {
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const envStackProps = {env: {region: 'us-west-2', account: '2222'}};
        const envConfig = {
            AWSAccountId: '2222',
            AWSRegion: 'us-west-2',
            Name: 'myapp',
            College: 'PCC',
            Environment: ConfigEnvironments.SDLC,
            Version: "0.0.0",
            Parameters: {
                alarmEmails: ['test@example.edu'],
                secretKeys: ['FOO', 'BAR'],
                listenerRule: {
                    priority: 100,
                    conditions: {
                        hostHeaders: ['test.dev.example.edu']
                    }
                },
                targetGroup: {},
                healthCheck: {
                    path: '/api/healthz',
                    protocol: Protocol.HTTP
                },
                hostedZoneDomain: 'dev.example.edu',
                subdomain: 'test',
                dynamoDb: {},
                startStop: {
                    start: 'cron(0 13 * * ? *)',
                    stop: 'cron(0 5 * * ? *)',
                },
                queue: {
                    type: TaskServiceType.QUEUE_SERVICE,
                    image: EcrRepositoryType.PHPFPM,
                    cpu: 256,
                    hasDeadLetterQueue: true
                },
                s3: {},
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
                ]
            }
        };
        const app = new App();
        const stack = new Stack(app, 'stack', stackProps);
        const ecrRepositories = new EcrRepositories(stack.node.id, {
            repositories: [EcrRepositoryType.NGINX, EcrRepositoryType.PHPFPM]
        });
        const factory = new EcrRepositoryFactory(stack, stack.node.id, ecrRepositories);
        factory.create();
        const envStack = new EnvStack(stack, 'sdlc-stack', envConfig, {
            repositoryFactory: factory
        }, {}, envStackProps);
        envStack.build();
        expect(app.synth().manifest.missing).toEqual([
            {
                "key": "ssm:account=2222:parameterName=pcc-sdlc-alb01-arn:region=us-west-2",
                "props": {
                    "account": "2222",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::2222:role/cdk-hnb659fds-lookup-role-2222-us-west-2",
                    "parameterName": "pcc-sdlc-alb01-arn",
                    "region": "us-west-2"
                },
                "provider": "ssm"
            },
            {
                "key": "load-balancer-listener:account=2222:listenerPort=443:listenerProtocol=HTTPS:loadBalancerArn=dummy-value-for-pcc-sdlc-alb01-arn:loadBalancerType=application:region=us-west-2",
                "props": {
                    "account": "2222",
                    "listenerPort": 443,
                    "listenerProtocol": "HTTPS",
                    "loadBalancerArn": "dummy-value-for-pcc-sdlc-alb01-arn",
                    "loadBalancerType": "application",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::2222:role/cdk-hnb659fds-lookup-role-2222-us-west-2",
                    "region": "us-west-2"
                },
                "provider": "load-balancer-listener"
            },
            {
                "key": "security-group:account=2222:region=us-west-2:securityGroupId=sg-123456789012",
                "props": {
                    "account": "2222",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::2222:role/cdk-hnb659fds-lookup-role-2222-us-west-2",
                    "region": "us-west-2",
                    "securityGroupId": "sg-123456789012"
                },
                "provider": "security-group"
            },
            {
                "key": "load-balancer:account=2222:loadBalancerArn=dummy-value-for-pcc-sdlc-alb01-arn:loadBalancerType=application:region=us-west-2",
                "props": {
                    "account": "2222",
                    "loadBalancerArn": "dummy-value-for-pcc-sdlc-alb01-arn",
                    "loadBalancerType": "application",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::2222:role/cdk-hnb659fds-lookup-role-2222-us-west-2",
                    "region": "us-west-2"
                },
                "provider": "load-balancer"
            },
            {
                "key": "vpc-provider:account=2222:filter.vpc-id=vpc-12345:region=us-west-2:returnAsymmetricSubnets=true",
                "props": {
                    "account": "2222",
                    "filter": {
                        "vpc-id": "vpc-12345"
                    },
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::2222:role/cdk-hnb659fds-lookup-role-2222-us-west-2",
                    "region": "us-west-2",
                    "returnAsymmetricSubnets": true
                },
                "provider": "vpc-provider"
            },
            {
                "key": "security-group:account=2222:region=us-west-2:securityGroupId=sg-1234",
                "props": {
                    "account": "2222",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::2222:role/cdk-hnb659fds-lookup-role-2222-us-west-2",
                    "region": "us-west-2",
                    "securityGroupId": "sg-1234"
                },
                "provider": "security-group"
            },
            {
                "key": "hosted-zone:account=2222:domainName=dev.example.edu:region=us-west-2",
                "props": {
                    "account": "2222",
                    "domainName": "dev.example.edu",
                    "lookupRoleArn": "arn:${AWS::Partition}:iam::2222:role/cdk-hnb659fds-lookup-role-2222-us-west-2",
                    "region": "us-west-2"
                },
                "provider": "hosted-zone"
            }
        ]);
        const templateHelper = new TemplateHelper(Template.fromStack(envStack));
        //templateHelper.inspect();
        const awsServiceRoleMatch = Match.stringLikeRegexp('^AWS.*ServiceRole.*');
        const awsServiceRoleDefaultPolicyMatch = Match.stringLikeRegexp('^AWS.*ServiceRoleDefaultPolicy.*');
        const awsMatch = Match.stringLikeRegexp('^AWS.*');
        const zipMatch = Match.stringLikeRegexp('^.*\.zip');
        const logRetentionMatch = templateHelper.startsWithMatch('LogRetention.*');
        const logRetentionServiceRoleMatch = Match.stringLikeRegexp('^LogRetention.*ServiceRole.*');
        const logRetentionServiceRoleDefaultPolicyMatch = Match.stringLikeRegexp('^LogRetention.*ServiceRoleDefaultPolicy.*');
        const expected = {
            sdlcstackarecordtestdevexampleeduarecord34D230F4: {
                Type: 'AWS::Route53::RecordSet',
                Properties: {
                    Name: 'test.dev.example.edu.',
                    Type: 'A',
                    AliasTarget: {
                        DNSName: 'dualstack.my-load-balancer-1234567890.us-west-2.elb.amazonaws.com',
                        HostedZoneId: 'Z3DZXE0EXAMPLE'
                    },
                    Comment: 'sdlc-stack-arecord: test.dev.example.edu',
                    HostedZoneId: 'DUMMY'
                }
            },
            sdlcstacksesverifytestVerifyDomainIdentityCustomResourcePolicyB3438DEE: {
                Type: 'AWS::IAM::Policy',
                Properties: {
                    PolicyDocument: {
                        Statement: [
                            {
                                Action: ['ses:VerifyDomainIdentity', 'ses:DeleteIdentity'],
                                Effect: 'Allow',
                                Resource: '*'
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    PolicyName: templateHelper.startsWithMatch('sdlcstacksesverifytestVerifyDomainIdentityCustomResourcePolicy'),
                    Roles: [
                        {
                            Ref: awsServiceRoleMatch
                        }
                    ]
                }
            },
            sdlcstacksesverifytestVerifyDomainIdentity1E2BB072: {
                Type: 'Custom::AWS',
                Properties: {
                    ServiceToken: {
                        'Fn::GetAtt': [awsMatch, 'Arn']
                    },
                    Create: '{"service":"SES","action":"verifyDomainIdentity","parameters":{"Domain":"test.dev.example.edu"},"physicalResourceId":{"responsePath":"VerificationToken"}}',
                    Update: '{"service":"SES","action":"verifyDomainIdentity","parameters":{"Domain":"test.dev.example.edu"},"physicalResourceId":{"responsePath":"VerificationToken"}}',
                    Delete: '{"service":"SES","action":"deleteIdentity","parameters":{"Identity":"test.dev.example.edu"}}',
                    InstallLatestAwsSdk: true
                },
                DependsOn: [
                    templateHelper.startsWithMatch('sdlcstacksesverifytestVerifyDomainIdentityCustomResourcePolicy')
                ],
                UpdateReplacePolicy: 'Delete',
                DeletionPolicy: 'Delete'
            },
            sdlcstacksesverifytestSesVerificationRecord3849A670: {
                Type: 'AWS::Route53::RecordSet',
                Properties: {
                    Name: '_amazonses.test.dev.example.edu.',
                    Type: 'TXT',
                    HostedZoneId: 'DUMMY',
                    ResourceRecords: [
                        {
                            'Fn::Join': [
                                '',
                                [
                                    '"',
                                    {
                                        'Fn::GetAtt': [
                                            templateHelper.startsWithMatch('sdlcstacksesverifytestVerifyDomainIdentity'),
                                            'VerificationToken'
                                        ]
                                    },
                                    '"'
                                ]
                            ]
                        }
                    ],
                    TTL: '1800'
                },
                DependsOn: [
                    templateHelper.startsWithMatch('sdlcstacksesverifytestVerifyDomainIdentityCustomResourcePolicy'),
                    templateHelper.startsWithMatch('sdlcstacksesverifytestVerifyDomainIdentity')
                ]
            },
            sdlcstacksesverifytestVerifyDomainDkimCustomResourcePolicyD2C322F9: {
                Type: 'AWS::IAM::Policy',
                Properties: {
                    PolicyDocument: {
                        Statement: [
                            {
                                Action: 'ses:VerifyDomainDkim',
                                Effect: 'Allow',
                                Resource: '*'
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    PolicyName: templateHelper.startsWithMatch('sdlcstacksesverifytestVerifyDomainDkimCustomResourcePolicy'),
                    Roles: [
                        {
                            Ref: awsServiceRoleMatch
                        }
                    ]
                },
                DependsOn: [
                    templateHelper.startsWithMatch('sdlcstacksesverifytestVerifyDomainIdentityCustomResourcePolicy'),
                    templateHelper.startsWithMatch('sdlcstacksesverifytestVerifyDomainIdentity')
                ]
            },
            sdlcstacksesverifytestVerifyDomainDkim14189403: {
                Type: 'Custom::AWS',
                Properties: {
                    ServiceToken: {
                        'Fn::GetAtt': [awsMatch, 'Arn']
                    },
                    Create: '{"service":"SES","action":"verifyDomainDkim","parameters":{"Domain":"test.dev.example.edu"},"physicalResourceId":{"id":"test.dev.example.edu-verify-domain-dkim"}}',
                    Update: '{"service":"SES","action":"verifyDomainDkim","parameters":{"Domain":"test.dev.example.edu"},"physicalResourceId":{"id":"test.dev.example.edu-verify-domain-dkim"}}',
                    InstallLatestAwsSdk: true
                },
                DependsOn: [
                    templateHelper.startsWithMatch('sdlcstacksesverifytestVerifyDomainDkimCustomResourcePolicy'),
                    templateHelper.startsWithMatch('sdlcstacksesverifytestVerifyDomainIdentityCustomResourcePolicy'),
                    templateHelper.startsWithMatch('sdlcstacksesverifytestVerifyDomainIdentity')
                ],
                UpdateReplacePolicy: 'Delete',
                DeletionPolicy: 'Delete'
            },
            sdlcstacksesverifytestSesDkimVerificationRecord0E95ACD62: {
                Type: 'AWS::Route53::RecordSet',
                Properties: {
                    Name: {
                        'Fn::Join': [
                            '',
                            [
                                {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('sdlcstacksesverifytestVerifyDomainDkim'),
                                        'DkimTokens.0'
                                    ]
                                },
                                '._domainkey.test.dev.example.edu.'
                            ]
                        ]
                    },
                    Type: 'CNAME',
                    HostedZoneId: 'DUMMY',
                    ResourceRecords: [
                        {
                            'Fn::Join': [
                                '',
                                [
                                    {
                                        'Fn::GetAtt': [
                                            templateHelper.startsWithMatch('sdlcstacksesverifytestVerifyDomainDkim'),
                                            'DkimTokens.0'
                                        ]
                                    },
                                    '.dkim.amazonses.com'
                                ]
                            ]
                        }
                    ],
                    TTL: '1800'
                },
                DependsOn: [
                    templateHelper.startsWithMatch('sdlcstacksesverifytestVerifyDomainDkimCustomResourcePolicy'),
                    templateHelper.startsWithMatch('sdlcstacksesverifytestVerifyDomainDkim')
                ]
            },
            sdlcstacksesverifytestSesDkimVerificationRecord15521F27C: {
                Type: 'AWS::Route53::RecordSet',
                Properties: {
                    Name: {
                        'Fn::Join': [
                            '',
                            [
                                {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('sdlcstacksesverifytestVerifyDomainDkim'),
                                        'DkimTokens.1'
                                    ]
                                },
                                '._domainkey.test.dev.example.edu.'
                            ]
                        ]
                    },
                    Type: 'CNAME',
                    HostedZoneId: 'DUMMY',
                    ResourceRecords: [
                        {
                            'Fn::Join': [
                                '',
                                [
                                    {
                                        'Fn::GetAtt': [
                                            templateHelper.startsWithMatch('sdlcstacksesverifytestVerifyDomainDkim'),
                                            'DkimTokens.1'
                                        ]
                                    },
                                    '.dkim.amazonses.com'
                                ]
                            ]
                        }
                    ],
                    TTL: '1800'
                },
                DependsOn: [
                    templateHelper.startsWithMatch('sdlcstacksesverifytestVerifyDomainDkimCustomResourcePolicy'),
                    templateHelper.startsWithMatch('sdlcstacksesverifytestVerifyDomainDkim')
                ]
            },
            sdlcstacksesverifytestSesDkimVerificationRecord29FBDB015: {
                Type: 'AWS::Route53::RecordSet',
                Properties: {
                    Name: {
                        'Fn::Join': [
                            '',
                            [
                                {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('sdlcstacksesverifytestVerifyDomainDkim'),
                                        'DkimTokens.2'
                                    ]
                                },
                                '._domainkey.test.dev.example.edu.'
                            ]
                        ]
                    },
                    Type: 'CNAME',
                    HostedZoneId: 'DUMMY',
                    ResourceRecords: [
                        {
                            'Fn::Join': [
                                '',
                                [
                                    {
                                        'Fn::GetAtt': [
                                            templateHelper.startsWithMatch('sdlcstacksesverifytestVerifyDomainDkim'),
                                            'DkimTokens.2'
                                        ]
                                    },
                                    '.dkim.amazonses.com'
                                ]
                            ]
                        }
                    ],
                    TTL: '1800'
                },
                DependsOn: [
                    templateHelper.startsWithMatch('sdlcstacksesverifytestVerifyDomainDkimCustomResourcePolicy'),
                    templateHelper.startsWithMatch('sdlcstacksesverifytestVerifyDomainDkim')
                ]
            },
            AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2: {
                Type: 'AWS::IAM::Role',
                Properties: {
                    AssumeRolePolicyDocument: {
                        Statement: [
                            {
                                Action: 'sts:AssumeRole',
                                Effect: 'Allow',
                                Principal: {Service: 'lambda.amazonaws.com'}
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    ManagedPolicyArns: [
                        {
                            'Fn::Join': [
                                '',
                                [
                                    'arn:',
                                    {Ref: 'AWS::Partition'},
                                    ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole'
                                ]
                            ]
                        }
                    ],
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ]
                }
            },
            AWS679f53fac002430cb0da5b7982bd2287ServiceRoleDefaultPolicyD28E1A5E: {
                Type: 'AWS::IAM::Policy',
                Properties: {
                    PolicyDocument: {
                        Statement: [
                            {
                                Action: 'iam:PassRole',
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('sdlcstacktaskdefcreateruntask0TaskRole'),
                                        'Arn'
                                    ]
                                }
                            },
                            {
                                Action: 'iam:PassRole',
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('sdlcstacktaskdefcreateruntask0execrole'),
                                        'Arn'
                                    ]
                                }
                            },
                            {
                                Action: 'iam:PassRole',
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('sdlcstacktaskdefupdateruntask0TaskRole'),
                                        'Arn'
                                    ]
                                }
                            },
                            {
                                Action: 'iam:PassRole',
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('sdlcstacktaskdefupdateruntask0execrole'),
                                        'Arn'
                                    ]
                                }
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    PolicyName: awsServiceRoleDefaultPolicyMatch,
                    Roles: [
                        {
                            Ref: awsServiceRoleMatch
                        }
                    ]
                }
            },
            AWS679f53fac002430cb0da5b7982bd22872D164C4C: {
                Type: 'AWS::Lambda::Function',
                Properties: {
                    Code: {
                        S3Bucket: 'cdk-hnb659fds-assets-2222-us-west-2',
                        S3Key: zipMatch
                    },
                    Role: {
                        'Fn::GetAtt': [
                            awsServiceRoleMatch,
                            'Arn'
                        ]
                    },
                    Handler: 'index.handler',
                    Runtime: 'nodejs12.x',
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ],
                    Timeout: 120
                },
                DependsOn: [
                    awsServiceRoleDefaultPolicyMatch,
                    awsServiceRoleMatch
                ]
            },
            sdlcstacktgB6898DC5: {
                Type: 'AWS::ElasticLoadBalancingV2::TargetGroup',
                Properties: {
                    HealthCheckPath: '/api/healthz',
                    HealthCheckProtocol: 'HTTP',
                    Name: 'sdlc-stack-tg',
                    Port: 80,
                    Protocol: 'HTTP',
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ],
                    TargetGroupAttributes: [{Key: 'stickiness.enabled', Value: 'false'}],
                    TargetType: 'ip',
                    VpcId: 'vpc-12345'
                }
            },
            sdlcstacklistenerrule100BCBF6621: {
                Type: 'AWS::ElasticLoadBalancingV2::ListenerRule',
                Properties: {
                    Actions: [
                        {
                            TargetGroupArn: {Ref: templateHelper.startsWithMatch('sdlcstacktg')},
                            Type: 'forward'
                        }
                    ],
                    Conditions: [
                        {
                            Field: 'host-header',
                            HostHeaderConfig: {Values: ['test.dev.example.edu']}
                        }
                    ],
                    ListenerArn: 'arn:aws:elasticloadbalancing:us-west-2:123456789012:listener/application/my-load-balancer/50dc6c495c0c9188/f2f7dc8efc522ab2',
                    Priority: 100
                }
            },
            sdlcstackcache23E312EE: {
                Type: 'AWS::DynamoDB::Table',
                Properties: {
                    KeySchema: [{AttributeName: 'key', KeyType: 'HASH'}],
                    AttributeDefinitions: [{AttributeName: 'key', AttributeType: 'S'}],
                    BillingMode: 'PAY_PER_REQUEST',
                    SSESpecification: {SSEEnabled: true},
                    TableName: 'sdlc-stack-cache',
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ]
                },
                UpdateReplacePolicy: 'Delete',
                DeletionPolicy: 'Delete'
            },
            sdlcstackdlqB998AC86: {
                Type: 'AWS::SQS::Queue',
                Properties: {
                    KmsMasterKeyId: 'alias/aws/sqs',
                    MessageRetentionPeriod: 259200,
                    QueueName: 'sdlc-stack-dlq',
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ]
                },
                UpdateReplacePolicy: 'Delete',
                DeletionPolicy: 'Delete'
            },
            sdlcstackqueue5CB6143E: {
                Type: 'AWS::SQS::Queue',
                Properties: {
                    KmsMasterKeyId: 'alias/aws/sqs',
                    QueueName: 'sdlc-stack-queue',
                    RedrivePolicy: {
                        deadLetterTargetArn: {'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstackdlq'), 'Arn']},
                        maxReceiveCount: 3
                    },
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ]
                },
                UpdateReplacePolicy: 'Delete',
                DeletionPolicy: 'Delete'
            },
            sdlcstacks34E44945B: {
                Type: 'AWS::S3::Bucket',
                Properties: {
                    BucketEncryption: {
                        ServerSideEncryptionConfiguration: [
                            {
                                ServerSideEncryptionByDefault: {SSEAlgorithm: 'aws:kms'}
                            }
                        ]
                    },
                    BucketName: 'sdlc-stack-s3',
                    PublicAccessBlockConfiguration: {
                        BlockPublicAcls: true,
                        BlockPublicPolicy: true,
                        IgnorePublicAcls: true,
                        RestrictPublicBuckets: true
                    },
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ]
                },
                UpdateReplacePolicy: 'Retain',
                DeletionPolicy: 'Retain'
            },
            sdlcstacks3PolicyECEFCE92: {
                Type: 'AWS::S3::BucketPolicy',
                Properties: {
                    Bucket: {Ref: templateHelper.startsWithMatch('sdlcstacks3')},
                    PolicyDocument: {
                        Statement: [
                            {
                                Action: 's3:*',
                                Condition: {Bool: {'aws:SecureTransport': 'false'}},
                                Effect: 'Deny',
                                Principal: {AWS: '*'},
                                Resource: [
                                    {'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstacks3'), 'Arn']},
                                    {
                                        'Fn::Join': [
                                            '',
                                            [
                                                {
                                                    'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstacks3'), 'Arn']
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
            sdlcstackclusterC84D7329: {
                Type: 'AWS::ECS::Cluster',
                Properties: {
                    ClusterName: 'sdlc-stack-cluster',
                    ClusterSettings: [{Name: 'containerInsights', Value: 'disabled'}],
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ]
                }
            },
            sdlcstackclusteralarmtopic7DF9AAF5: {
                Type: 'AWS::SNS::Topic',
                Properties: {
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ]
                }
            },
            sdlcstackclusteralarmtopictestexampleedu3541DC19: {
                Type: 'AWS::SNS::Subscription',
                Properties: {
                    Protocol: 'email',
                    TopicArn: {Ref: templateHelper.startsWithMatch('sdlcstackclusteralarmtopic')},
                    Endpoint: 'test@example.edu'
                }
            },
            sdlcstackclustercpualarm46F19F5E: {
                Type: 'AWS::CloudWatch::Alarm',
                Properties: {
                    ComparisonOperator: 'GreaterThanOrEqualToThreshold',
                    EvaluationPeriods: 1,
                    AlarmActions: [{Ref: templateHelper.startsWithMatch('sdlcstackclusteralarmtopic')}],
                    Dimensions: [
                        {
                            Name: 'ClusterName',
                            Value: {Ref: templateHelper.startsWithMatch('sdlcstackcluster')}
                        }
                    ],
                    MetricName: 'CPUUtilization',
                    Namespace: 'AWS/ECS',
                    OKActions: [{Ref: templateHelper.startsWithMatch('sdlcstackclusteralarmtopic')}],
                    Period: 300,
                    Statistic: 'Average',
                    Threshold: 90
                }
            },
            sdlcstackclustermemoryalarm77C15A4F: {
                Type: 'AWS::CloudWatch::Alarm',
                Properties: {
                    ComparisonOperator: 'GreaterThanOrEqualToThreshold',
                    EvaluationPeriods: 1,
                    AlarmActions: [{Ref: templateHelper.startsWithMatch('sdlcstackclusteralarmtopic')}],
                    Dimensions: [
                        {
                            Name: 'ClusterName',
                            Value: {Ref: templateHelper.startsWithMatch('sdlcstackcluster')}
                        }
                    ],
                    MetricName: 'MemoryUtilization',
                    Namespace: 'AWS/ECS',
                    OKActions: [{Ref: templateHelper.startsWithMatch('sdlcstackclusteralarmtopic')}],
                    Period: 300,
                    Statistic: 'Average',
                    Threshold: 90
                }
            },
            sdlcstacktaskdefcreateruntask0execrole12045EA1: {
                Type: 'AWS::IAM::Role',
                Properties: {
                    AssumeRolePolicyDocument: {
                        Statement: [
                            {
                                Action: 'sts:AssumeRole',
                                Effect: 'Allow',
                                Principal: {Service: 'ecs-tasks.amazonaws.com'}
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    RoleName: Match.stringLikeRegexp('^stacksdlcstack.*runtask0execrole.*'),
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ]
                }
            },
            sdlcstacktaskdefcreateruntask0execroleDefaultPolicy09308D6C: {
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
                                Resource: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':ecr:us-east-1:12344:repository/stack/phpfpm'
                                        ]
                                    ]
                                }
                            },
                            {
                                Action: 'ecr:GetAuthorizationToken',
                                Effect: 'Allow',
                                Resource: '*'
                            },
                            {
                                Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('sdlcstackcontainerphpfpmcreateruntaskcrot0loggroup'),
                                        'Arn'
                                    ]
                                }
                            },
                            {
                                Action: [
                                    'secretsmanager:GetSecretValue',
                                    'secretsmanager:DescribeSecret'
                                ],
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':secretsmanager:us-west-2:2222:secret:sdlc-stack-secrets/environment-??????'
                                        ]
                                    ]
                                }
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    PolicyName: templateHelper.startsWithMatch('sdlcstacktaskdefcreateruntask0execroleDefaultPolicy'),
                    Roles: [{Ref: templateHelper.startsWithMatch('sdlcstacktaskdefcreateruntask0execrole')}]
                }
            },
            sdlcstacktaskdefcreateruntask0TaskRoleAECE1908: {
                Type: 'AWS::IAM::Role',
                Properties: {
                    AssumeRolePolicyDocument: {
                        Statement: [
                            {
                                Action: 'sts:AssumeRole',
                                Effect: 'Allow',
                                Principal: {Service: 'ecs-tasks.amazonaws.com'}
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ]
                }
            },
            sdlcstacktaskdefcreateruntask0TaskRoleDefaultPolicyA4CEC6EB: {
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
                                    {'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstacks3'), 'Arn']},
                                    {
                                        'Fn::Join': [
                                            '',
                                            [
                                                {
                                                    'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstacks3'), 'Arn']
                                                },
                                                '/*'
                                            ]
                                        ]
                                    }
                                ]
                            },
                            {
                                Action: ['ses:SendEmail', 'ses:SendRawEmail'],
                                Effect: 'Allow',
                                Resource: '*'
                            },
                            {
                                Action: [
                                    'dynamodb:BatchGetItem',
                                    'dynamodb:GetRecords',
                                    'dynamodb:GetShardIterator',
                                    'dynamodb:Query',
                                    'dynamodb:GetItem',
                                    'dynamodb:Scan',
                                    'dynamodb:ConditionCheckItem',
                                    'dynamodb:BatchWriteItem',
                                    'dynamodb:PutItem',
                                    'dynamodb:UpdateItem',
                                    'dynamodb:DeleteItem',
                                    'dynamodb:DescribeTable'
                                ],
                                Effect: 'Allow',
                                Resource: [
                                    {'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstackcache'), 'Arn']},
                                    {Ref: 'AWS::NoValue'}
                                ]
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    PolicyName: templateHelper.startsWithMatch('sdlcstacktaskdefcreateruntask0TaskRoleDefaultPolicy'),
                    Roles: [{Ref: templateHelper.startsWithMatch('sdlcstacktaskdefcreateruntask0TaskRole')}]
                }
            },
            sdlcstacktaskdefcreateruntask0C250D0F0: {
                Type: 'AWS::ECS::TaskDefinition',
                Properties: {
                    ContainerDefinitions: [
                        {
                            Command: ['/on_create.sh'],
                            Cpu: 256,
                            EntryPoint: ['/bin/sh', '-c'],
                            Environment: [
                                {
                                    Name: 'MAIL_FROM_ADDRESS',
                                    Value: 'no-reply@test.dev.example.edu'
                                },
                                {
                                    Name: 'IMPORTER_FROM',
                                    Value: 'importer-no-reply@test.dev.example.edu'
                                },
                                {
                                    Name: 'DYNAMODB_CACHE_TABLE',
                                    Value: {Ref: templateHelper.startsWithMatch('sdlcstackcache')}
                                },
                                {
                                    Name: 'SQS_QUEUE',
                                    Value: {Ref: templateHelper.startsWithMatch('sdlcstackqueue')}
                                },
                                {
                                    Name: 'AWS_BUCKET',
                                    Value: {Ref: templateHelper.startsWithMatch('sdlcstacks3')}
                                },
                                {Name: 'CAN_RUN_CREATE', Value: '1'}
                            ],
                            Essential: true,
                            Image: {
                                'Fn::Join': [
                                    '',
                                    [
                                        {
                                            'Fn::Select': [
                                                4,
                                                {
                                                    'Fn::Split': [
                                                        ':',
                                                        {
                                                            'Fn::Join': [
                                                                '',
                                                                [
                                                                    'arn:',
                                                                    {Ref: 'AWS::Partition'},
                                                                    ':ecr:us-east-1:12344:repository/stack/phpfpm'
                                                                ]
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        '.dkr.ecr.',
                                        {
                                            'Fn::Select': [
                                                3,
                                                {
                                                    'Fn::Split': [
                                                        ':',
                                                        {
                                                            'Fn::Join': [
                                                                '',
                                                                [
                                                                    'arn:',
                                                                    {Ref: 'AWS::Partition'},
                                                                    ':ecr:us-east-1:12344:repository/stack/phpfpm'
                                                                ]
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        '.',
                                        {Ref: 'AWS::URLSuffix'},
                                        '/stack/phpfpm:stack/phpfpm'
                                    ]
                                ]
                            },
                            LogConfiguration: {
                                LogDriver: 'awslogs',
                                Options: {
                                    'awslogs-group': {
                                        Ref: templateHelper.startsWithMatch('sdlcstackcontainerphpfpmcreateruntaskcrot0loggroup')
                                    },
                                    'awslogs-stream-prefix': 'phpfpm',
                                    'awslogs-region': 'us-west-2'
                                }
                            },
                            Memory: 512,
                            Name: 'sdlc-stack-container-phpfpm-createruntask-crot-0',
                            Secrets: [
                                {
                                    Name: 'FOO',
                                    ValueFrom: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                {Ref: 'AWS::Partition'},
                                                ':secretsmanager:us-west-2:2222:secret:sdlc-stack-secrets/environment:FOO::'
                                            ]
                                        ]
                                    }
                                },
                                {
                                    Name: 'BAR',
                                    ValueFrom: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                {Ref: 'AWS::Partition'},
                                                ':secretsmanager:us-west-2:2222:secret:sdlc-stack-secrets/environment:BAR::'
                                            ]
                                        ]
                                    }
                                }
                            ]
                        }
                    ],
                    Cpu: '256',
                    ExecutionRoleArn: {
                        'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstacktaskdefcreateruntask0execrole'), 'Arn']
                    },
                    Family: 'sdlc-stack-task-def-createruntask-0',
                    Memory: '512',
                    NetworkMode: 'awsvpc',
                    RequiresCompatibilities: ['FARGATE'],
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ],
                    TaskRoleArn: {
                        'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstacktaskdefcreateruntask0TaskRole'), 'Arn']
                    }
                }
            },
            sdlcstackcontainerphpfpmcreateruntaskcrot0loggroup4EE94636: {
                Type: 'AWS::Logs::LogGroup',
                Properties: {
                    LogGroupName: 'sdlc-stack-container-phpfpm-createruntask-crot-0-log-group',
                    RetentionInDays: 30,
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ]
                },
                UpdateReplacePolicy: 'Delete',
                DeletionPolicy: 'Delete'
            },
            sdlcstacktaskcreateruntask0SecurityGroupC27AE768: {
                Type: 'AWS::EC2::SecurityGroup',
                Properties: {
                    GroupDescription: 'stack/sdlc-stack/sdlc-stack-task-createruntask-0/SecurityGroup',
                    SecurityGroupEgress: [
                        {
                            CidrIp: '0.0.0.0/0',
                            Description: 'Allow all outbound traffic by default',
                            IpProtocol: '-1'
                        }
                    ],
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ],
                    VpcId: 'vpc-12345'
                }
            },
            sdlcstacktaskcreateruntask0createfnCustomResourcePolicyB94FE94A: {
                Type: 'AWS::IAM::Policy',
                Properties: {
                    PolicyDocument: {
                        Statement: [
                            {
                                Action: 'ecs:RunTask',
                                Effect: 'Allow',
                                Resource: {Ref: templateHelper.startsWithMatch('sdlcstacktaskdefcreateruntask0')}
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    PolicyName: templateHelper.startsWithMatch('sdlcstacktaskcreateruntask0createfnCustomResourcePolicy'),
                    Roles: [
                        {
                            Ref: awsServiceRoleMatch
                        }
                    ]
                }
            },
            sdlcstacktaskcreateruntask0createfnE2228E60: {
                Type: 'Custom::AWS',
                Properties: {
                    ServiceToken: {
                        'Fn::GetAtt': [awsMatch, 'Arn']
                    },
                    Create: {
                        'Fn::Join': [
                            '',
                            [
                                '{"service":"ECS","action":"runTask","physicalResourceId":{"id":"',
                                {Ref: templateHelper.startsWithMatch('sdlcstacktaskdefcreateruntask0')},
                                '"},"parameters":{"cluster":"',
                                {Ref: templateHelper.startsWithMatch('sdlcstackcluster')},
                                '","taskDefinition":"',
                                {Ref: templateHelper.startsWithMatch('sdlcstacktaskdefcreateruntask0')},
                                '","capacityProviderStrategy":[],"launchType":"FARGATE","platformVersion":"LATEST","networkConfiguration":{"awsvpcConfiguration":{"assignPublicIp":"DISABLED","subnets":["p-12345","p-67890"],"securityGroups":["',
                                {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('sdlcstacktaskcreateruntask0SecurityGroup'),
                                        'GroupId'
                                    ]
                                },
                                '"]}}}}'
                            ]
                        ]
                    },
                    InstallLatestAwsSdk: true
                },
                DependsOn: [
                    templateHelper.startsWithMatch('sdlcstacktaskcreateruntask0createfnCustomResourcePolicy')
                ],
                UpdateReplacePolicy: 'Delete',
                DeletionPolicy: 'Delete'
            },
            sdlcstacktaskdefupdateruntask0execrole92A0A88F: {
                Type: 'AWS::IAM::Role',
                Properties: {
                    AssumeRolePolicyDocument: {
                        Statement: [
                            {
                                Action: 'sts:AssumeRole',
                                Effect: 'Allow',
                                Principal: {Service: 'ecs-tasks.amazonaws.com'}
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    RoleName: Match.stringLikeRegexp('^stacksdlcstack.*runtask0execrole.*'),
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ]
                }
            },
            sdlcstacktaskdefupdateruntask0execroleDefaultPolicy13371C83: {
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
                                Resource: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':ecr:us-east-1:12344:repository/stack/phpfpm'
                                        ]
                                    ]
                                }
                            },
                            {
                                Action: 'ecr:GetAuthorizationToken',
                                Effect: 'Allow',
                                Resource: '*'
                            },
                            {
                                Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('sdlcstackcontainerphpfpmupdateruntaskurot0loggroup'),
                                        'Arn'
                                    ]
                                }
                            },
                            {
                                Action: [
                                    'secretsmanager:GetSecretValue',
                                    'secretsmanager:DescribeSecret'
                                ],
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':secretsmanager:us-west-2:2222:secret:sdlc-stack-secrets/environment-??????'
                                        ]
                                    ]
                                }
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    PolicyName: templateHelper.startsWithMatch('sdlcstacktaskdefupdateruntask0execroleDefaultPolicy'),
                    Roles: [{Ref: templateHelper.startsWithMatch('sdlcstacktaskdefupdateruntask0execrole')}]
                }
            },
            sdlcstacktaskdefupdateruntask0TaskRoleBD733382: {
                Type: 'AWS::IAM::Role',
                Properties: {
                    AssumeRolePolicyDocument: {
                        Statement: [
                            {
                                Action: 'sts:AssumeRole',
                                Effect: 'Allow',
                                Principal: {Service: 'ecs-tasks.amazonaws.com'}
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ]
                }
            },
            sdlcstacktaskdefupdateruntask0TaskRoleDefaultPolicy077B040C: {
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
                                    {'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstacks3'), 'Arn']},
                                    {
                                        'Fn::Join': [
                                            '',
                                            [
                                                {
                                                    'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstacks3'), 'Arn']
                                                },
                                                '/*'
                                            ]
                                        ]
                                    }
                                ]
                            },
                            {
                                Action: ['ses:SendEmail', 'ses:SendRawEmail'],
                                Effect: 'Allow',
                                Resource: '*'
                            },
                            {
                                Action: [
                                    'dynamodb:BatchGetItem',
                                    'dynamodb:GetRecords',
                                    'dynamodb:GetShardIterator',
                                    'dynamodb:Query',
                                    'dynamodb:GetItem',
                                    'dynamodb:Scan',
                                    'dynamodb:ConditionCheckItem',
                                    'dynamodb:BatchWriteItem',
                                    'dynamodb:PutItem',
                                    'dynamodb:UpdateItem',
                                    'dynamodb:DeleteItem',
                                    'dynamodb:DescribeTable'
                                ],
                                Effect: 'Allow',
                                Resource: [
                                    {'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstackcache'), 'Arn']},
                                    {Ref: 'AWS::NoValue'}
                                ]
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    PolicyName: templateHelper.startsWithMatch('sdlcstacktaskdefupdateruntask0TaskRoleDefaultPolicy'),
                    Roles: [{Ref: templateHelper.startsWithMatch('sdlcstacktaskdefupdateruntask0TaskRole')}]
                }
            },
            sdlcstacktaskdefupdateruntask04EC0A180: {
                Type: 'AWS::ECS::TaskDefinition',
                Properties: {
                    ContainerDefinitions: [
                        {
                            Command: ['artisan', 'migrate', '--force'],
                            Cpu: 256,
                            EntryPoint: ['/usr/local/bin/php'],
                            Environment: [
                                {
                                    Name: 'MAIL_FROM_ADDRESS',
                                    Value: 'no-reply@test.dev.example.edu'
                                },
                                {
                                    Name: 'IMPORTER_FROM',
                                    Value: 'importer-no-reply@test.dev.example.edu'
                                },
                                {
                                    Name: 'DYNAMODB_CACHE_TABLE',
                                    Value: {Ref: templateHelper.startsWithMatch('sdlcstackcache')}
                                },
                                {
                                    Name: 'SQS_QUEUE',
                                    Value: {Ref: templateHelper.startsWithMatch('sdlcstackqueue')}
                                },
                                {
                                    Name: 'AWS_BUCKET',
                                    Value: {Ref: templateHelper.startsWithMatch('sdlcstacks3')}
                                },
                                {Name: 'CAN_RUN_CREATE', Value: '1'}
                            ],
                            Essential: true,
                            Image: {
                                'Fn::Join': [
                                    '',
                                    [
                                        {
                                            'Fn::Select': [
                                                4,
                                                {
                                                    'Fn::Split': [
                                                        ':',
                                                        {
                                                            'Fn::Join': [
                                                                '',
                                                                [
                                                                    'arn:',
                                                                    {Ref: 'AWS::Partition'},
                                                                    ':ecr:us-east-1:12344:repository/stack/phpfpm'
                                                                ]
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        '.dkr.ecr.',
                                        {
                                            'Fn::Select': [
                                                3,
                                                {
                                                    'Fn::Split': [
                                                        ':',
                                                        {
                                                            'Fn::Join': [
                                                                '',
                                                                [
                                                                    'arn:',
                                                                    {Ref: 'AWS::Partition'},
                                                                    ':ecr:us-east-1:12344:repository/stack/phpfpm'
                                                                ]
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        '.',
                                        {Ref: 'AWS::URLSuffix'},
                                        '/stack/phpfpm:stack/phpfpm'
                                    ]
                                ]
                            },
                            LogConfiguration: {
                                LogDriver: 'awslogs',
                                Options: {
                                    'awslogs-group': {
                                        Ref: templateHelper.startsWithMatch('sdlcstackcontainerphpfpmupdateruntaskurot0loggroup')
                                    },
                                    'awslogs-stream-prefix': 'phpfpm',
                                    'awslogs-region': 'us-west-2'
                                }
                            },
                            Memory: 512,
                            Name: 'sdlc-stack-container-phpfpm-updateruntask-urot-0',
                            Secrets: [
                                {
                                    Name: 'FOO',
                                    ValueFrom: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                {Ref: 'AWS::Partition'},
                                                ':secretsmanager:us-west-2:2222:secret:sdlc-stack-secrets/environment:FOO::'
                                            ]
                                        ]
                                    }
                                },
                                {
                                    Name: 'BAR',
                                    ValueFrom: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                {Ref: 'AWS::Partition'},
                                                ':secretsmanager:us-west-2:2222:secret:sdlc-stack-secrets/environment:BAR::'
                                            ]
                                        ]
                                    }
                                }
                            ]
                        }
                    ],
                    Cpu: '256',
                    ExecutionRoleArn: {
                        'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstacktaskdefupdateruntask0execrole'), 'Arn']
                    },
                    Family: 'sdlc-stack-task-def-updateruntask-0',
                    Memory: '512',
                    NetworkMode: 'awsvpc',
                    RequiresCompatibilities: ['FARGATE'],
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ],
                    TaskRoleArn: {
                        'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstacktaskdefupdateruntask0TaskRole'), 'Arn']
                    }
                }
            },
            sdlcstackcontainerphpfpmupdateruntaskurot0loggroup3814CEF3: {
                Type: 'AWS::Logs::LogGroup',
                Properties: {
                    LogGroupName: 'sdlc-stack-container-phpfpm-updateruntask-urot-0-log-group',
                    RetentionInDays: 30,
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ]
                },
                UpdateReplacePolicy: 'Delete',
                DeletionPolicy: 'Delete'
            },
            sdlcstacktaskupdateruntask0SecurityGroup18F42937: {
                Type: 'AWS::EC2::SecurityGroup',
                Properties: {
                    GroupDescription: 'stack/sdlc-stack/sdlc-stack-task-updateruntask-0/SecurityGroup',
                    SecurityGroupEgress: [
                        {
                            CidrIp: '0.0.0.0/0',
                            Description: 'Allow all outbound traffic by default',
                            IpProtocol: '-1'
                        }
                    ],
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ],
                    VpcId: 'vpc-12345'
                }
            },
            sdlcstacktaskupdateruntask0updatefnCustomResourcePolicyE140266E: {
                Type: 'AWS::IAM::Policy',
                Properties: {
                    PolicyDocument: {
                        Statement: [
                            {
                                Action: 'ecs:RunTask',
                                Effect: 'Allow',
                                Resource: {Ref: templateHelper.startsWithMatch('sdlcstacktaskdefupdateruntask0')}
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    PolicyName: templateHelper.startsWithMatch('sdlcstacktaskupdateruntask0updatefnCustomResourcePolicy'),
                    Roles: [
                        {
                            Ref: awsServiceRoleMatch
                        }
                    ]
                }
            },
            sdlcstacktaskupdateruntask0updatefn99888DCD: {
                Type: 'Custom::AWS',
                Properties: {
                    ServiceToken: {
                        'Fn::GetAtt': [awsMatch, 'Arn']
                    },
                    Create: {
                        'Fn::Join': [
                            '',
                            [
                                '{"service":"ECS","action":"runTask","physicalResourceId":{"id":"',
                                {Ref: templateHelper.startsWithMatch('sdlcstacktaskdefupdateruntask0')},
                                '"},"parameters":{"cluster":"',
                                {Ref: templateHelper.startsWithMatch('sdlcstackcluster')},
                                '","taskDefinition":"',
                                {Ref: templateHelper.startsWithMatch('sdlcstacktaskdefupdateruntask0')},
                                '","capacityProviderStrategy":[],"launchType":"FARGATE","platformVersion":"LATEST","networkConfiguration":{"awsvpcConfiguration":{"assignPublicIp":"DISABLED","subnets":["p-12345","p-67890"],"securityGroups":["',
                                {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('sdlcstacktaskupdateruntask0SecurityGroup'),
                                        'GroupId'
                                    ]
                                },
                                '"]}}}}'
                            ]
                        ]
                    },
                    Update: {
                        'Fn::Join': [
                            '',
                            [
                                '{"service":"ECS","action":"runTask","physicalResourceId":{"id":"',
                                {Ref: templateHelper.startsWithMatch('sdlcstacktaskdefupdateruntask0')},
                                '"},"parameters":{"cluster":"',
                                {Ref: templateHelper.startsWithMatch('sdlcstackcluster')},
                                '","taskDefinition":"',
                                {Ref: templateHelper.startsWithMatch('sdlcstacktaskdefupdateruntask0')},
                                '","capacityProviderStrategy":[],"launchType":"FARGATE","platformVersion":"LATEST","networkConfiguration":{"awsvpcConfiguration":{"assignPublicIp":"DISABLED","subnets":["p-12345","p-67890"],"securityGroups":["',
                                {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('sdlcstacktaskupdateruntask0SecurityGroup'),
                                        'GroupId'
                                    ]
                                },
                                '"]}}}}'
                            ]
                        ]
                    },
                    InstallLatestAwsSdk: true
                },
                DependsOn: [
                    templateHelper.startsWithMatch('sdlcstacktaskupdateruntask0updatefnCustomResourcePolicy')
                ],
                UpdateReplacePolicy: 'Delete',
                DeletionPolicy: 'Delete'
            },
            sdlcstacktaskdefscheduledtask0execroleA22CBF1D: {
                Type: 'AWS::IAM::Role',
                Properties: {
                    AssumeRolePolicyDocument: {
                        Statement: [
                            {
                                Action: 'sts:AssumeRole',
                                Effect: 'Allow',
                                Principal: {Service: 'ecs-tasks.amazonaws.com'}
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    RoleName: Match.stringLikeRegexp('^stacksdlcstack.*task0execrole.*'),
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ]
                }
            },
            sdlcstacktaskdefscheduledtask0execroleDefaultPolicy3B3D9945: {
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
                                Resource: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':ecr:us-east-1:12344:repository/stack/phpfpm'
                                        ]
                                    ]
                                }
                            },
                            {
                                Action: 'ecr:GetAuthorizationToken',
                                Effect: 'Allow',
                                Resource: '*'
                            },
                            {
                                Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('sdlcstackcontainerphpfpmscheduledtaskst0loggroup'),
                                        'Arn'
                                    ]
                                }
                            },
                            {
                                Action: [
                                    'secretsmanager:GetSecretValue',
                                    'secretsmanager:DescribeSecret'
                                ],
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':secretsmanager:us-west-2:2222:secret:sdlc-stack-secrets/environment-??????'
                                        ]
                                    ]
                                }
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    PolicyName: templateHelper.startsWithMatch('sdlcstacktaskdefscheduledtask0execroleDefaultPolicy'),
                    Roles: [{Ref: templateHelper.startsWithMatch('sdlcstacktaskdefscheduledtask0execrole')}]
                }
            },
            sdlcstacktaskdefscheduledtask0TaskRole0C126AE2: {
                Type: 'AWS::IAM::Role',
                Properties: {
                    AssumeRolePolicyDocument: {
                        Statement: [
                            {
                                Action: 'sts:AssumeRole',
                                Effect: 'Allow',
                                Principal: {Service: 'ecs-tasks.amazonaws.com'}
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ]
                }
            },
            sdlcstacktaskdefscheduledtask0TaskRoleDefaultPolicy42EAA242: {
                Type: 'AWS::IAM::Policy',
                Properties: {
                    PolicyDocument: {
                        Statement: [
                            {
                                Action: [
                                    'sqs:SendMessage',
                                    'sqs:GetQueueAttributes',
                                    'sqs:GetQueueUrl'
                                ],
                                Effect: 'Allow',
                                Resource: {'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstackqueue'), 'Arn']}
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
                                    {'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstacks3'), 'Arn']},
                                    {
                                        'Fn::Join': [
                                            '',
                                            [
                                                {
                                                    'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstacks3'), 'Arn']
                                                },
                                                '/*'
                                            ]
                                        ]
                                    }
                                ]
                            },
                            {
                                Action: ['ses:SendEmail', 'ses:SendRawEmail'],
                                Effect: 'Allow',
                                Resource: '*'
                            },
                            {
                                Action: [
                                    'dynamodb:BatchGetItem',
                                    'dynamodb:GetRecords',
                                    'dynamodb:GetShardIterator',
                                    'dynamodb:Query',
                                    'dynamodb:GetItem',
                                    'dynamodb:Scan',
                                    'dynamodb:ConditionCheckItem',
                                    'dynamodb:BatchWriteItem',
                                    'dynamodb:PutItem',
                                    'dynamodb:UpdateItem',
                                    'dynamodb:DeleteItem',
                                    'dynamodb:DescribeTable'
                                ],
                                Effect: 'Allow',
                                Resource: [
                                    {'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstackcache'), 'Arn']},
                                    {Ref: 'AWS::NoValue'}
                                ]
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    PolicyName: templateHelper.startsWithMatch('sdlcstacktaskdefscheduledtask0TaskRoleDefaultPolicy'),
                    Roles: [{Ref: templateHelper.startsWithMatch('sdlcstacktaskdefscheduledtask0TaskRole')}]
                }
            },
            sdlcstacktaskdefscheduledtask0E3775E7B: {
                Type: 'AWS::ECS::TaskDefinition',
                Properties: {
                    ContainerDefinitions: [
                        {
                            Command: ['artisan', 'catalyst:daily'],
                            Cpu: 256,
                            EntryPoint: ['/usr/local/bin/php'],
                            Environment: [
                                {
                                    Name: 'MAIL_FROM_ADDRESS',
                                    Value: 'no-reply@test.dev.example.edu'
                                },
                                {
                                    Name: 'IMPORTER_FROM',
                                    Value: 'importer-no-reply@test.dev.example.edu'
                                },
                                {
                                    Name: 'DYNAMODB_CACHE_TABLE',
                                    Value: {Ref: templateHelper.startsWithMatch('sdlcstackcache')}
                                },
                                {
                                    Name: 'SQS_QUEUE',
                                    Value: {Ref: templateHelper.startsWithMatch('sdlcstackqueue')}
                                },
                                {
                                    Name: 'AWS_BUCKET',
                                    Value: {Ref: templateHelper.startsWithMatch('sdlcstacks3')}
                                },
                                {Name: 'CAN_RUN_CREATE', Value: '1'}
                            ],
                            Essential: true,
                            Image: {
                                'Fn::Join': [
                                    '',
                                    [
                                        {
                                            'Fn::Select': [
                                                4,
                                                {
                                                    'Fn::Split': [
                                                        ':',
                                                        {
                                                            'Fn::Join': [
                                                                '',
                                                                [
                                                                    'arn:',
                                                                    {Ref: 'AWS::Partition'},
                                                                    ':ecr:us-east-1:12344:repository/stack/phpfpm'
                                                                ]
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        '.dkr.ecr.',
                                        {
                                            'Fn::Select': [
                                                3,
                                                {
                                                    'Fn::Split': [
                                                        ':',
                                                        {
                                                            'Fn::Join': [
                                                                '',
                                                                [
                                                                    'arn:',
                                                                    {Ref: 'AWS::Partition'},
                                                                    ':ecr:us-east-1:12344:repository/stack/phpfpm'
                                                                ]
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        '.',
                                        {Ref: 'AWS::URLSuffix'},
                                        '/stack/phpfpm:stack/phpfpm'
                                    ]
                                ]
                            },
                            LogConfiguration: {
                                LogDriver: 'awslogs',
                                Options: {
                                    'awslogs-group': {
                                        Ref: templateHelper.startsWithMatch('sdlcstackcontainerphpfpmscheduledtaskst0loggroup')
                                    },
                                    'awslogs-stream-prefix': 'phpfpm',
                                    'awslogs-region': 'us-west-2'
                                }
                            },
                            Memory: 512,
                            Name: 'sdlc-stack-container-phpfpm-scheduledtask-st-0',
                            Secrets: [
                                {
                                    Name: 'FOO',
                                    ValueFrom: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                {Ref: 'AWS::Partition'},
                                                ':secretsmanager:us-west-2:2222:secret:sdlc-stack-secrets/environment:FOO::'
                                            ]
                                        ]
                                    }
                                },
                                {
                                    Name: 'BAR',
                                    ValueFrom: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                {Ref: 'AWS::Partition'},
                                                ':secretsmanager:us-west-2:2222:secret:sdlc-stack-secrets/environment:BAR::'
                                            ]
                                        ]
                                    }
                                }
                            ]
                        }
                    ],
                    Cpu: '256',
                    ExecutionRoleArn: {
                        'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstacktaskdefscheduledtask0execrole'), 'Arn']
                    },
                    Family: 'sdlc-stack-task-def-scheduledtask-0',
                    Memory: '512',
                    NetworkMode: 'awsvpc',
                    RequiresCompatibilities: ['FARGATE'],
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ],
                    TaskRoleArn: {
                        'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstacktaskdefscheduledtask0TaskRole'), 'Arn']
                    }
                }
            },
            sdlcstacktaskdefscheduledtask0EventsRoleF5629A19: {
                Type: 'AWS::IAM::Role',
                Properties: {
                    AssumeRolePolicyDocument: {
                        Statement: [
                            {
                                Action: 'sts:AssumeRole',
                                Effect: 'Allow',
                                Principal: {Service: 'events.amazonaws.com'}
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ]
                }
            },
            sdlcstacktaskdefscheduledtask0EventsRoleDefaultPolicy70740529: {
                Type: 'AWS::IAM::Policy',
                Properties: {
                    PolicyDocument: {
                        Statement: [
                            {
                                Action: 'ecs:RunTask',
                                Condition: {
                                    ArnEquals: {
                                        'ecs:cluster': {
                                            'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstackcluster'), 'Arn']
                                        }
                                    }
                                },
                                Effect: 'Allow',
                                Resource: {Ref: templateHelper.startsWithMatch('sdlcstacktaskdefscheduledtask0')}
                            },
                            {
                                Action: 'iam:PassRole',
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('sdlcstacktaskdefscheduledtask0execrole'),
                                        'Arn'
                                    ]
                                }
                            },
                            {
                                Action: 'iam:PassRole',
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('sdlcstacktaskdefscheduledtask0TaskRole'),
                                        'Arn'
                                    ]
                                }
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    PolicyName: templateHelper.startsWithMatch('sdlcstacktaskdefscheduledtask0EventsRoleDefaultPolicy'),
                    Roles: [
                        {Ref: templateHelper.startsWithMatch('sdlcstacktaskdefscheduledtask0EventsRole')}
                    ]
                }
            },
            sdlcstacktaskdefscheduledtask0SecurityGroup82FD712E: {
                Type: 'AWS::EC2::SecurityGroup',
                Properties: {
                    GroupDescription: 'stack/sdlc-stack/sdlc-stack-task-def-scheduledtask-0/SecurityGroup',
                    SecurityGroupEgress: [
                        {
                            CidrIp: '0.0.0.0/0',
                            Description: 'Allow all outbound traffic by default',
                            IpProtocol: '-1'
                        }
                    ],
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ],
                    VpcId: 'vpc-12345'
                }
            },
            sdlcstackcontainerphpfpmscheduledtaskst0loggroup44B9D0E4: {
                Type: 'AWS::Logs::LogGroup',
                Properties: {
                    LogGroupName: 'sdlc-stack-container-phpfpm-scheduledtask-st-0-log-group',
                    RetentionInDays: 30,
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ]
                },
                UpdateReplacePolicy: 'Delete',
                DeletionPolicy: 'Delete'
            },
            sdlcstacktaskscheduledtask0ScheduledEventRule46A9F4AE: {
                Type: 'AWS::Events::Rule',
                Properties: {
                    Name: 'sdlc-stack-task-scheduledtask-0',
                    ScheduleExpression: 'cron(0 12 * * ? *)',
                    State: 'ENABLED',
                    Targets: [
                        {
                            Arn: {'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstackcluster'), 'Arn']},
                            EcsParameters: {
                                LaunchType: 'FARGATE',
                                NetworkConfiguration: {
                                    AwsVpcConfiguration: {
                                        AssignPublicIp: 'DISABLED',
                                        SecurityGroups: [
                                            {
                                                'Fn::GetAtt': [
                                                    templateHelper.startsWithMatch('sdlcstacktaskdefscheduledtask0SecurityGroup'),
                                                    'GroupId'
                                                ]
                                            }
                                        ],
                                        Subnets: ['p-12345', 'p-67890']
                                    }
                                },
                                PlatformVersion: 'LATEST',
                                TaskCount: 1,
                                TaskDefinitionArn: {Ref: templateHelper.startsWithMatch('sdlcstacktaskdefscheduledtask0')}
                            },
                            Id: 'Target0',
                            Input: '{}',
                            RoleArn: {
                                'Fn::GetAtt': [
                                    templateHelper.startsWithMatch('sdlcstacktaskdefscheduledtask0EventsRole'),
                                    'Arn'
                                ]
                            }
                        }
                    ]
                }
            },
            sdlcstacktaskdefweb0execrole5521DF49: {
                Type: 'AWS::IAM::Role',
                Properties: {
                    AssumeRolePolicyDocument: {
                        Statement: [
                            {
                                Action: 'sts:AssumeRole',
                                Effect: 'Allow',
                                Principal: {Service: 'ecs-tasks.amazonaws.com'}
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    RoleName: Match.stringLikeRegexp('^stacksdlcstack.*web0execrole.*'),
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ]
                }
            },
            sdlcstacktaskdefweb0execroleDefaultPolicyF071B2C2: {
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
                                Resource: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':ecr:us-east-1:12344:repository/stack/nginx'
                                        ]
                                    ]
                                }
                            },
                            {
                                Action: 'ecr:GetAuthorizationToken',
                                Effect: 'Allow',
                                Resource: '*'
                            },
                            {
                                Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('sdlcstackcontainernginxwebu0loggroup'),
                                        'Arn'
                                    ]
                                }
                            },
                            {
                                Action: [
                                    'ecr:BatchCheckLayerAvailability',
                                    'ecr:GetDownloadUrlForLayer',
                                    'ecr:BatchGetImage'
                                ],
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':ecr:us-east-1:12344:repository/stack/phpfpm'
                                        ]
                                    ]
                                }
                            },
                            {
                                Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('sdlcstackcontainerphpfpmwebu0loggroup'),
                                        'Arn'
                                    ]
                                }
                            },
                            {
                                Action: [
                                    'secretsmanager:GetSecretValue',
                                    'secretsmanager:DescribeSecret'
                                ],
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':secretsmanager:us-west-2:2222:secret:sdlc-stack-secrets/environment-??????'
                                        ]
                                    ]
                                }
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    PolicyName: templateHelper.startsWithMatch('sdlcstacktaskdefweb0execroleDefaultPolicy'),
                    Roles: [{Ref: templateHelper.startsWithMatch('sdlcstacktaskdefweb0execrole')}]
                }
            },
            sdlcstacktaskdefweb0TaskRole4E559BCA: {
                Type: 'AWS::IAM::Role',
                Properties: {
                    AssumeRolePolicyDocument: {
                        Statement: [
                            {
                                Action: 'sts:AssumeRole',
                                Effect: 'Allow',
                                Principal: {Service: 'ecs-tasks.amazonaws.com'}
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ]
                }
            },
            sdlcstacktaskdefweb0TaskRoleDefaultPolicyAB528690: {
                Type: 'AWS::IAM::Policy',
                Properties: {
                    PolicyDocument: {
                        Statement: [
                            {
                                Action: [
                                    'ssmmessages:CreateControlChannel',
                                    'ssmmessages:CreateDataChannel',
                                    'ssmmessages:OpenControlChannel',
                                    'ssmmessages:OpenDataChannel'
                                ],
                                Effect: 'Allow',
                                Resource: '*'
                            },
                            {
                                Action: 'logs:DescribeLogGroups',
                                Effect: 'Allow',
                                Resource: '*'
                            },
                            {
                                Action: [
                                    'logs:CreateLogStream',
                                    'logs:DescribeLogStreams',
                                    'logs:PutLogEvents'
                                ],
                                Effect: 'Allow',
                                Resource: '*'
                            },
                            {
                                Action: [
                                    'sqs:SendMessage',
                                    'sqs:GetQueueAttributes',
                                    'sqs:GetQueueUrl'
                                ],
                                Effect: 'Allow',
                                Resource: {'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstackqueue'), 'Arn']}
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
                                    {'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstacks3'), 'Arn']},
                                    {
                                        'Fn::Join': [
                                            '',
                                            [
                                                {
                                                    'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstacks3'), 'Arn']
                                                },
                                                '/*'
                                            ]
                                        ]
                                    }
                                ]
                            },
                            {
                                Action: ['ses:SendEmail', 'ses:SendRawEmail'],
                                Effect: 'Allow',
                                Resource: '*'
                            },
                            {
                                Action: [
                                    'dynamodb:BatchGetItem',
                                    'dynamodb:GetRecords',
                                    'dynamodb:GetShardIterator',
                                    'dynamodb:Query',
                                    'dynamodb:GetItem',
                                    'dynamodb:Scan',
                                    'dynamodb:ConditionCheckItem',
                                    'dynamodb:BatchWriteItem',
                                    'dynamodb:PutItem',
                                    'dynamodb:UpdateItem',
                                    'dynamodb:DeleteItem',
                                    'dynamodb:DescribeTable'
                                ],
                                Effect: 'Allow',
                                Resource: [
                                    {'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstackcache'), 'Arn']},
                                    {Ref: 'AWS::NoValue'}
                                ]
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    PolicyName: templateHelper.startsWithMatch('sdlcstacktaskdefweb0TaskRoleDefaultPolicy'),
                    Roles: [{Ref: templateHelper.startsWithMatch('sdlcstacktaskdefweb0TaskRole')}]
                }
            },
            sdlcstacktaskdefweb0399B538F: {
                Type: 'AWS::ECS::TaskDefinition',
                Properties: {
                    ContainerDefinitions: [
                        {
                            Cpu: 64,
                            Essential: true,
                            Image: {
                                'Fn::Join': [
                                    '',
                                    [
                                        {
                                            'Fn::Select': [
                                                4,
                                                {
                                                    'Fn::Split': [
                                                        ':',
                                                        {
                                                            'Fn::Join': [
                                                                '',
                                                                [
                                                                    'arn:',
                                                                    {Ref: 'AWS::Partition'},
                                                                    ':ecr:us-east-1:12344:repository/stack/nginx'
                                                                ]
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        '.dkr.ecr.',
                                        {
                                            'Fn::Select': [
                                                3,
                                                {
                                                    'Fn::Split': [
                                                        ':',
                                                        {
                                                            'Fn::Join': [
                                                                '',
                                                                [
                                                                    'arn:',
                                                                    {Ref: 'AWS::Partition'},
                                                                    ':ecr:us-east-1:12344:repository/stack/nginx'
                                                                ]
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        '.',
                                        {Ref: 'AWS::URLSuffix'},
                                        '/stack/nginx:stack/nginx'
                                    ]
                                ]
                            },
                            LogConfiguration: {
                                LogDriver: 'awslogs',
                                Options: {
                                    'awslogs-group': {
                                        Ref: templateHelper.startsWithMatch('sdlcstackcontainernginxwebu0loggroup')
                                    },
                                    'awslogs-stream-prefix': 'nginx',
                                    'awslogs-region': 'us-west-2'
                                }
                            },
                            Memory: 64,
                            Name: 'sdlc-stack-container-nginx-web-u-0',
                            PortMappings: [{ContainerPort: 80, Protocol: 'tcp'}],
                            Secrets: []
                        },
                        {
                            Cpu: 128,
                            Environment: [
                                {
                                    Name: 'MAIL_FROM_ADDRESS',
                                    Value: 'no-reply@test.dev.example.edu'
                                },
                                {
                                    Name: 'IMPORTER_FROM',
                                    Value: 'importer-no-reply@test.dev.example.edu'
                                },
                                {
                                    Name: 'DYNAMODB_CACHE_TABLE',
                                    Value: {Ref: templateHelper.startsWithMatch('sdlcstackcache')}
                                },
                                {
                                    Name: 'SQS_QUEUE',
                                    Value: {Ref: templateHelper.startsWithMatch('sdlcstackqueue')}
                                },
                                {
                                    Name: 'AWS_BUCKET',
                                    Value: {Ref: templateHelper.startsWithMatch('sdlcstacks3')}
                                },
                                {Name: 'CAN_RUN_CREATE', Value: '1'}
                            ],
                            Essential: true,
                            Image: {
                                'Fn::Join': [
                                    '',
                                    [
                                        {
                                            'Fn::Select': [
                                                4,
                                                {
                                                    'Fn::Split': [
                                                        ':',
                                                        {
                                                            'Fn::Join': [
                                                                '',
                                                                [
                                                                    'arn:',
                                                                    {Ref: 'AWS::Partition'},
                                                                    ':ecr:us-east-1:12344:repository/stack/phpfpm'
                                                                ]
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        '.dkr.ecr.',
                                        {
                                            'Fn::Select': [
                                                3,
                                                {
                                                    'Fn::Split': [
                                                        ':',
                                                        {
                                                            'Fn::Join': [
                                                                '',
                                                                [
                                                                    'arn:',
                                                                    {Ref: 'AWS::Partition'},
                                                                    ':ecr:us-east-1:12344:repository/stack/phpfpm'
                                                                ]
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        '.',
                                        {Ref: 'AWS::URLSuffix'},
                                        '/stack/phpfpm:stack/phpfpm'
                                    ]
                                ]
                            },
                            LogConfiguration: {
                                LogDriver: 'awslogs',
                                Options: {
                                    'awslogs-group': {
                                        Ref: templateHelper.startsWithMatch('sdlcstackcontainerphpfpmwebu0loggroup')
                                    },
                                    'awslogs-stream-prefix': 'phpfpm',
                                    'awslogs-region': 'us-west-2'
                                }
                            },
                            Memory: 128,
                            Name: 'sdlc-stack-container-phpfpm-web-u-0',
                            PortMappings: [{ContainerPort: 9000, Protocol: 'tcp'}],
                            Secrets: [
                                {
                                    Name: 'FOO',
                                    ValueFrom: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                {Ref: 'AWS::Partition'},
                                                ':secretsmanager:us-west-2:2222:secret:sdlc-stack-secrets/environment:FOO::'
                                            ]
                                        ]
                                    }
                                },
                                {
                                    Name: 'BAR',
                                    ValueFrom: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                {Ref: 'AWS::Partition'},
                                                ':secretsmanager:us-west-2:2222:secret:sdlc-stack-secrets/environment:BAR::'
                                            ]
                                        ]
                                    }
                                }
                            ]
                        }
                    ],
                    Cpu: '512',
                    ExecutionRoleArn: {
                        'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstacktaskdefweb0execrole'), 'Arn']
                    },
                    Family: 'sdlc-stack-task-def-web-0',
                    Memory: '1024',
                    NetworkMode: 'awsvpc',
                    RequiresCompatibilities: ['FARGATE'],
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ],
                    TaskRoleArn: {
                        'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstacktaskdefweb0TaskRole'), 'Arn']
                    }
                }
            },
            sdlcstackcontainernginxwebu0loggroup97CBCF6E: {
                Type: 'AWS::Logs::LogGroup',
                Properties: {
                    LogGroupName: 'sdlc-stack-container-nginx-web-u-0-log-group',
                    RetentionInDays: 30,
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ]
                },
                UpdateReplacePolicy: 'Delete',
                DeletionPolicy: 'Delete'
            },
            sdlcstackcontainerphpfpmwebu0loggroupC0271501: {
                Type: 'AWS::Logs::LogGroup',
                Properties: {
                    LogGroupName: 'sdlc-stack-container-phpfpm-web-u-0-log-group',
                    RetentionInDays: 30,
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ]
                },
                UpdateReplacePolicy: 'Delete',
                DeletionPolicy: 'Delete'
            },
            sdlcstackserviceweb0Service08B0E98B: {
                Type: 'AWS::ECS::Service',
                Properties: {
                    Cluster: {Ref: templateHelper.startsWithMatch('sdlcstackcluster')},
                    DeploymentConfiguration: {MaximumPercent: 200, MinimumHealthyPercent: 50},
                    DesiredCount: 1,
                    EnableECSManagedTags: false,
                    EnableExecuteCommand: true,
                    HealthCheckGracePeriodSeconds: 60,
                    LaunchType: 'FARGATE',
                    LoadBalancers: [
                        {
                            ContainerName: 'sdlc-stack-container-nginx-web-u-0',
                            ContainerPort: 80,
                            TargetGroupArn: {Ref: templateHelper.startsWithMatch('sdlcstacktg')}
                        }
                    ],
                    NetworkConfiguration: {
                        AwsvpcConfiguration: {
                            AssignPublicIp: 'DISABLED',
                            SecurityGroups: [
                                {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('sdlcstackserviceweb0SecurityGroup'),
                                        'GroupId'
                                    ]
                                }
                            ],
                            Subnets: ['p-12345', 'p-67890']
                        }
                    },
                    PlatformVersion: 'LATEST',
                    ServiceName: 'sdlc-stack-service-web-0',
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ],
                    TaskDefinition: {Ref: templateHelper.startsWithMatch('sdlcstacktaskdefweb0')}
                },
                DependsOn: [templateHelper.startsWithMatch('sdlcstacklistenerrule100')]
            },
            sdlcstackserviceweb0SecurityGroupB8D2F2B4: {
                Type: 'AWS::EC2::SecurityGroup',
                Properties: {
                    GroupDescription: 'stack/sdlc-stack/sdlc-stack-service-web-0/SecurityGroup',
                    SecurityGroupEgress: [
                        {
                            CidrIp: '0.0.0.0/0',
                            Description: 'Allow all outbound traffic by default',
                            IpProtocol: '-1'
                        }
                    ],
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ],
                    VpcId: 'vpc-12345'
                }
            },
            sdlcstackserviceweb0SecurityGroupfromstacksdlcstacklookuphttpslistenerSecurityGroupsg1234567890129F2327FA80ECAA6CDA: {
                Type: 'AWS::EC2::SecurityGroupIngress',
                Properties: {
                    IpProtocol: 'tcp',
                    Description: 'Load balancer to target',
                    FromPort: 80,
                    GroupId: {
                        'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstackserviceweb0SecurityGroup'), 'GroupId']
                    },
                    SourceSecurityGroupId: 'sg-12345',
                    ToPort: 80
                }
            },
            sdlcstackserviceweb0TaskCountTarget9F88A631: {
                Type: 'AWS::ApplicationAutoScaling::ScalableTarget',
                Properties: {
                    MaxCapacity: 3,
                    MinCapacity: 1,
                    ResourceId: {
                        'Fn::Join': [
                            '',
                            [
                                'service/',
                                {Ref: templateHelper.startsWithMatch('sdlcstackcluster')},
                                '/',
                                {
                                    'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstackserviceweb0Service'), 'Name']
                                }
                            ]
                        ]
                    },
                    RoleARN: {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                {Ref: 'AWS::Partition'},
                                ':iam::2222:role/aws-service-role/ecs.application-autoscaling.amazonaws.com/AWSServiceRoleForApplicationAutoScaling_ECSService'
                            ]
                        ]
                    },
                    ScalableDimension: 'ecs:service:DesiredCount',
                    ServiceNamespace: 'ecs'
                }
            },
            sdlcstackserviceweb0TaskCountTargetsdlcstackservicescalecpu0366CB10: {
                Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
                Properties: {
                    PolicyName: templateHelper.startsWithMatch('stacksdlcstacksdlcstackserviceweb0TaskCountTargetsdlcstackservicescalecpu'),
                    PolicyType: 'TargetTrackingScaling',
                    ScalingTargetId: {Ref: templateHelper.startsWithMatch('sdlcstackserviceweb0TaskCountTarget')},
                    TargetTrackingScalingPolicyConfiguration: {
                        PredefinedMetricSpecification: {PredefinedMetricType: 'ECSServiceAverageCPUUtilization'},
                        TargetValue: 75
                    }
                }
            },
            sdlcstackserviceweb0TaskCountTargetsdlcstackservicescalememB65D5C3D: {
                Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
                Properties: {
                    PolicyName: templateHelper.startsWithMatch('stacksdlcstacksdlcstackserviceweb0TaskCountTargetsdlcstackservicescalemem'),
                    PolicyType: 'TargetTrackingScaling',
                    ScalingTargetId: {Ref: templateHelper.startsWithMatch('sdlcstackserviceweb0TaskCountTarget')},
                    TargetTrackingScalingPolicyConfiguration: {
                        PredefinedMetricSpecification: {
                            PredefinedMetricType: 'ECSServiceAverageMemoryUtilization'
                        },
                        TargetValue: 75
                    }
                }
            },
            sdlcstackservicequeue0loggroup25FBA60B: {
                Type: 'AWS::Logs::LogGroup',
                Properties: {
                    LogGroupName: 'sdlc-stack-service-queue-0-log-group',
                    RetentionInDays: 30,
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ]
                },
                UpdateReplacePolicy: 'Delete',
                DeletionPolicy: 'Delete'
            },
            sdlcstackservicequeue0EcsProcessingDeadLetterQueue5DAF61B2: {
                Type: 'AWS::SQS::Queue',
                Properties: {
                    MessageRetentionPeriod: 1209600,
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ]
                },
                UpdateReplacePolicy: 'Delete',
                DeletionPolicy: 'Delete'
            },
            sdlcstackservicequeue0EcsProcessingQueueF55B19EB: {
                Type: 'AWS::SQS::Queue',
                Properties: {
                    RedrivePolicy: {
                        deadLetterTargetArn: {
                            'Fn::GetAtt': [
                                templateHelper.startsWithMatch('sdlcstackservicequeue0EcsProcessingDeadLetterQueue'),
                                'Arn'
                            ]
                        },
                        maxReceiveCount: 3
                    },
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ]
                },
                UpdateReplacePolicy: 'Delete',
                DeletionPolicy: 'Delete'
            },
            sdlcstackservicequeue0QueueProcessingTaskDefTaskRole0AE2B279: {
                Type: 'AWS::IAM::Role',
                Properties: {
                    AssumeRolePolicyDocument: {
                        Statement: [
                            {
                                Action: 'sts:AssumeRole',
                                Effect: 'Allow',
                                Principal: {Service: 'ecs-tasks.amazonaws.com'}
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ]
                }
            },
            sdlcstackservicequeue0QueueProcessingTaskDefTaskRoleDefaultPolicy9B84C3E9: {
                Type: 'AWS::IAM::Policy',
                Properties: {
                    PolicyDocument: {
                        Statement: [
                            {
                                Action: [
                                    'sqs:ReceiveMessage',
                                    'sqs:ChangeMessageVisibility',
                                    'sqs:GetQueueUrl',
                                    'sqs:DeleteMessage',
                                    'sqs:GetQueueAttributes'
                                ],
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('sdlcstackservicequeue0EcsProcessingQueue'),
                                        'Arn'
                                    ]
                                }
                            },
                            {
                                Action: [
                                    'sqs:PurgeQueue',
                                    'sqs:GetQueueAttributes',
                                    'sqs:GetQueueUrl'
                                ],
                                Effect: 'Allow',
                                Resource: {'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstackqueue'), 'Arn']}
                            },
                            {
                                Action: [
                                    'sqs:ReceiveMessage',
                                    'sqs:ChangeMessageVisibility',
                                    'sqs:GetQueueUrl',
                                    'sqs:DeleteMessage',
                                    'sqs:GetQueueAttributes'
                                ],
                                Effect: 'Allow',
                                Resource: {'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstackqueue'), 'Arn']}
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
                                    {'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstacks3'), 'Arn']},
                                    {
                                        'Fn::Join': [
                                            '',
                                            [
                                                {
                                                    'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstacks3'), 'Arn']
                                                },
                                                '/*'
                                            ]
                                        ]
                                    }
                                ]
                            },
                            {
                                Action: ['ses:SendEmail', 'ses:SendRawEmail'],
                                Effect: 'Allow',
                                Resource: '*'
                            },
                            {
                                Action: [
                                    'dynamodb:BatchGetItem',
                                    'dynamodb:GetRecords',
                                    'dynamodb:GetShardIterator',
                                    'dynamodb:Query',
                                    'dynamodb:GetItem',
                                    'dynamodb:Scan',
                                    'dynamodb:ConditionCheckItem',
                                    'dynamodb:BatchWriteItem',
                                    'dynamodb:PutItem',
                                    'dynamodb:UpdateItem',
                                    'dynamodb:DeleteItem',
                                    'dynamodb:DescribeTable'
                                ],
                                Effect: 'Allow',
                                Resource: [
                                    {'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstackcache'), 'Arn']},
                                    {Ref: 'AWS::NoValue'}
                                ]
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    PolicyName: templateHelper.startsWithMatch('sdlcstackservicequeue0QueueProcessingTaskDefTaskRoleDefaultPolicy'),
                    Roles: [
                        {
                            Ref: templateHelper.startsWithMatch('sdlcstackservicequeue0QueueProcessingTaskDefTaskRole')
                        }
                    ]
                }
            },
            sdlcstackservicequeue0QueueProcessingTaskDefBCEF71F0: {
                Type: 'AWS::ECS::TaskDefinition',
                Properties: {
                    ContainerDefinitions: [
                        {
                            Command: [
                                '/usr/local/bin/php',
                                'artisan',
                                'queue:work',
                                '--tries=3',
                                '--delay=3',
                                '--sleep=3'
                            ],
                            Environment: [
                                {
                                    Name: 'QUEUE_NAME',
                                    Value: {
                                        'Fn::GetAtt': [
                                            templateHelper.startsWithMatch('sdlcstackservicequeue0EcsProcessingQueue'),
                                            'QueueName'
                                        ]
                                    }
                                }
                            ],
                            Essential: true,
                            Image: {
                                'Fn::Join': [
                                    '',
                                    [
                                        {
                                            'Fn::Select': [
                                                4,
                                                {
                                                    'Fn::Split': [
                                                        ':',
                                                        {
                                                            'Fn::Join': [
                                                                '',
                                                                [
                                                                    'arn:',
                                                                    {Ref: 'AWS::Partition'},
                                                                    ':ecr:us-east-1:12344:repository/stack/phpfpm'
                                                                ]
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        '.dkr.ecr.',
                                        {
                                            'Fn::Select': [
                                                3,
                                                {
                                                    'Fn::Split': [
                                                        ':',
                                                        {
                                                            'Fn::Join': [
                                                                '',
                                                                [
                                                                    'arn:',
                                                                    {Ref: 'AWS::Partition'},
                                                                    ':ecr:us-east-1:12344:repository/stack/phpfpm'
                                                                ]
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        '.',
                                        {Ref: 'AWS::URLSuffix'},
                                        '/stack/phpfpm:stack/phpfpm'
                                    ]
                                ]
                            },
                            LogConfiguration: {
                                LogDriver: 'awslogs',
                                Options: {
                                    'awslogs-group': {Ref: templateHelper.startsWithMatch('sdlcstackservicequeue0loggroup')},
                                    'awslogs-stream-prefix': 'phpfpm',
                                    'awslogs-region': 'us-west-2'
                                }
                            },
                            Name: 'QueueProcessingContainer',
                            Secrets: []
                        }
                    ],
                    Cpu: '256',
                    ExecutionRoleArn: {
                        'Fn::GetAtt': [
                            templateHelper.startsWithMatch('sdlcstackservicequeue0QueueProcessingTaskDefExecutionRole'),
                            'Arn'
                        ]
                    },
                    Family: 'sdlc-stack-service-queue-0',
                    Memory: '512',
                    NetworkMode: 'awsvpc',
                    RequiresCompatibilities: ['FARGATE'],
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ],
                    TaskRoleArn: {
                        'Fn::GetAtt': [
                            templateHelper.startsWithMatch('sdlcstackservicequeue0QueueProcessingTaskDefTaskRole'),
                            'Arn'
                        ]
                    }
                }
            },
            sdlcstackservicequeue0QueueProcessingTaskDefExecutionRoleDE83DCDF: {
                Type: 'AWS::IAM::Role',
                Properties: {
                    AssumeRolePolicyDocument: {
                        Statement: [
                            {
                                Action: 'sts:AssumeRole',
                                Effect: 'Allow',
                                Principal: {Service: 'ecs-tasks.amazonaws.com'}
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    RoleName: Match.stringLikeRegexp('stacksdlcstack.*executionrole.*'),
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ]
                }
            },
            sdlcstackservicequeue0QueueProcessingTaskDefExecutionRoleDefaultPolicy4730C7F9: {
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
                                Resource: {
                                    'Fn::Join': [
                                        '',
                                        [
                                            'arn:',
                                            {Ref: 'AWS::Partition'},
                                            ':ecr:us-east-1:12344:repository/stack/phpfpm'
                                        ]
                                    ]
                                }
                            },
                            {
                                Action: 'ecr:GetAuthorizationToken',
                                Effect: 'Allow',
                                Resource: '*'
                            },
                            {
                                Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstackservicequeue0loggroup'), 'Arn']
                                }
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    PolicyName: templateHelper.startsWithMatch('sdlcstackservicequeue0QueueProcessingTaskDefExecutionRoleDefaultPolicy'),
                    Roles: [
                        {
                            Ref: templateHelper.startsWithMatch('sdlcstackservicequeue0QueueProcessingTaskDefExecutionRole')
                        }
                    ]
                }
            },
            sdlcstackservicequeue0QueueProcessingFargateService7FA158A1: {
                Type: 'AWS::ECS::Service',
                Properties: {
                    Cluster: {Ref: templateHelper.startsWithMatch('sdlcstackcluster')},
                    DeploymentConfiguration: {MaximumPercent: 200, MinimumHealthyPercent: 50},
                    EnableECSManagedTags: false,
                    LaunchType: 'FARGATE',
                    NetworkConfiguration: {
                        AwsvpcConfiguration: {
                            AssignPublicIp: 'DISABLED',
                            SecurityGroups: [
                                {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('sdlcstackservicequeue0QueueProcessingFargateServiceSecurityGroup'),
                                        'GroupId'
                                    ]
                                }
                            ],
                            Subnets: ['p-12345', 'p-67890']
                        }
                    },
                    PlatformVersion: 'LATEST',
                    ServiceName: 'sdlc-stack-service-queue-0',
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ],
                    TaskDefinition: {
                        Ref: templateHelper.startsWithMatch('sdlcstackservicequeue0QueueProcessingTaskDef')
                    }
                }
            },
            sdlcstackservicequeue0QueueProcessingFargateServiceSecurityGroup00214B09: {
                Type: 'AWS::EC2::SecurityGroup',
                Properties: {
                    GroupDescription: 'stack/sdlc-stack/sdlc-stack-service-queue-0/QueueProcessingFargateService/SecurityGroup',
                    SecurityGroupEgress: [
                        {
                            CidrIp: '0.0.0.0/0',
                            Description: 'Allow all outbound traffic by default',
                            IpProtocol: '-1'
                        }
                    ],
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ],
                    VpcId: 'vpc-12345'
                }
            },
            sdlcstackservicequeue0QueueProcessingFargateServiceTaskCountTargetF33CCAC3: {
                Type: 'AWS::ApplicationAutoScaling::ScalableTarget',
                Properties: {
                    MaxCapacity: 2,
                    MinCapacity: 1,
                    ResourceId: {
                        'Fn::Join': [
                            '',
                            [
                                'service/',
                                {Ref: templateHelper.startsWithMatch('sdlcstackcluster')},
                                '/',
                                {
                                    'Fn::GetAtt': [
                                        templateHelper.startsWithMatch('sdlcstackservicequeue0QueueProcessingFargateService'),
                                        'Name'
                                    ]
                                }
                            ]
                        ]
                    },
                    RoleARN: {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                {Ref: 'AWS::Partition'},
                                ':iam::2222:role/aws-service-role/ecs.application-autoscaling.amazonaws.com/AWSServiceRoleForApplicationAutoScaling_ECSService'
                            ]
                        ]
                    },
                    ScalableDimension: 'ecs:service:DesiredCount',
                    ServiceNamespace: 'ecs'
                }
            },
            sdlcstackservicequeue0QueueProcessingFargateServiceTaskCountTargetCpuScaling9B410338: {
                Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
                Properties: {
                    PolicyName: templateHelper.startsWithMatch('stacksdlcstacksdlcstackservicequeue0QueueProcessingFargateServiceTaskCountTargetCpuScaling'),
                    PolicyType: 'TargetTrackingScaling',
                    ScalingTargetId: {
                        Ref: templateHelper.startsWithMatch('sdlcstackservicequeue0QueueProcessingFargateServiceTaskCountTarget')
                    },
                    TargetTrackingScalingPolicyConfiguration: {
                        PredefinedMetricSpecification: {PredefinedMetricType: 'ECSServiceAverageCPUUtilization'},
                        TargetValue: 50
                    }
                }
            },
            sdlcstackservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingLowerPolicy04F48027: {
                Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
                Properties: {
                    PolicyName: templateHelper.startsWithMatch('stacksdlcstacksdlcstackservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingLowerPolicy'),
                    PolicyType: 'StepScaling',
                    ScalingTargetId: {
                        Ref: templateHelper.startsWithMatch('sdlcstackservicequeue0QueueProcessingFargateServiceTaskCountTarget')
                    },
                    StepScalingPolicyConfiguration: {
                        AdjustmentType: 'ChangeInCapacity',
                        MetricAggregationType: 'Maximum',
                        StepAdjustments: [{MetricIntervalUpperBound: 0, ScalingAdjustment: -1}]
                    }
                }
            },
            sdlcstackservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingLowerAlarm1267BDDA: {
                Type: 'AWS::CloudWatch::Alarm',
                Properties: {
                    ComparisonOperator: 'LessThanOrEqualToThreshold',
                    EvaluationPeriods: 1,
                    AlarmActions: [
                        {
                            Ref: templateHelper.startsWithMatch('sdlcstackservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingLowerPolicy')
                        }
                    ],
                    AlarmDescription: 'Lower threshold scaling alarm',
                    Dimensions: [
                        {
                            Name: 'QueueName',
                            Value: {
                                'Fn::GetAtt': [
                                    templateHelper.startsWithMatch('sdlcstackservicequeue0EcsProcessingQueue'),
                                    'QueueName'
                                ]
                            }
                        }
                    ],
                    MetricName: 'ApproximateNumberOfMessagesVisible',
                    Namespace: 'AWS/SQS',
                    Period: 300,
                    Statistic: 'Maximum',
                    Threshold: 0
                }
            },
            sdlcstackservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingUpperPolicy73C395B8: {
                Type: 'AWS::ApplicationAutoScaling::ScalingPolicy',
                Properties: {
                    PolicyName: templateHelper.startsWithMatch('stacksdlcstacksdlcstackservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingUpperPolicy'),
                    PolicyType: 'StepScaling',
                    ScalingTargetId: {
                        Ref: templateHelper.startsWithMatch('sdlcstackservicequeue0QueueProcessingFargateServiceTaskCountTarget')
                    },
                    StepScalingPolicyConfiguration: {
                        AdjustmentType: 'ChangeInCapacity',
                        MetricAggregationType: 'Maximum',
                        StepAdjustments: [
                            {
                                MetricIntervalLowerBound: 0,
                                MetricIntervalUpperBound: 400,
                                ScalingAdjustment: 1
                            },
                            {MetricIntervalLowerBound: 400, ScalingAdjustment: 5}
                        ]
                    }
                }
            },
            sdlcstackservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingUpperAlarmF99C3B45: {
                Type: 'AWS::CloudWatch::Alarm',
                Properties: {
                    ComparisonOperator: 'GreaterThanOrEqualToThreshold',
                    EvaluationPeriods: 1,
                    AlarmActions: [
                        {
                            Ref: templateHelper.startsWithMatch('sdlcstackservicequeue0QueueProcessingFargateServiceTaskCountTargetQueueMessagesVisibleScalingUpperPolicy')
                        }
                    ],
                    AlarmDescription: 'Upper threshold scaling alarm',
                    Dimensions: [
                        {
                            Name: 'QueueName',
                            Value: {
                                'Fn::GetAtt': [
                                    templateHelper.startsWithMatch('sdlcstackservicequeue0EcsProcessingQueue'),
                                    'QueueName'
                                ]
                            }
                        }
                    ],
                    MetricName: 'ApproximateNumberOfMessagesVisible',
                    Namespace: 'AWS/SQS',
                    Period: 300,
                    Statistic: 'Maximum',
                    Threshold: 100
                }
            },
            sdlcstackstartstopfnServiceRole446CC1EC: {
                Type: 'AWS::IAM::Role',
                Properties: {
                    AssumeRolePolicyDocument: {
                        Statement: [
                            {
                                Action: 'sts:AssumeRole',
                                Effect: 'Allow',
                                Principal: {Service: 'lambda.amazonaws.com'}
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    ManagedPolicyArns: [
                        {
                            'Fn::Join': [
                                '',
                                [
                                    'arn:',
                                    {Ref: 'AWS::Partition'},
                                    ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole'
                                ]
                            ]
                        }
                    ],
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ]
                }
            },
            sdlcstackstartstopfnServiceRoleDefaultPolicy657C3E3A: {
                Type: 'AWS::IAM::Policy',
                Properties: {
                    PolicyDocument: {
                        Statement: [
                            {
                                Action: 'ecs:ListServices',
                                Effect: 'Allow',
                                Resource: '*'
                            },
                            {
                                Action: ['ecs:DescribeServices', 'ecs:UpdateService'],
                                Condition: {
                                    ArnEquals: {
                                        'ecs:cluster': {
                                            'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstackcluster'), 'Arn']
                                        }
                                    }
                                },
                                Effect: 'Allow',
                                Resource: '*'
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    PolicyName: templateHelper.startsWithMatch('sdlcstackstartstopfnServiceRoleDefaultPolicy'),
                    Roles: [{Ref: templateHelper.startsWithMatch('sdlcstackstartstopfnServiceRole')}]
                }
            },
            sdlcstackstartstopfnFBCAF4B4: {
                Type: 'AWS::Lambda::Function',
                Properties: {
                    Code: {
                        S3Bucket: 'cdk-hnb659fds-assets-2222-us-west-2',
                        S3Key: zipMatch
                    },
                    Role: {
                        'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstackstartstopfnServiceRole'), 'Arn']
                    },
                    Environment: {Variables: {CLUSTER: ''}},
                    FunctionName: 'sdlc-stack-start-stop-fn',
                    Handler: 'index.handler',
                    MemorySize: 128,
                    Runtime: 'nodejs14.x',
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ],
                    Timeout: 5
                },
                DependsOn: [
                    templateHelper.startsWithMatch('sdlcstackstartstopfnServiceRoleDefaultPolicy'),
                    templateHelper.startsWithMatch('sdlcstackstartstopfnServiceRole')
                ]
            },
            sdlcstackstartstopfnLogRetention7D14A8FB: {
                Type: 'Custom::LogRetention',
                Properties: {
                    ServiceToken: {
                        'Fn::GetAtt': [
                            logRetentionMatch,
                            'Arn'
                        ]
                    },
                    LogGroupName: {
                        'Fn::Join': [
                            '',
                            [
                                '/aws/lambda/',
                                {Ref: templateHelper.startsWithMatch('sdlcstackstartstopfn')}
                            ]
                        ]
                    },
                    RetentionInDays: 30
                }
            },
            LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB: {
                Type: 'AWS::IAM::Role',
                Properties: {
                    AssumeRolePolicyDocument: {
                        Statement: [
                            {
                                Action: 'sts:AssumeRole',
                                Effect: 'Allow',
                                Principal: {Service: 'lambda.amazonaws.com'}
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    ManagedPolicyArns: [
                        {
                            'Fn::Join': [
                                '',
                                [
                                    'arn:',
                                    {Ref: 'AWS::Partition'},
                                    ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole'
                                ]
                            ]
                        }
                    ],
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ]
                }
            },
            LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRoleDefaultPolicyADDA7DEB: {
                Type: 'AWS::IAM::Policy',
                Properties: {
                    PolicyDocument: {
                        Statement: [
                            {
                                Action: [
                                    'logs:PutRetentionPolicy',
                                    'logs:DeleteRetentionPolicy'
                                ],
                                Effect: 'Allow',
                                Resource: '*'
                            }
                        ],
                        Version: '2012-10-17'
                    },
                    PolicyName: logRetentionServiceRoleDefaultPolicyMatch,
                    Roles: [
                        {
                            Ref: logRetentionServiceRoleMatch
                        }
                    ]
                }
            },
            LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aFD4BFC8A: {
                Type: 'AWS::Lambda::Function',
                Properties: {
                    Handler: 'index.handler',
                    Runtime: 'nodejs14.x',
                    Code: {
                        S3Bucket: 'cdk-hnb659fds-assets-2222-us-west-2',
                        S3Key: zipMatch
                    },
                    Role: {
                        'Fn::GetAtt': [
                            logRetentionServiceRoleMatch,
                            'Arn'
                        ]
                    },
                    Tags: [
                        {Key: 'App', Value: 'myapp'},
                        {Key: 'College', Value: 'PCC'},
                        {Key: 'Environment', Value: 'sdlc'}
                    ]
                },
                DependsOn: [
                    logRetentionServiceRoleDefaultPolicyMatch,
                    logRetentionServiceRoleMatch
                ]
            },
            sdlcstackstartstopstartruleEC601624: {
                Type: 'AWS::Events::Rule',
                Properties: {
                    ScheduleExpression: 'cron(0 13 * * ? *)',
                    State: 'ENABLED',
                    Targets: [
                        {
                            Arn: {
                                'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstackstartstopfn'), 'Arn']
                            },
                            Id: 'Target0',
                            Input: {
                                'Fn::Join': [
                                    '',
                                    [
                                        '{"cluster":"',
                                        {
                                            'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstackcluster'), 'Arn']
                                        },
                                        '","status":"start"}'
                                    ]
                                ]
                            }
                        }
                    ]
                }
            },
            sdlcstackstartstopstartruleAllowEventRulestacksdlcstacksdlcstackstartstopfnEC2236D8AFED269E: {
                Type: 'AWS::Lambda::Permission',
                Properties: {
                    Action: 'lambda:InvokeFunction',
                    FunctionName: {'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstackstartstopfn'), 'Arn']},
                    Principal: 'events.amazonaws.com',
                    SourceArn: {
                        'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstackstartstopstartrule'), 'Arn']
                    }
                }
            },
            sdlcstackstartstopstopruleC36A9980: {
                Type: 'AWS::Events::Rule',
                Properties: {
                    ScheduleExpression: 'cron(0 5 * * ? *)',
                    State: 'ENABLED',
                    Targets: [
                        {
                            Arn: {
                                'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstackstartstopfn'), 'Arn']
                            },
                            Id: 'Target0',
                            Input: {
                                'Fn::Join': [
                                    '',
                                    [
                                        '{"cluster":"',
                                        {
                                            'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstackcluster'), 'Arn']
                                        },
                                        '","status":"stop"}'
                                    ]
                                ]
                            }
                        }
                    ]
                }
            },
            sdlcstackstartstopstopruleAllowEventRulestacksdlcstacksdlcstackstartstopfnEC2236D8C18801CD: {
                Type: 'AWS::Lambda::Permission',
                Properties: {
                    Action: 'lambda:InvokeFunction',
                    FunctionName: {'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstackstartstopfn'), 'Arn']},
                    Principal: 'events.amazonaws.com',
                    SourceArn: {
                        'Fn::GetAtt': [templateHelper.startsWithMatch('sdlcstackstartstopstoprule'), 'Arn']
                    }
                }
            }
        };

        for (const resource of Object.values(expected)) {
            templateHelper.expectResource(resource.Type, {properties: Match.objectEquals(resource)});
        }
    });
});