import React, { useRef, type ReactNode } from 'react';
import {
  FormTemplate,
  Field,
  StringValidators,
  Group,
  FormFactory,
  Validity,
} from '../../../model';
import { Input } from '../../../components';
import './input.css';

class Template extends FormTemplate {
  public readonly name = 'passwordAndConfirmPassword';
  public readonly formElements = [
    new Field({
      name: 'password',
      defaultValue: '',
      validators: [
        StringValidators.includesLower({
          validMessage : 'Password includes a lowercase letter.',
          invalidMessage : 'Password must include a lowercase letter.'
        })
      ],
    }),
    new Field({
      name: 'confirmPassword',
      defaultValue: '',
      validators: [StringValidators.required()],
    }),
  ] as const;
  public readonly groups = [
    new Group({
      name: 'passwordGroup',
      members: this.formElements,
      validatorTemplates: [
        {
          predicate: ({ password, confirmPassword }): boolean =>
            password === confirmPassword,
        },
      ],
    }),
  ] as const;
}

const Form = FormFactory.createForm(Template);

export function PasswordAndConfirmPassword(): ReactNode {
  const formRef = useRef(new Form());
  return (
    <>
      <label className="label" htmlFor="password">
        Password
      </label>
      <Input
        form={formRef.current}
        fieldName={'password'}
        type="password"
        className="input"
        groupNames={['passwordGroup']}
        getClassName={({ fieldState, groupValidity }) => {
          if (
            !(
              (fieldState.visited || fieldState.modified) &&
              (fieldState.validity === Validity.Invalid ||
                groupValidity === Validity.Invalid)
            )
          )
            return;
          return 'inputInvalid';
        }}
      />
      <label className="label" htmlFor="confirmPassword">
        Confirm Password
      </label>
      <Input
        form={formRef.current}
        fieldName={'confirmPassword'}
        type="password"
        className="input"
        groupNames={['passwordGroup']}
        getClassName={({ fieldState, groupValidity }) => {
          if (
            !(
              (fieldState.visited || fieldState.modified) &&
              (fieldState.validity === Validity.Invalid ||
                groupValidity === Validity.Invalid)
            )
          )
            return;
          return 'inputInvalid';
        }}
      />
    </>
  );
}
