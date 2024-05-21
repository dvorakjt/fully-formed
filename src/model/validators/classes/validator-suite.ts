import {
  Validity,
  type ValidatedState,
  type MessageBearerState,
} from '../../shared';
import { Validator } from './validator';
import type { IValidator } from '../interfaces';
import type { ValidatorTemplate } from '../types';

type ValidatorSuiteConstructorParams<T> = {
  validators?: Array<IValidator<T>>;
  validatorTemplates?: Array<ValidatorTemplate<T>>;
};

export class ValidatorSuite<T> {
  private validators: Array<IValidator<T>>;

  public constructor({
    validators = [],
    validatorTemplates = [],
  }: ValidatorSuiteConstructorParams<T>) {
    this.validators = validators.concat(
      validatorTemplates.map(template => new Validator<T>(template)),
    );
  }

  public validate(value: T): ValidatedState<T> & MessageBearerState {
    const suiteResult: ValidatedState<T> & MessageBearerState = {
      value,
      validity: Validity.Valid,
      messages: [],
    };
    for (const validator of this.validators) {
      const result = validator.validate(value);
      if (result.validity === Validity.Invalid) {
        suiteResult.validity = Validity.Invalid;
      }
      if (result.message) {
        suiteResult.messages.push(result.message);
      }
    }
    return suiteResult;
  }
}
