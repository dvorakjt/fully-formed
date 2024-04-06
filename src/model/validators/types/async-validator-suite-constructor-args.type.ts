import type { AbstractAsyncValidator } from '../classes';
import type { AsyncValidatorTemplate } from './async-validator-template.type';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { AsyncValidatorSuite } from '../classes';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { AsyncValidator } from '../classes';

/**
 * An object passed as an argument to the constructor of an 
 * {@link AsyncValidatorSuite}.
 * 
 * @typeParam T - The type of value that the suite will be expected to validate.
 * 
 * @remarks
 * If `asyncValidatorTemplates` are provided, an {@link AsyncValidator} will
 * be instantiated for each template provided. 
 */
export type AsyncValidatorSuiteConstructorArgs<T> = {
  asyncValidators?: Array<AbstractAsyncValidator<T>>;
  asyncValidatorTemplates?: Array<AsyncValidatorTemplate<T>>;
};
