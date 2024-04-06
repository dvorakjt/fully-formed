import { Observable, type Subscription } from 'rxjs';
import {
  AbstractAsyncValidatorSuite,
  type AbstractAsyncValidator,
} from '../abstract';
import { AsyncValidator } from './async-validator';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Validity, type StateWithMessages, type Message } from '../../../state';
import type { AsyncValidatorSuiteConstructorArgs } from '../../types';

/**
 * Manages the validation of a value of a given type against a collection of
 * {@link AbstractAsyncValidator}s.
 *
 * @typeParam T - The type of value that the suite can validate.
 */
export class AsyncValidatorSuite<T> extends AbstractAsyncValidatorSuite<T> {
  private validators: Array<AbstractAsyncValidator<T>>;
  private validatorSubscriptions: Subscription[];

  public constructor({
    asyncValidators = [],
    asyncValidatorTemplates = [],
  }: AsyncValidatorSuiteConstructorArgs<T>) {
    super();
    this.validators = asyncValidators.concat(
      asyncValidatorTemplates.map(template => new AsyncValidator<T>(template)),
    );
    this.validatorSubscriptions = new Array<Subscription>(
      this.validators.length,
    );
  }

  /**
   * Validates the provided value against a collection of validators.
   *
   * @param value - The value to be validated.
   *
   * @returns An {@link Observable} that emits an object containing the provided
   * value, its {@link Validity}, and an array of associated {@link Message}s.
   */
  public validate(value: T): Observable<StateWithMessages<T>> {
    this.unsubscribeAll();
    return new Observable<StateWithMessages<T>>(subscriber => {
      if (!this.validators.length) {
        subscriber.next({
          value,
          validity: Validity.Valid,
          messages: [],
        });
        subscriber.complete();
      } else {
        const suiteResult: StateWithMessages<T> = {
          value,
          validity: Validity.Valid,
          messages: [],
        };
        let completedValidators = 0;
        this.validators.forEach((validator, index) => {
          this.validatorSubscriptions[index] = validator
            .validate(value)
            .subscribe(result => {
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
    });
  }

  private unsubscribeAll(): void {
    for (const subscription of this.validatorSubscriptions) {
      subscription?.unsubscribe();
    }
  }
}
