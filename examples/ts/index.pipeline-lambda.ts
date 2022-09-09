#!/usr/bin/env node

import {PreSynthHelper} from "@smorken/aws-cdk/utils/pre-synth-helper";
import {buildCodePipelineLambdaStack} from "@smorken/aws-cdk/stack-functions";

const preSynthHelper = new PreSynthHelper({clientConfig: {}});
(async () => {
    await buildCodePipelineLambdaStack({preSynthHelper: preSynthHelper});
})();
