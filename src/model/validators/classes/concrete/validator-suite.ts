import { AbstractValidatorSuite, type AbstractValidator } from '../abstract';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Validity, type StateWithMessages, type Message } from '../../../state';
import { Validator } from './validator';
import type {
  ValidatorSuiteConstructorArgs,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ValidatorTemplate,
} from '../../types';

/**
 * Manages the validation of a value of a given type against a collection of {@link AbstractValidator}s.
 */
export class ValidatorSuite<Value> extends AbstractValidatorSuite<Value> {
  private validators: Array<AbstractValidator<Value>>;

  /**
   *
   * @param validatorSuiteConstructorArgs - {@link ValidatorSuiteConstructorArgs}. An object containing an array of {@link AbstractValidator}s and an array of {@link ValidatorTemplate}s.
   *
   * @remarks
   * This class is instantiated by other classes within this project and should not need to be directly instantiated by a developer utilizing this library.
   *
   * If you elect to pass in {@link ValidatorTemplate}s via the `validatorTemplates` property of the {@link ValidatorSuiteConstructorArgs} object, instances of {@link Validator} will
   * be created for you. This is useful when you are creating a validator for a complex type. You can declare the template directly in the constructor for that class, and benefit from type hints and intellisense in your
   * code editor.
   *
   * Alternatively, instances of {@link AbstractValidator} can be provided. This can be useful if you want to reuse the same validator throughout your project.
   *
   * If neither validators nor templates are provided, the validator suite will always produce an object with a validity property of {@link Validity.Valid} and an empty messages array.
   */
  public constructor({
    validators = [],
    validatorTemplates = [],
  }: ValidatorSuiteConstructorArgs<Value>) {
    super();
    this.validators = validators.concat(
      validatorTemplates.map(template => new Validator<Value>(template)),
    );
  }

  /**
   * Validates the provided value against a collection of validators.
   *
   * @param value - The value to be validated.
   * @returns An object containing the value, its {@link Validity}, and an array of associated {@link Message}s.
   */
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
