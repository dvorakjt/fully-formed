import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FormTemplate, Field, StringValidators, FormFactory } from '../model';
import { FieldMessages, Radio, RadioGroup } from '../components';
import { useForm } from '../hooks';

const meta: Meta<typeof RadioGroup> = {
  component: RadioGroup,
};

export default meta;

type Story = StoryObj<typeof RadioGroup>;

class Template extends FormTemplate {
  public readonly name = 'testForm';
  public readonly formElements = [
    new Field({
      name: 'favoriteFood',
      defaultValue: '',
      validators: [
        StringValidators.required({
          invalidMessage: 'Please enter your favorite food.',
        }),
      ],
    }),
  ] as const;
}

const Form = FormFactory.createForm(Template);

function TestForm(): React.JSX.Element {
  const form = useForm(new Form());

  return (
    <form>
      <RadioGroup
        form={form}
        field={form.formElements.favoriteFood}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <legend>Please select your favorite food:</legend>
        <Radio
          form={form}
          field={form.formElements.favoriteFood}
          value="pizza"
          labelContent="Pizza!"
        />
        <Radio
          form={form}
          field={form.formElements.favoriteFood}
          value="tofu"
          labelContent="Tofu!"
        />
        <Radio
          form={form}
          field={form.formElements.favoriteFood}
          value="ice cream"
          labelContent="Ice Cream!"
        />
      </RadioGroup>
      <FieldMessages form={form} field={form.formElements.favoriteFood} />
      <button
        onClick={e => {
          e.preventDefault();
          console.log(form.state);
        }}
      >
        Log Form State
      </button>
    </form>
  );
}

export const Default: Story = {
  render: TestForm,
};
