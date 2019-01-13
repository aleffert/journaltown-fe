export type Pluck<T, K extends keyof T> = T[K];
export type Domain<T> = T extends (f: infer A) => infer _ ? A : never;

type UnionCodomain<T, K> = K extends any ? T[K] : never;
export type ObjectCodomain<T> = UnionCodomain<T, keyof T>;