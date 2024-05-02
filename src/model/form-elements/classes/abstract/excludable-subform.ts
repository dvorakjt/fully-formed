import { AbstractExcludableSubForm } from './abstract-excludable-subform';
import { AbstractSubForm } from './abstract-subform';
import {
  StateManager,
  Validity,
  type AbstractStateManager,
} from '../../../state';
import {
  NameableObjectFactory,
  FormReducerFactory,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  FormFactory,
} from '../../../factories';
import type { Subscription } from 'rxjs';
import type { AbstractFormReducer } from '../../../reducers';
import type {
  FormConstituents,
  FormState,
  FormValue,
  ConfirmMethodArgs,
  ExcludableSubFormConstructorArgs,
  FormElement,
  ExcludableSubFormControlFn,
} from '../../types';
import type {
  NameableObject,
  ExcludableState,
  Resettable,
} from '../../../shared';
import type { AbstractGroup, GroupMembers } from '../../../groups';

/**
 * Provides a partial implementation of the {@link AbstractExcludableSubForm}
 * class, to be completed with constituents, transience, a controller, and other
 * settings by passing a template to the `createExcludableSubForm()` method of
 * the {@link FormFactory} class.
 *
 * @typeParam Name - A string literal representing the name of the form.
 *
 * @typeParam Contituents - An object extending {@link FormConstituents}.
 *
 * @typeParam Transient - Represents whether or not the value of the sub-form
 * will be included in the value of its parent form.
 *
 * @typeParam Controller - A form element or group whose state controls whether
 * or not the value of the form is included in its parent form's value.
 */
export class ExcludableSubForm<
  Name extends string,
  Constituents extends FormConstituents,
  Transient extends boolean,
  Controller extends FormElement | AbstractGroup<string, GroupMembers>,
> extends AbstractExcludableSubForm<Name, Constituents, Transient> {
  public readonly name: Name;
  public readonly id: string;
  public readonly transient: Transient;
  public readonly formElements: NameableObject<Constituents['formElements']>;
  public readonly groups: NameableObject<Constituents['groups']>;
  public readonly derivedValues: NameableObject<Constituents['derivedValues']>;
  private stateManager: AbstractStateManager<
    FormState<Constituents> & ExcludableState
  >;
  private confirmationAttemptedManager: AbstractStateManager<boolean>;
  private reducer: AbstractFormReducer<Constituents>;
  private excludeByDefault: boolean;
  private controller?: Controller;
  private controlFn?: ExcludableSubFormControlFn<Controller>;

  public get state(): FormState<Constituents> & ExcludableState {
    return this.stateManager.state;
  }

  private set state(state: FormState<Constituents> & ExcludableState) {
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
    excludeByDefault,
    controlledBy,
    autoTrim = false,
  }: ExcludableSubFormConstructorArgs<
    Name,
    Constituents,
    Transient,
    Controller
  >) {
    super();
    this.name = name;
    this.id = id;
    this.transient = !!transient as Transient;
    this.formElements =
      NameableObjectFactory.createNameableObjectFromArray(formElements);
    this.groups = NameableObjectFactory.createNameableObjectFromArray(groups);
    this.derivedValues =
      NameableObjectFactory.createNameableObjectFromArray(derivedValues);
    this.excludeByDefault = !!excludeByDefault;
    this.reducer = FormReducerFactory.createFormReducer<Constituents>({
      formElements,
      customAdapters: adapters,
      groups,
      autoTrim,
    });
    this.stateManager = new StateManager<
      FormState<Constituents> & ExcludableState
    >(this.getInitialState());
    this.confirmationAttemptedManager = new StateManager<boolean>(false);
    this.subscribeToReducer();
    if (controlledBy) {
      this.controller = controlledBy.controller;
      this.controlFn = controlledBy.controlFn;
      this.setExclude(this.controlFn(this.controller.state));
      this.controller.subscribeToState(state => {
        const exclude = this.controlFn!(state);
        this.setExclude(exclude);
      });
    }
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
    cb: (state: FormState<Constituents> & ExcludableState) => void,
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
   * Sets the exclude property of the state of the form to true or false.
   *
   * @param exclude - A boolean property representing whether or not to
   * exclude the value of the form from that of its parent form.
   */
  public setExclude(exclude: boolean): void {
    this.state = { ...this.state, exclude };
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
   * Resets the `confirmationAttempted` property of the form and the `exclude`
   * property of the state of the form, and calls the `reset()` methods of each
   * of its form elements.
   */
  public reset(): void {
    this.resetSelf();
    this.resetFormElements();
  }

  private resetSelf(): void {
    this.confirmationAttempted = false;
    this.state = { ...this.state, exclude: this.excludeByDefault };
    if (this.controlFn && this.controller) {
      const exclude = this.controlFn(this.controller.state);
      this.setExclude(exclude);
    }
  }

  private resetFormElements(): void {
    for (const formElement of Object.values(this.formElements)) {
      (formElement as Resettable).reset();
    }
  }

  private getInitialState(): FormState<Constituents> & ExcludableState {
    return {
      ...this.reducer.state,
      exclude: this.excludeByDefault,
    };
  }

  private subscribeToReducer(): void {
    this.reducer.subscribeToState(state => {
      this.state = {
        ...state,
        exclude: this.state.exclude,
      };
    });
  }

  private confirmSubForms(): void {
    for (const formElement of Object.values(this.formElements)) {
      if (formElement instanceof AbstractSubForm) {
        formElement.confirm();
      }
    }
  }
}
