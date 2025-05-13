export type BiFunction<T, U, R> = (t: T, u: U) => R;

export type BinaryOperator<T> = BiFunction<T, T, T>;
