import React from 'react';
import { Input } from '../../../components';
import { FormWithOneField } from './form-with-one-field';
import { FormWithEmailField } from './form-with-email-field';
import { PasswordAndConfirmPassword } from './password-and-confirm-password';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Input> = {
  component: Input,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Input>;

export const OneField: Story = {
  render: () => {
    return <FormWithOneField />;
  },
};

export const OneEmailField: Story = {
  render: () => {
    return <FormWithEmailField />;
  },
};

export const Passwords: Story = {
  render: () => {
    return <PasswordAndConfirmPassword />;
  },
};
