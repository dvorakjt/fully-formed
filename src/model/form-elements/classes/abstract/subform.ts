import { AbstractSubForm } from './abstract-subform';
import {
  StateManager,
  Validity,
  type AbstractStateManager,
  type Message,
} from '../../../state';
import { 
  NameableObjectFactory, 
  FormReducerFactory,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  FormFactory
} from '../../../factories';
import type { Subscription } from 'rxjs';
import type { AbstractFormReducer } from '../../../reducers';
import type {
  FormConstituents,
  FormState,
  FormValue,
  ConfirmMethodArgs,
  SubFormConstructorArgs,
} from '../../types';
import type { NameableObject, Resettable } from '../../../shared';

/**
 * Provides a partial implementation of the {@link AbstractSubForm} class, to be
 * completed with constituents, transience, and other settings by passing a 
 * template to the `createSubForm()` method of the {@link FormFactory} class.
 * 
 * @typeParam Name - A string literal representing the name of the form.
 * 
 * @typeParam Contituents - An object extending {@link FormConstituents}.
 * 
 * @typeParam Transient -  Represents whether or not the value of the sub-form
 * will be included in the value of its parent form.
 */
export class SubForm<
  Name extends string,
  Constituents extends FormConstituents,
  Transient extends boolean = false,
> extends AbstractSubForm<Name, Constituents, Transient> {
  public readonly name: Name;
  public readonly id: string;
  public readonly transient: Transient;
  public readonly formElements: NameableObject<Constituents['formElements']>;
  public readonly groups: NameableObject<Constituents['groups']>;
  public readonly derivedValues: NameableObject<Constituents['derivedValues']>;
  private stateManager: AbstractStateManager<FormState<Constituents>>;
  private confirmationAttemptedManager: AbstractStateManager<boolean>;
  private reducer: AbstractFormReducer<Constituents>;
  private validMessage?: string;
  private pendingMessage?: string;
  private invalidMessage?: string;

  public get state(): FormState<Constituents> {
    return this.stateManager.state;
  }

  private set state(state: FormState<Constituents>) {
    this.stateManager.state = state;
  }

  public get confirmationAttempted(): boolean {
    return this.confirmationAttemptedManager.state;
  }

  private set confirmationAttempted(confirmationAttempted: boolean) {
    this.confirmationAttemptedManager.state = confirmationAttempted;
  }

  public constructor({
    name,
    id = name,
    formElements,
    adapters,
    groups,
    derivedValues,
    transient,
    validMessage,
    pendingMessage,
    invalidMessage,
    autoTrim = false,
  }: SubFormConstructorArgs<Name, Constituents, Transient>) {
    super();
    this.name = name;
    this.id = id;
    this.transient = !!transient as Transient;
    this.formElements =
      NameableObjectFactory.createNameableObjectFromArray(formElements);
    this.groups = NameableObjectFactory.createNameableObjectFromArray(groups);
    this.derivedValues =
      NameableObjectFactory.createNameableObjectFromArray(derivedValues);
    this.validMessage = validMessage;
    this.pendingMessage = pendingMessage;
    this.invalidMessage = invalidMessage;
    this.reducer = FormReducerFactory.createFormReducer<Constituents>({
      formElements,
      customAdapters: adapters,
      groups,
      autoTrim,
    });
    this.stateManager = new StateManager<FormState<Constituents>>(
      this.getInitialState(),
    );
    this.confirmationAttemptedManager = new StateManager<boolean>(false);
    this.subscribeToReducer();
  }

  /**
   * Executes a callback function whenever the state of the form changes.
   *
   * @param cb - The callback function to be executed when the state of the
   * form changes.
   *
   * @returns An RxJS {@link Subscription}.
   */
  public subscribeToState(
    cb: (state: FormState<Constituents>) => void,
  ): Subscription {
    return this.stateManager.subscribeToState(cb);
  }

  /**
   * Executes a callback function whenever `confirmationAttempted` property of 
   * the form changes.
   *
   * @param cb - The callback function to be executed when the 
   * `confirmationAttempted` property of the form changes.
   *
   * @returns An RxJS {@link Subscription}.
   */
  public subscribeToConfirmationAttempted(
    cb: (confirmationAttempted: boolean) => void,
  ): Subscription {
    return this.confirmationAttemptedManager.subscribeToState(cb);
  }

  /**
   * Sets the `messages` property of the state of the form.
   * 
   * @param messages - The array of {@link Message}s to set to the `messages` 
   * property of the state of the form.
   */
  public setMessages(messages: Message[]): void {
    this.state = {
      ...this.state,
      messages,
    };
  }

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
  public confirm(args?: ConfirmMethodArgs<FormValue<Constituents>>): void {
    this.confirmSubForms();
    this.confirmationAttempted = true;
    if (this.state.validity === Validity.Valid && args?.onSuccess) {
      args.onSuccess(this.state.value);
    } else if (args?.onFailure) {
      args.onFailure();
    }
  }

  /**
   * Resets the `confirmationAttempted` property of the form and calls the 
   * `reset()` methods of each of its form elements.
   */
  public reset(): void {
    this.confirmationAttempted = false;
    for (const formElement of Object.values(this.formElements)) {
      (formElement as Resettable).reset();
    }
  }

  private getInitialState(): FormState<Constituents> {
    return {
      ...this.reducer.state,
      messages: this.getAutomaticMessages(this.reducer.state.validity),
    };
  }

  private subscribeToReducer(): void {
    this.reducer.subscribeToState(state => {
      this.state = {
        ...state,
        messages: this.getAutomaticMessages(state.validity),
      };
    });
  }

  private getAutomaticMessages(validity: Validity): Message[] {
    const messages: Message[] = [];
    switch (validity) {
      case Validity.Valid:
        if (this.validMessage) {
          messages.push({
            text: this.validMessage,
            validity: Validity.Valid,
          });
        }
        break;
      case Validity.Pending:
        if (this.pendingMessage) {
          messages.push({
            text: this.pendingMessage,
            validity: Validity.Pending,
          });
        }
        break;
      case Validity.Invalid:
        if (this.invalidMessage) {
          messages.push({
            text: this.invalidMessage,
            validity: Validity.Invalid,
          });
        }
        break;
    }
    return messages;
  }

  private confirmSubForms(): void {
    for (const formElement of Object.values(this.formElements)) {
      if (formElement instanceof AbstractSubForm) {
        formElement.confirm();
      }
    }
  }
}
