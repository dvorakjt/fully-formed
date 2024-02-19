import { Subject, type Subscription } from 'rxjs';
import {
  type AbstractAsyncValidatorSuite,
  type StateWithMessages,
} from '../../../model';

type AsyncValidatorContainerConstructorArgs<T> = {
  asyncValidatorSuite: AbstractAsyncValidatorSuite<T>;
};

/**
 * Funnels all results produced by the validate() method of an {@link AbstractAsyncValidatorSuite} through a single {@link Subject}. This enables output of the suite to be tested for unexpected results.
 */
export class AsyncValidatorSuiteContainer<T> {
  private subject: Subject<StateWithMessages<T>> = new Subject<
    StateWithMessages<T>
  >();
  private asyncValidatorSuite: AbstractAsyncValidatorSuite<T>;

  /**
   * @param argsObject - An object containing the required property `asyncValidatorSuite`, which refers to the {@link AbstractAsyncValidatorSuite} to be contained by the resultant instance of this class.
   */
  public constructor({
    asyncValidatorSuite,
  }: AsyncValidatorContainerConstructorArgs<T>) {
    this.asyncValidatorSuite = asyncValidatorSuite;
  }

  /**
   * Validates a value against its {@link AbstractAsyncValidatorSuite} and emits the result to any subscribers.
   * 
   * @param value - The value to be validated.
   */
  public validate(value: T): void {
    this.asyncValidatorSuite
      .validate(value)
      .subscribe(result => this.subject.next(result));
  }

  /**
   * Calls the provided callback function in response to any new results produced by the validate() method of its {@link AbstractAsyncValidatorSuite}.
   * 
   * @param cb - The callback function to be called in response to new validation results.
   * @returns A {@link Subscription}.
   */
  public subscribe(
    cb: (stateWithMessages: StateWithMessages<T>) => void,
  ): Subscription {
    return this.subject.subscribe(cb);
  }
}
