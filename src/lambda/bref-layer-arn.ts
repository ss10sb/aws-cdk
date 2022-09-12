import {Arn, ArnFormat, Stack} from "aws-cdk-lib";
import {BrefRuntime, BrefRuntimeAccount, BrefRuntimes} from "./bref-definitions";
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
        const account = this.getAccount(id);
        return Arn.format({
            service: 'lambda',
            account: account,
            resource: 'layer',
            resourceName: `${id}:${version}`,
            arnFormat: ArnFormat.COLON_RESOURCE_NAME,
        }, <Stack>this.scope);
    }

    protected getAccount(id: BrefRuntime): BrefRuntimeAccount {
        return BrefRuntimes.get(id);
    }

    protected getVersion(id: BrefRuntime, version: string): string {
        if (version === 'latest') {
            return this.getLatestVersion(id);
        }
        return version;
    }

    protected getLatestVersion(id: BrefRuntime): string {
        const version = this.versionFromBrefCore(id) ?? this.versionFromBrefExtras(id);
        if (version === undefined) {
            throw new Error('No layers.json files found in bref/bref or bref/extra-php-extensions.');
        }
        return version;
    }

    protected versionFromBrefCore(id: BrefRuntime): string | undefined {
        const layers = this.getBrefLayersJson(path.resolve(this.appPath, 'vendor', 'bref', 'bref', 'layers.json'));
        return layers?.[id]?.[this.getRegion()];
    }

    protected versionFromBrefExtras(id: BrefRuntime): string | undefined {
        const layers = this.getBrefLayersJson(path.resolve(this.appPath, 'vendor', 'bref', 'extra-php-extensions', 'layers.json'));
        return layers?.[id]?.[this.getRegion()];
    }

    protected getBrefLayersJson(file: string): { [key: string]: any } {
        if (fs.existsSync(file)) {
            return JSON.parse(fs.readFileSync(file, 'utf-8'));
        }
        return {};
    }

    protected getRegion(): string {
        return Stack.of(this.scope).region;
    }
}