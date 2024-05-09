import { AbstractForm } from './abstract-form';
import { AbstractSubForm } from './abstract-subform';
import {
  NameableObjectFactory,
  FormReducerFactory,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  FormFactory,
} from '../../../factories';
import {
  StateManager,
  type AbstractStateManager,
  Validity,
} from '../../../state';
import type { AbstractFormReducer } from '../../../reducers';
import type { Subscription } from 'rxjs';
import type {
  ConfirmMethodArgs,
  FormConstituents,
  FormConstructorArgs,
  FormState,
  FormValue,
} from '../../types';
import type { NameableObject, Resettable } from '../../../shared';
import type { AllowedConstituents } from '../../types';

/**
 * Provides a partial implementation of the {@link AbstractForm} class, to be
 * completed with constituents and other settings by passing a template to the
 * `createForm()` method of the {@link FormFactory} class.
 *
 * @typeParam Contituents - An object extending {@link FormConstituents}.
 */
export abstract class Form<
  Constituents extends FormConstituents & AllowedConstituents<Constituents>,
> extends AbstractForm<Constituents> {
  public readonly formElements: NameableObject<Constituents['formElements']>;
  public readonly groups: NameableObject<Constituents['groups']>;
  public readonly derivedValues: NameableObject<Constituents['derivedValues']>;
  private reducer: AbstractFormReducer<Constituents>;
  private confirmationAttemptedManager: AbstractStateManager<boolean>;

  public get state(): FormState<Constituents> {
    return this.reducer.state;
  }

  public get confirmationAttempted(): boolean {
    return this.confirmationAttemptedManager.state;
  }

  private set confirmationAttempted(confirmationAttempted: boolean) {
    this.confirmationAttemptedManager.state = confirmationAttempted;
  }

  public constructor({
    formElements,
    adapters,
    groups,
    derivedValues,
    autoTrim = false,
  }: FormConstructorArgs<Constituents>) {
    super();
    this.formElements =
      NameableObjectFactory.createNameableObjectFromArray(formElements);
    this.groups = NameableObjectFactory.createNameableObjectFromArray(groups);
    this.derivedValues =
      NameableObjectFactory.createNameableObjectFromArray(derivedValues);
    this.reducer = FormReducerFactory.createFormReducer<Constituents>({
      formElements,
      customAdapters: adapters,
      groups,
      autoTrim,
    });
    this.confirmationAttemptedManager = new StateManager<boolean>(false);
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
    return this.reducer.subscribeToState(cb);
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

  private confirmSubForms(): void {
    for (const formElement of Object.values(this.formElements)) {
      if (formElement instanceof AbstractSubForm) {
        formElement.confirm();
      }
    }
  }
}
