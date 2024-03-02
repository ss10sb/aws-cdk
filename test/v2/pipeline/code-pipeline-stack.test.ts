import {App, Stack} from "aws-cdk-lib";
import {ConfigStackHelper} from "../../../src/utils/config-stack-helper";
import {TemplateHelper} from "../../../src/utils/testing/template-helper";
import {Template} from "aws-cdk-lib/assertions";
import {CodePipelineStack} from "../../../src/v2/pipeline/code-pipeline-stack";
import {EcrRepositories} from "../../../src/ecr/ecr-repositories";
import {EcrRepositoryType} from "../../../src/ecr/ecr-definitions";

describe('code pipeline stack test', () => {

    it('creates an ecs only stack', () => {
        const config = getConfig('defaults.ecs');
        const app = new App();
        const name = ConfigStackHelper.getMainStackName(config);
        const ecrRepositories = new EcrRepositories(ConfigStackHelper.getAppName(config), {
            repositories: [EcrRepositoryType.NGINX, EcrRepositoryType.PHPFPM]
        });
        const stack = new CodePipelineStack(app, name, config, {}, {
            env: {
                account: '12344',
                region: 'us-west-2'
            }
        });
        stack.setEcrRepositories(ecrRepositories);
        stack.build();
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        // templateHelper.inspect();
        const expected = require('../__expected__/pipeline/code-pipeline-stack.ecs');
        templateHelper.template.templateMatches(expected);
        let count = 0;
        for (const stage of stack.envStages?.stages ?? []) {
            const templateHelper = new TemplateHelper(Template.fromStack(<Stack>stage.makeStage.stack));
            // console.log(count);
            // templateHelper.inspect();
            const file = `code-pipeline-stack.ecs.stage${count}`;
            const expected = require('../__expected__/pipeline/'+file);
            templateHelper.template.templateMatches(expected);
            count ++;
        }
    });

    it('creates a lambda only stack', () => {
        const config = getConfig('defaults.lambda');
        const app = new App();
        const name = ConfigStackHelper.getMainStackName(config);
        const stack = new CodePipelineStack(app, name, config, {}, {
            env: {
                account: '12344',
                region: 'us-west-2'
            }
        });
        stack.build();
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        // templateHelper.inspect();
        const expected = require('../__expected__/pipeline/code-pipeline-stack.lambda');
        templateHelper.template.templateMatches(expected);
        let count = 0;
        for (const stage of stack.envStages?.stages ?? []) {
            const templateHelper = new TemplateHelper(Template.fromStack(<Stack>stage.makeStage.stack));
            // console.log(count);
            // templateHelper.inspect();
            const file = `code-pipeline-stack.lambda.stage${count}`;
            const expected = require('../__expected__/pipeline/'+file);
            templateHelper.template.templateMatches(expected);
            count ++;
        }
    });

    it('creates a mixed stack', () => {
        const config = getConfig('defaults.mixed');
        const app = new App();
        const name = ConfigStackHelper.getMainStackName(config);
        const ecrRepositories = new EcrRepositories(ConfigStackHelper.getAppName(config), {
            repositories: [EcrRepositoryType.NGINX, EcrRepositoryType.PHPFPM]
        });
        const stack = new CodePipelineStack(app, name, config, {}, {
            env: {
                account: '12344',
                region: 'us-west-2'
            }
        });
        stack.setEcrRepositories(ecrRepositories);
        stack.build();
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        // templateHelper.inspect();
        const expected = require('../__expected__/pipeline/code-pipeline-stack.mixed');
        templateHelper.template.templateMatches(expected);
        let count = 0;
        for (const stage of stack.envStages?.stages ?? []) {
            const templateHelper = new TemplateHelper(Template.fromStack(<Stack>stage.makeStage.stack));
            // console.log(count);
            // templateHelper.inspect();
            const file = `code-pipeline-stack.mixed.stage${count}`;
            const expected = require('../__expected__/pipeline/'+file);
            templateHelper.template.templateMatches(expected);
            count ++;
        }
    });

    function getConfig(name: string): Record<string, any> {
        return require('../__config__/live/'+name);
    }
});