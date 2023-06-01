import {Match, Template} from "aws-cdk-lib/assertions";
import * as util from "util";
import {MatchHelper} from "./match-helper";

export interface TemplateHelperExpected {
    key?: string;
    properties: object;
}

export class TemplateHelper {

    readonly template: Template;

    constructor(template: Template) {
        this.template = template;
    }

    inspect() {
        this.log('Template:', this.template);
    }

    inspectResources(type: string) {
        const resources = this.template.findResources(type);
        this.log('Resources:', resources);
    }

    expectResource(type: string, expect: TemplateHelperExpected) {
        this.template.hasResource(type, expect.properties);
    }

    expectResourceProperties(type: string, expect: TemplateHelperExpected) {
        this.template.hasResourceProperties(type, expect.properties);
    }

    expected(type: string, expected: TemplateHelperExpected[], matchCount = true, log = false) {
        if (matchCount) {
            this.template.resourceCountIs(type, expected.length);
        }
        let counter = 0;
        for (const [key, resource] of Object.entries(this.template.findResources(type))) {
            if (log) {
                this.log('Resource Key:', key);
                this.log('Resource:', resource);
            }
            const matched = expected[counter];
            if (log) {
                this.log('Expected Match:', matched);
            }
            if (matched.key) {
                expect(key).toMatch(this.startsWithRegex(matched.key));
            }
            this.template.hasResource(type, matched.properties);
            counter++;
        }
    }

    log(key: string, obj: any) {
        console.log(key, util.inspect(obj, {depth: null, colors: true}));
    }

    endsWithMatch(key: string) {
        return MatchHelper.endsWith(key);
    }

    startsWithMatch(key: string) {
        return MatchHelper.startsWith(key);
    }

    startsWithRegex(key: string) {
        if (key.startsWith('^')) {
            return new RegExp(key);
        }
        return new RegExp(`^${key}.*`);
    }
}