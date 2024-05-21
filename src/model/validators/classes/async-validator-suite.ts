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

type AsyncValidatorSuiteConstructorParams<T> = {
  asyncValidators?: Array<IAsyncValidator<T>>;
  asyncValidatorTemplates?: Array<AsyncValidatorTemplate<T>>;
  delayAsyncValidatorExecution?: number;
};

/**
 * @remarks
 * `delayBeforeValidation` allows you to delay the execution of the validators by
 * a duration in milliseconds. This enables you to reduce API calls and other
 * asynchronous operations made while the user is typing.
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

  public validate(
    value: T,
  ): CancelableObservable<ValidatedState<T> & MessageBearerState> {
    this.unsubscribeAll();

    return new CancelableObservable<ValidatedState<T> & MessageBearerState>(
      subscriber => {
        if (!this.validators.length) {
          subscriber.next({
            value,
            validity: Validity.Valid,
            messages: [],
          });
          subscriber.complete();
        } else {
          const suiteResult: ValidatedState<T> & MessageBearerState = {
            value,
            validity: Validity.Valid,
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
