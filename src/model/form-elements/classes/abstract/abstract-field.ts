import type { Subscription } from 'rxjs';
import type {
  Identifiable,
  Nameable,
  Stateful,
  PossiblyTransient,
  Resettable,
  Interactable,
} from '../../../shared';
import type { FieldState } from '../../types';

export abstract class AbstractField<
    Name extends string,
    Value,
    Transient extends boolean,
  >
  implements
    Nameable<Name>,
    Identifiable,
    Stateful<FieldState<Value>>,
    PossiblyTransient<Transient>,
    Interactable,
    Resettable
{
  public abstract name: Name;
  public abstract id: string;
  public abstract state: FieldState<Value>;
  public abstract transient: Transient;
  public abstract setValue(value: Value): void;
  public abstract subscribeToState(
    cb: (state: FieldState<Value>) => void,
  ): Subscription;
  public abstract focus(): void;
  public abstract visit(): void;
  public abstract reset(): void;
}
