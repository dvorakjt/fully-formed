import type { Subscription } from 'rxjs';
import type { Nameable } from '../../../shared';

export abstract class AbstractDerivedValue<Name extends string, Value>
  implements Nameable<Name>
{
  public abstract name: Name;
  public abstract value: Value;
  public abstract subscribeToValue(cb: (value: Value) => void): Subscription;
}
