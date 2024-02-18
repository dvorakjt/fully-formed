import type { AbstractAsyncValidator } from '../classes';
import type { AsyncValidatorTemplate } from './async-validator-template.type';

export type AsyncValidatorSuiteConstructorArgs<Value> = {
  asyncValidators?: Array<AbstractAsyncValidator<Value>>;
  asyncValidatorTemplates?: Array<AsyncValidatorTemplate<Value>>;
};
