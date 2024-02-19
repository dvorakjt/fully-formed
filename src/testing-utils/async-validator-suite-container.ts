import { Subject, type Subscription } from 'rxjs';
import {
  type AbstractAsyncValidatorSuite,
  type StateWithMessages,
} from '../model';

type AsyncValidatorContainerConstructorArgs<T> = {
  asyncValidatorSuite: AbstractAsyncValidatorSuite<T>;
};

export class AsyncValidatorSuiteContainer<T> {
  private subject: Subject<StateWithMessages<T>> = new Subject<
    StateWithMessages<T>
  >();
  private asyncValidatorSuite: AbstractAsyncValidatorSuite<T>;

  public constructor({
    asyncValidatorSuite,
  }: AsyncValidatorContainerConstructorArgs<T>) {
    this.asyncValidatorSuite = asyncValidatorSuite;
  }

  public setValue(value: T): void {
    this.asyncValidatorSuite
      .validate(value)
      .subscribe(result => this.subject.next(result));
  }

  public subscribe(
    cb: (stateWithMessages: StateWithMessages<T>) => void,
  ): Subscription {
    return this.subject.subscribe(cb);
  }
}
