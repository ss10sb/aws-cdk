import {App} from "aws-cdk-lib";
import {NonConstruct} from "../../src/core/non-construct";

describe('non construct', () => {

    it('can mix names', () => {
        const app = new App();
        const ns = new NonConstruct(app, 'test');
        expect(ns.mixNameWithId('foo')).toBe('test-foo');
    });
});