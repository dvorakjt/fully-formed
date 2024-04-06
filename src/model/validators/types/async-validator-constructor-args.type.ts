import type { AsyncPredicate } from './async-predicate.type';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { AsyncValidator } from '../classes';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Message } from '../../state';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ValidatorResult } from './validator-result.type';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Observable } from 'rxjs';

/**
 * An object that is passed as an argument to the constructor of an
 * {@link AsyncValidator}.
 *
 * @typeParam T - The type of value that the validator will be expected to
 * validate.
 *
 * @remarks
 * If `validMessage` is included, a {@link Message} with that text will
 * be included in the {@link ValidatorResult} object emitted by the
 * {@link Observable} returned by the `validate()` method of the validator
 * instantiated with this object when the value passed to it is valid.
 *
 * If `invalidMessage` is included, a {@link Message} with that text will
 * be included in the {@link ValidatorResult} object emitted by the
 * {@link Observable} returned by the `validate()` method of the validator
 * instantiated with this object when the value passed to it is invalid.
 */
export type AsyncValidatorConstructorArgs<T> = {
  predicate: AsyncPredicate<T>;
  validMessage?: string;
  invalidMessage?: string;
};
