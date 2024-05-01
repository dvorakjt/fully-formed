import React from 'react';
import {
  useFieldState,
  useConfirmationAttempted,
  useGroupValidation,
} from '../../../hooks';
import type { AnyForm, AnyStringTypeField, FormChild } from '../../../model';
import type { FFTextAreaProps } from './ff-textarea-props.type';
import {
  getAriaDescribedBy,
  getAriaInvalid,
  getDisabled,
  joinClassNames,
} from '../../utils';

export function FFTextArea<
  Form extends AnyForm,
  Field extends FormChild<Form, AnyStringTypeField>,
>({
  form,
  field,
  groups = [],
  className,
  getClassName,
  style,
  getStyle,
  autoCapitalize,
  autoComplete,
  autoCorrect,
  autoFocus,
  cols,
  disabled,
  disabledWhenExcluded,
  maxLength,
  placeholder,
  readOnly,
  rows,
  spellCheck,
  wrap,
  ['aria-required']: ariaRequired,
  ['aria-describedby']: ariaDescribedBy,
}: FFTextAreaProps<Form, Field>): React.JSX.Element {
  const fieldState = useFieldState(field);
  const confirmationAttempted = useConfirmationAttempted(form);
  const groupValidity = useGroupValidation(...groups);

  return (
    <textarea
      name={field.name}
      id={field.id}
      value={fieldState.value}
      onChange={e => field.setValue((e.target as HTMLTextAreaElement).value)}
      onFocus={() => field.focus()}
      onBlur={() => field.visit()}
      className={joinClassNames(
        className,
        getClassName &&
          getClassName({ fieldState, confirmationAttempted, groupValidity }),
      )}
      style={{
        ...style,
        ...(getStyle &&
          getStyle({ fieldState, confirmationAttempted, groupValidity })),
      }}
      cols={cols}
      rows={rows}
      disabled={getDisabled({ fieldState, disabled, disabledWhenExcluded })}
      readOnly={readOnly}
      aria-readonly={readOnly}
      aria-required={ariaRequired}
      aria-describedby={getAriaDescribedBy(field.id, ariaDescribedBy)}
      aria-invalid={getAriaInvalid(
        fieldState,
        confirmationAttempted,
        groupValidity,
      )}
      autoFocus={autoFocus}
      autoCapitalize={autoCapitalize}
      autoComplete={autoComplete}
      autoCorrect={autoCorrect}
      placeholder={placeholder}
      maxLength={maxLength}
      spellCheck={spellCheck}
      wrap={wrap}
    />
  );
}
