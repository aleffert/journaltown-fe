

export type Validator<T> = (v: any) => v is T;
export type ValidatorOf<T> = T extends Validator<infer U> ? U : null;

export type ObjectValidator<T extends object> = {[K in keyof T]: (v: any) => v is T[K]}

export function isString(v: any): v is string {
    if(typeof v === 'string') {
        return true;
    }
    else {
        return false;
    }
}

export function isNumber(v: any): v is number {
    if(typeof v === 'number') {
        return true;
    }
    else {
        return false;
    }
}

export function isObject<T extends object>(schema: ObjectValidator<T>): (v: any) => v is T {
    return function(v: any): v is T {
        if(typeof(v) !== 'object') {
            return false;
        }
        for(const field of Object.keys(schema)) {
            if(!(schema as any)[field](v[field])) {
                return false;
            }
        }
        return true;
    }
}
