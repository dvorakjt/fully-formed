import React from 'react';
import {
  FormTemplate,
  Field,
  StringValidators,
  Group,
  FormFactory,
} from '../model';
import { useForm } from '../hooks';
import { StyledLabel, StyledInput, StyledMessages } from './styled-components';
import type { Meta, StoryObj } from '@storybook/react';

class Template extends FormTemplate {
  public readonly name = 'signUpForm';
  public readonly formElements = [
    new Field({
      name: 'email',
      defaultValue: '',
      validators: [
        StringValidators.email({
          invalidMessage: 'Please enter a valid email address.',
          trimBeforeValidation: true,
        }),
      ],
    }),
    new Field({
      name: 'nickname',
      defaultValue: '',
    }),
    new Field({
      name: 'password',
      defaultValue: '',
      validators: [
        StringValidators.includesLower({
          invalidMessage: 'Password must include a lowercase letter.',
          validMessage: 'Password includes a lowercase letter.',
        }),
        StringValidators.includesUpper({
          invalidMessage: 'Password must include an uppercase letter.',
          validMessage: 'Password includes an uppercase letter.',
        }),
        StringValidators.includesDigit({
          invalidMessage: 'Password must include a digit.',
          validMessage: 'Password includes a digit.',
        }),
        StringValidators.includesSymbol({
          invalidMessage: 'Password must include a symbol.',
          validMessage: 'Password includes a symbol.',
        }),
      ],
    }),
    new Field({
      name: 'confirmPassword',
      defaultValue: '',
      validators: [
        StringValidators.required({
          invalidMessage: 'Please re-enter your password.',
        }),
      ],
      transient: true,
    }),
  ] as const;

  public readonly groups = [
    new Group({
      name: 'passwordGroup',
      members: [this.formElements[2], this.formElements[3]],
      validatorTemplates: [
        {
          predicate: ({ password, confirmPassword }): boolean => {
            return password === confirmPassword;
          },
          invalidMessage:
            'Please ensure that the re-entered password matches the password.',
          validMessage: 'The passwords match.',
        },
      ],
    }),
  ] as const;

  public readonly autoTrim = {
    include: ['email', 'nickname'],
  };
}
const Form = FormFactory.createForm(Template);

function SignUpForm(): React.JSX.Element {
  const form = useForm(new Form());

  return (
    <form>
      <StyledLabel form={form} field={form.formElements.email}>
        Email
      </StyledLabel>
      <StyledInput
        form={form}
        field={form.formElements.email}
        type="email"
        aria-required={true}
        placeholder="user@example.com"
      />
      <StyledMessages form={form} field={form.formElements.email} />

      <StyledLabel form={form} field={form.formElements.nickname}>
        Nickname
      </StyledLabel>
      <StyledInput form={form} field={form.formElements.nickname} type="text" />
      <StyledMessages form={form} field={form.formElements.nickname} />

      <StyledLabel form={form} field={form.formElements.password}>
        Password
      </StyledLabel>
      <StyledInput
        form={form}
        field={form.formElements.password}
        type="password"
        aria-required={true}
      />
      <StyledMessages form={form} field={form.formElements.password} />

      <StyledLabel
        form={form}
        field={form.formElements.confirmPassword}
        groups={[form.groups.passwordGroup]}
      >
        Re-enter Password
      </StyledLabel>
      <StyledInput
        form={form}
        field={form.formElements.confirmPassword}
        groups={[form.groups.passwordGroup]}
        type="password"
        aria-required={true}
      />
      <StyledMessages
        form={form}
        field={form.formElements.confirmPassword}
        groups={[form.groups.passwordGroup]}
      />

      <button
        onClick={e => {
          e.preventDefault();
          form.confirm({
            onSuccess: data => {
              console.log(data);
            },
          });
        }}
      >
        Submit
      </button>
    </form>
  );
}

const meta: Meta<typeof SignUpForm> = {
  component: SignUpForm,
};

export default meta;

type Story = StoryObj<typeof SignUpForm>;

export const Default: Story = {
  render: SignUpForm,
};
