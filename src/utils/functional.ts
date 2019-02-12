import { Optional } from './optional';
import { isNull, isUndefined } from 'lodash';

export function pick<T, K extends keyof T>(object: T, fields: K[]): Pick<T, K> {
    const result: any = {};
    for(const field of fields) {
        result[field] = (object as any)[field];
    }
    return result;
}

export function isSorted<T>(list: T[]) {
    for(let i = 1; i < list.length; i++) {
        if(list[i - 1] >= list[i]) {
            return false;
        }
    }
    return true;
}

export function safeGet<T, K extends keyof T>(value: Optional<T>, field: K): Optional<T[K]> {
    if(isNull(value) || isUndefined(value)) {
        return undefined;
    }
    else {
        return value[field];
    }

}

type Query = {[key: string]: Optional<string | string[]>};
type AllStrings<T> = {[key in keyof T]: string}
export function commafy<T extends Query>(object: T): AllStrings<Query> {
    const result = {} as any;
    for(const key of Object.keys(object)) {
        const value = object[key];
        result[key] = Array.isArray(value) ? value.join(',') : value;
    }
    return result;
}