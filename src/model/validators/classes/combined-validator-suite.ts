import { ValidatorSuite } from './validator-suite';
import { AsyncValidatorSuite } from './async-validator-suite';
import {
  Validity,
  type ValidatedState,
  type MessageBearerState,
} from '../../shared';
import type { Observable } from 'rxjs';
import type { ValidatorTemplate, AsyncValidatorTemplate } from '../types';
import type { IAsyncValidator, IValidator } from '../interfaces';

type CombinedValidatorSuiteConstructorParams<T> = {
  validators?: Array<IValidator<T>>;
  validatorTemplates?: Array<ValidatorTemplate<T>>;
  asyncValidators?: Array<IAsyncValidator<T>>;
  asyncValidatorTemplates?: Array<AsyncValidatorTemplate<T>>;
  pendingMessage?: string;
};

type CombinedValidatorSuiteResult<T> = {
  syncResult: ValidatedState<T> & MessageBearerState;
  observableResult?: Observable<ValidatedState<T> & MessageBearerState>;
};

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
      });
    }
    this.pendingMessage = pendingMessage;
  }

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
    asyncValidators: Array<IAsyncValidator<T>> | undefined,
    asyncValidatorTemplates: Array<AsyncValidatorTemplate<T>> | undefined,
  ): boolean {
    return !!(
      (asyncValidators && asyncValidators.length) ||
      (asyncValidatorTemplates && asyncValidatorTemplates.length)
    );
  }
}
