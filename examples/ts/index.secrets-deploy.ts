#!/usr/bin/env node
import * as path from "path";
import {deploySecrets} from "@smorken/aws-cdk/stack-functions";

(async () => {
    const results = await deploySecrets({outputFile: path.resolve(__dirname, '..', 'secrets-output.json')}, {idSuffix: 'secrets'});
    for (const result of results) {
        if (result.result === null) {
            console.error(`${result.stackName} resulted in an error (null result).`);
        } else {
            console.log(`${result.stackName}: ${result.result?.$metadata.httpStatusCode} for ${result.keys.length} secrets.`);
        }
    }
})();
