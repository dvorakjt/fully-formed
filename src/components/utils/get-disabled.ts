import type { AnyField } from '../../model';

export type GetDisabledArgs<Field extends AnyField> = {
  fieldState: Field['state'];
  disabled?: boolean;
  disabledWhenExcluded?: boolean;
};

export function getDisabled<Field extends AnyField>({
  fieldState,
  disabled,
  disabledWhenExcluded,
}: GetDisabledArgs<Field>): boolean {
  return !!(
    disabled ||
    (disabledWhenExcluded && 'exclude' in fieldState && fieldState.exclude)
  );
}
