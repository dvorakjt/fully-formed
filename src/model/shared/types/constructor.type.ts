export type Constructor<Args extends unknown[], T> = new (...args: Args) => T;
