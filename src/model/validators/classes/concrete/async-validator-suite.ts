import { Observable, type Subscription } from 'rxjs';
import {
  AbstractAsyncValidatorSuite,
  type AbstractAsyncValidator,
} from '../abstract';
import { AsyncValidator } from './async-validator';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Validity, type StateWithMessages, type Message } from '../../../state';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { AsyncValidatorSuiteConstructorArgs, AsyncValidatorTemplate } from '../../types';

/**
 * Manages the validation of a value of a given type against a collection of {@link AbstractAsyncValidator}s.
 */
export class AsyncValidatorSuite<
  Value,
> extends AbstractAsyncValidatorSuite<Value> {
  private validators: Array<AbstractAsyncValidator<Value>>;
  private validatorSubscriptions: Subscription[];

  /**
   *
   * @param argsObject - An object containing an array of {@link AbstractAsyncValidator}s and an array of {@link AsyncValidatorTemplate}s.
   *
   * @remarks
   * This class is instantiated by other classes within this project and should not need to be directly instantiated by a developer utilizing this library.
   *
   * If you elect to pass in {@link AsyncValidatorTemplate}s via the `asyncValidatorTemplates` property of the {@link AsyncValidatorSuiteConstructorArgs} object, instances of {@link AsyncValidator} will
   * be created for you. This is useful when you are creating a validator for a complex type. You can declare the template directly in the constructor for that class, and benefit from type hints and intellisense in your
   * code editor.
   *
   * Alternatively, instances of {@link AbstractAsyncValidator} can be provided. This can be useful if you want to reuse the same validator throughout your project.
   *
   * If neither validators nor templates are provided, the validator suite will always produce an Observable which will emit a result with a validity property of {@link Validity.Valid} and an empty messages array.
   */
  public constructor({
    asyncValidators = [],
    asyncValidatorTemplates = [],
  }: AsyncValidatorSuiteConstructorArgs<Value>) {
    super();
    this.validators = asyncValidators.concat(
      asyncValidatorTemplates.map(
        template => new AsyncValidator<Value>(template),
      ),
    );
    this.validatorSubscriptions = new Array<Subscription>(
      this.validators.length,
    );
  }

  /**
   * Validates the provided value against a collection of validators.
   *
   * @param value - The value to be validated.
   * @returns An {@link Observable} that emits an object containing the provided value, its {@link Validity}, and an array of associated {@link Message}s.
   */
  public validate(value: Value): Observable<StateWithMessages<Value>> {
    this.unsubscribeAll();
    return new Observable<StateWithMessages<Value>>(subscriber => {
      if (!this.validators.length) {
        subscriber.next({
          value,
          validity: Validity.Valid,
          messages: [],
        });
        subscriber.complete();
      } else {
        const suiteResult: StateWithMessages<Value> = {
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
