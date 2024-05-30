import type { Observable } from 'rxjs';
import type { ValidatorResult } from '../types';

export interface IAsyncValidator<T> {
  validate(value: T): Promise<ValidatorResult> | Observable<ValidatorResult>;
}
