import React from 'react';
import { isFunction } from 'lodash';

// In practice we only have english translations
// but have multiple languages here for support
export type Language = 'en' | 'es';

export type LocalizedString = {[L in Language]: string};

export const LanguageContext: React.Context<Language> = React.createContext('en' as Language);

type LocalizedValue<T> = T extends string 
    ? LocalizedString
    : (T extends (...args: infer A) => string
    ? (...x: A) => {[lang in Language]: string} 
    :{[K in keyof T]: LocalizedValue<T[K]>});

type Foo = LocalizedValue<(x: string, y: boolean) => string>

export function combineLanguages<T, Locale extends string>(strings: {[L in Locale]: T}): LocalizedValue<T> {
    const locales = Object.keys(strings) as Locale[];
    const keys = Object.keys(strings[locales[0]]) as [keyof T];
    const result: any = {};
    for(const key of keys) {
        let isObject = true;
        let isFunc = true;
        const map: any = {};
        for(const locale of locales) {
            map[locale] = strings[locale as Locale][key];
            isObject = isObject && typeof(map[locale]) === 'object';
            isFunc = isFunc && isFunction(map[locale]);
        }
        if(isFunc) {
            result[key] = (...args: any) => {
                const functionResult: any = {};
                for(const locale of locales) {
                    functionResult[locale] = map[locale].call(null, ...args);
                };
                return functionResult;
            }
        }
        else if(isObject) {
            result[key] = combineLanguages(map);
        }
        else {
            result[key] = map;
        }
    }
    return result;
}
