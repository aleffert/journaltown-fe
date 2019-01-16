export function pick<T, K extends keyof T>(object: T, fields: K[]): Pick<T, K> {
    const result: any = {};
    for(const field of fields) {
        result[field] = (object as any)[field];
    }
    return result;
}