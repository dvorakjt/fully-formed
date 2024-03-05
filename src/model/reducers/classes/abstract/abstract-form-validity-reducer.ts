import type { Validity } from '../../../state';
import type { ValidityReducerMemberState } from '../../types';

export abstract class AbstractFormValidityReducer {
  public abstract validity: Validity;
  public abstract processAdapterState(
    adapterName: string,
    state: ValidityReducerMemberState,
  ): void;
  public abstract processTransientElementState(
    elementName: string,
    state: ValidityReducerMemberState,
  ): void;
  public abstract processGroupState(
    groupName: string,
    state: ValidityReducerMemberState,
  ): void;
}
