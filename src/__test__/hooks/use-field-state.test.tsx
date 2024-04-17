import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import {
  FormTemplate,
  Field,
  StringValidators,
  FormFactory,
} from '../../model';
import { useFieldState } from '../../hooks';

describe('useFieldState()', () => {
  afterEach(cleanup);

  test(`It returns the state of a field, which is updated when the state of the
  field changes.`, async () => {
    const invalidMessage = 'Please enter a valid email.';
    const validMessage = 'Email is valid.';

    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'email',
          defaultValue: '',
          validators: [
            StringValidators.email({
              invalidMessage,
              validMessage,
            }),
          ],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestComponent(): React.JSX.Element {
      const fieldState = useFieldState(form.formElements.email);

      return <p>{JSON.stringify(fieldState)}</p>;
    }

    render(<TestComponent />);
    const initialState = JSON.stringify(form.formElements.email.state);
    expect(screen.queryByText(initialState)).not.toBeNull();

    form.formElements.email.setValue('user@example.com');
    const updatedState = JSON.stringify(form.formElements.email.state);
    expect(updatedState).not.toBe(initialState);
    await waitFor(() =>
      expect(screen.queryByText(updatedState)).not.toBeNull(),
    );
  });
});
