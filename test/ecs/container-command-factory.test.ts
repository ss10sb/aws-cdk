import {App, Stage} from "aws-cdk-lib";
import {ContainerCommand, ContainerCommandFactory, ContainerEntryPoint} from "../../src/ecs/container-command-factory";

describe('container command factory', () => {

    it('can create bash entrypoint', () => {
        const app = new App();
        const stage = new Stage(app, 'test');

        const expected = {
            command: [
                "artisan",
                "migrate",
                "--seed",
                "--force"
            ],
            entryPoint: ['/bin/sh', '-c']
        };
        const c = new ContainerCommandFactory(stage, 'id', {});
        expect(c.create(ContainerEntryPoint.SH, ContainerCommand.MIGRATE_SEED)).toEqual(expected);
    });

    it('can create php entryPoint', () => {
        const app = new App();
        const stage = new Stage(app, 'test');

        const expected = {
            command: [
                "artisan",
                "migrate",
                "--seed",
                "--force"
            ],
            entryPoint: ['/usr/local/bin/php']
        };
        const c = new ContainerCommandFactory(stage, 'id', {});
        expect(c.create(ContainerEntryPoint.PHP, ContainerCommand.MIGRATE_SEED)).toEqual(expected);
    });

    it('can add additional arguments', () => {
        const app = new App();
        const stage = new Stage(app, 'test');

        const expected = {
            command: [
                "artisan",
                "role:set",
                "123456"
            ],
            entryPoint: ['/bin/bash', '-c']
        };
        const c = new ContainerCommandFactory(stage, 'id', {});
        expect(c.create(ContainerEntryPoint.BASH, ContainerCommand.ROLE_SET, ['123456'])).toEqual(expected);
    });
});