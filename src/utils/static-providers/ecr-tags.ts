import {UsesStaticProvider} from "./uses-static-provider";
import {EcrTag, TagResponse} from "../sdk";
import {StaticFileProvider} from "../static-file-provider";
import {EcrRepositories} from "../../ecr";

export class EcrTags implements UsesStaticProvider<TagResponse[]> {

    readonly staticProvider: StaticFileProvider;
    readonly ecrRepositories: EcrRepositories;
    readonly ecrTag: EcrTag;

    constructor(staticProvider: StaticFileProvider, ecrRepositories: EcrRepositories, ecrTag: EcrTag) {
        this.staticProvider = staticProvider;
        this.ecrRepositories = ecrRepositories;
        this.ecrTag = ecrTag;
    }

    getName(): string {
        return 'ecrTags';
    }

    fetch(): TagResponse[] {
        const tagResponses = this.staticProvider.fetch<TagResponse[]>(this.getName()) ?? [];
        this.ecrRepositories.applyTagResponses(tagResponses);
        return tagResponses;
    }

    async put(): Promise<void> {
        const data: TagResponse[] = await this.getDataToPut();
        this.staticProvider.put(this.getName(), data);
    }

    async getDataToPut(): Promise<TagResponse[]> {
        const data: Promise<TagResponse>[] = [];
        for (const ecrRepository of this.ecrRepositories.getEcrRepositories()) {
            const ecrTag = this.ecrTag.fetch(ecrRepository.repositoryName);
            data.push(ecrTag);
        }
        return Promise.all(data);
    }

    exists(): boolean {
        return this.staticProvider.exists(this.getName());
    }

    clear() {
        this.staticProvider.remove(this.getName());
    }
}