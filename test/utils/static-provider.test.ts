import * as path from 'node:path';
import {StaticProvider} from "../../src/utils";

describe('static provider', () => {

    beforeEach(() => {
        const staticProvider = new StaticProvider();
        staticProvider.cleanup();
    });

    it('should set base directory to working directory when not set', () => {
        const staticProvider = new StaticProvider();
        expect(staticProvider.baseDirectory).toEqual(path.resolve(process.cwd(), staticProvider.defaultDirectory));
    });

    it('should return undefined when no file exists', () => {
        const staticProvider = new StaticProvider();
        expect(staticProvider.fetch('foo')).toEqual(undefined);
    });

    it('should put object when no object exists', () => {
        const staticProvider = new StaticProvider();
        const data = {
            foo: "bar",
            hello: [
                "hola",
                "hallo"
            ]
        };
        staticProvider.put('test', data);
        expect(staticProvider.fetch('test')).toEqual(data);
        staticProvider.remove('test');
    });

    it('should overwrite object when object exists', () => {
        const staticProvider = new StaticProvider();
        const data1 = {
            foo: "bar",
            hello: [
                "hola",
                "hallo"
            ]
        };
        const data2 = {
            fizz: "buzz",
            bye: [
                "adios",
                "tschuess"
            ]
        };
        staticProvider.put('test', data1);
        expect(staticProvider.fetch('test')).toEqual(data1);
        staticProvider.put('test', data2);
        expect(staticProvider.fetch('test')).toEqual(data2);
        staticProvider.remove('test');
    });

    it('should not allow path traversal characters in name', () => {
        const staticProvider = new StaticProvider();
        expect(() => {
            staticProvider.getFileName('../../passwd');
        }).toThrowError();
    });
});