import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import {
  FormTemplate,
  Field,
  StringValidators,
  FormFactory,
} from '../../../model';
import { FFRadio, FFRadioGroup } from '../../../components';
import { useForm } from '../../../hooks';

describe('FFRadioGroup', () => {
  afterEach(cleanup);

  test('It renders a fieldset element.', () => {
    class Template extends FormTemplate {
      public readonly name = 'myFormTemplate';
      public readonly formElements = [
        new Field({
          name: 'testField',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestComponent(): React.JSX.Element {
      const form = useForm(new Form());

      return <FFRadioGroup form={form} field={form.formElements.testField} />;
    }

    render(<TestComponent />);

    const fieldsets = document.getElementsByTagName('fieldset');
    expect(fieldsets.length).toBe(1);
  });

  test('It renders child components inside the fieldset element.', () => {
    class Template extends FormTemplate {
      public readonly name = 'myFormTemplate';
      public readonly formElements = [
        new Field<'favoriteColor', 'red' | 'green' | 'blue', false>({
          name: 'favoriteColor',
          defaultValue: 'red',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestComponent(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFRadioGroup
          form={form}
          field={form.formElements.favoriteColor}
          className="radio-group"
        >
          <FFRadio
            form={form}
            field={form.formElements.favoriteColor}
            value="red"
            labelContent="Red"
          />
          <FFRadio
            form={form}
            field={form.formElements.favoriteColor}
            value="green"
            labelContent="Green"
          />
          <FFRadio
            form={form}
            field={form.formElements.favoriteColor}
            value="blue"
            labelContent="Blue"
          />
        </FFRadioGroup>
      );
    }

    render(<TestComponent />);

    const fieldset = document.getElementsByTagName('fieldset')[0];
    const containers = fieldset.children;
    expect(containers.length).toBe(3);

    for (const container of containers) {
      expect(container.children.length).toBe(2);
      expect(container.children[0].nodeName).toBe('INPUT');
      expect(container.children[1].nodeName).toBe('LABEL');
    }
  });
});
