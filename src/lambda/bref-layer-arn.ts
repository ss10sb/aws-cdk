import {Arn, ArnFormat, Stack} from "aws-cdk-lib";
import {BrefRuntime} from "./bref-definitions";
import {Construct} from "constructs";
import path from "path";
import * as fs from "fs";
import {NonConstruct} from "../core/non-construct";

export class BrefLayerArn extends NonConstruct {

    readonly appPath: string;

    constructor(scope: Construct, id: string, appPath: string) {
        super(scope, id);
        this.appPath = appPath;
    }

    layerArn(id: BrefRuntime, version: string): Arn {
        version = this.getVersion(id, version);
        return Arn.format({
            service: 'lambda',
            account: '209497400698',
            resource: 'layer',
            resourceName: `${id}:${version}`,
            arnFormat: ArnFormat.COLON_RESOURCE_NAME,
        }, <Stack>this.scope);
    }

    protected getVersion(id: BrefRuntime, version: string): string {
        if (version === 'latest') {
            return this.getLatestVersion(id);
        }
        return version;
    }

    protected getLatestVersion(id: BrefRuntime): string {
        const layers = this.getBrefLayersJson();
        return layers[id][this.getRegion()];
    }

    protected getBrefLayersJson(): { [key: string]: any } {
        const brefLayerJsonFile = path.resolve(this.appPath, 'vendor', 'bref', 'bref', 'layers.json');
        if (!fs.existsSync(brefLayerJsonFile)) {
            throw new Error(`${brefLayerJsonFile} does not exist. Set a version manually.`);
        }
        return JSON.parse(fs.readFileSync(brefLayerJsonFile, 'utf-8'));
    }

    protected getRegion(): string {
        return Stack.of(this.scope).region;
    }
}