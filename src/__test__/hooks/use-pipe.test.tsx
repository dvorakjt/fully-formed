import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { usePipe, useValue } from '../../hooks';
import { Field, StringValidators, Validity } from '../../model';

describe('usePipe()', () => {
  afterEach(cleanup);

  test(`It returns a React state variable whose value is the result of calling 
  the transformFn it received with the state of the entity it received. The 
  value of this variable is updated when the state of the entity changes.`, async () => {
    const requiredField = new Field({
      name: 'field',
      defaultValue: '',
      validators: [StringValidators.required()],
    });

    const inputId = 'input';

    function Input(): React.JSX.Element {
      const className = usePipe(requiredField, ({ validity }) => {
        switch (validity) {
          case Validity.Invalid:
            return 'invalidInput';
          case Validity.Pending:
            return 'pendingInput';
          default:
            return 'validInput';
        }
      });

      return (
        <input
          data-testid={inputId}
          className={className}
          value={useValue(requiredField)}
          onChange={e => {
            requiredField.setValue(e.target.value);
          }}
        />
      );
    }

    const user = userEvent.setup();
    render(<Input />);

    const input = screen.getByTestId(inputId);
    expect(input.className).toBe('invalidInput');

    await user.click(input);
    await user.type(input, 'test');
    await waitFor(() => expect(input.className).toBe('validInput'));
  });
});
