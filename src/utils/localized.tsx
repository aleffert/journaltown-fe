import React from 'react';

// In practice we only have english translations
// but have multiple languages here for support
export type Language = 'en' | 'es';

export type LocalizedString = {[L in Language]: string};

export const LanguageContext: React.Context<Language> = React.createContext('en' as Language);

type LocalizedValue<T> = T extends string ? LocalizedString : {[K in keyof T]: LocalizedValue<T[K]>};

export function combineLanguages<T, Locale extends string>(strings: {[L in Locale]: T}): LocalizedValue<T> {
    const locales = Object.keys(strings) as Locale[];
    const keys = Object.keys(strings[locales[0]]) as [keyof T];
    const result: any = {};
    let isObject = true;
    for(const key of keys) {
        const map: any = {}
        for(const locale of locales) {
            map[locale] = strings[locale as Locale][key];
            isObject = isObject && typeof(map[locale]) === 'object';
        }
        if(isObject) {
            result[key] = combineLanguages(map);
        }
        else {
            result[key] = map;
        }
    }
    return result;
}