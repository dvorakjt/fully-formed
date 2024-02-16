import type { Observable } from 'rxjs';
import type { StateWithMessages } from '../../../state';

export abstract class AbstractAsyncValidatorSuite<T> {
  public abstract validate(value: T): Observable<StateWithMessages<T>>;
}
