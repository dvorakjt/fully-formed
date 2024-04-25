import React, { type FormEventHandler } from 'react';
import { useConfirmationAttempted, useValidity } from '../../../hooks';
import { getMessagesContainerId, joinClassNames } from '../../utils';
import type { AnyForm } from '../../../model';
import type { FFFormProps } from './ff-form-props.type';

export function FFForm<Form extends AnyForm>({
  form,
  onConfirmSuccess,
  onConfirmFailure,
  acceptCharset,
  autoCapitalize,
  autoComplete,
  ['aria-label']: ariaLabel,
  ['aria-labelledby']: ariaLabelledBy,
  className,
  getClassName,
  style,
  getStyle,
  children,
}: FFFormProps<Form>): React.JSX.Element {
  const validity = useValidity(form);
  const confirmationAttempted = useConfirmationAttempted(form);
  const onSubmit: FormEventHandler = e => {
    e.preventDefault();
    form.confirm({
      onSuccess: onConfirmSuccess,
      onFailure: onConfirmFailure,
    });
  };

  return (
    <form
      name={form.name}
      id={form.id}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={getMessagesContainerId(form.id)}
      onSubmit={onSubmit}
      acceptCharset={acceptCharset}
      autoCapitalize={autoCapitalize}
      autoComplete={autoComplete}
      className={joinClassNames(
        className,
        getClassName && getClassName({ validity, confirmationAttempted }),
      )}
      style={{
        ...style,
        ...(getStyle && getStyle({ validity, confirmationAttempted })),
      }}
    >
      {children}
    </form>
  );
}
