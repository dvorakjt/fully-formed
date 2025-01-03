import { from, type Subscription } from 'rxjs';
import { AsyncValidator } from './async-validator';
import {
  Validity,
  type ValidatedState,
  type MessageBearerState,
} from '../../shared';
import type { IAsyncValidator } from '../interfaces';
import type { AsyncValidatorTemplate } from '../types';
import { CancelableObservable } from '../../shared/classes/cancelable-observable';
import { ValidityUtils } from '../../utils';

/**
 * A configuration object expected by the constructor of an
 * {@link AsyncValidatorSuite}.
 *
 * @typeParam T - The type of value the validator suite will be able to validate.
 */
type AsyncValidatorSuiteConstructorParams<T> = {
  /**
   * An array of {@link IAsyncValidator}s (optional).
   */
  asyncValidators?: Array<IAsyncValidator<T>>;
  /**
   * An array of {@link AsyncValidatorTemplate}s (optional).
   * {@link AsyncValidator}s will be instantiated with the provided templates.
   */
  asyncValidatorTemplates?: Array<AsyncValidatorTemplate<T>>;
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
 * Exposes a `validate` method that validates a given value against a
 * collection of asynchronous validators and returns a
 * {@link CancelableObservable} that emits an object containing the value itself,
 * the validity of the least valid validator, and an array containing the
 * messages returned by all the validators in the suite.
 *
 * @typeParam T - The type of value the suite will be able to validate.
 */
export class AsyncValidatorSuite<T> {
  private validators: Array<IAsyncValidator<T>>;
  private validatorSubscriptions: Subscription[];
  private delayAsyncValidatorExecution: number;

  public constructor({
    asyncValidators = [],
    asyncValidatorTemplates = [],
    delayAsyncValidatorExecution = 500,
  }: AsyncValidatorSuiteConstructorParams<T>) {
    this.validators = asyncValidators.concat(
      asyncValidatorTemplates.map(template => new AsyncValidator<T>(template)),
    );

    this.validatorSubscriptions = new Array<Subscription>(
      this.validators.length,
    );

    this.delayAsyncValidatorExecution = delayAsyncValidatorExecution;
  }

  /**
   * Validates the given value against a collection of asynchronous validators
   * and returns a {@link CancelableObservable} that emits an object containing
   * the value itself, the validity of the least valid validator, and an array
   * containing the messages returned by all the validators in the suite.
   *
   * @param value - The value to be validated.
   * @returns A {@link CancelableObservable} of type
   * {@link ValidatedState} `&` {@link MessageBearerState}.
   */
  public validate(
    value: T,
    defaultToCaution: boolean,
  ): CancelableObservable<ValidatedState<T> & MessageBearerState> {
    this.unsubscribeAll();

    return new CancelableObservable<ValidatedState<T> & MessageBearerState>(
      subscriber => {
        if (!this.validators.length) {
          subscriber.next({
            value,
            validity: defaultToCaution ? Validity.Caution : Validity.Valid,
            messages: [],
          });
          subscriber.complete();
        } else {
          const suiteResult: ValidatedState<T> & MessageBearerState = {
            value,
            validity: defaultToCaution ? Validity.Caution : Validity.Valid,
            messages: [],
          };

          let completedValidators = 0;

          this.validators.forEach((validator, index) => {
            this.validatorSubscriptions[index] = from(
              validator.validate(value),
            ).subscribe(result => {
              completedValidators++;
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

              if (completedValidators === this.validators.length) {
                subscriber.next(suiteResult);
                subscriber.complete();
              }
            });
          });
        }
      },
      this.delayAsyncValidatorExecution,
    );
  }

  private unsubscribeAll(): void {
    for (const subscription of this.validatorSubscriptions) {
      subscription?.unsubscribe();
    }
  }
}
