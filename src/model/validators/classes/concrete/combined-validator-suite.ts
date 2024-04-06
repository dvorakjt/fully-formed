import {
  AbstractCombinedValidatorSuite,
  type AbstractAsyncValidatorSuite,
  type AbstractValidatorSuite,
  type AbstractAsyncValidator,
} from '../abstract';
import type {
  AsyncValidatorTemplate,
  CombinedValidatorSuiteConstructorArgs,
  CombinedValidatorSuiteResult,
} from '../../types';
import { ValidatorSuite } from './validator-suite';
import { AsyncValidatorSuite } from './async-validator-suite';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Validity, type Message } from '../../../state';

/**
 * Provides synchronous and asynchronous validation for a given type of value.
 *
 * @typeParam T - The type of value that the suite can validate.
 */
export class CombinedValidatorSuite<
  T,
> extends AbstractCombinedValidatorSuite<T> {
  private validatorSuite: AbstractValidatorSuite<T>;
  private asyncValidatorSuite?: AbstractAsyncValidatorSuite<T>;
  private pendingMessage?: string;

  public constructor({
    validators,
    validatorTemplates,
    asyncValidators,
    asyncValidatorTemplates,
    pendingMessage,
  }: CombinedValidatorSuiteConstructorArgs<T>) {
    super();
    this.validatorSuite = new ValidatorSuite<T>({
      validators,
      validatorTemplates,
    });
    if (
      this.shouldCreateAsyncValidatorSuite(
        asyncValidators,
        asyncValidatorTemplates,
      )
    ) {
      this.asyncValidatorSuite = new AsyncValidatorSuite<T>({
        asyncValidators,
        asyncValidatorTemplates,
      });
    }
    this.pendingMessage = pendingMessage;
  }

  /**
   * Validates the provided value against both sync and async validators.
   *
   * @param value - The value to be validated.
   *
   * @returns An object containing a `syncResult` and possibly an
   * `observableResult.`
   *
   * @remarks
   * An `observableResult` is only included when the value
   * is synchronously determined to be valid and `asyncValidators` or
   * `asyncValidatorTemplates` have been passed into the constructor. In these
   * cases, the `validity` property of `syncResult` will be
   * {@link Validity.Pending}, and, if a `pendingMessage` was also passed into
   * the constructor, a corresponding {@link Message} will be included in the
   * messages array.
   */
  public validate(value: T): CombinedValidatorSuiteResult<T> {
    const syncResult = this.validatorSuite.validate(value);

    if (syncResult.validity !== Validity.Valid || !this.asyncValidatorSuite) {
      return {
        syncResult,
      };
    }

    syncResult.validity = Validity.Pending;

    if (this.pendingMessage) {
      syncResult.messages.push({
        text: this.pendingMessage,
        validity: Validity.Pending,
      });
    }

    return {
      syncResult,
      observableResult: this.asyncValidatorSuite.validate(value),
    };
  }

  private shouldCreateAsyncValidatorSuite(
    asyncValidators: Array<AbstractAsyncValidator<T>> | undefined,
    asyncValidatorTemplates: Array<AsyncValidatorTemplate<T>> | undefined,
  ): boolean {
    return !!(
      (asyncValidators && asyncValidators.length) ||
      (asyncValidatorTemplates && asyncValidatorTemplates.length)
    );
  }
}
