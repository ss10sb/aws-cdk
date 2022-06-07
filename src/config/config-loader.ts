import * as fs from 'fs';
import * as path from 'path';
import merge from "lodash/merge";

export class ConfigLoader {

    readonly configDir: string;
    readonly defaultDirectory: string = 'config';
    readonly base: string = 'defaults';

    constructor(configDir?: string, base?: string) {
        this.configDir = configDir ?? this.getDefaultDirectory();
        if (base) {
            this.base = base;
        }
    }

    public static convertStringToConfig<T extends Record<string, any>>(value: string): T {
        return <T>this.convertStringToJson(value);
    }

    public static convertStringToJson(value: string): object {
        try {
            return JSON.parse(value);
        } catch (e) {
            console.log("Error parsing JSON", value);
        }
        return {};
    }

    public load(env?: string, suffix?: string): Record<string, any> {
        return this.getConfigFromFiles(env, suffix);
    }

    private getDefaultDirectory(): string {
        return path.resolve(process.cwd(), this.defaultDirectory);
    }

    private getConfigFromFiles(env?: string, suffix?: string): Record<string, any> {
        const defaultEnv = this.getFromBase(this.base);
        if (!env) {
            env = defaultEnv?.Environment ?? null;
        }
        let overrideEnv = {};
        let overrideEnvSuffix = {};
        if (env) {
            const envBase = this.getEnvBase(env);
            overrideEnv = this.getFromBase(envBase);
            if (suffix) {
                overrideEnvSuffix = this.getFromBase(this.getEnvSuffixBase(envBase, suffix));
            }
        }
        return merge({}, defaultEnv, overrideEnv, overrideEnvSuffix);
    }

    private getFromBase(base: string): Record<string, any> {
        const jsFile = path.resolve(this.configDir, `${base}.js`);
        if (fs.existsSync(jsFile)) {
            return this.loadJs(jsFile);
        }
        const jsonFile = path.resolve(this.configDir, `${base}.json`);
        if (fs.existsSync(jsonFile)) {
            return ConfigLoader.convertStringToJson(fs.readFileSync(jsonFile, 'utf8'));
        }
        console.log(`Environment '${base}' not found.`);
        return {};
    }

    private loadJs(file: string): Record<string, any> {
        /* tslint:disable no-var-requires */
        return require(file);
    }

    private getEnvBase(env: string): string {
        if (this.base === 'defaults') {
            return env;
        }
        return [this.base, env].join('.');
    }

    private getEnvSuffixBase(base: string, suffix: string): string {
        return [base, suffix].join('.');
    }
}