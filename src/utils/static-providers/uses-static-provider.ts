import {StaticFileProvider} from "../static-file-provider";

export interface UsesStaticProvider<T> {

    readonly staticProvider: StaticFileProvider;

    put(): Promise<void>;

    fetch(): T;

    getName(): string;

    exists(): boolean;

    clear(): void;
}