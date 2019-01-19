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