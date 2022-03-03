import {NamingHelper} from "./naming-helper";

export class NameIncrementer {

    names: Record<string, number> = {};

    next(name: string): string {
        if (this.names[name] === undefined) {
            this.names[name] = 0;
        } else {
            this.names[name]++;
        }
        return NamingHelper.fromParts([name, this.names[name].toString()]);
    }
}