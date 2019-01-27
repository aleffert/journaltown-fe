import { combineLanguages } from './localized';

describe("combineLanguages", () => {
    it('combines multiple locale strings', () => {
        const result = combineLanguages({
            en: {
                foo: 'bar',
                baz: 'quux',
            },
            es: {
                foo: 'bar',
                baz: 'quux',
            }
        });

        expect(result).toEqual({
            "baz": {"en": "quux", "es": "quux"},
            "foo": {"en": "bar", "es": "bar"}
        });
    });

    it('combines functions', () => {
        const result = combineLanguages({
            en: {
                foo: (x: string) => `is ${x}`
            },
            es: {
                foo: (x: string) => `es ${x}`
            }
        });

        expect(result.foo('example')['en']).toEqual('is example');
        expect(result.foo('example')['es']).toEqual('es example');
    })
});

export {};