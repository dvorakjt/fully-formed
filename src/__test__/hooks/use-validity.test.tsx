import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useValidity, useValue } from '../../hooks';
import { Field, StringValidators, Validity } from '../../model';

describe('useValidity()', () => {
  afterEach(cleanup);

  test(`It returns a React state variable of type Validity which is updated 
  when the validity of the entity it received changes.`, async () => {
    const requiredField = new Field({
      name: 'requiredField',
      defaultValue: '',
      validators: [StringValidators.required()],
    });

    const inputId = 'input';

    function Input(): React.JSX.Element {
      return (
        <input
          data-testid={inputId}
          data-validity={useValidity(requiredField)}
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
    expect(input.getAttribute('data-validity')).toBe(Validity.Invalid);

    await user.click(input);
    await user.type(input, 'test');
    waitFor(() => {
      expect(input.getAttribute('data-validity')).toBe(Validity.Valid);
    });
  });
});
