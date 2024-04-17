import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Field, FormTemplate, FormFactory } from '../model';
import { BooleanCheckbox, StringCheckbox } from '../components';
import { useForm } from '../hooks';

const meta: Meta<typeof BooleanCheckbox> = {
  component: BooleanCheckbox,
};

export default meta;

class Template extends FormTemplate {
  public readonly name = 'testForm';
  public readonly formElements = [
    new Field({
      name: 'isChecked',
      defaultValue: false,
    }),
    new Field({
      name: 'stringIsChecked',
      defaultValue: '',
    }),
  ] as const;
}

const Form = FormFactory.createForm(Template);

type Story = StoryObj<typeof BooleanCheckbox>;

function TestForm(): React.JSX.Element {
  const form = useForm(new Form());

  return (
    <>
      <BooleanCheckbox
        form={form}
        field={form.formElements.isChecked}
        labelContent={'Check me'}
      />
      <br />
      <StringCheckbox
        form={form}
        field={form.formElements.stringIsChecked}
        value="yes"
        labelContent={'Yes or empty string'}
      />
      <button
        onClick={() => {
          console.log(form.state);
        }}
      >
        Log Form State
      </button>
    </>
  );
}

export const Default: Story = {
  render: TestForm,
};
