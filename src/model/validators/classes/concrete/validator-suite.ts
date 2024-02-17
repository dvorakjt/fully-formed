import { AbstractValidatorSuite, type AbstractValidator } from '../abstract';
import { Validity, type StateWithMessages } from '../../../state';
import { Validator } from './validator';
import type { ValidatorSuiteConstructorArgs } from '../../types';

/**
 * Manages the validation of a value of a given type against a sequence of {@link AbstractValidator}s.
 *
 * @remarks
 * This class is instantiated by other classes within this project and should not need to be directly instantiated by the developer utilizing this library.
 */
export class ValidatorSuite<Value> extends AbstractValidatorSuite<Value> {
  private validators: Array<AbstractValidator<Value>>;

  public constructor({
    validators = [],
    validatorTemplates = [],
  }: ValidatorSuiteConstructorArgs<Value>) {
    super();
    this.validators = validators.concat(
      validatorTemplates.map(template => new Validator<Value>(template)),
    );
  }

  public validate(value: Value): StateWithMessages<Value> {
    const suiteResult: StateWithMessages<Value> = {
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
