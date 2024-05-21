import { ValidityReducer } from './validity-reducer';
import { Validity } from '../../shared';
import type { ValidityReducerMemberState } from '../types';
import type { FormChild } from '../../form-elements';
import type { IGroup } from '../../groups';
import type { IAdapter } from '../../adapters';

type FormValidityReducerConstructorParams = {
  transientFields: readonly FormChild[];
  groups: readonly IGroup[];
  adapters: readonly IAdapter[];
};

export class FormValidityReducer {
  private adapterReducer: ValidityReducer;
  private transientElementReducer: ValidityReducer;
  private groupReducer: ValidityReducer;

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
    transientFields,
    groups,
    adapters,
  }: FormValidityReducerConstructorParams) {
    this.adapterReducer = new ValidityReducer({ members: adapters });
    this.transientElementReducer = new ValidityReducer({
      members: transientFields,
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
