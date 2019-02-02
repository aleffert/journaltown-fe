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