import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useValue } from '../../hooks';
import { Field } from '../../model';

describe('useValue()', () => {
  afterEach(cleanup);

  test(`It returns a React state variable whose value is synchronized with 
  that of the entity it received.`, async () => {
    const field = new Field({
      name: 'testField',
      defaultValue: '',
    });

    const inputId = 'input';

    function Input(): React.JSX.Element {
      return (
        <input
          value={useValue(field)}
          onChange={e => {
            field.setValue(e.target.value);
          }}
          data-testid={inputId}
        />
      );
    }

    const user = userEvent.setup();
    render(<Input />);

    const input = screen.getByTestId(inputId) as HTMLInputElement;
    expect(input.value).toBe('');

    await user.click(input);
    await user.type(input, 'test');
    await waitFor(() => expect(input.value).toBe('test'));
    expect(field.state.value).toBe('test');
  });
});
