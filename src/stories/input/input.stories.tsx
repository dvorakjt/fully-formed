import React, { useRef, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Field,
  FormTemplate,
  FormFactory,
  StringValidators,
  Validity,
  Group,
} from '../../model';
import { Input } from '../../components';
import './input.css';

const meta: Meta<typeof Input> = {
  component: Input,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Input>;

class TemplateWithOneField extends FormTemplate {
  public readonly name = 'formWithOneField';
  public readonly formElements = [
    new Field({ name: 'firstName', defaultValue: '' }),
  ];
}

const FormWithOneField = FormFactory.createForm(TemplateWithOneField);

function FormWithOneFieldComponent(): ReactNode {
  const formRef = useRef(new FormWithOneField());
  return (
    <>
      <label className="label" htmlFor="firstName">
        First Name
      </label>
      <Input
        form={formRef.current}
        fieldName={'firstName'}
        type="text"
        className="input"
      />
    </>
  );
}

export const OneField: Story = {
  render: () => {
    return <FormWithOneFieldComponent />;
  },
};

class TemplateWithOneEmailField extends FormTemplate {
  public readonly name = 'formWithOneEmailField';
  public readonly formElements = [
    new Field({
      name: 'email',
      defaultValue: '',
      validators: [StringValidators.email()],
    }),
  ];
}

const FormWithOneEmailField = FormFactory.createForm(TemplateWithOneEmailField);

function FormWithOneEmailFieldComponent(): ReactNode {
  const formRef = useRef(new FormWithOneEmailField());
  return (
    <>
      <label className="label" htmlFor="email">
        Email
      </label>
      <Input
        form={formRef.current}
        fieldName={'email'}
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

export const OneEmailField: Story = {
  render: () => {
    return <FormWithOneEmailFieldComponent />;
  },
};

class PasswordAndConfirmPasswordTemplate extends FormTemplate {
  public readonly name = 'passwordAndConfirmPassword';
  public readonly formElements = [
    new Field({
      name: 'password',
      defaultValue: '',
      validators: [StringValidators.required()],
    }),
    new Field({
      name: 'confirmPassword',
      defaultValue: '',
      validators: [StringValidators.required()],
    }),
  ];
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
  ];
}

const PasswordAndConfirmPasswordForm = FormFactory.createForm(
  PasswordAndConfirmPasswordTemplate,
);

function PasswordAndConfirmPasswordComponent(): ReactNode {
  const formRef = useRef(new PasswordAndConfirmPasswordForm());
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

export const PasswordAndConfirmPassword: Story = {
  render: () => {
    return <PasswordAndConfirmPasswordComponent />;
  },
};
