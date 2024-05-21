import type { InteractiveState } from '../../form-elements';
import { GroupValiditySource, type GroupState } from '../../groups';
import { Validity, type ValidatedState } from '../../shared';

type ReduceStatesToValidityOpts = {
  pruneUnvalidatedGroupStates: boolean;
};

export class Utils {
  public static isPristine(state: InteractiveState): boolean {
    return !(
      state.isInFocus ||
      state.hasBeenBlurred ||
      state.hasBeenModified ||
      state.submitted
    );
  }

  public static isClean(state: InteractiveState): boolean {
    return !(state.hasBeenBlurred || state.hasBeenModified || state.submitted);
  }

  public static reduceStatesToValidity(
    states: ValidatedState[] | readonly ValidatedState[],
    opts?: ReduceStatesToValidityOpts,
  ): Validity {
    if (opts?.pruneUnvalidatedGroupStates) {
      states = states.filter(state => {
        return (
          !Utils.isGroupState(state) ||
          state.validitySource !== GroupValiditySource.Reduction
        );
      });
    }

    let pendingStateSeen = false;

    for (const state of states) {
      if (state.validity === Validity.Invalid) return Validity.Invalid;
      else if (state.validity === Validity.Pending) {
        pendingStateSeen = true;
      }
    }

    return pendingStateSeen ? Validity.Pending : Validity.Valid;
  }

  private static isGroupState(state: ValidatedState): state is GroupState {
    return 'validitySource' in state;
  }
}
