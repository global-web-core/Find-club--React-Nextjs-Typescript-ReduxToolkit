export type TypeOneOrZero = 0 | 1;

export type TypeUnwrapPromise<T> = T extends Promise<infer U> ? U : T;