import type { Predicate } from './predicate.type';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Validator } from '../classes';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ValidatorResult } from './validator-result.type';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Message } from '../../state';

/**
 * An object that is passed as an argument to the constructor of a
 * {@link Validator}.
 *
 * @typeParam T - The type of value that the validator will be expected to
 * validate.
 *
 * @remarks
 * If `validMessage` is included, a {@link Message} with that text will
 * be included in the {@link ValidatorResult} object returned by the 
 * `validate()` method of the validator instantiated with this object when the 
 * value passed to it is valid.
 *
 * If `invalidMessage` is included, a {@link Message} with that text will
 * be included in the {@link ValidatorResult} object returned by the 
 * `validate()` method of the validator instantiated with this object when the 
 * value passed to it is invalid.
 */
export type ValidatorConstructorArgs<T> = {
  predicate: Predicate<T>;
  validMessage?: string;
  invalidMessage?: string;
};
