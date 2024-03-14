import type { Subscription } from 'rxjs';
import type {
  Identifiable,
  Nameable,
  NameableObject,
  Resettable,
  Stateful,
} from '../../../shared';
import type {
  ConfirmMethodArgs,
  FormValue,
  FormConstituents,
  FormState,
} from '../../types';
import type { Message } from '../../../state';

export abstract class AbstractForm<
    Name extends string,
    Constituents extends FormConstituents,
  >
  implements
    Nameable<Name>,
    Identifiable,
    Stateful<FormState<Constituents>>,
    Resettable
{
  public abstract name: Name;
  public abstract id: string;
  public abstract formElements: NameableObject<Constituents['formElements']>;
  public abstract groups: NameableObject<Constituents['groups']>;
  public abstract derivedValues: NameableObject<Constituents['derivedValues']>;
  public abstract state: FormState<Constituents>;
  public abstract confirmationAttempted: boolean;
  public abstract subscribeToState(
    cb: (state: FormState<Constituents>) => void,
  ): Subscription;
  public abstract subscribeToConfirmationAttempted(
    cb: (confirmationAttempted: boolean) => void,
  ): Subscription;
  public abstract setMessages(messages: Message[]): void;
  public abstract confirm(
    args?: ConfirmMethodArgs<FormValue<Constituents>>,
  ): void;
  public abstract reset(): void;
}
