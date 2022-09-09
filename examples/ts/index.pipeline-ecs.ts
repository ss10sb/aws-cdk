#!/usr/bin/env node

import {PreSynthHelper} from "@smorken/aws-cdk/utils/pre-synth-helper";
import {buildCodePipelineEcsStack} from "@smorken/aws-cdk/stack-functions";

const preSynthHelper = new PreSynthHelper({clientConfig: {}});
(async () => {
    await buildCodePipelineEcsStack({preSynthHelper: preSynthHelper});
})();
