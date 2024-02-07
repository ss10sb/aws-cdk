import {resetStaticProps} from "../../src/utils/reset-static-props";
import {App, Stack} from "aws-cdk-lib";
import {Template} from "aws-cdk-lib/assertions";
import {TemplateHelper} from "../../src/utils/testing/template-helper";
import {CodePipelineLambdaStack} from "../../src/stack/code-pipeline-lambda-stack";
import {ConfigStackHelper} from "../../src/utils/config-stack-helper";
import path from "path";

describe('code pipeline lambda test', () => {
    beforeEach(() => {
        resetStaticProps();
    });

    it('should create pipeline from defaults config', () => {
        const config = getConfig('defaults');
        const app = new App();
        const name = ConfigStackHelper.getMainStackName(config);
        const stack = new CodePipelineLambdaStack(app, name, config, {}, {
            env: {
                account: '12344',
                region: 'us-west-2'
            }
        });
        stack.build();
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        // templateHelper.inspect();
        const expected = getExpected('code-pipeline-lambda-stack-base');
        templateHelper.template.templateMatches(expected);
        let count = 0;
        for (const stage of stack.envStages?.stages ?? []) {
            const templateHelper = new TemplateHelper(Template.fromStack(<Stack>stage.envStage.stack));
            // console.log(count);
            // templateHelper.inspect();
            const file = `code-pipeline-lambda-stack-stage-${count}`;
            const expected = getExpected(file);
            templateHelper.template.templateMatches(expected);
            count ++;
        }
    });

    it('should create pipeline from php version config', () => {
        const config = getConfig('defaults.phpVersion');
        const app = new App();
        const name = ConfigStackHelper.getMainStackName(config);
        const stack = new CodePipelineLambdaStack(app, name, config, {}, {
            env: {
                account: '12344',
                region: 'us-west-2'
            }
        });
        stack.build();
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        // templateHelper.inspect();
        const expected = getExpected('code-pipeline-lambda-stack-php-version');
        templateHelper.template.templateMatches(expected);
    });

    it('should create pipeline from alb target config', () => {
        const config = getConfig('albtarget');
        const app = new App();
        const name = ConfigStackHelper.getMainStackName(config);
        const stack = new CodePipelineLambdaStack(app, name, config, {}, {
            env: {
                account: '12344',
                region: 'us-west-2'
            }
        });
        stack.build();
        const templateHelper = new TemplateHelper(Template.fromStack(stack));
        // templateHelper.inspect();
        const expected = getExpected('code-pipeline-lambda-stack-albtarget');
        templateHelper.template.templateMatches(expected);
        let count = 0;
        for (const stage of stack.envStages?.stages ?? []) {
            const templateHelper = new TemplateHelper(Template.fromStack(<Stack>stage.envStage.stack));
            // console.log(count);
            // templateHelper.inspect();
            const file = `code-pipeline-lambda-stack-albtarget-stage-${count}`;
            const expected = getExpected(file);
            templateHelper.template.templateMatches(expected);
            count ++;
        }
    });

    function getConfig(name: string): Record<string, any> {
        return require('../__configLiveLambda__/'+name);
    }

    function getExpected(file: string) {
        const template = require(path.join('..','__templates__', file));//code-pipeline-lambda-stack');
        // remove "Tags" since they are set in the ConfigStackHelper utility
        let k: keyof typeof template.Resources;
        for (k in template.Resources) {
            const resource = template.Resources[k];
            if (resource.Properties?.Tags) {
                delete resource.Properties.Tags;
            }
        }
        return template;
    }
});