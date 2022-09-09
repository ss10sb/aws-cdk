### Create files from .copy files

```shell
$ ./prep
```

### Initial set up

```shell
$ ./config_stack deploy
$ ./secrets_stack deploy
$ ./secrets_deploy
$ #first run
$ npm run static-config #if you want to use the local config over the aws param
$ ./pipeline_stack deploy
```

### Update secrets

You will likely need to redeploy the app

```shell
$ ./secrets_deploy
```

### Lambda Artisan Commands (AWS Console)

Using a lambda function with layers for PHP and Console

```json
{
  "cli": "migrate --seed"
}
```

### Lambda Artisan Commands (Scheduled Events) `config`

```js
functionProps: {
    brefRuntime: [BrefRuntime.PHP81, BrefRuntime.CONSOLE],
    scheduledEvents:
    [
        {
            schedule: 'rate(5 minutes)',
            eventInput: {cli: 'schedule:run'}
        }
    ]
}
```

### Lambda Warmer (via Bref) `config`

```js
distribution: {
    functionProps: {
        scheduledEvents: [
            {
                schedule: 'rate(10 minutes)',
                eventInput: {warmer: true}
            }
        ]
    }
}
```

### Other

Force new deployment of cluster services

```shell
$ aws ecs update-service --force-new-deployment --cluster pcc-sdlc-app-cluster --service pcc-sdlc-app-service --profile AWSACCOUNTID --region us-west-2
```

List listener rules (get next priority)

```shell
$ aws elbv2 describe-rules --listener-arn arn:aws:elasticloadbalancing:us-west-2:... --profile PROFILE --region us-west-2
```
