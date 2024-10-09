import {BrefRuntimeCompatibility, RuleRequireType, Rules, RuleType} from "../../src/lambda/bref-runtime-compatibility";
import {BrefRuntime} from "../../src/lambda/bref-definitions";
import {FunctionType} from "../../src/lambda/lambda-definitions";

describe('bref runtime compatibility', () => {

    it('passes when a rule is inclusive and one or more values match', () => {
       const rules = new Rules();
       expect(rules.apply({
           rule: 'endsWith',
           value: 'fpm'
       }, FunctionType.WEB, [BrefRuntime.PHP83FPM, BrefRuntime.GD83])).toEqual({pass: true});
    });

    it('fails when a rule is inclusive and no values match', () => {
        const rules = new Rules();
        expect(rules.apply({
            rule: 'endsWith',
            value: 'fpm'
        }, FunctionType.WEB, [BrefRuntime.PHP83, BrefRuntime.GD83])).toEqual({
            pass: false,
            message: 'web/endsWith (any:include) for "fpm": Failed compatibility check.'
        });
    });

    it('passes when a rule is exclusive and no values match', () => {
        const rules = new Rules();
        expect(rules.apply({
            rule: 'endsWith',
            value: 'fpm',
            require: RuleRequireType.ALL,
            type: RuleType.EXCLUDE
        }, FunctionType.WEB, [BrefRuntime.PHP83, BrefRuntime.GD83])).toEqual({pass: true});
    });

    it('fails when a rule is exclusive and one or more values match', () => {
        const rules = new Rules();
        expect(rules.apply({
            rule: 'endsWith',
            value: 'fpm',
            require: RuleRequireType.ALL,
            type: RuleType.EXCLUDE
        }, FunctionType.WEB, [BrefRuntime.PHP83, BrefRuntime.PHP83FPM, BrefRuntime.GD83])).toEqual({
            pass: false,
            message: 'web/endsWith (all:exclude) for "fpm": Failed compatibility check.'
        });
    });


   it('passes when web type contains an fpm runtime for multiple runtimes', () => {
        const compat = new BrefRuntimeCompatibility();
        const result = compat.checkRuntimes([
            BrefRuntime.PHP81FPM,
            BrefRuntime.GD81,
        ], FunctionType.WEB);
        expect(result.pass).toBe(true);
   });

    it('passes when artisan type contains a php runtime for multiple runtimes', () => {
        const compat = new BrefRuntimeCompatibility();
        const result = compat.checkRuntimes([
            BrefRuntime.PHP83,
            BrefRuntime.CONSOLE
        ], FunctionType.ARTISAN);
        expect(result.pass).toBe(true);
    });

    it('fails when web type does not contain an fpm runtime for multiple runtimes', () => {
        const compat = new BrefRuntimeCompatibility();
        const result = compat.checkRuntimes([
            BrefRuntime.PHP81,
            BrefRuntime.GD81,
        ], FunctionType.WEB);
        expect(result.pass).toBe(false);
        expect(result.messages).toEqual(['web/endsWith (any:include) for "fpm": Failed compatibility check.']);
    });

    it('fails when web type does not contain an fpm runtime and contains a console runtime for multiple runtimes', () => {
        const compat = new BrefRuntimeCompatibility();
        const result = compat.checkRuntimes([
            BrefRuntime.PHP81,
            BrefRuntime.CONSOLE,
        ], FunctionType.WEB);
        expect(result.pass).toBe(false);
        expect(result.messages).toEqual([
            'web/endsWith (any:include) for "fpm": Failed compatibility check.',
            'web/endsWith (all:exclude) for "console": Failed compatibility check.'
        ]);
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
            'queue/endsWith (all:exclude) for "fpm": Failed compatibility check.',
        ]);
    });
});
