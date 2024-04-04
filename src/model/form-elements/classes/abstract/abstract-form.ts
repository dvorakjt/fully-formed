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

/**
 * Defines the structure of a form and maintains its state.
 * 
 * @typeParam Name - A string literal representing the name of the form.
 * 
 * @typeParam Contituents - An object extending {@link FormConstituents}.
 */
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
  /**
   * Executes a callback function whenever the state of the form changes.
   *
   * @param cb - The callback function to be executed when the state of the
   * form changes.
   *
   * @returns An RxJS {@link Subscription}.
   */
  public abstract subscribeToState(
    cb: (state: FormState<Constituents>) => void,
  ): Subscription;
  /**
   * Executes a callback function whenever `confirmationAttempted` property of 
   * the form changes.
   *
   * @param cb - The callback function to be executed when the 
   * `confirmationAttempted` property of the form changes.
   *
   * @returns An RxJS {@link Subscription}.
   */
  public abstract subscribeToConfirmationAttempted(
    cb: (confirmationAttempted: boolean) => void,
  ): Subscription;
  /**
   * Sets the `messages` property of the state of the form.
   * 
   * @param messages - The array of {@link Message}s to set to the `messages` 
   * property of the state of the form.
   */
  public abstract setMessages(messages: Message[]): void;
  /**
   * If the form is valid and the object provided as an argument contains an 
   * `onSuccess()` method, the `onSuccess()` method is called with the
   * current value of the form.
   * 
   * If the form is not valid and the object provided as an argument contains an
   * `onFailure()` method, that method is called instead.
   * 
   * In either case, sets the `confirmationAttempted` property of the form to 
   * true.
   * 
   * @remarks
   * This method provides a means of checking the validity of the form before
   * performing some operation, such as making an API call to a server, with
   * the form data. Additionally, it provides a means of performing a 
   * different operation, such as displaying an error message to the user,
   * when the form is not valid. Finally, the `confirmationAttempted` property
   * of the form can be used to reveal error messages once the user has 
   * attempted to submit the form, if that is the desired user experience.
   */
  public abstract confirm(
    args?: ConfirmMethodArgs<FormValue<Constituents>>,
  ): void;
  /**
   * Resets the `confirmationAttempted` property of the form and calls the 
   * `reset()` methods of each of its form elements.
   */
  public abstract reset(): void;
}
