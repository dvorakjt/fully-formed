import type { AbstractAsyncValidator, AbstractValidator } from '../classes';
import type { AsyncValidatorTemplate } from './async-validator-template.type';
import type { ValidatorTemplate } from './validator-template.type';

export type CombinedValidatorSuiteConstructorArgs<T> = {
  validators?: Array<AbstractValidator<T>>;
  validatorTemplates?: Array<ValidatorTemplate<T>>;
  asyncValidators?: Array<AbstractAsyncValidator<T>>;
  asyncValidatorTemplates?: Array<AsyncValidatorTemplate<T>>;
  pendingMessage?: string;
};
