/**
 * A function that accepts a value and returns a Promise that resolves to
 * `true` if the value is valid, and `false` otherwise.
 *
 * @typeParam T - The type of value that the predicate can evaluate.
 */
export type AsyncPredicate<T> = (value: T) => Promise<boolean>;
