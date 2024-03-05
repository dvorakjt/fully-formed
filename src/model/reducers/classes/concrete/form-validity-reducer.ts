import { ValidityReducer } from './validity-reducer';
import { AbstractFormValidityReducer } from '../abstract';
import { Validity } from '../../../state';
import type { ValidityReducerMemberState } from '../../types';

export class FormValidityReducer extends AbstractFormValidityReducer {
  private adapterReducer = new ValidityReducer();
  private transientElementReducer = new ValidityReducer();
  private groupReducer = new ValidityReducer();

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

  public processAdapterState(
    adapterName: string,
    state: ValidityReducerMemberState,
  ): void {
    this.adapterReducer.processMemberState(adapterName, state);
  }

  public processTransientElementState(
    elementName: string,
    state: ValidityReducerMemberState,
  ): void {
    this.transientElementReducer.processMemberState(elementName, state);
  }

  public processGroupState(
    groupName: string,
    state: ValidityReducerMemberState,
  ): void {
    this.groupReducer.processMemberState(groupName, state);
  }
}
