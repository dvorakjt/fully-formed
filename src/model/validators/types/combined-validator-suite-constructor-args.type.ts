import type { AbstractAsyncValidator, AbstractValidator } from '../classes';
import type { AsyncValidatorTemplate } from './async-validator-template.type';
import type { ValidatorTemplate } from './validator-template.type';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { CombinedValidatorSuite } from '../classes';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Validator, AsyncValidator } from '../classes';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Message, Validity } from '../../state';

/**
 * An object passed as an argument to the constructor of a
 * {@link CombinedValidatorSuite}.
 *
 * @typeParam T - The type of value that the suite will be expected to validate.
 *
 * @remarks
 * If `validatorTemplates` are provided, a {@link Validator} will be
 * instantiated for each template provided.
 *
 * If `asyncValidatorTemplates` are provided, an {@link AsyncValidator} will be
 * instantiated for each template provided.
 *
 * If a `pendingMessage` is provided, a {@link Message} with that text will
 * be returned with a `syncResult` whose validity is {@link Validity.Pending}.
 */
export type CombinedValidatorSuiteConstructorArgs<T> = {
  validators?: Array<AbstractValidator<T>>;
  validatorTemplates?: Array<ValidatorTemplate<T>>;
  asyncValidators?: Array<AbstractAsyncValidator<T>>;
  asyncValidatorTemplates?: Array<AsyncValidatorTemplate<T>>;
  pendingMessage?: string;
};
