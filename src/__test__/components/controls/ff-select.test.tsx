import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormTemplate, Field, FormFactory } from '../../../model';
import { FFSelect } from '../../../components';
import { useForm } from '../../../hooks';

describe('FFSelect', () => {
  afterEach(cleanup);

  test('It renders an HTML select element.', () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'favoriteIceCream',
          defaultValue: '',
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);

    function TestComponent(): React.JSX.Element {
      const form = useForm(new Form());

      return (
        <FFSelect
          form={form}
          field={form.formElements.favoriteIceCream}
          options={[
            {
              value: 'vanilla',
              text: 'Vanilla',
            },
            {
              value: 'chocolate',
              text: 'Chocolate',
            },
            {
              value: 'strawberry',
              text: 'Strawberry',
            },
          ]}
        />
      );
    }

    render(<TestComponent />);

    const selectElements = document.getElementsByTagName('select');
    expect(selectElements.length).toBe(1);
  });
});
