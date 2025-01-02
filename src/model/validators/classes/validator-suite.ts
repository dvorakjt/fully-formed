import {
  Validity,
  type ValidatedState,
  type MessageBearerState,
} from '../../shared';
import { Validator } from './validator';
import type { IValidator } from '../interfaces';
import type { ValidatorTemplate } from '../types';
import { ValidityUtils } from '../../utils';

/**
 * A configuration object expected by the constructor of a
 * {@link ValidatorSuite}.
 *
 * @typeParam T - The type of value the {@link ValidatorSuite} will be able to
 * validate.
 */
type ValidatorSuiteConstructorParams<T> = {
  /**
   * An array of {@link IValidator}s (optional).
   */
  validators?: Array<IValidator<T>>;
  /**
   * An array of {@link ValidatorTemplate}s (optional). Validators will be instantiated
   * with the provided templates.
   */
  validatorTemplates?: Array<ValidatorTemplate<T>>;
};

/**
 * Exposes a `validate` method that validates a given value against a
 * collection of synchronous validators and returns an object containing the
 * value itself, the validity of the least valid validator, and an array
 * containing the messages returned by all the validators in the suite.
 */
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

  /**
   * Validates the given value against a collection of synchronous validators
   * and returns an object containing the value itself, the validity of the
   * least valid validator, and an array containing the messages returned by
   * all the validators in the suite.
   *
   * @param value - The value to be validated.
   * @returns An object of type {@link ValidatedState} `&` {@link MessageBearerState}.
   */
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
      } else if (
        result.validity === Validity.Caution &&
        !ValidityUtils.isInvalid(suiteResult)
      ) {
        suiteResult.validity = Validity.Caution;
      }

      if (result.message) {
        suiteResult.messages.push(result.message);
      }
    }
    return suiteResult;
  }
}
