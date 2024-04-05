import { AbstractValidatorSuite, type AbstractValidator } from '../abstract';
import { 
  Validity, 
  type StateWithMessages, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type Message 
} from '../../../state';
import { Validator } from './validator';
import type { ValidatorSuiteConstructorArgs } from '../../types';

/**
 * Manages the validation of a value of a given type against a collection of 
 * {@link AbstractValidator}s.
 * 
 * @typeParam T - The type of value that the suite can validate.
 */
export class ValidatorSuite<T> extends AbstractValidatorSuite<T> {
  private validators: Array<AbstractValidator<T>>;

  public constructor({
    validators = [],
    validatorTemplates = [],
  }: ValidatorSuiteConstructorArgs<T>) {
    super();
    this.validators = validators.concat(
      validatorTemplates.map(template => new Validator<T>(template)),
    );
  }

  /**
   * Validates the provided value against a collection of validators.
   *
   * @param value - The value to be validated.
   * 
   * @returns An object containing the value, its {@link Validity}, and an array 
   * of associated {@link Message}s.
   */
  public validate(value: T): StateWithMessages<T> {
    const suiteResult: StateWithMessages<T> = {
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
