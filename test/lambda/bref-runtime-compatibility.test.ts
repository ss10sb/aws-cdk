import {BrefRuntimeCompatibility} from "../../src/lambda/bref-runtime-compatibility";
import {BrefRuntime} from "../../src/lambda/bref-definitions";
import {FunctionType} from "../../src/lambda/lambda-definitions";

describe('bref runtime compatibility', () => {

   it('passes when web type contains an fpm runtime for multiple runtimes', () => {
        const compat = new BrefRuntimeCompatibility();
        const result = compat.checkRuntimes([
            BrefRuntime.PHP81FPM,
            BrefRuntime.GD81,
        ], FunctionType.WEB);
        expect(result.pass).toBe(true);
   });

    it('fails when web type does not contain an fpm runtime for multiple runtimes', () => {
        const compat = new BrefRuntimeCompatibility();
        const result = compat.checkRuntimes([
            BrefRuntime.PHP81,
            BrefRuntime.GD81,
        ], FunctionType.WEB);
        expect(result.pass).toBe(false);
        expect(result.messages).toEqual(["web/php-81: requireEndsWith (fpm) check did not pass compatibility check."]);
    });

    it('fails when web type does not contain an fpm runtime and contains a console runtime for multiple runtimes', () => {
        const compat = new BrefRuntimeCompatibility();
        const result = compat.checkRuntimes([
            BrefRuntime.PHP81,
            BrefRuntime.CONSOLE,
        ], FunctionType.WEB);
        expect(result.pass).toBe(false);
        expect(result.messages).toEqual([
            "web/php-81: requireEndsWith (fpm) check did not pass compatibility check.",
            "web/console: requireEndsWith (fpm) check did not pass compatibility check.",
        ]);
    });

    it('fails when web type does not contain an fpm runtime for single runtime', () => {
        const compat = new BrefRuntimeCompatibility();
        const result = compat.checkRuntime(BrefRuntime.PHP81, FunctionType.WEB);
        expect(result.pass).toBe(false);
        expect(result.messages).toEqual(["web/php-81: requireEndsWith (fpm) check did not pass compatibility check."]);
    });

    it('passes when queue type contains a php runtime for multiple runtimes', () => {
        const compat = new BrefRuntimeCompatibility();
        const result = compat.checkRuntimes([
            BrefRuntime.PHP81,
            BrefRuntime.GD81,
        ], FunctionType.QUEUE);
        expect(result.pass).toBe(true);
    });

    it('fails when queue type contains a phpfpm runtime for multiple runtimes', () => {
        const compat = new BrefRuntimeCompatibility();
        const result = compat.checkRuntimes([
            BrefRuntime.PHP81,
            BrefRuntime.PHP81FPM,
            BrefRuntime.GD81,
        ], FunctionType.QUEUE);
        expect(result.pass).toBe(false);
        expect(result.messages).toEqual([
            "queue/php-81-fpm: excludeEndsWith (fpm) check did not pass compatibility check.",
        ]);
    });

    it('fails when queue type contains a console runtime for multiple runtimes', () => {
        const compat = new BrefRuntimeCompatibility();
        const result = compat.checkRuntimes([
            BrefRuntime.PHP81,
            BrefRuntime.CONSOLE,
            BrefRuntime.GD81,
        ], FunctionType.QUEUE);
        expect(result.pass).toBe(false);
        expect(result.messages).toEqual([
            "queue/console: requireStartsWith (php) check did not pass compatibility check.",
        ]);
    });

    it('executes multiple calls for queue', () => {
        const compat = new BrefRuntimeCompatibility();
        let result = compat.checkRuntime(BrefRuntime.PHP81FPM, FunctionType.QUEUE);
        expect(result.pass).toBe(false);
        expect(result.messages).toEqual([
            "queue/php-81-fpm: excludeEndsWith (fpm) check did not pass compatibility check."
        ]);
        result = compat.checkRuntime(BrefRuntime.PHP81, FunctionType.QUEUE);
        expect(result.pass).toBe(true);
        result = compat.checkRuntime(BrefRuntime.CONSOLE, FunctionType.QUEUE);
        expect(result.pass).toBe(false);
        expect(result.messages).toEqual([
            "queue/console: requireStartsWith (php) check did not pass compatibility check.",
        ]);
    });
});