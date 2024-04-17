import React from 'react';
import { Input, type InputProps } from '../../../components/controls/input';
import {
  Validity,
  type AnyForm,
  type AnyStringTypeField,
  type ChildOfForm,
} from '../../../model';
import './styles.css';

type StyledInputProps<
  Form extends AnyForm,
  Field extends AnyStringTypeField & ChildOfForm<Form>,
> = Omit<
  InputProps<Form, Field>,
  'className' | 'getClassName' | 'style' | 'getStyle'
>;

export function StyledInput<
  Form extends AnyForm,
  Field extends AnyStringTypeField & ChildOfForm<Form>,
>(props: StyledInputProps<Form, Field>): React.JSX.Element {
  return (
    <Input
      {...props}
      className="input"
      getClassName={({ fieldState, confirmationAttempted, groupValidity }) => {
        if (
          !(fieldState.visited || fieldState.modified || confirmationAttempted)
        )
          return;
        if (
          fieldState.validity === Validity.Invalid ||
          groupValidity === Validity.Invalid
        ) {
          return 'invalidInput';
        }
        return 'validInput';
      }}
    />
  );
}
