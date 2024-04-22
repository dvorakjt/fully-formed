import {
  Validity,
  type InteractableState,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type Interactable,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type AbstractField,
} from '../../../model';

/**
 * A static class containing methods for various common operations that one
 * might wish to perform against state, validity, etc.
 */
export class Utils {
  /**
   * Processes items of type {@link Validity} and returns:
   * - {@link Validity.Invalid} if at least one item is
   * {@link Validity.Invalid}.
   * - {@link Validity.Pending} if no items are {@link Validity.Invalid} and at
   * least one item is {@link Validity.Pending}.
   * - {@link Validity.Valid} if no items are {@link Validity.Invalid} or
   * {@link Validity.Pending}.
   *
   * @param args - Any number of items of type {@link Validity}.
   */
  public static reduceValidity(...args: Validity[]): Validity {
    let atLeastOneValidityIsPending = false;

    for (const validity of args) {
      if (validity === Validity.Invalid) return Validity.Invalid;
      else if (validity === Validity.Pending)
        atLeastOneValidityIsPending = true;
    }

    return atLeastOneValidityIsPending ? Validity.Pending : Validity.Valid;
  }

  /**
   * Returns `true` if the `focused`, `visited` and `modified` properties of
   * the {@link InteractableState} it receives are all `false`.
   *
   * @param interactableState - The state of a class implementing the
   * {@link Interactable} interface (usually, an {@link AbstractField}).
   *
   * @returns A boolean value indicating whether an interaction of any kind has
   * occurred.
   */
  public static isPristine(interactableState: InteractableState): boolean {
    return !(
      interactableState.focused ||
      interactableState.visited ||
      interactableState.modified
    );
  }

  /**
   * Returns `true` if the `visited` and `modified` properties of the
   * {@link InteractableState} it receives are both `false`.
   *
   * @param interactableState - The state of a class implementing the
   * {@link Interactable} interface (usually, an {@link AbstractField}).
   *
   * @returns A boolean value indicating whether the user has visited or
   * modified the field.
   *
   * @remarks Useful for determining whether or not a user has interacted with
   * a field in such a way that things like error messages should be revealed.
   */
  public static isClean(interactableState: InteractableState): boolean {
    return !(interactableState.visited || interactableState.modified);
  }
}
