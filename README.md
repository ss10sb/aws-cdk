### Helper package for a code pipeline deployment to cross-account ECS clusters (CDK v2).

PHP based library using this package can be found at: https://bitbucket.org/scott_morken/cdk

To use the package, add the following to your `tsconfig.json`:

```
  "compilerOptions": {
    ...
    "module": "CommonJS",
    "target": "ES2018",
    "paths": {
      "@smorken/aws-cdk/*": [
        "./node_modules/@smorken/aws-cdk/dist/*"
      ]
    } 
  }
```

`package.json`:
```json
{
  "name": "ecs-stack",
  "version": "0.1.0",
  "private": true,
  "type": "commonjs",
  "scripts": {
    "build": "tsc",
    "cdk": "cdk"
  },
  "devDependencies": {
    "@types/jest": "^27.4.0",
    "@types/node": "^17.0.17",
    "aws-cdk": "*",
    "ts-node": "^10.6.0",
    "tslib": "^2.3.1",
    "typescript": "^4.6.2"
  },
  "dependencies": {
    "@smorken/aws-cdk": "^2.0.3",
    "aws-cdk-lib": "^2.15.0",
    "constructs": "^10.0.0"
  }
}
```

### Config

Store the config to a shared account on AWS

Config files are assumed to live in `./config` (defaults.js, prod.js, shared.js, sdlc.js, etc)

```typescript
#!/usr/bin/env node

import {buildConfigParamStack} from "@smorken/aws-cdk";

buildConfigParamStack({}, {idSuffix: 'config'});
```

### Secrets

Store the secrets to the prod/dev/etc accounts on AWS

Secret files are assumed to live in `./config` (secrets.js, secrets.prod.js, secrets.sdlc.js, etc)

```typescript
#!/usr/bin/env node

import {buildSecretStacks} from "@smorken/aws-cdk";

buildSecretStacks({}, {idSuffix: 'secrets'});
```

### Code Pipeline (ECS)

```typescript
#!/usr/bin/env node

import {PreSynthHelper} from "@smorken/aws-cdk/utils";
import {buildCodePipelineCdsStack} from "@smorken/aws-cdk";

const preSynthHelper = new PreSynthHelper({clientConfig: {}});
(async () => {
    await buildCodePipelineCdsStack({preSynthHelper: preSynthHelper});
})();
```