import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useMultiPipe, useValue } from '../../hooks';
import { Field, Group, StringValidators, Validity } from '../../model';
import { ValidityUtils } from '../../model';

describe('useMultiPipe()', () => {
  afterEach(cleanup);

  test(`It returns a React state variable whose value is the result of calling 
  the transformRn it received with the states of the entities it received. That 
  value is updated whenever the state of any of those entities changes.`, async () => {
    const password = new Field({
      name: 'password',
      defaultValue: 'password',
    });

    const confirmPassword = new Field({
      name: 'confirmPassword',
      defaultValue: '',
      validators: [StringValidators.required()],
    });

    const passwordGroup = new Group({
      name: 'passwordGroup',
      members: [password, confirmPassword],
      validatorTemplates: [
        {
          predicate: ({ password, confirmPassword }): boolean => {
            return password === confirmPassword;
          },
        },
      ],
    });

    const inputId = 'input';

    function ConfirmPasswordInput(): React.JSX.Element {
      const validity = useMultiPipe(
        [confirmPassword, passwordGroup],
        states => {
          return ValidityUtils.reduceStatesToValidity(states, {
            pruneUnvalidatedGroupStates: true,
          });
        },
      );

      return (
        <input
          data-testid={inputId}
          value={useValue(confirmPassword)}
          onChange={e => {
            confirmPassword.setValue(e.target.value);
          }}
          data-validity={validity}
        />
      );
    }

    const user = userEvent.setup();
    render(<ConfirmPasswordInput />);

    const input = screen.getByTestId(inputId);
    expect(input.getAttribute('data-validity')).toBe(Validity.Invalid);

    await user.type(input, 'password');
    await waitFor(() =>
      expect(input.getAttribute('data-validity')).toBe(Validity.Valid),
    );

    await user.clear(input);
    await user.type(input, 'wrong password');
    await waitFor(() =>
      expect(input.getAttribute('data-validity')).toBe(Validity.Invalid),
    );
  });
});
