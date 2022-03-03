import {
    ClientDefaults,
    DescribeImagesCommand,
    DescribeImagesResponse,
    ECRClient,
    ECRClientConfig,
    TagStatus
} from "@aws-sdk/client-ecr";

interface Tag {
    exists: boolean;
    imageTag: string;
}

export interface TagResponse {
    repositoryName: string;
    imageTag: string;
    cached: boolean;
    exists: boolean;
}

export class EcrTag {

    readonly client: ECRClient;
    cached: TagResponse[] = [];

    constructor(clientConfig: ClientDefaults) {
        this.client = this.createClient(clientConfig);
    }

    async fetch(repositoryName: string): Promise<TagResponse> {
        const cached = this.getCached(repositoryName);
        if (cached) {
            return cached;
        }
        const command = new DescribeImagesCommand({
            filter: {
                tagStatus: TagStatus.TAGGED
            },
            repositoryName: repositoryName
        });
        let response: DescribeImagesResponse | undefined = undefined;
        try {
            response = await this.client.send(command);
        } catch (error) {
            console.log(`Registry for ${repositoryName} not found.`, error);
        }
        const tag = this.getNextTag(response);
        const tagResponse = {
            repositoryName: repositoryName,
            imageTag: tag.imageTag,
            cached: false,
            exists: tag.exists
        };
        this.cached.push(tagResponse);
        return tagResponse;
    }

    private getCached(repositoryName: string): TagResponse | undefined {
        for (const tagResponse of this.cached) {
            if (tagResponse.repositoryName === repositoryName) {
                tagResponse.cached = true;
                return tagResponse;
            }
        }
    }

    private getNextTag(response?: DescribeImagesResponse): Tag {
        let exists = false;
        let tagString = '1';
        if (response && response.imageDetails) {
            let tag = 0;
            for (const imageDetail of response.imageDetails) {
                exists = true;
                for (const imageTag of imageDetail.imageTags ?? []) {
                    const numeric: number = parseInt(imageTag);
                    if (numeric > tag) {
                        tag = numeric;
                    }
                }
            }
            tagString = (tag + 1).toString();
        }
        return {
            imageTag: tagString,
            exists: exists
        };
    }

    private createClient(config: ECRClientConfig): ECRClient {
        return new ECRClient(config);
    }
}