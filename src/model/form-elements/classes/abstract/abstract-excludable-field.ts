import { AbstractField } from './abstract-field';
import type { Subscription } from 'rxjs';
import type { ExcludableFormElement } from '../../interfaces';
import type { ExcludableState } from '../../../shared';
import type { FieldState } from '../../types';

export abstract class AbstractExcludableField<
    Name extends string,
    Value,
    Transient extends boolean,
  >
  extends AbstractField<Name, Value, Transient>
  implements ExcludableFormElement
{
  public abstract state: FieldState<Value> & ExcludableState;
  public abstract subscribeToState(
    cb: (state: FieldState<Value> & ExcludableState) => void,
  ): Subscription;
  public abstract setExclude(exclude: boolean): void;
}
