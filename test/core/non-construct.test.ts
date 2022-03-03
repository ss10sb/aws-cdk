import {NonConstruct} from "../../src/core";
import {App} from "aws-cdk-lib";

describe('non construct', () => {

    it('can mix names', () => {
        const app = new App();
        const ns = new NonConstruct(app, 'test');
        expect(ns.mixNameWithId('foo')).toBe('test-foo');
    });
});