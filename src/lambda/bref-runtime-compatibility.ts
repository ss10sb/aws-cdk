import {FunctionType} from "./lambda-definitions";
import {BrefRuntime, BrefRuntimeAccount, BrefRuntimes} from "./bref-definitions";

export interface BrefRuntimeCompatibilityResults {
    readonly pass: boolean;
    readonly messages: string[];
}

export class BrefRuntimeCompatibility {

    map = {
        [FunctionType.WEB]: {
            requireEndsWith: 'fpm',
        },
        [FunctionType.QUEUE]: {
            requireStartsWith: 'php',
            excludeEndsWith: 'fpm',
        },
        [FunctionType.ARTISAN]: {
            requireStartsWith: 'php',
            excludeEndsWith: 'fpm',
        },
        [FunctionType.EVENT]: {},
        [FunctionType.SCHEDULED]: {}
    }

    previous: Record<string, boolean> = {};

    public checkRuntimes(runtimes: BrefRuntime[], type: FunctionType): BrefRuntimeCompatibilityResults {
        this.previous = {};
        let passes = true;
        const messages: string[] = [];
        for (const runtime of runtimes) {
            const m = this.checkRuntime(runtime, type);
            if (!m.pass) {
                passes = false;
                messages.push(...m.messages);
            }
        }
        return {
            pass: passes,
            messages: messages
        }
    }

    public checkRuntime(runtime: BrefRuntime, type: FunctionType): BrefRuntimeCompatibilityResults {
        if (!this.isCore(runtime)) {
            return {pass: true, messages: []};
        }
        const mapped = this.map[type];
        for (const [key, check] of Object.entries(mapped)) {
            let p: boolean | undefined;
            p = this.previousExecution(key);
            if (p === undefined || p) {
                p = this.executeCheck(key, runtime, check);
            }
            if (!p) {
                return {
                    pass: false,
                    messages: [this.getErrorMessage(key, runtime, check, type)]
                }
            }
            this.previous[key] = p;
        }
        return {
            pass: true,
            messages: []
        }
    }

    protected getErrorMessage(key: string, runtime: BrefRuntime, check: string | BrefRuntime | BrefRuntime[], type: FunctionType): string {
        return `${type}/${runtime}: ${key} (${this.checkToString(check)}) check did not pass compatibility check.`;
    }

    protected executeCheck(key: string, runtime: BrefRuntime, check: string | BrefRuntime | BrefRuntime[]): boolean {
        const method = key + 'Passes';
        // @ts-ignore
        return this[method](runtime, check);
    }

    protected previousExecution(key: string): boolean|undefined {
        return this.previous[key];
    }

    protected isCore(runtime: BrefRuntime): boolean {
        const brefRuntimeAccount = BrefRuntimes.get(runtime);
        return brefRuntimeAccount === BrefRuntimeAccount.CORE;
    }

    protected checkToString(check: string | BrefRuntime | BrefRuntime[]): string {
        if (Array.isArray(check)) {
            return check.join(' ');
        }
        return check;
    }

    protected requireEndsWithPasses(runtime: BrefRuntime, endsWith: string): boolean {
        return runtime.endsWith(endsWith);
    }

    protected requireStartsWithPasses(runtime: BrefRuntime, startsWith: string): boolean {
        return runtime.startsWith(startsWith);
    }

    protected excludeEndsWithPasses(runtime: BrefRuntime, endsWith: string): boolean {
        return !runtime.endsWith(endsWith);
    }

    protected excludeAnyPasses(runtime: BrefRuntime, runtimes: BrefRuntime[]): boolean {
        for (const r of runtimes) {
            if (r === runtime) {
                return false;
            }
        }
        return true;
    }

    protected requirePasses(runtime: BrefRuntime, required: BrefRuntime): boolean {
        return runtime === required;
    }
}