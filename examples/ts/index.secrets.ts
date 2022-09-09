#!/usr/bin/env node

import {buildSecretStacks} from "@smorken/aws-cdk/stack-functions";

buildSecretStacks({}, {idSuffix: 'secrets'});
