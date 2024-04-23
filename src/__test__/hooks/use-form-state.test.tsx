import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  FormTemplate,
  Field,
  Group,
  Adapter,
  FormFactory,
  StringValidators,
} from '../../model';
import { useFormState } from '../../hooks';
import { FFInput } from '../../components';

describe('useFormState()', () => {
  afterEach(cleanup);

  test(`It returns the state of a form, which is updated when the state of the
  form changes.`, async () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'firstName',
          defaultValue: '',
          validators: [StringValidators.required()],
          transient: true,
        }),
        new Field({
          name: 'lastName',
          defaultValue: '',
          validators: [StringValidators.required()],
          transient: true,
        }),
      ] as const;

      public readonly groups = [
        new Group({
          name: 'nameGroup',
          members: this.formElements,
        }),
      ] as const;

      public readonly adapters = [
        new Adapter({
          name: 'fullName',
          source: this.groups[0],
          adaptFn: ({ value }): string => {
            return `${value.firstName} ${value.lastName}`;
          },
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestComponent(): React.JSX.Element {
      const formState = useFormState(form);

      return (
        <>
          <FFInput
            form={form}
            field={form.formElements.firstName}
            type="text"
          />
          <FFInput form={form} field={form.formElements.lastName} type="text" />
          <p>{JSON.stringify(formState)}</p>
        </>
      );
    }

    const user = userEvent.setup();
    render(<TestComponent />);

    const initialState = JSON.stringify(form.state);
    expect(screen.queryByText(initialState)).not.toBeNull();

    const inputElements = document.getElementsByTagName('input');
    await user.type(inputElements[0], 'Pierre');
    await user.type(inputElements[1], 'Boulez');

    const updatedState = JSON.stringify(form.state);
    expect(updatedState).not.toBe(initialState);

    await waitFor(() =>
      expect(screen.queryByText(updatedState)).not.toBeNull(),
    );
    expect(screen.queryByText(initialState)).toBeNull();
  });
});
