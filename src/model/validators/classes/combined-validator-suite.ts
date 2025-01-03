import { ValidatorSuite } from './validator-suite';
import { AsyncValidatorSuite } from './async-validator-suite';
import {
  Validity,
  type ValidatedState,
  type MessageBearerState,
} from '../../shared';
import { ValidityUtils } from '../../utils';
import type { IAsyncValidator, IValidator } from '../interfaces';
import type { ValidatorTemplate, AsyncValidatorTemplate } from '../types';
import type { CancelableObservable } from '../../shared/classes/cancelable-observable';

/**
 * A configuration object expected by the constructor of a
 * {@link CombinedValidatorSuite}.
 *
 * @typeParam T - The type of value the validator suite will be able to validate.
 */
type CombinedValidatorSuiteConstructorParams<T> = {
  /**
   * An array of {@link IValidator}s (optional).
   */
  validators?: Array<IValidator<T>>;
  /**
   * An array of {@link ValidatorTemplate}s (optional). Validators will be
   * instantiated with the provided templates.
   */
  validatorTemplates?: Array<ValidatorTemplate<T>>;
  /**
   * An array of {@link IAsyncValidator}s (optional).
   */
  asyncValidators?: Array<IAsyncValidator<T>>;
  /**
   * An array of {@link AsyncValidatorTemplate}s (optional). AsyncValidators
   * will be instantiated with the provided templates.
   */
  asyncValidatorTemplates?: Array<AsyncValidatorTemplate<T>>;
  /**
   * A message to be returned as part of a `syncResult` when the validity of the
   * `syncResult` is `Validity.Pending`.
   */
  pendingMessage?: string;
  /**
   * A duration in milliseconds by which the execution of async validators
   * should be delayed. Async validators will not fire until this duration has
   * elapsed, reducing the number of asynchronous operations triggered while the
   * user is still editing the corresponding field.
   *
   * @remarks
   * The primary use case for this is to reduce the number of API calls made by
   * async validators that reach out to some external service.
   *
   * The default is 500 milliseconds.
   */
  delayAsyncValidatorExecution?: number;
};

/**
 * An object returned by the `validate` method of a {@link CombinedValidatorSuite}.
 * The object will always include `syncResult`, and may include an
 * `observableResult` if the validity of the `syncResult` is `Validity.Valid` or
 * `Validity.Caution` and the suite includes asynchronous validators.
 *
 * @typeParam T - The type of value the suite can validate.
 */
type CombinedValidatorSuiteResult<T> = {
  syncResult: ValidatedState<T> & MessageBearerState;
  observableResult?: CancelableObservable<
    ValidatedState<T> & MessageBearerState
  >;
};

/**
 * Exposes a validate method that first executes synchronous validators and
 * then executes asynchronous validators if all synchronous validators pass
 * (i.e. they all return either `Validity.Valid` or `Validity.Caution`).
 *
 * If the suite includes async validators and all synchronous validators pass,
 * the validity of the returned `syncResult` will be `Validity.Pending` and
 * an observable result will also be returned.
 *
 * @typeParam T - The type of value the suite can validate.
 */
export class CombinedValidatorSuite<T> {
  private validatorSuite: ValidatorSuite<T>;
  private asyncValidatorSuite?: AsyncValidatorSuite<T>;
  private pendingMessage?: string;

  public constructor({
    validators,
    validatorTemplates,
    asyncValidators,
    asyncValidatorTemplates,
    pendingMessage,
    delayAsyncValidatorExecution,
  }: CombinedValidatorSuiteConstructorParams<T>) {
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
        delayAsyncValidatorExecution,
      });
    }

    this.pendingMessage = pendingMessage;
  }

  /**
   * Validates the given value and returns an object containing a `syncResult`,
   * and possibly an `observableResult`.
   *
   * @param value - The value to validate.
   * @returns An object of type {@link CombinedValidatorSuiteResult}.
   *
   * @remarks
   * The returned object will always include a `syncResult.` If all synchronous
   * validators pass (or the suite includes no synchronous validators) and the
   * suite includes asynchronous validators, an `observableResult` will also be
   * included in the object.
   */
  public validate(value: T): CombinedValidatorSuiteResult<T> {
    const syncResult = this.validatorSuite.validate(value);

    if (ValidityUtils.isInvalid(syncResult) || !this.asyncValidatorSuite) {
      return {
        syncResult,
      };
    }

    const syncValidatorsReturnedCaution = ValidityUtils.isCaution(syncResult);
    syncResult.validity = Validity.Pending;

    if (this.pendingMessage) {
      syncResult.messages.push({
        text: this.pendingMessage,
        validity: Validity.Pending,
      });
    }

    return {
      syncResult,
      observableResult: this.asyncValidatorSuite.validate(
        value,
        syncValidatorsReturnedCaution,
      ),
    };
  }

  private shouldCreateAsyncValidatorSuite(
    asyncValidators: Array<IAsyncValidator<T>> | undefined,
    asyncValidatorTemplates: Array<AsyncValidatorTemplate<T>> | undefined,
  ): boolean {
    return !!(
      (asyncValidators && asyncValidators.length) ||
      (asyncValidatorTemplates && asyncValidatorTemplates.length)
    );
  }
}
