import {NamingHelper} from "./naming-helper";

export class NameIncrementer {

    static names: Record<string, number> = {};

    next(name: string): string {
        if (NameIncrementer.names[name] === undefined) {
            NameIncrementer.names[name] = 0;
        } else {
            NameIncrementer.names[name]++;
        }
        return NamingHelper.fromParts([name, NameIncrementer.names[name].toString()]);
    }

    static reset(): void {
        NameIncrementer.names = {};
    }
}