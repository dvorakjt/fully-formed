import type { AbstractValidator } from '../classes';
import type { ValidatorTemplate } from './validator-template.type';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ValidatorSuite, Validator } from '../classes';

/**
 * An object passed as an argument to the constructor of a
 * {@link ValidatorSuite}.
 *
 * @typeParam T - The type of value that the suite will be expected to validate.
 *
 * @remarks
 * If `validatorTemplates` are provided, a {@link Validator} will be
 * instantiated for each template provided.
 */
export type ValidatorSuiteConstructorArgs<Value> = {
  validators?: Array<AbstractValidator<Value>>;
  validatorTemplates?: Array<ValidatorTemplate<Value>>;
};
