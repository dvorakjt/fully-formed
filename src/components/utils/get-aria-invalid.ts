import { Validity, type FieldState } from '../../model';
import { Utils } from '../../utils';

export function getAriaInvalid(
  fieldState: FieldState<unknown>,
  confirmationAttempted: boolean,
  groupValidity: Validity,
): boolean {
  return (
    (!Utils.isClean(fieldState) || confirmationAttempted) &&
    Utils.reduceValidity(fieldState.validity, groupValidity) ===
      Validity.Invalid
  );
}
