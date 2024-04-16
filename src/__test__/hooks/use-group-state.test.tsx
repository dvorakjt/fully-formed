import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormTemplate, Field, Group, FormFactory } from '../../model';
import { useGroupState } from '../../hooks';
import { Input } from '../../components';

describe('useGroupState()', () => {
  afterEach(cleanup);

  test(`It returns the state of a group, which is updated when the state of the
  group changes.`, async () => {
    class Template extends FormTemplate {
      public readonly name = 'testForm';
      public readonly formElements = [
        new Field({
          name: 'password',
          defaultValue: 'password',
        }),
        new Field({
          name: 'confirmPassword',
          defaultValue: '',
        }),
      ] as const;

      public readonly groups = [
        new Group({
          name: 'passwordGroup',
          members: this.formElements,
          validatorTemplates: [
            {
              predicate: ({ password, confirmPassword }): boolean => {
                return password === confirmPassword;
              },
              invalidMessage:
                'Please ensure the re-entered password matches the password.',
              validMessage: 'The passwords match.',
            },
          ],
        }),
      ] as const;
    }

    const Form = FormFactory.createForm(Template);
    const form = new Form();

    function TestComponent(): React.ReactNode {
      const groupState = useGroupState(form.groups.passwordGroup);

      return (
        <>
          <Input
            form={form}
            field={form.formElements.confirmPassword}
            type="password"
          />
          <p>{JSON.stringify(groupState)}</p>
        </>
      );
    }

    const user = userEvent.setup();
    render(<TestComponent />);

    const initialState = JSON.stringify(form.groups.passwordGroup.state);
    expect(screen.queryByText(initialState)).not.toBeNull();

    const confirmPassword = document.getElementsByTagName('input')[0];
    await user.type(confirmPassword, 'password');

    const updatedState = JSON.stringify(form.groups.passwordGroup.state);
    expect(updatedState).not.toBe(initialState);

    await waitFor(() =>
      expect(screen.queryByText(updatedState)).not.toBeNull(),
    );
    expect(screen.queryByText(initialState)).toBeNull();
  });
});
