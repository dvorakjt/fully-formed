import { Subject, type Subscription } from 'rxjs';
import {
  type AsyncValidatorSuite,
  type ValidatedState,
  type MessageBearerState,
} from '../model';

type AsyncValidatorContainerConstructorArgs<T> = {
  asyncValidatorSuite: AsyncValidatorSuite<T>;
};

/**
 * Funnels all results produced by the `validate()` method of an
 * {@link AbstractAsyncValidatorSuite} through a single {@link Subject}.
 */
export class AsyncValidatorSuiteContainer<T> {
  private subject: Subject<ValidatedState<T> & MessageBearerState> =
    new Subject<ValidatedState<T> & MessageBearerState>();
  private asyncValidatorSuite: AsyncValidatorSuite<T>;

  public constructor({
    asyncValidatorSuite,
  }: AsyncValidatorContainerConstructorArgs<T>) {
    this.asyncValidatorSuite = asyncValidatorSuite;
  }

  /**
   * Validates a value against its {@link AbstractAsyncValidatorSuite} and emits
   * the result to any subscribers.
   *
   * @param value - The value to be validated.
   */
  public validate(value: T, defaultToCaution: boolean): void {
    this.asyncValidatorSuite
      .validate(value, defaultToCaution)
      .subscribe(result => this.subject.next(result));
  }

  /**
   * Calls the provided callback function in response to any new results
   * produced by the validate() method of its
   * {@link AbstractAsyncValidatorSuite}.
   *
   * @param cb - The callback function to be called in response to new
   * validation results.
   * @returns A {@link Subscription}.
   */
  public subscribe(
    cb: (stateWithMessages: ValidatedState<T> & MessageBearerState) => void,
  ): Subscription {
    return this.subject.subscribe(cb);
  }
}
