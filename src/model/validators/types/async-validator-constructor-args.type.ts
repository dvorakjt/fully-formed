import type { AsyncPredicate } from './async-predicate.type';

export type AsyncValidatorConstructorArgs<Value> = {
  predicate: AsyncPredicate<Value>;
  validMessage?: string;
  invalidMessage?: string;
};
