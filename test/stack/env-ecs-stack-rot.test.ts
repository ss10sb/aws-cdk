import {resetStaticProps} from "../../src/utils/reset-static-props";
import {App, Stack} from "aws-cdk-lib";
import {Template} from "aws-cdk-lib/assertions";
import {Protocol} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import {ContainerCommand, ContainerEntryPoint} from "../../src/ecs/container-command-factory";
import {ScalableTypes, SchedulableTypes, TaskServiceType} from "../../src/ecs/task-definitions";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {ContainerType} from "../../src/ecs/container-definitions";
import {ConfigEnvironments} from "../../src/config/config-definitions";
import {ConfigStackHelper} from "../../src/utils/config-stack-helper";
import {EcrRepositoryType} from "../../src/ecr/ecr-definitions";
import {EcrRepositories} from "../../src/ecr/ecr-repositories";
import {EcrRepositoryFactory} from "../../src/ecr/ecr-repository-factory";
import {EnvEcsStack} from "../../src/env/env-ecs-stack";

describe('env ecs stack run once task', () => {

    beforeEach(() => {
        resetStaticProps();
    });

    it('should create env stack', () => {
        const stackProps = {env: {region: 'us-east-1', account: '12344'}};
        const envStackProps = {env: {region: 'us-west-2', account: '2222'}};
        const envConfig = getEnvConfig();
        const app = new App();
        const stack = new Stack(app, 'pcc-shared-stack', stackProps);
        const ecrRepositories = new EcrRepositories(ConfigStackHelper.getAppName(envConfig), {
            repositories: [EcrRepositoryType.NGINX, EcrRepositoryType.PHPFPM]
        });
        const factory = new EcrRepositoryFactory(stack, ConfigStackHelper.getAppName(envConfig), ecrRepositories);
        factory.create();
        const name = ConfigStackHelper.getMainStackName(envConfig);
        const envStack = new EnvEcsStack(stack, name, envConfig, {}, envStackProps, {
            repositoryFactory: factory
        });
        envStack.build();
        const templateHelper = new TemplateHelper(Template.fromStack(envStack));
        // templateHelper.inspect();
        const expected = require('../__templates__/env-stack-rot');
        templateHelper.template.templateMatches(expected);
    });
});

function getEnvConfig() {
    return {
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
            s3: {},
            tasks: [
                {
                    type: TaskServiceType.RUN_ONCE_TASK,
                    taskDefinition: {
                        cpu: '256',
                        memoryMiB: '512',
                        containers: [
                            {
                                type: ContainerType.RUN_ONCE_TASK,
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
                }
            ],
            services: []
        }
    };
}