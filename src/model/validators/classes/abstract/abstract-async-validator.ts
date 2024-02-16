import type { Observable } from 'rxjs';
import type { ValidatorResult } from '../../types';

export abstract class AbstractAsyncValidator<T> {
  public abstract validate(value: T): Observable<ValidatorResult<T>>;
}
