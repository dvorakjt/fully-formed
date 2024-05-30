import { ValidityReducer } from './validity-reducer';
import { Validity } from '../../shared';
import type { ValidityReducerMemberState } from '../types';
import type { FormChild } from '../../form-elements';
import type { IGroup } from '../../groups';
import type { IAdapter } from '../../adapters';

type FormValidityReducerConstructorParams = {
  nonTransientFieldsAndAdapters: ReadonlyArray<FormChild | IAdapter>;
  transientFields: readonly FormChild[];
  groups: readonly IGroup[];
};

export class FormValidityReducer {
  private nonTransientFieldsAndAdaptersReducer: ValidityReducer;
  private transientElementReducer: ValidityReducer;
  private groupReducer: ValidityReducer;

  public get validity(): Validity {
    if (
      this.nonTransientFieldsAndAdaptersReducer.validity === Validity.Invalid ||
      this.transientElementReducer.validity === Validity.Invalid ||
      this.groupReducer.validity === Validity.Invalid
    ) {
      return Validity.Invalid;
    }
    if (
      this.nonTransientFieldsAndAdaptersReducer.validity === Validity.Pending ||
      this.transientElementReducer.validity === Validity.Pending ||
      this.groupReducer.validity === Validity.Pending
    ) {
      return Validity.Pending;
    }
    return Validity.Valid;
  }

  public constructor({
    nonTransientFieldsAndAdapters,
    transientFields,
    groups,
  }: FormValidityReducerConstructorParams) {
    this.nonTransientFieldsAndAdaptersReducer = new ValidityReducer({
      members: nonTransientFieldsAndAdapters,
    });

    this.transientElementReducer = new ValidityReducer({
      members: transientFields,
    });

    this.groupReducer = new ValidityReducer({ members: groups });
  }

  public processNonTransientFieldOrAdapterStateUpdate(
    name: string,
    state: ValidityReducerMemberState,
  ): void {
    this.nonTransientFieldsAndAdaptersReducer.processMemberStateUpdate(
      name,
      state,
    );
  }

  public processTransientElementStateUpdate(
    name: string,
    state: ValidityReducerMemberState,
  ): void {
    this.transientElementReducer.processMemberStateUpdate(name, state);
  }

  public processGroupStateUpdate(
    name: string,
    state: ValidityReducerMemberState,
  ): void {
    this.groupReducer.processMemberStateUpdate(name, state);
  }
}
