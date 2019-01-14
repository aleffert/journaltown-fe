// Argument type of a function
export type Domain<T> = T extends (f: infer A) => infer _ ? A : never;

// Helper to extract out types
type UnionCodomain<T, K> = K extends any ? T[K] : never;

// Unions the types of all the values in an object
export type ObjectCodomain<T> = UnionCodomain<T, keyof T>;

// Removes a key from a type
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;