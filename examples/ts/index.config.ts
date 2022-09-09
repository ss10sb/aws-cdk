#!/usr/bin/env node

import {buildConfigParamStack} from "@smorken/aws-cdk/stack-functions";

buildConfigParamStack({}, {idSuffix: 'config'});
