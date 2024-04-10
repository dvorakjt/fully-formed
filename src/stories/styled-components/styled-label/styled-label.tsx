import React from 'react';
import { FieldLabel, type FieldLabelProps } from '../../../components/labels';
import {
  Validity,
  type AnyForm,
  type AnyField,
  type ChildOfForm,
} from '../../../model';
import './styles.css';

type StyledLabelProps<
  Form extends AnyForm,
  Field extends AnyField & ChildOfForm<Form>,
> = FieldLabelProps<Form, Field> & {
  className?: never;
  getClassName?: never;
  style?: never;
  getStyle?: never;
};

export function StyledLabel<
  Form extends AnyForm,
  Field extends AnyField & ChildOfForm<Form>,
>({
  field,
  form,
  groups,
  children,
}: StyledLabelProps<Form, Field>): React.JSX.Element {
  return (
    <FieldLabel
      field={field}
      form={form}
      groups={groups}
      className="label"
      getClassName={({ fieldState, confirmationAttempted, groupValidity }) => {
        if (
          !(fieldState.visited || fieldState.modified || confirmationAttempted)
        )
          return;
        if (
          fieldState.validity === Validity.Invalid ||
          groupValidity === Validity.Invalid
        ) {
          return 'invalidLabel';
        }
        return 'validLabel';
      }}
    >
      {children}
    </FieldLabel>
  );
}
