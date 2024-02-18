import { Observable, type Subscription } from 'rxjs';
import {
  AbstractAsyncValidatorSuite,
  type AbstractAsyncValidator,
} from '../abstract';
import { AsyncValidator } from './async-validator';
import { Validity, type StateWithMessages } from '../../../state';
import type { AsyncValidatorSuiteConstructorArgs } from '../../types';

export class AsyncValidatorSuite<
  Value,
> extends AbstractAsyncValidatorSuite<Value> {
  private validators: Array<AbstractAsyncValidator<Value>>;
  private validatorSubscriptions: Subscription[];

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
