import {Construct} from "constructs";

export class NonConstruct {

    readonly scope: Construct;
    readonly id: string;

    constructor(scope: Construct, id: string) {
        this.scope = scope;
        this.id = id;
    }

    mixNameWithId(name: string): string {
        return `${this.id}-${name}`;
    }
}