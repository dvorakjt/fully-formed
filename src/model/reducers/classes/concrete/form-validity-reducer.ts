import { ValidityReducer } from './validity-reducer';
import { Validity } from '../../../state';
import {
  AbstractFormValidityReducer,
  type AbstractValidityReducer,
} from '../abstract';
import type {
  ValidityReducerMemberState,
  FormValidityReducerConstructorArgs,
} from '../../types';

/**
 * Processes the states of adapters, transient form elements, and groups and 
 * reduces the validities of each of those elements into a single value.
 */
export class FormValidityReducer extends AbstractFormValidityReducer {
  private adapterReducer: AbstractValidityReducer;
  private transientElementReducer: AbstractValidityReducer;
  private groupReducer: AbstractValidityReducer;

  public get validity(): Validity {
    if (
      this.adapterReducer.validity === Validity.Invalid ||
      this.transientElementReducer.validity === Validity.Invalid ||
      this.groupReducer.validity === Validity.Invalid
    ) {
      return Validity.Invalid;
    }
    if (
      this.adapterReducer.validity === Validity.Pending ||
      this.transientElementReducer.validity === Validity.Pending ||
      this.groupReducer.validity === Validity.Pending
    ) {
      return Validity.Pending;
    }
    return Validity.Valid;
  }

  public constructor({
    adapters,
    transientFormElements,
    groups,
  }: FormValidityReducerConstructorArgs) {
    super();
    this.adapterReducer = new ValidityReducer({ members: adapters });
    this.transientElementReducer = new ValidityReducer({
      members: transientFormElements,
    });
    this.groupReducer = new ValidityReducer({ members: groups });
  }

  public processAdapterStateUpdate(
    adapterName: string,
    state: ValidityReducerMemberState,
  ): void {
    this.adapterReducer.processMemberStateUpdate(adapterName, state);
  }

  public processTransientElementStateUpdate(
    elementName: string,
    state: ValidityReducerMemberState,
  ): void {
    this.transientElementReducer.processMemberStateUpdate(elementName, state);
  }

  public processGroupStateUpdate(
    groupName: string,
    state: ValidityReducerMemberState,
  ): void {
    this.groupReducer.processMemberStateUpdate(groupName, state);
  }
}
