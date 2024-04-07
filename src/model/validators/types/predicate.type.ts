/**
 * A function that accepts a value and returns `true` if the value is valid, and
 * `false` otherwise.
 *
 * @typeParam T - The type of value that the predicate can evaluate.
 */
export type Predicate<Value> = (value: Value) => boolean;
