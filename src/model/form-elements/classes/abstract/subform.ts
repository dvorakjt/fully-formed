import { AbstractSubForm } from '.';
import {
  StateManager,
  Validity,
  type AbstractStateManager,
  type Message,
} from '../../../state';
import { NameableObjectFactory, FormReducerFactory } from '../../../factories';
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

  public subscribeToState(
    cb: (state: FormState<Constituents>) => void,
  ): Subscription {
    return this.stateManager.subscribeToState(cb);
  }

  public subscribeToConfirmationAttempted(
    cb: (confirmationAttempted: boolean) => void,
  ): Subscription {
    return this.confirmationAttemptedManager.subscribeToState(cb);
  }

  public setMessages(messages: Message[]): void {
    this.state = {
      ...this.state,
      messages,
    };
  }

  public confirm(args?: ConfirmMethodArgs<FormValue<Constituents>>): void {
    this.confirmSubForms();
    this.confirmationAttempted = true;
    if (this.state.validity === Validity.Valid && args?.onSuccess) {
      args.onSuccess(this.state.value);
    } else if (args?.onFailure) {
      args.onFailure();
    }
  }

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
