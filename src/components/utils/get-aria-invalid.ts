import { Validity, type FieldState } from '../../model';

export function getAriaInvalid(
  fieldState: FieldState<unknown>,
  confirmationAttempted: boolean,
  groupValidity: Validity,
): boolean {
  return (
    (fieldState.visited || fieldState.modified || confirmationAttempted) &&
    (fieldState.validity === Validity.Invalid ||
      groupValidity === Validity.Invalid)
  );
}
