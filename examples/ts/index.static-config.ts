#!/usr/bin/env node

import {SsmParam} from "@smorken/aws-cdk/utils/sdk/ssm-param";
import {ConfigSsmParams} from "@smorken/aws-cdk/utils/static-providers/config-ssm-params";
import {StaticFileProvider} from "@smorken/aws-cdk/utils/static-file-provider";
import {SecretConfigKeys} from "@smorken/aws-cdk/secret/secret-config-keys";
import {ConfigStackHelper} from "@smorken/aws-cdk/utils/config-stack-helper";

const staticProvider = new StaticFileProvider();

const configSsmParams = new ConfigSsmParams(staticProvider, 'na', new SsmParam({}));

const fileName = configSsmParams.getName();

const config = ConfigStackHelper.getConfig();

const secretConfigKeys = new SecretConfigKeys();
secretConfigKeys.addSecretKeys(config);

staticProvider.put(fileName, config);
