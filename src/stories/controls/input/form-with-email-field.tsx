import React, { useRef, type ReactNode } from 'react';
import {
  FormTemplate,
  Field,
  StringValidators,
  FormFactory,
  Validity,
} from '../../../model';
import { Input } from '../../../components';
import './input.css';

class Template extends FormTemplate {
  public readonly name = 'formWithOneEmailField';
  public readonly formElements = [
    new Field({
      name: 'email',
      defaultValue: '',
      validators: [StringValidators.email()],
    }),
  ];
}

const Form = FormFactory.createForm(Template);

export function FormWithEmailField(): ReactNode {
  const formRef = useRef(new Form());
  return (
    <>
      <label className="label" htmlFor="email">
        Email
      </label>
      <Input
        form={formRef.current}
        fieldName="email"
        type="email"
        className="input"
        getClassName={({ fieldState }) => {
          if (
            !(
              (fieldState.visited || fieldState.modified) &&
              fieldState.validity === Validity.Invalid
            )
          )
            return;
          return 'inputInvalid';
        }}
      />
    </>
  );
}
