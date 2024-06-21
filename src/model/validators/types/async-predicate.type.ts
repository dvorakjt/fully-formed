/**
 * A function that returns a Promise that resolves to a `boolean` indicating
 * whether or not the provided value is valid.
 */
export type AsyncPredicate<T> = (value: T) => Promise<boolean>;
