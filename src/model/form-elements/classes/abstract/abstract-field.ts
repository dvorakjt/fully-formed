import type { Subscription } from 'rxjs';
import type {
  Identifiable,
  Nameable,
  Stateful,
  PossiblyExcludable,
  PossiblyTransient,
  Exclude,
  Resettable,
} from '../../../shared';
import type { FieldState } from '../../types';

export abstract class AbstractField<
    Name extends string,
    Value,
    Transient extends boolean,
    Excludable extends boolean,
  >
  implements
    Nameable<Name>,
    Identifiable,
    Stateful<FieldState<Value, Excludable>>,
    PossiblyTransient<Transient>,
    PossiblyExcludable<Excludable>,
    Resettable
{
  public abstract name: Name;
  public abstract id: string;
  public abstract state: FieldState<Value, Excludable>;
  public abstract excludable: Excludable;
  public abstract exclude: Exclude<Excludable>;
  public abstract transient: Transient;
  public abstract Excludable: Excludable;
  public abstract setValue(value: Value): void;
  public abstract subscribeToState(
    cb: (state: FieldState<Value, Excludable>) => void,
  ): Subscription;
  public abstract focus(): void;
  public abstract visit(): void;
  public abstract reset(): void;
}
