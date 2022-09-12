import {App} from "aws-cdk-lib";
import {ConfigStackHelper} from "@smorken/aws-cdk/utils/config-stack-helper";
import * as path from "path";
import {ConfigLoader} from "@smorken/aws-cdk/config/config-loader";
import {SecretConfigKeys} from "@smorken/aws-cdk/secret/secret-config-keys";
import {EnvLambdaStack} from "@smorken/aws-cdk/env/env-lambda-stack";

const app = new App();
const configDir = path.resolve(__dirname, '..', 'config');
const configLoader = new ConfigLoader(configDir);
const config = configLoader.load();
ConfigStackHelper.validateMinConfig(config);
const secretKeysConfig = new SecretConfigKeys(configDir);
secretKeysConfig.addSecretKeys(config);
const envConfig = config.Environments[1];
ConfigStackHelper.executeStack(app, EnvLambdaStack, envConfig, {});
