import type { Validity } from '../../../state';
import type { ValidityReducerMemberState } from '../../types';

export abstract class AbstractFormValidityReducer {
  public abstract validity: Validity;
  public abstract processAdapterStateUpdate(
    adapterName: string,
    state: ValidityReducerMemberState,
  ): void;
  public abstract processTransientElementStateUpdate(
    elementName: string,
    state: ValidityReducerMemberState,
  ): void;
  public abstract processGroupStateUpdate(
    groupName: string,
    state: ValidityReducerMemberState,
  ): void;
}
