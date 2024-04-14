import type { Validity } from '../../../state';
import type { ValidityReducerMemberState } from '../../types';

/**
 * Processes the states of adapters, transient form elements, and groups and
 * reduces the validities of each of those elements into a single value.
 */
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
