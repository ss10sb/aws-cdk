import {StaticProvider} from "../static-provider";

export interface UsesStaticProvider<T> {

    readonly staticProvider: StaticProvider;

    put(): Promise<void>;

    fetch(): T;

    getName(): string;

    exists(): boolean;

    clear(): void;
}