import * as path from 'path';
import {StaticFileProvider} from "../../src/utils/static-file-provider";

describe('static provider', () => {

    beforeEach(() => {
        const staticProvider = new StaticFileProvider();
        staticProvider.cleanup();
    });

    it('should set base directory to working directory when not set', () => {
        const staticProvider = new StaticFileProvider();
        expect(staticProvider.baseDirectory).toEqual(path.resolve(process.cwd(), staticProvider.defaultDirectory));
    });

    it('should return undefined when no file exists', () => {
        const staticProvider = new StaticFileProvider();
        expect(staticProvider.fetch('foo')).toEqual(undefined);
    });

    it('should put object when no object exists', () => {
        const staticProvider = new StaticFileProvider();
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
        const staticProvider = new StaticFileProvider();
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
        const staticProvider = new StaticFileProvider();
        expect(() => {
            staticProvider.getFileName('../../passwd');
        }).toThrowError();
    });
});