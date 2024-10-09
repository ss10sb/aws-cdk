import {FunctionType} from "./lambda-definitions";
import {BrefRuntime} from "./bref-definitions";

export interface BrefRuntimeCompatibilityResults {
    readonly pass: boolean;
    readonly messages: string[];
}

export interface RuleProps {
    readonly rule: string;
    readonly value: string;
    require?: RuleRequireType;
    type?: RuleType;
}

export enum RuleRequireType {
    ALL = 'all',
    ANY = 'any'
}

export enum RuleType {
    INCLUDE = 'include',
    EXCLUDE = 'exclude',
}

export interface RuleResult {
    pass: boolean;
    message?: string;
}

export class Rules {

    public apply(props: RuleProps, type: FunctionType, runtimes: BrefRuntime[]): RuleResult {
        if (runtimes.length === 0) {
            return {
                pass: false,
                message: this.composeErrorMessage(props, type, 'No runtimes found.')
            }
        }
        props.require = props.require ?? RuleRequireType.ANY;
        props.type = props.type ?? RuleType.INCLUDE;
        return this.executeRuleForRuntimes(props, type, runtimes);
    }

    private executeRuleForRuntimes(props: RuleProps, type: FunctionType, runtimes: BrefRuntime[]): RuleResult {
        const ruleMethod = props.rule;
        const passes: boolean[] = [];
        const errorMessage = this.composeErrorMessage(props, type);

        for (const runtime of runtimes) {
            // @ts-ignore - Use dynamic method call
            const runtimePasses = this.modifyPassesForRuleType(props.type, this[ruleMethod](props.value, runtime));
            if (props.require === RuleRequireType.ANY && runtimePasses) {
                return {pass: true};
            }
            passes.push(runtimePasses);
        }

        if (this.anyRuntimesPass(props, passes)) {
            return {pass: true};
        }

        if (this.allRuntimesPass(props, passes)) {
            return {pass: true};
        }

        return {
            pass: false,
            message: errorMessage
        }
    }

    private modifyPassesForRuleType(type: RuleType, passes: boolean): boolean {
        if (type === RuleType.EXCLUDE) {
            return !passes;
        }

        return passes;
    }

    private contains(ruleValue: string, runtime: BrefRuntime): boolean {
        return runtime.includes(ruleValue);
    }

    private endsWith(ruleValue: string, runtime: BrefRuntime): boolean {
        return runtime.endsWith(ruleValue);
    }

    private startsWith(ruleValue: string, runtime: BrefRuntime): boolean {
        return runtime.startsWith(ruleValue);
    }

    private anyRuntimesPass(props: RuleProps, passes: boolean[]): boolean {
        return props.require === RuleRequireType.ANY && passes.some(pass => pass);
    }

    private allRuntimesPass(props: RuleProps, passes: boolean[]): boolean {
        return props.require === RuleRequireType.ALL && !passes.some(pass => !pass);
    }

    private composeErrorMessage(props: RuleProps, type: FunctionType, customMessage: string = 'Failed compatibility check.'): string {
        return `${type}/${props.rule} (${props.require}:${props.type}) for "${props.value}": ${customMessage}`;
    }
}

export class BrefRuntimeCompatibility {

    private rulesProps = {
        [FunctionType.WEB]: [
            {
                rule: 'endsWith',
                value: 'fpm'
            },
            {
                rule: 'endsWith',
                value: 'console',
                require: RuleRequireType.ALL,
                type: RuleType.EXCLUDE
            }
        ],
        [FunctionType.QUEUE]: [
            {
                rule: 'startsWith',
                value: 'php'
            },
            {
                rule: 'endsWith',
                value: 'fpm',
                require: RuleRequireType.ALL,
                type: RuleType.EXCLUDE
            }
        ],
        [FunctionType.ARTISAN]: [
            {
                rule: 'startsWith',
                value: 'php'
            },
            {
                rule: 'endsWith',
                value: 'fpm',
                require: RuleRequireType.ALL,
                type: RuleType.EXCLUDE
            }
        ],
        [FunctionType.EVENT]: [],
        [FunctionType.SCHEDULED]: []
    }

    public checkRuntimes(runtimes: BrefRuntime[], type: FunctionType): BrefRuntimeCompatibilityResults {
        const rules = new Rules();
        let passed = true;
        const messages: string[] = [];
        for (const ruleProp of this.rulesProps[type]) {
            const ruleResult = rules.apply(ruleProp, type, runtimes);
            if (!ruleResult.pass) {
                passed = ruleResult.pass;
                if (ruleResult.message) {
                    messages.push(ruleResult.message);
                }
            }
        }
        return {
            pass: passed,
            messages: messages
        }
    }
}