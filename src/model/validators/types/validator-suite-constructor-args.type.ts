import type { AbstractValidator } from '../classes';
import type { ValidatorTemplate } from './validator-template.type';

export type ValidatorSuiteConstructorArgs<Value> = {
  validators?: Array<AbstractValidator<Value>>;
  validatorTemplates?: Array<ValidatorTemplate<Value>>;
};
