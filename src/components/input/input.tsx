import React, { type CSSProperties, type ReactNode } from 'react';
import { useConfirmationAttempted, useStatefulEntityState } from '../../hooks';
import { useGroupValidation } from '../../hooks/use-group-validation';
import { joinClassNames } from '../utils';
import type {
  AbstractField,
  AbstractForm,
  AbstractGroup,
  FormConstituents,
  GroupMembers,
  PickSingleTypeFormElements,
} from '../../model';
import type { GetInputClassName, GetInputStyle } from '../types';

//should probably be group names not groups
export type InputProps<
  ParentForm extends AbstractForm<string, FormConstituents>,
  FieldName extends keyof PickSingleTypeFormElements<
    ParentForm,
    AbstractField<string, string, boolean>
  >,
> = {
  form: ParentForm;
  fieldName: FieldName;
  type: string;
  groups?: Array<AbstractGroup<string, GroupMembers>>;
  className?: string;
  getClassName?: GetInputClassName<ParentForm['formElements'][FieldName]>;
  style?: CSSProperties;
  getStyle?: GetInputStyle<ParentForm['formElements'][FieldName]>;
};

export function Input<
  ParentForm extends AbstractForm<string, FormConstituents>,
  FieldName extends keyof PickSingleTypeFormElements<
    ParentForm,
    AbstractField<string, string, boolean>
  >,
>({
  form,
  fieldName,
  type,
  groups = [],
  className,
  getClassName,
  style,
  getStyle,
}: InputProps<ParentForm, FieldName>): ReactNode {
  const field = form.formElements[
    fieldName as keyof typeof form.formElements
  ] as AbstractField<string, string, boolean>;
  const fieldState = useStatefulEntityState(field);
  const confirmationAttempted = useConfirmationAttempted(form);
  const groupValidity = useGroupValidation(groups);

  return (
    <input
      id={field.id}
      name={field.name}
      type={type}
      value={fieldState.value}
      onChange={({ target }) => field.setValue(target.value)}
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
    />
  );
}