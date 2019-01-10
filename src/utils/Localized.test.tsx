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
});

export {};