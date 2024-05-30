import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useMessages, useUserInput } from '../../hooks';
import { Field, Group, StringValidators, Validity } from '../../model';

describe('useMessages()', () => {
  afterEach(cleanup);

  test(`It returns a React state variable which consists of an array containing 
  all of the messages of the entities it received. That value is updated 
  when the state of any of those entities changes.`, async () => {
    const password = new Field({
      name: 'password',
      defaultValue: 'password',
    });

    const confirmPassword = new Field({
      name: 'confirmPassword',
      defaultValue: '',
      validators: [
        StringValidators.required({
          invalidMessage: 'Please re-enter your password.',
        }),
      ],
    });

    const passwordGroup = new Group({
      name: 'passwordGroup',
      members: [password, confirmPassword],
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
    });

    const inputId = 'input';

    function ConfirmPasswordInput(): React.JSX.Element {
      const messages = useMessages(confirmPassword, passwordGroup);

      return (
        <>
          <input data-testid={inputId} {...useUserInput(confirmPassword)} />
          {messages.map((message, index) => {
            return (
              <span key={index} data-validity={message.validity}>
                {message.text}
              </span>
            );
          })}
        </>
      );
    }

    const user = userEvent.setup();
    render(<ConfirmPasswordInput />);

    const input = screen.getByTestId(inputId);
    const message = screen.queryByText('Please re-enter your password.');
    expect(message).toBeTruthy();
    expect(message!.getAttribute('data-validity')).toBe(Validity.Invalid);

    await user.type(input, 'password');
    await waitFor(() => {
      const message = screen.queryByText('The passwords match.');
      expect(message).toBeTruthy();
      expect(message?.getAttribute('data-validity')).toBe(Validity.Valid);
    });

    await user.clear(input);
    await user.type(input, 'wrong password');
    await waitFor(() => {
      const message = screen.queryByText(
        'Please ensure the re-entered password matches the password.',
      );
      expect(message).toBeTruthy();
      expect(message?.getAttribute('data-validity')).toBe(Validity.Invalid);
    });
  });
});
